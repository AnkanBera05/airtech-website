import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Fan, 
  Flame, 
  Droplet, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function ServicesPage() {
  const serviceCards = [
    {
      id: "hvac",
      title: "HVAC Engineering",
      description: "Design, analysis and optimisation of HVAC systems.",
      details: "Central chilled water plants, variable refrigerant flow (VRF), thermal load calculations (HAP/TRANE), cleanroom laminar airflow (ISO 14644/NABH), and energy recovery.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
      standards: "ASHRAE 90.1, 62.1 & 170 • ISHRAE",
      icon: Fan,
    },
    {
      id: "fire",
      title: "Fire Fighting Engineering",
      description: "Code-compliant fire system design.",
      details: "Internal and external wet hydrant networks, automated sprinkler systems, clean agent gas suppression (FM-200/Novec), fire pump sizing, and Fire NOC statutory liaison.",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=800&auto=format&fit=crop",
      standards: "NBC 2016 Part 4 • NFPA 13, 14, 20",
      icon: Flame,
    },
    {
      id: "plumbing",
      title: "Plumbing Engineering",
      description: "Efficient and sustainable plumbing solutions.",
      details: "Domestic water supply distribution, hydro-pneumatic pumping stations, soil and waste drainage, rainwater harvesting, STP/ETP design, and low-flow sanitary fixtures.",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop",
      standards: "Uniform Plumbing Code (UPC-I) • NBC Part 9",
      icon: Droplet,
    },
    {
      id: "electrical",
      title: "Electrical Engineering",
      description: "Reliable and safe electrical system design.",
      details: "HT/LT transformer substations, diesel generator (DG) backup with AMF/synchronization, power distribution networks, short-circuit calculations, and lightning protection.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop",
      standards: "IS 732 • IEEE • Central Electricity Authority",
      icon: Zap,
    },
    {
      id: "bms",
      title: "Building Management Systems (BMS)",
      description: "Integrated building automation and control.",
      details: "BACnet / Modbus protocol integration, DDC controller schematics, chiller plant sequencing optimization, indoor air quality (IAQ) monitoring, and energy metering dashboards.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      standards: "BACnet/IP • ISO 16484",
      icon: Cpu,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      {/* Header Section (Matching Panel 3) */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white">Services</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Our Services
          </h1>
          <p className="text-sm sm:text-base text-steel-300 max-w-2xl leading-relaxed">
            Comprehensive MEP engineering solutions across key building services.
          </p>
        </div>
      </section>

      {/* 5 Photography Cards Grid (Matching Panel 3) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCards.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={service.id}
                className="bg-white border border-steel-300 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-panel hover:border-airtech-blue transition-all group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-navy-950">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                      <div className="w-7 h-7 bg-navy-900/90 border border-navy-700 rounded-sm flex items-center justify-center text-blueprint-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        0{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-navy-950 mb-1 group-hover:text-airtech-blue transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs font-semibold text-airtech-blue mb-3">
                      {service.description}
                    </p>
                    <p className="text-xs text-steel-500 leading-relaxed mb-4">
                      {service.details}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-steel-100 flex items-center justify-between text-[11px] font-mono text-steel-500">
                  <span>{service.standards}</span>
                  <Link
                    href="/contact"
                    className="text-airtech-blue font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 bg-steel-50 border border-steel-200 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-navy-950 mb-1">
              Need Multi-Disciplinary MEP Coordination?
            </h3>
            <p className="text-xs text-steel-500">
              We specialize in composite coordinated drawings that eliminate on-site spatial clashes between all trades.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm shrink-0"
          >
            Request Engineering Scope
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
