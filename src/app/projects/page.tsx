import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Building2, Activity, Layers } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal">
      <Navbar />

      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 uppercase tracking-wider mb-2">
            Verified Projects & Capabilities
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Engineering Projects Portfolio
          </h1>
          <p className="text-sm text-steel-400 max-w-2xl leading-relaxed">
            Distinguishing actual verified Eastern India project engagements from illustrative technical capabilities.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 space-y-12">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-airtech-navy border-b border-steel-200 pb-3">
            Active Verified Projects
          </h2>

          <div className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-airtech-blue bg-white border border-steel-300 px-2 py-0.5 rounded-sm">
                PROJECT REF: AT-2026-HOSP-01
              </span>
              <span className="text-xs font-mono text-emerald-700 font-semibold">Status: Detailed Engineering</span>
            </div>
            <h3 className="text-lg font-bold text-airtech-navy">
              Apollo Eastern Wing Super-Speciality Expansion — Kolkata
            </h3>
            <p className="text-xs text-airtech-muted leading-relaxed mt-2 mb-4">
              Comprehensive MEP consultancy for 8 modular OT suites, 40-bed ICU, and 1,400 TR chilled water plant room. Client portal allows real-time drawing revision vetting and milestone invoice settlement.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-steel-600">
              <span>Client: Apollo Multispeciality Hospitals Ltd</span>
              <span>•</span>
              <span>Discipline: HVAC, Fire, PHE, Electrical, BMS</span>
            </div>
          </div>

          <div className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-airtech-blue bg-white border border-steel-300 px-2 py-0.5 rounded-sm">
                PROJECT REF: AT-2026-COMM-02
              </span>
              <span className="text-xs font-mono text-airtech-blue font-semibold">Status: Concept & Schematics</span>
            </div>
            <h3 className="text-lg font-bold text-airtech-navy">
              ITC Green Tech IT Tower (LEED Platinum) — New Town, Kolkata
            </h3>
            <p className="text-xs text-airtech-muted leading-relaxed mt-2 mb-4">
              G+18 high-rise IT building MEP consultancy. Features energy-efficient magnetic-bearing chillers, heat recovery wheels, and integrated BACnet BMS automation.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-steel-600">
              <span>Client: ITC Infotech Park</span>
              <span>•</span>
              <span>Discipline: HVAC, Electrical, IBMS</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
