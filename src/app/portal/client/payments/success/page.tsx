import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { CheckCircle2, ArrowRight, ShieldCheck, FileText } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <PortalLayout portalTitle="Payment Confirmation" userRole="client" userEmail="projects@apollo-kolkata.com">
      <div className="max-w-2xl mx-auto py-12">
        <div className="border border-steel-300 bg-white p-8 rounded-sm text-center shadow-panel space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="text-xs font-mono font-semibold uppercase text-airtech-blue">
            Stripe Checkout Completed
          </div>

          <h1 className="text-2xl font-bold text-airtech-navy tracking-tight">
            Payment Processing Received
          </h1>

          <p className="text-xs text-airtech-muted leading-relaxed max-w-md mx-auto">
            Thank you. Your transaction has been recorded. Once Stripe's signed cryptographic webhook is verified by the AIRTECH backend, your invoice balance will automatically update.
          </p>

          <div className="p-4 bg-airtech-offwhite border border-steel-200 rounded-sm text-xs font-mono text-steel-700 max-w-md mx-auto text-left space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Idempotent Webhook Verification Enforced</span>
            </div>
            <div>Beneficiary: AIRTECH (Kolkata)</div>
            <div>Statutory Tax: 18% Indian GST (SAC 998333)</div>
          </div>

          <div className="pt-4">
            <Link
              href="/client"
              className="inline-flex items-center gap-2 bg-airtech-navy hover:bg-airtech-dark text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors"
            >
              <span>Return to Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
