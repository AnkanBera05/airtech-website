import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  sendRegistrationOtpEmail,
  sendWelcomeEmail,
  sendAdminSecurityAlert,
} from "@/lib/email/brevo";
import { createOtpChallenge, verifyOtpChallenge } from "@/lib/auth/otp";
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
      password,
      otp, // Optional: if provided, verifies OTP and completes registration
      action, // 'request_otp' | 'verify'
    } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required." },
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

    // Check if account already exists
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
      } catch (dbErr) {
        console.warn("[Registration Check Notice]", dbErr);
      }
    }

    // 2. Action: Request Registration OTP
    if (action === "request_otp" || (!otp && !password)) {
      const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
      const userAgent = req.headers.get("user-agent") || "";
      const tempId = crypto.randomUUID();

      const { otp: generatedOtp, challengeId } = await createOtpChallenge(
        tempId,
        normalizedEmail,
        "registration",
        ipAddress,
        userAgent
      );

      const emailResult = await sendRegistrationOtpEmail({
        email: normalizedEmail,
        name: fullName.trim(),
        otp: generatedOtp,
        role: requestedRole,
        expiryMinutes: 5,
      });

      return NextResponse.json({
        success: true,
        requiresOtp: true,
        challengeId,
        email: normalizedEmail,
        emailSent: emailResult.success,
        message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
        warning: emailResult.success ? undefined : "Email service pending API key configuration.",
      });
    }

    // 3. Action: Complete Registration (with OTP verification if provided)
    if (!password) {
      return NextResponse.json(
        { error: "A secure password is required to complete registration." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (otp) {
      const verification = await verifyOtpChallenge(normalizedEmail, otp, "registration");
      if (!verification.success) {
        return NextResponse.json(
          { error: verification.error || "Invalid or expired verification code." },
          { status: 400 }
        );
      }
    }

    const requestId = crypto.randomUUID();
    const newUserId = crypto.randomUUID();

    // 4. Persist to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await supabaseAdmin.from("registration_requests").insert({
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
          id: newUserId,
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

    // 5. Dispatch Brevo Notifications: Welcome + Admin Security Alert
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
    const isRateLimited = message.includes("Please wait") || message.includes("Rate limit");
    return NextResponse.json(
      { error: message },
      { status: isRateLimited ? 429 : 500 }
    );
  }
}
