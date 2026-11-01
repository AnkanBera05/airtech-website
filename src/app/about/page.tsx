import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Compass, CheckCircle2, ShieldCheck, ArrowRight, Award, Layers, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      {/* Hero Glass Banner (Matching Panel 2) */}
      <section className="relative bg-navy-950 text-white py-16 sm:py-20 overflow-hidden border-b border-navy-800">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
            alt="Architectural modern glass building facade"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/70 z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <div className="text-xs font-mono text-blueprint-400 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white">About</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            About AIRTECH
          </h1>
          <p className="text-sm sm:text-base text-steel-300 max-w-2xl leading-relaxed">
            Leading MEP engineering consultancy delivering precision design, thermal comfort, life safety and energy optimization.
          </p>
        </div>
      </section>

      {/* Main Narrative (Matching Panel 2) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-airtech-blue">
              Corporate Profile & Methodology
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy-950 leading-snug">
              A Specialist MEP Engineering Consultancy
            </h2>
            <p className="text-sm text-steel-600 leading-relaxed">
              AIRTECH provides professional HVAC and MEP engineering consultancy services for a wide range of commercial, institutional and industrial projects. As an independent technical advisory, we design building systems that prioritize energy efficiency, occupant safety, and strict regulatory adherence.
            </p>
            <p className="text-xs text-steel-500 leading-relaxed">
              Our multidisciplinary engineers collaborate with architects, structural engineers, and facility developers from schematic design through to testing and commissioning. We verify every heat-load calculation, pipe friction loss, and air distribution duct routing using industry-standard engineering software and empirical physics.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border-l-2 border-airtech-blue pl-4">
                <div className="text-lg font-bold text-navy-950 font-mono">100%</div>
                <div className="text-xs text-steel-500">Unbiased Advisory (No Equipment Sales)</div>
              </div>
              <div className="border-l-2 border-blueprint-500 pl-4">
                <div className="text-lg font-bold text-navy-950 font-mono">BIM / 3D</div>
                <div className="text-xs text-steel-500">Clash-Free Spatial Modeling</div>
              </div>
            </div>
          </div>

          {/* Right Column: Industrial Ductwork Photo (Matching Panel 2) */}
          <div className="lg:col-span-5">
            <div className="relative h-80 sm:h-96 rounded-sm overflow-hidden border border-steel-300 shadow-panel">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop"
                alt="High grade mechanical ductwork and chiller piping"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/80 to-transparent p-4 text-white text-xs font-mono">
                Central Chiller Plant Room & Duct Routing
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="mt-20 pt-12 border-t border-steel-200 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-steel-300 p-6 rounded-sm bg-steel-50/50">
            <Target className="w-8 h-8 text-airtech-blue mb-4" />
            <h3 className="font-bold text-navy-950 text-base mb-2">Our Mission</h3>
            <p className="text-xs text-steel-500 leading-relaxed">
              To engineer sustainable, zero-defect mechanical and electrical environments that elevate building lifecycle efficiency and safeguard lives.
            </p>
          </div>

          <div className="border border-steel-300 p-6 rounded-sm bg-steel-50/50">
            <Layers className="w-8 h-8 text-blueprint-500 mb-4" />
            <h3 className="font-bold text-navy-950 text-base mb-2">Technical Rigor</h3>
            <p className="text-xs text-steel-500 leading-relaxed">
              Every drawing revision undergoes dual-tier peer review. Our specifications adhere strictly to NBC 2016, ASHRAE, ISHRAE, and ECBC benchmarks.
            </p>
          </div>

          <div className="border border-steel-300 p-6 rounded-sm bg-steel-50/50">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="font-bold text-navy-950 text-base mb-2">Fiduciary Independence</h3>
            <p className="text-xs text-steel-500 leading-relaxed">
              We operate exclusively in the client's best interest. We never accept vendor commissions, assuring pure merit-based equipment selection.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
