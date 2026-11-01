import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Engineering3DCanvas } from "@/components/home/Engineering3DCanvas";
import { 
  Fan, 
  Flame, 
  Droplet, 
  Zap, 
  Cpu, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Compass, 
  FileText, 
  CheckCircle2,
  Users,
  Award
} from "lucide-react";

export default function HomePage() {
  const disciplinesRibbon = [
    { label: "HVAC Engineering", icon: Fan, href: "/services#hvac" },
    { label: "Fire Fighting Engineering", icon: Flame, href: "/services#fire" },
    { label: "Plumbing Engineering", icon: Droplet, href: "/services#plumbing" },
    { label: "Electrical Engineering", icon: Zap, href: "/services#electrical" },
    { label: "BMS Integration", icon: Cpu, href: "/services#bms" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      {/* =========================================================================
          HERO SECTION — MATCHING PANEL 1 (DARK ARCHITECTURAL + 3D SIMULATION + RIBBON)
          ========================================================================= */}
      <section className="relative bg-[#0d1a2d] text-white pt-16 pb-12 overflow-hidden border-b border-navy-800">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-blueprint-dark-grid opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[500px]">
            {/* Left 6 Columns: Editorial Headline, Subtitle, Buttons */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-navy-900/80 border border-blueprint-500/30 px-3 py-1 rounded-sm text-xs font-mono text-blueprint-400">
                <span className="w-1.5 h-1.5 bg-blueprint-400 rounded-full animate-pulse" />
                <span>MEP Engineering Consultancy • Kolkata HQ</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                HVAC Engineering <br />
                <span className="text-blueprint-400">Projects | Services</span>
              </h1>

              <p className="text-base sm:text-lg text-steel-300 font-normal leading-relaxed max-w-xl">
                Specialist MEP consultancy delivering integrated, efficient and sustainable building services solutions.
              </p>

              {/* Action Buttons (Matching Panel 1) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/services"
                  className="bg-white hover:bg-steel-100 text-navy-950 text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-sm transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 text-navy-950" />
                </Link>

                <Link
                  href="/contact"
                  className="bg-transparent hover:bg-white/10 text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-sm transition-all border border-steel-400/60 flex items-center gap-2"
                >
                  <span>Contact Us</span>
                </Link>
              </div>

              {/* Verified Metrics Counter */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-navy-800 text-xs text-steel-400">
                <div>
                  <div className="text-xl font-bold text-white font-mono">1,400+ TR</div>
                  <div>Chilled Water Capacity</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white font-mono">45+</div>
                  <div>Commercial Projects</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white font-mono">100%</div>
                  <div>Code Compliance (NBC)</div>
                </div>
              </div>
            </div>

            {/* Right 6 Columns: 3D Mechanical Room Visualizer Canvas */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="w-full h-[420px] sm:h-[460px] relative rounded-sm overflow-hidden bg-navy-950/60 border border-navy-800/80 shadow-2xl">
                <div className="absolute top-3 left-4 z-20 flex items-center gap-2 text-[10px] font-mono text-blueprint-300 bg-navy-900/90 px-2.5 py-1 border border-navy-700 rounded-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span>Interactive Chiller & Duct Simulation</span>
                </div>
                <Engineering3DCanvas />
              </div>
            </div>
          </div>

          {/* Bottom 5-Discipline Ribbon (Matching Panel 1) */}
          <div className="mt-14 pt-8 border-t border-navy-800/80">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {disciplinesRibbon.map((d, idx) => {
                const Icon = d.icon;
                return (
                  <Link
                    key={idx}
                    href={d.href}
                    className="flex items-center gap-3 p-3.5 rounded-sm bg-navy-900/60 border border-navy-800 hover:border-blueprint-400/60 hover:bg-navy-900 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-sm bg-navy-800 border border-navy-700 flex items-center justify-center text-blueprint-400 group-hover:text-white group-hover:bg-blueprint-500 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-steel-200 group-hover:text-white transition-colors">
                      {d.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: OVERVIEW & WHY AIRTECH
          ========================================================================= */}
      <section className="py-20 bg-white border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-airtech-blue">
                Engineering Excellence
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-950">
                A Specialist MEP Consultancy Driven by Engineering Integrity
              </h2>
              <p className="text-sm text-steel-600 leading-relaxed">
                AIRTECH provides independent, highly specialized mechanical, electrical, plumbing, and building management engineering design services. We bridge the gap between architectural concept and flawless building operation.
              </p>
              
              <div className="space-y-3 pt-2 text-xs text-steel-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Zero Conflict of Interest:</strong> Pure advisory and design consultancy without commercial equipment sales.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Clash-Free Coordination:</strong> Full 3D spatial alignment between HVAC ductwork, fire hydrants, plumbing risers and electrical cable trays.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Rigorous Code Compliance:</strong> Strict enforcement of NBC 2016 Part 4 & 8, ASHRAE Standards 90.1, 62.1 & 170, and ECBC.</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-airtech-blue hover:text-navy-950 font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  <span>Learn more about our methodology</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="border border-steel-300 p-6 rounded-sm bg-steel-50/50">
                <Building2 className="w-8 h-8 text-airtech-blue mb-4" />
                <h3 className="font-bold text-navy-950 text-sm mb-1">Commercial Complexes</h3>
                <p className="text-xs text-steel-500 leading-relaxed">
                  High-efficiency VAV systems, primary-secondary chilled water circuits, and centralized BMS for corporate headquarters.
                </p>
              </div>

              <div className="border border-steel-300 p-6 rounded-sm bg-steel-50/50">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="font-bold text-navy-950 text-sm mb-1">Healthcare & Hospitals</h3>
                <p className="text-xs text-steel-500 leading-relaxed">
                  NABH & ASHRAE 170 compliant laminar flow OT ventilation, positive/negative pressure isolation suites, and medical gas piping.
                </p>
              </div>

              <div className="border border-steel-300 p-6 rounded-sm bg-steel-50/50">
                <Zap className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="font-bold text-navy-950 text-sm mb-1">Power & Substations</h3>
                <p className="text-xs text-steel-500 leading-relaxed">
                  HT/LT transformer substations, automatic DG synchronization, short-circuit calculations and busbar trunking systems.
                </p>
              </div>

              <div className="border border-steel-300 p-6 rounded-sm bg-steel-50/50">
                <Flame className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="font-bold text-navy-950 text-sm mb-1">Life Safety & Fire</h3>
                <p className="text-xs text-steel-500 leading-relaxed">
                  Hydrant networks, wet sprinkler systems, clean agent gas suppression (FM-200/Novec 1230), and fire NOC documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: FAST PORTAL DISPATCH BAR
          ========================================================================= */}
      <section className="py-14 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[11px] font-mono text-blueprint-400 uppercase tracking-widest mb-1">
              Protected Enterprise Architecture
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Access Your Dedicated AIRTECH Portal
            </h3>
            <p className="text-xs text-steel-400 mt-1">
              Separate workspaces for Company Executives, Engineering Staff, and Client Developers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/owner/login"
              className="bg-navy-900 hover:bg-navy-800 text-white border border-navy-700 text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors"
            >
              Owner Portal
            </Link>
            <Link
              href="/employee/login"
              className="bg-navy-900 hover:bg-navy-800 text-white border border-navy-700 text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors"
            >
              Employee Portal
            </Link>
            <Link
              href="/client/login"
              className="bg-blueprint-500 hover:bg-blueprint-600 text-white text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors"
            >
              Client Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
