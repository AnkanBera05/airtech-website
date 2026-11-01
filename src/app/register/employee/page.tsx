"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Briefcase, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function EmployeeRegistrationPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Mechanical (HVAC)");
  const [designation, setDesignation] = useState("Design Engineer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all mandatory fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "employee",
          fullName,
          email,
          department,
          designation,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      router.push("/register/submitted");
    } catch {
      setErrorMessage("Unable to connect to server. Please try again.");
      setLoading(false);
    }
  };

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
            <div className="w-10 h-1 bg-airtech-blue mb-4"></div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              Employee Onboarding & Registration
            </h1>
            <p className="text-xs text-steel-400 leading-relaxed max-w-sm">
              Join the AIRTECH engineering team. Once submitted, your registration request will be reviewed and approved by the Super Admin.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-navy-800 text-[11px] font-mono text-steel-400 space-y-1">
          <div className="flex items-center gap-1.5 text-blueprint-400">
            <Briefcase className="w-4 h-4" />
            <span>Internal Engineering Division</span>
          </div>
          <div>Role assignment requires Super Admin sign-off</div>
        </div>
      </div>

      {/* Right Column: Form Container (Matching Panel 13) */}
      <div className="md:w-7/12 flex-1 flex items-center justify-center p-8 sm:p-12 bg-steel-50/50">
        <div className="max-w-lg w-full">
          <div className="mb-6">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs text-steel-500 hover:text-navy-900 mb-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Selection</span>
            </Link>
            <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
              Employee Registration
            </h2>
            <p className="text-xs text-steel-500 mt-1">
              Provide your official details to register as an AIRTECH engineering team member.
            </p>
          </div>

          <div className="bg-white border border-steel-300 rounded-sm p-8 shadow-panel">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-sans bg-white focus:border-airtech-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rahul@airtech.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-airtech-blue focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm bg-white focus:border-airtech-blue focus:outline-none"
                  >
                    <option value="Mechanical (HVAC)">Mechanical (HVAC)</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing (PHE)">Plumbing (PHE)</option>
                    <option value="Fire Fighting">Fire Fighting</option>
                    <option value="BMS Integration">BMS Integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                    Designation *
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm bg-white focus:border-airtech-blue focus:outline-none"
                  >
                    <option value="Design Engineer">Design Engineer</option>
                    <option value="Senior HVAC Consultant">Senior HVAC Consultant</option>
                    <option value="MEP Coordinator">MEP Coordinator</option>
                    <option value="CAD/BIM Modeler">CAD/BIM Modeler</option>
                    <option value="Site Engineer">Site Engineer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs p-2.5 pr-10 border border-steel-300 rounded-sm font-mono bg-white focus:border-airtech-blue focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-steel-400 hover:text-navy-900"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-airtech-blue focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-airtech-blue hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Submit Registration →</span>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-steel-500">
            <span>Already have an approved account? </span>
            <Link href="/employee/login" className="text-airtech-blue font-semibold hover:underline">
              Employee Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
