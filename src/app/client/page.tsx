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
  QrCode
} from "lucide-react";

export default function ClientPortalPage() {
  const [payingInvoice, setPayingInvoice] = useState<string | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [manualSuccess, setManualSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Client-specific verified records for Apollo Multispeciality Hospitals Ltd
  const clientProject = {
    code: "AT-2026-HOSP-01",
    name: "Apollo Eastern Wing Super-Speciality Expansion",
    organization: "Apollo Multispeciality Hospitals Ltd",
    city: "Kolkata",
    status: "Detailed Engineering & GFC Phase",
    disciplines: "HVAC • Fire Protection • PHE • Electrical • BMS",
    leadConsultant: "Senior HVAC Technical Advisor",
    progress: "60%",
  };

  const approvedDrawings = [
    {
      number: "AT-HOSP-HVAC-DWG-001",
      title: "Chiller Plant Room Primary/Secondary Piping Layout",
      rev: "R1",
      approvalDate: "2026-10-18",
      cad: "ZWCAD GFC",
      status: "Approved for Construction",
    },
    {
      number: "AT-HOSP-HVAC-DWG-002",
      title: "Modular OT Laminar Flow Diffuser & HEPA Ceiling Scheme",
      rev: "R2",
      approvalDate: "2026-10-24",
      cad: "ZWCAD GFC",
      status: "Approved for Construction",
    },
  ];

  const clientInvoices = [
    {
      id: "inv-2222222-2222-2222-2222-222222222222",
      number: "INV-2026-0042",
      milestone: "Milestone 2: Detailed Design & BOQ Preparation (35%)",
      dueDate: "2026-11-10",
      subtotal: 1225000.0,
      gst: 220500.0, // 18% GST (9% CGST + 9% SGST)
      totalAmount: 1445500.0,
      balance: 1445500.0,
      status: "Issued",
    },
    {
      id: "inv-1111111-1111-1111-1111-111111111111",
      number: "INV-2026-0041",
      milestone: "Milestone 1: Heat Load & Schematic Concept (25%)",
      dueDate: "2026-09-05",
      subtotal: 875000.0,
      gst: 157500.0,
      totalAmount: 1032500.0,
      balance: 0.0,
      status: "Paid",
      paymentRef: "STRIPE_CH_98234",
    },
  ];

  // Initiate Stripe Hosted Checkout
  const handlePayNowStripe = async (inv: typeof clientInvoices[0]) => {
    setPayingInvoice(inv.number);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: inv.id,
          invoiceNumber: inv.number,
          clientId: "11111111-1111-1111-1111-111111111111",
          clientEmail: "projects@apollo-kolkata.com",
          clientName: "Apollo Multispeciality Hospitals Ltd",
          amount: inv.balance,
          currency: "inr",
          projectName: clientProject.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCheckoutError(data.error || "Failed to create Stripe payment session.");
        setPayingInvoice(null);
        return;
      }

      // Redirect client to Stripe Hosted Checkout
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch {
      setCheckoutError("Stripe checkout server could not be reached.");
      setPayingInvoice(null);
    }
  };

  const handleManualPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber) return;

    try {
      const res = await fetch("/api/payments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: clientInvoices[0].id,
          amount: clientInvoices[0].balance,
          bankReferenceUtr: utrNumber,
          notes: "Manual NEFT/RTGS transfer reported by Apollo accounts.",
        }),
      });

      if (res.ok) {
        setManualSuccess(true);
        setTimeout(() => {
          setShowManualModal(false);
          setManualSuccess(false);
          setUtrNumber("");
        }, 3000);
      }
    } catch {
      // Handle gracefully
    }
  };

  return (
    <PortalLayout portalTitle="Client Organization Portal" userRole="client" userEmail="projects@apollo-kolkata.com">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel-300 pb-4">
          <div>
            <div className="text-xs font-mono font-semibold uppercase text-airtech-blue">
              Client Authorized Workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-airtech-navy mt-0.5">
              {clientProject.organization}
            </h1>
            <div className="text-xs text-steel-500 mt-1">
              Active Project: {clientProject.name} ({clientProject.code})
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-sm font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tenant Isolated & Verified</span>
          </span>
        </div>

        {/* Project Milestone Status Banner */}
        <div className="border border-steel-300 bg-white p-6 rounded-sm shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-mono text-steel-500 uppercase">Consulting Engineering Progress</div>
              <div className="text-lg font-bold text-airtech-navy mt-0.5">{clientProject.status}</div>
            </div>
            <div className="text-right">
              <span className="font-mono text-2xl font-bold text-emerald-700">{clientProject.progress}</span>
              <span className="text-xs text-steel-400 block font-mono">COMPLETED</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-steel-200 h-2 rounded-full overflow-hidden">
            <div className="bg-airtech-blue h-full w-[60%]"></div>
          </div>
        </div>

        {/* Section: Invoices & Payment (Stripe + Bank Alternative) */}
        <div id="invoices" className="border border-steel-300 bg-white rounded-sm overflow-hidden shadow-subtle">
          <div className="p-4 border-b border-steel-200 bg-airtech-offwhite flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-airtech-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-airtech-navy">
                Invoices & Online Payment (Stripe / Bank UTR)
              </h2>
            </div>
            <span className="text-xs font-mono text-steel-500">GSTIN: 19AAACA1234F1Z1</span>
          </div>

          {checkoutError && (
            <div className="p-4 bg-red-50 border-b border-red-200 text-airtech-red text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{checkoutError}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full tech-table text-left">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Milestone Deliverable</th>
                  <th>Due Date</th>
                  <th>Taxable Value</th>
                  <th>GST (18%)</th>
                  <th>Total Due</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                {clientInvoices.map((inv) => (
                  <tr key={inv.number} className="hover:bg-steel-50">
                    <td className="font-mono text-xs font-bold text-airtech-navy">{inv.number}</td>
                    <td className="text-xs text-airtech-charcoal font-medium">{inv.milestone}</td>
                    <td className="font-mono text-xs text-steel-500">{inv.dueDate}</td>
                    <td className="font-mono text-xs">₹{inv.subtotal.toLocaleString()}</td>
                    <td className="font-mono text-xs text-steel-500">₹{inv.gst.toLocaleString()}</td>
                    <td className="font-mono text-xs font-bold text-airtech-navy">₹{inv.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded-sm border ${
                        inv.status === "Paid" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      {inv.status !== "Paid" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePayNowStripe(inv)}
                            disabled={payingInvoice === inv.number}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {payingInvoice === inv.number ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <CreditCard className="w-3 h-3" />
                                <span>Pay with Stripe</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => setShowManualModal(true)}
                            className="bg-white hover:bg-steel-100 text-airtech-navy border border-steel-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-sm transition-colors"
                          >
                            Bank Transfer / UPI
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Receipt Confirmed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Approved Drawings Register */}
        <div id="deliverables" className="border border-steel-300 bg-white rounded-sm overflow-hidden shadow-subtle">
          <div className="p-4 border-b border-steel-200 bg-airtech-offwhite flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-airtech-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-airtech-navy">
                Approved Good For Construction (GFC) Drawings
              </h2>
            </div>
            <span className="text-xs font-mono text-steel-500">Verified Releases Only</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full tech-table text-left">
              <thead>
                <tr>
                  <th>Drawing Number</th>
                  <th>Title & Description</th>
                  <th>Approved Rev</th>
                  <th>Approval Date</th>
                  <th>Format</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                {approvedDrawings.map((dwg) => (
                  <tr key={dwg.number} className="hover:bg-steel-50">
                    <td className="font-mono text-xs font-bold text-airtech-navy">{dwg.number}</td>
                    <td className="text-xs text-airtech-charcoal font-medium">{dwg.title}</td>
                    <td className="font-mono text-xs font-bold text-airtech-blue">{dwg.rev}</td>
                    <td className="font-mono text-xs text-steel-500">{dwg.approvalDate}</td>
                    <td className="font-mono text-xs text-steel-600">{dwg.cad}</td>
                    <td>
                      <button
                        onClick={() => alert(`Downloading verified signed copy: ${dwg.number}_${dwg.rev}.pdf`)}
                        className="text-xs text-airtech-blue hover:underline flex items-center gap-1 font-medium"
                      >
                        <Download className="w-3 h-3" />
                        <span>Signed PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Bank Transfer Modal */}
        {showManualModal && (
          <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-steel-300 rounded-sm p-6 max-w-md w-full shadow-panel space-y-4">
              <div className="flex justify-between items-center border-b border-steel-200 pb-3">
                <h3 className="text-sm font-bold text-airtech-navy uppercase tracking-wider">
                  Direct Bank Transfer / UPI Instructions
                </h3>
                <button
                  onClick={() => setShowManualModal(false)}
                  className="text-steel-400 hover:text-steel-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="bg-airtech-offwhite p-4 rounded-sm border border-steel-200 text-xs font-mono space-y-1.5 text-airtech-charcoal">
                <div>Beneficiary: AIRTECH</div>
                <div>Bank: State Bank of India</div>
                <div>Account No: 392019401928 (Current)</div>
                <div>IFSC: SBIN0001234</div>
                <div>Branch: Rajarhat Gopalpur, Kolkata</div>
                <div className="pt-1 text-airtech-blue font-bold">UPI ID: airtechmep@sbi</div>
              </div>

              {manualSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>UTR submitted! Our finance team will verify credit and update your invoice status.</span>
                </div>
              ) : (
                <form onSubmit={handleManualPaymentSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                      Bank Transaction Reference / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. SBIN26301928471"
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowManualModal(false)}
                      className="px-4 py-2 border border-steel-300 text-xs font-medium rounded-sm text-steel-700 hover:bg-steel-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-airtech-navy text-white text-xs font-semibold rounded-sm hover:bg-airtech-dark"
                    >
                      Record Bank Deposit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
