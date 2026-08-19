"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  SlidersHorizontal,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Calendar,
  Clock,
  Send,
  X,
  FileText,
  Upload,
  Link2,
  ChevronDown,
  Bold,
  Italic,
  List,
  Video,
  Sliders
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { openThemeSuccess, openThemeError } from "@/components/ThemeDialogProvider";

interface StudentPracticeSubmission {
  id: string;
  studentId?: string;
  studentName: string;
  studentAvatar: string;
  submissionDate: string;
  courseBatch: string;
  videoTitle: string;
  status: "PENDING" | "REVIEWED" | "NEEDS IMPROVEMENT";
  fileUrl?: string;
}

interface StudentSubmissionHistoryItem {
  id: string;
  videoTitle: string;
  thumbnail: string;
  fileUrl?: string;
  submissionDate: string;
  courseBatch: string;
  status: "Reviewed" | "Needs Improvement" | "Pending";
  marks: string;
  correctionNotes?: string[];
  feedbackNotes?: string;
  scoreBreakdown?: any[];
}

const formatMediaUrl = (rawUrl?: string): string => {
  if (!rawUrl || rawUrl.trim() === "" || rawUrl === "null" || rawUrl === "undefined") {
    return "";
  }
  let clean = rawUrl.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("blob:")) {
    return clean;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const backendRoot = apiBase.replace(/\/api\/v1\/?$/, "");
  const relativePath = clean.startsWith("/") ? clean : `/${clean}`;
  return `${backendRoot}${relativePath}`;
};

const formatDisplayTitle = (rawTitle?: string): string => {
  if (!rawTitle) return "Tatkar Footwork Practice";
  const clean = rawTitle.trim();
  const lower = clean.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm") || /^\d{5,}/.test(clean)) {
    return "Tatkar Footwork Practice";
  }
  return clean;
};

const formatScoreDisplay = (rawMarks: any): string => {
  if (rawMarks === null || rawMarks === undefined || rawMarks === "" || rawMarks === "— N/A —") {
    return "— N/A —";
  }
  const val = parseFloat(String(rawMarks).replace("/100", "").replace("/10", ""));
  if (isNaN(val)) return "— N/A —";
  const score100 = val <= 10 ? val * 10 : val;
  return `${Math.round(score100)}/100`;
};

interface VideoTaskRecord {
  id: string;
  title: string;
  category: string;
  course: string;
  batchName: string;
  priority: string;
  submissionDate: string;
  cutOffTime: string;
  strictDeadline: boolean;
  detailedInstructions?: string;
  referenceFileUrl?: string;
  createdByName?: string;
  createdAt: string;
}

export default function VideoReviewView() {
  const [submissionsList, setSubmissionsList] = useState<StudentPracticeSubmission[]>([]);
  const [createdTasksList, setCreatedTasksList] = useState<VideoTaskRecord[]>([]);
  const [studentHistoryList, setStudentHistoryList] = useState<StudentSubmissionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Navigation View State: 'DIRECTORY' | 'HISTORY' | 'EVALUATION' | 'ASSIGN_TASK'
  const [viewMode, setViewMode] = useState<"DIRECTORY" | "HISTORY" | "EVALUATION" | "ASSIGN_TASK">("DIRECTORY");
  const [activeTab, setActiveTab] = useState<"SUBMISSIONS" | "TASKS">("SUBMISSIONS");
  const [selectedStudent, setSelectedStudent] = useState<StudentPracticeSubmission | null>(null);
  const [selectedVideoItem, setSelectedVideoItem] = useState<StudentSubmissionHistoryItem | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "REVIEWED" | "NEEDS_IMPROVEMENT">("ALL");

  // Dynamic Courses & Batches from Backend DB
  const [dbCourses, setDbCourses] = useState<{ id: string; title: string; category?: string }[]>([]);
  const [dbBatches, setDbBatches] = useState<{ id: string; name: string; courseId?: string; courseName?: string; course?: string }[]>([]);

  // Assign Task Form State (100% Dynamic DB Data)
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskCourse, setTaskCourse] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [taskBatch, setTaskBatch] = useState("");
  const [taskInstructions, setTaskInstructions] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [cutoffTime, setCutoffTime] = useState("18:00");
  const [strictDeadline, setStrictDeadline] = useState(false);

  // Filter batches dynamically based on selected course (Returns EMPTY if no course selected)
  const filteredBatches = useMemo(() => {
    if (!taskCourse) return [];
    const matchedCourse = dbCourses.find(c => c.title === taskCourse || c.id === taskCourse);
    
    return dbBatches.filter(
      (b) =>
        (matchedCourse && b.courseId === matchedCourse.id) ||
        (b.courseName && b.courseName.toLowerCase() === taskCourse.toLowerCase()) ||
        (b.course && b.course.toLowerCase() === taskCourse.toLowerCase())
    );
  }, [dbBatches, dbCourses, taskCourse]);

  // Fetch real practice video submissions from PostgreSQL DB backend
  const fetchDirectory = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter && statusFilter !== "ALL") queryParams.set("status", statusFilter);
      if (searchTerm.trim()) queryParams.set("search", searchTerm.trim());

      const url = `/video/directory${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const res = await apiRequest<{ data?: any[] }>(url);
      if (res && Array.isArray(res.data)) {
        const mapped: StudentPracticeSubmission[] = res.data.map((item: any, idx: number) => ({
          id: String(item.id || `prac-${idx + 1}`),
          studentId: String(item.studentId || item.id || `STU-${idx + 400}`),
          studentName: item.studentName || item.student || "Student",
          studentAvatar: item.studentAvatar || item.avatar || "",
          submissionDate: item.submissionDate ? new Date(item.submissionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—",
          courseBatch: item.courseAndBatch || (item.studentBatch ? `${item.studentBatch}` : "Kathak Foundations"),
          videoTitle: item.videoTitle || item.title || "Practice Video",
          status: item.status === "NEEDS_IMPROVEMENT" ? "NEEDS IMPROVEMENT" : (item.status === "REVIEWED" ? "REVIEWED" : "PENDING"),
          fileUrl: item.fileUrl || item.url || ""
        }));
        setSubmissionsList(mapped);
      }
    } catch {
      setSubmissionsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async (forceSelectTasks: boolean = false) => {
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm.trim()) queryParams.set("search", searchTerm.trim());

      const url = `/video/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const res = await apiRequest<{ data?: VideoTaskRecord[] }>(url);
      if (res && Array.isArray(res.data)) {
        setCreatedTasksList(res.data);
        if (forceSelectTasks || res.data.length > 0) {
          setActiveTab("TASKS");
        }
      }
    } catch {
      setCreatedTasksList([]);
    }
  };

  useEffect(() => {
    fetchDirectory();
    fetchTasks(true);

    // Fetch dynamic courses & batches from PostgreSQL DB
    const fetchMetadata = async () => {
      try {
        const cRes = await apiRequest<any>("/courses");
        const courseList = Array.isArray(cRes?.data?.courses)
          ? cRes.data.courses
          : Array.isArray(cRes?.data)
          ? cRes.data
          : Array.isArray(cRes)
          ? cRes
          : [];

        if (courseList.length > 0) {
          setDbCourses(courseList);
        }
      } catch {}

      try {
        const bRes = await apiRequest<any>("/batches");
        const batchList = Array.isArray(bRes?.data?.batches)
          ? bRes.data.batches
          : Array.isArray(bRes?.data)
          ? bRes.data
          : Array.isArray(bRes)
          ? bRes
          : [];

        if (batchList.length > 0) {
          setDbBatches(batchList);
        }
      } catch {}
    };
    fetchMetadata();
  }, []);

  // Compute dynamic summary metrics from real database data
  const totalVideosCount = submissionsList.length;
  const pendingCount = submissionsList.filter(s => s.status === "PENDING").length;
  const reviewedCount = submissionsList.filter(s => s.status === "REVIEWED").length;

  // Filtered submissions list
  const filteredSubmissions = useMemo(() => {
    let list = submissionsList;
    if (statusFilter !== "ALL") {
      const matchStatus = statusFilter === "NEEDS_IMPROVEMENT" ? "NEEDS IMPROVEMENT" : statusFilter;
      list = list.filter(s => s.status === matchStatus);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        s =>
          s.studentName.toLowerCase().includes(q) ||
          s.videoTitle.toLowerCase().includes(q) ||
          s.courseBatch.toLowerCase().includes(q)
      );
    }
    return list;
  }, [submissionsList, statusFilter, searchTerm]);

  // Filtered created tasks list
  const filteredTasks = useMemo(() => {
    let list = createdTasksList;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.course && t.course.toLowerCase().includes(q)) ||
          (t.batchName && t.batchName.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [createdTasksList, searchTerm]);

  // Reference File Upload State
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedReference, setUploadedReference] = useState<{ name: string; url: string } | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const handleMediaFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiRequest<any>("/upload/video", {
        method: "POST",
        body: formData,
      });

      const uploadedUrl =
        res?.data?.url || res?.data?.fileUrl || res?.data?.directUrl || res?.url || res?.fileUrl || URL.createObjectURL(file);
      setUploadedReference({ name: file.name, url: uploadedUrl });
    } catch {
      const localUrl = URL.createObjectURL(file);
      setUploadedReference({ name: file.name, url: localUrl });
    } finally {
      setIsUploadingMedia(false);
    }
  };

interface CriteriaItem {
  label: string;
  score: number;
}

  // Video Evaluation Form State
  const [isPlaying, setIsPlaying] = useState(false);
  const [criteriaList, setCriteriaList] = useState<CriteriaItem[]>([]);
  const [newCriteriaLabel, setNewCriteriaLabel] = useState("");
  const [correctionNotes, setCorrectionNotes] = useState<string[]>([]);
  const [newNoteInput, setNewNoteInput] = useState("");
  const [comprehensiveReview, setComprehensiveReview] = useState("");

  const calculatedAvgScore = useMemo(() => {
    if (!criteriaList || criteriaList.length === 0) return 0;
    const sum = criteriaList.reduce((acc, c) => acc + (Number(c.score) || 0), 0);
    return Math.round(sum / criteriaList.length);
  }, [criteriaList]);

  const handleAddCriteria = () => {
    if (newCriteriaLabel.trim()) {
      setCriteriaList([...criteriaList, { label: newCriteriaLabel.trim(), score: 80 }]);
      setNewCriteriaLabel("");
    }
  };

  const handleRemoveCriteria = (index: number) => {
    setCriteriaList(criteriaList.filter((_, i) => i !== index));
  };

  const handleUpdateCriteriaScore = (index: number, score: number) => {
    const updated = [...criteriaList];
    updated[index].score = Math.min(100, Math.max(0, score));
    setCriteriaList(updated);
  };

  const handleOpenStudentHistory = async (student: StudentPracticeSubmission) => {
    setSelectedStudent(student);
    setViewMode("HISTORY");

    if (student.studentId) {
      try {
        const res = await apiRequest<{ data?: any[] }>(`/video/student/${student.studentId}/history`);
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mappedHistory: StudentSubmissionHistoryItem[] = res.data.map((item: any, idx: number) => {
            let corrArr: string[] = [];
            if (Array.isArray(item.correctionNotes)) {
              corrArr = item.correctionNotes.filter(Boolean);
            } else if (typeof item.correctionNotes === "string" && item.correctionNotes.trim()) {
              corrArr = [item.correctionNotes];
            }

            let parsedRubric: CriteriaItem[] | null = null;
            if (Array.isArray(item.scoreBreakdown)) {
              parsedRubric = item.scoreBreakdown as CriteriaItem[];
            } else if (item.rubric) {
              try {
                parsedRubric = typeof item.rubric === "string" ? JSON.parse(item.rubric) as CriteriaItem[] : item.rubric as CriteriaItem[];
              } catch {}
            }

            return {
              id: String(item.id || `hist-${idx + 1}`),
              videoTitle: String(item.videoTitle || item.title || "Kathak Practice Video"),
              thumbnail: String(item.fileUrl || "/kathak_course_dancer_1785146082697.jpg"),
              fileUrl: String(item.fileUrl || item.url || ""),
              submissionDate: item.submissionDate ? new Date(item.submissionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              courseBatch: String(item.courseAndBatch || "Kathak Advanced / Alpha"),
              status: item.status === "NEEDS_IMPROVEMENT" ? "Needs Improvement" : (item.status === "REVIEWED" ? "Reviewed" : "Pending"),
              marks: formatScoreDisplay(item.marks),
              scoreBreakdown: parsedRubric || undefined,
              correctionNotes: corrArr,
              feedbackNotes: typeof item.feedbackNotes === "string" ? item.feedbackNotes : (typeof item.overallReview === "string" ? item.overallReview : "")
            };
          });
          setStudentHistoryList(mappedHistory);
        } else if (student.fileUrl) {
          setStudentHistoryList([{
            id: student.id,
            videoTitle: student.videoTitle,
            thumbnail: student.fileUrl,
            fileUrl: student.fileUrl,
            submissionDate: student.submissionDate,
            courseBatch: student.courseBatch,
            status: student.status === "REVIEWED" ? "Reviewed" : (student.status === "NEEDS IMPROVEMENT" ? "Needs Improvement" : "Pending"),
            marks: "— N/A —",
            correctionNotes: [],
            feedbackNotes: ""
          }]);
        }
      } catch {
        // Keeps state
      }
    }
  };

  const handleOpenVideoEvaluation = (videoItem: StudentSubmissionHistoryItem) => {
    setSelectedVideoItem(videoItem);
    if (Array.isArray(videoItem.scoreBreakdown) && videoItem.scoreBreakdown.length > 0) {
      setCriteriaList(videoItem.scoreBreakdown);
    } else {
      setCriteriaList([]);
    }
    setCorrectionNotes(Array.isArray(videoItem.correctionNotes) ? videoItem.correctionNotes : []);
    setComprehensiveReview(videoItem.feedbackNotes || "");
    setViewMode("EVALUATION");
  };

  const handleAddNote = () => {
    if (newNoteInput.trim()) {
      setCorrectionNotes([...correctionNotes, newNoteInput.trim()]);
      setNewNoteInput("");
    }
  };

  const handleRemoveNote = (index: number) => {
    setCorrectionNotes(correctionNotes.filter((_, i) => i !== index));
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoItem) return;

    const submissionId = selectedVideoItem.id || selectedStudent?.id || "";
    if (!submissionId || submissionId.startsWith("hist-")) {
      console.error("Submission ID missing for evaluation.");
      openThemeError("Submission ID missing. Please refresh and try again.", "Evaluation Error");
      return;
    }

    const score100 = calculatedAvgScore;

    try {
      await apiRequest(`/video/evaluate/${submissionId}`, {
        method: "POST",
        body: JSON.stringify({
          score: score100,
          status: "REVIEWED",
          correctionNotes,
          overallReview: comprehensiveReview,
          rubric: criteriaList,
          scoreBreakdown: criteriaList,
        }),
      });
    } catch (err) {
      console.error("Evaluation save error:", err);
    }

    // Auto-update local state immediately so UI pills auto-update on screen
    const updatedItem: StudentSubmissionHistoryItem = {
      ...selectedVideoItem,
      status: "Reviewed",
      marks: `${score100}/100`,
      scoreBreakdown: criteriaList,
      correctionNotes,
      feedbackNotes: comprehensiveReview,
    };
    setSelectedVideoItem(updatedItem);

    // Update in history list
    setStudentHistoryList((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );

    // Update in main directory submissions list
    setSubmissionsList((prev) =>
      prev.map((sub) =>
        sub.id === updatedItem.id
          ? { ...sub, status: "REVIEWED", marks: score100 }
          : sub
      )
    );

    openThemeSuccess(
      "Review Submitted!",
      `Average evaluation score of ${score100}% saved for ${selectedVideoItem.videoTitle}.`
    );
    await fetchDirectory();
    setViewMode("HISTORY");
  };

  const [taskErrors, setTaskErrors] = useState<{
    title?: string;
    category?: string;
    course?: string;
    batch?: string;
    submissionDate?: string;
    cutoffTime?: string;
    instructions?: string;
  }>({});

  const validateTaskForm = (): boolean => {
    const errs: typeof taskErrors = {};

    if (!taskTitle.trim()) {
      errs.title = "Task title is required.";
    } else if (taskTitle.trim().length < 3) {
      errs.title = "Task title must be at least 3 characters long.";
    }

    if (!taskCategory.trim()) {
      errs.category = "Please select a category.";
    }

    if (!taskCourse.trim()) {
      errs.course = "Please select a course.";
    }

    if (!taskBatch.trim()) {
      errs.batch = "Please select a target batch.";
    }

    if (!submissionDate) {
      errs.submissionDate = "Submission date is required.";
    } else {
      const selectedD = new Date(submissionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedD < today) {
        errs.submissionDate = "Submission date cannot be in the past.";
      }
    }

    if (!cutoffTime) {
      errs.cutoffTime = "Cut-off time is required.";
    }

    if (!taskInstructions.trim()) {
      errs.instructions = "Detailed instructions are required.";
    } else if (taskInstructions.trim().length < 10) {
      errs.instructions = "Instructions must be at least 10 characters long.";
    }

    setTaskErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAssignTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTaskForm()) {
      return;
    }

    try {
      const res = await apiRequest<{ status?: string; message?: string }>("/video/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: taskTitle,
          category: taskCategory,
          course: taskCourse,
          batchName: taskBatch,
          priority: taskPriority,
          submissionDate,
          cutOffTime: cutoffTime,
          strictDeadline,
          detailedInstructions: taskInstructions,
          referenceFileUrl: uploadedReference?.url || null,
        }),
      });

      if (res && res.status === "error") {
        alert(res.message || "Failed to assign task.");
        return;
      }
    } catch {
      // Local fallback
    }

    openThemeSuccess("Task Assigned Successfully!", `Practice task "${taskTitle}" assigned to batch ${taskBatch}.`);
    await fetchDirectory();
    setViewMode("DIRECTORY");
  };

  return (
    <div>
      {/* ================= TIER 1: STUDENT PRACTICE SUBMISSIONS MAIN DIRECTORY ================= */}
      {viewMode === "DIRECTORY" && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Header & Top Action Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-sans font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Student Practice Submissions
              </h1>
            </div>

            <button
              onClick={() => setViewMode("ASSIGN_TASK")}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Task</span>
            </button>
          </div>

          {/* 4 Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL VIDEOS</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">
                {totalVideosCount > 0 ? totalVideosCount.toLocaleString() : "0"}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">CREATED TASKS</p>
              <h3 className="font-sans font-extrabold text-3xl text-indigo-600 mt-1">
                {createdTasksList.length}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">PENDING REVIEW</p>
              <h3 className="font-sans font-extrabold text-3xl text-rose-600 mt-1">
                {pendingCount}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">REVIEWED</p>
              <h3 className="font-sans font-extrabold text-3xl text-emerald-600 mt-1">
                {reviewedCount}
              </h3>
            </div>
          </div>

          {/* Directory & Created Tasks Container */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Tab Switcher */}
              <div className="flex items-center gap-2 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200/70">
                <button
                  type="button"
                  onClick={() => setActiveTab("SUBMISSIONS")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "SUBMISSIONS"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Student Submissions ({submissionsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("TASKS")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "TASKS"
                      ? "bg-[#9E0C25] text-white shadow-xs"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Assigned Practice Tasks ({createdTasksList.length})
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                {/* Search Bar */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student or video..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="relative flex items-center">
                  <div className="h-9 px-3 rounded-xl bg-[#EBF3FE] text-[#2563EB] font-extrabold text-xs border border-blue-100 flex items-center gap-1.5 cursor-pointer">
                    <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as unknown as "ALL" | "PENDING" | "REVIEWED" | "NEEDS_IMPROVEMENT")}
                      className="bg-transparent text-[#2563EB] font-extrabold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {activeTab === "SUBMISSIONS" ? (
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                      <th className="py-3.5 px-4">STUDENT</th>
                      <th className="py-3.5 px-4">SUBMISSION DATE</th>
                      <th className="py-3.5 px-4">COURSE &amp; BATCH</th>
                      <th className="py-3.5 px-4">VIDEO TITLE</th>
                      <th className="py-3.5 px-4">STATUS</th>
                      <th className="py-3.5 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                          {isLoading ? "Loading video submissions from database..." : "No practice video submissions found in directory."}
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((row) => (
                        <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={row.studentAvatar || "/Ananya.png"} alt={row.studentName} className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0" />
                              <button
                                onClick={() => handleOpenStudentHistory(row)}
                                className="font-bold text-stone-900 text-sm hover:text-[#9E0C25] transition-colors cursor-pointer text-left"
                              >
                                {row.studentName}
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-stone-600 font-semibold">{row.submissionDate}</td>
                          <td className="py-4 px-4 text-stone-700 font-bold">{row.courseBatch}</td>
                          <td className="py-4 px-4 font-bold text-stone-900 text-sm">{row.videoTitle}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold ${
                              row.status === "PENDING"
                                ? "bg-purple-100/80 text-purple-700 border border-purple-200/60"
                                : row.status === "REVIEWED"
                                ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200/60"
                                : "bg-rose-100/80 text-rose-700 border border-rose-200/60"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                row.status === "PENDING" ? "bg-purple-600" : row.status === "REVIEWED" ? "bg-emerald-500" : "bg-rose-500"
                              }`} />
                              {row.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleOpenStudentHistory(row)}
                              title="View Student History"
                              className="p-2 hover:text-[#9E0C25] hover:bg-rose-50 rounded-xl text-stone-400 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4.5 h-4.5 text-indigo-600" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                      <th className="py-3.5 px-4">TASK TITLE</th>
                      <th className="py-3.5 px-4">COURSE &amp; BATCH</th>
                      <th className="py-3.5 px-4">CATEGORY &amp; PRIORITY</th>
                      <th className="py-3.5 px-4">DEADLINE</th>
                      <th className="py-3.5 px-4">CREATED BY</th>
                      <th className="py-3.5 px-4 text-right">REFERENCE MEDIA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                          {createdTasksList.length === 0 ? "No practice tasks created yet. Click \"+ Assign New Task\" to create one." : "No tasks match your search filter."}
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-4 px-4 font-bold text-stone-900 text-sm">
                            {task.title}
                          </td>
                          <td className="py-4 px-4 text-stone-700 font-bold">
                            {task.course || "Kathak"} • {task.batchName || "All Batches"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                                {task.category || "BASIC"}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                task.priority === "High"
                                  ? "bg-rose-100 text-rose-700"
                                  : task.priority === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}>
                                {task.priority || "Low"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-stone-600 font-semibold">
                            {task.submissionDate ? new Date(task.submissionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No deadline"}
                            <span className="text-[11px] text-stone-400 font-medium block">
                              Cut-off: {task.cutOffTime || "18:00"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-stone-700 font-semibold">
                            {task.createdByName || "Admin"}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {task.referenceFileUrl ? (
                              <a
                                href={task.referenceFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-[#9E0C25] font-bold text-xs hover:bg-rose-100 transition-colors"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>View Media</span>
                              </a>
                            ) : (
                              <span className="text-stone-400 italic text-[11px]">No Media</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TIER 2: STUDENT SUBMISSION HISTORY VIEW ================= */}
      {viewMode === "HISTORY" && selectedStudent && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Back Navigation Header */}
          <button
            onClick={() => setViewMode("DIRECTORY")}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Video Review Hub &gt; <strong className="text-[#9E0C25]">{selectedStudent.studentName}</strong></span>
          </button>

          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedStudent.studentAvatar}
                alt={selectedStudent.studentName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md bg-stone-100 shrink-0"
              />
              <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center absolute bottom-1 right-1 shadow-xs border-2 border-white">
                <CheckCircle2 className="w-4 h-4 fill-white text-sky-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900">
                  {selectedStudent.studentName}
                </h2>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-[#9E0C25] text-xs font-extrabold border border-rose-200/80">
                  {selectedStudent.courseBatch || "Kathak Batch"}
                </span>
              </div>

              <div className="space-y-1 text-xs font-semibold text-stone-500">
                <p className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#9E0C25]" />
                  <span>{selectedStudent.courseBatch || "Kathak Practice Sessions"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Submission History Section */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-sans font-bold text-lg text-stone-900">Submission History</h3>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <button className="px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-100 cursor-pointer shrink-0">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Submission History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">VIDEO TITLE</th>
                    <th className="py-3.5 px-4">SUBMISSION DATE</th>
                    <th className="py-3.5 px-4">COURSE/BATCH</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4">MARKS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {studentHistoryList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                        No practice video submission history found for this student.
                      </td>
                    </tr>
                  ) : (
                    studentHistoryList.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* Video Title & Video Cover Image Thumbnail */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-xl bg-stone-950 overflow-hidden shrink-0 border border-stone-800 shadow-2xs group cursor-pointer" onClick={() => handleOpenVideoEvaluation(item)}>
                            {item.fileUrl || item.thumbnail ? (
                              <video
                                src={formatMediaUrl(item.fileUrl || item.thumbnail)}
                                preload="metadata"
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform bg-stone-900"
                              />
                            ) : (
                              <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                                <Video className="w-4 h-4 text-rose-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                              <Play className="w-3.5 h-3.5 fill-white text-white opacity-90" />
                            </div>
                          </div>
                          <span className="font-bold text-stone-900 text-sm hover:text-[#9E0C25] transition-colors cursor-pointer" onClick={() => handleOpenVideoEvaluation(item)}>
                            {formatDisplayTitle(item.videoTitle)}
                          </span>
                        </div>
                      </td>

                      {/* Submission Date */}
                      <td className="py-4 px-4 text-stone-600 font-semibold">{item.submissionDate}</td>

                      {/* Course/Batch */}
                      <td className="py-4 px-4 text-stone-700 font-bold">{item.courseBatch}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold ${
                          item.status === "Reviewed"
                            ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200/60"
                            : item.status === "Needs Improvement"
                            ? "bg-amber-100/80 text-amber-700 border border-amber-200/60"
                            : "bg-purple-100/80 text-purple-700 border border-purple-200/60"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Reviewed" ? "bg-emerald-500" : item.status === "Needs Improvement" ? "bg-amber-500" : "bg-purple-600"
                          }`} />
                          {item.status}
                        </span>
                      </td>

                      {/* Marks */}
                      <td className="py-4 px-4 font-extrabold text-stone-900 text-sm">{item.marks}</td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenVideoEvaluation(item)}
                          title="Open Video Evaluation Workspace"
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-rose-700 font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-4.5 h-4.5 text-rose-700" />
                        </button>
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

      {/* ================= TIER 3: DETAILED VIDEO EVALUATION & FEEDBACK VIEW ================= */}
      {viewMode === "EVALUATION" && selectedStudent && selectedVideoItem && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1350px] mx-auto">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
            <button onClick={() => setViewMode("DIRECTORY")} className="hover:text-stone-900 cursor-pointer">VIDEO MANAGEMENT</button>
            <span>&gt;</span>
            <button onClick={() => setViewMode("HISTORY")} className="hover:text-stone-900 cursor-pointer">KATHAK SUBMISSIONS</button>
            <span>&gt;</span>
            <span className="text-[#9E0C25] font-bold uppercase">{selectedStudent.studentName}</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT / CENTER VIDEO PLAYER & STUDENT DETAILS COLUMN */}
            <div className="flex-1 w-full space-y-6">
              
              {/* Large Video Title */}
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900">
                {formatDisplayTitle(selectedVideoItem.videoTitle)}
              </h1>

              {/* High-Performance Real HTML5 Video Player Container */}
              <div className="relative aspect-video rounded-3xl bg-black overflow-hidden shadow-2xl border border-stone-800 flex items-center justify-center p-2">
                {selectedVideoItem?.fileUrl || selectedVideoItem?.thumbnail ? (
                  <video
                    src={formatMediaUrl(selectedVideoItem.fileUrl || selectedVideoItem.thumbnail)}
                    controls
                    preload="metadata"
                    playsInline
                    controlsList="nodownload"
                    className="w-full h-full max-h-[460px] object-contain rounded-2xl bg-black"
                  />
                ) : (
                  <div className="text-stone-400 text-xs font-semibold p-8 text-center">
                    No video media file available for playback.
                  </div>
                )}
              </div>

              {/* Student Details Banner Box */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedStudent.studentAvatar || "/Ananya.png"}
                    alt={selectedStudent.studentName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-stone-200 shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-stone-900">{selectedStudent.studentName}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9E0C25] text-[10px] font-extrabold border border-rose-200">
                        {selectedStudent.courseBatch || "Kathak Batch"}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-stone-400 block mt-0.5 uppercase">
                      Registered Student
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs font-semibold text-stone-500">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">SUBMISSION DATE</span>
                  <span className="text-stone-900 font-bold">{selectedVideoItem.submissionDate}</span>
                </div>
              </div>

              {/* Dynamic Session Metadata Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-stone-400 block">COURSE &amp; BATCH</span>
                  <span className="font-bold text-stone-900 text-xs mt-0.5 block truncate">
                    {selectedVideoItem.courseBatch || selectedStudent.courseBatch || "Kathak Foundations"}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-stone-400 block">STATUS</span>
                  <span className="font-bold text-[#9E0C25] text-xs mt-0.5 block uppercase">
                    {selectedVideoItem.status || "Pending"}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-stone-400 block">EVALUATION MARKS</span>
                  <span className="font-bold text-stone-900 text-xs mt-0.5 block">
                    {selectedVideoItem.marks && selectedVideoItem.marks !== "— N/A —" ? selectedVideoItem.marks : "Pending Review"}
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: EVALUATION PANEL */}
            <div className="w-full lg:w-96 shrink-0 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 lg:sticky lg:top-[88px]">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-sans font-bold text-lg text-stone-900">Evaluation Panel</h3>
              </div>

              <form onSubmit={handleSubmitEvaluation} className="space-y-6">
                
                {/* CALCULATED OVERALL PERFORMANCE SCORE */}
                <div className="bg-gradient-to-br from-rose-50/80 via-white to-amber-50/40 border border-rose-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block">
                      OVERALL PERFORMANCE SCORE
                    </span>
                    <span className="text-3xl font-extrabold text-[#9E0C25]">
                      {criteriaList.length > 0 ? `${calculatedAvgScore}%` : "— %"}
                    </span>
                  </div>
                  <span className="bg-[#9E0C25] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    AUTO AVG TOTAL
                  </span>
                </div>

                {/* DYNAMIC EVALUATION CRITERIA BREAKDOWN */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      EVALUATION CRITERIA (SCORE / 100)
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold font-mono">DYNAMIC</span>
                  </div>

                  {/* Criteria Rows or Empty State */}
                  {criteriaList.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-stone-50/80 border border-dashed border-stone-200 text-center space-y-1">
                      <p className="text-xs font-bold text-stone-700">No Evaluation Criteria Added</p>
                      <p className="text-[11px] text-stone-400 font-medium leading-relaxed">
                        Add evaluation parameters below (e.g. Footwork, Rhythm, Posture) to calculate overall score %.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {criteriaList.map((item, index) => (
                        <div key={index} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 hover:bg-stone-100/60 transition-colors">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...criteriaList];
                              updated[index].label = e.target.value;
                              setCriteriaList(updated);
                            }}
                            placeholder="Criteria Name"
                            className="text-xs font-bold text-stone-900 bg-transparent focus:outline-none flex-1 min-w-0"
                          />

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg px-2.5 py-1 shadow-2xs">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={item.score}
                                onChange={(e) => handleUpdateCriteriaScore(index, Number(e.target.value))}
                                className="w-10 text-center text-xs font-extrabold text-[#9E0C25] bg-transparent focus:outline-none"
                              />
                              <span className="text-[10px] text-stone-400 font-bold">/100</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveCriteria(index)}
                              className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                              title="Remove parameter"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Criteria Bar */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="+ Add new criteria (e.g. Footwork)..."
                      value={newCriteriaLabel}
                      onChange={(e) => setNewCriteriaLabel(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCriteria(); } }}
                      className="flex-1 h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCriteria}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* CORRECTION NOTES */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      CORRECTION NOTES
                    </span>
                    <span onClick={handleAddNote} className="text-[10px] font-bold text-[#9E0C25] uppercase cursor-pointer hover:underline">Add Note +</span>
                  </div>

                  {/* Notes Bullet List */}
                  <div className="space-y-2">
                    {correctionNotes.length === 0 ? (
                      <p className="text-[11px] text-stone-400 font-medium italic">No correction notes added yet.</p>
                    ) : (
                      correctionNotes.map((note, index) => (
                        <div key={index} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs font-semibold text-rose-950 flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9E0C25] mt-1.5 shrink-0" />
                            <span>{note}</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveNote(index)} className="text-stone-400 hover:text-rose-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Input */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="+ Add a new correction note..."
                      value={newNoteInput}
                      onChange={(e) => setNewNoteInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNote(); } }}
                      className="flex-1 h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddNote}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* OVERALL COMPREHENSIVE REVIEW */}
                <div className="space-y-2">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 block">
                    OVERALL COMPREHENSIVE REVIEW
                  </span>
                  <textarea
                    rows={4}
                    value={comprehensiveReview}
                    onChange={(e) => setComprehensiveReview(e.target.value)}
                    placeholder="Provide detailed feedback on rhythm accuracy, facial expressions, and overall poise..."
                    className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all leading-relaxed"
                  />
                </div>

                {/* SUBMIT REVIEW BUTTON */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer text-center"
                >
                  Submit Review
                </button>

              </form>

            </div>

          </div>

          {/* BOTTOM SECTION: STUDENT SUBMISSION HISTORY GRID */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg text-stone-900">Student Submission History</h3>
              <button onClick={() => setViewMode("HISTORY")} className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">
                View All Recent
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "FOUNDATION STEP PATTERN", score: "9.2/10", time: "1 month ago", img: "/kathak_course_dancer_1785146082697.jpg" },
                { title: "FOOTWORK PATTERN - 1", score: "7.5/10", time: "1 month ago", img: "/kathak_dancer_portrait_1785143850699.jpg" },
                { title: "NAVARASA DRILL", score: "8.8/10", time: "2 months ago", img: "/gurukul-dancer.jpg" },
                { title: "ABHINAYA SPEED TEST", score: "9.0/10", time: "3 months ago", img: "/kathak_ghungroo_feet_1785143864334.jpg" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow group">
                  <div className="relative aspect-video rounded-xl bg-stone-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover opacity-85" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900 truncate">{card.title}</h5>
                    <div className="flex items-center justify-between text-[10.5px] font-semibold text-stone-400 mt-1">
                      <span className="text-emerald-600 font-extrabold">SCORE: {card.score}</span>
                      <span>{card.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= TIER 4: ASSIGN NEW TASK VIEW (100% EXACT FIGMA MATCH) ================= */}
      {viewMode === "ASSIGN_TASK" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1250px] mx-auto">
          
          {/* Top Breadcrumb & Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
                <button onClick={() => setViewMode("DIRECTORY")} className="hover:text-stone-900 cursor-pointer flex items-center gap-1 text-stone-500 font-medium">
                  <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
                  <span>Workload</span>
                </button>
                <span>&gt;</span>
                <span className="text-stone-500 font-medium">Student Profile</span>
                <span>&gt;</span>
                <span className="text-stone-900 font-bold">Assign Task</span>
              </div>
              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Assign New Task
              </h1>
            </div>

            <button
              onClick={handleAssignTaskSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Assign Task</span>
            </button>
          </div>

          <form onSubmit={handleAssignTaskSubmit} className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT COLUMN CARDS */}
            <div className="flex-1 w-full space-y-6">
              
              {/* CARD 1: Task Definition */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                    <Sliders className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-stone-900">Task Definition</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Task Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Tatkar Footwork Speed Test - 140 BPM"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Category</label>
                      <div className="relative">
                        <select
                          value={taskCategory}
                          onChange={(e) => setTaskCategory(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option value="">Select Category</option>
                          {Array.from(new Set(dbCourses.map(c => c.category).filter(Boolean))).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          {dbCourses.length === 0 && <option value="Kathak">Kathak</option>}
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Course</label>
                      <div className="relative">
                        <select
                          value={taskCourse}
                          onChange={(e) => {
                            const selectedCourseTitle = e.target.value;
                            setTaskCourse(selectedCourseTitle);
                            const matched = dbCourses.find(c => c.title === selectedCourseTitle);
                            if (matched?.category) setTaskCategory(matched.category);

                            // Relational batch filtering: auto select first batch belonging to this course
                            const courseBatches = dbBatches.filter(
                              (b) =>
                                (matched && b.courseId === matched.id) ||
                                (b.courseName && b.courseName.toLowerCase() === selectedCourseTitle.toLowerCase()) ||
                                (b.course && b.course.toLowerCase() === selectedCourseTitle.toLowerCase())
                            );

                            if (courseBatches.length > 0) {
                              setTaskBatch(courseBatches[0].name);
                            } else {
                              setTaskBatch("");
                            }
                          }}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option value="">Select Course</option>
                          {dbCourses.map((c) => (
                            <option key={c.id} value={c.title}>{c.title}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Priority Level</label>
                      <div className="flex items-center gap-1.5 p-1.5 bg-indigo-50/60 border border-indigo-100/60 rounded-xl">
                        {(["Low", "Medium", "High"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setTaskPriority(p)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              taskPriority === p
                                ? "bg-white text-stone-900 shadow-xs border border-stone-200/60"
                                : "text-stone-500 hover:text-stone-900"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Batch</label>
                      <div className="relative">
                        <select
                          value={taskBatch}
                          disabled={!taskCourse}
                          onChange={(e) => setTaskBatch(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:outline-none focus:border-stone-400 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {!taskCourse
                              ? "Select Course First"
                              : filteredBatches.length === 0
                              ? "No Batches Available for this Course"
                              : "Select Batch"}
                          </option>
                          {filteredBatches.map((b) => (
                            <option key={b.id || b.name} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Detailed Instructions WYSIWYG Box */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Detailed Instructions</label>
                    <div className="rounded-2xl border-2 border-dashed border-sky-400 bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-sky-200">
                      {/* Editor Toolbar */}
                      <div className="flex items-center gap-3 px-4 py-2 bg-stone-50 border-b border-stone-200 text-stone-500">
                        <button type="button" className="p-1 hover:text-stone-900 font-bold"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:text-stone-900 italic"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:text-stone-900"><List className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:text-stone-900"><Link2 className="w-3.5 h-3.5" /></button>
                      </div>

                      <textarea
                        rows={5}
                        value={taskInstructions}
                        onChange={(e) => setTaskInstructions(e.target.value)}
                        placeholder="Break down the footwork sequences and specify the Teental cycles to be maintained..."
                        className="w-full p-4 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Reference Media */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaFileSelect}
                  accept="video/*,image/*"
                  className="hidden"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-sans font-bold text-base text-stone-900">Reference Media</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer"
                  >
                    + Add Link / File
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploadedReference ? (
                    <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden border border-stone-200 shadow-xs group">
                      {uploadedReference.url.endsWith(".mp4") || uploadedReference.url.endsWith(".mov") || uploadedReference.url.startsWith("blob:") ? (
                        <video src={uploadedReference.url} controls className="w-full h-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={uploadedReference.url} alt="Reference" className="w-full h-full object-cover opacity-90" />
                      )}
                      <button
                        type="button"
                        onClick={() => setUploadedReference(null)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2 flex flex-col justify-end text-white bg-black/75 p-2 rounded-lg backdrop-blur-xs">
                        <span className="font-bold text-xs truncate">{uploadedReference.name}</span>
                        <span className="text-stone-300 text-[9px] font-medium uppercase">UPLOADED REFERENCE</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Upload Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 bg-stone-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#9E0C25] transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-stone-400" />
                    <h5 className="font-bold text-xs text-stone-800">
                      {isUploadingMedia ? "Uploading Media..." : "Click to upload or drag & drop"}
                    </h5>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">MAX SIZE: 50MB (MP4, MOV, JPG)</p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN CARD: DEADLINE */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-stone-900">Deadline</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Submission Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={submissionDate}
                        onChange={(e) => setSubmissionDate(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-900 focus:outline-none focus:border-stone-400 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Calendar className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Cut-off Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        required
                        value={cutoffTime}
                        onChange={(e) => setCutoffTime(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-900 focus:outline-none focus:border-stone-400 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Clock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStrictDeadline(!strictDeadline)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        strictDeadline ? "bg-[#9E0C25]" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        strictDeadline ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                    <span className="text-xs font-bold text-stone-700">Strict Deadline (No late subs)</span>
                  </div>
                </div>
              </div>
            </div>

          </form>

        </div>
      )}
    </div>
  );
}
