"use client";

import React from "react";
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  FileText,
  Download,
  Clock,
  AlertCircle
} from "lucide-react";

export default function StudentProgressPage() {
  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* PAGE HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold text-[#900C27] tracking-tight">
            Student Progress
          </h1>
          <p className="text-xs font-semibold text-stone-400">
            Academic Year 2023-24 • Semester 2
          </p>
        </div>

        <button className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0">
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* TOP 4 METRIC SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: OVERALL PROGRESS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
              +4.2%
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">OVERALL PROGRESS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B24]">88.5%</span>
              <span className="text-xs font-semibold text-stone-400">Distinction</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#900C27] h-full rounded-full" style={{ width: "88.5%" }} />
          </div>
        </div>

        {/* Card 2: ATTENDANCE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-400">
              24/26 Days
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">ATTENDANCE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B24]">92%</span>
              <span className="text-xs font-semibold text-stone-400">Present</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: "92%" }} />
          </div>
        </div>

        {/* Card 3: TASK COMPLETION */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-400">
              12/15 Done
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">TASK COMPLETION</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B24]">80%</span>
              <span className="text-xs font-semibold text-stone-400">Rate</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-600 h-full rounded-full" style={{ width: "80%" }} />
          </div>
        </div>

        {/* Card 4: ASSIGNMENT COMPLETE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
              2 Pending
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">ASSIGNMENT COMPLETE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B24]">91</span>
              <span className="text-xs font-semibold text-stone-400">Avg Score</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "91%" }} />
          </div>
        </div>

      </div>

      {/* CLASS ATTENDANCE HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">CLASS</th>
                <th className="py-4 px-6 text-right">STATUS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs">
              <tr className="hover:bg-stone-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-700">Oct 24, 2023</td>
                <td className="py-4 px-6">
                  <span className="font-bold text-[#1B1B24] block text-sm">Kathak Basics</span>
                  <span className="text-[11px] text-stone-400">Pt. Birju Ji</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="bg-[#E6F7ED] text-[#22A05B] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    PRESENT
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-stone-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-700">Oct 22, 2023</td>
                <td className="py-4 px-6">
                  <span className="font-bold text-[#1B1B24] block text-sm">Rhythm Theory</span>
                  <span className="text-[11px] text-stone-400">Ms. Malini S.</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="bg-[#FDF2F4] text-[#C10F3A] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    ABSENT
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-stone-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-700">Oct 20, 2023</td>
                <td className="py-4 px-6">
                  <span className="font-bold text-[#1B1B24] block text-sm">Footwork Drills</span>
                  <span className="text-[11px] text-stone-400">Pt. Birju Ji</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="bg-[#E6F7ED] text-[#22A05B] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    PRESENT
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-stone-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-700">Oct 18, 2023</td>
                <td className="py-4 px-6">
                  <span className="font-bold text-[#1B1B24] block text-sm">Kathak Basics</span>
                  <span className="text-[11px] text-stone-400">Pt. Birju Ji</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="bg-[#E6F7ED] text-[#22A05B] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    PRESENT
                  </span>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

      {/* ASSIGNMENTS SECTION TABLE */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1B1B24]">
          Assignments
        </h3>

        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-4 px-6">TITLE</th>
                  <th className="py-4 px-6">DATES</th>
                  <th className="py-4 px-6">STATUS</th>
                  <th className="py-4 px-6 text-right">MARKS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 text-xs">
                <tr className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#1B1B24] text-sm">
                    Teental Footwork Video
                  </td>
                  <td className="py-4 px-6 space-y-0.5">
                    <span className="text-stone-500 font-medium block">Assigned: Oct 15</span>
                    <span className="text-rose-600 font-semibold block">Deadline: Oct 30</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Pending
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-stone-400">
                    -- / 100
                  </td>
                </tr>

                <tr className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#1B1B24] text-sm">
                    Abhinaya Reflection
                  </td>
                  <td className="py-4 px-6 space-y-0.5">
                    <span className="text-stone-500 font-medium block">Assigned: Oct 05</span>
                    <span className="text-stone-400 font-medium block">Completed: Oct 08</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Submitted
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-extrabold text-[#900C27] text-sm">
                    88 / 100
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* TASKS SECTION TABLE */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1B1B24]">
          Tasks
        </h3>

        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-4 px-6">TITLE</th>
                  <th className="py-4 px-6">DATES</th>
                  <th className="py-4 px-6">STATUS</th>
                  <th className="py-4 px-6 text-right">MARKS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 text-xs">
                <tr className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#1B1B24] text-sm">
                    Raga Identification Quiz
                  </td>
                  <td className="py-4 px-6 space-y-0.5">
                    <span className="text-stone-500 font-medium block">Assigned: Oct 10</span>
                    <span className="text-stone-400 font-medium block">Completed: Oct 12</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Submitted
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-extrabold text-[#900C27] text-sm">
                    94 / 100
                  </td>
                </tr>

                <tr className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#1B1B24] text-sm">
                    Weekly Practice Log
                  </td>
                  <td className="py-4 px-6 space-y-0.5">
                    <span className="text-stone-500 font-medium block">Assigned: Oct 01</span>
                    <span className="text-rose-600 font-semibold block">Deadline: Oct 07</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-rose-600 font-bold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      Missed
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-stone-400">
                    0 / 100
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
