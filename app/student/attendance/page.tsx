"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Flame,
  UserCheck,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function StudentAttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ data: any }>("/student/attendance")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load attendance", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-stone-400">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Loading attendance records...</span>
      </div>
    );
  }

  const stats = data?.stats || {
    overallAttendance: 0,
    presentDays: 0,
    totalWorkingDays: 0,
    currentStreak: 0
  };

  const logs = data?.logs || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT": return "bg-[#E6F7ED] text-[#22A05B]";
      case "ABSENT": return "bg-[#FDF2F4] text-[#C10F3A]";
      case "LATE": return "bg-[#FEF3C7] text-[#D97706]";
      case "LEAVE": return "bg-[#EFF6FF] text-[#3B82F6]";
      case "PENDING": return "bg-gray-100 text-gray-500";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PRESENT": return "Present";
      case "ABSENT": return "Absent";
      case "LATE": return "Late";
      case "LEAVE": return "On Leave";
      case "PENDING": return "Pending Leave";
      default: return status;
    }
  };

  // Helper to determine if a specific date has a log
  const getLogForDate = (day: number) => {
    // Current month calendar
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`;
    
    const log = logs.find((l: any) => {
      const d = new Date(l.date);
      const dStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      return dStr === dateStr;
    });
    return log?.status;
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* 1. TOP NOTIFICATION BANNER ("ONGOING CLASS") */}
      {/* Keeping UI as requested, but linking to live classes since attendance is auto-captured */}
      <div className="bg-[#E5F2FF]/60 border border-sky-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#900C27] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              AUTO CAPTURE
            </span>
            <span className="text-xs text-sky-800 font-bold">Attendance System</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#1B1B24]">
            Live Class Attendance
          </h2>
          <p className="text-xs text-stone-500 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Attendance is automatically marked when you join a live class</span>
          </p>
        </div>

        <Link
          href="/student/classes"
          className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0 bg-[#900C27] hover:bg-[#780A20] text-white`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Join Live Class</span>
        </Link>
      </div>

      {/* 2. PAGE HEADER & SUBTITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
            Attendance Overview
          </h1>
          <p className="text-sm font-normal text-[#464555]">
            Track your consistency and class presence across all academy modules.
          </p>
        </div>
        <Link 
          href="/student/attendance/leave"
          className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Apply for Leave
        </Link>
      </div>

      {/* 3. TOP 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Overall Attendance */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-5">
          <div className="w-16 h-16 rounded-full border-4 border-rose-500 border-t-rose-200 flex items-center justify-center font-extrabold text-xl text-[#900C27] shrink-0">
            {stats.overallAttendance}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1B1B24]">Overall Attendance</h3>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mt-0.5">
              EXCELLENT CONSISTENCY • ACROSS ALL MODULES
            </span>
          </div>
        </div>

        {/* Card 2: Classes Attended */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">{stats.presentDays} / {stats.totalWorkingDays}</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Classes Attended
            </span>
          </div>
        </div>

        {/* Card 3: Current Learning Streak */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">{stats.currentStreak} Days</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Current Learning Streak
            </span>
          </div>
        </div>

      </div>

      {/* 4. CALENDAR BREAKDOWN CARD */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6 hidden md:block">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1B1B24]">
              Monthly Breakdown
            </h3>
            <p className="text-xs text-stone-400 font-medium">
              Daily attendance breakdown
            </p>
          </div>

          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <button className="p-1 rounded-lg border border-stone-200 hover:bg-stone-50">‹</button>
            <button className="p-1 rounded-lg border border-stone-200 hover:bg-stone-50">›</button>
          </div>
        </div>

        {/* Days Header Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-400 uppercase">
          <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
        </div>

        {/* Dates Grid with status bars */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium">
          
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const status = getLogForDate(day);
            const isToday = new Date().getDate() === day;
            
            return (
              <div key={day} className={`p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1 ${isToday ? 'bg-sky-50/50' : ''}`}>
                <span className={`font-bold ${isToday ? 'text-[#900C27]' : 'text-stone-700'}`}>
                  {day.toString().padStart(2, '0')}
                </span>
                {status === "PRESENT" && <div className="w-full h-1 bg-emerald-500 rounded-full" />}
                {status === "ABSENT" && <div className="w-full h-1 bg-rose-500 rounded-full" />}
                {status === "LATE" && <div className="w-full h-1 bg-amber-500 rounded-full" />}
                {status === "LEAVE" && <div className="w-full h-1 bg-sky-600 rounded-full" />}
              </div>
            );
          })}

        </div>

        {/* CALENDAR LEGEND */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Late</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span>On Leave</span>
          </div>
        </div>

      </div>

      {/* 5. RECENT ACTIVITY LOGS TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
        
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="text-base font-bold text-[#1B1B24]">
            Recent Activity Logs
          </h3>
          <button className="text-xs text-[#900C27] font-bold hover:underline flex items-center gap-1">
            <span>Download Report</span>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">CLASS NAME</th>
                <th className="py-3 px-4">TIME</th>
                <th className="py-3 px-4 text-right">STATUS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs font-medium">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-stone-400">
                    No attendance records found.
                  </td>
                </tr>
              ) : logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-stone-600 font-semibold">
                    {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1B1B24]">{log.className}</td>
                  <td className="py-3.5 px-4 text-stone-500">{log.time}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(log.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {getStatusText(log.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
