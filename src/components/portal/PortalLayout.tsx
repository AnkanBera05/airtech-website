"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Building2, 
  FolderKanban, 
  Users, 
  FileCheck2, 
  Receipt, 
  CreditCard, 
  Clock, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  Layers, 
  FileText, 
  HelpCircle,
  Briefcase
} from "lucide-react";

interface PortalLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  userEmail?: string;
  portalTitle: string;
}

export function PortalLayout({
  children,
  userRole = "admin",
  userEmail = "consultant@airtech-mep.com",
  portalTitle,
}: PortalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "airtech_session_role=; Max-Age=0; path=/;";
    document.cookie = "airtech_session_user=; Max-Age=0; path=/;";
    router.push("/login");
  };

  // Define role-specific navigation links
  const getNavLinks = () => {
    switch (userRole) {
      case "owner":
      case "admin":
        return [
          { href: "/admin", label: "Executive Overview", icon: Building2 },
          { href: "/admin#projects", label: "Projects & Engineering", icon: FolderKanban },
          { href: "/admin#drawings", label: "Drawing Register (CAD)", icon: Layers },
          { href: "/admin#submittals", label: "RFIs & Submittals", icon: FileCheck2 },
          { href: "/admin#invoices", label: "Finance & Invoicing (GST)", icon: Receipt },
          { href: "/admin#payments", label: "Stripe & Bank Payments", icon: CreditCard },
          { href: "/admin#employees", label: "Staff & Timesheets", icon: Users },
          { href: "/admin#audit", label: "Security & Audit Logs", icon: ShieldCheck },
          { href: "/admin#settings", label: "Company Settings", icon: Settings },
        ];
      case "employee":
        return [
          { href: "/employee", label: "My Engineering Desk", icon: Briefcase },
          { href: "/employee#tasks", label: "Assigned Tasks & Subtasks", icon: FolderKanban },
          { href: "/employee#drawings", label: "Drawing Uploads & CAD", icon: Layers },
          { href: "/employee#timesheets", label: "Weekly Timesheets", icon: Clock },
          { href: "/employee#leave", label: "Leave Requests", icon: Users },
        ];
      case "client":
      default:
        return [
          { href: "/client", label: "Project Summary", icon: Building2 },
          { href: "/client#deliverables", label: "Approved Drawings & Specs", icon: Layers },
          { href: "/client#submittals", label: "Technical Submittals", icon: FileCheck2 },
          { href: "/client#invoices", label: "Invoices & Payments (Stripe)", icon: Receipt },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex flex-col bg-airtech-offwhite text-airtech-charcoal font-sans">
      {/* Top Portal Command Bar */}
      <header className="sticky top-0 z-40 bg-airtech-navy text-white h-14 border-b border-navy-900 px-6 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-steel-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 bg-airtech-blue flex items-center justify-center font-bold text-xs rounded-sm font-mono">
              AT
            </span>
            <span className="font-bold tracking-tight text-sm">AIRTECH</span>
            <span className="text-steel-400 text-xs hidden sm:inline">| {portalTitle}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-navy-900 border border-navy-800 px-3 py-1 rounded-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-steel-300 font-mono text-[11px]">{userEmail}</span>
            <span className="text-steel-500">|</span>
            <span className="text-blueprint-400 font-mono uppercase text-[10px] font-semibold tracking-wider">
              {userRole}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 text-steel-200 hover:text-white px-3 py-1.5 rounded-sm transition-colors text-xs border border-navy-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Portal Body */}
      <div className="flex-1 flex">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-steel-300 p-4 shrink-0">
          <div className="text-[10px] font-mono font-semibold text-airtech-muted uppercase tracking-wider px-3 mb-3">
            Navigation Menu
          </div>
          <nav className="space-y-1 flex-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-sm transition-colors ${
                    isActive
                      ? "bg-airtech-pale text-airtech-navy font-semibold border-l-2 border-airtech-blue"
                      : "text-steel-700 hover:bg-steel-100 hover:text-airtech-navy"
                  }`}
                >
                  <Icon className="w-4 h-4 text-airtech-blue shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Compliance Badge */}
          <div className="pt-4 border-t border-steel-200 text-[10px] font-mono text-steel-500 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RLS Tenant Isolated</span>
            </div>
            <div>Database: PostgreSQL (Supabase)</div>
            <div>Payments: Stripe India / Bank UTR</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
