import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { sendCareerApplicationNotification } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, positionTitle, experienceYears, resumeUrl, coverNotes } = body;

    if (!fullName || !email || !positionTitle) {
      return NextResponse.json(
        { error: "Full name, email, and position title are required." },
        { status: 400 }
      );
    }

    const trimmedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    let applicationId = crypto.randomUUID();

    // 1. Record application in Supabase
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabaseAdmin.from("career_applications").insert({
          id: applicationId,
          full_name: trimmedName,
          email: normalizedEmail,
          phone: phone?.trim() || null,
          job_title: positionTitle.trim(),
          experience_years: experienceYears || null,
          resume_url: resumeUrl || null,
          cover_notes: coverNotes || null,
          status: "new",
          created_at: new Date().toISOString(),
        }).select().single();

        if (data?.id) applicationId = data.id;
      } catch (dbErr) {
        console.error("[Database Career Application Insert Error]", dbErr);
      }
    }

    // 2. Dispatch HR alert via Resend
    await sendCareerApplicationNotification({
      fullName: trimmedName,
      email: normalizedEmail,
      phone: phone?.trim(),
      positionTitle: positionTitle.trim(),
      experienceYears,
      resumeUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. Our engineering recruitment team will review your qualifications.",
      applicationId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error submitting application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
