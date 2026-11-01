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
  Briefcase,
  LayoutDashboard,
  Calendar,
  UserCheck,
  BarChart3,
  HelpCircle as QuestionIcon,
  MessageSquare,
  FileSpreadsheet
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
    document.cookie = "airtech_session_role=; Max-Age=0; path=/;";
    document.cookie = "airtech_session_user=; Max-Age=0; path=/;";
    router.push("/portal-access");
  };

  // Exact navigation lists matching Panels 15, 16, 17 of the reference storyboard
  const getNavLinks = () => {
    switch (userRole) {
      case "owner":
      case "admin":
        // Panel 15: Dashboard, Projects, Clients, Employees, Approvals, Documents, Finance, Reports, Settings
        return [
          { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
          { href: "/admin#projects", label: "Projects", icon: FolderKanban },
          { href: "/admin#clients", label: "Clients", icon: Building2 },
          { href: "/admin#employees", label: "Employees", icon: Users },
          { href: "/admin#approvals", label: "Approvals", icon: FileCheck2 },
          { href: "/admin#documents", label: "Documents", icon: FileText },
          { href: "/admin#finance", label: "Finance", icon: Receipt },
          { href: "/admin#reports", label: "Reports", icon: BarChart3 },
          { href: "/admin#settings", label: "Settings", icon: Settings },
        ];
      case "employee":
        // Panel 16: Dashboard, My Projects, Tasks, Timesheet, Leave, Documents, Calendar, Notifications, Profile
        return [
          { href: "/employee", label: "Dashboard", icon: LayoutDashboard },
          { href: "/employee#projects", label: "My Projects", icon: FolderKanban },
          { href: "/employee#tasks", label: "Tasks", icon: Briefcase },
          { href: "/employee#timesheet", label: "Timesheet", icon: Clock },
          { href: "/employee#leave", label: "Leave", icon: UserCheck },
          { href: "/employee#documents", label: "Documents", icon: FileText },
          { href: "/employee#calendar", label: "Calendar", icon: Calendar },
          { href: "/employee#notifications", label: "Notifications", icon: Bell },
          { href: "/employee#profile", label: "Profile", icon: Users },
        ];
      case "client":
      default:
        // Panel 17: Dashboard, My Projects, Drawings, RFIs, Submittals, Approvals, Invoices, Payments, Documents, Profile
        return [
          { href: "/client", label: "Dashboard", icon: LayoutDashboard },
          { href: "/client#projects", label: "My Projects", icon: FolderKanban },
          { href: "/client#drawings", label: "Drawings", icon: Layers },
          { href: "/client#rfis", label: "RFIs", icon: MessageSquare },
          { href: "/client#submittals", label: "Submittals", icon: FileSpreadsheet },
          { href: "/client#approvals", label: "Approvals", icon: FileCheck2 },
          { href: "/client#invoices", label: "Invoices", icon: Receipt },
          { href: "/client#payments", label: "Payments", icon: CreditCard },
          { href: "/client#documents", label: "Documents", icon: FileText },
          { href: "/client#profile", label: "Profile", icon: Users },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-airtech-charcoal font-sans">
      {/* Top Portal Command Bar */}
      <header className="sticky top-0 z-40 bg-navy-950 text-white h-14 border-b border-navy-900 px-6 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-steel-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-blueprint-400 font-bold text-base">▲</span>
            <span className="font-bold tracking-tight text-sm">AIRTECH</span>
            <span className="text-steel-400 text-xs hidden sm:inline">| {portalTitle}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button className="text-steel-400 hover:text-white relative p-1">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 bg-airtech-blue rounded-full absolute top-1 right-1" />
          </button>

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
        {/* Left Sidebar (Desktop, Deep Dark Navy matching Panels 15, 16, 17) */}
        <aside className="hidden md:flex flex-col w-56 bg-navy-950 border-r border-navy-900 p-4 shrink-0 text-white">
          <div className="flex items-center gap-2 px-3 py-2 mb-4 border-b border-navy-900 pb-3">
            <span className="text-blueprint-400 font-bold text-lg">▲</span>
            <span className="font-bold tracking-tight text-sm text-white">AIRTECH</span>
          </div>

          <nav className="space-y-1 flex-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-sm transition-colors ${
                    isActive
                      ? "bg-blueprint-600/30 text-blueprint-300 font-bold border-l-2 border-blueprint-400"
                      : "text-steel-400 hover:bg-navy-900 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-blueprint-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Security Info */}
          <div className="pt-4 border-t border-navy-900 text-[10px] font-mono text-steel-500 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RLS Isolation Active</span>
            </div>
            <div>PostgreSQL Session Guard</div>
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
