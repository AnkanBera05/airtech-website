import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
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

    // 2. Check if user already exists in profiles
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, status")
      .eq("email", normalizedEmail)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please proceed to login." },
        { status: 409 }
      );
    }

    // 3. Create a pending registration request
    const requestedRole = type === "employee" ? "employee" : "client";

    const { data: regRequest, error: regError } = await supabaseAdmin
      .from("registration_requests")
      .insert({
        email: normalizedEmail,
        full_name: fullName.trim(),
        requested_role: requestedRole,
        company_name: organizationName?.trim() || null,
        phone: phone?.trim() || null,
        justification: `Department: ${department || "N/A"}, Designation: ${designation || "N/A"}`,
        status: "pending",
      })
      .select()
      .single();

    // Also pre-create a pending profile so it's ready upon admin approval
    try {
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
    } catch {
      // Ignored if table constraints handled by admin approval trigger
    }

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully. Awaiting administrative review.",
      requestId: regRequest?.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
