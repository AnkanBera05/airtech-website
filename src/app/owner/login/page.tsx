"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, Mail, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function OwnerLoginPage() {
  const router = useRouter();

  // State: 'credentials' -> 'otp'
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("bera.ankan005@gmail.com");
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
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle credentials submit (Panel 9 -> Panel 10)
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!password) {
      setErrorMessage("Please enter your Owner account password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portalType: "owner" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      setMustChangePassword(data.mustChangePassword || false);
      setStep("otp");
      setResendCooldown(60);
      setStatusMessage("A 6-digit verification code has been dispatched to b*****005@gmail.com");
    } catch {
      setErrorMessage("Unable to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // Handle individual digit input in OTP boxes
  const handleDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto advance focus
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification (Panel 10 -> Panel 11 or /admin)
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

      // Check if first-time login requires password change
      if (mustChangePassword) {
        router.push("/owner/change-password");
      } else {
        router.push("/admin");
      }
    } catch {
      setErrorMessage("Network error during verification.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-airtech-charcoal font-sans">
      {/* Left Column: Deep Navy Architectural Branding Panel (Matching Panel 9) */}
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
              Executive Governance & Owner Administration
            </h1>
            <p className="text-xs text-steel-400 leading-relaxed max-w-sm">
              Authorized access to full company metrics, project approvals, engineering registers, and statutory banking parameters.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-navy-800 text-[11px] font-mono text-steel-400 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Super Admin Clearance</span>
          </div>
          <div>PostgreSQL Row Level Security Guard</div>
        </div>
      </div>

      {/* Right Column: Clean Form Container */}
      <div className="md:w-7/12 flex-1 flex items-center justify-center p-8 sm:p-16 bg-steel-50/50">
        <div className="max-w-md w-full">
          {/* STEP 1: Owner Credentials Form (Matching Panel 9) */}
          {step === "credentials" ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-steel-300 rounded-sm p-8 shadow-panel"
            >
              <div className="mb-6">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-airtech-blue mb-1">
                  Step 1 of 2
                </div>
                <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
                  Owner Login
                </h2>
                <p className="text-xs text-steel-500 mt-1">
                  Sign in to the Admin Portal.
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
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

                  <Link href="/forgot-password" className="text-airtech-blue hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Continue →</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            /* STEP 2: 6-Digit OTP Verification (Matching Panel 10) */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-steel-300 rounded-sm p-8 shadow-panel text-center"
            >
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-airtech-blue mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>

              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-airtech-blue mb-1">
                Step 2 of 2
              </div>
              <h2 className="text-2xl font-bold text-navy-950 tracking-tight">
                Verify Your Login
              </h2>
              <p className="text-xs text-steel-500 mt-1 max-w-xs mx-auto leading-relaxed">
                A 6-digit verification code has been sent to <strong>b*****005@gmail.com</strong>
              </p>

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleOtpVerify} className="mt-6 space-y-6">
                {/* 6 Discrete Digit Boxes matching Panel 10 */}
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
                      className="w-11 h-12 text-center text-xl font-mono font-bold border-2 border-steel-300 rounded-sm focus:border-airtech-blue focus:outline-none text-navy-950"
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
                  className="w-full bg-airtech-blue hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
