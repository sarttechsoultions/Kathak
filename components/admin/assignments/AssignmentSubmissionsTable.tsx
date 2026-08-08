"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { SubmittedAssignmentRecord, renderAvatar } from "./types";

interface AssignmentSubmissionsTableProps {
  assignment: any;
  submissions: SubmittedAssignmentRecord[];
  loading: boolean;
  onBackToTeacher: () => void;
  onBackToMain: () => void;
  onViewStudentSubmission: (sub: SubmittedAssignmentRecord) => void;
}

export const AssignmentSubmissionsTable: React.FC<AssignmentSubmissionsTableProps> = ({
  assignment,
  submissions,
  loading,
  onBackToTeacher,
  onBackToMain,
  onViewStudentSubmission,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return submissions.filter((sub) => {
      const matchSearch =
        !searchTerm ||
        sub.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Graded" ? !!sub.grade : sub.status === statusFilter);
      return matchSearch && matchStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  const totalGraded = useMemo(() => {
    return submissions.filter((s) => s.grade || s.status === "Pending").length;
  }, [submissions]);

  const pendingCount = useMemo(() => {
    return submissions.filter((s) => !s.grade && s.status === "Submitted").length;
  }, [submissions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
        <button
          onClick={onBackToMain}
          className="inline-flex items-center gap-2 hover:text-[#8C2329] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Assignment Management</span>
        </button>
        <span className="text-slate-400">&gt;</span>
        <button
          onClick={onBackToTeacher}
          className="hover:text-[#8C2329] cursor-pointer transition-colors"
        >
          Teacher Details
        </button>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-900 font-extrabold">Student Submissions</span>
      </div>

      {/* Assignment Header Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-rose-50 text-[#8C2329] text-[11px] font-extrabold border border-rose-100/80">
              {assignment?.typeTag || "Video Submission"}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100/60">
              {assignment?.targetBatch || assignment?.batchName || "Kathak Beginner"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {assignment?.title || "Kathak Practice"}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Assigned by:{" "}
            <span className="font-bold text-slate-800">
              {assignment?.teacherName || "Aswini"}
            </span>{" "}
            • Due Date:{" "}
            <span className="font-bold text-slate-800">
              {assignment?.dueDate || "Aug 10, 2026"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-200/80 text-right">
            <p className="text-[10.5px] font-bold text-slate-400 uppercase">Total Submissions</p>
            <p className="text-2xl font-extrabold text-slate-900">{submissions.length}</p>
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards for this assignment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#8C2329] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL SUBMISSIONS
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {submissions.length}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PENDING REVIEWS
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {pendingCount}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              EVALUATED &amp; GRADED
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {totalGraded}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Submissions Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#8C2329] focus:outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by Status"
                className="h-11 pl-3.5 pr-8 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 focus:border-[#8C2329] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Graded">Graded</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button className="h-11 px-4 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Student Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-5">STUDENT</th>
                <th className="py-4 px-5">ASSIGNMENT TITLE</th>
                <th className="py-4 px-5">BATCH</th>
                <th className="py-4 px-5">SUBMITTED DATE</th>
                <th className="py-4 px-5">STATUS</th>
                <th className="py-4 px-5">SCORE / GRADE</th>
                <th className="py-4 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    Loading student submissions...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* STUDENT */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {renderAvatar(sub.studentName, sub.studentAvatar, "bg-[#00B4D8]")}
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{sub.studentName}</p>
                          <p className="text-[11px] text-slate-400 font-semibold">{sub.studentId}</p>
                        </div>
                      </div>
                    </td>

                    {/* ASSIGNMENT TITLE */}
                    <td className="py-4 px-5 font-bold text-slate-800">
                      {sub.assignmentTitle || assignment?.title || "Kathak Practice"}
                    </td>

                    {/* BATCH */}
                    <td className="py-4 px-5">
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold inline-block border border-blue-100/60">
                        {sub.batch || assignment?.targetBatch || "Kathak Beginner"}
                      </span>
                    </td>

                    {/* SUBMITTED DATE */}
                    <td className="py-4 px-5 font-semibold text-slate-700">
                      {sub.submittedDate}
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-5">
                      {sub.grade ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold inline-block border border-emerald-100/60">
                          Graded
                        </span>
                      ) : sub.status === "Submitted" ? (
                        <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-[11px] font-bold inline-block border border-sky-100/60">
                          Submitted
                        </span>
                      ) : sub.status === "Overdue" ? (
                        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold inline-block border border-rose-100/60">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold inline-block border border-amber-100/60">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* SCORE / GRADE */}
                    <td className="py-4 px-5">
                      {sub.grade ? (
                        <span className="font-extrabold text-emerald-700 text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                          {sub.grade}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold">Not Graded</span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => onViewStudentSubmission(sub)}
                        className="px-4 py-1.5 rounded-lg border border-indigo-200/80 bg-white hover:bg-indigo-50 text-indigo-600 font-bold text-xs cursor-pointer transition-colors shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    No student submissions found for this assignment.
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
