"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  Upload,
  Eye,
  ChevronRight,
  ChevronDown,
  Search,
  Calendar,
  Loader2,
  ListChecks,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface AssignmentRow {
  id: string;
  name: string;
  typeTag: string;
  course: string;
  dueDate: string;
  status: "PENDING" | "SUBMITTED" | "EVALUATED";
  grade: string;
  fileUrl?: string;
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [metrics, setMetrics] = useState({ totalAssigned: 0, pendingCount: 0, completedCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const fetchStudentAssignments = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest("/student/assignments");
      if (res?.data) {
        const list = Array.isArray(res.data.assignments) ? res.data.assignments : [];
        setAssignments(list);
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        } else {
          setMetrics({
            totalAssigned: list.length,
            pendingCount: list.filter((a: any) => a.status === "PENDING").length,
            completedCount: list.filter((a: any) => a.status !== "PENDING").length,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch student assignments from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentAssignments();
  }, []);

  const coursesList = useMemo(() => {
    const set = new Set<string>();
    assignments.forEach((a) => {
      if (a.course) set.add(a.course);
    });
    return Array.from(set);
  }, [assignments]);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch =
        !searchTerm ||
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.typeTag?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse =
        courseFilter === "All Courses" || a.course?.toUpperCase() === courseFilter.toUpperCase();

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Pending" && a.status === "PENDING") ||
        (statusFilter === "Submitted" && a.status === "SUBMITTED") ||
        (statusFilter === "Evaluated" && a.status === "EVALUATED");

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [assignments, searchTerm, courseFilter, statusFilter]);

  return (
    <div className="w-full space-y-8 font-sans pb-16 text-slate-800">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Track your progress and upcoming dance &amp; music assessments.
          </p>
        </div>

        <div className="shrink-0">
          <span className="px-4 py-2 rounded-full bg-[#F5ECF0] text-[#8C2329] border border-rose-100/80 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#8C2329]" /> Term 2: Oct - Dec 2024
          </span>
        </div>
      </div>

      {/* TOP 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Assigned */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5B60E4] flex items-center justify-center shrink-0">
            <ListChecks className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-600 block">Total Assigned</span>
            <div className="mt-1 flex items-baseline">
              <span className="text-3xl font-extrabold text-slate-900">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.totalAssigned}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">
                ITEMS
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Submissions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#FFF2EB] text-[#E06D44] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-600 block">Pending Submissions</span>
            <div className="mt-1 flex items-baseline">
              <span className="text-3xl font-extrabold text-slate-900">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.pendingCount}
              </span>
              <span className="text-[10px] font-bold text-[#E06D44] uppercase tracking-wider ml-2">
                URGENT
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#E8F4FE] text-[#2980B9] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-600 block">Completed</span>
            <div className="mt-1 flex items-baseline">
              <span className="text-3xl font-extrabold text-slate-900">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.completedCount}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">
                ACHIEVED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assignment names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-[#8C2329] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
          />
        </div>

        {/* Course Filter Dropdown */}
        <div className="relative w-full sm:w-auto min-w-[160px]">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-[#8C2329] rounded-xl pl-4 pr-9 py-2.5 text-xs font-semibold text-slate-700 appearance-none focus:outline-none transition-colors shadow-2xs cursor-pointer"
          >
            <option value="All Courses">All Courses</option>
            {coursesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative w-full sm:w-auto min-w-[160px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-[#8C2329] rounded-xl pl-4 pr-9 py-2.5 text-xs font-semibold text-slate-700 appearance-none focus:outline-none transition-colors shadow-2xs cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Evaluated">Evaluated</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* ASSIGNMENTS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#EEF2FF] border-b border-slate-200/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">ASSIGNMENT NAME</th>
                <th className="py-3.5 px-5">COURSE</th>
                <th className="py-3.5 px-5">DUE DATE</th>
                <th className="py-3.5 px-5">STATUS</th>
                <th className="py-3.5 px-5">GRADE</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#8C2329]" />
                      <span>Loading your assignments...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* ASSIGNMENT NAME */}
                    <td className="py-4 px-5">
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{item.name}</span>
                        <span className="text-xs text-slate-400 font-normal mt-0.5 block">{item.typeTag}</span>
                      </div>
                    </td>

                    {/* COURSE */}
                    <td className="py-4 px-5">
                      <span className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/60 text-[10px] font-bold uppercase tracking-wider inline-block">
                        {item.course}
                      </span>
                    </td>

                    {/* DUE DATE */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        {item.status === "PENDING" ? (
                          <Clock className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{item.dueDate}</span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-5">
                      {item.status === "PENDING" && (
                        <span className="px-3 py-1 rounded-full bg-[#FDEAE2] text-[#C15C3D] text-xs font-bold inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C15C3D]"></span>
                          PENDING
                        </span>
                      )}
                      {item.status === "SUBMITTED" && (
                        <span className="px-3 py-1 rounded-full bg-[#E5F2FF] text-[#2B78C5] text-xs font-bold inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2B78C5]"></span>
                          SUBMITTED
                        </span>
                      )}
                      {item.status === "EVALUATED" && (
                        <span className="px-3 py-1 rounded-full bg-[#E6F7ED] text-[#22A05B] text-xs font-bold inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22A05B]"></span>
                          EVALUATED
                        </span>
                      )}
                    </td>

                    {/* GRADE */}
                    <td className="py-4 px-5">
                      {item.status === "SUBMITTED" && (!item.grade || item.grade === "—") ? (
                        <span className="text-slate-500 font-medium text-xs italic">Reviewing</span>
                      ) : item.grade && item.grade !== "—" ? (
                        <span className="font-extrabold text-slate-900 text-sm">{item.grade}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-5 text-right">
                      {item.status === "PENDING" ? (
                        <Link
                          href={`/student/assignments/upload?id=${item.id}`}
                          className="px-4 py-2 rounded-xl bg-[#8C2329] hover:bg-[#721c21] text-white text-xs font-bold shadow-2xs inline-flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                        </Link>
                      ) : item.status === "SUBMITTED" ? (
                        <Link
                          href={`/student/assignments/view?id=${item.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer inline-flex items-center justify-center transition-colors"
                          title="View Submission"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link
                          href={`/student/assignments/view?id=${item.id}`}
                          className="p-2 rounded-lg text-[#8C2329] hover:bg-rose-50 cursor-pointer inline-flex items-center justify-center transition-colors"
                          title="View Evaluation & Grade"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    No assignments found for your account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
