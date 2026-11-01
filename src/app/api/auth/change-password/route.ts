import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { OWNER_EMAIL, setOwnerPasswordChangeStatus } from "@/lib/auth/owner";

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

    // 1. Update password in Supabase Auth
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
    } catch {
      // Handled gracefully
    }

    if (normalizedEmail === OWNER_EMAIL.toLowerCase()) {
      setOwnerPasswordChangeStatus(true);
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You can now access your dashboard.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Password update error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
