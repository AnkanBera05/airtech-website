import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
    const { data: invoice, error: invError } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (invError || !invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    // 2. Insert pending manual payment record for Finance Admin verification
    const { data: payment, error: payError } = await supabaseAdmin
      .from("payments")
      .insert({
        invoice_id: invoiceId,
        client_id: clientId || invoice.client_id,
        amount: Number(amount),
        currency: currency || invoice.currency || "INR",
        gateway: gateway || "manual_bank_transfer",
        status: "processing", // Requires Finance Admin approval before invoice is marked paid
        bank_reference_utr: bankReferenceUtr.trim(),
        notes: notes || "Manual NEFT/RTGS/UPI deposit declared by client. Awaiting bank clearance.",
      })
      .select()
      .single();

    if (payError) {
      return NextResponse.json({ error: payError.message }, { status: 500 });
    }

    // 3. Notify Finance Admins
    await supabaseAdmin.from("notifications").insert({
      user_id: invoice.created_by,
      title: `Manual Payment Submitted: ${invoice.invoice_number}`,
      message: `Client submitted UTR ${bankReferenceUtr} for ₹${amount}. Awaiting bank statement verification.`,
      type: "invoice",
      action_url: `/portal/finance/payments`,
    });

    return NextResponse.json({
      success: true,
      message: "Payment receipt logged. Our finance department will verify bank credit within 1 business day.",
      payment,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing manual payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
