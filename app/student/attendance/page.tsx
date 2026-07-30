"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Flame,
  UserCheck,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar as CalendarIcon
} from "lucide-react";

export default function StudentAttendancePage() {
  const [markedPresent, setMarkedPresent] = useState(false);

  const activityLogs = [
    {
      id: 1,
      date: "July 24, 2026",
      className: "Kathak Basics - Module A",
      time: "05:00 PM",
      status: "Present",
      statusBadge: "bg-[#E6F7ED] text-[#22A05B]",
    },
    {
      id: 2,
      date: "July 22, 2026",
      className: "Rhythm & Footwork",
      time: "06:30 PM",
      status: "Late (10m)",
      statusBadge: "bg-[#FEF3C7] text-[#D97706]",
    },
    {
      id: 3,
      date: "July 20, 2026",
      className: "Cultural History Workshop",
      time: "04:00 PM",
      status: "Present",
      statusBadge: "bg-[#E6F7ED] text-[#22A05B]",
    },
    {
      id: 4,
      date: "July 17, 2026",
      className: "Kathak Basics - Module A",
      time: "05:00 PM",
      status: "Absent",
      statusBadge: "bg-[#FDF2F4] text-[#C10F3A]",
    },
    {
      id: 5,
      date: "July 15, 2026",
      className: "Technique Drill - Online",
      time: "07:00 PM",
      status: "Present",
      statusBadge: "bg-[#E6F7ED] text-[#22A05B]",
    },
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* 1. TOP NOTIFICATION BANNER ("ONGOING CLASS") */}
      <div className="bg-[#E5F2FF]/60 border border-sky-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#900C27] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              ONGOING CLASS
            </span>
            <span className="text-xs text-sky-800 font-bold">Live Now</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#1B1B24]">
            Kathak Basics - Module A
          </h2>
          <p className="text-xs text-stone-500 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Started 10 mins ago</span>
          </p>
        </div>

        <button
          onClick={() => setMarkedPresent(true)}
          disabled={markedPresent}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0 ${
            markedPresent
              ? "bg-emerald-600 text-white cursor-default"
              : "bg-[#900C27] hover:bg-[#780A20] text-white"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{markedPresent ? "✓ Present Marked!" : "Mark Present"}</span>
        </button>
      </div>

      {/* 2. PAGE HEADER & SUBTITLE */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
          Attendance Overview
        </h1>
        <p className="text-sm font-normal text-[#464555]">
          Track your consistency and class presence across all academy modules.
        </p>
      </div>

      {/* 3. TOP 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Overall Attendance */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-5">
          <div className="w-16 h-16 rounded-full border-4 border-rose-500 border-t-rose-200 flex items-center justify-center font-extrabold text-xl text-[#900C27] shrink-0">
            92%
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1B1B24]">Overall Attendance</h3>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mt-0.5">
              EXCELLENT CONSISTENCY • ACROSS 4 MODULES
            </span>
          </div>
        </div>

        {/* Card 2: Classes Attended */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">23 / 25</span>
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
            <span className="text-2xl font-extrabold text-[#1B1B24]">18 Days</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Current Learning Streak
            </span>
          </div>
        </div>

      </div>

      {/* 4. JULY 2026 CALENDAR BREAKDOWN CARD */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1B1B24]">
              July 2026
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
          
          {/* Week 1 */}
          <div className="p-2 sm:p-3 text-stone-300"></div>
          <div className="p-2 sm:p-3 text-stone-300"></div>
          <div className="p-2 sm:p-3 text-stone-300"></div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-stone-700">01</span>
            <div className="w-full h-1 bg-emerald-500 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-stone-700">02</span>
            <div className="w-full h-1 bg-emerald-500 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-stone-700">03</span>
            <div className="w-full h-1 bg-emerald-500 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-stone-700">04</span>
          </div>

          {/* Week 2 */}
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">05</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-stone-700">06</span>
            <div className="w-full h-1 bg-rose-500 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">07</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-stone-700">08</span>
            <div className="w-full h-1 bg-emerald-500 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-stone-700">09</span>
            <div className="w-full h-1 bg-amber-500 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-stone-700">10</span>
            <div className="w-full h-1 bg-emerald-500 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">11</div>

          {/* Week 3 */}
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">12</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1">
            <span className="font-bold text-rose-600">13</span>
            <div className="w-full h-1 bg-rose-500 rounded-full" />
            <div className="w-full h-0.5 bg-sky-600 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">14</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">15</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">16</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">17</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">18</div>

          {/* Week 4 */}
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">19</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">20</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">21</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">22</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">23</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl relative space-y-1 bg-sky-50/50">
            <span className="font-bold text-[#900C27]">24</span>
            <div className="w-full h-0.5 bg-sky-600 rounded-full" />
          </div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">25</div>

          {/* Week 5 */}
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">26</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">27</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">28</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">29</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">30</div>
          <div className="p-2 sm:p-3 border border-stone-100 rounded-xl">31</div>
          <div className="p-2 sm:p-3 text-stone-300"></div>

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
            <span>Upcoming Class</span>
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
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-stone-600 font-semibold">{log.date}</td>
                  <td className="py-3.5 px-4 font-bold text-[#1B1B24]">{log.className}</td>
                  <td className="py-3.5 px-4 text-stone-500">{log.time}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.statusBadge}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View All Button */}
        <div className="text-center pt-2">
          <button className="border border-stone-200 hover:border-stone-300 text-stone-700 px-6 py-2 rounded-full text-xs font-semibold transition-colors">
            View All July Records
          </button>
        </div>

      </div>

    </div>
  );
}
