// ==============================================================================
// AIRTECH MEP ENGINEERING CONSULTANCY — CENTRAL EMAIL SENDER ADAPTER
// Backwards-compatible facade routing to Brevo Transactional Email Service
// ==============================================================================

import {
  sendBrevoEmail,
  airtechEmailWrapper,
  SendBrevoEmailParams,
  BrevoResult,
} from "./brevo";

export interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a transactional email using the official Brevo Transactional Email API.
 */
export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
  textContent,
}: SendEmailParams): Promise<SendEmailResult> {
  const result: BrevoResult = await sendBrevoEmail({
    to,
    subject,
    htmlContent,
    textContent,
  });

  return {
    success: result.success,
    messageId: result.messageId,
    error: result.error,
  };
}

/**
 * Builds standard AIRTECH branded HTML template for 6-digit OTP delivery
 */
export function buildOtpEmailHtml(otpCode: string, expiryMinutes: number = 5): string {
  const content = `
    <h1 style="color: #07172C; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Sign-In Security Code</h1>
    <p style="color: #334155; font-size: 14px; line-height: 1.6;">A sign-in request was initiated for your AIRTECH Engineering Portal account. Use the one-time security code below to complete your authentication:</p>
    
    <div style="background-color: #F8FAFC; border: 1px solid #BAE6FD; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0284C7; margin-bottom: 6px;">One-Time Passcode</div>
      <div style="font-family: 'SFMono-Regular', Consolas, 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 0.3em; color: #07172C; text-indent: 0.3em;">${otpCode}</div>
      <div style="display: inline-block; background: #E0F2FE; color: #0369A1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 12px; border-radius: 9999px; margin-top: 8px;">Valid for ${expiryMinutes} Minutes</div>
    </div>

    <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; padding: 12px 16px; font-size: 12px; color: #92400E; margin: 20px 0;">
      <strong>Security Notice:</strong>
      <ul style="margin: 6px 0 0 0; padding-left: 20px;">
        <li>This code is valid for <strong>${expiryMinutes} minutes</strong> only.</li>
        <li>It can be used exactly once and will expire automatically.</li>
        <li>Never share this code with anyone. AIRTECH engineering staff will never ask for your verification code.</li>
      </ul>
    </div>
  `;

  return airtechEmailWrapper({
    title: "AIRTECH Security Code",
    preheader: `Your verification code is ${otpCode}. Valid for ${expiryMinutes} minutes.`,
    contentHtml: content,
  });
}
