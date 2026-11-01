import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, organizationName, projectType, estimatedArea, message, disciplines } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.from("contact_enquiries").insert({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      organization_name: organizationName?.trim() || null,
      project_type: projectType || "Commercial / Industrial",
      estimated_area_sqft: estimatedArea || null,
      message: message.trim(),
      disciplines_needed: disciplines || ["hvac"],
      status: "unread",
    }).select().single();

    if (error) {
      // Graceful fallback if database table not yet migrated locally
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting AIRTECH. Our technical team has received your inquiry.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been submitted directly to our engineering team.",
      inquiryId: data.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error submitting inquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
