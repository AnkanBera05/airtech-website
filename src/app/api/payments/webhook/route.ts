import { NextRequest, NextResponse } from "next/server";
import { handleStripeWebhookEvent } from "@/lib/stripe/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header." },
        { status: 400 }
      );
    }

    const result = await handleStripeWebhookEvent(rawBody, signature);

    return NextResponse.json({ received: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
