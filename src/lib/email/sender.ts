// ==============================================================================
// AIRTECH MEP ENGINEERING CONSULTANCY — TRANSACTIONAL EMAIL SERVICE
// ==============================================================================

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a transactional email using the configured provider (Resend / SMTP).
 * Respects strict security rules:
 * - If not configured, safely reports that email delivery is not configured.
 * - NEVER simulates successful delivery or prints sensitive OTPs to public logs.
 */
export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
}: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || "AIRTECH Engineering <notifications@airtech-mep.com>";

  if (!apiKey || apiKey.startsWith("re_123456789")) {
    return {
      success: false,
      error: "Transactional email provider (EMAIL_PROVIDER_API_KEY) is not configured in the environment. Please configure your email service.",
    };
  }

  try {
    // Send via Resend REST API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Email provider rejected message: ${errorData.message || response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.id,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network error during email dispatch";
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Builds standard AIRTECH branded HTML template for 6-digit OTP delivery
 */
export function buildOtpEmailHtml(otpCode: string, expiryMinutes: number = 5): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 24px; color: #101828; }
    .card { max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #E4E7EC; border-radius: 8px; padding: 36px 32px; }
    .header { border-bottom: 2px solid #0B192C; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 20px; font-weight: 700; color: #0B192C; letter-spacing: -0.02em; }
    .subtitle { font-size: 13px; color: #667085; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
    .otp-box { background: #F4F8FC; border: 1px solid #D3E4F4; border-radius: 6px; text-align: center; padding: 20px; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.25em; color: #0B192C; }
    .notice { font-size: 13px; color: #475467; line-height: 1.6; margin-top: 16px; }
    .footer { margin-top: 32px; border-top: 1px solid #F2F4F7; padding-top: 16px; font-size: 12px; color: #98A2B3; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">AIRTECH</div>
      <div class="subtitle">HVAC & MEP Engineering Consultancy • Kolkata</div>
    </div>
    <p>Dear Colleague / Client,</p>
    <p class="notice">A sign-in request was initiated for your AIRTECH Engineering Portal account. Use the one-time security code below to complete your authentication:</p>
    
    <div class="otp-box">
      <div class="otp-code">${otpCode}</div>
    </div>

    <p class="notice">
      • This code is valid for <strong>${expiryMinutes} minutes</strong> only.<br>
      • It can be used exactly once and will expire automatically.<br>
      • Never share this verification code with anyone. AIRTECH engineering staff will never ask for your OTP.
    </p>

    <div class="footer">
      AIRTECH MEP Engineering Consultancy • Rajarhat Gopalpur, Kolkata - 700136, India<br>
      This is an automated system security notification.
    </div>
  </div>
</body>
</html>
  `.trim();
}
