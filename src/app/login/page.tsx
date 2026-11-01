import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IntegratedLoginPanel } from "@/components/auth/IntegratedLoginPanel";
import { ShieldCheck, Compass, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-airtech-offwhite text-airtech-charcoal">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full">
          {/* Back link */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-airtech-muted hover:text-airtech-navy transition-colors font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to AIRTECH Homepage</span>
            </Link>
          </div>

          {/* Integrated Email + Password + 6-Digit OTP Login Panel */}
          <IntegratedLoginPanel />

          {/* Portal Information */}
          <div className="mt-8 text-center text-xs text-airtech-muted space-y-1">
            <div>AIRTECH MEP Engineering Consultancy • Kolkata HQ</div>
            <div className="text-[11px] text-steel-400">
              Authorized session tokens protected by PostgreSQL Row Level Security (RLS)
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
