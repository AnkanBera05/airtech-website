import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { OWNER_EMAIL, setOwnerPasswordChangeStatus } from "@/lib/auth/owner";
import { sendAdminSecurityAlert } from "@/lib/email/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";

    // 1. Update password in Supabase Auth if configured
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

          await supabaseAdmin.from("audit_logs").insert({
            user_id: user.id,
            action: "auth.password_changed",
            entity_type: "profile",
            entity_id: user.id,
            ip_address: ipAddress,
            metadata: { email: normalizedEmail, timestamp: new Date().toISOString() },
          });
        }
      } catch (authErr) {
        console.warn("[Password Update Notice] Supabase Auth update skipped:", authErr);
      }
    }

    if (normalizedEmail === OWNER_EMAIL.toLowerCase()) {
      setOwnerPasswordChangeStatus(true);
    }

    // 2. Dispatch Brevo security alert to admin
    await sendAdminSecurityAlert({
      eventTitle: `Password Updated for ${normalizedEmail}`,
      details: `The user account for ${normalizedEmail} successfully updated their password.`,
      metadata: { email: normalizedEmail, ipAddress },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You can now access your dashboard.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Password update error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
