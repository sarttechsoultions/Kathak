"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  AlertCircle,
  MessageSquare,
  Upload,
  Eye,
  Filter,
  ArrowUpDown,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function StudentVideoSubmissionPage() {
  const [activeTab, setActiveTab] = useState("All Tasks");

  const tasksList = [
    {
      id: 1,
      name: "Tatkar Footwork Speed Test - 140 BPM",
      category: "KATHAK",
      assignedBy: "Neha Sharma",
      assignedByRole: "Faculty",
      dateAssigned: "21 Jul 2025",
      deadline: "24 Jul 2025",
      deadlineNote: "Due in 3 days",
      status: "Assigned",
      statusColor: "bg-[#E5F2FF] text-sky-800",
      isOverdue: false,
      action: "upload",
    },
    {
      id: 2,
      name: "Hand Gesture Mastery - Asamyuta Hastas",
      category: "THEORY",
      assignedBy: "Vikram Singh",
      assignedByRole: "Guru",
      dateAssigned: "15 Jul 2025",
      deadline: "18 Jul 2025",
      deadlineNote: "Awaiting Review",
      status: "Submitted",
      statusColor: "bg-[#E5F2FF] text-[#2B78C5]",
      isOverdue: false,
      action: "view",
    },
    {
      id: 3,
      name: "Teental 16 Matra Chakkars - Balance Drill",
      category: "KATHAK",
      assignedBy: "Anjali Gupta",
      assignedByRole: "Senior Faculty",
      dateAssigned: "09 Jul 2025",
      deadline: "15 Jul 2025",
      deadlineNote: "6 days overdue",
      status: "Overdue",
      statusColor: "bg-[#FDF2F4] text-rose-700",
      isOverdue: true,
      action: "overdue_alert",
    },
    {
      id: 4,
      name: "Navarasa - Shringara & Karuna Practice",
      category: "EXPRESSIONS",
      assignedBy: "Rahul Deshpande",
      assignedByRole: "Evaluator",
      dateAssigned: "01 Jul 2025",
      deadline: "05 Jul 2025",
      deadlineNote: "Grade: A+",
      status: "Evaluated",
      statusColor: "bg-purple-100 text-purple-800",
      isOverdue: false,
      action: "evaluation_feedback",
    },
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
          My Tasks
        </h1>
        <p className="text-sm font-normal text-[#464555]">
          Manage your practice routine and course assignments.
        </p>
      </div>

      {/* TOP 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: TOTAL TASKS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">TOTAL TASKS</span>
            <span className="text-3xl font-extrabold text-[#1B1B24]">24</span>
            <span className="text-xs text-purple-600 font-semibold block">4 added this week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: PENDING SUBMISSIONS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">PENDING SUBMISSIONS</span>
            <span className="text-3xl font-extrabold text-[#1B1B24]">06</span>
            <span className="text-xs text-rose-600 font-semibold block">2 overdue tasks</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: COMPLETED REVIEWS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">COMPLETED REVIEWS</span>
            <span className="text-3xl font-extrabold text-[#1B1B24]">18</span>
            <span className="text-xs text-sky-600 font-semibold block">Average score: 92%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* TABS & FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {["All Tasks", "Assigned", "Submitted", "Evaluated", "Overdue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? tab === "Overdue"
                    ? "bg-[#900C27] text-white"
                    : "bg-[#900C27] text-white shadow-sm"
                  : tab === "Overdue"
                  ? "bg-[#FDF2F4] text-rose-700 hover:bg-rose-100"
                  : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter & Sort Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span>Filter</span>
          </button>
          <button className="bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span>Sort</span>
          </button>
        </div>

      </div>

      {/* TASKS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Header */}
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-4 px-6">TASK NAME & CATEGORY</th>
                <th className="py-4 px-4">ASSIGNED BY</th>
                <th className="py-4 px-4">DATE ASSIGNED</th>
                <th className="py-4 px-4">DEADLINE</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-6 text-center">ACTION</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-stone-100 text-xs">
              {tasksList.map((task) => (
                <tr
                  key={task.id}
                  className={`transition-colors ${
                    task.isOverdue ? "bg-rose-50/40 hover:bg-rose-50/70" : "hover:bg-stone-50/60"
                  }`}
                >
                  {/* Task Name & Category */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-[#1B1B24] block">
                        {task.name}
                      </span>
                      <span className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        {task.category}
                      </span>
                    </div>
                  </td>

                  {/* Assigned By */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-stone-300 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/Ananya.png" alt={task.assignedBy} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-stone-800">{task.assignedBy}</span>
                    </div>
                  </td>

                  {/* Date Assigned */}
                  <td className="py-4 px-4 font-medium text-stone-600">
                    {task.dateAssigned}
                  </td>

                  {/* Deadline */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-[#1B1B24] block">{task.deadline}</span>
                      <span
                        className={`text-[10px] font-semibold block ${
                          task.isOverdue
                            ? "text-rose-600"
                            : task.deadlineNote.includes("Due in")
                            ? "text-rose-500"
                            : "text-sky-600"
                        }`}
                      >
                        {task.deadlineNote}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.statusColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {task.status}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-6 text-center">
                    {task.action === "upload" && (
                      <Link
                        href="/student/assignments/upload"
                        className="p-2 rounded-xl text-[#900C27] hover:bg-rose-50 transition-colors inline-block"
                        title="Upload Video Submission"
                      >
                        <Upload className="w-4 h-4" />
                      </Link>
                    )}

                    {task.action === "view" && (
                      <Link
                        href="/student/video-submission/evaluation"
                        className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors inline-block"
                        title="View Submission Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}

                    {task.action === "overdue_alert" && (
                      <Link
                        href="/student/assignments/upload"
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 transition-colors inline-block"
                        title="Overdue - Submit Immediately"
                      >
                        <span className="text-rose-600 font-extrabold text-base">!</span>
                      </Link>
                    )}

                    {task.action === "evaluation_feedback" && (
                      <Link
                        href="/student/video-submission/evaluation"
                        className="p-2 rounded-xl text-purple-700 hover:bg-purple-50 transition-colors inline-block"
                        title="View Evaluation & Guru Feedback"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
        <span>© 2025 Nritya Dance Academy. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
          <a href="#terms" className="hover:underline">Terms & Conditions</a>
        </div>
      </div>

    </div>
  );
}
