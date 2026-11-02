import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export const OWNER_EMAIL = "bera.ankan005@gmail.com";

export type UserRole =
  | "owner"
  | "admin"
  | "project_manager"
  | "finance_admin"
  | "content_admin"
  | "employee"
  | "client";

export interface SyncProfileResult {
  userId: string;
  clerkId: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: "active" | "pending_approval" | "suspended";
}

/**
 * Synchronize a Clerk authenticated user with the Supabase database profile.
 * Guarantees role persistence and enforces that bera.ankan005@gmail.com is Owner.
 */
export async function syncClerkUserWithProfile(): Promise<SyncProfileResult | null> {
  const user = await currentUser();
  if (!user) return null;

  const primaryEmail = user.emailAddresses?.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "";

  const normalizedEmail = primaryEmail.trim().toLowerCase();
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || normalizedEmail.split("@")[0];

  const isOwner = normalizedEmail === OWNER_EMAIL.toLowerCase();

  // Determine initial role: Owner email is ALWAYS owner; otherwise check Clerk metadata or default to client
  let assignedRole: UserRole = "client";
  if (isOwner) {
    assignedRole = "owner";
  } else if (user.publicMetadata?.role && typeof user.publicMetadata.role === "string") {
    assignedRole = user.publicMetadata.role as UserRole;
  }

  const status = isOwner ? "active" : ((user.publicMetadata?.status as "active" | "pending_approval" | "suspended") || "active");

  if (isSupabaseConfigured) {
    try {
      // 1. Check if profile exists by clerk_user_id or email
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, role, status")
        .or(`clerk_user_id.eq.${user.id},email.eq.${normalizedEmail}`)
        .maybeSingle();

      if (existingProfile) {
        // Update Clerk ID and last login
        await supabaseAdmin
          .from("profiles")
          .update({
            clerk_user_id: user.id,
            full_name: fullName,
            updated_at: new Date().toISOString(),
            ...(isOwner ? { role: "owner", status: "active" } : {}),
          })
          .eq("id", existingProfile.id);

        return {
          userId: existingProfile.id,
          clerkId: user.id,
          email: normalizedEmail,
          fullName,
          role: (isOwner ? "owner" : existingProfile.role) as UserRole,
          status: (isOwner ? "active" : existingProfile.status) as "active" | "pending_approval" | "suspended",
        };
      } else {
        // Create new profile record linked to Clerk ID
        const newId = crypto.randomUUID();
        await supabaseAdmin.from("profiles").insert({
          id: newId,
          clerk_user_id: user.id,
          email: normalizedEmail,
          full_name: fullName,
          role: assignedRole,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        return {
          userId: newId,
          clerkId: user.id,
          email: normalizedEmail,
          fullName,
          role: assignedRole,
          status,
        };
      }
    } catch (err) {
      console.error("[Clerk-Supabase Sync Error]", err);
    }
  }

  // Graceful fallback when Supabase is initializing
  return {
    userId: user.id,
    clerkId: user.id,
    email: normalizedEmail,
    fullName,
    role: assignedRole,
    status,
  };
}

/**
 * Server-side authorization check helper for protected API routes and Server Actions
 */
export async function verifyUserAuthorization(allowedRoles?: UserRole[]) {
  // If Clerk environment is not configured, grant safe development access for verified owner
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return {
      authorized: true,
      profile: {
        userId: "00000000-0000-0000-0000-000000000001",
        clerkId: "dev_admin_user",
        email: OWNER_EMAIL,
        fullName: "Mr. A. Bera",
        role: "owner" as UserRole,
        status: "active" as const,
      },
    };
  }

  try {
    const session = await auth();
    if (!session?.userId) {
      return { authorized: false, error: "Unauthorized: Active session required", status: 401 };
    }

    const profile = await syncClerkUserWithProfile();
    if (!profile) {
      return { authorized: false, error: "Unauthorized: Profile not found", status: 401 };
    }

    if (profile.status === "suspended") {
      return { authorized: false, error: "Forbidden: Account access suspended", status: 403 };
    }

    if (profile.status === "pending_approval") {
      return { authorized: false, error: "Forbidden: Account awaiting administrator approval", status: 403 };
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const isOwner = profile.role === "owner";
      const hasRole = allowedRoles.includes(profile.role) || isOwner;

      if (!hasRole) {
        return {
          authorized: false,
          error: `Forbidden: Requires role ${allowedRoles.join(" or ")}`,
          status: 403,
        };
      }
    }

    return { authorized: true, profile, session };
  } catch (authErr) {
    console.warn("[Clerk Auth Error in verifyUserAuthorization]", authErr);
    return { authorized: false, error: "Authentication check failed", status: 401 };
  }
}
