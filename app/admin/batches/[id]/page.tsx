"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Users, User, Clock, FileText } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
interface BatchDetails {
  id: string;
  name: string;
  code: string;
  courseName?: string;
  course?: string;
  courseId?: string;
  level: string;
  teacherName?: string;
  teacher?: string;
  schedule: string;
  status: string;
}

interface CohortStudent {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
  studentId?: string;
  joiningDate?: string;
  avatar?: string;
  student?: {
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  };
}

interface DropdownBatch {
  id: string;
  code: string;
  name: string;
  courseId: string;
}
export default function BatchViewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.id as string;

const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [cohortStudents, setCohortStudents] = useState<CohortStudent[]>([]);
  const [allBatches, setAllBatches] = useState<DropdownBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const [batchRes, studentsRes, allBatchesRes] = await Promise.all([
          apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${batchId}`),
          apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${batchId}/students`),
          apiRequest(ENDPOINTS.ADMIN_BATCHES) // Fetch all to allow batch switching
        ]);

        if (batchRes.data) setBatch(batchRes.data);
        if (allBatchesRes.data?.batches) setAllBatches(allBatchesRes.data.batches);
        
        const students = Array.isArray(studentsRes.data) ? studentsRes.data : [];
        setCohortStudents(students);
      } catch (err) {
        console.error("Failed to load batch data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (batchId) fetchBatchDetails();
  }, [batchId]);

  const handleBatchChange = async (studentId: string, newBatchId: string, studentName: string) => {
    const targetBatch = allBatches.find(b => b.id === newBatchId);
    if (!targetBatch) return;

    try {
      await apiRequest(`${ENDPOINTS.ADMIN_STUDENTS}/${studentId}`, {
        method: "PUT",
        body: JSON.stringify({ batchId: targetBatch.id })
      });

      // Remove from current list visually since they moved to another batch
      setCohortStudents(prev => prev.filter(s => s.id !== studentId));
      openThemeSuccess(`${studentName} moved to batch ${targetBatch.code}!`, "Batch Changed");
    } catch (err: unknown) {
      alert("Failed to change student batch.");
    }
  };

  if (isLoading) return <div className="p-8 text-center text-stone-500">Loading directory...</div>;
  if (!batch) return <div className="p-8 text-center text-stone-500">Batch not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[1350px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button onClick={() => router.push("/admin/batches")} className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 uppercase mb-1">
            <ArrowLeft className="w-4 h-4" /> <span>Back to Batches</span>
          </button>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-[#0B1C30] tracking-tight">Batch Directory</h1>
        </div>
      </div>

      {/* Batch Details Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-[#9E0C25] font-extrabold text-[10.5px] uppercase border border-rose-200">{batch.level}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10.5px] border border-emerald-200">• {batch.status || "Active"}</span>
            </div>
            <h2 className="font-extrabold text-2xl text-[#0B1C30] tracking-tight pt-1">{batch.name}</h2>
            <p className="text-xs font-bold text-stone-500">{batch.courseName || batch.course}</p>
          </div>
          <button onClick={() => router.push(`/admin/batches/${batchId}/edit`)} className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs transition-colors flex items-center gap-2">
            <Pencil className="w-3.5 h-3.5" /> <span>Edit Batch Specs</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">ASSIGNED TEACHER</p>
            <p className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5"><User className="w-4 h-4 text-[#9E0C25]" /> <span>{batch.teacherName || batch.teacher || "Unassigned"}</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">CLASS SCHEDULE</p>
            <p className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#9E0C25]" /> <span>{batch.schedule || "Not Scheduled"}</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">BATCH CODE</p>
            <p className="font-mono font-extrabold text-[#9E0C25] text-sm flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#9E0C25]" /> <span>{batch.code}</span></p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">ENROLLED COHORT</p>
            <p className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5"><Users className="w-4 h-4 text-[#9E0C25]" /> <span>{cohortStudents.length} Enrolled Student(s)</span></p>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-sky-50/50 border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500">
                <th className="py-4 px-6">STUDENT NAME</th>
                <th className="py-4 px-6">STUDENT ID</th>
                <th className="py-4 px-6">ASSIGN BATCH</th>
                <th className="py-4 px-6">JOINING DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
              {cohortStudents.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-stone-400 font-semibold">No students are currently assigned to this batch.</td></tr>
              ) : (
                cohortStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={student.student?.avatarUrl || student.avatar || "/Ananya.png"} alt={student.fullName} className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0" />
                        <div>
                          <h5 className="font-bold text-stone-900 text-sm leading-tight">{student.fullName || student.name || student.student?.fullName}</h5>
                          <p className="text-[11px] font-semibold text-stone-400">{student.email || student.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-600">{student.studentId || "N/A"}</td>
                    <td className="py-4 px-6">
                      <select
                        value={batchId}
onChange={(e) => handleBatchChange(student.id, e.target.value, student.fullName || student.name || student.student?.fullName || "Unknown Student")}
                        className="h-9 px-3 rounded-xl bg-white border border-stone-200 text-stone-800 font-bold text-xs focus:outline-none focus:border-[#9E0C25] cursor-pointer max-w-[200px]"
                      >
                        {allBatches
                          .filter(b => b.courseId === batch.courseId) // Only allow switching to batches of the SAME course
                          .map((b) => (
                            <option key={b.id} value={b.id}>{b.code} ({b.name})</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 font-semibold text-stone-600">{student.joiningDate || "Registered"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}