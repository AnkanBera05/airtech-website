"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step 1: 'request' -> Step 2: 'verify_and_reset' -> Step 3: 'success'
  const [step, setStep] = useState<"request" | "verify_and_reset" | "success">("request");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otpDigits];
    updated[index] = val.slice(-1);
    setOtpDigits(updated);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  // Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email) {
      setErrorMessage("Please enter your account email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to dispatch password reset code.");
        setLoading(false);
        return;
      }

      setStep("verify_and_reset");
      setCooldown(60);
      setStatusMessage(`A 6-digit verification code has been dispatched to ${email}.`);
    } catch {
      setErrorMessage("Network error. Unable to reach authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Set New Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: fullOtp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Password reset verification failed.");
        setLoading(false);
        return;
      }

      setStep("success");
      setStatusMessage("Your password has been successfully updated.");
    } catch {
      setErrorMessage("Network error during password reset verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-airtech-charcoal font-sans">
      {/* Left Column: Branding */}
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
              Account Security &amp; Password Recovery
            </h1>
            <p className="text-xs text-steel-400 leading-relaxed max-w-sm">
              AIRTECH uses multi-factor email verification powered by Brevo. Enter your email to receive a 6-digit one-time passcode to securely reset your credentials.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-navy-800 text-[11px] font-mono text-steel-400 space-y-1">
          <div className="flex items-center gap-1.5 text-blueprint-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Dual-Layer Verification</span>
          </div>
          <div>5-Minute Expiration • Single Use • Constant-Time HMAC</div>
        </div>
      </div>

      {/* Right Column: Interactive Form */}
      <div className="md:w-7/12 flex items-center justify-center p-6 sm:p-12 bg-steel-50">
        <div className="w-full max-w-md bg-white p-8 border border-steel-200 shadow-sm rounded-sm">
          {step === "request" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-airtech-blue font-semibold">
                  Step 1 of 2
                </span>
                <h2 className="text-xl font-bold text-navy-950 mt-1">Reset Your Password</h2>
                <p className="text-xs text-steel-500 mt-1">
                  Enter the email address linked to your portal account.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-600 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1.5">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@airtech.in"
                    className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-navy-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-airtech-blue transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Code via Brevo...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center pt-4 border-t border-steel-200">
                <Link
                  href="/portal-access"
                  className="inline-flex items-center gap-1.5 text-xs text-steel-500 hover:text-navy-950 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Portal Access</span>
                </Link>
              </div>
            </motion.div>
          )}

          {step === "verify_and_reset" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-airtech-blue font-semibold">
                  Step 2 of 2
                </span>
                <h2 className="text-xl font-bold text-navy-950 mt-1">Verify Code &amp; Set Password</h2>
                <p className="text-xs text-steel-500 mt-1">
                  We sent a 6-digit security code to <strong>{email}</strong>.
                </p>
              </div>

              {statusMessage && (
                <div className="mb-4 p-3 bg-blue-50 border-l-2 border-airtech-blue text-navy-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-airtech-blue flex-shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border-l-2 border-red-600 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-2">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-mono font-bold border border-steel-300 bg-steel-50 focus:bg-white focus:border-navy-950 focus:outline-none transition rounded-sm"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 bg-steel-50 border border-steel-300 text-xs text-navy-950 focus:outline-none focus:border-navy-950 focus:bg-white transition"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-steel-400">
                    {cooldown > 0 ? `Resend code in 00:${cooldown < 10 ? `0${cooldown}` : cooldown}` : ""}
                  </span>
                  {cooldown <= 0 && (
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      className="text-airtech-blue font-semibold hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-navy-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-airtech-blue transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password &amp; Login</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-navy-950 mb-2">Password Successfully Updated</h2>
              <p className="text-xs text-steel-500 leading-relaxed mb-6">
                Your credentials have been securely refreshed. You can now access your specialized portal with your new password.
              </p>
              <Link
                href="/portal-access"
                className="inline-block w-full py-3 bg-navy-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-airtech-blue transition"
              >
                Go to Portal Login &rarr;
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
