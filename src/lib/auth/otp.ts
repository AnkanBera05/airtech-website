import crypto from "crypto";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export const OTP_EXPIRY_MINUTES = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const MAX_VERIFICATION_ATTEMPTS = 3;
export const MAX_REQUESTS_PER_WINDOW = 5;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export type OtpPurpose = "login_2fa" | "password_reset" | "registration";

export interface OTPVerificationResult {
  success: boolean;
  userId?: string;
  userRole?: string;
  error?: string;
  remainingAttempts?: number;
}

export interface InMemoChallenge {
  challengeId: string;
  userId: string;
  email: string;
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: number;
  resendAvailableAt: number;
  attempts: number;
  isUsed: boolean;
}

interface RateLimitTracker {
  timestamps: number[];
}

// In-memory challenge store to guarantee resilience
const memoryChallenges = new Map<string, InMemoChallenge>();
// Rate limit tracker per normalized email
const rateLimitMap = new Map<string, RateLimitTracker>();

/**
 * Hash the 6-digit OTP using HMAC-SHA256 with a secure server-side salt
 */
function hashOtp(otp: string, email: string): string {
  const salt =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.BREVO_API_KEY ||
    "airtech-production-salt-2026-mepeur";
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
 * Helper to check and record rate limits for OTP generation
 */
export function checkOtpRateLimit(email: string): { allowed: boolean; retryAfterSeconds?: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();
  let tracker = rateLimitMap.get(normalizedEmail);

  if (!tracker) {
    tracker = { timestamps: [] };
    rateLimitMap.set(normalizedEmail, tracker);
  }

  // Filter timestamps within the rolling window
  tracker.timestamps = tracker.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (tracker.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = tracker.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true };
}

/**
 * Check if the email has an active cooldown before allowing a new OTP request
 */
export function checkOtpCooldown(
  email: string,
  purpose: OtpPurpose = "login_2fa"
): { inCooldown: boolean; secondsRemaining: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const key = `${normalizedEmail}:${purpose}`;
  const existing = memoryChallenges.get(key);
  const now = Date.now();

  if (existing && !existing.isUsed && now < existing.resendAvailableAt) {
    const secondsRemaining = Math.ceil((existing.resendAvailableAt - now) / 1000);
    return { inCooldown: true, secondsRemaining };
  }

  return { inCooldown: false, secondsRemaining: 0 };
}

/**
 * Creates a new OTP challenge in the database with memory fallback
 */
export async function createOtpChallenge(
  userId: string,
  email: string,
  purpose: OtpPurpose = "login_2fa",
  ipAddress?: string,
  userAgent?: string
): Promise<{ otp: string; challengeId: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Enforce Rate Limiting
  const rateLimit = checkOtpRateLimit(normalizedEmail);
  if (!rateLimit.allowed) {
    throw new Error(
      `Rate limit exceeded. Too many verification codes requested. Please try again in ${Math.ceil((rateLimit.retryAfterSeconds || 60) / 60)} minutes.`
    );
  }

  // 2. Enforce 60-second Resend Cooldown
  const cooldown = checkOtpCooldown(normalizedEmail, purpose);
  if (cooldown.inCooldown) {
    throw new Error(
      `Please wait ${cooldown.secondsRemaining} seconds before requesting a new verification code.`
    );
  }

  const rawOtp = generateSecureOtp();
  const hashedOtp = hashOtp(rawOtp, normalizedEmail);

  const now = Date.now();
  const expiresAtMs = now + OTP_EXPIRY_MINUTES * 60 * 1000;
  const resendAvailableAtMs = now + OTP_RESEND_COOLDOWN_SECONDS * 1000;
  const challengeId = crypto.randomUUID();

  // Record timestamp for rate limit tracking
  const tracker = rateLimitMap.get(normalizedEmail) || { timestamps: [] };
  tracker.timestamps.push(now);
  rateLimitMap.set(normalizedEmail, tracker);

  // 3. Invalidate previous active challenge in memory
  const storeKey = `${normalizedEmail}:${purpose}`;
  const previous = memoryChallenges.get(storeKey);
  if (previous) {
    previous.isUsed = true;
  }

  // Store new active challenge
  memoryChallenges.set(storeKey, {
    challengeId,
    userId,
    email: normalizedEmail,
    otpHash: hashedOtp,
    purpose,
    expiresAt: expiresAtMs,
    resendAvailableAt: resendAvailableAtMs,
    attempts: 0,
    isUsed: false,
  });

  // 4. Invalidate and store in Supabase if configured
  if (isSupabaseConfigured) {
    try {
      await supabaseAdmin
        .from("auth_otp_challenges")
        .update({ is_used: true })
        .eq("email", normalizedEmail)
        .eq("purpose", purpose)
        .eq("is_used", false);

      const expiresAtIso = new Date(expiresAtMs).toISOString();
      const resendAvailableAtIso = new Date(resendAvailableAtMs).toISOString();

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
      console.warn(
        "[OTP Persistence Notice] Supabase database unavailable, using secure memory challenge:",
        dbErr
      );
    }
  }

  return { otp: rawOtp, challengeId };
}

/**
 * Verifies a supplied 6-digit OTP against an active challenge
 * - Invalidates on success (One-time usage)
 * - Invalidates on expiration (5 minutes)
 * - Invalidates on exceeding max attempts (3 attempts)
 * - Timing-safe comparison to prevent side-channel timing attacks
 */
export async function verifyOtpChallenge(
  email: string,
  suppliedOtp: string,
  purpose: OtpPurpose = "login_2fa"
): Promise<OTPVerificationResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const sanitizedOtp = suppliedOtp.trim();

  if (!/^\d{6}$/.test(sanitizedOtp)) {
    return { success: false, error: "OTP must be a valid 6-digit numeric code." };
  }

  const now = Date.now();
  const candidateHash = hashOtp(sanitizedOtp, normalizedEmail);
  const storeKey = `${normalizedEmail}:${purpose}`;

  // 1. Check in-memory store
  const memChallenge = memoryChallenges.get(storeKey);
  if (memChallenge && !memChallenge.isUsed && memChallenge.purpose === purpose) {
    // Check Expiration
    if (now > memChallenge.expiresAt) {
      memChallenge.isUsed = true;
      return { success: false, error: "This verification code has expired. Please request a new one." };
    }

    // Check Max Attempts
    if (memChallenge.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      memChallenge.isUsed = true;
      return {
        success: false,
        error: "Maximum verification attempts exceeded. For your security, this code has been invalidated.",
      };
    }

    const isValid = crypto.timingSafeEqual(
      Buffer.from(candidateHash),
      Buffer.from(memChallenge.otpHash)
    );

    if (isValid) {
      // Mark as used IMMEDIATELY to prevent replay attacks
      memChallenge.isUsed = true;
      return {
        success: true,
        userId: memChallenge.userId,
        userRole: normalizedEmail === "bera.ankan005@gmail.com" ? "owner" : "client",
      };
    } else {
      memChallenge.attempts += 1;
      const remaining = MAX_VERIFICATION_ATTEMPTS - memChallenge.attempts;
      if (remaining <= 0) {
        memChallenge.isUsed = true;
        return {
          success: false,
          error: "Maximum verification attempts exceeded. This code has been invalidated.",
          remainingAttempts: 0,
        };
      }
      return {
        success: false,
        error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
        remainingAttempts: remaining,
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
        .maybeSingle();

      if (error || !challenge) {
        return {
          success: false,
          error: "No active verification challenge found. Please request a new verification code.",
        };
      }

      if (new Date() > new Date(challenge.expires_at)) {
        await supabaseAdmin
          .from("auth_otp_challenges")
          .update({ is_used: true })
          .eq("id", challenge.id);
        return { success: false, error: "This verification code has expired. Please request a new one." };
      }

      const isValid = crypto.timingSafeEqual(
        Buffer.from(candidateHash),
        Buffer.from(challenge.otp_hash)
      );

      if (!isValid) {
        const nextAttempts = (challenge.attempts_count || 0) + 1;
        const maxAttempts = challenge.max_attempts || MAX_VERIFICATION_ATTEMPTS;
        const remaining = maxAttempts - nextAttempts;

        await supabaseAdmin
          .from("auth_otp_challenges")
          .update({
            attempts_count: nextAttempts,
            is_used: remaining <= 0,
          })
          .eq("id", challenge.id);

        if (remaining <= 0) {
          return {
            success: false,
            error: "Maximum verification attempts exceeded. This code has been invalidated.",
            remainingAttempts: 0,
          };
        }

        return {
          success: false,
          error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
          remainingAttempts: remaining,
        };
      }

      // Valid: mark as used immediately
      await supabaseAdmin
        .from("auth_otp_challenges")
        .update({ is_used: true })
        .eq("id", challenge.id);

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role, status")
        .eq("id", challenge.user_id)
        .maybeSingle();

      return {
        success: true,
        userId: challenge.user_id,
        userRole:
          profile?.role || (normalizedEmail === "bera.ankan005@gmail.com" ? "owner" : "client"),
      };
    } catch (dbErr) {
      console.error("[OTP Verification Database Error]", dbErr);
    }
  }

  return {
    success: false,
    error: "Invalid or expired verification session. Please request a new code.",
  };
}
