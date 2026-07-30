"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  FileText,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Eye,
  ChevronRight,
  Filter,
  ArrowRight
} from "lucide-react";

export default function StudentExamDashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const historyList = [
    {
      id: 1,
      name: "Theory: Advanced Harmony",
      code: "Code: MUS-402",
      date: "Oct 12, 2024",
      category: "FINAL",
      score: "94/100",
      status: "Completed",
      statusBadge: "bg-[#E6F7ED] text-[#22A05B]",
      actionRoute: "/student/exam/results",
    },
    {
      id: 2,
      name: "Modern Acoustical Physics",
      code: "Code: PHY-109",
      date: "Nov 22, 2024",
      category: "MONTHLY",
      score: "--",
      status: "Upcoming",
      statusBadge: "bg-[#E5F2FF] text-[#2B78C5]",
      actionRoute: "/student/exam/take",
    },
    {
      id: 3,
      name: "History of Classical Era",
      code: "Code: HIS-201",
      date: "Oct 29, 2024",
      category: "MIDTERM",
      score: "--",
      status: "In Progress",
      statusBadge: "bg-[#FEF3C7] text-[#D97706]",
      actionRoute: "/student/exam/take",
    },
    {
      id: 4,
      name: "Music Composition Ethics",
      code: "Code: ETH-310",
      date: "Sep 15, 2024",
      category: "MONTHLY",
      score: "0/100",
      isRedScore: true,
      status: "Missed",
      statusBadge: "bg-[#FDF2F4] text-[#C10F3A]",
      actionRoute: "/student/exam/results",
    },
    {
      id: 5,
      name: "Digital Sound Design",
      code: "Code: DSD-501",
      date: "Aug 30, 2024",
      category: "MIDTERM",
      score: "82/100",
      status: "Completed",
      statusBadge: "bg-[#E6F7ED] text-[#22A05B]",
      actionRoute: "/student/exam/results",
    },
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* 1. TOP UPCOMING EXAM ALERT BANNER */}
      <div className="bg-[#FFF8E6] border border-[#FCD34D] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1B1B24]">
              Upcoming Exam: Advanced Music Theory - Grade 4
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Starts in 45 minutes (10:00 AM)
            </p>
          </div>
        </div>

        <Link
          href="/student/exam/take"
          className="bg-[#D97706] hover:bg-[#b45309] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
        >
          Join Exam Lobby
        </Link>
      </div>

      {/* 2. PAGE HEADER & SUBTITLE */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
          My Examinations
        </h1>
        <p className="text-sm font-normal text-[#464555] max-w-3xl leading-relaxed">
          Track your assessment history, monitor performance trends, and prepare for upcoming milestones.
        </p>
      </div>

      {/* 3. TOP 4 METRIC SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: TOTAL EXAMS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">12</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">TOTAL EXAMS</span>
          </div>
        </div>

        {/* Card 2: COMPLETED */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">8</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">COMPLETED</span>
          </div>
        </div>

        {/* Card 3: AVERAGE SCORE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">88%</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">AVERAGE SCORE</span>
          </div>
        </div>

        {/* Card 4: UPCOMING */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1B1B24]">2</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">UPCOMING</span>
          </div>
        </div>

      </div>

      {/* 4. ASSESSMENT HISTORY SECTION TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
        
        {/* Table Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-[#1B1B24]">
              Assessment History
            </h3>
            <span className="bg-[#E5F2FF] text-[#2B78C5] px-3 py-0.5 rounded-full font-bold text-[10px]">
              Academic Year 2024
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {["All", "Midterm", "Final"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? "bg-white text-[#1B1B24] shadow-xs font-bold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-4 px-4">EXAM NAME</th>
                <th className="py-4 px-4">DATE</th>
                <th className="py-4 px-4">CATEGORY</th>
                <th className="py-4 px-4">SCORE</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs font-medium">
              {historyList.map((exam) => (
                <tr key={exam.id} className="hover:bg-stone-50/60 transition-colors">
                  
                  {/* Exam Name & Code */}
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-bold text-sm text-[#1B1B24] block">{exam.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{exam.code}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-stone-600 font-semibold">{exam.date}</td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="bg-[#E5F2FF] text-sky-800 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {exam.category}
                    </span>
                  </td>

                  {/* Score */}
                  <td className={`py-4 px-4 font-bold ${exam.isRedScore ? "text-rose-600 font-extrabold" : "text-[#1B1B24]"}`}>
                    {exam.score}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${exam.statusBadge}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {exam.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <Link
                      href={exam.actionRoute}
                      className="p-2 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors inline-block"
                      title="View Exam Details"
                    >
                      <Eye className="w-4 h-4 text-rose-700 ml-auto" />
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Pagination Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-medium">
          <span>Showing 5 of 12 assessments</span>

          <div className="flex items-center gap-1.5">
            <button className="p-1 rounded hover:bg-stone-100 text-stone-400 cursor-not-allowed">‹</button>
            <button className="w-6 h-6 rounded-md bg-[#900C27] text-white font-bold flex items-center justify-center text-xs">1</button>
            <button className="w-6 h-6 rounded-md hover:bg-stone-100 text-stone-700 font-medium flex items-center justify-center text-xs">2</button>
            <button className="w-6 h-6 rounded-md hover:bg-stone-100 text-stone-700 font-medium flex items-center justify-center text-xs">3</button>
            <button className="p-1 rounded hover:bg-stone-100 text-stone-700">›</button>
          </div>
        </div>

      </div>

    </div>
  );
}
