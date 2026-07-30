"use client";

import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  ChevronDown,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart2
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  name: string;
  avatar: string;
  studentId: string;
  batchCourse: string;
  status: "P" | "A" | "LV";
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: "att-1",
    name: "Marcus Chen",
    avatar: "/Ananya.png",
    studentId: "KTL-2024-001",
    batchCourse: "2024-A • Kathak Intermediate",
    status: "P"
  },
  {
    id: "att-2",
    name: "Aria Sterling",
    avatar: "/Sunita.png",
    studentId: "KTL-2024-045",
    batchCourse: "2024-A • Kathak Basics",
    status: "A"
  },
  {
    id: "att-3",
    name: "Jameson Blake",
    avatar: "/Meera.png",
    studentId: "KTL-2024-112",
    batchCourse: "2024-C • Kathak Advanced",
    status: "LV"
  },
  {
    id: "att-4",
    name: "Ananya Sharma",
    avatar: "/Grace1.png",
    studentId: "KTL-2024-204",
    batchCourse: "2024-A • Kathak Tatkar",
    status: "P"
  },
  {
    id: "att-5",
    name: "Meera Iyer",
    avatar: "/Ananya.png",
    studentId: "KTL-2024-309",
    batchCourse: "2024-B • Kathak Abhinaya",
    status: "P"
  }
];

export default function AttendanceView() {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [selectedDate, setSelectedDate] = useState("October 24, 2023");
  const [selectedBatch, setSelectedBatch] = useState("Batch 2024-A");
  const [selectedSession, setSelectedSession] = useState("Morning Session");

  const handleStatusChange = (id: string, newStatus: "P" | "A" | "LV") => {
    setAttendanceList(
      attendanceList.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
          Attendance Management
        </h1>
        <p className="text-xs sm:text-sm font-medium text-stone-500">
          Track daily student presence, leave applications, and batch analytics.
        </p>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Total Students</p>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">1,248</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Present Today</p>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">1,150</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Absent</p>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-rose-600 mt-1">98</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Leave Requests</p>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-amber-600 mt-1">12</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar Below Metrics */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Selector */}
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200/90 text-xs font-bold text-stone-800 shadow-2xs">
            <CalendarIcon className="w-4 h-4 text-stone-500" />
            <span>{selectedDate}</span>
          </div>
        </div>

        {/* Batch Dropdown */}
        <div className="relative">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="h-10 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-bold text-stone-800 appearance-none cursor-pointer focus:outline-none shadow-2xs"
          >
            <option>Batch 2024-A</option>
            <option>Batch 2024-B</option>
            <option>Batch 2024-C</option>
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Session Dropdown */}
        <div className="relative">
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="h-10 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-bold text-stone-800 appearance-none cursor-pointer focus:outline-none shadow-2xs"
          >
            <option>Morning Session</option>
            <option>Afternoon Session</option>
            <option>Evening Session</option>
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (8 cols): Today's Attendance List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-lg text-stone-900">Today's Attendance List</h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Exporting Attendance Data...")}
                className="px-3.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-100 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-100 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                  <th className="py-3.5 px-4">STUDENT</th>
                  <th className="py-3.5 px-4">BATCH / COURSE</th>
                  <th className="py-3.5 px-4 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                {attendanceList.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                    
                    {/* Student */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0" />
                        <div>
                          <span className="font-bold text-stone-900 text-sm block">{row.name}</span>
                          <span className="text-[10.5px] text-stone-400 font-semibold block">{`ID: ${row.studentId}`}</span>
                        </div>
                      </div>
                    </td>

                    {/* Batch / Course */}
                    <td className="py-4 px-4 font-semibold text-stone-600">{row.batchCourse}</td>

                    {/* Status Interactive Toggle Pills */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
                        {/* P (Present) */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(row.id, "P")}
                          className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            row.status === "P"
                              ? "bg-emerald-500 text-white shadow-xs"
                              : "text-stone-400 hover:text-stone-700"
                          }`}
                        >
                          P
                        </button>

                        {/* A (Absent) */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(row.id, "A")}
                          className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            row.status === "A"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "text-stone-400 hover:text-stone-700"
                          }`}
                        >
                          A
                        </button>

                        {/* LV (Leave) */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(row.id, "LV")}
                          className={`w-7 h-7 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            row.status === "LV"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-stone-400 hover:text-stone-700"
                          }`}
                        >
                          LV
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-400">
            <div>Showing 1-10 of 1,248 students</div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-400 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button className="w-7 h-7 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
              <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
              <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">3</button>
              <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 cols): Mini Calendar & Batch-wise Analytics */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Mini Interactive Calendar */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="font-sans font-bold text-sm text-stone-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#9E0C25]" />
                <span>October 2023</span>
              </h4>
              <div className="flex items-center gap-1 text-stone-400">
                <button className="p-1 hover:text-stone-900 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 hover:text-stone-900 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i} className="text-[10.5px] font-extrabold text-stone-400 py-1">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    day === 24
                      ? "bg-[#9E0C25] text-white font-bold shadow-xs"
                      : day % 7 === 0
                      ? "text-rose-500 font-bold"
                      : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Calendar Legend */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Sessions: 24 Days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Holiday</span>
              </div>
            </div>
          </div>

          {/* Card 2: Batch-wise Analytics */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <BarChart2 className="w-4.5 h-4.5 text-[#9E0C25]" />
              <h4 className="font-sans font-bold text-sm text-stone-900">Batch-wise Analytics</h4>
            </div>

            <div className="space-y-4">
              {/* Batch 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>Batch 2024-A</span>
                  <span className="text-emerald-600">90%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[90%]" />
                </div>
              </div>

              {/* Batch 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>Batch 2024-C</span>
                  <span className="text-teal-600">88%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full w-[88%]" />
                </div>
              </div>

              {/* Batch 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>Batch 2023-B</span>
                  <span className="text-rose-600">72%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full w-[72%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => alert("Viewing All Batches Analytics...")}
                className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer"
              >
                View All Batches
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
