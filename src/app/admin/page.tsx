import React from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { 
  Building2, 
  FolderKanban, 
  Users, 
  Layers, 
  Receipt, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck2,
  Settings,
  ArrowRight
} from "lucide-react";

export default function AdminPortalPage() {
  // Realistic seed data reflecting Eastern India engagements
  const activeProjects = [
    {
      code: "AT-2026-HOSP-01",
      name: "Apollo Eastern Wing Super-Speciality Expansion",
      client: "Apollo Multispeciality Hospitals Ltd",
      status: "Detailed Engineering",
      tonnage: "1,400 TR",
      disciplines: ["HVAC", "Fire", "PHE", "Electrical", "BMS"],
      contractValue: "₹35,00,000",
      progress: "60%",
    },
    {
      code: "AT-2026-COMM-02",
      name: "ITC Green Tech IT Tower (LEED Platinum)",
      client: "ITC Infotech Park",
      status: "Concept & Schematics",
      tonnage: "1,850 TR",
      disciplines: ["HVAC", "Electrical", "BMS"],
      contractValue: "₹48,00,000",
      progress: "25%",
    },
  ];

  const drawingRegister = [
    {
      number: "AT-HOSP-HVAC-DWG-001",
      title: "Chiller Plant Room Primary/Secondary Piping Layout",
      discipline: "HVAC",
      rev: "R1",
      status: "Approved",
      cad: "ZWCAD",
      date: "2026-10-18",
    },
    {
      number: "AT-HOSP-HVAC-DWG-002",
      title: "Modular OT Laminar Flow Diffuser & HEPA Ceiling Layout",
      discipline: "HVAC",
      rev: "R2",
      status: "Approved",
      cad: "ZWCAD",
      date: "2026-10-24",
    },
    {
      number: "AT-HOSP-FP-DWG-001",
      title: "Basement Fire Sprinkler & Hydrant Hydraulic Riser Diagram",
      discipline: "Fire Protection",
      rev: "R0",
      status: "Internal Review",
      cad: "ZWCAD",
      date: "2026-10-28",
    },
  ];

  const invoices = [
    {
      number: "INV-2026-0041",
      client: "Apollo Multispeciality Hospitals Ltd",
      project: "Apollo Super-Speciality Expansion",
      subtotal: "₹8,75,000",
      gst: "₹1,57,500 (18%)",
      total: "₹10,32,500",
      status: "Paid",
      gateway: "Stripe Online",
      date: "2026-08-20",
    },
    {
      number: "INV-2026-0042",
      client: "Apollo Multispeciality Hospitals Ltd",
      project: "Apollo Super-Speciality Expansion",
      subtotal: "₹12,25,000",
      gst: "₹2,20,500 (18%)",
      total: "₹14,45,500",
      status: "Issued",
      gateway: "Stripe / Bank UTR",
      date: "2026-10-25",
    },
  ];

  return (
    <PortalLayout portalTitle="Administrator Central Console" userRole="admin" userEmail="admin@airtech-mep.com">
      <div className="space-y-8">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel-300 pb-4">
          <div>
            <div className="text-xs font-mono font-semibold uppercase text-airtech-blue">
              AIRTECH Governance Console
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-airtech-navy mt-0.5">
              Executive Engineering & Operations Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-sm font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PostgreSQL RLS Active</span>
            </span>
          </div>
        </div>

        {/* 4 Metric KPI Cards (Clean Engineering Metrics, No Bouncy AI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-steel-300 p-4 bg-white rounded-sm">
            <div className="text-[11px] font-mono text-steel-500 uppercase">Active Engagements</div>
            <div className="text-2xl font-bold text-airtech-navy mt-1">2 Projects</div>
            <div className="text-xs text-steel-500 mt-1">3,250 TR Total HVAC Load</div>
          </div>

          <div className="border border-steel-300 p-4 bg-white rounded-sm">
            <div className="text-[11px] font-mono text-steel-500 uppercase">Drawing Revisions (CAD)</div>
            <div className="text-2xl font-bold text-airtech-navy mt-1">18 Sheets</div>
            <div className="text-xs text-emerald-700 mt-1">15 Approved by Client</div>
          </div>

          <div className="border border-steel-300 p-4 bg-white rounded-sm">
            <div className="text-[11px] font-mono text-steel-500 uppercase">Contract Value (YTD)</div>
            <div className="text-2xl font-bold text-airtech-navy mt-1">₹83,00,000</div>
            <div className="text-xs text-steel-500 mt-1">Consulting Retainers & BOQs</div>
          </div>

          <div className="border border-steel-300 p-4 bg-white rounded-sm">
            <div className="text-[11px] font-mono text-steel-500 uppercase">Stripe / Bank Receipts</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">₹10,32,500</div>
            <div className="text-xs text-amber-700 mt-1">₹14,45,500 Invoiced (Due Nov 10)</div>
          </div>
        </div>

        {/* Section: Projects Under Management */}
        <div id="projects" className="border border-steel-300 bg-white rounded-sm overflow-hidden shadow-subtle">
          <div className="p-4 border-b border-steel-200 bg-airtech-offwhite flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-airtech-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-airtech-navy">
                Major Projects Under Active Management
              </h2>
            </div>
            <span className="text-xs font-mono text-steel-500">2 Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full tech-table text-left">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>HVAC Tonnage</th>
                  <th>Progress</th>
                  <th>Fee Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                {activeProjects.map((p) => (
                  <tr key={p.code} className="hover:bg-steel-50">
                    <td className="font-mono text-xs font-bold text-airtech-blue">{p.code}</td>
                    <td className="font-medium text-airtech-navy">{p.name}</td>
                    <td className="text-xs text-steel-600">{p.client}</td>
                    <td>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-blue-50 text-airtech-blue border border-blue-200 rounded-sm">
                        {p.status}
                      </span>
                    </td>
                    <td className="font-mono text-xs">{p.tonnage}</td>
                    <td className="font-mono text-xs text-emerald-700 font-semibold">{p.progress}</td>
                    <td className="font-mono text-xs font-semibold text-airtech-navy">{p.contractValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Drawing Register (CAD / BIM) */}
        <div id="drawings" className="border border-steel-300 bg-white rounded-sm overflow-hidden shadow-subtle">
          <div className="p-4 border-b border-steel-200 bg-airtech-offwhite flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-airtech-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-airtech-navy">
                Drawing Register & Revision Control
              </h2>
            </div>
            <span className="text-xs font-mono text-steel-500">Strict R0/R1/R2 History</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full tech-table text-left">
              <thead>
                <tr>
                  <th>Drawing Number</th>
                  <th>Title & Description</th>
                  <th>Discipline</th>
                  <th>Rev</th>
                  <th>Status</th>
                  <th>Platform</th>
                  <th>Issue Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                {drawingRegister.map((d) => (
                  <tr key={d.number} className="hover:bg-steel-50">
                    <td className="font-mono text-xs font-bold text-airtech-navy">{d.number}</td>
                    <td className="text-xs text-airtech-charcoal font-medium">{d.title}</td>
                    <td className="text-xs text-steel-600">{d.discipline}</td>
                    <td className="font-mono text-xs font-bold text-airtech-blue">{d.rev}</td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded-sm border ${
                        d.status === "Approved" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-steel-500">{d.cad}</td>
                    <td className="font-mono text-xs text-steel-500">{d.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Commercial & GST Invoicing */}
        <div id="invoices" className="border border-steel-300 bg-white rounded-sm overflow-hidden shadow-subtle">
          <div className="p-4 border-b border-steel-200 bg-airtech-offwhite flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-airtech-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-airtech-navy">
                Commercial Invoices & Tax Calculations (GST 18%)
              </h2>
            </div>
            <span className="text-xs font-mono text-steel-500">HSN/SAC: 998333</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full tech-table text-left">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Client</th>
                  <th>Subtotal</th>
                  <th>Indian GST (18%)</th>
                  <th>Total Invoice</th>
                  <th>Status</th>
                  <th>Gateway Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                {invoices.map((inv) => (
                  <tr key={inv.number} className="hover:bg-steel-50">
                    <td className="font-mono text-xs font-bold text-airtech-navy">{inv.number}</td>
                    <td className="text-xs text-airtech-charcoal">{inv.client}</td>
                    <td className="font-mono text-xs">{inv.subtotal}</td>
                    <td className="font-mono text-xs text-steel-500">{inv.gst}</td>
                    <td className="font-mono text-xs font-bold text-airtech-navy">{inv.total}</td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded-sm border ${
                        inv.status === "Paid" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="text-xs font-mono text-steel-600">{inv.gateway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Security, Audit Logs & System Status */}
        <div id="audit" className="border border-steel-300 bg-white rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-airtech-navy">
              Security Compliance & PostgreSQL Audit Trail
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-airtech-offwhite border border-steel-200 rounded-sm">
              <div className="text-steel-400">AUTHENTICATION PROTOCOL</div>
              <div className="text-airtech-navy font-semibold mt-1">Email + 6-Digit Server OTP</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">5-Minute Expiry • Single-Use Verified</div>
            </div>
            <div className="p-3 bg-airtech-offwhite border border-steel-200 rounded-sm">
              <div className="text-steel-400">DATABASE RLS ENFORCEMENT</div>
              <div className="text-airtech-navy font-semibold mt-1">Active on all 22+ tables</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Zero Cross-Client Data Leakage</div>
            </div>
            <div className="p-3 bg-airtech-offwhite border border-steel-200 rounded-sm">
              <div className="text-steel-400">STRIPE PAYMENT GATEWAY</div>
              <div className="text-airtech-navy font-semibold mt-1">Hosted Checkout & Webhooks</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Idempotency & Signature Guard Active</div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
