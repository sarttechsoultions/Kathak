"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateBatchPage() {
  const router = useRouter();
  
const [dbCourses, setDbCourses] = useState<CourseItem[]>([]);
const [teacherList, setTeacherList] = useState<TeacherItem[]>([]);
const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [batchName, setBatchName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [assignedTeacherId, setAssignedTeacherId] = useState("");

  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  const [classTime, setClassTime] = useState("06:30 PM");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, teachersRes] = await Promise.all([
          apiRequest(ENDPOINTS.COURSES),
          apiRequest(ENDPOINTS.ADMIN_TEACHERS)
        ]);
        if (coursesRes.data?.courses) {
          setDbCourses(coursesRes.data.courses);
          if (coursesRes.data.courses.length > 0) setCourseId(coursesRes.data.courses[0].id);
        }
        if (teachersRes.data?.teachers) {
          setTeacherList(teachersRes.data.teachers);
        }
      } catch (err) {
        console.error("Failed to load prerequisites", err);
      }
    };
    fetchData();
  }, []);

  const handleSaveBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim() || !courseId) return alert("Batch Name and Course are required.");

    setIsSubmitting(true);
    try {
      const scheduleString = `${selectedDays.join(",")}|${classTime}|${startDate}|${endDate}`;

      await apiRequest(ENDPOINTS.ADMIN_BATCHES, {
        method: "POST",
        body: JSON.stringify({
          name: batchName.trim(),
          courseId,
          level,
          teacherId: assignedTeacherId || null,
          schedule: scheduleString,
          studentIds: [] // Explicitly passing empty array as students are not enrolled from here
        })
      });

      openThemeSuccess(`Batch "${batchName}" created successfully!`, "Batch Created");
      router.push("/admin/batches");
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to create batch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  return (
    <form onSubmit={handleSaveBatchSubmit} className="space-y-6 animate-in fade-in duration-300 max-w-[1000px] mx-auto p-6 bg-stone-50/30 rounded-3xl border border-stone-200/50">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <button type="button" onClick={() => router.push("/admin/batches")} className="inline-flex items-center gap-2 font-sans font-bold text-2xl text-stone-900 hover:text-[#9E0C25] transition-colors">
            <ArrowLeft className="w-5 h-5" /> <span>Create New Batch</span>
          </button>
          <p className="text-sm font-medium text-stone-500 mt-1">Set up a new cohort and schedule.</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="font-bold text-lg text-stone-800 mb-6 flex items-center gap-2"><Info className="w-5 h-5 text-[#9E0C25]" /> Core Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase">Batch Name</label>
            <input type="text" required value={batchName} onChange={(e) => setBatchName(e.target.value)} placeholder="e.g. Winter Cohort 2024" className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]" />
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
            <label className="text-xs font-bold text-stone-700 uppercase">Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]">
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h3 className="font-bold text-lg text-stone-800 mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> Schedule & Timing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#9E0C25]" />
          </div>
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
        <button type="button" onClick={() => router.push("/admin/batches")} className="px-6 py-3 rounded-xl font-bold text-sm text-stone-600 hover:bg-stone-100">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#9E0C25] hover:bg-[#800A1E] shadow-md disabled:opacity-70 flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Batch
        </button>
      </div>
    </form>
  );
}