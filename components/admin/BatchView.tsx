"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  ChevronDown,
  Loader2,
  Save,
  SlidersHorizontal,
  FileText,
  Clock,
  PlayCircle,
  CheckCircle2,
  Info,
  UserPlus,
  Calendar,
  X,
  User,
  Check
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess, openThemeConfirm } from "@/components/ThemeDialogProvider";

interface BatchRecord {
  id: string;
  name: string;
  code: string;
  course: string;
  courseName?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  teacher: string;
  schedule: string;
  totalStudents: number;
  status: "Active" | "Completed" | "Upcoming" | "ACTIVE" | "COMPLETED" | "UPCOMING";
}

interface CohortStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studentId: string;
  level?: string;
  batchCode: string;
  batchId?: string;
  joiningDate: string;
  assignmentsSubmitted: string;
}

interface EnrolledStudentItem {
  id: string;
  name: string;
  initials: string;
  studentId: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

interface AvailableStudent {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  avatar: string;
  avatarUrl?: string;
  status: string;
  course?: string | null;
  courses?: { id: string; title: string; active?: boolean }[];
  batch?: string | null;
}

interface BatchStudentResponse {
    id:string;
    fullName:string;
    email:string;
    avatar?:string;
    batchName:string;
    studentId?:string;
    joiningDate?:string;
    assignmentsSubmitted?:number;
}

interface TeacherResponseItem {
  id: string;
  name?: string;
  fullName?: string;
}

interface CourseResponseItem {
  id: string;
  title?: string;
  name?: string;
}

const formatScheduleDisplay = (rawSchedule?: string) => {
  if (!rawSchedule) return "Mon, Wed, Fri (06:30 PM)";
  if (rawSchedule.includes("|")) {
    const parts = rawSchedule.split("|");
    const days = parts[0] || "Mon, Wed, Fri";
    const time = parts[1] || "06:30 PM";
    return `${days} (${time})`;
  }
  return rawSchedule;
};

const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return "";
  if (time24.includes("AM") || time24.includes("PM")) return time24;
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
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

export default function BatchView() {
  const [viewMode, setViewMode] = useState<"OVERVIEW" | "STUDENT_DIRECTORY" | "CREATE_FORM" | "EDIT_FORM">("OVERVIEW");
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  // Real Dynamic State
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [dbCourses, setDbCourses] = useState<CourseResponseItem[]>([]);
  const [metrics, setMetrics] = useState({
    activeBatches: 0,
    totalStudents: 0,
    completedBatches: 0,
    batchesA: 0,
    batchesB: 0,
    batchesC: 0
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("Course Type");
  const [selectedBatchStatus, setSelectedBatchStatus] = useState("Batch Status");

  // Student Cohort Directory State
  const [cohortStudents, setCohortStudents] = useState<CohortStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [batchName, setBatchName] = useState("");
  const [course, setCourse] = useState("Kathak Beginners Course");
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("INTERMEDIATE");
  const [batchDescription, setBatchDescription] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const [teacherList, setTeacherList] = useState<string[]>([]);
  const [studentCapacity, setStudentCapacity] = useState("25");
  const [batchStatus, setBatchStatus] = useState<"UPCOMING" | "ACTIVE" | "DONE">("ACTIVE");

  // Schedule & Timing States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  const [classTime, setClassTime] = useState("06:30 PM");
  const [timeZone, setTimeZone] = useState("IST (UTC+5:30)");

  // Student Picker Modal & Toast Notification States
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudentItem[]>([]);
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [studentPickerSearch, setStudentPickerSearch] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeTargetCourseTitle = useMemo(() => {
    if (viewMode === "CREATE_FORM") {
      return course;
    }
    if (viewMode === "STUDENT_DIRECTORY" && selectedBatch) {
      return (
        selectedBatch.courseName ||
        (typeof selectedBatch.course === "string"
          ? selectedBatch.course
          : (selectedBatch.course as unknown as { title?: string; name?: string })?.title ||
            (selectedBatch.course as unknown as { title?: string; name?: string })?.name) ||
        ""
      );
    }
    return "";
  }, [viewMode, course, selectedBatch]);

  const courseEnrolledAvailableStudents = useMemo(() => {
    if (!activeTargetCourseTitle || activeTargetCourseTitle.trim() === "" || activeTargetCourseTitle === "Course Type") {
      return availableStudents;
    }
    const cleanTarget = activeTargetCourseTitle.toLowerCase().trim();
    return availableStudents.filter((stu) => {
      // 1. Direct course string match
      if (stu.course) {
        const c = stu.course.toLowerCase().trim();
        if (c === cleanTarget || c.includes(cleanTarget) || cleanTarget.includes(c)) return true;
      }
      // 2. Enrolled courses array match
      if (Array.isArray(stu.courses)) {
        const match = stu.courses.some((c) => {
          const title = (c.title || "").toLowerCase().trim();
          return title === cleanTarget || title.includes(cleanTarget) || cleanTarget.includes(title);
        });
        if (match) return true;
      }
      return false;
    });
  }, [availableStudents, activeTargetCourseTitle]);

  // Fetch Live Batches, Teachers & Registered Students from Express Backend API
  const fetchBatchesData = useCallback(async () => {
    try {
      const res = await apiRequest<{
        data?: {
          batches?: BatchRecord[];
          metrics?: {
            activeBatches?: number;
            totalStudents?: number;
            completedBatches?: number;
            batchesA?: number;
            batchesB?: number;
            batchesC?: number;
          };
        };
      }>(ENDPOINTS.ADMIN_BATCHES);

      if (res.data?.batches) {
        setBatches(res.data.batches);
      }
      if (res.data?.metrics) {
        setMetrics({
          activeBatches: res.data.metrics.activeBatches || 0,
          totalStudents: res.data.metrics.totalStudents || 0,
          completedBatches: res.data.metrics.completedBatches || 0,
          batchesA: res.data.metrics.batchesA || 0,
          batchesB: res.data.metrics.batchesB || 0,
          batchesC: res.data.metrics.batchesC || 0
        });
      }

      // Fetch dynamic courses list
      const courseRes = await apiRequest<{ data?: { courses?: CourseResponseItem[] } }>(ENDPOINTS.COURSES);
      if (courseRes.data?.courses && courseRes.data.courses.length > 0) {
        setDbCourses(courseRes.data.courses);
      }

      // Fetch dynamic teachers list
      const teacherRes = await apiRequest<{ data?: { teachers?: TeacherResponseItem[] } }>(ENDPOINTS.ADMIN_TEACHERS);
      if (teacherRes.data?.teachers) {
        const names = teacherRes.data.teachers.map((t: TeacherResponseItem) => t.name || t.fullName || "Teacher");
        setTeacherList(names);
        setAssignedTeacher((prev) => (prev ? prev : names[0] || ""));
      }

      // Fetch registered students list
      const studentRes = await apiRequest<{ data?: { students?: AvailableStudent[] } }>(ENDPOINTS.ADMIN_STUDENTS);
      if (studentRes.data?.students) {
        setAvailableStudents(studentRes.data.students);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch dynamic batches data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteBatch = async (id: string, name: string) => {
    if (await openThemeConfirm(`Are you sure you want to delete batch "${name}"?`, "Delete Batch")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${id}`, { method: "DELETE" });
        await openThemeSuccess(`Batch "${name}" deleted successfully from Database!`, "Batch Deleted");
        fetchBatchesData();
      } catch (err: unknown) {
        showNotification((err as Error).message || "Failed to delete batch.");
      }
    }
  };

  useEffect(() => {
    fetchBatchesData();
  }, [fetchBatchesData]);

  // Auto-calculate batch status dynamically based on Start Date & End Date
  useEffect(() => {
    if (!startDate) {
      if (viewMode === "CREATE_FORM") {
        setBatchStatus("UPCOMING");
      }
      return;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    if (!isNaN(start.getTime()) && start > now) {
      setBatchStatus("UPCOMING");
      return;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (!isNaN(end.getTime()) && now > end) {
        setBatchStatus("DONE");
        return;
      }
    }

    setBatchStatus("ACTIVE");
  }, [startDate, endDate, viewMode]);

  // Open Batch Student Directory
  const handleOpenBatchDirectory = async (batch: BatchRecord) => {
    setSelectedBatch(batch);
    setViewMode("STUDENT_DIRECTORY");
    setIsLoading(true);

    try {
      const res = await apiRequest<{ status: string; data: BatchStudentResponse[] }>(
        `${ENDPOINTS.ADMIN_BATCHES}/${batch.id}/students`
      );

      const students: BatchStudentResponse[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray((res as unknown as { students?: BatchStudentResponse[] }).students)
        ? (res as unknown as { students: BatchStudentResponse[] }).students
        : [];

      setCohortStudents(
        students.map((s) => ({
          id: s.id,
          name: s.fullName || (s as unknown as { name?: string }).name || "Student",
          email: s.email || "-",
          avatar: s.avatar || "/Ananya.png",
          studentId: s.studentId || `#STU-${s.id.slice(0, 4).toUpperCase()}`,
          batchCode: s.batchName || batch.code || "BATCH",
          batchId: (s as unknown as { batchId?: string }).batchId || batch.id,
          joiningDate: s.joiningDate || "Aug 2024",
          assignmentsSubmitted: String(s.assignmentsSubmitted || "0")
        }))
      );
    } catch (err: unknown) {
      console.error("Failed to fetch batch students:", err);
      setCohortStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickStatusChange = async (batchId: string, newStatus: string) => {
    try {
      await apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${batchId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      showNotification(`Batch status updated to "${newStatus}"!`);
      await fetchBatchesData();
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to update batch status.");
    }
  };

  // Open Edit Batch Form with pre-populated values
  const handleOpenEditForm = async (batch: BatchRecord) => {
    setEditingBatchId(batch.id);
    setBatchName(batch.name);
    setCourse(batch.course);
    setLevel(batch.level);
    setAssignedTeacher(batch.teacher);
    setStudentCapacity(String(batch.totalStudents || 25));
    setBatchStatus(
      batch.status === "Active"
        ? "ACTIVE"
        : batch.status === "Upcoming"
        ? "UPCOMING"
        : "DONE"
    );

    // Parse schedule string or set robust default dates
    let parsedDays = ["Mon", "Wed", "Fri"];
    let parsedTime = "06:30 PM";
    let parsedStart = new Date().toISOString().split("T")[0];
    let parsedEnd = new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split("T")[0];

    if (batch.schedule) {
      if (batch.schedule.includes("|")) {
        const parts = batch.schedule.split("|");
        if (parts[0]) parsedDays = parts[0].split(",").map((d) => d.trim()).filter(Boolean);
        if (parts[1]) parsedTime = parts[1].trim();
        if (parts[2]) parsedStart = parts[2].trim();
        if (parts[3]) parsedEnd = parts[3].trim();
      } else {
        const timeMatch = batch.schedule.match(/\((.*?)\)/);
        if (timeMatch && timeMatch[1]) {
          parsedTime = timeMatch[1].trim();
        }
        const daysPart = batch.schedule.replace(/\(.*?\)/, "").trim();
        if (daysPart) {
          const daysArr = daysPart.split(/[, ]+/).filter((d) =>
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(d.trim())
          );
          if (daysArr.length > 0) parsedDays = daysArr;
        }
      }
    }

    setStartDate(parsedStart);
    setEndDate(parsedEnd);
    setClassTime(parsedTime);
    setSelectedDays(parsedDays);

    try {
      const response = await apiRequest<{ status: string; data: BatchStudentResponse[] }>(
        `${ENDPOINTS.ADMIN_BATCHES}/${batch.id}/students`
      );

      const students: BatchStudentResponse[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray((response as unknown as { students?: BatchStudentResponse[] }).students)
        ? (response as unknown as { students: BatchStudentResponse[] }).students
        : [];

      setEnrolledStudents(
        students.map((student) => ({
          id: student.id,
          name: student.fullName || (student as unknown as { name?: string }).name || "Student",
          initials: (student.fullName || "ST").substring(0, 2).toUpperCase(),
          studentId: student.studentId ?? `#STU-${student.id.slice(0, 4).toUpperCase()}`,
          level: "INTERMEDIATE" as const
        }))
      );
    } catch (err: unknown) {
      console.error("Failed to fetch batch students for edit:", err);
      setEnrolledStudents([]);
    }

    setViewMode("EDIT_FORM");
  };

  // Reset Form for New Batch
  const handleOpenCreateForm = () => {
    setEditingBatchId(null);
    setBatchName("");
    setCourse((dbCourses.length > 0 && dbCourses[0]?.title) ? dbCourses[0].title : "Kathak Beginners Course");
    setLevel("BEGINNER");
    setBatchDescription("");
    setAssignedTeacher(teacherList.length > 0 ? teacherList[0] : "");
    setStudentCapacity("25");
    setEnrolledStudents([]);
    setBatchStatus("UPCOMING");
    setStartDate("");
    setEndDate("");
    setClassTime("");
    setSelectedDays([]);
    setViewMode("CREATE_FORM");
  };

  // Submit Form (Create or Update)
  const handleSaveBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim() || !course.trim()) {
      showNotification("Please enter a valid Batch Name and Course.");
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduleString = `${selectedDays.join(",") || "Mon,Wed,Fri"}|${classTime || "06:30 PM"}|${startDate || ""}|${endDate || ""}`;
      const newStatusStr = batchStatus === "ACTIVE" ? "Active" : batchStatus === "UPCOMING" ? "Upcoming" : "Completed";

      if (viewMode === "EDIT_FORM" && editingBatchId) {
        // Optimistically update local batches state first for instant UI response
        setBatches((prev) =>
          prev.map((b) =>
            b.id === editingBatchId
              ? {
                  ...b,
                  name: batchName.trim(),
                  course: course,
                  teacher: assignedTeacher || b.teacher,
                  status: newStatusStr as any,
                  schedule: scheduleString,
                  level: level as any
                }
              : b
          )
        );

        // PUT Update Request
        await apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${editingBatchId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: batchName.trim(),
            courseName: course,
            level,
            teacherName: assignedTeacher || "Kathak Faculty",
            schedule: scheduleString,
            totalStudents: enrolledStudents.length,
            studentIds: enrolledStudents.map((student) => student.id),
            status: newStatusStr
          })
        });
        showNotification(`Batch "${batchName}" updated successfully!`);
      } else {
        // POST Create Request
        await apiRequest(ENDPOINTS.ADMIN_BATCHES, {
          method: "POST",
          body: JSON.stringify({
            name: batchName.trim(),
            courseName: course,
            level,
            teacherName: assignedTeacher || "Kathak Faculty",
            schedule: scheduleString,
            totalStudents: enrolledStudents.length,
            studentIds: enrolledStudents.map((student) => student.id),
            status: newStatusStr
          })
        });
        showNotification(`Batch "${batchName}" created & saved to database!`);
      }

      await fetchBatchesData();
      setViewMode("OVERVIEW");
      setBatchName("");
    } catch (err: unknown) {
      showNotification((err as Error).message || "Failed to save batch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleRemoveStudent = (id: string) => {
    setEnrolledStudents(enrolledStudents.filter((s) => s.id !== id));
  };

  // Toggle selection inside Student Picker Modal
  const toggleStudentPickerSelection = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  // Confirm selection from Student Picker Modal
  const confirmSelectedStudentsToBatch = async () => {
    if (selectedStudentIds.length === 0) {
      showNotification("Please select at least one student to enroll.");
      return;
    }

    const newlySelected = availableStudents
      .filter((s) => selectedStudentIds.includes(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        initials: (s.name || "ST").substring(0, 2).toUpperCase(),
        studentId: `#STU-2024-${s.id.substring(0, 4).toUpperCase()}`,
        level: "INTERMEDIATE" as const
      }));

    const existingIds = enrolledStudents.map((es) => es.id);
    const filteredNew = newlySelected.filter((ns) => !existingIds.includes(ns.id));
    const updatedEnrolled = [...enrolledStudents, ...filteredNew];
    setEnrolledStudents(updatedEnrolled);

    if (viewMode === "STUDENT_DIRECTORY" && selectedBatch) {
      try {
        const allStudentIds = Array.from(new Set([...cohortStudents.map((cs) => cs.id), ...selectedStudentIds]));
        await apiRequest(`${ENDPOINTS.ADMIN_BATCHES}/${selectedBatch.id}`, {
          method: "PUT",
          body: JSON.stringify({
            studentIds: allStudentIds
          })
        });
        showNotification(`${selectedStudentIds.length} student(s) added to batch cohort successfully!`);
        await handleOpenBatchDirectory(selectedBatch);
        await fetchBatchesData();
      } catch (err: unknown) {
        showNotification((err as Error).message || "Failed to add students to batch.");
      }
    } else {
      showNotification(`${filteredNew.length} student(s) added to batch cohort!`);
    }

    setIsStudentPickerOpen(false);
    setSelectedStudentIds([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1350px] mx-auto relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= SCREEN 1: BATCH MANAGEMENT OVERVIEW ================= */}
      {viewMode === "OVERVIEW" && (
        <div className="space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-extrabold text-2xl sm:text-3xl text-[#0B1C30] tracking-tight">
                Batch Management
              </h1>
            </div>

            <button
              onClick={handleOpenCreateForm}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-center uppercase tracking-wide"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Batch</span>
            </button>
          </div>

          {/* 6 Top Stat Cards */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1 text-center sm:text-left">
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">ACTIVE BATCHES</p>
                <h3 className="font-sans font-extrabold text-3xl text-[#9E0C25]">{metrics.activeBatches}</h3>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1 text-center sm:text-left">
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL STUDENTS</p>
                <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.totalStudents.toLocaleString()}</h3>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1 text-center sm:text-left">
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">COMPLETED BATCHES</p>
                <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.completedBatches}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1 text-center sm:text-left">
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">BATCHES A</p>
                <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.batchesA}</h3>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1 text-center sm:text-left">
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">BATCHES B</p>
                <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.batchesB}</h3>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1 text-center sm:text-left">
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">BATCHES C</p>
                <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.batchesC}</h3>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by batch name, teacher, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-stone-200/90 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25] shadow-xs"
              />
            </div>

            <select
              value={selectedCourseType}
              onChange={(e) => setSelectedCourseType(e.target.value)}
              className="h-11 px-4 rounded-2xl bg-white border border-stone-200/90 text-stone-700 font-semibold text-xs focus:outline-none focus:border-[#9E0C25] shadow-xs cursor-pointer"
            >
              <option>Course Type</option>
              <option>Kathak Foundations</option>
              <option>Classical Kathak</option>
            </select>

            <select
              value={selectedBatchStatus}
              onChange={(e) => setSelectedBatchStatus(e.target.value)}
              className="h-11 px-4 rounded-2xl bg-white border border-stone-200/90 text-stone-700 font-semibold text-xs focus:outline-none focus:border-[#9E0C25] shadow-xs cursor-pointer"
            >
              <option>Batch Status</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Upcoming</option>
            </select>

            <button className="p-3 rounded-2xl bg-white border border-stone-200/90 text-stone-500 hover:text-stone-900 cursor-pointer shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Batches Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#9E0C25] animate-spin" />
                <p className="text-xs font-mono font-bold text-stone-400 uppercase">Loading batch schedules...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-sky-50/50 border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500">
                      <th className="py-4 px-6">COURSE</th>
                      <th className="py-4 px-6">ASSIGNED TEACHER</th>
                      <th className="py-4 px-6">SCHEDULE</th>
                      <th className="py-4 px-6">TOTAL STUDENTS</th>
                      <th className="py-4 px-6">STATUS</th>
                      <th className="py-4 px-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                    {batches.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                          No batches found in database. Click + Create New Batch to set up your first batch.
                        </td>
                      </tr>
                    ) : (
                      batches
                        .filter((b) => searchQuery === "" || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.teacher.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((batch) => (
                          <tr key={batch.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                  <h5 className="font-bold text-stone-900 text-sm leading-tight">
                                    {batch.courseName ||
                                      (typeof batch.course === "string"
                                        ? batch.course
                                        : (batch.course as unknown as { title?: string; name?: string })?.title ||
                                          (batch.course as unknown as { title?: string; name?: string })?.name) ||
                                      "Kathak Foundations"}
                                  </h5>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-[#9E0C25]">{batch.name}</span>
                                  <span className="text-[10px] font-bold text-stone-400">ID: {batch.code}</span>
                                  <span className="px-2 py-0.5 rounded text-[9.5px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                                    {batch.level}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6 font-bold text-stone-900">
                              {batch.teacher}
                            </td>

                            <td className="py-4 px-6 font-medium text-stone-600">
                              {formatScheduleDisplay(batch.schedule)}
                            </td>

                            <td className="py-4 px-6 font-extrabold text-stone-900">
                              {batch.totalStudents}
                            </td>

                            <td className="py-4 px-6">
                              <select
                                value={batch.status}
                                onChange={(e) => handleQuickStatusChange(batch.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full font-extrabold text-[11px] border focus:outline-none cursor-pointer shadow-2xs ${
                                  batch.status === "Active" || batch.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : batch.status === "Upcoming" || batch.status === "UPCOMING"
                                    ? "bg-sky-50 text-[#0284C7] border-sky-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                }`}
                              >
                                <option value="Active">Active</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2 text-stone-500">
                                <button
                                  onClick={() => handleOpenBatchDirectory(batch)}
                                  className="p-1.5 hover:bg-stone-100 rounded-lg cursor-pointer hover:text-[#9E0C25]"
                                  title="View Batch Student Directory"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditForm(batch)}
                                  className="p-1.5 hover:bg-stone-100 rounded-lg cursor-pointer hover:text-stone-900"
                                  title="Edit Batch"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBatch(batch.id, batch.name)}
                                  className="p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer hover:text-rose-600"
                                  title="Delete Batch"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= SCREEN 2: CREATE / EDIT BATCH FORM WORKSPACE ================= */}
      {(viewMode === "CREATE_FORM" || viewMode === "EDIT_FORM") && (
        <form onSubmit={handleSaveBatchSubmit} className="space-y-6 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setViewMode("OVERVIEW")}
                className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer uppercase mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Batch Management &gt; {viewMode === "EDIT_FORM" ? "Edit Batch" : "Create New Batch"}</span>
              </button>
              <h1 className="font-extrabold text-2xl sm:text-3xl text-[#0B1C30] tracking-tight">
                {viewMode === "EDIT_FORM" ? `Edit Batch: ${batchName}` : "Create Batch"}
              </h1>
              <p className="text-xs font-medium text-stone-500">
                {viewMode === "EDIT_FORM" ? "Update teaching cycle and batch details." : "Set up a new teaching cycle for an existing course."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setViewMode("OVERVIEW")}
                className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase disabled:opacity-75 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? "Saving..." : viewMode === "EDIT_FORM" ? "Update Batch" : "Save Batch"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Basic Information */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-[#9E0C25]">
                <Info className="w-4 h-4" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Basic Information</h4>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">BATCH NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kathak Pro 2024-B"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">COURSE *</label>
                    <select
                      value={course}
                      onChange={(e) => {
                        const newCourse = e.target.value;
                        setCourse(newCourse);
                        setSelectedStudentIds([]);
                        setEnrolledStudents([]);
                      }}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25] cursor-pointer"
                    >
                      {dbCourses.length > 0 ? (
                        dbCourses.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Kathak Beginners Course">Kathak Beginners Course</option>
                          <option value="Kathak Intermediate Course">Kathak Intermediate Course</option>
                          <option value="Kathak Advanced Mastery Course">Kathak Advanced Mastery Course</option>
                          <option value="Ladies Wellness Kathak Batch">Ladies Wellness Kathak Batch</option>
                          <option value="Kathak Kids Batch (Age 5+)">Kathak Kids Batch (Age 5+)</option>
                          <option value="Hobby Kathak Batch">Hobby Kathak Batch</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">LEVEL *</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25] cursor-pointer"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">BATCH DESCRIPTION</label>
                  <textarea
                    rows={4}
                    placeholder="Enter details about this batch's specific focus or syllabus requirements..."
                    value={batchDescription}
                    onChange={(e) => setBatchDescription(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold text-xs focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Administrative */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-[#9E0C25]">
                <Users className="w-4 h-4" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Administrative</h4>
              </div>

              <div className="space-y-5 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">ASSIGNED TEACHER</label>
                  <select
                    value={assignedTeacher}
                    onChange={(e) => setAssignedTeacher(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25] cursor-pointer"
                  >
                    {teacherList.length === 0 ? (
                      <option value="Kathak Faculty">Kathak Faculty</option>
                    ) : (
                      teacherList.map((tName, idx) => (
                        <option key={idx} value={tName}>{tName}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">STUDENT CAPACITY</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={studentCapacity}
                      onChange={(e) => setStudentCapacity(e.target.value)}
                      className="w-24 h-11 px-4 text-center rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-bold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                    />
                    <span className="text-[11px] font-semibold text-stone-400">Recommended: 15-30 students</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">BATCH STATUS</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBatchStatus("UPCOMING")}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        batchStatus === "UPCOMING"
                          ? "border-[#9E0C25] bg-rose-50 text-[#9E0C25] font-extrabold"
                          : "border-stone-200 bg-white text-stone-600 font-bold"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-[10.5px]">UPCOMING</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBatchStatus("ACTIVE")}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        batchStatus === "ACTIVE"
                          ? "border-[#9E0C25] bg-rose-50 text-[#9E0C25] font-extrabold"
                          : "border-stone-200 bg-white text-stone-600 font-bold"
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span className="text-[10.5px]">ACTIVE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBatchStatus("DONE")}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        batchStatus === "DONE"
                          ? "border-[#9E0C25] bg-rose-50 text-[#9E0C25] font-extrabold"
                          : "border-stone-200 bg-white text-stone-600 font-bold"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10.5px]">DONE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Schedule & Timing Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-[#9E0C25]">
              <Calendar className="w-4 h-4" />
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Schedule &amp; Timing</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-semibold">
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">START DATE</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">END DATE</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">DAYS SELECTION</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDaySelection(day)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#9E0C25] text-white shadow-xs"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">CLASS TIME *</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="time"
                        required
                        value={convert12HourTo24(classTime)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setClassTime(formatTimeTo12Hour(val));
                        }}
                        className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-bold focus:bg-white focus:outline-none focus:border-[#9E0C25] cursor-pointer"
                      />
                    </div>
                    {classTime && (
                      <div className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-[#9E0C25] font-extrabold text-xs shrink-0 shadow-2xs">
                        ⏰ {classTime}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">TIME ZONE</label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25] cursor-pointer"
                  >
                    <option>IST (UTC+5:30)</option>
                    <option>EST (UTC-5:00)</option>
                    <option>GMT (UTC+0:00)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enroll Students Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[#9E0C25]">
                  <UserPlus className="w-4 h-4" />
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Enroll Students</h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-[#9E0C25] font-extrabold text-[11px] border border-rose-200">
                  Total Enrolled: {enrolledStudents.length} / {studentCapacity}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsStudentPickerOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 uppercase tracking-wide"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Student</span>
                </button>
              </div>
            </div>

            {/* Enrolled Students Table */}
            <div className="overflow-x-auto border border-stone-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500">
                    <th className="py-3 px-4">STUDENT NAME</th>
                    <th className="py-3 px-4">STUDENT ID</th>
                    <th className="py-3 px-4">LEVEL</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {enrolledStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-stone-400 font-semibold">
                        No students enrolled yet. Click + Add Student from DB to select registered students.
                      </td>
                    </tr>
                  ) : (
                    enrolledStudents.map((stu) => (
                      <tr key={stu.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                              {stu.initials}
                            </div>
                            <span className="font-bold text-stone-900 text-xs">{stu.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-600">{stu.studentId}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            stu.level === "INTERMEDIATE" ? "bg-sky-100 text-sky-800" : "bg-stone-100 text-stone-600"
                          }`}>
                            {stu.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(stu.id)}
                            className="p-1 hover:bg-rose-50 rounded text-stone-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </form>
      )}

      {/* ================= SCREEN 3: BATCH STUDENT DIRECTORY DETAIL VIEW ================= */}
      {viewMode === "STUDENT_DIRECTORY" && selectedBatch && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setViewMode("OVERVIEW")}
                className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer uppercase mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Batches &gt; {selectedBatch.name}</span>
              </button>
              
              <h1 className="font-extrabold text-2xl sm:text-3xl text-[#0B1C30] tracking-tight">
                Batch Student Directory
              </h1>
              
              <div className="flex items-center gap-2 pt-0.5">
                <p className="text-xs font-medium text-stone-500">Management and directory for student cohort</p>
                <span className="text-xs font-extrabold text-[#9E0C25] uppercase tracking-wider">{selectedBatch.code}</span>
              </div>
            </div>

            <button
              onClick={() => showNotification("Batch student changes saved successfully!")}
              className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-center uppercase tracking-wide"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          {/* Rich Batch Details Overview Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-[#9E0C25] font-extrabold text-[10.5px] uppercase border border-rose-200">
                    {selectedBatch.level}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10.5px] border border-emerald-200">
                    • {selectedBatch.status}
                  </span>
                </div>
                <h2 className="font-extrabold text-2xl text-[#0B1C30] tracking-tight pt-1">{selectedBatch.name}</h2>
                <p className="text-xs font-bold text-stone-500">{selectedBatch.course}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentIds([]);
                    setIsStudentPickerOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wide"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Students</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEditForm(selectedBatch)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Batch Specs</span>
                </button>
              </div>
            </div>

            {/* 4 Detail Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">ASSIGNED TEACHER</p>
                <p className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#9E0C25]" />
                  <span>{selectedBatch.teacher || "Kathak Faculty"}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">CLASS SCHEDULE</p>
                <p className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#9E0C25]" />
                  <span>{selectedBatch.schedule || "Mon,Wed,Fri 07:00 AM"}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">BATCH CODE & ID</p>
                <p className="font-mono font-extrabold text-[#9E0C25] text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#9E0C25]" />
                  <span>{selectedBatch.code}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">ENROLLED COHORT</p>
                <p className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#9E0C25]" />
                  <span>{selectedBatch.totalStudents || cohortStudents.length} Enrolled Student{(selectedBatch.totalStudents || cohortStudents.length) === 1 ? "" : "s"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-sky-50/50 border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500">
                    <th className="py-4 px-6">STUDENT NAME</th>
                    <th className="py-4 px-6">STUDENT ID</th>
                    <th className="py-4 px-6">BATCH</th>
                    <th className="py-4 px-6">JOINING DATE</th>
                    <th className="py-4 px-6">ASSIGNMENTS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {cohortStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-400 font-semibold">
                        No students enrolled in this batch directory yet.
                      </td>
                    </tr>
                  ) : (
                    cohortStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <h5 className="font-bold text-stone-900 text-sm leading-tight">{student.name}</h5>
                              <p className="text-[11px] font-semibold text-stone-400">{student.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-bold text-stone-600">
                          {student.studentId}
                        </td>

                        <td className="py-4 px-6">
                          <select
                            value={student.batchId || selectedBatch.id}
                            onChange={async (e) => {
                              const newBatchId = e.target.value;
                              const targetB = batches.find((b) => b.id === newBatchId || b.code === newBatchId);
                              if (!targetB) return;

                              try {
                                await apiRequest(`${ENDPOINTS.ADMIN_STUDENTS}/${student.id}`, {
                                  method: "PUT",
                                  body: JSON.stringify({ batchId: targetB.id })
                                });

                                setCohortStudents(
                                  cohortStudents.map((s) =>
                                    s.id === student.id ? { ...s, batchCode: targetB.code, batchId: targetB.id } : s
                                  )
                                );

                                showNotification(`Student "${student.name}" moved to batch "${targetB.name}" (${targetB.code})!`);
                                await fetchBatchesData();
                                if (selectedBatch) {
                                  await handleOpenBatchDirectory(selectedBatch);
                                }
                              } catch (err: unknown) {
                                showNotification((err as Error).message || "Failed to change student batch.");
                              }
                            }}
                            className="h-9 px-3 rounded-xl bg-white border border-stone-200 text-stone-800 font-bold text-xs focus:outline-none focus:border-[#9E0C25] cursor-pointer"
                          >
                            {batches
                              .filter((b) => !selectedBatch?.course || b.course === selectedBatch.course || (b as unknown as { courseName?: string }).courseName === selectedBatch.course)
                              .map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.code} ({b.name})
                                </option>
                              ))}
                          </select>
                        </td>

                        <td className="py-4 px-6 font-semibold text-stone-600">
                          {student.joiningDate}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 font-bold text-stone-700">
                            <FileText className="w-4 h-4 text-stone-400" />
                            <span>{student.assignmentsSubmitted}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= REGISTERED STUDENT PICKER MODAL ================= */}
      {isStudentPickerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-stone-200 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-xl text-[#0B1C30] tracking-tight">Select Students to Enroll</h3>
                <p className="text-xs text-stone-500 font-medium">
                  Showing enrolled students for: <span className="font-bold text-[#9E0C25]">{activeTargetCourseTitle || "Selected Course"}</span>
                </p>
              </div>
              <button
                onClick={() => setIsStudentPickerOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search students enrolled in ${activeTargetCourseTitle || "this course"}...`}
                value={studentPickerSearch}
                onChange={(e) => setStudentPickerSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:bg-white focus:outline-none focus:border-[#9E0C25]"
              />
            </div>

            {/* Students List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[200px]">
              {courseEnrolledAvailableStudents.length === 0 ? (
                <div className="p-8 text-center text-stone-400 font-semibold text-xs space-y-1.5">
                  <p className="text-stone-700 font-bold">
                    No students currently enrolled in &quot;{activeTargetCourseTitle || "this course"}&quot;.
                  </p>
                  <p className="text-[11px] text-stone-400 font-normal">
                    Only students registered and enrolled in this specific course will appear here to be added to this batch.
                  </p>
                </div>
              ) : (
                courseEnrolledAvailableStudents
                  .filter((s) => studentPickerSearch === "" || s.name.toLowerCase().includes(studentPickerSearch.toLowerCase()) || s.email.toLowerCase().includes(studentPickerSearch.toLowerCase()))
                  .map((stu) => {
                    const isSelected = selectedStudentIds.includes(stu.id);
                    return (
                      <div
                        key={stu.id}
                        onClick={() => toggleStudentPickerSelection(stu.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-rose-50/80 border-[#9E0C25]"
                            : "bg-white border-stone-200/80 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={stu.avatar || "/Ananya.png"} alt={stu.name} className="w-9 h-9 rounded-full object-cover border border-stone-200" />
                          <div>
                            <h5 className="font-bold text-stone-900 text-xs">{stu.name}</h5>
                            <p className="text-[10.5px] font-semibold text-stone-400">{stu.email}</p>
                            {stu.course && (
                              <span className="text-[10px] text-[#9E0C25] font-bold block pt-0.5">
                                📚 {stu.course}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected ? "bg-[#9E0C25] border-[#9E0C25] text-white" : "border-stone-300 bg-white"
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500">{selectedStudentIds.length} selected</span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudentPickerOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmSelectedStudentsToBatch}
                  className="px-5 py-2 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-xs cursor-pointer uppercase"
                >
                  Enroll Selected
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
