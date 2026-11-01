import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, MapPin, Briefcase, Clock, CheckCircle2 } from "lucide-react";

export default function CareersPage() {
  const positions = [
    {
      id: "mech-des",
      title: "Mechanical Design Engineer",
      type: "Full-time",
      location: "Bengaluru",
      department: "HVAC & Thermal",
    },
    {
      id: "elec-des",
      title: "Electrical Design Engineer",
      type: "Full-time",
      location: "Bengaluru",
      department: "Power & Distribution",
    },
    {
      id: "proj-coord",
      title: "Project Coordinator",
      type: "Full-time",
      location: "Bengaluru",
      department: "MEP Project Management",
    },
    {
      id: "sr-hvac",
      title: "Senior HVAC Consultant",
      type: "Full-time",
      location: "Kolkata HQ",
      department: "Cleanroom & Healthcare",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      {/* Header Section (Matching Panel 6) */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white">Careers</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Careers at AIRTECH
          </h1>
          <p className="text-sm sm:text-base text-steel-300 max-w-2xl leading-relaxed">
            Be part of a specialist engineering consultancy delivering meaningful projects.
          </p>
        </div>
      </section>

      {/* 2-Column Split: Positions on Left, Photo on Right (Matching Panel 6) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 7 Columns: Open Positions List */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
                Open Positions
              </h2>
              <p className="text-xs text-steel-500 mt-1">
                Explore engineering and project coordination opportunities across our design centers.
              </p>
            </div>

            <div className="space-y-4">
              {positions.map((pos) => (
                <Link
                  key={pos.id}
                  href={`/contact?subject=${encodeURIComponent(`Application for ${pos.title}`)}`}
                  className="bg-white border border-steel-300 rounded-sm p-5 flex items-center justify-between hover:border-airtech-blue hover:shadow-subtle transition-all group block"
                >
                  <div>
                    <h3 className="text-base font-bold text-navy-950 group-hover:text-airtech-blue transition-colors">
                      {pos.title}
                    </h3>
                    <div className="text-xs text-steel-500 font-mono mt-1">
                      {pos.type} | {pos.location} • {pos.department}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full border border-steel-300 flex items-center justify-center text-steel-400 group-hover:border-airtech-blue group-hover:text-airtech-blue group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/contact?subject=General+Career+Inquiry"
                className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-sm inline-flex items-center gap-2"
              >
                <span>View All Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right 5 Columns: Modern Design Studio Photo (Matching Panel 6) */}
          <div className="lg:col-span-5">
            <div className="relative h-80 sm:h-96 rounded-sm overflow-hidden border border-steel-300 shadow-panel">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
                alt="Modern collaborative engineering office and design studio"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-bold mb-1">AIRTECH Design Studio</div>
                <div className="text-[11px] text-steel-300">
                  Collaborative multidisciplinary workspace with high-end thermal modeling and CAD workstations.
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-steel-50 border border-steel-200 rounded-sm text-xs text-steel-600 space-y-2">
              <div className="font-bold text-navy-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What We Offer</span>
              </div>
              <p className="leading-relaxed">
                Work directly with ASHRAE members and senior MEP consultants on national hospital and commercial developments, with full support for professional certifications (LEED AP, BEE, IGBC).
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
