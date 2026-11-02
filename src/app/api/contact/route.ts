import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { sendContactEnquiryNotification } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, organizationName, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    // 1. Save Enquiry to Supabase Database
    let inquiryId = crypto.randomUUID();
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin.from("contact_enquiries").insert({
          id: inquiryId,
          full_name: trimmedName,
          email: normalizedEmail,
          phone: phone?.trim() || null,
          organization_name: organizationName?.trim() || null,
          message: trimmedMessage,
          status: "unread",
          created_at: new Date().toISOString(),
        }).select().single();

        if (data?.id) {
          inquiryId = data.id;
        }
      } catch (dbErr) {
        console.error("[Database Enquiry Insert Error]", dbErr);
      }
    }

    // 2. Trigger Transactional Notification via Resend
    await sendContactEnquiryNotification({
      fullName: trimmedName,
      email: normalizedEmail,
      phone: phone?.trim(),
      organization: organizationName?.trim(),
      message: trimmedMessage,
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been submitted directly to our engineering team.",
      inquiryId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error submitting inquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
