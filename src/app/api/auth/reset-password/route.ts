import { NextRequest, NextResponse } from "next/server";
import { verifyOtpChallenge } from "@/lib/auth/otp";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { OWNER_EMAIL, setOwnerPasswordChangeStatus } from "@/lib/auth/owner";
import { sendAdminSecurityAlert } from "@/lib/email/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, 6-digit OTP code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isOwner = normalizedEmail === OWNER_EMAIL.toLowerCase();

    // 1. Verify OTP with single-use and expiration enforcement
    const verification = await verifyOtpChallenge(
      normalizedEmail,
      otp,
      "password_reset"
    );

    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error || "Invalid or expired verification code." },
        { status: 401 }
      );
    }

    // 2. Update password in Supabase Auth if configured
    if (isSupabaseConfigured) {
      try {
        const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
        const user = usersList?.users?.find(
          (u) => u.email?.toLowerCase() === normalizedEmail
        );

        if (user) {
          await supabaseAdmin.auth.admin.updateUserById(user.id, {
            password: newPassword,
          });
        }
      } catch (authErr) {
        console.warn("[Password Update Notice] Supabase Auth update skipped:", authErr);
      }
    }

    // 3. Special handling for Owner state
    if (isOwner) {
      setOwnerPasswordChangeStatus(true);
    }

    // 4. Audit Log Entry
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    if (isSupabaseConfigured) {
      try {
        await supabaseAdmin.from("audit_logs").insert({
          user_id: verification.userId,
          action: "auth.password_reset_completed",
          entity_type: "profile",
          ip_address: ipAddress,
          metadata: { email: normalizedEmail, timestamp: new Date().toISOString() },
        });
      } catch (auditErr) {
        console.warn("[Audit Log Notice]", auditErr);
      }
    }

    // 5. Send security alert to Admin
    await sendAdminSecurityAlert({
      eventTitle: `Password Reset Completed for ${normalizedEmail}`,
      details: `User account associated with ${normalizedEmail} successfully completed a password reset via Brevo OTP verification.`,
      metadata: { email: normalizedEmail, ipAddress },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You can now log in with your new credentials.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Password reset verification error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
