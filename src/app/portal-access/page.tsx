"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Crown, Briefcase, Building2, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PortalAccessPage() {
  const portals = [
    {
      id: "owner",
      title: "Owner Portal",
      description: "Full system access, statutory governance, and company management.",
      href: "/owner/login",
      icon: Crown,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50 border-amber-200",
      buttonColor: "bg-navy-950 hover:bg-navy-900",
      badge: "Super Admin",
    },
    {
      id: "employee",
      title: "Employee Portal",
      description: "Project engineering, assigned tasks, CAD drawings, and timesheet logger.",
      href: "/employee/login",
      icon: Briefcase,
      iconColor: "text-airtech-blue",
      iconBg: "bg-blue-50 border-blue-200",
      buttonColor: "bg-airtech-blue hover:bg-airtech-navy",
      badge: "Engineering Staff",
    },
    {
      id: "client",
      title: "Client Portal",
      description: "Live project deliverables, approved GFC drawings, and GST invoice settlements.",
      href: "/client/login",
      icon: Building2,
      iconColor: "text-navy-900",
      iconBg: "bg-slate-100 border-slate-300",
      buttonColor: "bg-navy-900 hover:bg-navy-800",
      badge: "Client Organizations",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-airtech-offwhite text-airtech-charcoal font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center">
        {/* Back link */}
        <div className="w-full mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-steel-500 hover:text-navy-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>
        </div>

        {/* Header (Matching Panel 8) */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-airtech-blue uppercase tracking-wider mb-2 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Role-Based Authentication Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-950 mb-3">
            Access Your Portal
          </h1>
          <p className="text-xs sm:text-sm text-steel-500 leading-relaxed">
            Choose the appropriate portal to sign in to your AIRTECH account. Each workspace is protected by server-side role verification and Row Level Security.
          </p>
        </div>

        {/* 3 Distinct Portal Cards Grid (Matching Panel 8) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {portals.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-steel-300 rounded-sm p-8 flex flex-col justify-between hover:border-airtech-blue hover:shadow-panel transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-sm border flex items-center justify-center ${p.iconBg}`}>
                      <Icon className={`w-6 h-6 ${p.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-semibold text-steel-500 bg-steel-100 px-2 py-0.5 rounded-sm">
                      {p.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-navy-950 mb-2 group-hover:text-airtech-blue transition-colors">
                    {p.title}
                  </h2>
                  <p className="text-xs text-steel-500 leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                <div>
                  <Link
                    href={p.href}
                    className={`w-full inline-flex items-center justify-center gap-2 text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-sm transition-colors shadow-subtle ${p.buttonColor}`}
                  >
                    <span>{p.title} →</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Registration Footnote */}
        <div className="mt-12 text-center text-xs text-steel-500">
          <span>Need a new account? </span>
          <Link href="/register" className="text-airtech-blue font-semibold hover:underline">
            Register as Employee or Client Organization
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
