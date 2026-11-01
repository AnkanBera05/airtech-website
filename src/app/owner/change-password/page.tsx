"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "bera.ankan005@gmail.com",
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch {
      setErrorMessage("Network error updating password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-steel-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-steel-300 rounded-sm p-8 shadow-panel text-center"
      >
        <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-airtech-blue mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
          Set a New Password
        </h1>
        <p className="text-xs text-steel-500 mt-1 max-w-xs mx-auto">
          For your security, please change your password.
        </p>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Password updated! Redirecting to Admin Dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-airtech-charcoal mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs p-2.5 pr-10 border border-steel-300 rounded-sm font-mono focus:border-navy-900 focus:outline-none"
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
              Confirm New Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono focus:border-navy-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Update Password →</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
