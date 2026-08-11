"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess, openThemeConfirm } from "@/components/ThemeDialogProvider";

interface BatchRecord {
  id: string;
  name: string;
  code: string;
  course: string;
  courseName?: string;
  level: string;
  teacher?: string;
  teacherName?: string; 
  schedule: string;
  totalStudents: number;
  status: string;
}

interface BatchesApiResponse {
  data?: {
    batches?: BatchRecord[];
    metrics?: {
      activeBatches: number;
      totalStudents: number;
      completedBatches: number;
      batchesA: number;
      batchesB: number;
      batchesC: number;
    };
  };
}

const formatScheduleDisplay = (rawSchedule?: string) => {
  if (!rawSchedule) return "Not Scheduled";
  if (rawSchedule.includes("|")) {
    const parts = rawSchedule.split("|");
    return `${parts[0] || "Days"} (${parts[1] || "Time"})`;
  }
  return rawSchedule;
};

// 🔥 FIX: Auto-calculate status based on Start and End dates
const getDynamicStatus = (schedule?: string, dbStatus?: string) => {
  if (schedule && schedule.includes("|")) {
    const parts = schedule.split("|");
    const startDateStr = parts[2]; // Index 2 is Start Date
    const endDateStr = parts[3];   // Index 3 is End Date

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (startDateStr) {
      const start = new Date(startDateStr);
      start.setHours(0, 0, 0, 0);
      if (!isNaN(start.getTime()) && start > now) {
        return "Upcoming";
      }

      if (endDateStr) {
        const end = new Date(endDateStr);
        end.setHours(23, 59, 59, 999);
        if (!isNaN(end.getTime()) && now > end) {
          return "Completed";
        }
      }
      return "Active";
    }
  }
  
  // Fallback to database status if dates are missing
  if (!dbStatus) return "Active";
  const s = dbStatus.toUpperCase();
  return s === "ACTIVE" ? "Active" : s === "UPCOMING" ? "Upcoming" : "Completed";
};

export default function AdminBatchesListPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    activeBatches: 0,
    totalStudents: 0,
    completedBatches: 0,
  });

  const fetchBatchesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<BatchesApiResponse>(ENDPOINTS.ADMIN_BATCHES);
      if (res.data?.batches) setBatches(res.data.batches);
      if (res.data?.metrics) {
        setMetrics({
          activeBatches: res.data.metrics.activeBatches || 0,
          totalStudents: res.data.metrics.totalStudents || 0,
          completedBatches: res.data.metrics.completedBatches || 0,
        });
      }
    } catch (err: unknown) {
      console.error("Failed to fetch batches:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      await Promise.resolve();
      fetchBatchesData();
    };
    initFetch();
  }, [fetchBatchesData]);

  const handleDeleteBatch = async (id: string, name: string) => {
    if (await openThemeConfirm(`Delete batch "${name}"?`, "Delete Batch")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${id}`, { method: "DELETE" });
        openThemeSuccess(`Batch "${name}" deleted successfully.`, "Batch Deleted");
        fetchBatchesData();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete batch.";
        alert(errorMessage);
      }
    }
  };

  const handleQuickStatusChange = async (batchId: string, newStatus: string) => {
    try {
      await apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${batchId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      openThemeSuccess(`Batch status manually updated to "${newStatus}"!`, "Status Updated");
      fetchBatchesData();
    } catch (err: unknown) {
      alert("Failed to update status.");
    }
  };

  const filteredBatches = batches.filter((b) => {
    const teacherDisplayName = b.teacherName || b.teacher || ""; // Ensure search works for teacher
    const matchSearch = !searchQuery || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      teacherDisplayName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-extrabold text-2xl sm:text-3xl text-[#0B1C30] tracking-tight">Batch Management</h1>
        </div>
        <button onClick={() => router.push("/admin/batches/create")} className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 uppercase">
          <Plus className="w-4 h-4" />
          <span> Create New Batch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1">
          <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">ACTIVE BATCHES</p>
          <h3 className="font-sans font-extrabold text-3xl text-[#9E0C25]">{metrics.activeBatches}</h3>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1">
          <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL STUDENTS</p>
          <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.totalStudents.toLocaleString()}</h3>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1">
          <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">COMPLETED BATCHES</p>
          <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.completedBatches}</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by batch name, teacher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 pl-11 pr-4 rounded-2xl bg-stone-50 border border-stone-200/90 text-xs font-semibold focus:outline-none focus:border-[#9E0C25]" />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-[#9E0C25] animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-sky-50/50 border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500">
                  <th className="py-4 px-6">COURSE & BATCH</th>
                  <th className="py-4 px-6">ASSIGNED TEACHER</th>
                  <th className="py-4 px-6">SCHEDULE</th>
                  <th className="py-4 px-6">STUDENTS</th>
                  <th className="py-4 px-6">STATUS</th>
                  <th className="py-4 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                {filteredBatches.map((batch) => {
                  // Calculate dynamic status for this specific batch
                  const displayStatus = getDynamicStatus(batch.schedule, batch.status);

                  return (
                    <tr key={batch.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <h5 className="font-bold text-stone-900 text-sm leading-tight">{batch.courseName || batch.course || "Unknown Course"}</h5>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-[#9E0C25]">{batch.name}</span>
                            <span className="text-[10px] font-bold text-stone-400">{batch.code}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* 🔥 FIX: Teacher Name Mapping */}
                      <td className="py-4 px-6 font-bold text-stone-900">
                        {batch.teacherName || batch.teacher || "Unassigned"}
                      </td>

                      <td className="py-4 px-6 font-medium text-stone-600">{formatScheduleDisplay(batch.schedule)}</td>
                      <td className="py-4 px-6 font-extrabold text-stone-900">{batch.totalStudents}</td>
                      
                      {/*   Status Dropdown */}
                     <td className="py-4 px-6">
  <span 
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase border ${
      displayStatus === "Active" 
        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
        : displayStatus === "Upcoming" 
        ? "bg-sky-50 text-sky-700 border-sky-200"
        : "bg-stone-100 text-stone-600 border-stone-200"
    }`}
  >
    {displayStatus}
  </span>
</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 text-stone-500">
                          <button onClick={() => router.push(`/admin/batches/${batch.id}`)} className="p-1.5 hover:bg-stone-100 rounded-lg hover:text-[#9E0C25]" title="View details"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => router.push(`/admin/batches/${batch.id}/edit`)} className="p-1.5 hover:bg-stone-100 rounded-lg hover:text-stone-900" title="Edit batch"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteBatch(batch.id, batch.name)} className="p-1.5 hover:bg-rose-50 rounded-lg hover:text-rose-600" title="Delete batch"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}