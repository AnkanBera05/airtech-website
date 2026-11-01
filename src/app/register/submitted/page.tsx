"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function RegistrationSubmittedPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-airtech-charcoal font-sans">
      {/* Left Column: Branding Panel */}
      <div className="md:w-5/12 bg-navy-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-dark-grid opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <span className="text-xl text-blueprint-400 font-bold">▲</span>
            <span className="text-xl font-bold tracking-tight">AIRTECH</span>
          </Link>

          <div className="mt-8 space-y-3">
            <div className="w-10 h-1 bg-emerald-500 mb-4"></div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              Verification Protocol Initiated
            </h1>
            <p className="text-xs text-steel-400 leading-relaxed max-w-sm">
              Our administrative security protocol ensures all account holders possess authenticated enterprise clearance prior to data access.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-navy-800 text-[11px] font-mono text-steel-400 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Registration Logged</span>
          </div>
          <div>Audit record created in PostgreSQL</div>
        </div>
      </div>

      {/* Right Column: Submitted Card (Matching Panel 14) */}
      <div className="md:w-7/12 flex-1 flex items-center justify-center p-8 sm:p-16 bg-steel-50/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-steel-300 rounded-sm p-8 sm:p-10 shadow-panel text-center"
        >
          {/* Green Checkmark Icon (Matching Panel 14) */}
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-bold text-navy-950 tracking-tight mb-2">
            Registration Submitted
          </h2>

          <p className="text-xs sm:text-sm text-steel-500 leading-relaxed mb-8 max-w-xs mx-auto">
            Your application has been received. It will be reviewed by an administrator. You will be notified by email once approved.
          </p>

          <Link
            href="/portal-access"
            className="w-full bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded-sm transition-colors inline-flex items-center justify-center gap-2 shadow-subtle"
          >
            <span>Back to Login</span>
          </Link>

          <div className="mt-6 text-[11px] text-steel-400 font-mono">
            Standard Review Timeline: 2 to 4 Business Hours
          </div>
        </motion.div>
      </div>
    </div>
  );
}
