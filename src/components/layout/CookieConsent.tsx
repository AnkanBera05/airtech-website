"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Check, X, SlidersHorizontal } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("airtech_cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "airtech_cookie_consent",
      JSON.stringify({ necessary: true, analytics: true, timestamp: new Date().toISOString() })
    );
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      "airtech_cookie_consent",
      JSON.stringify({ necessary: true, analytics: false, timestamp: new Date().toISOString() })
    );
    setVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem(
      "airtech_cookie_consent",
      JSON.stringify({ necessary: true, analytics: analyticsEnabled, timestamp: new Date().toISOString() })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-navy-950/95 backdrop-blur-md border-t border-navy-800 text-white shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-blueprint-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Engineering Data Security</span>
          </div>
          <p className="text-xs text-steel-300 leading-relaxed">
            AIRTECH uses cookies to ensure secure portal session authentication, measure site traffic, and optimize engineering workflows in compliance with Indian DPDP frameworks. We never monetize or sell personal data.
          </p>
          <div className="text-[11px] text-steel-400">
            Learn more in our{" "}
            <Link href="/privacy" className="text-blueprint-300 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-blueprint-300 hover:underline">
              Terms of Engagement
            </Link>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleRejectNonEssential}
            className="text-xs text-steel-300 hover:text-white px-3.5 py-2 rounded-sm border border-steel-700 hover:border-steel-500 transition-colors"
          >
            Essential Only
          </button>

          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-xs text-steel-300 hover:text-white px-3 py-2 rounded-sm border border-steel-700 hover:border-steel-500 transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <button
            onClick={handleAcceptAll}
            className="text-xs font-semibold bg-blueprint-500 hover:bg-blueprint-600 text-white px-5 py-2 rounded-sm transition-colors shadow-sm"
          >
            Accept All
          </button>
        </div>
      </div>

      {/* Preferences Drawer */}
      {showPreferences && (
        <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-navy-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-navy-900 rounded-sm border border-navy-800 flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-white">Strictly Necessary Cookies</div>
              <div className="text-steel-400 text-[11px] mt-0.5">
                Required for portal security, Clerk sessions, and RLS database transactions.
              </div>
            </div>
            <span className="text-[10px] font-mono bg-navy-800 text-steel-400 px-2 py-0.5 rounded-sm">
              Always Active
            </span>
          </div>

          <div className="p-3 bg-navy-900 rounded-sm border border-navy-800 flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-white">Usage Analytics (PostHog)</div>
              <div className="text-steel-400 text-[11px] mt-0.5">
                Aggregated, anonymized page performance and feature interaction telemetry.
              </div>
            </div>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="mt-1 rounded-sm border-steel-700 text-blueprint-500 focus:ring-0"
            />
          </div>

          <div className="sm:col-span-2 text-right">
            <button
              onClick={handleSaveCustom}
              className="text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-white px-4 py-1.5 rounded-sm border border-navy-700"
            >
              Save Custom Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
