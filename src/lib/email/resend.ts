import { Resend } from "resend";

// Initialize Resend client safely
const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "AIRTECH Engineering <notifications@airtech-mep.com>";

export const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "bera.ankan005@gmail.com";

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Core helper to dispatch emails through Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<EmailResult> {
  if (!resend) {
    console.warn("[Resend Warning] RESEND_API_KEY is not configured in environment. Skipping email dispatch.");
    return {
      success: false,
      error: "RESEND_API_KEY is not configured in the environment variables.",
    };
  }

  try {
    const recipients = Array.isArray(to) ? to : [to];
    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: recipients,
      subject,
      html,
      replyTo: replyTo || "support@airtech-mep.com",
    });

    if (error) {
      console.error("[Resend Error]", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network error during email dispatch";
    console.error("[Resend Exception]", errorMsg);
    return { success: false, error: errorMsg };
  }
}

// =============================================================================
// EMAIL TEMPLATES & DISPATCH WORKFLOWS
// =============================================================================

function baseEmailWrapper(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6F8; margin: 0; padding: 24px; color: #10243A; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #DCE3E8; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(16,36,58,0.06); }
    .header { background: #0B192C; padding: 24px 32px; border-bottom: 3px solid #245B85; }
    .header-logo { color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
    .header-tagline { color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
    .body { padding: 32px; }
    .title { font-size: 18px; font-weight: 700; color: #0B192C; margin: 0 0 16px 0; }
    .text { font-size: 13px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
    .highlight-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 3px solid #245B85; padding: 16px; border-radius: 2px; margin: 20px 0; font-size: 12px; font-family: monospace; }
    .button-container { margin: 28px 0; text-align: center; }
    .button { display: inline-block; background: #0B192C; color: #ffffff !important; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 28px; text-decoration: none; border-radius: 2px; }
    .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 32px; font-size: 11px; color: #64748B; text-align: center; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">▲ AIRTECH</div>
      <div class="header-tagline">HVAC & MEP Engineering Consultancy • Kolkata HQ</div>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      AIRTECH Engineering Consultancy • Rajarhat Gopalpur, Kolkata - 700136, India<br>
      Independent technical advisory for critical facilities, hospitals, and commercial infrastructure.<br>
      This is an automated system notification.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1. Registration Welcome Notification
 */
export async function sendWelcomeEmail({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
  role: string;
}) {
  const content = `
    <h2 class="title">Welcome to the AIRTECH Engineering Platform</h2>
    <p class="text">Dear ${name},</p>
    <p class="text">Your account registration for the <strong>AIRTECH ${role.toUpperCase()} Workspace</strong> has been received and authenticated.</p>
    <div class="highlight-box">
      <strong>User Identity:</strong> ${email}<br>
      <strong>Assigned Role:</strong> ${role.toUpperCase()}<br>
      <strong>Security Level:</strong> Row Level Security (RLS) Enforced
    </div>
    <p class="text">You can now access your dedicated project portals, view approved drawings, submit technical queries, or collaborate with our engineering team.</p>
    <div class="button-container">
      <a href="https://airtech-website-gules.vercel.app/portal-access" class="button">Access Your Portal →</a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to AIRTECH — Your Enterprise Account is Active",
    html: baseEmailWrapper("Welcome to AIRTECH", content),
  });
}

/**
 * 2. Admin Security Alert Notification
 */
export async function sendAdminSecurityAlert({
  eventTitle,
  details,
  metadata,
}: {
  eventTitle: string;
  details: string;
  metadata?: Record<string, unknown>;
}) {
  const metaString = metadata ? JSON.stringify(metadata, null, 2) : "None";
  const content = `
    <h2 class="title" style="color: #DC2626;">Security Alert: ${eventTitle}</h2>
    <p class="text">An important security or governance event occurred on the AIRTECH platform:</p>
    <p class="text">${details}</p>
    <div class="highlight-box">
      <strong>Timestamp:</strong> ${new Date().toISOString()}<br>
      <strong>Context:</strong><br>
      <pre style="margin: 4px 0 0 0; font-size: 11px;">${metaString}</pre>
    </div>
    <div class="button-container">
      <a href="https://airtech-website-gules.vercel.app/admin" class="button">Open Admin Console →</a>
    </div>
  `;

  return sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `[SECURITY ALERT] AIRTECH: ${eventTitle}`,
    html: baseEmailWrapper("AIRTECH Security Alert", content),
  });
}

/**
 * 3. New Contact Enquiry Notification
 */
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
}) {
  const content = `
    <h2 class="title">New Client Project Enquiry Received</h2>
    <p class="text">A new prospective client or partner submitted a technical enquiry through the AIRTECH public website:</p>
    <div class="highlight-box">
      <strong>Sender Name:</strong> ${fullName}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Phone:</strong> ${phone || "Not provided"}<br>
      <strong>Organization:</strong> ${organization || "Individual"}<br>
      <strong>Received:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
    </div>
    <p class="text"><strong>Message Scope / Requirements:</strong></p>
    <p class="text" style="background: #F1F5F9; padding: 12px; border-radius: 4px; font-style: italic;">"${message}"</p>
    <div class="button-container">
      <a href="https://airtech-website-gules.vercel.app/admin#enquiries" class="button">Review & Respond in CMS →</a>
    </div>
  `;

  return sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `[New Enquiry] from ${fullName} (${organization || "Client"})`,
    html: baseEmailWrapper("New Project Enquiry", content),
    replyTo: email,
  });
}

/**
 * 4. Career Application Notification
 */
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
}) {
  const content = `
    <h2 class="title">New Engineering Candidate Application</h2>
    <p class="text">A candidate has submitted an application for an open engineering role at AIRTECH:</p>
    <div class="highlight-box">
      <strong>Candidate:</strong> ${fullName}<br>
      <strong>Applied Position:</strong> ${positionTitle}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Contact:</strong> ${phone || "Not provided"}<br>
      <strong>Experience:</strong> ${experienceYears || "Unspecified"}
    </div>
    ${resumeUrl ? `<p class="text"><a href="${resumeUrl}" style="color: #245B85; font-weight: bold;">Download Attached CV / Resume →</a></p>` : ""}
    <div class="button-container">
      <a href="https://airtech-website-gules.vercel.app/admin#careers" class="button">View Applications in Admin →</a>
    </div>
  `;

  return sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `[Job Application] ${positionTitle} — ${fullName}`,
    html: baseEmailWrapper("New Job Application", content),
    replyTo: email,
  });
}

/**
 * 5. Account Approval Notification
 */
export async function sendAccountApprovalNotification({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
  role: string;
}) {
  const portalPath = role === "employee" ? "/employee" : role === "admin" || role === "owner" ? "/admin" : "/client";
  const content = `
    <h2 class="title">Your Account Has Been Approved</h2>
    <p class="text">Dear ${name},</p>
    <p class="text">An administrator has reviewed and officially approved your registration for the <strong>AIRTECH ${role.toUpperCase()} Workspace</strong>.</p>
    <div class="highlight-box">
      <strong>Account:</strong> ${email}<br>
      <strong>Authorized Role:</strong> ${role.toUpperCase()}<br>
      <strong>Access Status:</strong> ACTIVE
    </div>
    <div class="button-container">
      <a href="https://airtech-website-gules.vercel.app${portalPath}" class="button">Login to Your Portal →</a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "AIRTECH Portal Access Approved",
    html: baseEmailWrapper("Account Approved", content),
  });
}

/**
 * 6. RFI Notification (Submitted or Responded)
 */
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
}) {
  const content = `
    <h2 class="title">RFI Update: ${rfiNumber}</h2>
    <p class="text">There is an update on Request for Information <strong>${rfiNumber}</strong> for project <strong>${projectName}</strong>.</p>
    <div class="highlight-box">
      <strong>RFI Ref:</strong> ${rfiNumber}<br>
      <strong>Subject:</strong> ${subject}<br>
      <strong>Project:</strong> ${projectName}<br>
      <strong>Current Status:</strong> ${status.toUpperCase()}
    </div>
    ${responseNotes ? `<p class="text"><strong>Engineering Response:</strong><br>${responseNotes}</p>` : ""}
    <div class="button-container">
      <a href="https://airtech-website-gules.vercel.app/portal-access" class="button">View RFI Register →</a>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `[RFI Status: ${status}] ${rfiNumber} — ${projectName}`,
    html: baseEmailWrapper("RFI Notification", content),
  });
}
