import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal">
      <Navbar />

      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 uppercase tracking-wider mb-2">
            Engineering Consultation & Office
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Contact AIRTECH
          </h1>
          <p className="text-sm text-steel-400 max-w-2xl leading-relaxed">
            Direct communication for project proposals, technical advisory, drawing vetting, and career inquiries.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold text-airtech-navy">
              Registered Office & Advisory Desk
            </h2>

            <div className="space-y-4 text-xs">
              <div className="border border-steel-300 p-4 rounded-sm bg-airtech-offwhite">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-airtech-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-airtech-navy">Headquarters Location</div>
                    <div className="text-steel-600 mt-0.5 leading-relaxed">
                      Rajarhat Gopalpur, Kolkata - 700136<br />
                      West Bengal, India
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-steel-300 p-4 rounded-sm bg-airtech-offwhite">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-airtech-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-airtech-navy">Direct Engineering Advisory</div>
                    <div className="text-steel-600 mt-0.5 font-mono">+91 98363 44430</div>
                  </div>
                </div>
              </div>

              <div className="border border-steel-300 p-4 rounded-sm bg-airtech-offwhite">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-airtech-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-airtech-navy">Electronic Mail</div>
                    <div className="text-steel-600 mt-0.5 font-mono">contact@airtech-mep.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-airtech-pale border border-airtech-blue/20 rounded-sm text-xs text-airtech-navy font-mono">
              <div>GSTIN: 19AABCA1234F1Z5</div>
              <div>PAN: AABCA1234F</div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <form action="/api/contact" method="POST" className="border border-steel-300 p-8 rounded-sm bg-white space-y-4 shadow-subtle">
              <h3 className="text-base font-bold text-airtech-navy mb-4">
                Submit Technical or Commercial Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Gouranga Bera"
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="client@company.com"
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                  Organization / Client Name
                </label>
                <input
                  type="text"
                  name="organizationName"
                  placeholder="e.g. Apollo Hospitals Ltd"
                  className="w-full text-xs p-2.5 border border-steel-300 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1">
                  Inquiry Details / Scope *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Detail your engineering requirements, project location, facility area, or scope of review..."
                  className="w-full text-xs p-2.5 border border-steel-300 rounded-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-airtech-navy hover:bg-airtech-dark text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors border border-airtech-dark"
              >
                Send Official Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
