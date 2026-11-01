import { NextRequest, NextResponse } from "next/server";
import { verifyOtpChallenge } from "@/lib/auth/otp";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and 6-digit OTP are required." },
        { status: 400 }
      );
    }

    const verification = await verifyOtpChallenge(email, otp, "login_2fa");

    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error },
        { status: 401 }
      );
    }

    // Role-based destination determination (Never trust client-supplied role)
    const role = verification.userRole || "client";
    let redirectUrl = "/portal/client";

    switch (role) {
      case "owner":
      case "admin":
        redirectUrl = "/portal/admin";
        break;
      case "project_manager":
        redirectUrl = "/portal/manager";
        break;
      case "finance_admin":
        redirectUrl = "/portal/finance";
        break;
      case "employee":
        redirectUrl = "/portal/employee";
        break;
      case "client":
      default:
        redirectUrl = "/portal/client";
        break;
    }

    // Record login in security audit log
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await supabaseAdmin.from("audit_logs").insert({
      user_id: verification.userId,
      action: "auth.login_otp_verified",
      entity_type: "profile",
      entity_id: verification.userId,
      ip_address: ipAddress,
      metadata: { role, redirectUrl },
    });

    // Create response and set secure session cookies
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      role,
      redirectUrl,
      user: {
        id: verification.userId,
        email,
        role,
      },
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: "airtech_session_role",
      value: role,
      path: "/",
      httpOnly: false, // Accessible to portal layout for verified route navigation
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    response.cookies.set({
      name: "airtech_session_user",
      value: email,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
