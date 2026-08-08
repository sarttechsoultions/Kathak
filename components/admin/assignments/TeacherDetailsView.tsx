"use client";

import React from "react";
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  ClipboardList,
  FileText,
  Clock,
  CheckCircle2,
  Search,
  ChevronDown,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import { AssignmentItem, renderAvatar } from "./types";

interface TeacherDetailsViewProps {
  selectedTeacherDetail: AssignmentItem;
  assignmentDetails: any;
  teacherDetailAssignments: any[];
  metrics: {
    totalActive: number;
    pendingReviews: number;
    submissionsThisWeek: number;
    avgCompletionRate: string;
  };
  assignmentsListLength: number;
  detailSearchTerm: string;
  setDetailSearchTerm: (val: string) => void;
  detailStatusFilter: string;
  setDetailStatusFilter: (val: string) => void;
  onBack: () => void;
  onViewSubmission: (detail: any) => void;
}

export const TeacherDetailsView: React.FC<TeacherDetailsViewProps> = ({
  selectedTeacherDetail,
  assignmentDetails,
  teacherDetailAssignments,
  metrics,
  assignmentsListLength,
  detailSearchTerm,
  setDetailSearchTerm,
  detailStatusFilter,
  setDetailStatusFilter,
  onBack,
  onViewSubmission,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 hover:text-[#8C2329] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Assignment Management</span>
        </button>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-900">Teacher Details</span>
      </div>

      {/* Teacher Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
        <div className="relative shrink-0">
          {renderAvatar(
            selectedTeacherDetail.teacherName || "Aswini",
            selectedTeacherDetail.teacherAvatar,
            "bg-[#8C2329]"
          )}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {selectedTeacherDetail.teacherName || "Aswini"}
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              {selectedTeacherDetail.teacherDept || "Classical Dance Dept."}
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Briefcase className="w-4 h-4 text-slate-500" />
              {selectedTeacherDetail.teacherDesignation || "Senior Faculty"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-indigo-600">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              {assignmentsListLength > 0 ? assignmentsListLength : 1} Total Assignments
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: ACTIVE ASSIGNMENTS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ACTIVE ASSIGNMENTS
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {assignmentDetails ? 1 : 0}
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

        {/* Card 3: COMPLETION ASSIGNMENT */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              COMPLETION ASSIGNMENT
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {assignmentDetails?.submissions?.filter((s: any) => s.status === "GRADED")?.length || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={detailSearchTerm}
                onChange={(e) => setDetailSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#8C2329] focus:outline-none transition-colors"
              />
            </div>

            <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100/60 inline-flex items-center">
              {selectedTeacherDetail.targetBatch || "Kathak Beginner"}
            </span>

            <div className="relative">
              <select
                value={detailStatusFilter}
                onChange={(e) => setDetailStatusFilter(e.target.value)}
                aria-label="Filter by Status"
                className="h-11 pl-3.5 pr-8 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 focus:border-[#8C2329] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button className="h-11 px-4 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Table of Assignments */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-5">ASSIGNMENT TITLE</th>
                <th className="py-4 px-5">DATES</th>
                <th className="py-4 px-5">TARGET BATCH</th>
                <th className="py-4 px-5">SUBMISSIONS</th>
                <th className="py-4 px-5">STATUS</th>
                <th className="py-4 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {teacherDetailAssignments.length > 0 ? (
                teacherDetailAssignments.map((detail, idx) => (
                  <tr key={detail.id || idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-extrabold text-slate-900 block text-xs">
                        {detail.title || "Kathak Practice"}
                      </span>
                      <span className="block text-xs font-semibold text-sky-500 mt-0.5">
                        {detail.typeTag || "Video Submission"}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-800">
                      {detail.dueDate || "-"}
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold inline-block border border-blue-100/60">
                        {detail.targetBatch || "Kathak Beginner"}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-800">
                      {detail.totalStudents || "0 Submissions"}
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold inline-block border border-emerald-100/60">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => onViewSubmission(detail)}
                        className="px-4 py-1.5 rounded-lg border border-indigo-200/80 bg-white hover:bg-indigo-50 text-indigo-600 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    No active assignments for this teacher.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
