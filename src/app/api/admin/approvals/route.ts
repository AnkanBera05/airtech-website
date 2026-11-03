import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { sendAccountApprovalNotification, sendAdminSecurityAlert } from "@/lib/email/brevo";

export async function GET(req: NextRequest) {
  try {
    let requests = [
      {
        id: "req-01",
        fullName: "Rahul Sengupta",
        email: "r.sengupta@engineering.org",
        role: "employee",
        organizationName: "AIRTECH Kolkata Design Cell",
        department: "Mechanical (HVAC)",
        designation: "Senior HVAC Consultant",
        status: "pending",
        createdAt: "2026-11-02T14:30:00Z",
      },
      {
        id: "req-02",
        fullName: "Ananya Mukherjee",
        email: "ananya.m@fortishealthcare.com",
        role: "client",
        organizationName: "Fortis Healthcare Facilities",
        department: "Client Representative",
        designation: "Director of Infrastructure",
        status: "pending",
        createdAt: "2026-11-02T18:15:00Z",
      },
    ];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from("registration_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          requests = data.map((r) => ({
            id: r.id,
            fullName: r.full_name,
            email: r.email,
            role: r.requested_role,
            organizationName: r.company_name || "N/A",
            department: r.justification || "N/A",
            designation: r.requested_role === "employee" ? "Engineer" : "Client Representative",
            status: r.status,
            createdAt: r.created_at,
          }));
        }
      } catch (dbErr) {
        console.warn("[Approvals Fetch Notice]", dbErr);
      }
    }

    return NextResponse.json({ success: true, requests });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching registration approvals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, email, fullName, role, action } = body;

    if (!email || !action) {
      return NextResponse.json(
        { error: "Email and action (approve/reject) are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const targetRole = role || "client";
    const name = fullName || normalizedEmail;

    if (action === "approve") {
      // 1. Update in Supabase
      if (isSupabaseConfigured) {
        try {
          if (requestId) {
            await supabaseAdmin
              .from("registration_requests")
              .update({ status: "approved" })
              .eq("id", requestId);
          }

          await supabaseAdmin
            .from("profiles")
            .update({ status: "active", role: targetRole })
            .eq("email", normalizedEmail);

          await supabaseAdmin.from("audit_logs").insert({
            action: "admin.user_approved",
            entity_type: "profile",
            metadata: { email: normalizedEmail, role: targetRole, approvedAt: new Date().toISOString() },
          });
        } catch (dbErr) {
          console.warn("[Approval DB Update Notice]", dbErr);
        }
      }

      // 2. Dispatch Brevo approval notification to user
      const emailResult = await sendAccountApprovalNotification({
        email: normalizedEmail,
        name,
        role: targetRole,
      });

      // 3. Security alert to Super Admin
      await sendAdminSecurityAlert({
        eventTitle: `Account Approved: ${name} (${targetRole.toUpperCase()})`,
        details: `Administrator approved portal onboarding for ${normalizedEmail}. Brevo welcome notification dispatched.`,
        metadata: { email: normalizedEmail, role: targetRole, emailSent: emailResult.success },
      });

      return NextResponse.json({
        success: true,
        message: `Account for ${name} (${normalizedEmail}) has been approved. Notification dispatched via Brevo.`,
        emailSent: emailResult.success,
      });
    } else {
      // Reject action
      if (isSupabaseConfigured) {
        try {
          if (requestId) {
            await supabaseAdmin
              .from("registration_requests")
              .update({ status: "rejected" })
              .eq("id", requestId);
          }

          await supabaseAdmin
            .from("profiles")
            .update({ status: "rejected" })
            .eq("email", normalizedEmail);
        } catch (dbErr) {
          console.warn("[Reject DB Notice]", dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Onboarding request for ${normalizedEmail} has been rejected.`,
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing approval action";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
