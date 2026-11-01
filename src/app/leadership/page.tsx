import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Linkedin, Compass, Award, ShieldCheck } from "lucide-react";

export default function LeadershipPage() {
  const leaders = [
    {
      name: "Mr. A. Bera",
      role: "Founder & Managing Director",
      bio: "Over 25 years of specialized mechanical consultancy experience, leading major hospital cleanrooms, pharmaceutical hubs, and IT park developments across India.",
      credentials: "B.Tech (Mech) • Fellow ISHRAE • ASHRAE Member",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "Mr. R. Sharma",
      role: "Technical Director",
      bio: "Authority on central chilled water hydraulic circuits, energy modeling, and advanced Building Management Systems with 20+ years of engineering leadership.",
      credentials: "M.Tech (Thermal) • Certified Energy Auditor (BEE)",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: "Mr. K. Menon",
      role: "Advisor - MEP",
      bio: "Former Chief Engineer for national infrastructure programs, advising on life safety, NBC 2016 code compliance, and high-voltage substation integration.",
      credentials: "B.E. (Electrical) • Senior IEEE Life Member",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      {/* Header Section (Matching Panel 5) */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white">Leadership</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Leadership & Advisors
          </h1>
          <p className="text-sm sm:text-base text-steel-300 max-w-2xl leading-relaxed">
            A team of experienced professionals guiding AIRTECH's engineering excellence.
          </p>
        </div>
      </section>

      {/* 3 Leadership Cards Grid (Matching Panel 5) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <div
              key={index}
              className="bg-white border border-steel-300 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-panel hover:border-airtech-blue transition-all group"
            >
              <div>
                {/* Photo */}
                <div className="relative h-64 w-full bg-navy-950 overflow-hidden">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider bg-navy-900/90 px-2 py-0.5 rounded-sm border border-navy-700 text-blueprint-400">
                      Leadership Board
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy-950 mb-0.5">
                    {leader.name}
                  </h3>
                  <div className="text-xs font-semibold text-airtech-blue mb-3">
                    {leader.role}
                  </div>
                  <p className="text-xs text-steel-500 leading-relaxed mb-4">
                    {leader.bio}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-steel-100 text-[11px] font-mono text-steel-500">
                {leader.credentials}
              </div>
            </div>
          ))}
        </div>

        {/* Governance Commitment */}
        <div className="mt-16 p-8 bg-steel-50 border border-steel-200 rounded-sm flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-bold text-navy-950 mb-1">
              Fiduciary Engineering Responsibility
            </h4>
            <p className="text-xs text-steel-500 leading-relaxed">
              AIRTECH directors personally review all schematic basis-of-design reports and final tender drawings. Our senior advisory ensures that every calculation complies with the National Building Code (NBC 2016) and international ASHRAE standards before client handover.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
