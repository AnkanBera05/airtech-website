import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const openings = [
    {
      id: "hvac-sr-01",
      title: "Senior HVAC Design Engineer",
      department: "HVAC Engineering",
      location: "Kolkata HQ",
      experience: "5–8 Years",
      type: "Full-Time",
      description: "Responsible for heat-load calculations (HAP 6.0), chiller plant schematic layouts, air distribution duct sizing, and cleanroom air balance.",
    },
    {
      id: "phe-fire-02",
      title: "PHE & Fire Protection Engineer",
      department: "Fire & Plumbing",
      location: "Kolkata HQ",
      experience: "3–6 Years",
      type: "Full-Time",
      description: "Hydraulic calculations for sprinkler networks, fire pump head calculations, hydro-pneumatic water supply, and drainage sizing per NBC 2016.",
    },
    {
      id: "cad-bim-03",
      title: "MEP Draftsperson / BIM Modeler",
      department: "Engineering Drafting",
      location: "Kolkata HQ",
      experience: "2–5 Years",
      type: "Full-Time",
      description: "Preparation of coordinated Composite Services Drawings (CSD) and Builder's Work Drawings (BWD) using ZWCAD / AutoCAD.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal">
      <Navbar />

      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 uppercase tracking-wider mb-2">
            Engineering Opportunities
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Join the AIRTECH Engineering Team
          </h1>
          <p className="text-sm text-steel-400 max-w-2xl leading-relaxed">
            Collaborate on challenging commercial, healthcare, and industrial engineering projects with rigorous technical standards.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 space-y-8">
        <div className="border-b border-steel-200 pb-4">
          <h2 className="text-xl font-bold text-airtech-navy">Current Openings in Kolkata</h2>
        </div>

        <div className="space-y-4">
          {openings.map((job) => (
            <div key={job.id} className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-mono font-semibold text-airtech-blue uppercase">{job.department}</span>
                <h3 className="text-lg font-bold text-airtech-navy mt-0.5">{job.title}</h3>
                <p className="text-xs text-airtech-muted mt-1 max-w-2xl">{job.description}</p>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-steel-600 mt-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Exp: {job.experience}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                </div>
              </div>

              <Link
                href={`/contact?job=${encodeURIComponent(job.title)}`}
                className="bg-airtech-navy hover:bg-airtech-dark text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors shrink-0"
              >
                Apply for Position
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
