import { NextRequest, NextResponse } from "next/server";
import { createInvoiceCheckoutSession } from "@/lib/stripe/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, clientId, clientEmail, clientName, amount, currency, invoiceNumber, projectName } = body;

    if (!invoiceId || !amount || !invoiceNumber) {
      return NextResponse.json(
        { error: "Missing required invoice parameters for Stripe checkout." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${appUrl}/portal/client/payments/success`;
    const cancelUrl = `${appUrl}/portal/client/invoices/${invoiceId}`;

    const { sessionId, sessionUrl } = await createInvoiceCheckoutSession({
      invoiceId,
      clientId: clientId || "client-id",
      clientEmail: clientEmail || "client@company.com",
      clientName: clientName || "Client Representative",
      amount: Number(amount),
      currency: currency || "inr",
      invoiceNumber,
      projectName,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      success: true,
      sessionId,
      sessionUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to initialize Stripe checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
