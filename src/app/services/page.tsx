import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal">
      <Navbar />

      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 uppercase tracking-wider mb-2">
            Engineering Scope & Disciplines
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Specialized MEP Technical Consultancy Services
          </h1>
          <p className="text-sm text-steel-400 max-w-2xl leading-relaxed">
            From initial conceptual feasibility and heat-load modeling to tender preparation, shop drawing vetting, and testing & commissioning oversight.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-steel-300 p-8 rounded-sm bg-white">
            <span className="text-xs font-mono font-semibold text-airtech-blue uppercase">Phase 1</span>
            <h2 className="text-xl font-bold text-airtech-navy mt-1 mb-3">Concept & Schematic Engineering</h2>
            <p className="text-xs text-airtech-muted leading-relaxed mb-4">
              Building energy simulations, block load calculations, primary equipment selection (chiller type, boiler, pumps, substation ratings), and conceptual plant room layouts.
            </p>
            <ul className="text-xs text-steel-700 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hourly heat-load simulation via HAP / TRANE Trace</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Life-cycle cost analysis (LCCA) for chiller plants</li>
            </ul>
          </div>

          <div className="border border-steel-300 p-8 rounded-sm bg-white">
            <span className="text-xs font-mono font-semibold text-airtech-blue uppercase">Phase 2</span>
            <h2 className="text-xl font-bold text-airtech-navy mt-1 mb-3">Detailed Design & Tender BOQ</h2>
            <p className="text-xs text-airtech-muted leading-relaxed mb-4">
              Detailed piping and duct sizing, schematic diagrams, complete Bills of Quantities (BOQ), technical equipment specifications, and approved vendor make-lists.
            </p>
            <ul className="text-xs text-steel-700 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Comprehensive item-rate tender documentation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Composite Services Coordination Drawings (CSD)</li>
            </ul>
          </div>

          <div className="border border-steel-300 p-8 rounded-sm bg-white">
            <span className="text-xs font-mono font-semibold text-airtech-blue uppercase">Phase 3</span>
            <h2 className="text-xl font-bold text-airtech-navy mt-1 mb-3">Technical Vetting & Submittals</h2>
            <p className="text-xs text-airtech-muted leading-relaxed mb-4">
              Rigorous review of contractor shop drawings, manufacturer data sheets, and equipment selections before factory dispatch and site delivery.
            </p>
            <ul className="text-xs text-steel-700 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Chiller & pump performance curve verification</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Formal RFI & Submittal digital tracking</li>
            </ul>
          </div>

          <div className="border border-steel-300 p-8 rounded-sm bg-white">
            <span className="text-xs font-mono font-semibold text-airtech-blue uppercase">Phase 4</span>
            <h2 className="text-xl font-bold text-airtech-navy mt-1 mb-3">Testing, Commissioning & Handover</h2>
            <p className="text-xs text-airtech-muted leading-relaxed mb-4">
              Supervision of Testing, Adjusting & Balancing (TAB), cleanroom particle counting, pressure decay tests, fire alarm integration tests, and as-built drawing audit.
            </p>
            <ul className="text-xs text-steel-700 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Air & water flow balancing certification</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Final O&M manual review and sign-off</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
