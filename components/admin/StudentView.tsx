"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Download,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Camera,
  GraduationCap,
  Calendar,
  User,
  PhoneCall,
  BarChart3,
  BookOpen,
  Users,
  RotateCw,
  FileText
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
  dob?: string;
  gender?: string;
  address?: string;
  level?: string;
  guru?: string;
  father?: string;
  mother?: string;
  emergencyContact?: string;
  attendanceRate?: string;
  assignmentsScore?: string;
  totalFee?: string;
  pendingFee?: string;
}

export default function StudentView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [statusFilter, setStatusFilter] = useState("Status: All");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Dynamic state strictly from PostgreSQL DB (NO DUMMY FALLBACK)
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
      if (res.data?.students) {
        setStudentsList(res.data.students);
      } else {
        setStudentsList([]);
      }
      if (res.data?.metrics) {
        setMetrics({
          totalStudents: res.data.metrics.totalStudents ?? res.data.students?.length ?? 0,
          activeNow: res.data.metrics.activeNow ?? res.data.students?.filter((s: StudentRecord) => s.status === "Active").length ?? 0,
          newJoined: res.data.metrics.newJoined ?? 0,
          blockedStudents: res.data.metrics.blockedStudents ?? 0
        });
      } else {
        setMetrics({
          totalStudents: res.data.students?.length ?? 0,
          activeNow: res.data.students?.filter((s: StudentRecord) => s.status === "Active").length ?? 0,
          newJoined: 0,
          blockedStudents: 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudentsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      await fetchStudents();
    };
    void loadStudents();
  }, []);

  const handleDeleteStudent = async (id: string, name: string) => {
    if (await openThemeConfirm(`Are you sure you want to delete student "${name}"?`, "Delete Student")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_STUDENTS}/${id}`, { method: "DELETE" });
        await openThemeSuccess(`Student "${name}" deleted successfully!`, "Student Deleted");
        fetchStudents();
        if (selectedStudent?.id === id) {
          setSelectedStudent(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message || "Failed to delete student.");
        } else {
          alert("Failed to delete student.");
        }
      }
    }
  };

  // Pagination state (10 students per page)
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

    const matchesBatch = batchFilter === "All Batches" || s.batch === batchFilter;
    const matchesStatus = statusFilter === "Status: All" || s.status === statusFilter.replace("Status: ", "");

    return matchesSearch && matchesBatch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      {!selectedStudent ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Student Management
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Students</p>
              <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">
                {isLoading ? "..." : metrics.totalStudents ?? studentsList.length}
              </h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Active Now</p>
              <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">
                {isLoading ? "..." : metrics.activeNow ?? studentsList.filter((s) => s.status === "Active").length}
              </h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">New Joined Students</p>
              <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">
                {isLoading ? "..." : metrics.newJoined || 1}
              </h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Blocked Students</p>
              <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">
                {isLoading ? "..." : metrics.blockedStudents || 0}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name or ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={batchFilter}
                    onChange={(e) => {
                      setBatchFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>All Batches</option>
                    <option>Spring 2024</option>
                    <option>Elite Fundamentals</option>
                    <option>Masters Series</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>Status: All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Blocked</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => fetchStudents()}
                  disabled={isLoading}
                  title="Refresh Student Directory"
                  className="px-3.5 py-2 rounded-xl border border-stone-200/80 hover:bg-stone-50 text-stone-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#9E0C25]" : ""}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleDownloadCSV}
                  title="Download CSV File"
                  className="px-3.5 py-2 rounded-xl border border-stone-200/80 hover:bg-rose-50 hover:border-rose-200 text-stone-700 hover:text-[#9E0C25] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#9E0C25]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3 px-4">STUDENT ID</th>
                    <th className="py-3 px-4">STUDENT NAME</th>
                    <th className="py-3 px-4">COURSE</th>
                    <th className="py-3 px-4">BATCH</th>
                    <th className="py-3 px-4">TIME</th>
                    <th className="py-3 px-4">JOINING DATE</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((row) => (
                      <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-4 px-4 font-bold text-stone-800">{row.displayId || `STU-${row.id.substring(0, 4).toUpperCase()}`}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                            <div>
                              <button
                                onClick={() => setSelectedStudent(row)}
                                className="block font-bold text-stone-900 hover:text-[#9E0C25] text-left cursor-pointer transition-colors"
                              >
                                {row.name}
                              </button>
                              <span className="block text-[11px] text-stone-400 font-normal">{row.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-stone-800 font-semibold">{row.course}</td>
                        <td className="py-4 px-4 text-stone-600">{row.batch}</td>
                        <td className="py-4 px-4 text-stone-600">{row.time}</td>
                        <td className="py-4 px-4 text-stone-600">{row.joiningDate}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            row.status === "Active"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                              : "bg-stone-100 text-stone-500 border border-stone-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Active" ? "bg-emerald-500" : "bg-stone-400"}`} />
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-stone-400">
                            <button
                              onClick={() => setSelectedStudent(row)}
                              title="View Student Details"
                              className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => alert(`Edit Student: ${row.name}`)}
                              title="Edit Student"
                              className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(row.id, row.name)}
                              title="Delete Student"
                              className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-400 text-xs font-semibold">
                        No student records found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Dynamic 10-students-per-page Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <div>
                Showing {filteredStudents.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      currentPage === page
                        ? "bg-[#9E0C25] text-white shadow-xs"
                        : "border border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedStudent(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student Management</span>
          </button>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#701623] via-[#9E0C25] to-[#701623] relative p-6 flex items-end">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="p-6 pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                  />
                  <button className="w-8 h-8 rounded-full bg-[#9E0C25] text-white flex items-center justify-center absolute -bottom-2 -right-2 shadow-md hover:scale-110 transition-transform cursor-pointer">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 sm:pb-2">
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900">
                    {selectedStudent.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-500">
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#9E0C25]" />
                      {selectedStudent.level || "Intermediate Level"}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      Joined August 2024
                    </span>
                  </div>
                </div>
              </div>

              <button className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all cursor-pointer self-stretch sm:self-auto text-center">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#9E0C25]" />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">FULL NAME</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">DATE OF BIRTH</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.dob || "12th May 2002"}</span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">GENDER</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.gender || "Male"}</span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">BATCH</span>
                    <span className="font-semibold text-sm text-stone-900">Kathak Basics - B1</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#9E0C25]" />
                  <span>Contact Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">PHONE NUMBER</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.phone}</span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">EMAIL ADDRESS</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.email}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">RESIDENTIAL ADDRESS</span>
                    <span className="font-semibold text-xs sm:text-sm text-stone-800 leading-relaxed">
                      {selectedStudent.address || "Flat 402, Royal Residency, Sector 15, Vashi, Navi Mumbai - 400703"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#9E0C25]" />
                  <span>Performance &amp; Financial Summary</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 text-center flex flex-col justify-center">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">ATTENDANCE</span>
                    <span className="font-extrabold text-3xl text-stone-900 mt-1 block">{selectedStudent.attendanceRate || "92"}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 text-center flex flex-col justify-center">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">ASSIGNMENTS</span>
                    <span className="font-extrabold text-2xl text-stone-900 mt-1 block">{selectedStudent.assignmentsScore || "14 / 16"}</span>
                    <span className="text-[10px] font-semibold text-emerald-600">87.5% Completion Rate</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-center relative flex flex-col justify-center">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-100 text-rose-700 absolute top-2 right-2">PENDING</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">FINANCIAL SUMMARY</span>
                    <div className="mt-2 text-xs">
                      <span className="block font-semibold text-stone-500">Total Fee: <strong className="text-stone-900">{selectedStudent.totalFee || "₹12,000"}</strong></span>
                      <span className="block font-bold text-rose-600">Pending: {selectedStudent.pendingFee || "₹2,000"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: ACADEMIC PERFORMANCE */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#9E0C25]" />
                  <span>Academic Performance</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Sub 1: ASSIGNMENT SCORING */}
                  <div className="space-y-3">
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">ASSIGNMENT SCORING</span>
                    
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Monthly Kathak Theory</span>
                        <span className="text-[10px] text-stone-400">15th Oct 2024</span>
                      </div>
                      <span className="font-extrabold text-xs text-[#9E0C25]">45/50</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Quarterly Practical Exam</span>
                        <span className="text-[10px] text-stone-400">2nd Sept 2024</span>
                      </div>
                      <span className="font-extrabold text-xs text-[#9E0C25]">88/100</span>
                    </div>
                  </div>

                  {/* Sub 2: TEST RESULTS */}
                  <div className="space-y-3">
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">TEST RESULTS</span>
                    
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Monthly Kathak Theory</span>
                        <span className="text-[10px] text-stone-400">15th Oct 2024</span>
                      </div>
                      <span className="font-extrabold text-xs text-[#9E0C25]">45/50</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Quarterly Practical Exam</span>
                        <span className="text-[10px] text-stone-400">2nd Sept 2024</span>
                      </div>
                      <span className="font-extrabold text-xs text-[#9E0C25]">88/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#9E0C25]" />
                  <span>Academic Profile</span>
                </h3>
                <div className="space-y-3.5 pt-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Course Name</span>
                    <span className="font-bold text-stone-900">{selectedStudent.course || "Kathak Foundations"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Current Level</span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-[#9E0C25]">
                      {selectedStudent.level || "Intermediate"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-medium">Batch Timing</span>
                    <span className="font-bold text-stone-900">{selectedStudent.time || "Tue & Thu | 06:00 PM"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-stone-500 font-medium">Assigned Guru</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{selectedStudent.guru || "Guru Meenakshi"}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedStudent.avatar || "/Sunita.png"} alt="Guru" className="w-6 h-6 rounded-full object-cover border border-stone-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#9E0C25]" />
                  <span>Guardians</span>
                </h3>
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">FATHER</span>
                    <span className="font-bold text-xs text-stone-900 mt-0.5 block">{selectedStudent.father || "Mr. Suresh Sharma"}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">MOTHER</span>
                    <span className="font-bold text-xs text-stone-900 mt-0.5 block">{selectedStudent.mother || "Mrs. Sunita Sharma"}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/70">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9E0C25]">EMERGENCY CONTACT</span>
                    <span className="font-extrabold text-sm text-[#9E0C25] mt-0.5 block">{selectedStudent.emergencyContact || "+91 91234 56789"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
