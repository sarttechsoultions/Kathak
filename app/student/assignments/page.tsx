"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Award
} from "lucide-react";

export default function StudentAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [statusFilter, setStatusFilter] = useState("All Status");

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
            My Assignments
          </h1>
          <p className="text-sm font-normal text-[#464555]">
            Track your progress and upcoming dance & music assessments.
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-[#FDF2F4] text-[#900C27] border border-rose-200 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            📅 Term 2: Oct - Dec 2024
          </span>
        </div>
      </div>

      {/* TOP 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Assigned */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">12</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">TOTAL ASSIGNED • ITEMS</span>
          </div>
        </div>

        {/* Card 2: Pending Submissions */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">3</span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">PENDING SUBMISSIONS • URGENT</span>
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">9</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">COMPLETED • ACHIEVED</span>
          </div>
        </div>

      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assignment names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-stone-200 focus:border-[#900C27] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
          />
        </div>

        {/* Dropdown 1: Courses */}
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="bg-white border border-stone-200 focus:border-[#900C27] rounded-xl px-4 py-2.5 text-xs font-medium text-stone-700 focus:outline-none transition-colors shadow-2xs cursor-pointer w-full sm:w-auto"
        >
          <option>All Courses</option>
          <option>Kathak</option>
          <option>Music</option>
        </select>

        {/* Dropdown 2: Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-stone-200 focus:border-[#900C27] rounded-xl px-4 py-2.5 text-xs font-medium text-stone-700 focus:outline-none transition-colors shadow-2xs cursor-pointer w-full sm:w-auto"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Submitted</option>
          <option>Evaluated</option>
        </select>

      </div>

      {/* ASSIGNMENTS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F4F6FC] border-b border-stone-100 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-4 px-6">ASSIGNMENT NAME</th>
                <th className="py-4 px-4">COURSE</th>
                <th className="py-4 px-4">DUE DATE</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-4">GRADE</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-stone-100 text-xs">
              
              {/* ROW 1: PENDING */}
              <tr className="hover:bg-stone-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-[#1B1B24]">
                  <div>
                    <span className="font-bold text-sm text-[#1B1B24] block">Rhythmic Footwork Week 3</span>
                    <span className="text-[11px] text-stone-400 font-normal">Practical Assessment</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-[#E5F2FF] text-sky-800 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    KATHAK
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-[#1B1B24]">
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Oct 24, 2024</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 bg-[#FDEAE2] text-[#C15C3D] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C15C3D]" />
                    PENDING
                  </span>
                </td>
                <td className="py-4 px-4 text-stone-400">—</td>
                <td className="py-4 px-6 text-right">
                  <Link
                    href="/student/assignments/upload"
                    className="inline-flex items-center gap-1.5 bg-[#900C27] hover:bg-[#780A20] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </Link>
                </td>
              </tr>

              {/* ROW 2: SUBMITTED */}
              <tr className="hover:bg-stone-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-[#1B1B24]">
                  <div>
                    <span className="font-bold text-sm text-[#1B1B24] block">Abhinaya Theory Quiz</span>
                    <span className="text-[11px] text-stone-400 font-normal">Written Component</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-[#E5F2FF] text-sky-800 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    MUSIC
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Oct 18, 2024</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 bg-[#E5F2FF] text-[#2B78C5] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B78C5]" />
                    SUBMITTED
                  </span>
                </td>
                <td className="py-4 px-4 text-stone-500 font-medium">Reviewing</td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                </td>
              </tr>

              {/* ROW 3: EVALUATED 95/100 */}
              <tr className="hover:bg-stone-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-[#1B1B24]">
                  <div>
                    <span className="font-bold text-sm text-[#1B1B24] block">Hand Gestures Module 1</span>
                    <span className="text-[11px] text-stone-400 font-normal">Visual Demonstration</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-[#E5F2FF] text-sky-800 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    KATHAK
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Oct 10, 2024</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 bg-[#E6F7ED] text-[#22A05B] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22A05B]" />
                    EVALUATED
                  </span>
                </td>
                <td className="py-4 px-4 font-extrabold text-[#1B1B24] text-sm">95/100</td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors">
                    <Eye className="w-4 h-4 ml-auto text-rose-700" />
                  </button>
                </td>
              </tr>

              {/* ROW 4: EVALUATED 85/100 */}
              <tr className="hover:bg-stone-50/60 transition-colors">
                <td className="py-4 px-6 font-semibold text-[#1B1B24]">
                  <div>
                    <span className="font-bold text-sm text-[#1B1B24] block">Tala Synchronization</span>
                    <span className="text-[11px] text-stone-400 font-normal">Rhythm Assessment</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-[#E5F2FF] text-sky-800 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    MUSIC
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Oct 05, 2024</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 bg-[#E6F7ED] text-[#22A05B] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22A05B]" />
                    EVALUATED
                  </span>
                </td>
                <td className="py-4 px-4 font-extrabold text-[#1B1B24] text-sm">85/100</td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors">
                    <Eye className="w-4 h-4 ml-auto text-rose-700" />
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">
          <span>Showing 1 to 4 of 12 assignments</span>

          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 cursor-not-allowed">‹</button>
            <button className="w-7 h-7 rounded-lg bg-[#900C27] text-white font-bold flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded-lg hover:bg-stone-100 text-stone-700 font-medium flex items-center justify-center">2</button>
            <button className="w-7 h-7 rounded-lg hover:bg-stone-100 text-stone-700 font-medium flex items-center justify-center">3</button>
            <button className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700">›</button>
          </div>
        </div>

      </div>

    </div>
  );
}
