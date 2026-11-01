"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
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
  FileText
} from "lucide-react";

export default function AdminPortalPage() {
  const kpiStats = [
    { label: "Active Projects", value: "24", sub: "+3 this quarter", color: "text-navy-950" },
    { label: "Pending Approvals", value: "6", sub: "Requires review", color: "text-amber-600" },
    { label: "Outstanding", value: "₹ 1.28 Cr", sub: "GST Invoices", color: "text-airtech-blue" },
    { label: "Overdue Invoices", value: "4", sub: "Follow-up required", color: "text-airtech-red" },
  ];

  const recentActivities = [
    {
      id: "act-1",
      title: "New RFI raised",
      project: "City Hospital",
      time: "2 hours ago",
      type: "rfi",
    },
    {
      id: "act-2",
      title: "Drawing R1 uploaded",
      project: "Business Park",
      time: "4 hours ago",
      type: "drawing",
    },
    {
      id: "act-3",
      title: "Invoice INV-0432 paid",
      project: "Hotel Skyline",
      time: "6 hours ago",
      type: "payment",
    },
  ];

  const activeProjects = [
    {
      code: "AT-2026-HOSP-01",
      name: "City Hospital Super-Speciality Expansion",
      client: "City Healthcare Trust",
      status: "Detailed Engineering",
      tonnage: "1,400 TR",
      disciplines: "HVAC • Fire • PHE • Electrical • BMS",
      progress: 78,
    },
    {
      code: "AT-2026-COMM-02",
      name: "Business Park IT Tower (LEED Platinum)",
      client: "Bengal Techparks Corp",
      status: "Schematic Design",
      tonnage: "1,850 TR",
      disciplines: "HVAC • Electrical • BMS",
      progress: 46,
    },
    {
      code: "AT-2026-HOTEL-03",
      name: "Hotel Skyline Luxury Suites",
      client: "Skyline Hospitality Ltd",
      status: "Tendering & BOQ",
      tonnage: "900 TR",
      disciplines: "HVAC • Electrical • PHE",
      progress: 92,
    },
  ];

  return (
    <PortalLayout userRole="owner" userEmail="bera.ankan005@gmail.com" portalTitle="Owner Dashboard">
      {/* Top Header (Matching Panel 15) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-steel-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950">
            Owner Dashboard
          </h1>
          <p className="text-xs text-steel-500 mt-0.5">
            Welcome back! Here is the complete overview of all AIRTECH engineering operations.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-sm flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin Online</span>
          </span>
        </div>
      </div>

      {/* 4 KPI Cards (Matching Panel 15) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {kpiStats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm">
            <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-navy-950 mt-1">
              {stat.label}
            </div>
            <div className="text-[11px] text-steel-400 mt-0.5 font-mono">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-Column Split (Matching Panel 15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left 6 Columns: Project Progress with 68% Donut Chart */}
        <div className="lg:col-span-6 bg-white border border-steel-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-navy-950">
                Project Progress
              </h2>
              <span className="text-xs font-mono text-steel-400">All Active Sites</span>
            </div>

            {/* Donut Chart Simulation (Matching Panel 15) */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              {/* SVG Donut */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-steel-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Circle (68%) */}
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

              {/* Breakdown Labels */}
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
            <span>Engineering Workload: High</span>
            <span className="text-airtech-blue font-semibold">24 Projects Monitored</span>
          </div>
        </div>

        {/* Right 6 Columns: Recent Activities (Matching Panel 15) */}
        <div className="lg:col-span-6 bg-white border border-steel-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-navy-950">
                Recent Activities
              </h2>
              <span className="text-xs font-mono text-steel-400">Real-time Stream</span>
            </div>

            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-3 bg-steel-50 rounded-sm border border-steel-200">
                  <div className="w-2 h-2 rounded-full bg-airtech-blue mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-navy-950">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-steel-500">
                      Project: <strong className="text-navy-900">{act.project}</strong>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-steel-400 shrink-0">
                    {act.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-steel-100 mt-4 text-right">
            <a href="#audit" className="text-xs font-semibold text-airtech-blue hover:underline">
              View Audit Trail →
            </a>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div id="projects" className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-navy-950 mb-4">
          Active Engineering Engagements
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-steel-50 border-b border-steel-200 text-steel-500 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">Ref Code</th>
                <th className="p-3">Project Name</th>
                <th className="p-3">Client</th>
                <th className="p-3">Phase</th>
                <th className="p-3">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-200">
              {activeProjects.map((p) => (
                <tr key={p.code} className="hover:bg-steel-50/50">
                  <td className="p-3 font-mono font-bold text-airtech-blue">{p.code}</td>
                  <td className="p-3 font-semibold text-navy-950">{p.name}</td>
                  <td className="p-3 text-steel-600">{p.client}</td>
                  <td className="p-3">
                    <span className="bg-steel-100 text-steel-700 px-2 py-0.5 rounded-sm font-mono text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-steel-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-airtech-blue h-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="font-mono text-steel-600">{p.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
