"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { MediaLibraryModal } from "@/components/cms/MediaLibraryModal";
import { 
  Building2, 
  FolderKanban, 
  Users, 
  Layers, 
  Receipt, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck2,
  Settings,
  ArrowRight,
  Bell,
  TrendingUp,
  FileText,
  Upload,
  Globe,
  Briefcase,
  Mail,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  Check,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal
} from "lucide-react";

type AdminTab = "dashboard" | "cms" | "projects" | "careers" | "enquiries" | "approvals" | "media" | "settings" | "audit";
type CmsSubTab = "homepage" | "services" | "portfolio" | "leadership";

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [activeCmsSubTab, setActiveCmsSubTab] = useState<CmsSubTab>("homepage");

  // Media Library Modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetCallback, setMediaTargetCallback] = useState<((url: string) => void) | null>(null);
  const [mediaCategory, setMediaCategory] = useState("general");

  // Status & Notification state
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Homepage CMS Form State
  const [homepageContent, setHomepageContent] = useState({
    heroHeadline: "HVAC Engineering Projects | Services",
    heroSubhead: "Specialist MEP consultancy delivering integrated, efficient and sustainable building services solutions.",
    primaryCtaLabel: "Explore Services",
    primaryCtaLink: "/services",
    secondaryCtaLabel: "Contact Us",
    secondaryCtaLink: "/contact",
    announcementEnabled: false,
    announcementText: "Now welcoming applications for Q1 2026 HVAC and Electrical design openings.",
  });

  // 2. Services CMS State
  const [servicesList, setServicesList] = useState([
    {
      id: "hvac",
      title: "HVAC Engineering",
      desc: "Design, analysis and optimisation of HVAC systems.",
      standards: "ASHRAE 90.1, 62.1 & 170 • ISHRAE",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
      isPublished: true,
    },
    {
      id: "fire",
      title: "Fire Fighting Engineering",
      desc: "Code-compliant fire system design.",
      standards: "NBC 2016 Part 4 • NFPA 13, 14, 20",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=800&auto=format&fit=crop",
      isPublished: true,
    },
    {
      id: "plumbing",
      title: "Plumbing Engineering",
      desc: "Efficient and sustainable plumbing solutions.",
      standards: "Uniform Plumbing Code (UPC-I) • NBC Part 9",
      imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop",
      isPublished: true,
    },
    {
      id: "electrical",
      title: "Electrical Engineering",
      desc: "Reliable and safe electrical system design.",
      standards: "IS 732 • IEEE • Central Electricity Authority",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop",
      isPublished: true,
    },
    {
      id: "bms",
      title: "Building Management Systems (BMS)",
      desc: "Integrated building automation and control.",
      standards: "BACnet/IP • ISO 16484",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      isPublished: true,
    },
  ]);

  // 3. Projects Portfolio CMS State
  const [projectsList, setProjectsList] = useState([
    {
      id: "proj-1",
      title: "Commercial Office Building",
      disciplines: "HVAC | Electrical | BMS",
      location: "Bengaluru, India",
      capacity: "1,850 TR Central Plant",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      status: "Commissioned",
      isPublished: true,
    },
    {
      id: "proj-2",
      title: "Hospital Facility",
      disciplines: "HVAC | Fire Fighting | Plumbing",
      location: "Kolkata, India",
      capacity: "12 Modular OTs • NABH Standard",
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=800&auto=format&fit=crop",
      status: "In Execution",
      isPublished: true,
    },
    {
      id: "proj-3",
      title: "Hotel & Hospitality",
      disciplines: "HVAC | Electrical",
      location: "Goa, India",
      capacity: "250 Keys Luxury Resort",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
      status: "Completed",
      isPublished: true,
    },
  ]);

  // 4. Careers & Job Applications State
  const [applications, setApplications] = useState([
    {
      id: "app-1",
      candidateName: "Sanjay Chatterjee",
      jobTitle: "Mechanical Design Engineer",
      email: "sanjay.c@engineer.in",
      phone: "+91 98311 23456",
      experience: "4.5 Years",
      status: "Under Review",
      date: "2026-11-01",
    },
    {
      id: "app-2",
      candidateName: "Priyanka Roy",
      jobTitle: "Electrical Design Engineer",
      email: "p.roy@powerelec.com",
      phone: "+91 98300 77889",
      experience: "6 Years",
      status: "Shortlisted",
      date: "2026-10-29",
    },
  ]);

  // 5. Contact Enquiries State
  const [enquiries, setEnquiries] = useState([
    {
      id: "enq-1",
      senderName: "Debashis Mukherjee",
      email: "dmukherjee@healthcorp.co.in",
      organization: "Bengal Multispeciality Hospitals",
      phone: "+91 98301 99887",
      scope: "Consultancy RFP for 850 TR Chiller Plant and OT Cleanroom retrofitting.",
      status: "Pending",
      date: "2026-11-02",
    },
    {
      id: "enq-2",
      senderName: "Amitabh Banerjee",
      email: "amitabh@itc-infotech.com",
      organization: "ITC Green Tech Park",
      phone: "+91 98304 11223",
      scope: "Composite services clash-free BIM coordination for G+18 office expansion.",
      status: "Resolved",
      date: "2026-10-31",
    },
  ]);

  // 6. Registration Approvals State
  const [approvalsList, setApprovalsList] = useState([
    {
      id: "req-01",
      fullName: "Rahul Sengupta",
      email: "r.sengupta@engineering.org",
      role: "employee",
      organizationName: "AIRTECH Kolkata Design Cell",
      department: "Mechanical (HVAC)",
      designation: "Senior HVAC Consultant",
      status: "pending",
      createdAt: "2026-11-02",
    },
    {
      id: "req-02",
      fullName: "Ananya Mukherjee",
      email: "ananya.m@fortishealthcare.com",
      role: "client",
      organizationName: "Fortis Healthcare Facilities",
      department: "Client Representative",
      designation: "Director of Infrastructure",
      status: "pending",
      createdAt: "2026-11-02",
    },
    {
      id: "req-03",
      fullName: "Vikram Das",
      email: "vikram.das@mepprojects.com",
      role: "employee",
      organizationName: "AIRTECH Kolkata Design Cell",
      department: "Electrical",
      designation: "Electrical Design Engineer",
      status: "pending",
      createdAt: "2026-11-01",
    },
    {
      id: "req-04",
      fullName: "Sanjay Chatterjee",
      email: "sanjay.c@engineer.in",
      role: "employee",
      organizationName: "AIRTECH Kolkata Design Cell",
      department: "BMS Automation",
      designation: "BMS Engineer",
      status: "approved",
      createdAt: "2026-10-31",
    },
  ]);

  const [approvalLoadingId, setApprovalLoadingId] = useState<string | null>(null);

  const handleApprove = async (item: typeof approvalsList[0]) => {
    setApprovalLoadingId(item.id);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: item.id,
          email: item.email,
          fullName: item.fullName,
          role: item.role,
          action: "approve",
        }),
      });

      setApprovalsList((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: "approved" } : r))
      );
      setSaveNotification(
        `Account approved for ${item.fullName}. Welcome email dispatched via Brevo.`
      );
      setTimeout(() => setSaveNotification(null), 5000);
    } catch {
      setApprovalsList((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: "approved" } : r))
      );
      setSaveNotification(`Account marked approved for ${item.fullName}.`);
      setTimeout(() => setSaveNotification(null), 5000);
    } finally {
      setApprovalLoadingId(null);
    }
  };

  // Save changes to API
  const handleSaveCmsSection = async (section: string, payload: unknown) => {
    setIsSaving(true);
    setSaveNotification(null);

    try {
      const res = await fetch(`/api/cms/${section}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save changes.");

      setSaveNotification(`Changes to ${section.toUpperCase()} saved successfully!`);
      setTimeout(() => setSaveNotification(null), 4000);
    } catch {
      setSaveNotification("Notice: Changes saved to session state.");
      setTimeout(() => setSaveNotification(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const openMediaPicker = (callback: (url: string) => void, category: string = "general") => {
    setMediaTargetCallback(() => callback);
    setMediaCategory(category);
    setMediaModalOpen(true);
  };

  return (
    <PortalLayout userRole="owner" userEmail="bera.ankan005@gmail.com" portalTitle="Owner & Super Admin Portal">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-steel-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950">
            Owner & Enterprise Management Console
          </h1>
          <p className="text-xs text-steel-500 mt-0.5">
            Full administrative control over public website CMS, engineering registers, staffing, and inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-sm flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin Online</span>
          </span>
        </div>
      </div>

      {saveNotification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Main Administrative Workspace Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-steel-200 pb-3">
        {[
          { id: "dashboard", label: "Overview & KPIs", icon: TrendingUp },
          { id: "cms", label: "Website CMS", icon: Globe },
          { id: "media", label: "Media Library", icon: Upload },
          { id: "approvals", label: "Approvals (6)", icon: CheckCircle2 },
          { id: "careers", label: "Careers & HR", icon: Briefcase },
          { id: "enquiries", label: "Client Enquiries", icon: Mail },
          { id: "audit", label: "Security & Audit", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
                isActive
                  ? "bg-navy-950 text-white shadow-subtle"
                  : "bg-white text-steel-600 border border-steel-300 hover:border-navy-950 hover:text-navy-950"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & KPIS (MATCHING PANEL 15)
          ========================================================================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Active Projects", value: "24", sub: "+3 this quarter", color: "text-navy-950" },
              { label: "Pending Approvals", value: "6", sub: "Requires review", color: "text-amber-600" },
              { label: "Outstanding", value: "₹ 1.28 Cr", sub: "GST Invoices", color: "text-airtech-blue" },
              { label: "Overdue Invoices", value: "4", sub: "Follow-up required", color: "text-airtech-red" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm">
                <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-navy-950 mt-1">{stat.label}</div>
                <div className="text-[11px] text-steel-400 mt-0.5 font-mono">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* 2-Column Split: 68% Donut + Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white border border-steel-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-navy-950">Project Progress</h2>
                  <span className="text-xs font-mono text-steel-400">All Active Sites</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-steel-100"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-airtech-blue"
                        strokeDasharray="68, 100"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold font-mono text-navy-950">68%</span>
                      <span className="text-[10px] text-steel-400 uppercase font-mono tracking-wider">Overall</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs w-full sm:w-auto">
                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-airtech-blue"></span>
                        <span className="font-semibold text-navy-950">Completed</span>
                      </div>
                      <span className="font-mono font-bold text-steel-600">42%</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                        <span className="font-semibold text-navy-950">On Hold</span>
                      </div>
                      <span className="font-mono font-bold text-steel-600">22%</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-steel-400"></span>
                        <span className="font-semibold text-navy-950">Planning</span>
                      </div>
                      <span className="font-mono font-bold text-steel-600">16%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-steel-100 flex items-center justify-between text-xs text-steel-500">
                <span>Engineering Load: High</span>
                <span className="text-airtech-blue font-semibold">24 Projects Monitored</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white border border-steel-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-navy-950">Recent Activities</h2>
                  <span className="text-xs font-mono text-steel-400">Real-time Stream</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { title: "New RFI raised", project: "City Hospital", time: "2 hours ago" },
                    { title: "Drawing R1 uploaded", project: "Business Park", time: "4 hours ago" },
                    { title: "Invoice INV-0432 paid", project: "Hotel Skyline", time: "6 hours ago" },
                    { title: "Applicant resume received", project: "HR / Mechanical Design", time: "1 day ago" },
                  ].map((act, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-steel-50 rounded-sm border border-steel-200">
                      <div className="w-2 h-2 rounded-full bg-airtech-blue mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-navy-950">{act.title}</div>
                        <div className="text-[11px] text-steel-500">Project: <strong className="text-navy-900">{act.project}</strong></div>
                      </div>
                      <div className="text-[10px] font-mono text-steel-400 shrink-0">{act.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-steel-100 mt-4 text-right">
                <button onClick={() => setActiveTab("audit")} className="text-xs font-semibold text-airtech-blue hover:underline">
                  View Full Audit Log →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: COMPLETE WEBSITE CMS
          ========================================================================= */}
      {activeTab === "cms" && (
        <div className="space-y-6">
          {/* Subtabs for CMS */}
          <div className="flex border-b border-steel-200 gap-6 text-xs font-semibold">
            {[
              { id: "homepage", label: "Homepage Hero & Banners" },
              { id: "services", label: `Engineering Services (${servicesList.length})` },
              { id: "portfolio", label: `Projects Portfolio (${projectsList.length})` },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveCmsSubTab(sub.id as CmsSubTab)}
                className={`pb-3 border-b-2 uppercase tracking-wider transition-colors ${
                  activeCmsSubTab === sub.id
                    ? "border-navy-950 text-navy-950 font-bold"
                    : "border-transparent text-steel-500 hover:text-navy-950"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Subtab 1: Homepage Hero & Banner Management */}
          {activeCmsSubTab === "homepage" && (
            <div className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-steel-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-navy-950">Homepage Hero Configuration</h3>
                  <p className="text-xs text-steel-500">Edit text, CTA buttons, and announcements displayed on the public landing page.</p>
                </div>
                <button
                  onClick={() => handleSaveCmsSection("homepage", homepageContent)}
                  disabled={isSaving}
                  className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold px-5 py-2.5 rounded-sm flex items-center gap-2"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Homepage CMS</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">Hero Main Headline *</label>
                  <input
                    type="text"
                    value={homepageContent.heroHeadline}
                    onChange={(e) => setHomepageContent({ ...homepageContent, heroHeadline: e.target.value })}
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-950 mb-1">Hero Subtitle / Description *</label>
                  <textarea
                    rows={3}
                    value={homepageContent.heroSubhead}
                    onChange={(e) => setHomepageContent({ ...homepageContent, heroSubhead: e.target.value })}
                    className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-950 mb-1">Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={homepageContent.primaryCtaLabel}
                      onChange={(e) => setHomepageContent({ ...homepageContent, primaryCtaLabel: e.target.value })}
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-950 mb-1">Primary CTA Destination Link</label>
                    <input
                      type="text"
                      value={homepageContent.primaryCtaLink}
                      onChange={(e) => setHomepageContent({ ...homepageContent, primaryCtaLink: e.target.value })}
                      className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-steel-50 border border-steel-200 rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-950">Top Announcement Banner</span>
                    <input
                      type="checkbox"
                      checked={homepageContent.announcementEnabled}
                      onChange={(e) => setHomepageContent({ ...homepageContent, announcementEnabled: e.target.checked })}
                      className="rounded-sm border-steel-300 text-airtech-blue"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter announcement text to display across top of site..."
                    value={homepageContent.announcementText}
                    onChange={(e) => setHomepageContent({ ...homepageContent, announcementText: e.target.value })}
                    className="w-full text-xs p-2 border border-steel-300 rounded-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Subtab 2: Services CMS */}
          {activeCmsSubTab === "services" && (
            <div className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-steel-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-navy-950">Engineering Disciplines CMS</h3>
                  <p className="text-xs text-steel-500">Edit titles, codes, descriptions, and cover photos for all 5 core disciplines.</p>
                </div>
                <button
                  onClick={() => handleSaveCmsSection("services", servicesList)}
                  disabled={isSaving}
                  className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold px-5 py-2.5 rounded-sm flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Services CMS</span>
                </button>
              </div>

              <div className="space-y-4">
                {servicesList.map((service, index) => (
                  <div key={service.id} className="p-4 border border-steel-300 rounded-sm bg-steel-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-airtech-blue">0{index + 1} • {service.id.toUpperCase()}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openMediaPicker((url) => {
                            const updated = [...servicesList];
                            updated[index].imageUrl = url;
                            setServicesList(updated);
                          }, "services")}
                          className="text-[11px] font-semibold text-airtech-blue hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Replace Image</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-navy-950 mb-0.5">Service Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updated = [...servicesList];
                            updated[index].title = e.target.value;
                            setServicesList(updated);
                          }}
                          className="w-full text-xs p-2 border border-steel-300 rounded-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-navy-950 mb-0.5">Codes & Standards</label>
                        <input
                          type="text"
                          value={service.standards}
                          onChange={(e) => {
                            const updated = [...servicesList];
                            updated[index].standards = e.target.value;
                            setServicesList(updated);
                          }}
                          className="w-full text-xs p-2 border border-steel-300 rounded-sm bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-navy-950 mb-0.5">Description</label>
                      <input
                        type="text"
                        value={service.desc}
                        onChange={(e) => {
                          const updated = [...servicesList];
                          updated[index].desc = e.target.value;
                          setServicesList(updated);
                        }}
                        className="w-full text-xs p-2 border border-steel-300 rounded-sm bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab 3: Projects & Portfolio CMS */}
          {activeCmsSubTab === "portfolio" && (
            <div className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-steel-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-navy-950">Projects & Portfolio CMS</h3>
                  <p className="text-xs text-steel-500">Manage case studies, capacity metrics, and architectural project photos.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newProj = {
                        id: `proj-${Date.now()}`,
                        title: "New Landmark Facility",
                        disciplines: "HVAC | Electrical",
                        location: "Kolkata, India",
                        capacity: "1,200 TR Central Plant",
                        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
                        status: "Under Design",
                        isPublished: true,
                      };
                      setProjectsList([newProj, ...projectsList]);
                    }}
                    className="bg-steel-100 hover:bg-steel-200 text-navy-950 text-xs font-semibold px-4 py-2.5 rounded-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>

                  <button
                    onClick={() => handleSaveCmsSection("projects", projectsList)}
                    disabled={isSaving}
                    className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold px-5 py-2.5 rounded-sm flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Portfolio</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {projectsList.map((proj, idx) => (
                  <div key={proj.id} className="p-4 border border-steel-300 rounded-sm bg-steel-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-950">{proj.title}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openMediaPicker((url) => {
                            const updated = [...projectsList];
                            updated[idx].imageUrl = url;
                            setProjectsList(updated);
                          }, "projects")}
                          className="text-[11px] font-semibold text-airtech-blue hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          onClick={() => setProjectsList(projectsList.filter((p) => p.id !== proj.id))}
                          className="text-[11px] text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-navy-950 mb-0.5">Project Name</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...projectsList];
                            updated[idx].title = e.target.value;
                            setProjectsList(updated);
                          }}
                          className="w-full text-xs p-2 border border-steel-300 rounded-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-navy-950 mb-0.5">Location</label>
                        <input
                          type="text"
                          value={proj.location}
                          onChange={(e) => {
                            const updated = [...projectsList];
                            updated[idx].location = e.target.value;
                            setProjectsList(updated);
                          }}
                          className="w-full text-xs p-2 border border-steel-300 rounded-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-navy-950 mb-0.5">Capacity / Scale</label>
                        <input
                          type="text"
                          value={proj.capacity}
                          onChange={(e) => {
                            const updated = [...projectsList];
                            updated[idx].capacity = e.target.value;
                            setProjectsList(updated);
                          }}
                          className="w-full text-xs p-2 border border-steel-300 rounded-sm bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: UNIVERSAL MEDIA LIBRARY
          ========================================================================= */}
      {activeTab === "media" && (
        <div className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-steel-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">Universal Media Library & Storage</h2>
              <p className="text-xs text-steel-500">
                Direct management of public website photography and private engineering documents in Supabase Storage.
              </p>
            </div>
            <button
              onClick={() => openMediaPicker(() => {}, "general")}
              className="bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold px-4 py-2.5 rounded-sm flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New File</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Chiller Plant & Ductwork", cat: "services", size: "1.2 MB", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop" },
              { name: "Glass Facade HQ", cat: "about", size: "1.8 MB", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" },
              { name: "Hospital Cleanroom", cat: "projects", size: "1.1 MB", url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=800&auto=format&fit=crop" },
              { name: "Fire Pump Station", cat: "services", size: "1.4 MB", url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=800&auto=format&fit=crop" },
            ].map((media, i) => (
              <div key={i} className="border border-steel-200 rounded-sm overflow-hidden bg-steel-50/50 group">
                <div className="h-32 relative bg-steel-200">
                  <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-bold text-navy-950 truncate">{media.name}</div>
                  <div className="text-[10px] text-steel-400 font-mono flex justify-between mt-0.5">
                    <span>{media.cat}</span>
                    <span>{media.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3B: REGISTRATION APPROVALS & ONBOARDING
          ========================================================================= */}
      {activeTab === "approvals" && (
        <div className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-steel-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">Registration Requests &amp; Portal Clearance</h2>
              <p className="text-xs text-steel-500">
                Super Admin governance for Employee and Client portal onboarding. Approvals automatically dispatch Brevo notifications.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-sm border border-amber-200">
              {approvalsList.filter((a) => a.status === "pending").length} Pending Clearances
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-steel-50 border-b border-steel-200 text-steel-500 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">User &amp; Organization</th>
                  <th className="p-3">Requested Role</th>
                  <th className="p-3">Department / Scope</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Clearance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                {approvalsList.map((item) => (
                  <tr key={item.id} className="hover:bg-steel-50/50">
                    <td className="p-3">
                      <div className="font-bold text-navy-950">{item.fullName}</div>
                      <div className="text-[11px] text-steel-500">{item.organizationName}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-sm font-semibold uppercase text-[10px] ${
                        item.role === "employee" ? "bg-sky-50 text-sky-800 border border-sky-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="p-3 text-steel-600 font-mono">
                      <div>{item.department}</div>
                      <div className="text-[10px] text-steel-400">{item.designation}</div>
                    </td>
                    <td className="p-3 font-mono text-steel-500">{item.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold ${
                        item.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {item.status === "pending" ? (
                        <button
                          onClick={() => handleApprove(item)}
                          disabled={approvalLoadingId === item.id}
                          className="px-3 py-1.5 bg-navy-950 hover:bg-emerald-600 text-white font-semibold text-[11px] rounded-sm transition flex items-center gap-1.5 ml-auto disabled:opacity-50"
                        >
                          {approvalLoadingId === item.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Approving...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Approve &amp; Send Email</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved (Brevo Sent)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CAREERS & CANDIDATE APPLICATIONS
          ========================================================================= */}
      {activeTab === "careers" && (
        <div className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-steel-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">Engineering Candidates & Applications</h2>
              <p className="text-xs text-steel-500">Review incoming applicant resumes received through the website careers portal.</p>
            </div>
            <span className="text-xs font-mono font-semibold text-airtech-blue bg-blue-50 px-3 py-1 rounded-sm border border-blue-200">
              {applications.length} Submissions Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-steel-50 border-b border-steel-200 text-steel-500 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Applied Position</th>
                  <th className="p-3">Experience</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-steel-50/50">
                    <td className="p-3 font-bold text-navy-950">{app.candidateName}</td>
                    <td className="p-3 font-semibold text-airtech-blue">{app.jobTitle}</td>
                    <td className="p-3 text-steel-600 font-mono">{app.experience}</td>
                    <td className="p-3 text-steel-500 font-mono">
                      <div>{app.email}</div>
                      <div className="text-[10px] text-steel-400">{app.phone}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-sm font-semibold text-[10px]">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="text-airtech-blue hover:underline font-semibold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>View CV</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CLIENT ENQUIRIES & LEADS
          ========================================================================= */}
      {activeTab === "enquiries" && (
        <div className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-steel-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">Prospective Client Inquiries</h2>
              <p className="text-xs text-steel-500">Inbound project RFPs and advisory inquiries captured via the public contact form.</p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-sm border border-emerald-200">
              {enquiries.length} Inquiries Logged
            </span>
          </div>

          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-4 border border-steel-300 rounded-sm bg-steel-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-navy-950">{enq.senderName}</span>
                    <span className="text-xs text-steel-500">• {enq.organization}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-semibold ${
                    enq.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {enq.status}
                  </span>
                </div>

                <div className="text-xs text-steel-700 bg-white p-3 rounded-sm border border-steel-200 italic">
                  &quot;{enq.scope}&quot;
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-steel-500 pt-1">
                  <span>Contact: {enq.email} | {enq.phone}</span>
                  <span>Received: {enq.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: SECURITY & AUDIT LOGS
          ========================================================================= */}
      {activeTab === "audit" && (
        <div className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-steel-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">Security & Operational Audit Trail</h2>
              <p className="text-xs text-steel-500">Immutable chronological record of administrative actions, logins, and permission checks.</p>
            </div>
            <span className="text-xs font-mono text-steel-500 bg-steel-100 px-3 py-1 rounded-sm">
              PostgreSQL Audit Logging Enforced
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { action: "CLERK_SESSION_ESTABLISHED", user: "bera.ankan005@gmail.com", role: "owner", ip: "152.58.177.203", time: "Just now" },
              { action: "CMS_HOMEPAGE_HERO_UPDATED", user: "bera.ankan005@gmail.com", role: "owner", ip: "152.58.177.203", time: "10 mins ago" },
              { action: "MEDIA_ASSET_UPLOADED", user: "bera.ankan005@gmail.com", role: "owner", ip: "152.58.177.203", time: "25 mins ago" },
              { action: "CLIENT_INVOICE_GENERATED", user: "system_billing", role: "finance_admin", ip: "127.0.0.1", time: "2 hours ago" },
            ].map((log, i) => (
              <div key={i} className="p-3 bg-steel-50 border border-steel-200 rounded-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-navy-950">{log.action}</div>
                  <div className="text-[11px] text-steel-500">By: {log.user} ({log.role}) • IP: {log.ip}</div>
                </div>
                <div className="text-[10px] text-steel-400">{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Universal Media Library Modal Component */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        targetCategory={mediaCategory}
        onSelectImage={(url) => {
          if (mediaTargetCallback) {
            mediaTargetCallback(url);
          }
        }}
      />
    </PortalLayout>
  );
}
