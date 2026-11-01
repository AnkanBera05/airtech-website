"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Building2, Mail, ArrowRight, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ClientLoginPage() {
  const router = useRouter();

  // State: 'credentials' -> 'otp'
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // 6 discrete OTP boxes
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(52);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter your organization business email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portalType: "client" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      setStep("otp");
      setResendCooldown(60);
      setStatusMessage(`A 6-digit verification code has been dispatched to ${email}`);
    } catch {
      setErrorMessage("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const combinedOtp = otpDigits.join("");

    if (combinedOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: combinedOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Invalid or expired OTP code.");
        setLoading(false);
        return;
      }

      router.push(data.redirectUrl || "/client");
    } catch {
      setErrorMessage("Network error during verification.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-airtech-charcoal font-sans">
      {/* Left Column: Client Organization Branding Panel */}
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
              Client Project & Commercial Portal
            </h1>
            <p className="text-xs text-steel-400 leading-relaxed max-w-sm">
              Review approved engineering drawings, track construction milestones, submit technical RFIs, and process GST-compliant invoice settlements.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-navy-800 text-[11px] font-mono text-steel-400 space-y-1">
          <div className="flex items-center gap-1.5 text-blueprint-400">
            <Building2 className="w-4 h-4" />
            <span>Client Enterprise Gateway</span>
          </div>
          <div>Project Isolation & Confidentiality Enforced</div>
        </div>
      </div>

      {/* Right Column: Login Card */}
      <div className="md:w-7/12 flex-1 flex items-center justify-center p-8 sm:p-16 bg-steel-50/50">
        <div className="max-w-md w-full">
          {step === "credentials" ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-steel-300 rounded-sm p-8 shadow-panel"
            >
              <div className="mb-6">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-navy-900 mb-1">
                  Client Portal • Step 1 of 2
                </div>
                <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
                  Client Login
                </h2>
                <p className="text-xs text-steel-500 mt-1">
                  Sign in to view your organization's engineering deliverables.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="authorized@client.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono bg-white focus:border-navy-900 focus:outline-none"
                  />
                </div>

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
                      placeholder="••••••••••••"
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

                <div className="flex items-center justify-between text-xs text-steel-500 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-sm border-steel-300 text-navy-900 focus:ring-0"
                    />
                    <span>Remember me</span>
                  </label>

                  <a href="#forgot" className="text-airtech-blue hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Continue →</span>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-steel-100 text-center text-xs text-steel-500">
                <span>New client organization? </span>
                <Link href="/register/client" className="text-navy-900 font-semibold hover:underline">
                  Register Organization
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-steel-300 rounded-sm p-8 shadow-panel text-center"
            >
              <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-full flex items-center justify-center text-navy-900 mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>

              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-navy-900 mb-1">
                Client Verification • Step 2 of 2
              </div>
              <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
                Verify Your Login
              </h2>
              <p className="text-xs text-steel-500 mt-1 max-w-xs mx-auto leading-relaxed">
                A 6-digit verification code has been dispatched to <strong>{email}</strong>
              </p>

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleOtpVerify} className="mt-6 space-y-6">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-11 h-12 text-center text-xl font-mono font-bold border-2 border-steel-300 rounded-sm focus:border-navy-900 focus:outline-none text-navy-950"
                    />
                  ))}
                </div>

                <div className="text-xs font-mono text-steel-500">
                  {resendCooldown > 0 ? (
                    <span>Resend code in 00:{resendCooldown < 10 ? `0${resendCooldown}` : resendCooldown}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResendCooldown(60)}
                      className="text-airtech-blue hover:underline"
                    >
                      Resend code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join("").length !== 6}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Verify & Login →</span>
                  )}
                </button>

                <div className="pt-2 border-t border-steel-100">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setOtpDigits(["", "", "", "", "", ""]);
                    }}
                    className="text-xs text-steel-500 hover:text-navy-900 underline"
                  >
                    Back to credentials
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="mt-6 text-center text-xs text-steel-400">
            <Link href="/portal-access" className="hover:text-navy-900">
              ← Switch Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
