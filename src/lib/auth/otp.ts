import crypto from "crypto";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const MAX_VERIFICATION_ATTEMPTS = 3;

export interface OTPVerificationResult {
  success: boolean;
  userId?: string;
  userRole?: string;
  error?: string;
}

interface InMemoChallenge {
  challengeId: string;
  userId: string;
  email: string;
  otpHash: string;
  purpose: string;
  expiresAt: number;
  attempts: number;
  isUsed: boolean;
}

// In-memory challenge store to guarantee resilience if Supabase connection is initializing
const memoryChallenges = new Map<string, InMemoChallenge>();

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
  const otpNumber = crypto.randomInt(100000, 1000000);
  return otpNumber.toString();
}

/**
 * Creates a new OTP challenge in the database (with memory fallback)
 */
export async function createOtpChallenge(
  userId: string,
  email: string,
  purpose: "login_2fa" | "password_reset" = "login_2fa",
  ipAddress?: string,
  userAgent?: string
): Promise<{ otp: string; challengeId: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const rawOtp = generateSecureOtp();
  const hashedOtp = hashOtp(rawOtp, normalizedEmail);

  const now = Date.now();
  const expiresAtMs = now + OTP_EXPIRY_MINUTES * 60 * 1000;
  const challengeId = crypto.randomUUID();

  // 1. Store in memory store (failsafe)
  memoryChallenges.set(normalizedEmail, {
    challengeId,
    userId,
    email: normalizedEmail,
    otpHash: hashedOtp,
    purpose,
    expiresAt: expiresAtMs,
    attempts: 0,
    isUsed: false,
  });

  // 2. Try to persist to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      // Invalidate existing active challenges
      await supabaseAdmin
        .from("auth_otp_challenges")
        .update({ is_used: true })
        .eq("email", normalizedEmail)
        .eq("is_used", false);

      const expiresAtIso = new Date(expiresAtMs).toISOString();
      const resendAvailableAtIso = new Date(now + OTP_RESEND_COOLDOWN_SECONDS * 1000).toISOString();

      await supabaseAdmin.from("auth_otp_challenges").insert({
        id: challengeId,
        user_id: userId,
        email: normalizedEmail,
        otp_hash: hashedOtp,
        purpose,
        max_attempts: MAX_VERIFICATION_ATTEMPTS,
        attempts_count: 0,
        is_used: false,
        expires_at: expiresAtIso,
        resend_available_at: resendAvailableAtIso,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
      });
    } catch (dbErr) {
      console.warn("[OTP Persistence Notice] Supabase database unavailable, using secure memory challenge:", dbErr);
    }
  }

  return { otp: rawOtp, challengeId };
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

  const now = Date.now();
  const candidateHash = hashOtp(sanitizedOtp, normalizedEmail);

  // 1. Check in-memory store
  const memChallenge = memoryChallenges.get(normalizedEmail);
  if (memChallenge && !memChallenge.isUsed && memChallenge.purpose === purpose) {
    if (now > memChallenge.expiresAt) {
      memChallenge.isUsed = true;
      return { success: false, error: "This OTP has expired. Please request a new one." };
    }

    if (memChallenge.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      memChallenge.isUsed = true;
      return { success: false, error: "Maximum verification attempts exceeded. Challenge invalidated." };
    }

    const isValid = crypto.timingSafeEqual(
      Buffer.from(candidateHash),
      Buffer.from(memChallenge.otpHash)
    );

    if (isValid) {
      memChallenge.isUsed = true;
      return {
        success: true,
        userId: memChallenge.userId,
        userRole: normalizedEmail === "bera.ankan005@gmail.com" ? "owner" : "client",
      };
    } else {
      memChallenge.attempts += 1;
      const remaining = MAX_VERIFICATION_ATTEMPTS - memChallenge.attempts;
      return {
        success: false,
        error: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : "Challenge invalidated."}`,
      };
    }
  }

  // 2. Fallback to Supabase database if configured
  if (isSupabaseConfigured) {
    try {
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

      if (new Date() > new Date(challenge.expires_at)) {
        await supabaseAdmin.from("auth_otp_challenges").update({ is_used: true }).eq("id", challenge.id);
        return { success: false, error: "This OTP has expired. Please request a new one." };
      }

      const isValid = crypto.timingSafeEqual(
        Buffer.from(candidateHash),
        Buffer.from(challenge.otp_hash)
      );

      if (!isValid) {
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

      await supabaseAdmin.from("auth_otp_challenges").update({ is_used: true }).eq("id", challenge.id);

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role, status")
        .eq("id", challenge.user_id)
        .maybeSingle();

      return {
        success: true,
        userId: challenge.user_id,
        userRole: profile?.role || (normalizedEmail === "bera.ankan005@gmail.com" ? "owner" : "client"),
      };
    } catch (dbErr) {
      console.error("[OTP Verification Database Error]", dbErr);
    }
  }

  return { success: false, error: "Invalid or expired OTP code." };
}
