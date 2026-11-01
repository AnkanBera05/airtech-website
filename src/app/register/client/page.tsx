"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Building2, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";

export default function ClientRegistrationPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !email || !organizationName || !password || !confirmPassword) {
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
          type: "client",
          fullName,
          email,
          organizationName,
          phone,
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
            <div className="w-10 h-1 bg-blueprint-500 mb-4"></div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              Client Organization Onboarding
            </h1>
            <p className="text-xs text-steel-400 leading-relaxed max-w-sm">
              Register your enterprise, developer firm or contracting organization to access project deliverables, approved drawings, and billing registers.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-navy-800 text-[11px] font-mono text-steel-400 space-y-1">
          <div className="flex items-center gap-1.5 text-blueprint-400">
            <Building2 className="w-4 h-4" />
            <span>Client Enterprise Gateway</span>
          </div>
          <div>All client requests are verified by Project Management</div>
        </div>
      </div>

      {/* Right Column: Form Container */}
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
              Client Registration
            </h2>
            <p className="text-xs text-steel-500 mt-1">
              Provide your organization details to register for the AIRTECH Client Portal.
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
                  Representative Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Amitabh Roy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-sans bg-white focus:border-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                  Business / Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="amitabh.roy@clientcorp.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-navy-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                    Organization / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ABC Developments Ltd"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-sans bg-white focus:border-navy-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98300 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-navy-900 focus:outline-none"
                  />
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
                      className="w-full text-xs p-2.5 pr-10 border border-steel-300 rounded-sm font-mono bg-white focus:border-navy-900 focus:outline-none"
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
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
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
            <Link href="/client/login" className="text-navy-900 font-semibold hover:underline">
              Client Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
