"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Download,
  Eye,
  Pencil,
  Trash2,
  RotateCw
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess, openThemeConfirm } from "@/components/ThemeDialogProvider";

interface StudentRecord {
  id: string;
  displayId?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  course: string;
  batch: string;
  time: string;
  joiningDate: string;
  status: "Active" | "Inactive" | "Blocked";
}

export default function StudentsListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [statusFilter, setStatusFilter] = useState("Status: All");

  const [studentsList, setStudentsList] = useState<StudentRecord[]>([]);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    activeNow: 0,
    newJoined: 0,
    blockedStudents: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(ENDPOINTS.ADMIN_STUDENTS);
      const students = res.data?.students || [];
      setStudentsList(students);
      setMetrics({
        totalStudents: res.data?.metrics?.totalStudents ?? students.length,
        activeNow: res.data?.metrics?.activeNow ?? students.filter((s: StudentRecord) => s.status === "Active").length,
        newJoined: res.data?.metrics?.newJoined ?? 0,
        blockedStudents: res.data?.metrics?.blockedStudents ?? students.filter((s: StudentRecord) => s.status !== "Active").length
      });
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudentsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Defer fetching to avoid synchronous setState calls during effect execution
    const timer = setTimeout(() => {
      fetchStudents();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteStudent = async (id: string, name: string) => {
    if (await openThemeConfirm(`Are you sure you want to delete student "${name}"?`, "Delete Student")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_STUDENTS}/${id}`, { method: "DELETE" });
        await openThemeSuccess(`Student "${name}" deleted successfully!`, "Student Deleted");
        fetchStudents();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to delete student.");
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleDownloadCSV = async () => {
    if (filteredStudents.length === 0) {
      alert("No student data available to export.");
      return;
    }
    const headers = ["Student ID", "Full Name", "Email", "Phone", "Course", "Batch", "Joining Date", "Status"];
    const rows = filteredStudents.map((s) => [
      s.displayId || `STU-${s.id.substring(0, 4).toUpperCase()}`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email}"`,
      `"${s.phone || ""}"`,
      `"${s.course || ""}"`,
      `"${s.batch || ""}"`,
      `"${s.joiningDate || ""}"`,
      `"${s.status}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Kathak_Students_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await openThemeSuccess("Student directory exported successfully as CSV file!", "CSV Exported");
  };

  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.displayId && s.displayId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCourse = courseFilter === "All Courses" || s.course === courseFilter;
    const matchesBatch = batchFilter === "All Batches" || s.batch === batchFilter;
    const matchesStatus = statusFilter === "Status: All" || s.status === statusFilter.replace("Status: ", "");

    return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Extract unique courses and batches for dropdowns
  const uniqueCourses = Array.from(new Set(studentsList.map(s => s.course).filter(Boolean)));
  const uniqueBatches = Array.from(new Set(studentsList.map(s => s.batch).filter(Boolean)));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
          Student Management
        </h1>
        <p className="text-sm font-medium text-stone-500 max-w-xl">
          Monitor, update, and manage your entire student directory from here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">Total Students</p>
          <h3 className="font-sans font-black text-3xl text-stone-900 mt-1">{isLoading ? "..." : metrics.totalStudents}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">Active Now</p>
          <h3 className="font-sans font-black text-3xl text-emerald-600 mt-1">{isLoading ? "..." : metrics.activeNow}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">New Joined</p>
          <h3 className="font-sans font-black text-3xl text-stone-900 mt-1">{isLoading ? "..." : metrics.newJoined}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">Blocked / Inactive</p>
          <h3 className="font-sans font-black text-3xl text-rose-600 mt-1">{isLoading ? "..." : metrics.blockedStudents}</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-stone-200/80 shadow-lg shadow-stone-200/40 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative min-w-[200px] flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-bold text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#9E0C25] focus:ring-2 focus:ring-rose-500/10 transition-all"
              />
            </div>

            {/* Course Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                className="w-full h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-bold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none focus:border-[#9E0C25] transition-all"
              >
                <option>All Courses</option>
                {uniqueCourses.map(course => <option key={course} value={course}>{course}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Batch Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={batchFilter}
                onChange={(e) => { setBatchFilter(e.target.value); setCurrentPage(1); }}
                className="w-full h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-bold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none focus:border-[#9E0C25] transition-all"
              >
                <option>All Batches</option>
                {uniqueBatches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-bold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none focus:border-[#9E0C25] transition-all"
              >
                <option>Status: All</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Blocked</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end lg:self-center">
            <button
              onClick={() => fetchStudents()}
              disabled={isLoading}
              className="h-11 px-4 rounded-xl border border-stone-200/80 hover:bg-stone-50 text-stone-700 transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#9E0C25]" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="h-11 px-4 rounded-xl border border-stone-200/80 hover:bg-rose-50 hover:border-rose-200 text-stone-700 hover:text-[#9E0C25] transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#9E0C25]" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200/80">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500">
                <th className="py-4 px-5">STUDENT ID</th>
                <th className="py-4 px-5">STUDENT NAME</th>
                <th className="py-4 px-5">COURSE & BATCH</th>
                <th className="py-4 px-5">JOINING DATE</th>
                <th className="py-4 px-5">STATUS</th>
                <th className="py-4 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm font-medium text-stone-700 bg-white">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="py-4 px-5 font-bold text-stone-800 text-xs">
                        {row.displayId || `STU-${row.id.substring(0, 4).toUpperCase()}`}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <Image
                          src={row.avatar || "/Ananya.png"}
                          alt={row.name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 shadow-sm"
                        />
                        <div>
                          <button
                            onClick={() => router.push(`/admin/student/${row.id}`)}
                            className="block font-bold text-stone-900 group-hover:text-[#9E0C25] text-left cursor-pointer transition-colors"
                          >
                            {row.name}
                          </button>
                          <span className="block text-[11px] text-stone-400 font-semibold mt-0.5">{row.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                        <span className="block font-bold text-stone-800">{row.course || "—"}</span>
                        <span className="block text-[11px] text-stone-500 mt-0.5">{row.batch || "—"}</span>
                    </td>
                    <td className="py-4 px-5 text-stone-600 text-xs font-bold">{row.joiningDate || "—"}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        row.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Active" ? "bg-emerald-500" : "bg-stone-400"}`} />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-stone-400">
                        <button
                          onClick={() => router.push(`/admin/student/${row.id}`)}
                          title="View Details"
                          className="p-2 hover:text-[#9E0C25] hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/student/${row.id}/edit`)}
                          title="Edit Student"
                          className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(row.id, row.name)}
                          title="Delete Student"
                          className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center">
                              <Search className="w-6 h-6 text-stone-300" />
                          </div>
                          <p className="text-stone-500 font-bold text-sm">No students found matching your criteria.</p>
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-stone-500 font-bold">
          <div>
            Showing {filteredStudents.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-3 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg cursor-pointer transition-colors ${
                  currentPage === page ? "bg-[#9E0C25] text-white shadow-md" : "border border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}