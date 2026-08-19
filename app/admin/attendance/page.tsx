"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  CalendarX, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Download, 
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { toast } from "react-hot-toast";

// --- TYPES & INTERFACES ---
interface Batch {
  id: string;
  name: string;
  createdAt?: string;
}

interface AttendanceRecord {
  id: string;         
  name: string;       
  email: string;
  attendanceId: string | null;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | null;
  remarks: string;
  type: "STUDENT" | "TEACHER";
}

interface RawStudentAttendance {
  studentId: string;
  studentName: string;
  email: string;
  attendanceId: string | null;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | null;
  remarks: string;
}

interface RawTeacherAttendance {
  teacherId: string;
  teacherName: string;
  email: string;
  attendanceId: string | null;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | null;
  remarks: string;
}

// 🚀 FIX: Interface for the 10 Days Report (Removed 'any')
interface ReportAttendanceRecord {
  studentId: string;
  studentName: string;
  batchName: string;
  session: string;
  date: string;
  status: string | null;
  remarks: string | null;
}

export default function AttendanceManagementPage() {
  const [activeTab, setActiveTab] = useState<"STUDENTS" | "TEACHERS">("STUDENTS");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isExporting10Days, setIsExporting10Days] = useState(false);

  // Helper for strictly getting local today's date in YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return (new Date(today.getTime() - offset)).toISOString().split("T")[0];
  };

  const [todayDate] = useState(getTodayString());

  // Filters State
  const [selectedDate, setSelectedDate] = useState(todayDate); 
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState("Morning Session");

  const [showExportModal, setShowExportModal] = useState(false);
const [exportStart, setExportStart] = useState("");
const [exportEnd, setExportEnd] = useState("");

  // Fetch Batches for Dropdown 
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await apiRequest<{ data: { batches: Batch[] } }>(ENDPOINTS.BATCHES);
        const batchList = res?.data?.batches || [];
        setBatches(batchList);
        if (batchList.length > 0) {
          setSelectedBatch(batchList[0].id);
        }
      } catch (error) {
        toast.error("Failed to load batches");
      }
    };
    fetchBatches();
  }, []);

  // 1. Safe Fallback Date
  const getDynamicFallbackDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split("T")[0];
  };

  const selectedBatchData = batches.find(b => b.id === selectedBatch);

  // 2. Find Oldest Batch Date
  const oldestBatchDate = batches.length > 0 
    ? batches.reduce((oldest, b) => {
        if (!b.createdAt) return oldest;
        return b.createdAt < oldest ? b.createdAt : oldest;
      }, batches[0]?.createdAt || getDynamicFallbackDate()).split("T")[0]
    : getDynamicFallbackDate();

  // 3. Set Minimum Allowed Date dynamically
  const minAllowedDate = (activeTab === "STUDENTS" && selectedBatchData?.createdAt) 
    ? selectedBatchData.createdAt.split("T")[0] 
    : oldestBatchDate;

  // Fetch Attendance 
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setRecords([]); 
    
    try {
      if (activeTab === "STUDENTS") {
        if (!selectedBatch) return; 
        
        const res = await apiRequest<{ data: RawStudentAttendance[] }>(
          `${ENDPOINTS.ATTENDANCE_BATCH}?batchId=${selectedBatch}&date=${selectedDate}&session=${selectedSession}`
        );
        
        const normalized = res.data.map(item => ({
          id: item.studentId,
          name: item.studentName,
          email: item.email,
          attendanceId: item.attendanceId,
          status: item.status,
          remarks: item.remarks,
          type: "STUDENT" as const
        }));
        setRecords(normalized);
        
      } else {
        const res = await apiRequest<{ data: RawTeacherAttendance[] }>(
          `${ENDPOINTS.ATTENDANCE_TEACHERS}?date=${selectedDate}`
        );
        
        const normalized = res.data.map(item => ({
          id: item.teacherId,
          name: item.teacherName,
          email: item.email,
          attendanceId: item.attendanceId,
          status: item.status,
          remarks: item.remarks,
          type: "TEACHER" as const
        }));
        setRecords(normalized);
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab.toLowerCase()} attendance`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedBatch, selectedDate, selectedSession]);

  // Handle cascading render
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchAttendance();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchAttendance]);

  // Handle status toggle locally
  const handleStatusChange = (id: string, newStatus: "PRESENT" | "ABSENT" | "LATE" | "LEAVE") => {
    setRecords(prev => prev.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));
  };

  const handleCustomExport = async () => {
    if (!exportStart || !exportEnd) return toast.error("Please select both dates");
    setIsExporting10Days(true);
    try {
      let url = `/attendance/report?startDate=${exportStart}&endDate=${exportEnd}&type=${activeTab}`;
      if (activeTab === "STUDENTS" && selectedBatch) url += `&batchId=${selectedBatch}`;

      const res = await apiRequest<{ data: ReportAttendanceRecord[] }>(url);
      
      if (!res.data || res.data.length === 0) {
        toast.error("No records found in this date range.");
        return;
      }

      const headers = ["User ID", "Name", "Role/Batch", "Date", "Session", "Status", "Remarks"];
      const csvRows = [headers.join(",")];

      res.data.forEach(r => {
        const safeDate = `"'${r.date.split("T")[0]}"`; 
        csvRows.push([r.studentId, `"${r.studentName}"`, `"${r.batchName}"`, safeDate, r.session, r.status || "UNMARKED", `"${r.remarks || ""}"`].join(","));
      });

      downloadCSVFile(csvRows, `Attendance_${exportStart}_to_${exportEnd}.csv`);
      toast.success("Report downloaded successfully!");
      setShowExportModal(false);
    } catch (error) {
      toast.error("Failed to generate report.");
    } finally {
      setIsExporting10Days(false);
    }
  };

  // 🚀 Reusable CSV Downloader
  const downloadCSVFile = (csvRows: string[], filename: string) => {
    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // 🚀 EXPORT 1: Current Screen Export (Fixed Unused Variable Warning)
  const handleExportCSV = () => {
    if (records.length === 0) return toast.error("No records available to export");
    const roleName = activeTab === "STUDENTS" ? (selectedBatchData?.name || "General Batch") : "Faculty/Staff";
    
    // Formatting date to DD-MMM-YYYY (e.g. 19-Aug-2026) to fix Excel ######## issue
    const displayDate = new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

    const headers = ["User ID", "Name", "Role/Batch", "Date", "Session", "Status", "Remarks"];
    const csvRows = [headers.join(",")];

    records.forEach(r => {
      csvRows.push([r.id, `"${r.name}"`, `"${roleName}"`, displayDate, selectedSession, r.status || "UNMARKED", `"${r.remarks || ""}"`].join(","));
    });

    downloadCSVFile(csvRows, `Attendance_${activeTab}_${displayDate}.csv`);
    toast.success("File downloaded successfully!");
  };

  // 🚀 EXPORT 2: Last 10 Days Export (Fixed 'any' Type Warning)
  const handleExportLast10Days = async () => {
    setIsExporting10Days(true);
    try {
      const today = new Date();
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(today.getDate() - 10);

      const endDateStr = today.toISOString().split("T")[0];
      const startDateStr = tenDaysAgo.toISOString().split("T")[0];
      
      let url = `/attendance/report?startDate=${startDateStr}&endDate=${endDateStr}&type=${activeTab}`;
      if (activeTab === "STUDENTS" && selectedBatch) {
        url += `&batchId=${selectedBatch}`;
      }

      // Replaced 'any' with ReportAttendanceRecord
      const res = await apiRequest<{ data: ReportAttendanceRecord[] }>(url);
      
      if (!res.data || res.data.length === 0) {
        toast.error("No records found in the last 10 days");
        setIsExporting10Days(false);
        return;
      }

      const headers = ["User ID", "Name", "Role/Batch", "Date", "Session", "Status", "Remarks"];
      const csvRows = [headers.join(",")];

      res.data.forEach(r => {
        // Safe formatted date
        const safeDate = new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
        csvRows.push([r.studentId, `"${r.studentName}"`, `"${r.batchName}"`, safeDate, r.session, r.status || "UNMARKED", `"${r.remarks || ""}"`].join(","));
      });

      downloadCSVFile(csvRows, `Attendance_10Days_${activeTab}.csv`);
      toast.success("Last 10 Days report downloaded!");
    } catch (error) {
      toast.error("Failed to fetch 10 days report");
    } finally {
      setIsExporting10Days(false);
    }
  };

  // Save Bulk Attendance to Backend
  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      let batchId = null;
      let batchName = "Teacher/Staff";

      if (activeTab === "STUDENTS") {
        batchId = selectedBatch;
        batchName = batches.find(b => b.id === selectedBatch)?.name || "General Batch";
      }
      
      const payload = {
        date: selectedDate,
        session: selectedSession,
        batchId: batchId,
        batchName: batchName,
        records: records.map(r => ({
          userId: r.id,
          userName: r.name,
          status: r.status,
          remarks: r.remarks
        }))
      };

      await apiRequest(ENDPOINTS.ATTENDANCE_BULK_SAVE, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      toast.success(`${activeTab === "STUDENTS" ? "Student" : "Teacher"} attendance saved!`);
      fetchAttendance(); 
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Statistics
  const totalCount = records.length;
  const presentCount = records.filter(r => r.status === "PRESENT").length;
  const absentCount = records.filter(r => r.status === "ABSENT").length;
  const leaveCount = records.filter(r => r.status === "LEAVE").length;

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#Fdf5f5] p-6 lg:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* --- HEADER & TABS --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-[24px] font-bold text-[#0B1C30]">Attendance Management</h1>
            <p className="text-sm font-semibold text-stone-500 mt-1">Track presence for students and teaching staff</p>
          </div>

          <div className="flex items-center bg-stone-200/50 p-1.5 rounded-xl border border-stone-200 w-full sm:w-max">
            <button 
              onClick={() => setActiveTab("STUDENTS")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "STUDENTS" ? 'bg-white text-[#9B3434] shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <GraduationCap className="w-4 h-4" /> Students
            </button>
            <button 
              onClick={() => setActiveTab("TEACHERS")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "TEACHERS" ? 'bg-white text-[#9B3434] shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <Briefcase className="w-4 h-4" /> Teachers
            </button>
          </div>
        </div>

        {/* --- DYNAMIC STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={`Total ${activeTab === "STUDENTS" ? "Students" : "Teachers"}`} value={totalCount.toString()} icon={<Users className="w-5 h-5 text-indigo-500" />} bg="bg-indigo-50" />
          <StatCard title="Present Today" value={presentCount.toString()} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} bg="bg-emerald-50" />
          <StatCard title="Absent" value={absentCount.toString()} icon={<XCircle className="w-5 h-5 text-red-500" />} bg="bg-red-50" />
          <StatCard title="Leave Requests" value={leaveCount.toString()} icon={<CalendarX className="w-5 h-5 text-amber-500" />} bg="bg-amber-50" />
        </div>

        {/* --- DYNAMIC FILTERS --- */}
        <div className="flex flex-wrap gap-4 items-center bg-white p-2 rounded-2xl shadow-sm border border-stone-200 inline-flex">
          
          <div className="relative flex items-center gap-2 px-3 py-1.5 border-r border-stone-200">
            <CalendarIcon className="w-4 h-4 text-[#9B3434]" />
            <input 
              type="date" 
              value={selectedDate}
              max={todayDate} 
              min={minAllowedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#0B1C30] outline-none cursor-pointer"
            />
          </div>

          {activeTab === "STUDENTS" && (
            <div className="relative flex items-center px-3 py-1.5 border-r border-stone-200">
              <select 
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#0B1C30] outline-none cursor-pointer appearance-none pr-6"
              >
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2 pointer-events-none" />
            </div>
          )}

          <div className="relative flex items-center px-3 py-1.5">
            <select 
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#0B1C30] outline-none cursor-pointer appearance-none pr-6"
            >
              <option value="Morning Session">Morning Session</option>
              <option value="Evening Session">Evening Session</option>
              <option value="General">General</option>
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2 pointer-events-none" />
          </div>

        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: ATTENDANCE LIST */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-[0_0_8px_rgba(0,0,0,0.04)] border border-stone-100 flex flex-col min-h-[500px]">
            
            <div className="p-6 flex flex-wrap gap-4 items-center justify-between border-b border-stone-100">
              <h2 className="text-lg font-bold text-[#0B1C30]">
                {selectedDate === todayDate ? "Today's " : "Past "} {activeTab === "STUDENTS" ? "Student" : "Teacher"} Roster
              </h2>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExportLast10Days}
                  disabled={isExporting10Days}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-sm font-bold transition-all"
                >
                  {isExporting10Days ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                  Last 10 Days
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-xl text-sm font-bold transition-all"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button 
                  onClick={handleSaveAttendance}
                  disabled={saving || records.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#9B3434] hover:bg-[#832A2A] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-md"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#9B3434]" />
                </div>
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-stone-400">
                  <Users className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-bold">No records found for this date.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50">
                      <th className="py-4 px-6 text-[12px] font-bold text-stone-500 uppercase tracking-wider w-[40%]">
                        {activeTab === "STUDENTS" ? "Student Name" : "Teacher Name"}
                      </th>
                      <th className="py-4 px-6 text-[12px] font-bold text-stone-500 uppercase tracking-wider w-[30%]">
                        {activeTab === "STUDENTS" ? "Batch" : "Role"}
                      </th>
                      <th className="py-4 px-6 text-[12px] font-bold text-stone-500 uppercase tracking-wider w-[30%] text-right pr-12">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {records.map((record) => (
                      <tr key={record.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                              {getInitials(record.name)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#0B1C30]">{record.name}</p>
                              <p className="text-[11px] font-semibold text-stone-400 mt-0.5">ID: {record.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-stone-700">
                            {activeTab === "STUDENTS" 
                              ? (batches.find(b => b.id === selectedBatch)?.name || "General") 
                              : "Faculty / Staff"}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 justify-end">
                            <StatusButton label="P" activeBg="bg-emerald-500" isActive={record.status === "PRESENT"} onClick={() => handleStatusChange(record.id, "PRESENT")} />
                            <StatusButton label="A" activeBg="bg-red-600" isActive={record.status === "ABSENT"} onClick={() => handleStatusChange(record.id, "ABSENT")} />
                            <StatusButton label="L" activeBg="bg-amber-500" isActive={record.status === "LATE"} onClick={() => handleStatusChange(record.id, "LATE")} />
                            <StatusButton label="LV" activeBg="bg-stone-400" isActive={record.status === "LEAVE"} onClick={() => handleStatusChange(record.id, "LEAVE")} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Placeholder */}
            <div className="p-6 flex items-center justify-between border-t border-stone-100 mt-auto">
              <span className="text-xs font-semibold text-stone-500">Showing {records.length} records</span>
              <div className="flex items-center gap-1.5">
                <PaginationButton icon={<ChevronLeft className="w-4 h-4" />} />
                <PaginationButton label="1" active />
                <PaginationButton icon={<ChevronRight className="w-4 h-4" />} />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: CALENDAR OVERVIEW */}
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-[0_0_8px_rgba(0,0,0,0.04)] border border-stone-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#9B3434]" />
                  <h3 className="font-bold text-[#0B1C30]">Overview</h3>
                </div>
              </div>
              <p className="text-sm text-stone-500 font-medium leading-relaxed">
                Future dates are strictly disabled to prevent invalid attendance entry. If a student was enrolled after the start of a batch, ensure their record reflects their actual join date.
              </p>
              
              <div className="mt-8 pt-6 border-t border-stone-100">
                <div className="flex justify-between text-[13px] font-bold mb-2">
                  <span className="text-[#0B1C30]">Overall Attendance Rate</span>
                  <span className="text-emerald-500">{totalCount ? Math.round((presentCount/totalCount)*100) : 0}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${totalCount ? (presentCount/totalCount)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon, bg }: { title: string; value: string; icon: React.ReactNode; bg: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} mb-4`}>
        {icon}
      </div>
      <p className="text-[13px] font-bold text-stone-500 mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-[#0B1C30]">{value}</h3>
    </div>
  );
}

function StatusButton({ label, activeBg, isActive, onClick }: { label: string; activeBg: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center
        ${isActive ? `${activeBg} text-white border-transparent shadow-md scale-105` : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'}
      `}
    >
      {label}
    </button>
  );
}

function PaginationButton({ label, icon, active }: { label?: string; icon?: React.ReactNode; active?: boolean }) {
  return (
    <button className={`
      w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold transition-colors
      ${active ? 'bg-[#9B3434] text-white' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'}
    `}>
      {label || icon}
    </button>
  );
}