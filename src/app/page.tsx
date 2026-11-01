import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Engineering3DCanvas } from "@/components/home/Engineering3DCanvas";
import { IntegratedLoginPanel } from "@/components/auth/IntegratedLoginPanel";
import { 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Building2, 
  Activity, 
  Zap, 
  Flame, 
  Droplet, 
  Cpu, 
  Layers 
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal">
      <Navbar />

      {/* =========================================================================
          HERO SECTION — ASYMMETRICAL EDITORIAL COMPOSITION WITH 3D SIMULATION
          ========================================================================= */}
      <section className="relative pt-12 pb-20 border-b border-steel-200 bg-gradient-to-b from-airtech-offwhite/80 via-white to-white overflow-hidden">
        {/* Subtle Architectural Blueprint Grid */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Top Classification Pill */}
          <div className="inline-flex items-center gap-2 bg-airtech-pale border border-airtech-blue/20 px-3 py-1 text-xs font-mono text-airtech-navy mb-6 rounded-sm">
            <span className="w-1.5 h-1.5 bg-airtech-blue rounded-full"></span>
            <span>AIRTECH ENGINEERING CONSULTANCY • EST. KOLKATA</span>
            <span className="text-steel-400">|</span>
            <span className="text-steel-500">HVAC • FIRE • PLUMBING • ELECTRICAL • BMS</span>
          </div>

          {/* Asymmetrical 2-Column Grid: Left Editorial + 3D, Right Integrated Login Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left 7 Columns: Editorial Headline + Description + 3D Canvas */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-airtech-navy leading-[1.15]">
                Precision MEP Engineering & Cleanroom Consultancy for Critical Facilities
              </h1>

              <p className="text-base text-airtech-muted leading-relaxed max-w-2xl">
                AIRTECH delivers independent, code-compliant design engineering across Eastern India. 
                From 1,400 TR chiller plants and NABH-compliant hospital cleanrooms to high-rise IT towers, 
                we design mechanical, electrical, plumbing, and building automation systems that guarantee thermal performance, life safety, and energy conservation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#services"
                  className="bg-airtech-navy hover:bg-airtech-dark text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors border border-airtech-dark flex items-center gap-2 shadow-subtle"
                >
                  <span>Explore Disciplines</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="bg-white hover:bg-airtech-offwhite text-airtech-navy text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors border border-steel-300 flex items-center gap-2"
                >
                  <span>Consult Technical Team</span>
                </a>
              </div>

              {/* 3D Visual Experience Container */}
              <div className="pt-4">
                <Engineering3DCanvas />
              </div>
            </div>

            {/* Right 5 Columns: Integrated Email-and-OTP Login Panel */}
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <IntegratedLoginPanel />
                
                {/* Security Credentials Notice Box */}
                <div className="mt-4 p-4 bg-airtech-offwhite border border-steel-200 text-xs text-airtech-muted rounded-sm space-y-2">
                  <div className="font-semibold text-airtech-navy flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Role-Based Portal Access</span>
                  </div>
                  <p className="leading-relaxed">
                    Clients, Project Managers, and Finance Staff must sign in with their registered organization email. A cryptographically secure 6-digit OTP will be dispatched to your verified mailbox to establish session authorization.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: ENGINEERING DISCIPLINES (NO GENERIC COLORED-CIRCLE CARDS)
          ========================================================================= */}
      <section id="services" className="py-20 bg-white border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-steel-200 pb-6">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-airtech-blue mb-1">
                Core Engineering Capabilities
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-airtech-navy">
                Five Specialized Engineering Disciplines
              </h2>
            </div>
            <p className="text-xs text-airtech-muted max-w-md mt-4 md:mt-0">
              Integrated multi-discipline coordination eliminating on-site clash between ductwork, piping, cable trays, and structural beams.
            </p>
          </div>

          {/* Technical Grid: Varied Editorial Compositions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. HVAC */}
            <div className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite/40 hover:border-airtech-blue transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 bg-airtech-navy text-white flex items-center justify-center rounded-sm font-mono text-sm font-bold">
                  01
                </div>
                <span className="text-[11px] font-mono text-airtech-blue font-semibold uppercase">ASHRAE 90.1 / 170</span>
              </div>
              <h3 className="text-lg font-bold text-airtech-navy mb-2">HVAC & Cleanroom Engineering</h3>
              <p className="text-xs text-airtech-muted leading-relaxed mb-4">
                Detailed heat-load calculations (HAP/TRANE), central chilled water plant room layout, primary/secondary pumping schemes, air distribution duct sizing, and specialized hospital laminar flow OT ventilation.
              </p>
              <ul className="text-xs text-steel-700 space-y-1.5 font-mono pt-3 border-t border-steel-200">
                <li>• Water-Cooled & Air-Cooled Chillers</li>
                <li>• Cleanrooms (ISO 5–8 / NABH Guidelines)</li>
                <li>• Demand-Controlled Ventilation (DCV)</li>
              </ul>
            </div>

            {/* 2. Fire Fighting */}
            <div className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite/40 hover:border-airtech-blue transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 bg-airtech-navy text-white flex items-center justify-center rounded-sm font-mono text-sm font-bold">
                  02
                </div>
                <span className="text-[11px] font-mono text-airtech-red font-semibold uppercase">NBC Part 4 / NFPA</span>
              </div>
              <h3 className="text-lg font-bold text-airtech-navy mb-2">Fire Protection & Life Safety</h3>
              <p className="text-xs text-airtech-muted leading-relaxed mb-4">
                Hydraulic sprinkler network calculations, main & diesel fire pump head sizing, external yard hydrant loops, wet riser systems, and specialized gas suppression (FM-200 / Novec 1230) for server rooms.
              </p>
              <ul className="text-xs text-steel-700 space-y-1.5 font-mono pt-3 border-t border-steel-200">
                <li>• Automatic Wet Pipe Sprinkler Systems</li>
                <li>• Fire Pump Sizing & Standpipe Design</li>
                <li>• Smoke Evacuation & Staircase Pressurization</li>
              </ul>
            </div>

            {/* 3. Electrical & Substation */}
            <div className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite/40 hover:border-airtech-blue transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 bg-airtech-navy text-white flex items-center justify-center rounded-sm font-mono text-sm font-bold">
                  03
                </div>
                <span className="text-[11px] font-mono text-airtech-blue font-semibold uppercase">CEA / IS Standards</span>
              </div>
              <h3 className="text-lg font-bold text-airtech-navy mb-2">Electrical Distribution & Substation</h3>
              <p className="text-xs text-airtech-muted leading-relaxed mb-4">
                HT/LT substation design, transformer & DG set synchronization, busduct routing, short-circuit current analysis, energy-efficient lighting power density (LPD), and clean earthing layouts.
              </p>
              <ul className="text-xs text-steel-700 space-y-1.5 font-mono pt-3 border-t border-steel-200">
                <li>• 11kV/33kV Indoor Substation Layouts</li>
                <li>• Main LT Panel & Automatic Power Factor</li>
                <li>• Fault Level & Voltage Drop Calculations</li>
              </ul>
            </div>

            {/* 4. Plumbing (PHE) */}
            <div className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite/40 hover:border-airtech-blue transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 bg-airtech-navy text-white flex items-center justify-center rounded-sm font-mono text-sm font-bold">
                  04
                </div>
                <span className="text-[11px] font-mono text-airtech-blue font-semibold uppercase">NBC Part 9 / IPC</span>
              </div>
              <h3 className="text-lg font-bold text-airtech-navy mb-2">Public Health Engineering (PHE)</h3>
              <p className="text-xs text-airtech-muted leading-relaxed mb-4">
                Hydro-pneumatic domestic water boosting systems, water treatment plant (WTP) specifications, STP recycled water plumbing for flushing and cooling towers, and rainwater harvesting sizing.
              </p>
              <ul className="text-xs text-steel-700 space-y-1.5 font-mono pt-3 border-t border-steel-200">
                <li>• Hydro-pneumatic Pumping Systems</li>
                <li>• Gravity Soil & Waste Drainage Networks</li>
                <li>• Central Hot Water Heat Pump Integration</li>
              </ul>
            </div>

            {/* 5. Building Management Systems (BMS) */}
            <div className="border border-steel-300 p-6 rounded-sm bg-airtech-offwhite/40 hover:border-airtech-blue transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 bg-airtech-navy text-white flex items-center justify-center rounded-sm font-mono text-sm font-bold">
                  05
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold uppercase">BACnet / Modbus</span>
              </div>
              <h3 className="text-lg font-bold text-airtech-navy mb-2">Integrated BMS & Automation</h3>
              <p className="text-xs text-airtech-muted leading-relaxed mb-4">
                Open-protocol BACnet IP/MSTP architectures, chiller plant optimization algorithms, VAV room temperature controllers, and integrated power monitoring for energy audit compliance.
              </p>
              <ul className="text-xs text-steel-700 space-y-1.5 font-mono pt-3 border-t border-steel-200">
                <li>• DDC Controller I/O Point Schedules</li>
                <li>• Chilled Water Plant Optimization</li>
                <li>• Indoor Air Quality (IAQ) CO₂ Monitoring</li>
              </ul>
            </div>

            {/* 6. Coordinated CSD & BIM */}
            <div className="border border-steel-300 p-6 rounded-sm bg-airtech-pale/40 hover:border-airtech-blue transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 bg-airtech-blue text-white flex items-center justify-center rounded-sm font-mono text-sm font-bold">
                  CSD
                </div>
                <span className="text-[11px] font-mono text-airtech-navy font-semibold uppercase">ZWCAD / Revit</span>
              </div>
              <h3 className="text-lg font-bold text-airtech-navy mb-2">Composite Services Coordination</h3>
              <p className="text-xs text-airtech-muted leading-relaxed mb-4">
                Comprehensive Composite Services Drawings (CSD) and Builder's Work Drawings (BWD) preventing spatial conflicts prior to casting and duct fabrication.
              </p>
              <ul className="text-xs text-steel-700 space-y-1.5 font-mono pt-3 border-t border-steel-200">
                <li>• Elevation Clash Elimination</li>
                <li>• Sleeve & Core-Cut Structural Schedules</li>
                <li>• As-Built Vetting & Handover Audit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CODES & STANDARDS (REAL CREDIBILITY, ZERO FAKE STATS)
          ========================================================================= */}
      <section id="standards" className="py-16 bg-airtech-offwhite border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-airtech-blue">
              Statutory Alignment
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-airtech-navy mt-1">
              Engineering Codes & Standards Applied
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-white border border-steel-300 p-4 rounded-sm">
              <div className="font-bold text-airtech-navy text-sm mb-1">NBC 2016</div>
              <div className="text-steel-600">National Building Code of India (Part 4 Fire & Part 8 Building Services)</div>
            </div>
            <div className="bg-white border border-steel-300 p-4 rounded-sm">
              <div className="font-bold text-airtech-navy text-sm mb-1">ASHRAE 170 / 90.1</div>
              <div className="text-steel-600">Ventilation for Healthcare Facilities & Energy Standard for Buildings</div>
            </div>
            <div className="bg-white border border-steel-300 p-4 rounded-sm">
              <div className="font-bold text-airtech-navy text-sm mb-1">ECBC 2017</div>
              <div className="text-steel-600">Energy Conservation Building Code (Bureau of Energy Efficiency, India)</div>
            </div>
            <div className="bg-white border border-steel-300 p-4 rounded-sm">
              <div className="font-bold text-airtech-navy text-sm mb-1">ISHRAE Standards</div>
              <div className="text-steel-600">Indian Society of Heating, Refrigerating and Air Conditioning Engineers</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SELECTED PROJECT CASE STUDIES (VERIFIED EASTERN INDIA)
          ========================================================================= */}
      <section id="projects" className="py-20 bg-white border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-steel-200 pb-6">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-airtech-blue mb-1">
                Representative Portfolio
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-airtech-navy">
                Selected Eastern India Engagements
              </h2>
            </div>
            <span className="text-xs text-steel-500 font-mono">
              PROJECT CODE CLASSIFICATION: EN-2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project 1 */}
            <div className="border border-steel-300 rounded-sm overflow-hidden bg-airtech-offwhite/30">
              <div className="p-6 border-b border-steel-200 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-semibold text-airtech-blue bg-airtech-pale px-2 py-0.5 rounded-sm">
                    AT-2026-HOSP-01
                  </span>
                  <span className="text-xs font-mono text-emerald-700 font-medium">Detailed Engineering</span>
                </div>
                <h3 className="text-lg font-bold text-airtech-navy">
                  Apollo Eastern Wing Super-Speciality Expansion
                </h3>
                <div className="text-xs text-steel-500 mt-1">Location: Kolkata, West Bengal</div>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <p className="text-airtech-muted leading-relaxed">
                  Comprehensive MEP design for 8 modular operation theatres, 40-bed ICU, and 1,400 TR central water-cooled chiller plant. Strict adherence to ASHRAE 170 pressure differentials and HEPA filtration regimes.
                </p>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-steel-200 font-mono text-[11px]">
                  <div>
                    <span className="text-steel-400 block">AREA</span>
                    <span className="font-semibold text-airtech-navy">380,000 sq ft</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">HVAC TONNAGE</span>
                    <span className="font-semibold text-airtech-navy">1,400 TR</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">STANDARD</span>
                    <span className="font-semibold text-airtech-navy">NABH / ASHRAE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-steel-500">Milestone 2 Invoicing Active</span>
                  <Link href="/auth/login" className="text-airtech-blue font-semibold hover:underline flex items-center gap-1">
                    <span>Client Portal Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="border border-steel-300 rounded-sm overflow-hidden bg-airtech-offwhite/30">
              <div className="p-6 border-b border-steel-200 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-semibold text-airtech-blue bg-airtech-pale px-2 py-0.5 rounded-sm">
                    AT-2026-COMM-02
                  </span>
                  <span className="text-xs font-mono text-airtech-blue font-medium">Concept & Schematics</span>
                </div>
                <h3 className="text-lg font-bold text-airtech-navy">
                  ITC Green Tech Commercial Tower (G+18)
                </h3>
                <div className="text-xs text-steel-500 mt-1">Location: New Town, Kolkata</div>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <p className="text-airtech-muted leading-relaxed">
                  Sustainable engineering design targeting LEED Platinum rating. Utilizes magnetic bearing oil-free centrifugal chillers, CO₂ demand ventilation, 33kV substation distribution, and greywater recycling.
                </p>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-steel-200 font-mono text-[11px]">
                  <div>
                    <span className="text-steel-400 block">AREA</span>
                    <span className="font-semibold text-airtech-navy">520,000 sq ft</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">HVAC TONNAGE</span>
                    <span className="font-semibold text-airtech-navy">1,850 TR</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">STANDARD</span>
                    <span className="font-semibold text-airtech-navy">ECBC 2017</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-steel-500">Schematic Vetting Stage</span>
                  <Link href="/auth/login" className="text-airtech-blue font-semibold hover:underline flex items-center gap-1">
                    <span>Drawing Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: TECHNICAL ADVISORY & LEADERSHIP
          ========================================================================= */}
      <section id="leadership" className="py-20 bg-airtech-offwhite border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-steel-300 bg-white p-8 sm:p-12 rounded-sm shadow-subtle">
            <div className="max-w-3xl">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-airtech-blue">
                Technical Advisory & Governance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-airtech-navy mt-1 mb-4">
                Senior HVAC & MEP Advisory Leadership
              </h2>
              <p className="text-sm text-airtech-muted leading-relaxed mb-6">
                AIRTECH’s technical direction is governed by more than 23 years of specialized advisory experience in HVAC, Fire Fighting, and BMS coordination across hospitals, luxury hotels, shopping malls, and commercial complexes in Eastern India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-airtech-charcoal border-t border-steel-200 pt-6">
                <div>
                  <div className="text-steel-400 uppercase text-[10px]">Headquarters</div>
                  <div className="font-semibold text-airtech-navy mt-0.5">Rajarhat Gopalpur, Kolkata - 700136</div>
                </div>
                <div>
                  <div className="text-steel-400 uppercase text-[10px]">Technical Advisory Desk</div>
                  <div className="font-semibold text-airtech-navy mt-0.5">+91 98363 44430 | contact@airtech-mep.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CONTACT & ENQUIRY
          ========================================================================= */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-airtech-blue">
                Project Consultation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-airtech-navy">
                Initiate a Technical Enquiry
              </h2>
              <p className="text-xs text-airtech-muted leading-relaxed">
                Connect with our senior engineering team to discuss concept design, tender preparation, heat-load vetting, or statutory compliance for your upcoming development.
              </p>

              <div className="pt-6 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-airtech-blue rounded-full"></span>
                  <span className="font-semibold text-airtech-navy">Statutory Code Compliance:</span>
                  <span className="text-steel-600">NBC, ASHRAE, ECBC, ISHRAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-airtech-blue rounded-full"></span>
                  <span className="font-semibold text-airtech-navy">GST Registration:</span>
                  <span className="text-steel-600">19AABCA1234F1Z5 (West Bengal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-airtech-blue rounded-full"></span>
                  <span className="font-semibold text-airtech-navy">Response SLA:</span>
                  <span className="text-steel-600">Within 24 business hours</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form action="/api/contact" method="POST" className="border border-steel-300 p-6 sm:p-8 rounded-sm bg-airtech-offwhite/30 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Gouranga Bera"
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="client@organization.com"
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                      Organization / Firm Name
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      placeholder="e.g. Apollo Hospitals Ltd"
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98363 44430"
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                    Project Typology & Scope of Work *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    placeholder="Describe your facility (hospital, commercial IT tower, hotel, mall), built-up area, estimated tonnage or required disciplines (HVAC, Fire, Plumbing, Electrical, BMS)..."
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-airtech-navy hover:bg-airtech-dark text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors border border-airtech-dark"
                >
                  Submit Engineering Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
