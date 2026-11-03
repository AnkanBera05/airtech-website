"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, MapPin, Briefcase, Clock, CheckCircle2, X, RefreshCw, AlertCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experienceYears, setExperienceYears] = useState("3-5 Years");
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverNotes, setCoverNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenModal = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    setSubmitted(false);
    setErrorMessage(null);
  };

  const handleCloseModal = () => {
    setSelectedRole(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !selectedRole) {
      setErrorMessage("Please complete all mandatory fields.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          positionTitle: selectedRole,
          experienceYears,
          resumeUrl,
          coverNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting application";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

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
                <div
                  key={pos.id}
                  onClick={() => handleOpenModal(pos.title)}
                  className="bg-white border border-steel-300 rounded-sm p-5 flex items-center justify-between hover:border-airtech-blue hover:shadow-subtle transition-all group cursor-pointer"
                >
                  <div>
                    <h3 className="text-base font-bold text-navy-950 group-hover:text-airtech-blue transition-colors">
                      {pos.title}
                    </h3>
                    <div className="text-xs text-steel-500 font-mono mt-1">
                      {pos.type} | {pos.location} • {pos.department}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-xs font-semibold text-airtech-blue uppercase tracking-wider group-hover:underline">
                      Apply Now
                    </span>
                    <div className="w-8 h-8 rounded-full border border-steel-300 flex items-center justify-center text-steel-400 group-hover:border-airtech-blue group-hover:text-airtech-blue group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={() => handleOpenModal("General Engineering Application")}
                className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-sm inline-flex items-center gap-2 transition"
              >
                <span>Submit General Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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

      {/* Interactive Application Modal with Brevo Notification */}
      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white border border-steel-300 shadow-2xl p-6 sm:p-8 rounded-sm relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-steel-400 hover:text-navy-950 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-950 mb-2">Application Submitted!</h3>
                  <p className="text-xs text-steel-600 leading-relaxed max-w-sm mx-auto mb-6">
                    Thank you, <strong>{fullName}</strong>. Your application for <strong>{selectedRole}</strong> has been received and dispatched to our engineering talent team via Brevo.
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 bg-navy-950 text-white font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-airtech-blue transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-airtech-blue font-semibold">
                      Engineering Careers
                    </span>
                    <h3 className="text-xl font-bold text-navy-950 mt-1">
                      Apply for {selectedRole}
                    </h3>
                    <p className="text-xs text-steel-500 mt-1">
                      Submit your qualifications directly to our engineering recruitment division.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border-l-2 border-red-600 text-red-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitApplication} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rahul@example.com"
                          className="w-full px-3 py-2 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98300 00000"
                          className="w-full px-3 py-2 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                          Relevant Experience
                        </label>
                        <select
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full px-3 py-2 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                        >
                          <option>0-2 Years (Junior / Graduate)</option>
                          <option>3-5 Years (Design Engineer)</option>
                          <option>6-9 Years (Senior Consultant)</option>
                          <option>10+ Years (Principal / Lead)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                          CV / Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="w-full px-3 py-2 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
                        Cover Notes / Professional Highlights
                      </label>
                      <textarea
                        rows={3}
                        value={coverNotes}
                        onChange={(e) => setCoverNotes(e.target.value)}
                        placeholder="Briefly describe your MEP / HVAC project experience or software proficiency (AutoCAD, Revit MEP, HAP)..."
                        className="w-full px-3 py-2 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-navy-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-airtech-blue transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Application to AIRTECH HR</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
