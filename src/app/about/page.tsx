import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Compass, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal">
      <Navbar />

      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 uppercase tracking-wider mb-2">
            Company Profile & Governance
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            About AIRTECH Engineering Consultancy
          </h1>
          <p className="text-sm text-steel-400 max-w-2xl leading-relaxed">
            Independent HVAC, Fire Fighting, Electrical, Plumbing, and Building Automation consultancy based in Kolkata, serving critical facilities across Eastern India.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-xl font-bold text-airtech-navy mb-4">
              Consultancy Principles & Distinction
            </h2>
            <div className="space-y-4 text-xs text-airtech-muted leading-relaxed">
              <p>
                AIRTECH is strictly a professional design and engineering advisory firm. We do not engage in equipment sales or commercial contracting. This pure consultancy model ensures 100% unbiased equipment selection, vendor-neutral tender specifications, and rigorous quality inspection on behalf of owners, healthcare directors, and project developers.
              </p>
              <p>
                Our designs are grounded in thermal physics, hydraulic flow simulations, and statutory building codes including the National Building Code of India (NBC 2016), ASHRAE 90.1 & 170 standards, and the Energy Conservation Building Code (ECBC).
              </p>
            </div>
          </div>

          <div className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite">
            <h3 className="text-sm font-bold text-airtech-navy uppercase tracking-wider mb-4">
              Statutory & Regulatory Profile
            </h3>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-steel-200">
                <span className="text-steel-500">Legal Name</span>
                <span className="font-semibold text-airtech-navy">AIRTECH</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-steel-200">
                <span className="text-steel-500">Headquarters</span>
                <span className="font-semibold text-airtech-navy">Kolkata, West Bengal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-steel-200">
                <span className="text-steel-500">GSTIN</span>
                <span className="font-semibold text-airtech-navy">19AABCA1234F1Z5</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-steel-200">
                <span className="text-steel-500">HSN/SAC Code</span>
                <span className="font-semibold text-airtech-navy">998333 (Engineering Advisory)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-steel-500">Core Domain</span>
                <span className="font-semibold text-airtech-navy">HVAC & MEP Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
