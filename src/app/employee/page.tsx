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
  AlertCircle,
  FileCheck2,
  CalendarCheck
} from "lucide-react";

export default function EmployeePortalPage() {
  const [tasks, setTasks] = useState([
    {
      id: "t1",
      title: "Update HVAC load calculations",
      project: "City Hospital",
      due: "12 Mar",
      completed: false,
    },
    {
      id: "t2",
      title: "Revise duct layout (R1)",
      project: "Business Park",
      due: "14 Mar",
      completed: false,
    },
    {
      id: "t3",
      title: "Prepare equipment schedule",
      project: "Hotel Skyline",
      due: "15 Mar",
      completed: false,
    },
  ]);

  const [timesheetHours, setTimesheetHours] = useState("8");
  const [timesheetProject, setTimesheetProject] = useState("City Hospital");
  const [timesheetDesc, setTimesheetDesc] = useState("");
  const [loggedNotification, setLoggedNotification] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleTimesheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedNotification(true);
    setTimeout(() => setLoggedNotification(false), 4000);
    setTimesheetDesc("");
  };

  const kpis = [
    { label: "My Projects", value: "5", sub: "Active assignments", color: "text-navy-950" },
    { label: "Assigned Tasks", value: "12", sub: "3 in progress", color: "text-airtech-blue" },
    { label: "Due This Week", value: "3", sub: "Priority deadlines", color: "text-amber-600" },
    { label: "Task Completion", value: "87%", sub: "Quarterly efficiency", color: "text-emerald-600" },
  ];

  const weeklyHours = [
    { day: "Mon", hours: 6.5, height: "65%" },
    { day: "Tue", hours: 8.0, height: "80%" },
    { day: "Wed", hours: 7.0, height: "70%" },
    { day: "Thu", hours: 5.0, height: "50%" },
    { day: "Fri", hours: 2.0, height: "20%" },
  ];

  return (
    <PortalLayout userRole="employee" userEmail="rahul@airtech.in" portalTitle="Employee Portal">
      {/* Header (Matching Panel 16) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-steel-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950">
            Employee Dashboard
          </h1>
          <p className="text-xs text-steel-500 mt-0.5">
            Good morning, Rahul! Review your design queue and weekly time logs.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="text-[11px] font-mono bg-blue-50 text-airtech-blue border border-blue-200 px-3 py-1 rounded-sm flex items-center gap-1.5 font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Design Engineer (HVAC)</span>
          </span>
        </div>
      </div>

      {/* 4 KPI Cards (Matching Panel 16) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm">
            <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${kpi.color}`}>
              {kpi.value}
            </div>
            <div className="text-xs font-semibold text-navy-950 mt-1">
              {kpi.label}
            </div>
            <div className="text-[11px] text-steel-400 mt-0.5 font-mono">
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-Column Split (Matching Panel 16) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left 7 Columns: My Tasks Checklist */}
        <div className="lg:col-span-7 bg-white border border-steel-300 rounded-sm p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy-950">
              My Tasks
            </h2>
            <span className="text-xs font-mono text-steel-400">Next 7 Days</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3.5 border rounded-sm flex items-center justify-between cursor-pointer transition-all ${
                  task.completed
                    ? "bg-steel-50 border-steel-200 text-steel-400 line-through"
                    : "bg-white border-steel-300 hover:border-airtech-blue shadow-subtle"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="rounded-sm border-steel-300 text-airtech-blue focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-navy-950">
                      {task.title}
                    </div>
                    <div className="text-[11px] text-steel-500">
                      Project: <strong className="text-navy-900">{task.project}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-steel-500 bg-steel-100 px-2 py-0.5 rounded-sm">
                  Due: {task.due}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-steel-100 flex items-center justify-between text-xs text-steel-500">
            <span>Click any task to toggle status</span>
            <a href="#tasks" className="text-airtech-blue font-semibold hover:underline">
              Add New Task +
            </a>
          </div>
        </div>

        {/* Right 5 Columns: My Time (This Week) Bar Chart */}
        <div className="lg:col-span-5 bg-white border border-steel-300 rounded-sm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-navy-950">
                My Time (This Week)
              </h2>
              <span className="text-lg font-bold font-mono text-airtech-blue">
                28.5 hrs
              </span>
            </div>
            <p className="text-xs text-steel-400 mb-6 font-mono">
              Target: 40 hrs / week
            </p>

            {/* Bar Chart Simulation (Matching Panel 16) */}
            <div className="h-44 flex items-end justify-between gap-3 px-2 pt-6 pb-2 border-b border-steel-200">
              {weeklyHours.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono text-steel-500">{d.hours}h</span>
                  <div className="w-full bg-steel-100 rounded-t-sm h-32 flex items-end">
                    <div
                      className="w-full bg-airtech-blue hover:bg-navy-900 transition-all rounded-t-sm"
                      style={{ height: d.height }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-steel-600">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-steel-500">
            <span>Billable Utilization: 94%</span>
            <a href="#timesheet" className="text-airtech-blue font-semibold hover:underline">
              Log Hours →
            </a>
          </div>
        </div>
      </div>

      {/* Timesheet Quick Logger */}
      <div id="timesheet" className="bg-white border border-steel-300 rounded-sm p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-navy-950 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-airtech-blue" />
          <span>Quick Timesheet Logger</span>
        </h2>

        {loggedNotification && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Timesheet entry logged successfully into PostgreSQL database.</span>
          </div>
        )}

        <form onSubmit={handleTimesheetSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Project
            </label>
            <select
              value={timesheetProject}
              onChange={(e) => setTimesheetProject(e.target.value)}
              className="w-full text-xs p-2.5 border border-steel-300 rounded-sm bg-white"
            >
              <option value="City Hospital">City Hospital</option>
              <option value="Business Park">Business Park IT Tower</option>
              <option value="Hotel Skyline">Hotel Skyline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Hours Logged
            </label>
            <input
              type="number"
              min="0.5"
              max="16"
              step="0.5"
              value={timesheetHours}
              onChange={(e) => setTimesheetHours(e.target.value)}
              className="w-full text-xs p-2.5 border border-steel-300 rounded-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-950 mb-1">
              Task Description
            </label>
            <input
              type="text"
              placeholder="e.g. Primary pump head calculation review"
              value={timesheetDesc}
              onChange={(e) => setTimesheetDesc(e.target.value)}
              className="w-full text-xs p-2.5 border border-steel-300 rounded-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-airtech-blue hover:bg-navy-900 text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-sm transition-colors"
            >
              Log Time Entry
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
