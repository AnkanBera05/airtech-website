import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 mb-2">Legal Terms & Advisory Framework</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Terms of Engineering Engagement
          </h1>
          <p className="text-xs sm:text-sm text-steel-400 font-mono">
            HSN / SAC Code: 998333 (Engineering Advisory & Technical Design)
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8 text-xs sm:text-sm text-steel-700 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-navy-950 mb-2">1. Scope of Professional Advisory</h2>
          <p>
            AIRTECH provides independent mechanical, electrical, plumbing, fire protection, and building automation design services. As an independent consultancy, AIRTECH does not engage in equipment sales, manufacturing, or commercial construction contracting.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-navy-950 mb-2">2. Standards & Code Adherence</h2>
          <p>
            All schematics, capacity calculations, hydraulic friction analyses, and tender specifications are authored in strict accordance with the National Building Code of India (NBC 2016), ASHRAE Standards 90.1, 62.1 & 170, ISHRAE guidelines, and the Energy Conservation Building Code (ECBC).
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-navy-950 mb-2">3. Intellectual Property & Drawings</h2>
          <p>
            All engineering drawings, CAD files, heat-load calculation models, and tender documents authored by AIRTECH remain the intellectual property of the consultancy until contractual project milestone payments are settled in full.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-navy-950 mb-2">4. Jurisdiction</h2>
          <p>
            All contractual disputes, arbitration, and statutory compliance shall be subject exclusively to the jurisdiction of the High Court at Calcutta, West Bengal, India.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
