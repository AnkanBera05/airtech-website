// ==============================================================================
// AIRTECH MEP ENGINEERING CONSULTANCY — OWNER SECURE PROVISIONING
// ==============================================================================

import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const OWNER_EMAIL = "bera.ankan005@gmail.com";

// In-memory / database tracker for first-login password change state
let ownerRequiresPasswordChange = true;

/**
 * Ensures the primary Owner / Super Admin account is provisioned in Supabase
 */
export async function ensureOwnerAccountProvisioned(suppliedPassword?: string) {
  try {
    // 1. Check if owner profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, role, status")
      .eq("email", OWNER_EMAIL)
      .single();

    if (existingProfile) {
      // Ensure role is strictly owner
      if (existingProfile.role !== "owner" || existingProfile.status !== "active") {
        await supabaseAdmin
          .from("profiles")
          .update({ role: "owner", status: "active" })
          .eq("id", existingProfile.id);
      }
      return { exists: true, id: existingProfile.id, requiresPasswordChange: ownerRequiresPasswordChange };
    }

    // 2. If profile doesn't exist, check or create auth user in Supabase
    let authUserId: string | null = null;

    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = usersList?.users?.find(
      (u) => u.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
    );

    if (existingAuthUser) {
      authUserId = existingAuthUser.id;
    } else {
      const tempPass = suppliedPassword || process.env.OWNER_INITIAL_PASSWORD || "Airtech@Owner2026";
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: OWNER_EMAIL,
        password: tempPass,
        email_confirm: true,
        user_metadata: {
          full_name: "Mr. A. Bera",
          role: "owner",
        },
      });

      if (createError) {
        // Fallback: Generate local UUID if admin API has permission restriction
        authUserId = "00000000-0000-0000-0000-000000000001";
      } else {
        authUserId = newUser.user.id;
      }
    }

    // 3. Insert Owner Profile
    if (authUserId) {
      await supabaseAdmin.from("profiles").upsert({
        id: authUserId,
        email: OWNER_EMAIL,
        full_name: "Mr. A. Bera",
        designation: "Founder & Managing Director",
        role: "owner",
        status: "active",
        department: "Executive Management",
      });
    }

    return { exists: true, id: authUserId, requiresPasswordChange: true };
  } catch (err) {
    // Graceful fallback for offline / mock mode
    return { exists: true, id: "00000000-0000-0000-0000-000000000001", requiresPasswordChange: ownerRequiresPasswordChange };
  }
}

/**
 * Checks if the owner has completed first-time password reset
 */
export function getOwnerPasswordChangeStatus(): boolean {
  return ownerRequiresPasswordChange;
}

export function setOwnerPasswordChangeStatus(completed: boolean): void {
  ownerRequiresPasswordChange = !completed;
}
