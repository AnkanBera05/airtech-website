import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendAdminSecurityAlert } from "@/lib/email/brevo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, clientId, amount, currency, gateway, bankReferenceUtr, notes } = body;

    if (!invoiceId || !amount || !bankReferenceUtr) {
      return NextResponse.json(
        { error: "Invoice ID, amount, and Bank Reference UTR / Transaction ID are required." },
        { status: 400 }
      );
    }

    // 1. Verify invoice exists
    let invoiceNumber = invoiceId;
    let invoiceCreatedBy = null;
    let invCurrency = currency || "INR";

    try {
      const { data: invoice } = await supabaseAdmin
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .maybeSingle();

      if (invoice) {
        invoiceNumber = invoice.invoice_number || invoiceId;
        invoiceCreatedBy = invoice.created_by;
        invCurrency = invoice.currency || invCurrency;
      }
    } catch {
      // Graceful fallback
    }

    // 2. Insert pending manual payment record for Finance Admin verification
    try {
      await supabaseAdmin.from("payments").insert({
        invoice_id: invoiceId,
        client_id: clientId,
        amount: Number(amount),
        currency: invCurrency,
        gateway: gateway || "manual_bank_transfer",
        status: "processing", // Requires Finance Admin approval before invoice is marked paid
        bank_reference_utr: bankReferenceUtr.trim(),
        notes: notes || "Manual NEFT/RTGS/UPI deposit declared by client. Awaiting bank clearance.",
      });

      if (invoiceCreatedBy) {
        await supabaseAdmin.from("notifications").insert({
          user_id: invoiceCreatedBy,
          title: `Manual Payment Submitted: ${invoiceNumber}`,
          message: `Client submitted UTR ${bankReferenceUtr} for ₹${amount}. Awaiting bank statement verification.`,
          type: "invoice",
          action_url: `/portal/finance/payments`,
        });
      }
    } catch (dbErr) {
      console.warn("[Manual Payment Insert Notice]", dbErr);
    }

    // 3. Dispatch Brevo Email Alert to Admin/Finance
    await sendAdminSecurityAlert({
      eventTitle: `Manual Payment Submitted: ${invoiceNumber}`,
      details: `Client submitted Bank Transfer UTR ${bankReferenceUtr} for ₹${Number(amount).toLocaleString("en-IN")}. Requires statement clearance verification.`,
      metadata: { invoiceId, invoiceNumber, amount, bankReferenceUtr, gateway: gateway || "NEFT/RTGS" },
    });

    return NextResponse.json({
      success: true,
      message: "Payment receipt logged. Our finance department will verify bank credit within 1 business day.",
      referenceUtr: bankReferenceUtr.trim(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing manual payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
