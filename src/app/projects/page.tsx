"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Building2, Layers, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filterTabs = ["All", "HVAC", "Fire Fighting", "Electrical", "BMS"];

  const projects = [
    {
      id: "proj-1",
      title: "Commercial Office Building",
      disciplines: ["HVAC", "Electrical", "BMS"],
      category: ["HVAC", "Electrical", "BMS"],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      location: "Bengaluru, India",
      capacity: "1,850 TR Central Plant",
      status: "Commissioned",
    },
    {
      id: "proj-2",
      title: "Hospital Facility",
      disciplines: ["HVAC", "Fire Fighting", "Plumbing"],
      category: ["HVAC", "Fire Fighting"],
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=800&auto=format&fit=crop",
      location: "Kolkata, India",
      capacity: "12 Modular OTs • NABH Standard",
      status: "In Execution",
    },
    {
      id: "proj-3",
      title: "Hotel & Hospitality",
      disciplines: ["HVAC", "Electrical"],
      category: ["HVAC", "Electrical"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      location: "Goa, India",
      capacity: "250 Keys Luxury Resort",
      status: "Completed",
    },
    {
      id: "proj-4",
      title: "Retail Mall",
      disciplines: ["HVAC", "Plumbing", "BMS"],
      category: ["HVAC", "BMS"],
      image: "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=800&auto=format&fit=crop",
      location: "Hyderabad, India",
      capacity: "650,000 sq.ft Retail",
      status: "Handed Over",
    },
    {
      id: "proj-5",
      title: "Educational Campus",
      disciplines: ["HVAC", "Fire Fighting"],
      category: ["HVAC", "Fire Fighting"],
      image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
      location: "Bhubaneswar, India",
      capacity: "Auditoriums & Laboratories",
      status: "Completed",
    },
    {
      id: "proj-6",
      title: "Institutional Building",
      disciplines: ["HVAC", "Electrical", "BMS"],
      category: ["HVAC", "Electrical", "BMS"],
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
      location: "Kolkata, India",
      capacity: "Civic Complex & Convention",
      status: "In Execution",
    },
  ];

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category.includes(activeFilter));

  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      {/* Header Section (Matching Panel 4) */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white">Projects</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Projects & Portfolio
          </h1>
          <p className="text-sm sm:text-base text-steel-300 max-w-2xl leading-relaxed">
            Proven engineering consultancy delivering complex MEP systems for marquee developments.
          </p>
        </div>
      </section>

      {/* Main Filter & Grid Section (Matching Panel 4) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {/* Filter Tabs (All, HVAC, Fire Fighting, Electrical, BMS) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-steel-200 pb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
                activeFilter === tab
                  ? "bg-navy-950 text-white shadow-subtle"
                  : "bg-steel-100 text-steel-600 hover:bg-steel-200 hover:text-navy-950"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 6 Architectural Cards Grid (Matching Panel 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-steel-300 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-panel hover:border-airtech-blue transition-all group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-navy-950">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                      <span>{p.location}</span>
                      <span className="bg-navy-900/80 px-2 py-0.5 rounded-sm border border-navy-700 text-[10px] text-blueprint-400">
                        {p.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-navy-950 mb-1 group-hover:text-airtech-blue transition-colors">
                      {p.title}
                    </h3>
                    <div className="text-xs font-mono text-airtech-blue font-semibold mb-3">
                      {p.disciplines.join(" | ")}
                    </div>
                    <p className="text-xs text-steel-500 leading-relaxed">
                      {p.capacity}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-steel-100 flex items-center justify-between text-xs">
                  <span className="text-steel-400 font-mono text-[11px]">NBC / ASHRAE Compliant</span>
                  <Link
                    href="/contact"
                    className="text-airtech-blue font-bold flex items-center gap-1 hover:underline text-xs"
                  >
                    <span>Consult</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
