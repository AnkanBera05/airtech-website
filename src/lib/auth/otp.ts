import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const MAX_VERIFICATION_ATTEMPTS = 3;

export interface OTPChallengeResult {
  success: boolean;
  challengeId?: string;
  resendAvailableAt?: string;
  error?: string;
}

export interface OTPVerificationResult {
  success: boolean;
  userId?: string;
  userRole?: string;
  error?: string;
}

/**
 * Hash the 6-digit OTP using SHA-256 with an email-specific salt
 */
function hashOtp(otp: string, email: string): string {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY || "airtech-secure-salt-2026";
  return crypto
    .createHmac("sha256", salt)
    .update(`${email.toLowerCase()}:${otp}`)
    .digest("hex");
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export function generateSecureOtp(): string {
  // Use crypto.randomInt for uniform distribution between 100000 and 999999
  const otpNumber = crypto.randomInt(100000, 1000000);
  return otpNumber.toString();
}

/**
 * Creates a new OTP challenge in the database
 */
export async function createOtpChallenge(
  userId: string,
  email: string,
  purpose: "login_2fa" | "password_reset" = "login_2fa",
  ipAddress?: string,
  userAgent?: string
): Promise<{ otp: string; challengeId: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  
  // 1. Invalidate any existing active challenges for this user/email to prevent replay
  await supabaseAdmin
    .from("auth_otp_challenges")
    .update({ is_used: true })
    .eq("email", normalizedEmail)
    .eq("is_used", false);

  // 2. Generate 6-digit OTP and secure hash
  const rawOtp = generateSecureOtp();
  const hashedOtp = hashOtp(rawOtp, normalizedEmail);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();
  const resendAvailableAt = new Date(now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000).toISOString();

  // 3. Insert challenge record (OTP itself is NEVER saved in plaintext)
  const { data, error } = await supabaseAdmin
    .from("auth_otp_challenges")
    .insert({
      user_id: userId,
      email: normalizedEmail,
      otp_hash: hashedOtp,
      purpose,
      max_attempts: MAX_VERIFICATION_ATTEMPTS,
      attempts_count: 0,
      is_used: false,
      expires_at: expiresAt,
      resend_available_at: resendAvailableAt,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create security OTP challenge: ${error?.message || "Unknown error"}`);
  }

  return { otp: rawOtp, challengeId: data.id };
}

/**
 * Verifies a supplied 6-digit OTP against an active challenge
 */
export async function verifyOtpChallenge(
  email: string,
  suppliedOtp: string,
  purpose: "login_2fa" | "password_reset" = "login_2fa"
): Promise<OTPVerificationResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const sanitizedOtp = suppliedOtp.trim();

  if (!/^\d{6}$/.test(sanitizedOtp)) {
    return { success: false, error: "OTP must be a valid 6-digit code." };
  }

  // 1. Fetch latest active challenge for this email & purpose
  const { data: challenge, error } = await supabaseAdmin
    .from("auth_otp_challenges")
    .select("*")
    .eq("email", normalizedEmail)
    .eq("purpose", purpose)
    .eq("is_used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !challenge) {
    return { success: false, error: "Invalid or expired OTP session. Please request a new code." };
  }

  // 2. Check Expiry
  const now = new Date();
  const expiresAt = new Date(challenge.expires_at);
  if (now > expiresAt) {
    await supabaseAdmin
      .from("auth_otp_challenges")
      .update({ is_used: true })
      .eq("id", challenge.id);
    return { success: false, error: "This OTP has expired. Please request a new one." };
  }

  // 3. Check Attempt Limits
  if (challenge.attempts_count >= challenge.max_attempts) {
    await supabaseAdmin
      .from("auth_otp_challenges")
      .update({ is_used: true })
      .eq("id", challenge.id);
    return {
      success: false,
      error: "Maximum verification attempts exceeded. For your security, this challenge is invalidated.",
    };
  }

  // 4. Verify Hash (constant-time comparison)
  const candidateHash = hashOtp(sanitizedOtp, normalizedEmail);
  const isValid = crypto.timingSafeEqual(
    Buffer.from(candidateHash),
    Buffer.from(challenge.otp_hash)
  );

  if (!isValid) {
    // Increment attempts count
    await supabaseAdmin
      .from("auth_otp_challenges")
      .update({ attempts_count: challenge.attempts_count + 1 })
      .eq("id", challenge.id);

    const remaining = challenge.max_attempts - (challenge.attempts_count + 1);
    return {
      success: false,
      error: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : "Challenge invalidated."}`,
    };
  }

  // 5. Successful Verification: Burn the challenge immediately (single-use)
  await supabaseAdmin
    .from("auth_otp_challenges")
    .update({ is_used: true })
    .eq("id", challenge.id);

  // 6. Fetch user profile for role-based authorization
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role, status")
    .eq("id", challenge.user_id)
    .single();

  if (profile?.status === "suspended" || profile?.status === "revoked") {
    return { success: false, error: "Your account has been suspended or revoked. Please contact administrator." };
  }

  return {
    success: true,
    userId: challenge.user_id,
    userRole: profile?.role || "client",
  };
}
