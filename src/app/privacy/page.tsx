import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-airtech-charcoal font-sans">
      <Navbar />

      <section className="bg-navy-950 text-white py-16 border-b border-navy-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-xs font-mono text-blueprint-400 mb-2">Governance & Data Protection</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-xs sm:text-sm text-steel-400 font-mono">
            Compliant with Digital Personal Data Protection Act (DPDPA 2023) • Effective November 2026
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8 text-xs sm:text-sm text-steel-700 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-navy-950 mb-2">1. Fiduciary Commitment to Data Privacy</h2>
          <p>
            AIRTECH (&quot;we&quot;, &quot;our&quot;, or &quot;the Consultancy&quot;) is committed to maintaining strict confidentiality of corporate client schematics, architectural drawings, proprietary facility parameters, employee records, and applicant credentials. We never monetize, rent, or sell any personal or engineering data.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-navy-950 mb-2">2. Categories of Information Processed</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-steel-600">
            <li><strong>Identity & Authentication:</strong> Corporate email, full name, encrypted session tokens managed via Clerk.</li>
            <li><strong>Engineering Deliverables:</strong> GFC drawings, BIM models, technical RFIs, and submittal reviews.</li>
            <li><strong>Commercial & Invoicing:</strong> GSTIN, transaction references (UTR), and Stripe tokenized payment confirmations.</li>
            <li><strong>Career Applications:</strong> Résumé files, curriculum vitae, and academic credentials stored in private encrypted storage.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-navy-950 mb-2">3. Storage Security & Access Control</h2>
          <p>
            All application data is protected by PostgreSQL Row Level Security (RLS) in Supabase. Public assets (website photography) and confidential documents (construction drawings, applicant resumes) are stored in isolated, permission-gated buckets. Private files are only accessible via time-limited, signed URLs issued to authorized personnel.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-navy-950 mb-2">4. Grievance Officer & Contact</h2>
          <p>
            For privacy inquiries, audit requests, or data deletion requests, contact our Compliance Desk at <a href="mailto:privacy@airtech.in" className="text-airtech-blue underline">privacy@airtech.in</a> or at registered office: Rajarhat Gopalpur, Kolkata - 700136, West Bengal, India.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
