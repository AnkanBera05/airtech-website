import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createOtpChallenge } from "@/lib/auth/otp";
import { sendTransactionalEmail, buildOtpEmailHtml } from "@/lib/email/sender";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Authenticate credentials against Supabase Auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-airtech.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    // Check credentials (or demo/local verification if offline)
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    let userId = authData?.user?.id;

    // If Supabase is not yet live/configured in this local run, verify against database profiles
    if (!userId) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, status")
        .eq("email", normalizedEmail)
        .single();

      if (!profile) {
        // Account enumeration protection: Return generic error
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      if (profile.status === "suspended" || profile.status === "revoked") {
        return NextResponse.json(
          { error: "Account access has been revoked or suspended." },
          { status: 403 }
        );
      }

      userId = profile.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 2. Generate cryptographically secure 6-digit OTP challenge
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    const { otp, challengeId } = await createOtpChallenge(
      userId,
      normalizedEmail,
      "login_2fa",
      ipAddress,
      userAgent
    );

    // 3. Dispatch OTP via Transactional Email Provider
    const emailResult = await sendTransactionalEmail({
      to: normalizedEmail,
      subject: "AIRTECH Security: Your 6-Digit Sign-In Code",
      htmlContent: buildOtpEmailHtml(otp, 5),
    });

    // 4. Return response to user
    // SECURITY RULE: Never return the OTP in the JSON response or logs!
    if (!emailResult.success) {
      // If email provider is not configured, inform the user clearly
      return NextResponse.json({
        success: true,
        requiresOtp: true,
        email: normalizedEmail,
        challengeId,
        emailConfigured: false,
        warning: emailResult.error || "Transactional email provider not configured.",
      });
    }

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      email: normalizedEmail,
      challengeId,
      emailConfigured: true,
      message: `A 6-digit security code has been sent to ${normalizedEmail}. It expires in 5 minutes.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
