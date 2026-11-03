// ==============================================================================
// AIRTECH MEP ENGINEERING CONSULTANCY — BREVO TRANSACTIONAL EMAIL SERVICE
// Official Brevo API: POST https://api.brevo.com/v3/smtp/email
// ==============================================================================

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
export const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "noreply@airtech.in";
export const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "AIRTECH";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bera.ankan005@gmail.com";

export interface BrevoRecipient {
  email: string;
  name?: string;
}

export interface SendBrevoEmailParams {
  to: string | BrevoRecipient | (string | BrevoRecipient)[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: { email: string; name?: string };
  tags?: string[];
}

export interface BrevoResult {
  success: boolean;
  messageId?: string;
  error?: string;
  code?: string;
  statusCode?: number;
}

/**
 * Validates basic email structure
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Strips HTML tags to generate a clean plain-text fallback
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Checks if Brevo credentials are configured
 */
export function isBrevoConfigured(): boolean {
  return Boolean(
    BREVO_API_KEY &&
    BREVO_API_KEY.length > 10 &&
    !BREVO_API_KEY.startsWith("xkeysib-placeholder")
  );
}

/**
 * Centralized Brevo Transactional Email Dispatcher
 * - Server-side only
 * - 10-second timeout with AbortController
 * - Never logs API keys, OTPs, or passwords
 * - Validates recipients before sending
 */
export async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
  textContent,
  replyTo,
  tags,
}: SendBrevoEmailParams): Promise<BrevoResult> {
  // 1. Check configuration
  if (!isBrevoConfigured()) {
    const warningMsg = "Brevo API key (BREVO_API_KEY) is not configured in the environment.";
    console.warn(`[Brevo Notice] ${warningMsg} Email dispatch skipped.`);
    return {
      success: false,
      error: warningMsg,
      code: "BREVO_NOT_CONFIGURED",
      statusCode: 503,
    };
  }

  // 2. Format and validate recipients
  const rawList = Array.isArray(to) ? to : [to];
  const formattedRecipients: BrevoRecipient[] = [];

  for (const item of rawList) {
    if (typeof item === "string") {
      const email = item.trim().toLowerCase();
      if (!isValidEmail(email)) {
        return {
          success: false,
          error: `Invalid recipient email address: ${email}`,
          code: "INVALID_EMAIL",
          statusCode: 400,
        };
      }
      formattedRecipients.push({ email });
    } else if (item && typeof item === "object" && item.email) {
      const email = item.email.trim().toLowerCase();
      if (!isValidEmail(email)) {
        return {
          success: false,
          error: `Invalid recipient email address: ${email}`,
          code: "INVALID_EMAIL",
          statusCode: 400,
        };
      }
      formattedRecipients.push({ email, name: item.name?.trim() });
    }
  }

  if (formattedRecipients.length === 0) {
    return {
      success: false,
      error: "No valid recipient email addresses provided.",
      code: "EMPTY_RECIPIENTS",
      statusCode: 400,
    };
  }

  // 3. Prepare payload
  const plainText = textContent || stripHtml(htmlContent);

  const payload: Record<string, unknown> = {
    sender: {
      name: BREVO_SENDER_NAME,
      email: BREVO_SENDER_EMAIL,
    },
    to: formattedRecipients,
    subject: subject.trim(),
    htmlContent: htmlContent.trim(),
    textContent: plainText,
  };

  if (replyTo && isValidEmail(replyTo.email)) {
    payload.replyTo = {
      email: replyTo.email.trim().toLowerCase(),
      name: replyTo.name?.trim() || BREVO_SENDER_NAME,
    };
  }

  if (tags && tags.length > 0) {
    payload.tags = tags.slice(0, 10);
  }

  // 4. Dispatch with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        responseData.message ||
        responseData.error ||
        `Brevo API responded with HTTP ${response.status}`;
      const errorCode = responseData.code || `HTTP_${response.status}`;

      console.error(
        `[Brevo Error] HTTP ${response.status} (${errorCode}): ${errorMsg}`
      );

      return {
        success: false,
        error: errorMsg,
        code: errorCode,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      messageId: responseData.messageId,
      statusCode: response.status,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof Error && err.name === "AbortError") {
      console.error("[Brevo Error] Request timed out after 10 seconds.");
      return {
        success: false,
        error: "Email delivery timed out after 10 seconds. Brevo API did not respond in time.",
        code: "TIMEOUT",
        statusCode: 504,
      };
    }

    const message = err instanceof Error ? err.message : "Network error contacting Brevo API";
    console.error(`[Brevo Network Exception] ${message}`);

    return {
      success: false,
      error: `Network error during email dispatch: ${message}`,
      code: "NETWORK_ERROR",
      statusCode: 502,
    };
  }
}

// ==============================================================================
// AIRTECH BRANDED HTML EMAIL WRAPPER
// Deep Navy (#07172C), Sky Blue (#0284C7), Clean Corporate Typography
// ==============================================================================

export function airtechEmailWrapper({
  title,
  preheader,
  contentHtml,
}: {
  title: string;
  preheader?: string;
  contentHtml: string;
}): string {
  const previewText = preheader
    ? `<span style="display:none;font-size:0px;line-height:0px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">${preheader}</span>`
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0F172A;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
    }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { padding: 0; }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #07172C 0%, #0F284E 100%);
      padding: 32px 36px 28px;
      border-bottom: 3px solid #0284C7;
    }
    .brand-title {
      color: #FFFFFF;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0;
      display: inline-flex;
      align-items: center;
    }
    .brand-triangle {
      color: #38BDF8;
      margin-right: 8px;
      font-size: 18px;
    }
    .brand-subtitle {
      color: #94A3B8;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 6px 0 0 0;
    }
    .email-body {
      padding: 36px;
      color: #334155;
      font-size: 14px;
      line-height: 1.6;
    }
    .email-heading {
      color: #07172C;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin: 0 0 16px 0;
    }
    .otp-card {
      background-color: #F8FAFC;
      border: 1px solid #BAE6FD;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }
    .otp-code {
      font-family: 'SFMono-Regular', Consolas, 'Courier New', Courier, monospace;
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 0.3em;
      color: #07172C;
      padding: 8px 0;
      text-indent: 0.3em;
    }
    .otp-badge {
      display: inline-block;
      background: #E0F2FE;
      color: #0369A1;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-top: 8px;
    }
    .info-box {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #0284C7;
      padding: 16px 20px;
      border-radius: 4px;
      margin: 20px 0;
      font-size: 13px;
    }
    .alert-box {
      background-color: #FEF2F2;
      border: 1px solid #FCA5A5;
      border-left: 4px solid #EF4444;
      padding: 16px 20px;
      border-radius: 4px;
      margin: 20px 0;
      font-size: 13px;
    }
    .btn-primary {
      display: inline-block;
      background: #0284C7;
      color: #FFFFFF !important;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      margin: 16px 0;
    }
    .security-notice {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 12px;
      color: #92400E;
      margin: 20px 0;
    }
    .email-footer {
      background-color: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 24px 36px;
      font-size: 11px;
      color: #64748B;
      line-height: 1.6;
      text-align: center;
    }
    .footer-divider {
      margin: 12px auto;
      width: 40px;
      height: 1px;
      background-color: #CBD5E1;
    }
  </style>
</head>
<body style="background-color: #0F172A; padding: 24px 12px;">
  ${previewText}
  <div class="email-container">
    <div class="email-header">
      <div class="brand-title"><span class="brand-triangle">▲</span> AIRTECH</div>
      <div class="brand-subtitle">HVAC & MEP Engineering Consultancy • Kolkata</div>
    </div>
    <div class="email-body">
      ${contentHtml}
    </div>
    <div class="email-footer">
      <strong>AIRTECH Engineering Consultancy</strong><br>
      Rajarhat Gopalpur, Kolkata — 700136, West Bengal, India<br>
      Specialized HVAC, Cleanroom Ventilation & NBC 2016 Fire Safety Engineering<br>
      <div class="footer-divider"></div>
      This is an automated operational notification generated by the AIRTECH Engineering Platform.
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ==============================================================================
// 1. REGISTRATION OTP VERIFICATION TEMPLATE
// ==============================================================================

export async function sendRegistrationOtpEmail({
  email,
  name,
  otp,
  role,
  expiryMinutes = 5,
}: {
  email: string;
  name: string;
  otp: string;
  role: string;
  expiryMinutes?: number;
}): Promise<BrevoResult> {
  const contentHtml = `
    <h1 class="email-heading">Verify Your Account Registration</h1>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Thank you for initiating registration for the <strong>AIRTECH ${role.toUpperCase()} Portal</strong>. To verify your email address and submit your onboarding request, enter the one-time verification code below:</p>

    <div class="otp-card">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0284C7; margin-bottom: 6px;">Registration Verification Code</div>
      <div class="otp-code">${otp}</div>
      <div class="otp-badge">Valid for ${expiryMinutes} Minutes</div>
    </div>

    <div class="security-notice">
      <strong>Security Notice:</strong>
      <ul style="margin: 6px 0 0 0; padding-left: 20px;">
        <li>This verification code is strictly confidential and valid for single use only.</li>
        <li>It will expire automatically after <strong>${expiryMinutes} minutes</strong>.</li>
        <li>AIRTECH engineering administrators will never request this verification code from you.</li>
      </ul>
    </div>

    <p style="font-size: 12px; color: #64748B;">If you did not initiate this registration on the AIRTECH website, please disregard this email.</p>
  `;

  return sendBrevoEmail({
    to: { email, name },
    subject: `AIRTECH Verification Code: ${otp} (Registration)`,
    htmlContent: airtechEmailWrapper({
      title: "AIRTECH Registration Verification",
      preheader: `Your verification code is ${otp}. Valid for ${expiryMinutes} minutes.`,
      contentHtml,
    }),
    tags: ["auth", "registration", "otp"],
  });
}

// ==============================================================================
// 2. LOGIN 2FA OTP VERIFICATION TEMPLATE
// ==============================================================================

export async function sendLoginOtpEmail({
  email,
  name,
  otp,
  expiryMinutes = 5,
  ipAddress,
}: {
  email: string;
  name?: string;
  otp: string;
  expiryMinutes?: number;
  ipAddress?: string;
}): Promise<BrevoResult> {
  const contentHtml = `
    <h1 class="email-heading">Two-Factor Authentication Code</h1>
    <p>Hello${name ? ` <strong>${name}</strong>` : ""},</p>
    <p>A sign-in request was detected for your account on the <strong>AIRTECH Engineering Portal</strong>. Use the 6-digit authentication code below to complete your login:</p>

    <div class="otp-card">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0284C7; margin-bottom: 6px;">One-Time Security Passcode</div>
      <div class="otp-code">${otp}</div>
      <div class="otp-badge">Expires in ${expiryMinutes} Minutes</div>
    </div>

    ${
      ipAddress
        ? `<div class="info-box">
             <strong>Request Context:</strong><br>
             IP Address: <code>${ipAddress}</code><br>
             Timestamp: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
           </div>`
        : ""
    }

    <div class="security-notice">
      <strong>Important:</strong> Do not share this code with anyone. If you did not attempt to sign in to your AIRTECH account, your credentials may be compromised. Please change your password immediately.
    </div>
  `;

  return sendBrevoEmail({
    to: { email, name: name || "AIRTECH User" },
    subject: `AIRTECH Security Code: ${otp} (Sign-In)`,
    htmlContent: airtechEmailWrapper({
      title: "AIRTECH Security Verification",
      preheader: `Your sign-in code is ${otp}. Valid for ${expiryMinutes} minutes.`,
      contentHtml,
    }),
    tags: ["auth", "login", "2fa"],
  });
}

// ==============================================================================
// 3. PASSWORD RESET OTP VERIFICATION TEMPLATE
// ==============================================================================

export async function sendPasswordResetOtpEmail({
  email,
  name,
  otp,
  expiryMinutes = 5,
}: {
  email: string;
  name?: string;
  otp: string;
  expiryMinutes?: number;
}): Promise<BrevoResult> {
  const contentHtml = `
    <h1 class="email-heading">Password Reset Verification</h1>
    <p>Hello${name ? ` <strong>${name}</strong>` : ""},</p>
    <p>We received a request to reset the password for your AIRTECH account associated with <strong>${email}</strong>.</p>
    <p>Use the one-time code below to authorize the password reset:</p>

    <div class="otp-card">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0284C7; margin-bottom: 6px;">Password Reset Code</div>
      <div class="otp-code">${otp}</div>
      <div class="otp-badge">Valid for ${expiryMinutes} Minutes</div>
    </div>

    <div class="security-notice">
      <strong>Security Notice:</strong>
      <ul style="margin: 6px 0 0 0; padding-left: 20px;">
        <li>This code can only be used once to create a new password.</li>
        <li>It will expire in <strong>${expiryMinutes} minutes</strong>.</li>
        <li>If you did not request this password reset, no action is needed; your current password remains secure.</li>
      </ul>
    </div>
  `;

  return sendBrevoEmail({
    to: { email, name: name || "AIRTECH User" },
    subject: `AIRTECH Password Reset Code: ${otp}`,
    htmlContent: airtechEmailWrapper({
      title: "AIRTECH Password Reset",
      preheader: `Your password reset code is ${otp}. Valid for ${expiryMinutes} minutes.`,
      contentHtml,
    }),
    tags: ["auth", "password-reset"],
  });
}

// ==============================================================================
// 4. REGISTRATION WELCOME / CONFIRMATION
// ==============================================================================

export async function sendWelcomeEmail({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
  role: string;
}): Promise<BrevoResult> {
  const contentHtml = `
    <h1 class="email-heading">Registration Submitted for Review</h1>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Your onboarding request for the <strong>AIRTECH ${role.toUpperCase()} Workspace</strong> has been received and verified.</p>
    
    <div class="info-box">
      <strong>Account Identifier:</strong> ${email}<br>
      <strong>Requested Role:</strong> ${role.toUpperCase()}<br>
      <strong>Current Status:</strong> Pending Administrator Approval
    </div>

    <p>Our engineering administration team reviews every account registration to verify company credentials and assign project permissions. You will receive an automated email as soon as your access is approved.</p>

    <p style="font-size: 13px; color: #64748B;">For urgent project inquiries, reach out directly to your AIRTECH project manager or email <a href="mailto:info@airtech.in" style="color: #0284C7;">info@airtech.in</a>.</p>
  `;

  return sendBrevoEmail({
    to: { email, name },
    subject: "AIRTECH Portal Registration Received — Pending Approval",
    htmlContent: airtechEmailWrapper({
      title: "AIRTECH Registration Received",
      preheader: "Your account registration has been submitted and is pending administrator review.",
      contentHtml,
    }),
    tags: ["onboarding", "welcome"],
  });
}

// ==============================================================================
// 5. ACCOUNT APPROVAL NOTIFICATION
// ==============================================================================

export async function sendAccountApprovalNotification({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
  role: string;
}): Promise<BrevoResult> {
  const portalPath =
    role === "employee" ? "/employee" : role === "admin" || role === "owner" ? "/admin" : "/client";

  const contentHtml = `
    <h1 class="email-heading" style="color: #059669;">Your Account Has Been Approved</h1>
    <p>Dear <strong>${name}</strong>,</p>
    <p>An administrator has reviewed and officially approved your account registration for the <strong>AIRTECH ${role.toUpperCase()} Portal</strong>.</p>
    
    <div class="info-box" style="border-left-color: #059669;">
      <strong>Account Email:</strong> ${email}<br>
      <strong>Assigned Role:</strong> ${role.toUpperCase()}<br>
      <strong>Access Status:</strong> ACTIVE &amp; VERIFIED
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="https://airtech-website-gules.vercel.app${portalPath}" class="btn-primary" style="background: #059669;">Sign In to Your Portal &rarr;</a>
    </div>

    <p>You can now log in, view live project milestones, review engineering submittals, and collaborate with our technical team.</p>
  `;

  return sendBrevoEmail({
    to: { email, name },
    subject: "AIRTECH Portal Access Approved — Your Account is Ready",
    htmlContent: airtechEmailWrapper({
      title: "AIRTECH Account Approved",
      preheader: "Your portal access has been reviewed and approved by the Super Admin.",
      contentHtml,
    }),
    tags: ["account-approved", "onboarding"],
  });
}

// ==============================================================================
// 6. CONTACT ENQUIRY NOTIFICATION (ADMIN ALERT + CLIENT CONFIRMATION)
// ==============================================================================

export async function sendContactEnquiryNotification({
  fullName,
  email,
  phone,
  organization,
  message,
}: {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  message: string;
}): Promise<BrevoResult> {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";

  // 1. Send alert to Admin
  const adminContentHtml = `
    <h1 class="email-heading">New Client Project Enquiry</h1>
    <p>A new prospective client or project partner has submitted a technical inquiry via the public website:</p>

    <div class="info-box">
      <strong>Client Name:</strong> ${fullName}<br>
      <strong>Email Address:</strong> <a href="mailto:${email}" style="color: #0284C7;">${email}</a><br>
      <strong>Phone:</strong> ${phone || "Not provided"}<br>
      <strong>Organization:</strong> ${organization || "Direct Individual"}<br>
      <strong>Submission Time:</strong> ${timestamp}
    </div>

    <p><strong>Message / Project Scope:</strong></p>
    <div style="background-color: #F1F5F9; border-radius: 6px; padding: 16px; font-style: italic; color: #1E293B;">
      "${message}"
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://airtech-website-gules.vercel.app/admin#enquiries" class="btn-primary">View &amp; Respond in Admin CMS &rarr;</a>
    </div>
  `;

  const adminResult = await sendBrevoEmail({
    to: { email: ADMIN_EMAIL, name: "AIRTECH Super Admin" },
    subject: `[New Enquiry] ${fullName} — ${organization || "Client"}`,
    htmlContent: airtechEmailWrapper({
      title: "New Client Enquiry",
      preheader: `New inquiry from ${fullName} (${organization || "Client"})`,
      contentHtml: adminContentHtml,
    }),
    replyTo: { email, name: fullName },
    tags: ["enquiry", "admin-alert"],
  });

  // 2. Send acknowledgment to the client
  const clientContentHtml = `
    <h1 class="email-heading">Thank You for Contacting AIRTECH</h1>
    <p>Dear <strong>${fullName}</strong>,</p>
    <p>We have received your technical enquiry regarding <strong>${organization || "your project"}</strong>. Our engineering consultancy team is reviewing your requirements.</p>

    <div class="info-box">
      <strong>Summary of Your Submission:</strong><br>
      "${message.length > 200 ? message.slice(0, 200) + "..." : message}"
    </div>

    <p>An AIRTECH senior MEP consultant will contact you within <strong>24 business hours</strong> to discuss your project scope, site parameters, and preliminary deliverables.</p>
  `;

  await sendBrevoEmail({
    to: { email, name: fullName },
    subject: "AIRTECH: We Received Your Project Enquiry",
    htmlContent: airtechEmailWrapper({
      title: "Enquiry Acknowledgment",
      preheader: "Thank you for reaching out to AIRTECH Engineering Consultancy.",
      contentHtml: clientContentHtml,
    }),
    tags: ["enquiry", "client-acknowledgment"],
  }).catch((err) => console.warn("[Client Acknowledgment Notice]", err));

  return adminResult;
}

// ==============================================================================
// 7. CAREER APPLICATION NOTIFICATION
// ==============================================================================

export async function sendCareerApplicationNotification({
  fullName,
  email,
  phone,
  positionTitle,
  experienceYears,
  resumeUrl,
}: {
  fullName: string;
  email: string;
  phone?: string;
  positionTitle: string;
  experienceYears?: string;
  resumeUrl?: string;
}): Promise<BrevoResult> {
  const contentHtml = `
    <h1 class="email-heading">New Engineering Candidate Application</h1>
    <p>A candidate has applied for an engineering position on the AIRTECH careers portal:</p>

    <div class="info-box">
      <strong>Candidate Name:</strong> ${fullName}<br>
      <strong>Applied Role:</strong> ${positionTitle}<br>
      <strong>Email:</strong> <a href="mailto:${email}" style="color: #0284C7;">${email}</a><br>
      <strong>Phone:</strong> ${phone || "Not provided"}<br>
      <strong>Years of Experience:</strong> ${experienceYears || "Unspecified"}
    </div>

    ${
      resumeUrl
        ? `<p style="margin: 20px 0;"><a href="${resumeUrl}" style="color: #0284C7; font-weight: bold; text-decoration: underline;">Download Attached CV / Portfolio Document &rarr;</a></p>`
        : ""
    }

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://airtech-website-gules.vercel.app/admin#careers" class="btn-primary">Review Applications in Admin &rarr;</a>
    </div>
  `;

  return sendBrevoEmail({
    to: { email: ADMIN_EMAIL, name: "AIRTECH HR & Admin" },
    subject: `[Job Application] ${positionTitle} — ${fullName}`,
    htmlContent: airtechEmailWrapper({
      title: "New Job Application",
      preheader: `${fullName} applied for ${positionTitle}`,
      contentHtml,
    }),
    replyTo: { email, name: fullName },
    tags: ["recruitment", "admin-alert"],
  });
}

// ==============================================================================
// 8. ADMIN SECURITY ALERT
// ==============================================================================

export async function sendAdminSecurityAlert({
  eventTitle,
  details,
  metadata,
}: {
  eventTitle: string;
  details: string;
  metadata?: Record<string, unknown>;
}): Promise<BrevoResult> {
  const metaString = metadata ? JSON.stringify(metadata, null, 2) : "None";

  const contentHtml = `
    <h1 class="email-heading" style="color: #DC2626;">Security Event: ${eventTitle}</h1>
    <p>A high-priority governance or security event was recorded on the AIRTECH platform:</p>

    <div class="alert-box">
      <strong>Event:</strong> ${eventTitle}<br>
      <strong>Details:</strong> ${details}<br>
      <strong>Timestamp:</strong> ${new Date().toISOString()}
    </div>

    <div class="info-box">
      <strong>Audit Metadata:</strong><br>
      <pre style="margin: 4px 0 0 0; font-size: 11px; white-space: pre-wrap; word-break: break-all;">${metaString}</pre>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://airtech-website-gules.vercel.app/admin" class="btn-primary" style="background: #DC2626;">Open Admin Security Log &rarr;</a>
    </div>
  `;

  return sendBrevoEmail({
    to: { email: ADMIN_EMAIL, name: "AIRTECH Security Admin" },
    subject: `[SECURITY ALERT] AIRTECH: ${eventTitle}`,
    htmlContent: airtechEmailWrapper({
      title: "AIRTECH Security Alert",
      preheader: `Security Alert: ${eventTitle}`,
      contentHtml,
    }),
    tags: ["security", "admin-alert"],
  });
}

// ==============================================================================
// 9. RFI & DRAWING REVISION NOTIFICATION
// ==============================================================================

export async function sendRfiNotification({
  recipientEmail,
  rfiNumber,
  subject,
  projectName,
  status,
  responseNotes,
}: {
  recipientEmail: string;
  rfiNumber: string;
  subject: string;
  projectName: string;
  status: string;
  responseNotes?: string;
}): Promise<BrevoResult> {
  const contentHtml = `
    <h1 class="email-heading">RFI Status Update: ${rfiNumber}</h1>
    <p>There is an engineering status update for Request for Information <strong>${rfiNumber}</strong> on project <strong>${projectName}</strong>.</p>

    <div class="info-box">
      <strong>RFI Reference:</strong> ${rfiNumber}<br>
      <strong>Subject:</strong> ${subject}<br>
      <strong>Project:</strong> ${projectName}<br>
      <strong>Current Status:</strong> <span style="font-weight: 700; text-transform: uppercase;">${status}</span>
    </div>

    ${
      responseNotes
        ? `<div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 6px; margin: 16px 0;">
             <strong>Engineering Notes:</strong><br>
             <p style="margin: 8px 0 0 0; font-size: 13px; line-height: 1.5;">${responseNotes}</p>
           </div>`
        : ""
    }

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://airtech-website-gules.vercel.app/portal-access" class="btn-primary">View in Engineering Portal &rarr;</a>
    </div>
  `;

  return sendBrevoEmail({
    to: { email: recipientEmail },
    subject: `[RFI ${status.toUpperCase()}] ${rfiNumber} — ${projectName}`,
    htmlContent: airtechEmailWrapper({
      title: "RFI Update",
      preheader: `RFI ${rfiNumber} update for ${projectName}: ${status}`,
      contentHtml,
    }),
    tags: ["rfi", "project-engineering"],
  });
}
