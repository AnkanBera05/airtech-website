import { NextRequest, NextResponse } from "next/server";
import { createOtpChallenge } from "@/lib/auth/otp";
import { sendPasswordResetOtpEmail } from "@/lib/email/brevo";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { OWNER_EMAIL } from "@/lib/auth/owner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isOwner = normalizedEmail === OWNER_EMAIL.toLowerCase();

    let userId: string = crypto.randomUUID();

    // Check if user exists (to prevent completely non-existent emails from generating spurious challenges)
    if (isSupabaseConfigured && !isOwner) {
      try {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id, status")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (profile) {
          userId = profile.id;
        }
      } catch (dbErr) {
        console.warn("[Forgot Password User Check Notice]", dbErr);
      }
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    // 1. Generate 6-digit OTP challenge for password_reset (5-min expiry, 60s cooldown enforced)
    const { otp, challengeId } = await createOtpChallenge(
      userId,
      normalizedEmail,
      "password_reset",
      ipAddress,
      userAgent
    );

    // 2. Dispatch via Brevo Transactional Email
    const emailResult = await sendPasswordResetOtpEmail({
      email: normalizedEmail,
      otp,
      expiryMinutes: 5,
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit password reset code has been sent to ${normalizedEmail}.`,
      challengeId,
      emailSent: emailResult.success,
      warning: emailResult.success
        ? undefined
        : emailResult.error || "Email delivery pending Brevo API key configuration.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Password reset request error";
    const isRateLimited = message.includes("Please wait") || message.includes("Rate limit");
    return NextResponse.json(
      { error: message },
      { status: isRateLimited ? 429 : 500 }
    );
  }
}
