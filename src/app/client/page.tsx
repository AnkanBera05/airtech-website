"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { 
  Building2, 
  Layers, 
  Receipt, 
  CreditCard, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  RefreshCw,
  QrCode,
  FileCheck2,
  Calendar
} from "lucide-react";

export default function ClientPortalPage() {
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedInvoiceForManual, setSelectedInvoiceForManual] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [manualSuccess, setManualSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const kpis = [
    { label: "Active Projects", value: "3", sub: "Currently engaged", color: "text-navy-950" },
    { label: "Pending Approvals", value: "2", sub: "Drawing R2 & Submittal", color: "text-amber-600" },
    { label: "Due Amount", value: "₹ 24.50 L", sub: "Current billing cycle", color: "text-airtech-blue" },
    { label: "Upcoming Meeting", value: "1", sub: "16 Mar • Site Coordination", color: "text-emerald-600" },
  ];

  const projectProgress = [
    { name: "City Hospital", progress: 78, phase: "Detailed Engineering" },
    { name: "Retail Mall", progress: 46, phase: "Concept & Schematics" },
    { name: "Office Tower", progress: 92, phase: "GFC Drawings & Testing" },
  ];

  const recentUpdates = [
    {
      id: "up-1",
      title: "Drawing R2 for approval",
      project: "City Hospital",
      time: "1 day ago",
      type: "drawing",
    },
    {
      id: "up-2",
      title: "RFI-021 response submitted",
      project: "Retail Mall",
      time: "2 days ago",
      type: "rfi",
    },
    {
      id: "up-3",
      title: "Invoice INV-0387 generated",
      project: "Office Tower",
      time: "3 days ago",
      type: "invoice",
    },
  ];

  const pendingInvoices = [
    {
      number: "INV-2026-0387",
      project: "Office Tower",
      description: "Milestone 3: GFC Drawings & Composite Services Sign-off",
      amount: "₹12,50,000",
      amountNumeric: 1250000,
      dueDate: "2026-03-25",
      status: "Payment Due",
    },
    {
      number: "INV-2026-0342",
      project: "City Hospital",
      description: "Milestone 2: Modular OT Ventilation & Medical Gas Schematics",
      amount: "₹12,00,000",
      amountNumeric: 1200000,
      dueDate: "2026-03-30",
      status: "Payment Due",
    },
  ];

  // Handle Stripe Hosted Checkout
  const handleStripeCheckout = async (invoice: { number: string; amountNumeric: number; description: string }) => {
    setCheckoutError(null);
    setPayingInvoice(invoice.number);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: invoice.number,
          amount: invoice.amountNumeric,
          clientEmail: "accounts@abcdevelopments.com",
          clientName: "ABC Developments Ltd",
          description: invoice.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to initiate payment session.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment processing error";
      setCheckoutError(msg);
      setPayingInvoice(null);
    }
  };

  // Handle Offline Bank Transfer UTR Submission
  const handleManualPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) return;

    try {
      const res = await fetch("/api/payments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: selectedInvoiceForManual || "INV-2026-0387",
          utrNumber: utrNumber.trim(),
          paymentMode: "neft",
          amount: 1250000,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to log UTR reference.");
      }

      setManualSuccess(true);
      setTimeout(() => {
        setManualSuccess(false);
        setShowManualModal(false);
        setUtrNumber("");
      }, 3000);
    } catch {
      setCheckoutError("Failed to record UTR reference.");
    }
  };

  return (
    <PortalLayout userRole="client" userEmail="accounts@abcdevelopments.com" portalTitle="Client Portal">
      {/* Header (Matching Panel 17) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-steel-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950">
            Client Dashboard
          </h1>
          <p className="text-xs text-steel-500 mt-0.5">
            Welcome, ABC Developments! Review deliverables, drawing revisions, and invoices.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="text-[11px] font-mono bg-slate-100 text-navy-900 border border-slate-300 px-3 py-1 rounded-sm flex items-center gap-1.5 font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>ABC Developments Ltd</span>
          </span>
        </div>
      </div>

      {checkoutError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{checkoutError}</span>
        </div>
      )}

      {/* 4 KPI Cards (Matching Panel 17) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm">
            <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${kpi.color}`}>
              {kpi.value}
            </div>
            <div className="text-xs font-semibold text-navy-950 mt-1">
              {kpi.label}
            </div>
            <div className="text-[11px] text-steel-400 mt-0.5 font-mono">
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-Column Split (Matching Panel 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left 6 Columns: Project Progress Bars */}
        <div className="lg:col-span-6 bg-white border border-steel-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-navy-950">
                Project Progress
              </h2>
              <span className="text-xs font-mono text-steel-400">Milestone Completion</span>
            </div>

            <div className="space-y-5 py-2">
              {projectProgress.map((proj) => (
                <div key={proj.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy-950">{proj.name}</span>
                    <span className="font-mono font-bold text-airtech-blue">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-steel-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-navy-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-steel-400 font-mono">
                    Phase: {proj.phase}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-steel-100 flex items-center justify-between text-xs text-steel-500">
            <span>Overall Portfolio Progress: 72%</span>
            <a href="#projects" className="text-airtech-blue font-semibold hover:underline">
              View All Milestones →
            </a>
          </div>
        </div>

        {/* Right 6 Columns: Recent Updates (Matching Panel 17) */}
        <div className="lg:col-span-6 bg-white border border-steel-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-navy-950">
                Recent Updates
              </h2>
              <span className="text-xs font-mono text-steel-400">Activity Log</span>
            </div>

            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex items-start gap-3 p-3.5 bg-steel-50 rounded-sm border border-steel-200">
                  <div className="w-2 h-2 rounded-full bg-navy-900 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-navy-950">
                      {update.title}
                    </div>
                    <div className="text-[11px] text-steel-500">
                      Project: <strong className="text-navy-900">{update.project}</strong>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-steel-400 shrink-0">
                    {update.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-steel-100 mt-4 text-right">
            <a href="#drawings" className="text-xs font-semibold text-airtech-blue hover:underline">
              Review Drawings Register →
            </a>
          </div>
        </div>
      </div>

      {/* Commercial Invoicing & Payment Processing */}
      <div id="invoices" className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-steel-200">
          <div>
            <h2 className="text-base font-bold text-navy-950">
              Outstanding Invoices & Settlement
            </h2>
            <p className="text-xs text-steel-500">
              Select an invoice to settle via Stripe card payment or submit NEFT/RTGS/UPI bank UTR reference.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200">
            GST HSN Code: 998333 (18%)
          </span>
        </div>

        <div className="space-y-4">
          {pendingInvoices.map((inv) => (
            <div
              key={inv.number}
              className="border border-steel-300 rounded-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-steel-50/50"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-airtech-blue">
                    {inv.number}
                  </span>
                  <span className="text-xs font-semibold text-navy-950">
                    • {inv.project}
                  </span>
                </div>
                <div className="text-xs text-steel-600 mt-1">
                  {inv.description}
                </div>
                <div className="text-[11px] font-mono text-steel-400 mt-1">
                  Due: {inv.dueDate}
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <div className="text-lg font-bold font-mono text-navy-950">
                  {inv.amount}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleStripeCheckout(inv)}
                    disabled={payingInvoice === inv.number}
                    className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold px-4 py-2 rounded-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 flex-1 sm:flex-initial"
                  >
                    {payingInvoice === inv.number ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay via Stripe</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedInvoiceForManual(inv.number);
                      setShowManualModal(true);
                    }}
                    className="bg-white hover:bg-steel-100 text-navy-950 border border-steel-300 text-xs font-semibold px-4 py-2 rounded-sm transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                  >
                    <QrCode className="w-3.5 h-3.5 text-steel-600" />
                    <span>Bank Transfer / UPI</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bank Transfer Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-steel-300 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-navy-950 mb-1">
              Bank Transfer / UPI Settlement
            </h3>
            <p className="text-xs text-steel-500 mb-4">
              Invoice Reference: <strong className="font-mono text-navy-900">{selectedInvoiceForManual}</strong>
            </p>

            <div className="bg-steel-50 border border-steel-200 rounded-sm p-4 text-xs font-mono text-steel-700 space-y-1 mb-4">
              <div>Bank: HDFC Bank Ltd</div>
              <div>Account Name: AIRTECH Engineering Consultancy</div>
              <div>Account No: 50200088991122</div>
              <div>IFSC: HDFC0001234</div>
              <div>UPI VPA: airtech.mep@hdfcbank</div>
            </div>

            {manualSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>UTR logged successfully. Our finance team will verify and reconcile.</span>
              </div>
            ) : (
              <form onSubmit={handleManualPaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">
                    Bank UTR / IMPS / UPI Reference No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC20261101987654"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-navy-950 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="text-xs text-steel-600 hover:text-navy-950 px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold px-5 py-2 rounded-sm"
                  >
                    Submit Reference
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
