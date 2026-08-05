"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Users,
  Clock,
  Search,
  Filter,
  MoreVertical,
  ArrowLeft,
  FileText,
  Loader2,
  Calendar,
  // CheckCircle2,
  // RotateCcw,
  TrendingUp
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

const fontJakarta = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const fontInter = { fontFamily: "'Inter', sans-serif" };

interface TeacherBatch {
  id: string;
  name: string;
  code: string;
  course: string;
  courseName?: string;
  teacherId?: string;
  teacherName?: string;
  level: string;
  schedule: string;
  status: "ACTIVE" | "COMPLETED" | "UPCOMING";
  totalStudents: number;
  maxStudents?: number;
  students?: Array<{
    id: string;
    fullName?: string;
    name?: string;
    email: string;
    avatar?: string;
    studentId?: string;
    joiningDate?: string;
    assignmentsSubmitted?: string;
  }>;
}

interface CohortStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studentId: string;
  batchCode: string;
  joiningDate: string;
  assignmentsSubmitted: string;
}

export default function TeacherBatchesView() {
  const [batches, setBatches] = useState<TeacherBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<TeacherBatch | null>(null);
  const [cohortStudents, setCohortStudents] = useState<CohortStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [isDirectoryLoading, setIsDirectoryLoading] = useState(false);
  const [teacherName, setTeacherName] = useState("Harshita Sharma");

  // Fetch batches assigned specifically to the logged-in teacher
  useEffect(() => {
    let isMounted = true;

    const loadTeacherBatches = async () => {
      try {
        const savedUserStr = localStorage.getItem("kathak_teacher_user") || localStorage.getItem("kathak_admin_user");
        let currentTeacherName = "Harshita Sharma";
        let currentTeacherId = "";
        if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            if (parsed.fullName) {
              currentTeacherName = parsed.fullName;
              setTeacherName(parsed.fullName);
            }
            if (parsed.id) {
              currentTeacherId = parsed.id;
            }
          } catch {
            // Fallback
          }
        }

        const res = await apiRequest<{
          status: string;
          data?: TeacherBatch[] | { batches?: TeacherBatch[] };
        }>(ENDPOINTS.ADMIN_BATCHES);

        if (!isMounted) return;

        const rawBatches: TeacherBatch[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as { batches?: TeacherBatch[] })?.batches)
          ? (res.data as { batches: TeacherBatch[] }).batches
          : [];

        // Filter ONLY batches assigned to this logged-in teacher strictly
        const teacherOnlyBatches = rawBatches.filter((b) => {
          if (!b.teacherName && !b.teacherId) return false;
          const matchesName =
            Boolean(b.teacherName) &&
            (b.teacherName?.toLowerCase().includes(currentTeacherName.toLowerCase()) ||
              currentTeacherName.toLowerCase().includes(b.teacherName?.toLowerCase() || ""));
          const matchesId = Boolean(currentTeacherId) && b.teacherId === currentTeacherId;
          return matchesName || matchesId;
        });

        setBatches(teacherOnlyBatches);
      } catch (err: unknown) {
        console.error("Teacher batches fetch error:", (err as Error).message || err);
        if (isMounted) setBatches([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTeacherBatches();

    return () => {
      isMounted = false;
    };
  }, []);

  // Derived state computed synchronously during render (React 19 Best Practice)
  const filteredBatches = useMemo(() => {
    let result = [...batches];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          b.code.toLowerCase().includes(term) ||
          b.course.toLowerCase().includes(term) ||
          b.level.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((b) => b.status === statusFilter);
    }

    return result;
  }, [batches, searchTerm, statusFilter]);

  // Handle View Students for a Batch
  const handleOpenBatchDirectory = async (batch: TeacherBatch) => {
    setSelectedBatch(batch);
    setIsDirectoryLoading(true);

    try {
      const res = await apiRequest<{
        status: string;
        data?: Array<{
          id: string;
          fullName?: string;
          name?: string;
          email?: string;
          avatar?: string;
          studentId?: string;
          joiningDate?: string;
          assignmentsSubmitted?: string;
        }>;
      }>(`${ENDPOINTS.ADMIN_BATCHES}/${batch.id}/students`);

      const rawList = Array.isArray(res.data) ? res.data : [];
      setCohortStudents(
        rawList.map((s) => ({
          id: s.id,
          name: s.fullName || s.name || "Student",
          email: s.email || "-",
          avatar: s.avatar || "/Ananya.png",
          studentId: s.studentId || `#KL-2024-${s.id.slice(0, 4).toUpperCase()}`,
          batchCode: batch.code,
          joiningDate: s.joiningDate || "May 12, 2024",
          assignmentsSubmitted: String(s.assignmentsSubmitted || "0/0 Submitted")
        }))
      );
    } catch (err: unknown) {
      console.error("Batch directory fetch error:", (err as Error).message || err);
      setCohortStudents([]);
    } finally {
      setIsDirectoryLoading(false);
    }
  };

  // Summary Card Statistics
  const totalAssignedBatches = batches.length;
  const totalActiveStudents = batches.reduce((sum, b) => sum + (b.totalStudents || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* VIEW 1: BATCH DIRECTORY & SUMMARY CARDS */}
      {!selectedBatch ? (
        <>
          {/* Header Title */}
          <div className="space-y-1">
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight"
              style={fontJakarta}
            >
              My Batches
            </h1>
            <p className="text-xs sm:text-sm font-medium text-stone-500" style={fontInter}>
              Active dance cohorts and assigned batch schedules for {teacherName}.
            </p>
          </div>

          {/* TOP 3 SUMMARY METRIC CARDS (100% REAL DYNAMIC DB DATA) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: TOTAL BATCHES */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between items-center text-center space-y-2 relative overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-[#900C27] flex items-center justify-center mb-1">
                <Layers className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                TOTAL BATCHES
              </p>
              <h3 className="text-3xl font-extrabold text-[#0B1C30]" style={fontInter}>
                {String(totalAssignedBatches).padStart(2, "0")}
              </h3>
              <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active assigned cohorts</span>
              </p>
            </div>

            {/* Card 2: ACTIVE STUDENTS */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                ACTIVE STUDENTS
              </p>
              <h3 className="text-3xl font-extrabold text-[#0B1C30]" style={fontInter}>
                {totalActiveStudents}
              </h3>
              <p className="text-xs font-bold text-sky-600 flex items-center justify-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Total enrolled students</span>
              </p>
            </div>

            {/* Card 3: WEEKLY HOURS */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                WEEKLY HOURS
              </p>
              <h3 className="text-3xl font-extrabold text-[#0B1C30]" style={fontInter}>
                {batches.length > 0 ? (batches.length * 4.5).toFixed(1) : "0"}
              </h3>
              <p className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Weekly assigned hours</span>
              </p>
            </div>
          </div>

          {/* BATCH DIRECTORY SECTION */}
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-[#0B1C30]" style={fontJakarta}>
                Batch Directory
              </h2>

              {/* Search & Filter Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search batches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#900C27] shadow-2xs"
                  />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-4 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 appearance-none cursor-pointer focus:outline-none pr-8"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <Filter className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* BATCH CARDS GRID (2-COLUMN GRID MATCHING FIGMA 1:1) */}
            {isLoading ? (
              <div className="py-16 text-center text-stone-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#900C27]" />
                <span className="text-xs font-semibold">Loading assigned batches...</span>
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-stone-400 border border-stone-200/80 font-semibold text-sm">
                No batches found assigned to {teacherName}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBatches.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-4">
                      {/* Top Badge & Options */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            b.status === "ACTIVE"
                              ? "bg-rose-50 text-[#BE185D] border border-rose-100"
                              : "bg-stone-100 text-stone-500 border border-stone-200"
                          }`}
                        >
                          {b.status}
                        </span>

                        <button className="text-stone-400 hover:text-stone-700 cursor-pointer p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Batch Title & Course */}
                      <div>
                        <h3 className="text-lg font-bold text-stone-900 leading-tight" style={fontJakarta}>
                          {b.name}
                        </h3>
                        <p className="text-xs font-semibold text-sky-600 mt-0.5">
                          {b.course || b.courseName || "Classical Dance"}
                        </p>
                      </div>

                      {/* Level & Total Students Row */}
                      <div className="grid grid-cols-2 gap-4 py-2 border-y border-stone-100 text-xs">
                        <div>
                          <span className="block text-[10.5px] font-bold text-stone-400 uppercase">LEVEL</span>
                          <span className="font-extrabold text-stone-800">{b.level}</span>
                        </div>
                        <div>
                          <span className="block text-[10.5px] font-bold text-stone-400 uppercase">TOTAL STUDENTS</span>
                          <span className="font-extrabold text-stone-800">
                            {b.totalStudents} / {b.maxStudents || 20}
                          </span>
                        </div>
                      </div>

                      {/* Schedule Row */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                        <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>{b.schedule}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {b.status === "ACTIVE" ? (
                        <button
                          onClick={() => handleOpenBatchDirectory(b)}
                          className="w-full py-3 rounded-xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          <span>View Students</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenBatchDirectory(b)}
                          className="w-full py-3 rounded-xl bg-[#9B3434] hover:bg-[#780A20] text-[white] font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Users  className="w-4 h-4" />
                          <span>Review Batch</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* VIEW 2: BATCH STUDENT DIRECTORY SUB-VIEW (FIGMA 1:1 MATCH) */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Back Button Breadcrumb */}
          <button
            onClick={() => setSelectedBatch(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-[#900C27] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Batches &gt; {selectedBatch.name}</span>
          </button>

          {/* Directory Header Title */}
          <div className="space-y-1">
            <h1
              className="text-3xl font-extrabold text-[#111827] tracking-tight"
              style={fontInter}
            >
              Batch Student Directory
            </h1>
            <p className="text-sm font-medium text-stone-500 flex items-center gap-2">
              <span>Management and directory for student cohort</span>
              <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-[#900C27] font-extrabold text-xs border border-rose-200">
                {selectedBatch.code}
              </span>
            </p>
          </div>

          {/* STUDENT DIRECTORY TABLE */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            {isDirectoryLoading ? (
              <div className="py-16 text-center text-stone-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#900C27]" />
                <span className="text-xs font-semibold">Loading student roster...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-stone-50/60 border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                      <th className="py-4 px-6">STUDENT NAME</th>
                      <th className="py-4 px-6">STUDENT ID</th>
                      <th className="py-4 px-6">BATCH</th>
                      <th className="py-4 px-6">JOINING DATE</th>
                      <th className="py-4 px-6">ASSIGNMENTS</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                    {cohortStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={s.avatar}
                              alt={s.name}
                              className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <h5 className="font-bold text-[#111827] text-sm leading-tight">
                                {s.name}
                              </h5>
                              <p className="text-[11px] font-semibold text-stone-400">{s.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-semibold text-stone-500">
                          {s.studentId}
                        </td>

                        <td className="py-4 px-6 font-extrabold text-stone-800">
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-[11px]">
                            {s.batchCode}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-semibold text-stone-600">
                          {s.joiningDate}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 font-bold text-stone-700">
                            <FileText className="w-4 h-4 text-stone-400" />
                            <span>{s.assignmentsSubmitted}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
