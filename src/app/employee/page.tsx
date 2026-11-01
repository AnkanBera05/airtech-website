"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { 
  Briefcase, 
  Clock, 
  FolderKanban, 
  Layers, 
  CheckCircle2, 
  Plus, 
  Upload, 
  Calendar, 
  AlertCircle 
} from "lucide-react";

export default function EmployeePortalPage() {
  const [timesheetProject, setTimesheetProject] = useState("Apollo Hospital");
  const [timesheetHours, setTimesheetHours] = useState("8");
  const [timesheetDesc, setTimesheetDesc] = useState("");
  const [timesheetSubmitted, setTimesheetSubmitted] = useState(false);

  const assignedTasks = [
    {
      id: "task-01",
      project: "Apollo Super-Speciality Hospital",
      title: "Chiller Plant Primary/Secondary Pump Head Sizing",
      discipline: "HVAC",
      priority: "High",
      deadline: "2026-11-05",
      status: "In Progress",
      estimatedHours: 16,
      loggedHours: 10,
    },
    {
      id: "task-02",
      project: "Apollo Super-Speciality Hospital",
      title: "OT-3 & OT-4 Laminar Flow Velocity Verification",
      discipline: "HVAC Cleanroom",
      priority: "Critical",
      deadline: "2026-11-08",
      status: "Under Review",
      estimatedHours: 12,
      loggedHours: 12,
    },
    {
      id: "task-03",
      project: "ITC Green Tech IT Tower",
      title: "AHU Static Pressure Drop Calculation (Filters & Dampers)",
      discipline: "HVAC",
      priority: "Medium",
      deadline: "2026-11-15",
      status: "To Do",
      estimatedHours: 8,
      loggedHours: 0,
    },
  ];

  const handleTimesheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timesheetDesc) return;
    setTimesheetSubmitted(true);
    setTimeout(() => setTimesheetSubmitted(false), 4000);
    setTimesheetDesc("");
  };

  return (
    <PortalLayout portalTitle="Employee Engineering Desk" userRole="employee" userEmail="engineer@airtech-mep.com">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel-300 pb-4">
          <div>
            <div className="text-xs font-mono font-semibold uppercase text-airtech-blue">
              Technical Engineering Workspace
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-airtech-navy mt-0.5">
              Engineer Personal Dashboard
            </h1>
          </div>
          <div className="text-xs font-mono text-steel-500 bg-white border border-steel-300 px-3 py-1.5 rounded-sm">
            <span>Department: HVAC & Mechanical Design</span>
          </div>
        </div>

        {/* Workload Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-steel-300 p-4 bg-white rounded-sm">
            <div className="text-[11px] font-mono text-steel-500 uppercase">Assigned Tasks</div>
            <div className="text-2xl font-bold text-airtech-navy mt-1">3 Tasks</div>
            <div className="text-xs text-amber-700 mt-1">1 Critical OT Review</div>
          </div>
          <div className="border border-steel-300 p-4 bg-white rounded-sm">
            <div className="text-[11px] font-mono text-steel-500 uppercase">Hours Logged This Week</div>
            <div className="text-2xl font-bold text-airtech-navy mt-1">32.5 hrs</div>
            <div className="text-xs text-emerald-700 mt-1">Timesheet on track</div>
          </div>
          <div className="border border-steel-300 p-4 bg-white rounded-sm">
            <div className="text-[11px] font-mono text-steel-500 uppercase">Active CAD Drawings</div>
            <div className="text-2xl font-bold text-airtech-navy mt-1">4 Sheets</div>
            <div className="text-xs text-steel-500 mt-1">ZWCAD / Revit Layouts</div>
          </div>
        </div>

        {/* Section: Assigned Tasks */}
        <div id="tasks" className="border border-steel-300 bg-white rounded-sm overflow-hidden shadow-subtle">
          <div className="p-4 border-b border-steel-200 bg-airtech-offwhite flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-airtech-blue" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-airtech-navy">
                My Active Engineering Tasks
              </h2>
            </div>
            <span className="text-xs font-mono text-steel-500">Live Status</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full tech-table text-left">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Project</th>
                  <th>Discipline</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-200">
                {assignedTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-steel-50">
                    <td className="font-semibold text-airtech-navy text-xs">{t.title}</td>
                    <td className="text-xs text-steel-600">{t.project}</td>
                    <td className="text-xs text-steel-500 font-mono">{t.discipline}</td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded-sm border ${
                        t.priority === "Critical" ? "bg-red-50 text-airtech-red border-red-200" : "bg-blue-50 text-airtech-blue border-blue-200"
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="font-mono text-xs">{t.deadline}</td>
                    <td className="font-mono text-xs text-steel-500">{t.loggedHours} / {t.estimatedHours} hrs</td>
                    <td>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-steel-100 text-steel-700 rounded-sm">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Timesheet Logger */}
        <div id="timesheets" className="border border-steel-300 bg-white rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-steel-200 pb-3">
            <Clock className="w-4 h-4 text-airtech-blue" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-airtech-navy">
              Log Daily Engineering Hours
            </h2>
          </div>

          {timesheetSubmitted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Timesheet entry successfully recorded and queued for Project Manager verification.</span>
            </div>
          )}

          <form onSubmit={handleTimesheetSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-airtech-charcoal mb-1">Project</label>
                <select
                  value={timesheetProject}
                  onChange={(e) => setTimesheetProject(e.target.value)}
                  className="w-full p-2 border border-steel-300 rounded-sm bg-white"
                >
                  <option>Apollo Super-Speciality Expansion</option>
                  <option>ITC Green Tech IT Tower</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-airtech-charcoal mb-1">Hours Logged</label>
                <input
                  type="number"
                  min="0.5"
                  max="14"
                  step="0.5"
                  value={timesheetHours}
                  onChange={(e) => setTimesheetHours(e.target.value)}
                  className="w-full p-2 border border-steel-300 rounded-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-airtech-charcoal mb-1">Work Date</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full p-2 border border-steel-300 rounded-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-airtech-charcoal mb-1">Technical Activity Description</label>
              <textarea
                rows={2}
                required
                value={timesheetDesc}
                onChange={(e) => setTimesheetDesc(e.target.value)}
                placeholder="Detail technical work completed (e.g., Prepared ZWCAD chiller pump schematic layout per ASHRAE 90.1, calculated pressure drop for 250mm header)..."
                className="w-full p-2 border border-steel-300 rounded-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-airtech-navy hover:bg-airtech-dark text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors"
            >
              Submit Timesheet Entry
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
