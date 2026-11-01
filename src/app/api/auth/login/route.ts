import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createOtpChallenge } from "@/lib/auth/otp";
import { sendTransactionalEmail, buildOtpEmailHtml } from "@/lib/email/sender";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { OWNER_EMAIL, ensureOwnerAccountProvisioned, getOwnerPasswordChangeStatus } from "@/lib/auth/owner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, portalType } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isOwner = normalizedEmail === OWNER_EMAIL.toLowerCase();

    // Portal Type Enforcements
    if (portalType === "owner" && !isOwner) {
      return NextResponse.json(
        { error: "Access Denied: This portal entry is strictly reserved for the AIRTECH Owner." },
        { status: 403 }
      );
    }

    let userId: string | null = null;
    let userRole = "client";

    // 1. Special Handling for Owner Provisioning & Login
    if (isOwner) {
      const ownerInfo = await ensureOwnerAccountProvisioned(password);
      userId = ownerInfo.id;
      userRole = "owner";
    } else {
      // 2. Standard Employee / Client Authentication
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-airtech.supabase.co";
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });

      const { data: authData } = await authClient.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      userId = authData?.user?.id || null;

      // Fallback verification against database profiles
      if (!userId) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id, role, status")
          .eq("email", normalizedEmail)
          .single();

        if (!profile) {
          return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
          );
        }

        if (profile.status === "pending_approval") {
          return NextResponse.json(
            { error: "Your registration is currently pending administrator approval. You will receive an email once approved." },
            { status: 403 }
          );
        }

        if (profile.status === "suspended" || profile.status === "revoked") {
          return NextResponse.json(
            { error: "Account access has been revoked or suspended." },
            { status: 403 }
          );
        }

        userId = profile.id;
        userRole = profile.role;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 3. Generate cryptographically secure 6-digit OTP challenge
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    const { otp, challengeId } = await createOtpChallenge(
      userId,
      normalizedEmail,
      "login_2fa",
      ipAddress,
      userAgent
    );

    // 4. Dispatch OTP via Transactional Email Provider
    const emailResult = await sendTransactionalEmail({
      to: normalizedEmail,
      subject: "AIRTECH Security: Your 6-Digit Sign-In Code",
      htmlContent: buildOtpEmailHtml(otp, 5),
    });

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      email: normalizedEmail,
      challengeId,
      isOwner,
      mustChangePassword: isOwner ? getOwnerPasswordChangeStatus() : false,
      emailConfigured: emailResult.success,
      message: `A 6-digit security code has been sent to ${normalizedEmail}.`,
      warning: emailResult.success ? undefined : "Transactional email service not configured. (Testing fallback active).",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
