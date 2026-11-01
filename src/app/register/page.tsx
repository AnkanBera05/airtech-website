"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterSelectionPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"employee" | "client">("employee");

  const handleContinue = () => {
    if (selectedType === "employee") {
      router.push("/register/employee");
    } else {
      router.push("/register/client");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-airtech-charcoal font-sans">
      {/* Left Column: Architectural Branding Panel (Matching Panel 12) */}
      <div className="md:w-5/12 bg-navy-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint-dark-grid opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <span className="text-xl text-blueprint-400 font-bold">▲</span>
            <span className="text-xl font-bold tracking-tight">AIRTECH</span>
          </Link>

          <div className="mt-8 space-y-3">
            <div className="w-10 h-1 bg-blueprint-500 mb-4"></div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              Account Registration
            </h1>
            <p className="text-xs text-steel-400 leading-relaxed max-w-sm">
              AIRTECH maintains strict access control and auditing. All account registrations are manually verified by an administrator before activation.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-navy-800 text-[11px] font-mono text-steel-400">
          <div>Enterprise Security Standard • Zero Trust RBAC</div>
        </div>
      </div>

      {/* Right Column: Selection Card (Matching Panel 12) */}
      <div className="md:w-7/12 flex-1 flex items-center justify-center p-8 sm:p-16 bg-steel-50/50">
        <div className="max-w-md w-full">
          <div className="mb-6">
            <Link
              href="/portal-access"
              className="inline-flex items-center gap-1.5 text-xs text-steel-500 hover:text-navy-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal Access</span>
            </Link>
            <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
              Register with AIRTECH
            </h2>
            <p className="text-xs text-steel-500 mt-1">
              Select your role category to continue registration.
            </p>
          </div>

          <div className="bg-white border border-steel-300 rounded-sm p-8 shadow-panel">
            <label className="block text-xs font-semibold text-airtech-charcoal mb-4">
              I want to register as:
            </label>

            <div className="space-y-4">
              {/* Option 1: Employee */}
              <div
                onClick={() => setSelectedType("employee")}
                className={`p-4 border-2 rounded-sm cursor-pointer transition-all flex items-start gap-4 ${
                  selectedType === "employee"
                    ? "border-airtech-blue bg-blue-50/50 shadow-sm"
                    : "border-steel-200 hover:border-steel-300 bg-white"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                  selectedType === "employee" ? "border-airtech-blue bg-airtech-blue text-white" : "border-steel-400"
                }`}>
                  {selectedType === "employee" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-airtech-blue" />
                    <span className="text-sm font-bold text-navy-950">Employee</span>
                  </div>
                  <p className="text-xs text-steel-500 mt-0.5">
                    For AIRTECH team members and engineering staff
                  </p>
                </div>
              </div>

              {/* Option 2: Client */}
              <div
                onClick={() => setSelectedType("client")}
                className={`p-4 border-2 rounded-sm cursor-pointer transition-all flex items-start gap-4 ${
                  selectedType === "client"
                    ? "border-navy-900 bg-slate-50 shadow-sm"
                    : "border-steel-200 hover:border-steel-300 bg-white"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                  selectedType === "client" ? "border-navy-900 bg-navy-900 text-white" : "border-steel-400"
                }`}>
                  {selectedType === "client" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-navy-900" />
                    <span className="text-sm font-bold text-navy-950">Client</span>
                  </div>
                  <p className="text-xs text-steel-500 mt-0.5">
                    For project clients, developers and contractor organisations
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <span>Continue →</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-steel-500">
            <span>Already have an approved account? </span>
            <Link href="/portal-access" className="text-airtech-blue font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
