"use client";

import React from "react";
import { ArrowLeft, ChevronDown, Eye } from "lucide-react";
import { SubmittedAssignmentRecord, BatchOption, renderAvatar } from "./types";

interface SubmittedAssignmentsModalProps {
  submittedList: SubmittedAssignmentRecord[];
  filteredSubmissions: SubmittedAssignmentRecord[];
  submissionBatchFilter: string;
  setSubmissionBatchFilter: (val: string) => void;
  submissionTitleSearch: string;
  setSubmissionTitleSearch: (val: string) => void;
  submissionStatusFilter: string;
  setSubmissionStatusFilter: (val: string) => void;
  batches: BatchOption[];
  onBack: () => void;
  openReviewFromSubmission: (sub: SubmittedAssignmentRecord) => void;
}

export const SubmittedAssignmentsModal: React.FC<SubmittedAssignmentsModalProps> = ({
  submittedList,
  filteredSubmissions,
  submissionBatchFilter,
  setSubmissionBatchFilter,
  submissionTitleSearch,
  setSubmissionTitleSearch,
  submissionStatusFilter,
  setSubmissionStatusFilter,
  batches,
  onBack,
  openReviewFromSubmission,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#8C2329] cursor-pointer mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assignments
          </button>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Student Submissions
          </h1>
        </div>
      </div>

      {/* Submissions Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={submissionBatchFilter}
              onChange={(e) => setSubmissionBatchFilter(e.target.value)}
              className="h-10 pl-4 pr-9 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-[#8C2329] cursor-pointer shadow-2xs"
            >
              <option value="All Batches">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <input
            type="text"
            placeholder="Assignment Title"
            value={submissionTitleSearch}
            onChange={(e) => setSubmissionTitleSearch(e.target.value)}
            className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#8C2329] shadow-2xs"
          />

          <div className="relative">
            <select
              value={submissionStatusFilter}
              onChange={(e) => setSubmissionStatusFilter(e.target.value)}
              className="h-10 pl-4 pr-9 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-[#8C2329] cursor-pointer shadow-2xs"
            >
              <option value="All">Status: All</option>
              <option value="Submitted">Submitted</option>
              <option value="Overdue">Overdue</option>
              <option value="Pending">Pending</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredSubmissions.length > 0 ? 1 : 0}-{filteredSubmissions.length} of {submittedList.length} students
        </span>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200/70">
                <th className="py-3.5 px-5">STUDENT</th>
                <th className="py-3.5 px-5">ASSIGNMENT</th>
                <th className="py-3.5 px-5">BATCH</th>
                <th className="py-3.5 px-5">SUBMITTED DATE</th>
                <th className="py-3.5 px-5">STATUS BADGE</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* STUDENT */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {renderAvatar(row.studentName, row.studentAvatar, "bg-[#00B4D8]")}
                        <div>
                          <span className="block font-bold text-slate-900 text-sm">
                            {row.studentName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {row.studentId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ASSIGNMENT */}
                    <td className="py-4 px-5 font-semibold text-slate-800">
                      {row.assignmentTitle}
                    </td>

                    {/* BATCH */}
                    <td className="py-4 px-5">
                      <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-100/70 text-xs font-bold inline-block">
                        {row.batch}
                      </span>
                    </td>

                    {/* SUBMITTED DATE */}
                    <td className="py-4 px-5 text-slate-700 font-medium">
                      {row.submittedDate}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="py-4 px-5">
                      {row.status === "Submitted" && (
                        <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Submitted
                        </span>
                      )}
                      {row.status === "Overdue" && (
                        <span className="px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                          Overdue
                        </span>
                      )}
                      {row.status === "Pending" && (
                        <span className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-bold inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          Pending
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => openReviewFromSubmission(row)}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer inline-flex items-center justify-center transition-colors"
                        title="View / Review"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    No submissions found in backend database.
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
