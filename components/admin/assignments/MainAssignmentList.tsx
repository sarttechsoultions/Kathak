"use client";

import React from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Calendar,
  FileText,
  Clock,
  TrendingUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AssignmentItem, CourseOption, BatchOption, renderAvatar } from "./types";

interface MainAssignmentListProps {
  assignmentsList: AssignmentItem[];
  filteredAssignments: AssignmentItem[];
  paginatedAssignments: AssignmentItem[];
  metrics: {
    totalActive: number;
    pendingReviews: number;
    submissionsThisWeek: number;
    avgCompletionRate: string;
  };
  loading: boolean;
  assignmentSearchTerm: string;
  setAssignmentSearchTerm: (val: string) => void;
  assignmentBatchFilter: string;
  setAssignmentBatchFilter: (val: string) => void;
  assignmentCourseFilter: string;
  setAssignmentCourseFilter: (val: string) => void;
  assignmentStatusTab: "Active" | "Draft";
  setAssignmentStatusTab: (val: "Active" | "Draft") => void;
  batches: BatchOption[];
  courses: CourseOption[];
  assignmentsPage: number;
  setAssignmentsPage: React.Dispatch<React.SetStateAction<number>>;
  totalAssignmentsPages: number;
  PAGE_SIZE: number;
  onOpenCreateModal: () => void;
  onOpenSubmittedModal: () => void;
  onSelectAssignment: (asg: AssignmentItem) => void;
}

export const MainAssignmentList: React.FC<MainAssignmentListProps> = ({
  assignmentsList,
  filteredAssignments,
  paginatedAssignments,
  metrics,
  loading,
  assignmentSearchTerm,
  setAssignmentSearchTerm,
  assignmentBatchFilter,
  setAssignmentBatchFilter,
  assignmentCourseFilter,
  setAssignmentCourseFilter,
  assignmentStatusTab,
  setAssignmentStatusTab,
  batches,
  courses,
  assignmentsPage,
  setAssignmentsPage,
  totalAssignmentsPages,
  PAGE_SIZE,
  onOpenCreateModal,
  onOpenSubmittedModal,
  onSelectAssignment,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignment Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSubmittedModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#8C2329] bg-[#8C2329] text-white font-extrabold text-xs tracking-wide shadow-2xs hover:bg-[#721c21] cursor-pointer transition-all active:scale-95"
          >
            <span>Submitted Assignment</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#8C2329] bg-[#8C2329] text-white font-extrabold text-xs tracking-wide shadow-2xs hover:bg-[#721c21] cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Assignment</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: TOTAL ACTIVE */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#8C2329] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL ACTIVE
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {metrics.totalActive}
            </h3>
          </div>
        </div>

        {/* Card 2: PENDING REVIEWS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PENDING REVIEWS
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {metrics.pendingReviews}
            </h3>
          </div>
        </div>

        {/* Card 3: SUBMISSIONS THIS WEEK */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              SUBMISSIONS THIS WEEK
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {metrics.submissionsThisWeek}
            </h3>
          </div>
        </div>

        {/* Card 4: AVG COMPLETION RATE */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              AVG COMPLETION RATE
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {metrics.avgCompletionRate}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        {/* Search & Filter Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by assignment name..."
                value={assignmentSearchTerm}
                onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#8C2329] focus:outline-none transition-colors"
              />
            </div>

            {/* Batch Filter Dropdown */}
            <div className="relative">
              <select
                value={assignmentBatchFilter}
                onChange={(e) => setAssignmentBatchFilter(e.target.value)}
                aria-label="Filter by Batch"
                className="h-11 pl-3.5 pr-8 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 focus:border-[#8C2329] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All Batches">Batch: All Batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Course Filter Dropdown */}
            <div className="relative">
              <select
                value={assignmentCourseFilter}
                onChange={(e) => setAssignmentCourseFilter(e.target.value)}
                aria-label="Filter by Course"
                className="h-11 pl-3.5 pr-8 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 focus:border-[#8C2329] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All Courses">Course: All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-500 pl-2">Status:</span>
              <button
                onClick={() => setAssignmentStatusTab("Active")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  assignmentStatusTab === "Active"
                    ? "bg-white text-[#8C2329] shadow-2xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setAssignmentStatusTab("Draft")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  assignmentStatusTab === "Draft"
                    ? "bg-white text-[#8C2329] shadow-2xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Draft
              </button>
            </div>

            {/* Date Range Button */}
            <button className="h-11 px-4 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Date Range</span>
            </button>
          </div>
        </div>

        {/* Table of Assignments */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-5">TEACHER</th>
                <th className="py-4 px-5">ASSIGNMENT TITLE</th>
                <th className="py-4 px-5">TARGET BATCH</th>
                <th className="py-4 px-5">DUE DATE</th>
                <th className="py-4 px-5">TOTAL STUDENTS</th>
                <th className="py-4 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    Loading assignments...
                  </td>
                </tr>
              ) : paginatedAssignments.length > 0 ? (
                paginatedAssignments.map((asg) => (
                  <tr
                    key={asg.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() => onSelectAssignment(asg)}
                  >
                    {/* TEACHER */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {renderAvatar(asg.teacherName || "Teacher", asg.teacherAvatar, "bg-[#8C2329]")}
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{asg.teacherName || "Aswini"}</p>
                          <p className="text-[11px] text-slate-400 font-semibold">{asg.teacherDept || "Teacher"}</p>
                        </div>
                      </div>
                    </td>

                    {/* ASSIGNMENT TITLE */}
                    <td className="py-4 px-5">
                      <span className="font-extrabold text-slate-900 block text-xs">
                        {asg.title}
                      </span>
                      <span className="block text-xs font-semibold text-sky-500 mt-0.5">
                        {asg.typeTag}
                      </span>
                    </td>

                    {/* TARGET BATCH */}
                    <td className="py-4 px-5">
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold inline-block border border-blue-100/60">
                        {asg.targetBatch}
                      </span>
                    </td>

                    {/* DUE DATE */}
                    <td className="py-4 px-5 font-bold text-slate-800">
                      {asg.dueDate}
                    </td>

                    {/* TOTAL STUDENTS */}
                    <td className="py-4 px-5 font-bold text-slate-800">
                      {asg.totalStudents}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAssignment(asg);
                        }}
                        className="px-4 py-1.5 rounded-lg border border-indigo-200/80 bg-white hover:bg-indigo-50 text-indigo-600 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    No assignments found. Click &quot;Create New Assignment&quot; to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs">
          <span className="text-slate-500 font-medium">
            Showing {filteredAssignments.length > 0 ? (assignmentsPage - 1) * PAGE_SIZE + 1 : 0}-
            {Math.min(assignmentsPage * PAGE_SIZE, filteredAssignments.length)} of {filteredAssignments.length} results
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAssignmentsPage((p) => Math.max(1, p - 1))}
              disabled={assignmentsPage === 1}
              aria-label="Previous Page"
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-[#8C2329] text-white font-extrabold text-xs">
              {assignmentsPage}
            </span>
            <span className="text-slate-400 font-bold text-xs">of {totalAssignmentsPages}</span>
            <button
              onClick={() => setAssignmentsPage((p) => Math.min(totalAssignmentsPages, p + 1))}
              disabled={assignmentsPage >= totalAssignmentsPages}
              aria-label="Next Page"
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
