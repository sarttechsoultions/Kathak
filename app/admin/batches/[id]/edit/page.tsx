"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Info, Calendar, Loader2 } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
interface CourseItem {
  id: string;
  title: string;
}

interface TeacherItem {
  id: string;
  fullName: string;
}
const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return "";
  if (time24.includes("AM") || time24.includes("PM")) return time24;
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  const formattedH = h < 10 ? `0${h}` : `${h}`;
  return `${formattedH}:${m} ${ampm}`;
};

const convert12HourTo24 = (time12: string) => {
  if (!time12) return "";
  const match = time12.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return time12;
  let h = parseInt(match[1], 10);
  const m = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  const hStr = h < 10 ? `0${h}` : `${h}`;
  return `${hStr}:${m}`;
};

export default function EditBatchPage() {
  const router = useRouter();
  const params = useParams();
  const batchId = params.id as string;
  
const [dbCourses, setDbCourses] = useState<CourseItem[]>([]);
const [teacherList, setTeacherList] = useState<TeacherItem[]>([]);
const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [batchName, setBatchName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [assignedTeacherId, setAssignedTeacherId] = useState("");
  const [status, setStatus] = useState("Active");
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [classTime, setClassTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchRes, coursesRes, teachersRes] = await Promise.all([
          apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${batchId}`),
          apiRequest(ENDPOINTS.COURSES),
          apiRequest(ENDPOINTS.ADMIN_TEACHERS)
        ]);
        
        if (coursesRes.data?.courses) setDbCourses(coursesRes.data.courses);
        if (teachersRes.data?.teachers) setTeacherList(teachersRes.data.teachers);

        const b = batchRes.data;
        if (b) {
          setBatchName(b.name || "");
          setCourseId(b.courseId || "");
          setLevel(b.level || "BEGINNER");
          setAssignedTeacherId(b.teacherId || "");
          setStatus(b.status || "Active");

          if (b.schedule) {
            const parts = b.schedule.split("|");
            if (parts[0]) setSelectedDays(parts[0].split(","));
            if (parts[1]) setClassTime(parts[1]);
            if (parts[2]) setStartDate(parts[2]);
            if (parts[3]) setEndDate(parts[3]);
          }
        }
      } catch (err) {
        console.error("Failed to load batch data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (batchId) fetchData();
  }, [batchId]);

  const handleUpdateBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim() || !courseId) return alert("Batch Name and Course are required.");

    setIsSubmitting(true);
    try {
      const scheduleString = `${selectedDays.join(",")}|${classTime}|${startDate}|${endDate}`;

      await apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${batchId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: batchName.trim(),
          courseId,
          level,
          teacherId: assignedTeacherId || null,
          schedule: scheduleString,
          status
        })
      });

      openThemeSuccess(`Batch "${batchName}" updated successfully!`, "Batch Updated");
      router.push(`/admin/batches/${batchId}`);
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to update batch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  if (isLoading) return <div className="p-8 text-center text-stone-500">Loading batch editor...</div>;

  return (
    <form onSubmit={handleUpdateBatchSubmit} className="space-y-6 animate-in fade-in duration-300 max-w-[1000px] mx-auto p-6 bg-stone-50/30 rounded-3xl border border-stone-200/50">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <button type="button" onClick={() => router.push(`/admin/batches/${batchId}`)} className="inline-flex items-center gap-2 font-sans font-bold text-2xl text-stone-900 hover:text-[#9E0C25] transition-colors">
            <ArrowLeft className="w-5 h-5" /> <span>Edit Batch: {batchName}</span>
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="font-bold text-lg text-stone-800 mb-6 flex items-center gap-2"><Info className="w-5 h-5 text-[#9E0C25]" /> Core Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase">Batch Name</label>
            <input type="text" required value={batchName} onChange={(e) => setBatchName(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase">Select Course</label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]">
              {dbCourses.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase">Assigned Teacher</label>
            <select value={assignedTeacherId} onChange={(e) => setAssignedTeacherId(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]">
              <option value="">-- Select Teacher --</option>
              {teacherList.map((t) => (<option key={t.id} value={t.id}>{t.fullName}</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]">
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="font-bold text-lg text-stone-800 mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> Schedule & Timing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-stone-700 uppercase">Days of the Week</label>
            <div className="flex flex-wrap gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <button key={day} type="button" onClick={() => toggleDaySelection(day)} className={`px-4 py-2 rounded-xl text-xs font-bold ${selectedDays.includes(day) ? "bg-[#9E0C25] text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase">Class Time</label>
            <input type="time" required value={convert12HourTo24(classTime)} onChange={(e) => setClassTime(formatTimeTo12Hour(e.target.value))} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-stone-200">
        <button type="button" onClick={() => router.push(`/admin/batches/${batchId}`)} className="px-6 py-3 rounded-xl font-bold text-sm text-stone-600 hover:bg-stone-100">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#9E0C25] hover:bg-[#800A1E] shadow-md disabled:opacity-70 flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Update Batch
        </button>
      </div>
    </form>
  );
}