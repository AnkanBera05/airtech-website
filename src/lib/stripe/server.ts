// ==============================================================================
// AIRTECH MEP ENGINEERING CONSULTANCY — STRIPE SERVER INTEGRATION
// ==============================================================================

import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

if (typeof window !== "undefined") {
  throw new Error("SECURITY ALERT: Stripe server SDK must never be loaded client-side.");
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as any, // Current supported Stripe API version
  typescript: true,
});

export interface CreateCheckoutSessionParams {
  invoiceId: string;
  clientId: string;
  clientEmail: string;
  clientName: string;
  amount: number; // In Major Units (e.g., INR 1445500.00)
  currency?: string;
  invoiceNumber: string;
  projectName?: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Creates a server-side Stripe Checkout Session for an AIRTECH invoice.
 * Validates invoice status and calculates unit amounts strictly in minor currency units (paise/cents).
 */
export async function createInvoiceCheckoutSession({
  invoiceId,
  clientId,
  clientEmail,
  clientName,
  amount,
  currency = "inr",
  invoiceNumber,
  projectName = "AIRTECH Engineering Services",
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams): Promise<{ sessionId: string; sessionUrl: string }> {
  // 1. Fetch and double-check the real invoice on the server to prevent client-side amount tampering
  const { data: invoice, error: invoiceError } = await supabaseAdmin
    .from("invoices")
    .select("*, client:organizations(*)")
    .eq("id", invoiceId)
    .single();

  if (invoiceError || !invoice) {
    throw new Error("Invoice not found or inaccessible.");
  }

  if (invoice.status === "paid") {
    throw new Error("Invoice is already marked as fully paid.");
  }

  if (invoice.status === "cancelled") {
    throw new Error("Cannot pay a cancelled invoice.");
  }

  // 2. Validate amount matches the outstanding balance
  const outstandingAmount = Number(invoice.balance_amount);
  if (Math.abs(outstandingAmount - amount) > 0.01) {
    throw new Error(`Amount mismatch: expected ${invoice.currency} ${outstandingAmount}, got ${amount}`);
  }

  // 3. Convert to minor currency units (paise for INR, cents for USD)
  const unitAmountInMinor = Math.round(outstandingAmount * 100);

  // 4. Create hosted Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: clientEmail,
    client_reference_id: invoiceId,
    metadata: {
      invoiceId,
      invoiceNumber,
      clientId,
      clientName,
      source: "airtech_portal",
    },
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Invoice ${invoiceNumber} — ${projectName}`,
            description: `Professional MEP Engineering Services. HSN/SAC: 998333. Subject to Indian GST.`,
          },
          unit_amount: unitAmountInMinor,
        },
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoiceId}`,
    cancel_url: `${cancelUrl}?invoice_id=${invoiceId}`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a valid checkout session URL.");
  }

  // 5. Pre-register the pending payment record in Supabase
  await supabaseAdmin.from("payments").insert({
    invoice_id: invoiceId,
    client_id: clientId,
    amount: outstandingAmount,
    currency: currency.toUpperCase(),
    gateway: "stripe",
    status: "pending",
    stripe_session_id: session.id,
    notes: `Stripe Checkout Session initialized for ${invoiceNumber}`,
  });

  return {
    sessionId: session.id,
    sessionUrl: session.url,
  };
}

/**
 * Handles Stripe webhook events idempotently and securely
 */
export async function handleStripeWebhookEvent(rawBody: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret.startsWith("whsec_placeholder")) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }

  // 1. Verify cryptographic signature
  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

  // 2. Idempotency Check: Verify if we already processed this event
  const { data: existingTx } = await supabaseAdmin
    .from("payment_transactions")
    .select("id")
    .eq("event_id", event.id)
    .single();

  if (existingTx) {
    return { status: "duplicate", eventType: event.type };
  }

  // 3. Process Event by Type
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const invoiceId = session.metadata?.invoiceId || session.client_reference_id;

      if (!invoiceId) {
        throw new Error("Missing invoiceId in session metadata.");
      }

      // Fetch invoice
      const { data: invoice } = await supabaseAdmin
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();

      if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found during webhook processing.`);
      }

      const paidAmount = (session.amount_total || 0) / 100;
      const newPaidTotal = Number(invoice.paid_amount) + paidAmount;
      const newBalance = Math.max(0, Number(invoice.total_amount) - newPaidTotal);
      const newStatus = newBalance <= 0.01 ? "paid" : "partially_paid";

      // Update payment record
      const { data: paymentRecord } = await supabaseAdmin
        .from("payments")
        .update({
          status: "succeeded",
          stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
          paid_at: new Date().toISOString(),
          notes: `Stripe checkout completed successfully. Amount: ${session.currency?.toUpperCase()} ${paidAmount}`,
        })
        .eq("stripe_session_id", session.id)
        .select()
        .single();

      // Update invoice balances
      await supabaseAdmin
        .from("invoices")
        .update({
          paid_amount: newPaidTotal,
          balance_amount: newBalance,
          status: newStatus,
        })
        .eq("id", invoiceId);

      // Record idempotent transaction log
      if (paymentRecord) {
        await supabaseAdmin.from("payment_transactions").insert({
          payment_id: paymentRecord.id,
          event_type: event.type,
          event_id: event.id,
          payload: event as any,
        });
      }

      // Send in-app notification to client and finance administrators
      await supabaseAdmin.from("notifications").insert({
        user_id: invoice.created_by,
        title: `Payment Received: ${invoice.invoice_number}`,
        message: `Stripe payment of ${invoice.currency} ${paidAmount.toLocaleString()} verified for ${invoice.invoice_number}.`,
        type: "invoice",
        action_url: `/portal/finance/invoices/${invoiceId}`,
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      await supabaseAdmin
        .from("payments")
        .update({
          status: "failed",
          notes: `Payment failed: ${pi.last_payment_error?.message || "Unknown bank decline"}`,
        })
        .eq("stripe_payment_intent_id", pi.id);
      break;
    }

    default:
      // Other unhandled events logged gracefully
      break;
  }

  return { status: "processed", eventType: event.type };
}
