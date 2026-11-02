import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { sendWelcomeEmail, sendAdminSecurityAlert } from "@/lib/email/resend";
import { OWNER_EMAIL } from "@/lib/auth/owner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      type, // 'employee' | 'client'
      fullName, 
      email, 
      phone, 
      department, 
      designation, 
      organizationName, 
      password 
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Critical Security Rule: Prevent public registration of Owner or Admin emails
    if (normalizedEmail === OWNER_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: "This email address is reserved and cannot be registered publicly." },
        { status: 403 }
      );
    }

    const requestedRole = type === "employee" ? "employee" : "client";
    const requestId = crypto.randomUUID();

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data: existingProfile } = await supabaseAdmin
          .from("profiles")
          .select("id, status")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (existingProfile) {
          return NextResponse.json(
            { error: "An account with this email address already exists. Please proceed to login." },
            { status: 409 }
          );
        }

        await supabaseAdmin
          .from("registration_requests")
          .insert({
            id: requestId,
            email: normalizedEmail,
            full_name: fullName.trim(),
            requested_role: requestedRole,
            company_name: organizationName?.trim() || null,
            phone: phone?.trim() || null,
            justification: `Department: ${department || "N/A"}, Designation: ${designation || "N/A"}`,
            status: "pending",
          });

        await supabaseAdmin.from("profiles").insert({
          id: crypto.randomUUID(),
          email: normalizedEmail,
          full_name: fullName.trim(),
          phone: phone?.trim() || null,
          designation: designation?.trim() || (type === "employee" ? "Engineer" : "Client Representative"),
          department: department?.trim() || (type === "employee" ? "Engineering" : "External Client"),
          role: requestedRole,
          status: "pending_approval",
        });
      } catch (dbErr) {
        console.warn("[Registration Database Notice]", dbErr);
      }
    }

    // 3. Dispatch Notifications via Resend
    await sendWelcomeEmail({
      email: normalizedEmail,
      name: fullName.trim(),
      role: requestedRole,
    });

    await sendAdminSecurityAlert({
      eventTitle: `New ${requestedRole.toUpperCase()} Registration Submitted`,
      details: `${fullName.trim()} (${normalizedEmail}) has requested portal access as ${requestedRole.toUpperCase()}. Requires Super Admin review.`,
      metadata: { role: requestedRole, email: normalizedEmail, organization: organizationName },
    });

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully. Awaiting administrative review.",
      requestId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
