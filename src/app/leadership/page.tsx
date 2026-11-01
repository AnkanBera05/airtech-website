import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Compass, ShieldCheck, Mail } from "lucide-react";

export default function LeadershipPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal">
      <Navbar />

      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 uppercase tracking-wider mb-2">
            Governance & Technical Mentorship
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Technical Leadership & Advisory
          </h1>
          <p className="text-sm text-steel-400 max-w-2xl leading-relaxed">
            AIRTECH is anchored by senior engineering professionals with decades of hands-on technical design and site execution experience across Eastern India.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="border border-steel-300 p-8 rounded-sm bg-white max-w-3xl">
          <div className="text-xs font-mono font-semibold uppercase text-airtech-blue mb-1">
            Technical Advisory
          </div>
          <h2 className="text-2xl font-bold text-airtech-navy mb-1">
            Technical Advisory — HVAC & MEP
          </h2>
          <div className="text-xs text-steel-500 font-mono mb-4">
            Kolkata, Eastern India • 23+ Years Industry Experience
          </div>

          <p className="text-xs text-airtech-muted leading-relaxed mb-4">
            Providing high-level design direction, heat-load vetting, tender document review, and site commissioning governance. Specializes in critical environment air conditioning, fire fighting hydraulics, and building automation across hospitals, hotel properties, and IT infrastructure.
          </p>

          <div className="border-t border-steel-200 pt-4 text-xs font-mono text-steel-700 space-y-1">
            <div>Scope: HVAC, Fire Fighting, Plumbing, Electrical, and BMS (MEP)</div>
            <div>Engineering Standards: NBC 2016, ASHRAE 90.1, ASHRAE 170, ISHRAE, ECBC</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
