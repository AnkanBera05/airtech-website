"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";

interface IntegratedLoginPanelProps {
  onSuccess?: (redirectUrl: string) => void;
  className?: string;
}

export function IntegratedLoginPanel({ onSuccess, className = "" }: IntegratedLoginPanelProps) {
  const router = useRouter();

  // State: 'credentials' -> 'otp' -> 'authenticated'
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Mask email for display: e.g. b***a@gmail.com
  const maskEmailAddress = (rawEmail: string) => {
    const parts = rawEmail.split("@");
    if (parts.length !== 2) return rawEmail;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name[0]}*@${domain}`;
    return `${name[0]}${"*".repeat(Math.min(name.length - 2, 5))}${name[name.length - 1]}@${domain}`;
  };

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both your registered email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Please verify your credentials.");
        setLoading(false);
        return;
      }

      // Credentials verified, now challenge for 6-digit OTP
      setMaskedEmail(maskEmailAddress(email));
      setStep("otp");
      setResendCooldown(60);

      if (data.emailConfigured === false) {
        setStatusMessage(
          "Notice: Transactional email service is not yet configured with an API key in .env.local. (Security protocol: no fake OTP is simulated)."
        );
      } else {
        setStatusMessage(`A 6-digit verification code has been dispatched to ${maskEmailAddress(email)}.`);
      }
    } catch {
      setErrorMessage("Unable to connect to security authentication service.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!/^\d{6}$/.test(otp.trim())) {
      setErrorMessage("Please enter the complete 6-digit numerical OTP code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Invalid or expired OTP code.");
        setLoading(false);
        return;
      }

      setStatusMessage("Authentication verified. Redirecting to authorized portal...");

      // Redirect according to server-verified role
      const destination = data.redirectUrl || "/client";
      if (onSuccess) {
        onSuccess(destination);
      } else {
        router.push(destination);
      }
    } catch {
      setErrorMessage("Network error during verification.");
      setLoading(false);
    }
  };

  // Resend OTP Challenge
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendCooldown(60);
        setStatusMessage(`A fresh security code has been dispatched.`);
      } else {
        setErrorMessage(data.error || "Failed to resend code.");
      }
    } catch {
      setErrorMessage("Failed to resend verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white border border-steel-300 rounded-sm p-6 shadow-panel ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-steel-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-airtech-navy flex items-center justify-center text-white rounded-sm text-xs font-bold font-mono">
            SEC
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-airtech-navy">
              AIRTECH Portals Login
            </div>
            <div className="text-[10px] text-airtech-muted uppercase tracking-wider">
              2-Factor Email OTP Verified
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-steel-500 bg-steel-100 px-2 py-0.5 rounded-sm">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>RLS Active</span>
        </span>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Status Notice */}
      {statusMessage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-airtech-blue text-xs rounded-sm flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-airtech-blue" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* STEP 1: Email & Password Form */}
      {step === "credentials" ? (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1.5">
              Registered Work / Client Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="consultant@airtech-mep.com"
                className="w-full text-xs py-2.5 pl-9 pr-3 border border-steel-300 rounded-sm focus:outline-none focus:border-airtech-navy transition-colors font-mono"
              />
              <Mail className="w-4 h-4 text-steel-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider">
                Account Password
              </label>
              <a href="#reset" className="text-[11px] text-airtech-blue hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs py-2.5 pl-9 pr-3 border border-steel-300 rounded-sm focus:outline-none focus:border-airtech-navy transition-colors font-mono"
              />
              <KeyRound className="w-4 h-4 text-steel-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-airtech-navy hover:bg-airtech-dark text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* STEP 2: 6-Digit Email OTP Challenge Form */
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div className="bg-steel-50 border border-steel-200 p-3 rounded-sm text-xs text-airtech-charcoal">
            <div className="font-semibold text-airtech-navy mb-1">Two-Factor Authentication</div>
            <p className="text-airtech-muted leading-relaxed">
              Enter the 6-digit numerical security code sent to <strong>{maskedEmail}</strong>. Valid for 5 minutes.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-airtech-charcoal uppercase tracking-wider mb-1.5">
              6-Digit Security OTP
            </label>
            <input
              type="text"
              maxLength={6}
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-2.5 border-2 border-airtech-blue rounded-sm focus:outline-none text-airtech-navy"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Enter Portal</span>
              </>
            )}
          </button>

          <div className="flex justify-between items-center text-xs text-steel-500 pt-2 border-t border-steel-100">
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setOtp("");
                setErrorMessage(null);
              }}
              className="hover:text-airtech-navy underline"
            >
              Back to Email
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={handleResendOtp}
              className="text-airtech-blue hover:underline disabled:text-steel-400"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {/* Footer Role Notice */}
      <div className="mt-5 pt-3 border-t border-steel-100 text-[11px] text-steel-400 flex items-center justify-between">
        <span>Owner • Admin • PM • Finance • Staff • Client</span>
        <span className="font-mono text-[10px]">Strict RBAC</span>
      </div>
    </div>
  );
}
