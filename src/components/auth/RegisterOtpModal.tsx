"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, RefreshCw, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RegisterOtpModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
}

export function RegisterOtpModal({
  isOpen,
  email,
  onClose,
  onVerify,
  onResendOtp,
  loading,
  errorMessage,
}: RegisterOtpModalProps) {
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setOtpDigits(["", "", "", "", "", ""]);
      setCooldown(60);
      return;
    }
    inputRefs.current[0]?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (cooldown <= 0 || !isOpen) return;
    const timer = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown, isOpen]);

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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length === 6) {
      await onVerify(fullOtp);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    await onResendOtp();
    setCooldown(60);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white border border-steel-300 shadow-2xl p-6 sm:p-8 rounded-sm relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-steel-400 hover:text-navy-950 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-sky-50 border border-sky-200 text-airtech-blue rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-950">Verify Your Email Address</h3>
            <p className="text-xs text-steel-500 mt-1">
              A 6-digit verification code has been dispatched via Brevo to{" "}
              <strong className="text-navy-900">{email}</strong>.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border-l-2 border-red-600 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-center text-xs font-semibold text-navy-950 uppercase tracking-wider mb-3">
                Enter 6-Digit Code
              </label>
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
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

            <div className="flex items-center justify-between text-xs text-steel-500">
              <span>Valid for 5 minutes</span>
              {cooldown > 0 ? (
                <span>Resend in 00:{cooldown < 10 ? `0${cooldown}` : cooldown}</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-airtech-blue font-semibold hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otpDigits.join("").length < 6}
              className="w-full py-3 bg-navy-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-airtech-blue transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Confirm &amp; Complete Registration &rarr;</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
