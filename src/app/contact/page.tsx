"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !message) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to submit enquiry. Please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending enquiry";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      {/* Header Section (Matching Panel 7) */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-steel-300 max-w-2xl leading-relaxed">
            We'd be happy to discuss your project requirements.
          </p>
        </div>
      </section>

      {/* Main 2-Column Section (Matching Panel 7) */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 5 Columns: Direct Contacts */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-navy-950 mb-2">
                Engineering Advisory Offices
              </h2>
              <p className="text-xs text-steel-500 leading-relaxed">
                Connect with our technical consultants for engineering inquiries, design vetting, or RFP submissions.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-blue-50 border border-blue-200 flex items-center justify-center text-airtech-blue shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-navy-950">Email</div>
                  <a href="mailto:info@airtech.in" className="text-xs font-mono text-airtech-blue hover:underline">
                    info@airtech.in
                  </a>
                  <div className="text-[11px] font-mono text-steel-400">
                    consultant@airtech-mep.com
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-blue-50 border border-blue-200 flex items-center justify-center text-airtech-blue shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-navy-950">Phone</div>
                  <div className="text-xs font-mono text-steel-700">
                    +91 80 1234 5678
                  </div>
                  <div className="text-xs font-mono text-steel-700">
                    +91 98363 44430 (Kolkata Advisory)
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-blue-50 border border-blue-200 flex items-center justify-center text-airtech-blue shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-navy-950">Locations</div>
                  <div className="text-xs text-steel-600">
                    <strong>Design Center:</strong> Bengaluru, Karnataka, India
                  </div>
                  <div className="text-xs text-steel-600 mt-1">
                    <strong>Registered HQ:</strong> Rajarhat Gopalpur, Kolkata - 700136, West Bengal
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-steel-50 border border-steel-200 rounded-sm text-xs text-steel-500 font-mono space-y-1">
              <div>GSTIN: 19AABCA1234F1Z5</div>
              <div>HSN / SAC: 998333 (Engineering Design Services)</div>
            </div>
          </div>

          {/* Right 7 Columns: Send Enquiry Form (Matching Panel 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-steel-300 rounded-sm p-8 sm:p-10 shadow-panel">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-950 mb-2">
                    Enquiry Received
                  </h3>
                  <p className="text-xs text-steel-500 max-w-sm mx-auto mb-6">
                    Thank you. An AIRTECH engineering consultant will review your message and respond within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setMessage("");
                    }}
                    className="text-xs font-semibold text-airtech-blue hover:underline"
                  >
                    Submit another enquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-navy-950 tracking-tight">
                      Send an Enquiry
                    </h3>
                    <p className="text-xs text-steel-500 mt-0.5">
                      Tell us about your facility or MEP design requirements.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-sans bg-white focus:border-navy-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-navy-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98300 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-navy-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your project, floor area, cooling requirements, or codes..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-sans bg-white focus:border-navy-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Send Enquiry →</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
