"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Calendar as CalendarIcon,
  Upload,
  Eye,
  SlidersHorizontal,
  GraduationCap,
  MapPin,
  Video,
  Trash2,
  FileText,
  X,
  Play,
  Share2,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

// Data Interfaces
export interface EvaluationCriterionItem {
  id: string;
  name: string;
  maxMarks: number;
  score: number;
}

export interface VideoSubmissionRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentBatch?: string;
  submissionDate: string;
  courseAndBatch: string;
  videoTitle: string;
  fileUrl?: string;
  status: "PENDING" | "REVIEWED" | "NEEDS_IMPROVEMENT";
  marks?: number | string;
  feedbackNotes?: string;
  correctionNotes?: string[];
  evaluationRubric?: EvaluationCriterionItem[];
}



export interface UnsubmittedStudentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  courseAndBatch: string;
  videoTitle: string;
  submissionDate: string;
  status: "NOT_SUBMITTED";
}

export interface VideoTaskRecord {
  id: string;
  title: string;
  category: string;
  course: string;
  batchId?: string;
  batchName: string;
  priority: string;
  submissionDate: string;
  cutOffTime: string;
  strictDeadline: boolean;
  detailedInstructions?: string;
  referenceFileUrl?: string;
  creatorRole?: string;
  createdById?: string;
  createdByName?: string;
  createdAt?: string;
}

export interface StudentProfileData {
  id: string;
  name: string;
  avatarUrl?: string;
  batch: string;
  diplomaLevel: string;
  campus: string;
}

// Format raw ISO dates and time into clean string (e.g., "Aug 9, 2026, 6:00 PM")
const formatDeadline = (dateStr?: string, timeStr?: string) => {
  if (!dateStr) return "—";
  try {
    const cleanDate = String(dateStr).split("T")[0];
    const parts = cleanDate.split("-");
    if (parts.length < 3) return `${dateStr} ${timeStr || ""}`.trim();

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const d = new Date(year, month - 1, day);
    const formattedDate = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    let formattedTime = timeStr || "18:00";
    if (formattedTime.includes(":")) {
      const [h, m] = formattedTime.split(":");
      const hourNum = parseInt(h, 10);
      if (!isNaN(hourNum)) {
        const ampm = hourNum >= 12 ? "PM" : "AM";
        const h12 = hourNum % 12 || 12;
        formattedTime = `${h12}:${m} ${ampm}`;
      }
    }

    return `${formattedDate}, ${formattedTime}`;
  } catch {
    return dateStr;
  }
};

// Shared mapping helper — used across directory fetch, task submissions fetch, and student history fetch
// to avoid triplicated mapping logic and keep field coverage consistent (incl. correctionNotes / evaluationRubric)
type SubmissionApiItem = Partial<VideoSubmissionRecord> & {
  avatarUrl?: string;
  videoUrl?: string;
  title?: string;
};

function mapToSubmissionRecord(
  item: SubmissionApiItem,
  idx: number,
  fallback: Partial<VideoSubmissionRecord> = {}
): VideoSubmissionRecord {
  return {
    id: String(item.id || `v-${idx}`),
    studentId: String(item.studentId || fallback.studentId || ""),
    studentName: item.studentName || fallback.studentName || "Student",
    studentAvatar: item.studentAvatar || item.avatarUrl || fallback.studentAvatar || "",
    studentBatch: item.studentBatch || fallback.studentBatch || "",
    submissionDate: item.submissionDate
      ? new Date(item.submissionDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : fallback.submissionDate || "—",
    courseAndBatch: item.courseAndBatch || fallback.courseAndBatch || "—",
    videoTitle: item.videoTitle || item.title || fallback.videoTitle || "Practice Video",
    fileUrl: item.fileUrl || item.videoUrl || "",
    status: (item.status || "PENDING") as VideoSubmissionRecord["status"],
    marks: item.marks !== null && item.marks !== undefined ? item.marks : "— N/A —",
    feedbackNotes: item.feedbackNotes || "",
    correctionNotes: Array.isArray(item.correctionNotes) ? item.correctionNotes : [],
    evaluationRubric: Array.isArray(item.evaluationRubric) ? item.evaluationRubric : [],
  };
}

// Basic URL scheme guard — prevents javascript:/data: URIs being stored as "reference links"
const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function TeacherVideoView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper to update URL Search Params without full page reloads (uses Next router so client-side nav state stays in sync)
  const updateUrlParams = (params: Record<string, string | null>) => {
    if (typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        currentUrl.searchParams.delete(key);
      } else {
        currentUrl.searchParams.set(key, value);
      }
    });

    router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
  };

  // Navigation View Modes: "TASKS_LIST" | "TASK_SUBMISSIONS" | "DIRECTORY" | "ASSIGN_TASK" | "STUDENT_HUB" | "EVALUATE_VIDEO"
  const [viewMode, setViewMode] = useState<"TASKS_LIST" | "TASK_SUBMISSIONS" | "DIRECTORY" | "ASSIGN_TASK" | "STUDENT_HUB" | "EVALUATE_VIDEO">("TASKS_LIST");

  // Tasks List & Active Task Submissions State
  const [tasksList, setTasksList] = useState<VideoTaskRecord[]>([]);
  const [selectedTask, setSelectedTask] = useState<VideoTaskRecord | null>(null);
  const [taskSubmissions, setTaskSubmissions] = useState<VideoSubmissionRecord[]>([]);
  const [unsubmittedStudents, setUnsubmittedStudents] = useState<UnsubmittedStudentRecord[]>([]);
  const [loadingTaskSubmissions, setLoadingTaskSubmissions] = useState(false);

  // Active Selected Student for Student Hub View
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileData | null>(null);

  // Student Hub Search & Filter State
  const [studentHubSearch, setStudentHubSearch] = useState("");
  const [studentHubStatusFilter, setStudentHubStatusFilter] = useState<"ALL" | "PENDING" | "REVIEWED" | "NEEDS_IMPROVEMENT">("ALL");

  // Active Selected Video for Full Detail Evaluation View
  const [selectedDetailVideo, setSelectedDetailVideo] = useState<VideoSubmissionRecord | null>(null);
  const [studentHistoryList, setStudentHistoryList] = useState<VideoSubmissionRecord[]>([]);

  // Dynamic Custom Evaluation Criteria State (Out of 100)
  const [criteriaList, setCriteriaList] = useState<EvaluationCriterionItem[]>([]);
  const [newCriterionName, setNewCriterionName] = useState("");
  const [newCriterionMaxMarks, setNewCriterionMaxMarks] = useState<number>(100);

  // Helper to add a new custom criterion
  const handleAddCriterion = () => {
    if (!newCriterionName.trim()) return;
    const maxM = newCriterionMaxMarks || 100;
    const newItem: EvaluationCriterionItem = {
      id: `crit-${Date.now()}`,
      name: newCriterionName.trim(),
      maxMarks: maxM,
      score: Math.round(maxM * 0.85),
    };
    const updated = [...criteriaList, newItem];
    setCriteriaList(updated);
    setNewCriterionName("");
    setNewCriterionMaxMarks(100);
    recalculateOverallScore(updated);
  };

  // Helper to update score of a specific criterion
  const handleUpdateCriterionScore = (id: string, score: number) => {
    const updated = criteriaList.map((item) => (item.id === id ? { ...item, score } : item));
    setCriteriaList(updated);
    recalculateOverallScore(updated);
  };

  // Helper to delete a criterion
  const handleDeleteCriterion = (id: string) => {
    const updated = criteriaList.filter((item) => item.id !== id);
    setCriteriaList(updated);
    recalculateOverallScore(updated);
  };

  // Helper to calculate total performance score out of 100
  const recalculateOverallScore = (list: EvaluationCriterionItem[]) => {
    if (list.length === 0) {
      setPerformanceScore10(85);
      return;
    }
    const totalScored = list.reduce((acc, curr) => acc + curr.score, 0);
    const totalMax = list.reduce((acc, curr) => acc + curr.maxMarks, 0);
    if (totalMax === 0) return;
    const avg100 = Math.round((totalScored / totalMax) * 100);
    setPerformanceScore10(avg100);
  };

  const [performanceScore10, setPerformanceScore10] = useState<number>(8.5);
  const [correctionNotes, setCorrectionNotes] = useState<string[]>([
    "Heel impact needs more weight",
    "Maintain upright posture during Chakkars"
  ]);
  const [newCorrectionNoteInput, setNewCorrectionNoteInput] = useState("");
  const [overallReviewText, setOverallReviewText] = useState("");

  // Submissions Data State
  const [submissions, setSubmissions] = useState<VideoSubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "REVIEWED" | "NEEDS_IMPROVEMENT" | "NOT_SUBMITTED">("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");

  // Assign New Task Form State
  const defaultFutureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [taskTitle, setTaskTitle] = useState("");
  const [category, setCategory] = useState("Kathak");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [submissionDate, setSubmissionDate] = useState(defaultFutureDate);
  const [cutOffTime, setCutOffTime] = useState("18:00");
  const [strictDeadline, setStrictDeadline] = useState(false);
  const [detailedInstructions, setDetailedInstructions] = useState("");

  // Reference Media state
  const [referenceFileUrl, setReferenceFileUrl] = useState("");
  const [referenceFileName, setReferenceFileName] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadMediaProgress, setUploadMediaProgress] = useState(0);
  const [showAddLinkInput, setShowAddLinkInput] = useState(false);
  const [customLinkInput, setCustomLinkInput] = useState("");
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaFileUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      alert("File size exceeds 100MB max limit.");
      return;
    }

    setUploadingMedia(true);
    setUploadMediaProgress(10);

    try {
      const isVideo = file.type.startsWith("video/");
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const endpoint = isVideo ? `${base}/upload/video` : `${base}/upload/image`;

      const token =
        localStorage.getItem("kathak_token") ||
        localStorage.getItem("kathak_teacher_token") ||
        localStorage.getItem("kathak_admin_token") ||
        "";

      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", endpoint, true);
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 90);
          setUploadMediaProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploadingMedia(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const resp = JSON.parse(xhr.responseText);
            const fileUrl = resp.data?.url || resp.url || resp.data?.fileUrl;
            if (fileUrl) {
              setReferenceFileUrl(fileUrl);
              setReferenceFileName(file.name);
              setUploadMediaProgress(100);
            } else {
              alert("File uploaded but URL was not returned.");
            }
          } catch {
            alert("Failed to parse upload server response.");
          }
        } else {
          alert(`Upload failed with status ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        setUploadingMedia(false);
        alert("Network error during file upload.");
      };

      xhr.send(formData);
    } catch (err: unknown) {
    setUploadingMedia(false);

    const message =
        err instanceof Error
            ? err.message
            : "Failed to upload file.";

    alert(message);
}
  };

  // Review & Evaluate Modal State
  const [selectedReviewVideo, setSelectedReviewVideo] = useState<VideoSubmissionRecord | null>(null);
  const [reviewScore, setReviewScore] = useState<number | string>(85);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState<"REVIEWED" | "NEEDS_IMPROVEMENT">("REVIEWED");

  // Dynamic Courses & Batches from Backend DB (Relational Hierarchy)
  type RelationalCourse = {
    id: string;
    title: string;
    category?: string;
    batches?: {
      id: string;
      name: string;
      code?: string;
      courseId?: string;
      courseName?: string;
    }[];
  };

  const [rawRelationalCourses, setRawRelationalCourses] =
    useState<RelationalCourse[]>([]);

  // Shared helper to keep both submissions & taskSubmissions lists in sync after any evaluation save
  const updateSubmissionInBothLists = (id: string, patch: Partial<VideoSubmissionRecord>) => {
    const updater = (sub: VideoSubmissionRecord) => (sub.id === id ? { ...sub, ...patch } : sub);
    setSubmissions((prev) => prev.map(updater));
    setTaskSubmissions((prev) => prev.map(updater));
  };

  // Open Task Submissions Detail View (Page 2)
  const openTaskSubmissions = async (task: VideoTaskRecord) => {
    setSelectedTask(task);
    setViewMode("TASK_SUBMISSIONS");
    setLoadingTaskSubmissions(true);
    setStatusFilter("ALL");
    updateUrlParams({ taskId: task.id, mode: null });

    let isCallActive = true;

    try {
      const res = await apiRequest<{
        status: string;
        data?: {
          task: VideoTaskRecord;
          submissions: VideoSubmissionRecord[];
          unsubmittedStudents: UnsubmittedStudentRecord[];
        };
      }>(`/video/tasks/${task.id}/submissions`);

      if (!isCallActive) return;

      if (res?.data) {
        if (Array.isArray(res.data.submissions)) {
          const mapped: VideoSubmissionRecord[] = res.data.submissions.map((item: any, idx: number) =>
            mapToSubmissionRecord(item, idx, {
              studentBatch: task.batchName,
              courseAndBatch: `${task.course} • ${task.batchName}`,
              videoTitle: task.title,
            })
          );
          setTaskSubmissions(mapped);
        } else {
          setTaskSubmissions([]);
        }

        if (Array.isArray(res.data.unsubmittedStudents)) {
          setUnsubmittedStudents(res.data.unsubmittedStudents);
        } else {
          setUnsubmittedStudents([]);
        }
      }
    } catch (err) {
      if (!isCallActive) return;
      console.error("Task submissions detail fetch error:", err);
      // Fallback filtering by task title
      const matching = submissions.filter(
        (s) => s.videoTitle.toLowerCase().includes(task.title.toLowerCase()) || task.title.toLowerCase().includes(s.videoTitle.toLowerCase())
      );
      setTaskSubmissions(matching);
    } finally {
      if (isCallActive) setLoadingTaskSubmissions(false);
    }

    return () => {
      isCallActive = false;
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. Submissions directory
        const res = await apiRequest<{ data?: any[] }>("/video/directory");
        if (isMounted && Array.isArray(res?.data)) {
          const mapped: VideoSubmissionRecord[] = res.data.map((item: any, idx: number) =>
            mapToSubmissionRecord(item, idx)
          );
          setSubmissions(mapped);
        }

        // 2. Fetch assigned tasks list
        try {
          const tasksRes = await apiRequest<{ data?: VideoTaskRecord[] }>("/video/tasks");
          if (isMounted && Array.isArray(tasksRes?.data)) {
            setTasksList(tasksRes.data);
          }
        } catch (err) {
          console.error("Assigned tasks fetch error:", err);
        }

        // 3. Fetch assigned courses & batches directly from backend API
        try {
          const assignedRes = await apiRequest<{
            data?: {
              courses?: Array<{
                id: string;
                title: string;
                category?: string;
                batches?: Array<{
                  id: string;
                  name: string;
                  code?: string;
                  courseId?: string;
                  courseName?: string;
                }>;
              }>;
            };
          }>("/video/teacher/assigned-courses-batches");

          const teacherCourses = assignedRes?.data?.courses || [];

          if (isMounted && teacherCourses.length > 0) {
            setRawRelationalCourses(teacherCourses);

            const initialCourse = teacherCourses[0];
            setCourse((prev) => (prev ? prev : initialCourse.title));
            if (initialCourse.category) {
              setCategory((prev) => (prev ? prev : initialCourse.category!));
            }

            const initialBatches = initialCourse.batches || [];
            if (initialBatches.length > 0) {
              setBatch((prev) => (prev ? prev : initialBatches[0].name));
            }
          }
        } catch (err) {
          console.error("Assigned courses & batches fetch error:", err);
        }
      } catch (err) {
        console.error("Video directory fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  // Restore active view & selection from URL Search Params on mount or refresh
  useEffect(() => {
    if (loading) return;

    const mode = searchParams.get("mode");
    const taskId = searchParams.get("taskId");
    const submissionId = searchParams.get("submissionId");

    if (mode === "assign") {
      setViewMode("ASSIGN_TASK");
    } else if (taskId && tasksList.length > 0) {
      const taskObj = tasksList.find((t) => String(t.id) === String(taskId));
      if (taskObj && selectedTask?.id !== taskObj.id) {
        openTaskSubmissions(taskObj);
      }
    }

    if (submissionId && (taskSubmissions.length > 0 || submissions.length > 0)) {
      const allSubs = [...taskSubmissions, ...submissions];
      const subObj = allSubs.find((s) => String(s.id) === String(submissionId));
      if (subObj && selectedDetailVideo?.id !== subObj.id) {
        setSelectedDetailVideo(subObj);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, tasksList, submissions, loading]);

  // Filtered Directory Submissions List (kept for potential directory search UI reuse)
  const filteredSubmissions = useMemo(() => {
    let list = submissions;

    if (statusFilter !== "ALL") {
      list = list.filter((s) => s.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.studentName.toLowerCase().includes(q) ||
          s.videoTitle.toLowerCase().includes(q) ||
          s.courseAndBatch.toLowerCase().includes(q)
      );
    }

    if (sortOrder === "OLDEST") {
      return [...list].reverse();
    }
    return list;
  }, [submissions, statusFilter, searchTerm, sortOrder]);

  // Filtered Student Hub Submissions (search + status filter wired to the Student Hub UI)
  const studentHubSubmissions = useMemo(() => {
    if (!selectedStudent) return [];
    let list = submissions.filter((s) => s.studentName === selectedStudent.name);

    if (studentHubStatusFilter !== "ALL") {
      list = list.filter((s) => s.status === studentHubStatusFilter);
    }

    if (studentHubSearch.trim()) {
      const q = studentHubSearch.toLowerCase();
      list = list.filter(
        (s) =>
          s.videoTitle.toLowerCase().includes(q) ||
          s.courseAndBatch.toLowerCase().includes(q)
      );
    }

    return list;
  }, [submissions, selectedStudent, studentHubSearch, studentHubStatusFilter]);

  // Open Student Video Profile Hub — fetches the real student profile instead of hardcoded placeholder data
  const openStudentHub = async (studentId: string, studentName: string) => {
    setStudentHubSearch("");
    setStudentHubStatusFilter("ALL");

    // Immediate fallback using data we already have client-side
    const existingSub = [...submissions, ...taskSubmissions].find(
      (s) => s.studentId === studentId || s.studentName === studentName
    );

    setSelectedStudent({
      id: studentId,
      name: studentName,
      avatarUrl: existingSub?.studentAvatar || "",
      batch: existingSub?.studentBatch || "—",
      diplomaLevel: "—",
      campus: "—",
    });
    setViewMode("STUDENT_HUB");

    // Fetch accurate profile from backend
    try {
      const res = await apiRequest<{ data?: any }>(`/students/${studentId}/profile`);
      if (res?.data) {
        setSelectedStudent({
          id: res.data.id || studentId,
          name: res.data.fullName || studentName,
          avatarUrl: res.data.avatarUrl || existingSub?.studentAvatar || "",
          batch: res.data.batch || existingSub?.studentBatch || "—",
          diplomaLevel: res.data.level || "—",
          campus: res.data.city || res.data.region || "—",
        });
      }
    } catch (err) {
      console.error("Student profile fetch error:", err);
    }
  };

  // Navigation Helper: Return to main Tasks Overview (Page 1)
  const goBackToTasksList = () => {
    setSelectedTask(null);
    setSelectedDetailVideo(null);
    setViewMode("TASKS_LIST");
    updateUrlParams({ taskId: null, submissionId: null, mode: null });
  };

  // Open Full Detail Video Evaluation View
  const openDetailEvaluation = (videoItem: VideoSubmissionRecord) => {
    setSelectedDetailVideo(videoItem);
    const initialScore100 = typeof videoItem.marks === "number"
      ? videoItem.marks
      : 85;

    setPerformanceScore10(initialScore100);
    setOverallReviewText(videoItem.feedbackNotes || "");

    // Load existing evaluation data if present (re-opening an already reviewed video),
    // otherwise reset so criteria/notes don't leak across different students/videos
    setCriteriaList(Array.isArray(videoItem.evaluationRubric) ? videoItem.evaluationRubric : []);
    setNewCriterionName("");
    setNewCriterionMaxMarks(100);
    setCorrectionNotes(Array.isArray(videoItem.correctionNotes) ? videoItem.correctionNotes : []);
    setNewCorrectionNoteInput("");

    setViewMode("EVALUATE_VIDEO");
    updateUrlParams({ submissionId: videoItem.id });

    // Fetch live student history from backend
    if (videoItem.studentId) {
      apiRequest<{ data?: any[] }>(`/video/student/${videoItem.studentId}/history`).then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const mapped: VideoSubmissionRecord[] = res.data.map((item: any, idx: number) =>
            mapToSubmissionRecord(item, idx, {
              studentId: videoItem.studentId,
              studentName: videoItem.studentName,
              studentAvatar: videoItem.studentAvatar,
              studentBatch: videoItem.studentBatch,
              courseAndBatch: videoItem.courseAndBatch || "Kathak Practice",
            })
          );
          setStudentHistoryList(mapped);
        }
      }).catch(() => { });
    }
  };

  // Close Detail Evaluation Modal / View
  const closeDetailEvaluation = () => {
    setSelectedDetailVideo(null);
    updateUrlParams({ submissionId: null });
    if (selectedTask) {
      setViewMode("TASK_SUBMISSIONS");
    } else {
      setViewMode("TASKS_LIST");
    }
  };

  // Save Detail Evaluation with Backend Integration & RBAC Validation
  const handleSaveDetailEvaluation = async () => {
    if (!selectedDetailVideo) return;
    const score100 = Math.min(100, Math.max(0, Math.round(performanceScore10)));

    try {
      await apiRequest(`/video/evaluate/${selectedDetailVideo.id}`, {
        method: "POST",
        body: JSON.stringify({
          score: score100,
          status: "REVIEWED",
          correctionNotes,
          overallReview: overallReviewText,
          rubric: criteriaList,
        }),
      });

      updateSubmissionInBothLists(selectedDetailVideo.id, {
        status: "REVIEWED",
        marks: score100,
        feedbackNotes: overallReviewText || "Evaluation completed.",
        correctionNotes,
        evaluationRubric: criteriaList,
      });

      await openThemeSuccess(
        "Review Submitted!",
        `Score ${score100}/100 saved for ${selectedDetailVideo.studentName}.`
      );
      closeDetailEvaluation();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save evaluation.";
      alert(msg);
    }
  };

  const [taskErrors, setTaskErrors] = useState<{
    title?: string;
    category?: string;
    course?: string;
    batch?: string;
    submissionDate?: string;
    cutOffTime?: string;
    instructions?: string;
  }>({});

  const validateTaskForm = (): boolean => {
    const errs: typeof taskErrors = {};

    if (!taskTitle.trim()) {
      errs.title = "Task title is required.";
    } else if (taskTitle.trim().length < 3) {
      errs.title = "Task title must be at least 3 characters long.";
    }

    if (!category.trim()) {
      errs.category = "Please select a category.";
    }

    if (!course.trim()) {
      errs.course = "Please select a course.";
    }

    if (!batch.trim()) {
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

    if (!cutOffTime) {
      errs.cutOffTime = "Cut-off time is required.";
    }

    if (!detailedInstructions.trim()) {
      errs.instructions = "Detailed instructions are required.";
    } else if (detailedInstructions.trim().length < 10) {
      errs.instructions = "Instructions must be at least 10 characters long.";
    }

    setTaskErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Reset Assign Task form to defaults
  const resetTaskForm = () => {
    setTaskTitle("");
    setCategory(rawRelationalCourses[0]?.category || "Kathak");
    setCourse(rawRelationalCourses[0]?.title || "");
    setBatch(rawRelationalCourses[0]?.batches?.[0]?.name || "");
    setPriority("Low");
    setSubmissionDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setCutOffTime("18:00");
    setStrictDeadline(false);
    setDetailedInstructions("");
    setReferenceFileUrl("");
    setReferenceFileName("");
    setTaskErrors({});
  };

  // Refetch tasks list from backend (used after creating a new task)
  const refetchTasksList = async () => {
    try {
      const tasksRes = await apiRequest<{ data?: any[] }>("/video/tasks");
      if (Array.isArray(tasksRes?.data)) {
        setTasksList(tasksRes.data);
      }
    } catch (err) {
      console.error("Tasks list refetch error:", err);
    }
  };

  // Handle Assign New Task Submission with Backend Integration & Batch Scope Validation
  const handleAssignTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTaskForm()) {
      return;
    }

    try {
      const selectedCourseObj = rawRelationalCourses.find(c => c.title === course || c.id === course);
      const selectedBatchObj = selectedCourseObj?.batches?.find(b => b.name === batch || b.id === batch);

      const res = await apiRequest<{ status?: string; message?: string }>(
        "/video/tasks",
        {
          method: "POST",
          body: JSON.stringify({
            title: taskTitle.trim(),
            category,
            course,
            courseId: selectedCourseObj?.id || null,
            batchId: selectedBatchObj?.id || null,
            batchName: batch,
            priority,
            submissionDate,
            cutOffTime,
            strictDeadline,
            detailedInstructions,
            referenceFileUrl: referenceFileUrl || null,
          }),
        }
      );

      if (res?.status === "error") {
        alert(res.message || "Failed to assign task.");
        return;
      }

      const assignedTitle = taskTitle;
      const assignedBatch = batch;

      resetTaskForm();
      await refetchTasksList();

      await openThemeSuccess(
        "New Practice Task Assigned!",
        `Task "${assignedTitle}" assigned to ${assignedBatch}.`
      );
      setViewMode("TASKS_LIST");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to assign task.";
      alert(msg);
    }
  };

  // Handle Video Evaluation Submit
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewVideo) return;

    const cappedScore = Math.min(100, Math.max(0, Number(reviewScore) || 0));

    updateSubmissionInBothLists(selectedReviewVideo.id, {
      status: reviewStatus,
      marks: cappedScore,
      feedbackNotes: reviewNotes || "Evaluation completed.",
    });

    openThemeSuccess("Evaluation Saved Successfully!", `Score of ${cappedScore}/100 recorded for ${selectedReviewVideo.studentName}.`);
    setSelectedReviewVideo(null);
  };

  // Calculate Metrics
  const totalVideos = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const reviewedCount = submissions.filter((s) => s.status === "REVIEWED").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1340px] mx-auto pb-16">
      {/* ========================================================================= */}
      {/* PAGE 1: ASSIGNED PRACTICE TASKS OVERVIEW LIST */}
      {/* ========================================================================= */}
      {(viewMode === "TASKS_LIST" || viewMode === "DIRECTORY") && (
        <div className="space-y-8">
          {loading ? (
            <div className="py-24 text-center text-stone-400 text-sm font-semibold">
              Loading practice tasks...
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0B1C30] tracking-tight">
                    Practice Tasks &amp; Submissions
                  </h1>
                  <p className="text-xs font-medium text-stone-500 mt-1">
                    Select a task to review student practice videos or check unsubmitted students in that batch.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode("ASSIGN_TASK")}
                  className="px-5 py-3 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign New Task</span>
                </button>
              </div>

              {/* 3 Top Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
                  <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                    TOTAL TASKS
                  </p>
                  <h3 className="text-3xl font-black text-[#0B1C30]">{tasksList.length}</h3>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
                  <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                    ACTIVE TASKS
                  </p>
                  <h3 className="text-3xl font-black text-[#900C27]">{tasksList.length}</h3>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
                  <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                    TOTAL SUBMISSIONS
                  </p>
                  <h3 className="text-3xl font-black text-emerald-600">{totalVideos}</h3>
                </div>
              </div>

              {/* Tasks List Table Box */}
              <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-[#0B1C30]">
                    Assigned Practice Tasks
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200/60">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F4F8FF] border-b border-sky-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                        <th className="py-4 px-6">TASK TITLE</th>
                        <th className="py-4 px-6">COURSE &amp; BATCH</th>
                        <th className="py-4 px-6">SUBMISSION DEADLINE</th>
                        <th className="py-4 px-6">PRIORITY</th>
                        <th className="py-4 px-6 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs font-semibold">
                      {tasksList.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-12 text-center text-stone-400 font-semibold"
                          >
                             {'No practice tasks assigned yet. Click "+ Assign New Task" to create one.'}
                          </td>
                        </tr>
                      ) : (
                        tasksList.map((task) => (
                          <tr
                            key={task.id}
                            className="hover:bg-stone-50/70 transition-colors group cursor-pointer"
                            onClick={() => openTaskSubmissions(task)}
                          >
                            <td className="py-4 px-6 font-extrabold text-[#0B1C30]">
                              {task.title}
                            </td>

                            <td className="py-4 px-6 font-extrabold text-stone-600">
                              {task.course} • {task.batchName}
                            </td>

                            <td className="py-4 px-6 font-extrabold text-stone-800">
                              {formatDeadline(task.submissionDate, task.cutOffTime)}
                            </td>

                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${task.priority === "High" ? "bg-rose-100 text-rose-700" : task.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                                }`}>
                                {task.priority || "Normal"}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTaskSubmissions(task);
                                }}
                                className="px-4 py-2 rounded-xl bg-[#900C27] hover:bg-[#75091F] text-white font-extrabold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                                title="View Task Submissions"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Submissions</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: TASK SUBMISSIONS DETAIL & UNSUBMITTED STUDENTS VIEW */}
      {/* ========================================================================= */}
      {viewMode === "TASK_SUBMISSIONS" && selectedTask && (
        <div className="space-y-8">
          {/* Header & Back Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goBackToTasksList}
                className="p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-400">
                  <span>Tasks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#900C27]">{selectedTask.title}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#0B1C30] tracking-tight">
                  Submissions: {selectedTask.title}
                </h1>
                <p className="text-xs font-semibold text-stone-500 mt-0.5">
                  {selectedTask.course} • Batch: {selectedTask.batchName} | Deadline: {formatDeadline(selectedTask.submissionDate, selectedTask.cutOffTime)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setViewMode("ASSIGN_TASK");
                updateUrlParams({ mode: "assign", taskId: null, submissionId: null });
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Task</span>
            </button>
          </div>

          {/* 4 Summary Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-1">
              <p className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                SUBMITTED
              </p>
              <h3 className="text-2xl font-black text-[#0B1C30]">{taskSubmissions.length}</h3>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-1">
              <p className="text-[10px] font-black uppercase text-purple-600 tracking-wider">
                PENDING REVIEW
              </p>
              <h3 className="text-2xl font-black text-purple-700">
                {taskSubmissions.filter((s) => s.status === "PENDING").length}
              </h3>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-1">
              <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                REVIEWED
              </p>
              <h3 className="text-2xl font-black text-emerald-700">
                {taskSubmissions.filter((s) => s.status === "REVIEWED").length}
              </h3>
            </div>

            <div className="p-5 rounded-3xl bg-rose-50/40 border border-rose-200/80 shadow-2xs space-y-1">
              <p className="text-[10px] font-black uppercase text-rose-600 tracking-wider">
                NOT SUBMITTED
              </p>
              <h3 className="text-2xl font-black text-rose-700">{unsubmittedStudents.length}</h3>
            </div>
          </div>

          {/* Submissions & Unsubmitted Table Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-lg font-extrabold text-[#0B1C30]">
                Student Submissions Directory
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#900C27]"
                  />
                </div>

                {/* Filter Dropdown including NOT_SUBMITTED option */}
                <div className="h-10 px-4 rounded-2xl bg-[#EBF3FE] text-[#2563EB] font-extrabold text-xs border border-blue-100 flex items-center gap-2 cursor-pointer shadow-2xs hover:bg-blue-100 transition-colors">
                  <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                    className="bg-transparent text-[#2563EB] font-extrabold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Filter: All Students</option>
                    <option value="PENDING">Pending Review</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                    <option value="NOT_SUBMITTED">Not Submitted (Pending Upload)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-200/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F4F8FF] border-b border-sky-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                    <th className="py-4 px-6">STUDENT</th>
                    <th className="py-4 px-6">SUBMISSION DATE</th>
                    <th className="py-4 px-6">COURSE &amp; BATCH</th>
                    <th className="py-4 px-6">VIDEO TITLE</th>
                    <th className="py-4 px-6">STATUS</th>
                    <th className="py-4 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-semibold">
                  {loadingTaskSubmissions ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                        Loading task submissions...
                      </td>
                    </tr>
                  ) : statusFilter === "NOT_SUBMITTED" ? (
                    unsubmittedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-emerald-600 font-extrabold">
                          All students in this batch have submitted their practice video!
                        </td>
                      </tr>
                    ) : (
                      unsubmittedStudents.map((unsub) => (
                        <tr key={unsub.id} className="hover:bg-rose-50/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-600 font-extrabold text-xs flex items-center justify-center">
                                {(unsub.studentName || "S").charAt(0)}
                              </div>
                              <p className="font-extrabold text-[#0B1C30]">{unsub.studentName}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold text-stone-400">— Not Uploaded —</td>
                          <td className="py-4 px-6 font-bold text-stone-800">{unsub.courseAndBatch}</td>
                          <td className="py-4 px-6 font-semibold text-stone-500">{unsub.videoTitle}</td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[10px] inline-flex items-center gap-1">
                              <span>●</span>
                              <span>Not Submitted</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-xs font-bold text-stone-400 italic">Pending Upload</span>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    taskSubmissions.length === 0 && unsubmittedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                          No submissions found for this task.
                        </td>
                      </tr>
                    ) : (
                      taskSubmissions
                        .filter((s) => statusFilter === "ALL" || s.status === statusFilter)
                        .map((row) => (
                          <tr key={row.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                {row.studentAvatar ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={row.studentAvatar}
                                    alt={row.studentName}
                                    className="w-9 h-9 rounded-full object-cover border border-stone-200"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-[#900C27] text-white font-extrabold text-xs flex items-center justify-center">
                                    {(row.studentName || "S").charAt(0)}
                                  </div>
                                )}
                                <p className="font-extrabold text-[#0B1C30]">{row.studentName}</p>
                              </div>
                            </td>

                            <td className="py-4 px-6 font-extrabold text-stone-600">{row.submissionDate}</td>
                            <td className="py-4 px-6 font-extrabold text-stone-800">{row.courseAndBatch}</td>
                            <td className="py-4 px-6 font-extrabold text-[#0B1C30]">{row.videoTitle}</td>
                            <td className="py-4 px-6">
                              {row.status === "REVIEWED" && (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px]">● Reviewed</span>
                              )}
                              {row.status === "NEEDS_IMPROVEMENT" && (
                                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px]">● Needs Improvement</span>
                              )}
                              {row.status === "PENDING" && (
                                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[10px]">● Pending</span>
                              )}
                            </td>

                            <td className="py-4 px-6 text-right">
                              <button
                                type="button"
                                onClick={() => openDetailEvaluation(row)}
                                className="p-2 rounded-xl text-[#900C27] hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Evaluate Video"
                              >
                                <Eye className="w-5 h-5 text-[#900C27]" />
                              </button>
                            </td>
                          </tr>
                        ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ASSIGN NEW TASK FORM SUB-VIEW (FIGMA SCREENSHOT 3) */}
      {/* ========================================================================= */}
      {viewMode === "ASSIGN_TASK" && (
        <form onSubmit={handleAssignTaskSubmit} className="space-y-8">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-stone-400 mb-1">
                <span>Workload</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Student Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#900C27]">Assign Task</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#0B1C30] tracking-tight">
                Assign New Task
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("DIRECTORY")}
                className="px-5 py-2.5 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Assign Task
              </button>
            </div>
          </div>

          {/* 2-Column Form Layout matching Figma Spec Screenshot 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Task Definition (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-6 space-y-6 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
                <FileText className="w-5 h-5 text-[#900C27]" />
                <h3 className="font-extrabold text-sm text-[#0B1C30]">Task Definition</h3>
              </div>

              {/* Task Title Input */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-stone-700">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Tatkar Footwork Speed Test - 140 BPM"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                    if (taskErrors.title) setTaskErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  className={`w-full h-11 px-4 rounded-2xl bg-stone-50 border text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none ${taskErrors.title ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-[#900C27]"
                    }`}
                  required
                />
                {taskErrors.title && (
                  <p className="text-[10px] font-bold text-rose-600">{taskErrors.title}</p>
                )}
              </div>

              {/* Category & Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-stone-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (taskErrors.category) setTaskErrors((prev) => ({ ...prev, category: undefined }));
                    }}
                    className={`w-full h-11 px-4 rounded-2xl bg-stone-50 border text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none cursor-pointer ${taskErrors.category ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-[#900C27]"
                      }`}
                  >
                    {Array.from(
                      new Set([
                        ...rawRelationalCourses.map((c) => c.category).filter(Boolean),
                        "Kathak",
                        "Bharatanatyam",
                        "General Practice",
                      ])
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {taskErrors.category && (
                    <p className="text-[10px] font-bold text-rose-600">{taskErrors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-stone-700">Course</label>
                  <select
                    value={course}
                    onChange={(e) => {
                      const selectedCourseTitle = e.target.value;
                      setCourse(selectedCourseTitle);
                      if (taskErrors.course) setTaskErrors((prev) => ({ ...prev, course: undefined }));
                      const matched = rawRelationalCourses.find((c) => c.title === selectedCourseTitle || c.id === selectedCourseTitle);
                      if (matched?.category) setCategory(matched.category);
                      if (matched?.batches && matched.batches.length > 0) {
                        setBatch(matched.batches[0].name);
                      }
                    }}
                    className={`w-full h-11 px-4 rounded-2xl bg-stone-50 border text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none cursor-pointer ${taskErrors.course ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-[#900C27]"
                      }`}
                  >
                    {rawRelationalCourses.length === 0 ? (
                      <option value="">No Assigned Courses Found</option>
                    ) : (
                      rawRelationalCourses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))
                    )}
                  </select>
                  {taskErrors.course && (
                    <p className="text-[10px] font-bold text-rose-600">{taskErrors.course}</p>
                  )}
                </div>
              </div>

              {/* Priority Level & Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-stone-700">Batch</label>
                  <select
                    value={batch}
                    onChange={(e) => {
                      setBatch(e.target.value);
                      if (taskErrors.batch) setTaskErrors((prev) => ({ ...prev, batch: undefined }));
                    }}
                    className={`w-full h-11 px-4 rounded-2xl bg-stone-50 border text-xs font-bold cursor-pointer ${taskErrors.batch ? "border-rose-400" : "border-stone-200"
                      }`}
                  >
                    {(() => {
                      const activeCourse = rawRelationalCourses.find((c) => c.title === course || c.id === course) || rawRelationalCourses[0];
                      const availableBatches = activeCourse?.batches || [];
                      return availableBatches.length === 0 ? (
                        <option value="">No Assigned Batches Found</option>
                      ) : (
                        availableBatches.map((b) => (
                          <option key={b.id || b.name} value={b.name}>
                            {b.name}
                          </option>
                        ))
                      );
                    })()}
                  </select>
                  {taskErrors.batch && (
                    <p className="text-[10px] font-bold text-rose-600">{taskErrors.batch}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-stone-700">Priority Level</label>
                  <div className="flex items-center gap-2 p-1 rounded-2xl bg-stone-100 border border-stone-200/80">
                    {(["Low", "Medium", "High"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${priority === p
                          ? "bg-white text-[#900C27] shadow-xs"
                          : "text-stone-600 hover:text-stone-900"
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Deadline & Rules (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-6 space-y-6 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
                <CalendarIcon className="w-5 h-5 text-[#900C27]" />
                <h3 className="font-extrabold text-sm text-[#0B1C30]">Deadline</h3>
              </div>

              {/* Submission Date */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-stone-700">Submission Date</label>
                <input
                  type="date"
                  value={submissionDate}
                  onChange={(e) => {
                    setSubmissionDate(e.target.value);
                    if (taskErrors.submissionDate) setTaskErrors((prev) => ({ ...prev, submissionDate: undefined }));
                  }}
                  className={`w-full h-11 px-4 rounded-2xl bg-stone-50 border text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none ${taskErrors.submissionDate ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-[#900C27]"
                    }`}
                  required
                />
                {taskErrors.submissionDate && (
                  <p className="text-[10px] font-bold text-rose-600">{taskErrors.submissionDate}</p>
                )}
              </div>

              {/* Cut-off Time */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-stone-700">Cut-off Time</label>
                <input
                  type="time"
                  value={cutOffTime}
                  onChange={(e) => {
                    setCutOffTime(e.target.value);
                    if (taskErrors.cutOffTime) setTaskErrors((prev) => ({ ...prev, cutOffTime: undefined }));
                  }}
                  className={`w-full h-11 px-4 rounded-2xl bg-stone-50 border text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none ${taskErrors.cutOffTime ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-[#900C27]"
                    }`}
                  required
                />
                {taskErrors.cutOffTime && (
                  <p className="text-[10px] font-bold text-rose-600">{taskErrors.cutOffTime}</p>
                )}
              </div>

              {/* Strict Deadline Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <div>
                  <p className="text-xs font-extrabold text-stone-800">Strict Deadline (No late subs)</p>
                  <p className="text-[10px] text-stone-400 font-medium">Reject submissions uploaded after deadline</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStrictDeadline(!strictDeadline)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${strictDeadline ? "bg-[#900C27]" : "bg-stone-300"
                    }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${strictDeadline ? "right-1" : "left-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Instructions Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
            <label className="block text-xs font-extrabold text-stone-700">Detailed Instructions</label>
            <textarea
              rows={4}
              value={detailedInstructions}
              onChange={(e) => {
                setDetailedInstructions(e.target.value);
                if (taskErrors.instructions) setTaskErrors((prev) => ({ ...prev, instructions: undefined }));
              }}
              className={`w-full p-4 rounded-2xl bg-stone-50 border text-xs font-medium text-stone-800 focus:bg-white focus:outline-none ${taskErrors.instructions ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-[#900C27]"
                }`}
              placeholder="Break down the footwork sequences and specify Teental cycles..."
            />
            {taskErrors.instructions && (
              <p className="text-[10px] font-bold text-rose-600">{taskErrors.instructions}</p>
            )}
          </div>

          {/* Reference Media Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-2xs">
            <input
              type="file"
              ref={mediaFileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMediaFileUpload(file);
              }}
              accept="video/*,image/*,application/pdf"
              className="hidden"
            />

            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-stone-700">Reference Media</label>
              <button
                type="button"
                onClick={() => setShowAddLinkInput(!showAddLinkInput)}
                className="text-xs font-extrabold text-[#900C27] hover:underline cursor-pointer flex items-center gap-1"
              >
                + Add Link
              </button>
            </div>

            {/* Inline Add Link Input */}
            {showAddLinkInput && (
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <input
                  type="url"
                  value={customLinkInput}
                  onChange={(e) => setCustomLinkInput(e.target.value)}
                  placeholder="Paste reference link (e.g. YouTube, Drive, PDF URL...)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-[#900C27]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = customLinkInput.trim();
                    if (!trimmed) return;
                    if (!isSafeUrl(trimmed)) {
                      alert("Please enter a valid http:// or https:// link.");
                      return;
                    }
                    setReferenceFileUrl(trimmed);
                    setReferenceFileName(trimmed);
                    setShowAddLinkInput(false);
                    setCustomLinkInput("");
                  }}
                  className="px-4 py-2 bg-[#900C27] text-white text-xs font-bold rounded-xl hover:bg-[#70091e] transition-colors cursor-pointer"
                >
                  Save Link
                </button>
              </div>
            )}

            {/* Display Active Uploaded File / Link & In-place Media Preview */}
            {referenceFileUrl ? (
              <div className="space-y-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Video className="w-5 h-5 text-[#900C27] flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-stone-800 truncate">{referenceFileName || "Reference Media"}</p>
                      <a
                        href={referenceFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#900C27] underline truncate block"
                      >
                        {referenceFileUrl}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReferenceFileUrl("");
                      setReferenceFileName("");
                    }}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove reference media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* In-place Video & Image Preview */}
                {referenceFileUrl.match(/\.(mp4|mov|webm|ogg)$/i) || referenceFileUrl.includes("/videos/") ? (
                  <div className="overflow-hidden rounded-2xl border border-stone-200 bg-black shadow-xs">
                    <video
                      src={referenceFileUrl}
                      controls
                      className="w-full max-h-64 rounded-2xl mx-auto"
                      preload="metadata"
                    />
                  </div>
                ) : referenceFileUrl.match(/\.(png|jpe?g|webp|gif|svg)$/i) || referenceFileUrl.includes("/images/") ? (
                  <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 text-center shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={referenceFileUrl}
                      alt="Reference Media Preview"
                      className="w-full max-h-64 object-contain rounded-xl mx-auto"
                    />
                  </div>
                ) : null}
              </div>
            ) : uploadingMedia ? (
              <div className="border-2 border-dashed border-[#900C27]/40 rounded-3xl p-8 text-center space-y-3 bg-red-50/20">
                <p className="text-xs font-bold text-[#900C27]">Uploading Reference Media ({uploadMediaProgress}%)...</p>
                <div className="w-full max-w-xs mx-auto h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#900C27] transition-all" style={{ width: `${uploadMediaProgress}%` }} />
                </div>
              </div>
            ) : (
              <div
                onClick={() => mediaFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleMediaFileUpload(file);
                }}
                className="border-2 border-dashed border-stone-200/80 rounded-3xl p-8 text-center space-y-3 bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                <div>
                  <p className="text-xs font-extrabold text-stone-800">Click to upload or drag &amp; drop</p>
                  <p className="text-[10px] text-stone-400 font-medium mt-0.5">MAX SIZE 50MB (MP4, MOV, WEBM, PDF, JPG, PNG)</p>
                </div>
              </div>
            )}
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: STUDENT VIDEO PROFILE / HISTORY HUB (FIGMA SCREENSHOT 4 & 5) */}
      {/* ========================================================================= */}
      {viewMode === "STUDENT_HUB" && selectedStudent && (
        <div className="space-y-8">
          {/* Breadcrumb Header */}
          <div className="flex items-center gap-3 border-b border-stone-200/80 pb-6">
            <button
              type="button"
              onClick={() => setViewMode("DIRECTORY")}
              className="p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-extrabold text-stone-800">
              <span className="text-stone-400">Video Review Hub</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
              <span className="text-[#0B1C30]">{selectedStudent.name}</span>
            </div>
          </div>

          {/* Student Profile Banner Box matching Figma Spec Screenshot 4 & 5 */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {selectedStudent.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedStudent.avatarUrl}
                    alt={selectedStudent.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#900C27] text-white text-2xl font-black flex items-center justify-center">
                    {selectedStudent.name.charAt(0)}
                  </div>
                )}
                <span className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center absolute bottom-0 right-0 border-2 border-white text-xs font-bold shadow-xs">
                  ✓
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-[#0B1C30]">
                    {selectedStudent.name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-[#900C27] font-extrabold text-[11px] border border-rose-200/80">
                    Batch: {selectedStudent.batch}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-stone-400" />
                    <span>{selectedStudent.diplomaLevel}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-stone-400" />
                    <span>{selectedStudent.campus}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submission History Table Box matching Figma Spec Screenshot 4 & 5 */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-xl font-extrabold text-[#0B1C30]">
                Submission History
              </h3>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={studentHubSearch}
                    onChange={(e) => setStudentHubSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#900C27]"
                  />
                </div>

                <div className="h-10 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 font-extrabold text-xs flex items-center gap-1.5 hover:bg-stone-100">
                  <Filter className="w-4 h-4 text-stone-500" />
                  <select
                    value={studentHubStatusFilter}
                    onChange={(e) => setStudentHubStatusFilter(e.target.value as typeof studentHubStatusFilter)}
                    className="bg-transparent text-stone-700 font-extrabold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Videos</option>
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submissions Table matching Figma Spec Screenshot 4 & 5 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-50/60 border-b border-sky-100 text-[11px] font-black uppercase tracking-wider text-stone-600">
                    <th className="py-4 px-6">VIDEO TITLE</th>
                    <th className="py-4 px-6">SUBMISSION DATE</th>
                    <th className="py-4 px-6">COURSE/BATCH</th>
                    <th className="py-4 px-6">STATUS</th>
                    <th className="py-4 px-6">MARKS</th>
                    <th className="py-4 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-semibold">
                  {studentHubSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                        No videos found matching your search or filter.
                      </td>
                    </tr>
                  ) : (
                    studentHubSubmissions.map((row) => (
                      <tr key={row.id} className="hover:bg-stone-50/60 transition-colors">
                        {/* Video Title & Thumbnail */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded-lg bg-stone-900 overflow-hidden relative shrink-0">
                              {row.fileUrl ? (
                                <video src={row.fileUrl} className="w-full h-full object-cover" muted />
                              ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src="https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=200&auto=format&fit=crop"
                                  alt="Video preview"
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Play className="w-3 h-3 text-white fill-white" />
                              </div>
                            </div>
                            <span className="font-extrabold text-[#0B1C30] leading-tight">
                              {row.videoTitle}
                            </span>
                          </div>
                        </td>

                        {/* Submission Date */}
                        <td className="py-4 px-6 font-bold text-stone-700">
                          {row.submissionDate}
                        </td>

                        {/* Course/Batch */}
                        <td className="py-4 px-6 font-bold text-stone-700">
                          {row.courseAndBatch}
                        </td>

                        {/* Status Pill matching Figma Spec */}
                        <td className="py-4 px-6">
                          {row.status === "REVIEWED" && (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-[10px] inline-flex items-center gap-1">
                              <span>●</span>
                              <span>Reviewed</span>
                            </span>
                          )}
                          {row.status === "NEEDS_IMPROVEMENT" && (
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] inline-flex items-center gap-1">
                              <span>●</span>
                              <span>Needs Improvement</span>
                            </span>
                          )}
                          {row.status === "PENDING" && (
                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[10px] inline-flex items-center gap-1">
                              <span>●</span>
                              <span>Pending</span>
                            </span>
                          )}
                        </td>

                        {/* Marks Column */}
                        <td className="py-4 px-6 font-black text-[#0B1C30]">
                          {typeof row.marks === "number" ? `${row.marks}/100` : row.marks || "— N/A —"}
                        </td>

                        {/* Action Eye Button -> Opens Step 3 Video Submission Detail & Evaluation Page */}
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => openDetailEvaluation(row)}
                            className="p-2 rounded-xl text-[#900C27] hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Evaluate Video"
                          >
                            <Eye className="w-5 h-5 text-[#900C27]" />
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

      {/* ========================================================================= */}
      {/* VIEW 4: VIDEO SUBMISSION DETAIL PAGE (FIGMA SPEC SCREENSHOT) */}
      {/* ========================================================================= */}
      {viewMode === "EVALUATE_VIDEO" && selectedDetailVideo && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1340px] mx-auto pb-16">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-stone-400">
                <button
                  type="button"
                  onClick={closeDetailEvaluation}
                  className="text-[#900C27] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>VIDEO MANAGEMENT</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>KATHAK SUBMISSIONS</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0B1C30] font-black uppercase">
                  {selectedDetailVideo.studentName}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-[#0B1C30] tracking-tight">
                {selectedDetailVideo.videoTitle || "Tatkar Footwork Practice"}
              </h1>
            </div>
          </div>

          {/* Main 2-Column Grid (7 cols Left, 5 cols Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Video Player Box */}
              <div className="aspect-video rounded-3xl bg-black overflow-hidden relative shadow-md border border-stone-200">
                <video
                  src={selectedDetailVideo.fileUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Student Info Card */}
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {selectedDetailVideo.studentAvatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={selectedDetailVideo.studentAvatar}
                        alt={selectedDetailVideo.studentName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#900C27] text-white font-extrabold text-lg flex items-center justify-center">
                        {selectedDetailVideo.studentName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-extrabold text-[#0B1C30] leading-tight">
                        {selectedDetailVideo.studentName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="px-3 py-1 rounded-full bg-rose-50 text-[#900C27] font-extrabold text-[10px] uppercase border border-rose-200/80">
                          BATCH {selectedDetailVideo.studentBatch || "ALPHA-2024"}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-rose-100/70 text-[#900C27] font-extrabold text-[10px] uppercase">
                          ADVANCED LEVEL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Submission Timestamp */}
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                      SUBMISSION DATE
                    </p>
                    <p className="text-xs font-extrabold text-[#0B1C30] mt-0.5">
                      {selectedDetailVideo.submissionDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="text-[10px] font-semibold text-stone-400">04:15 PM IST</p>
                  </div>
                </div>

                {/* Assignment Technical Details (3 Columns Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 text-xs">
                  <div>
                    <p className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                      COURSE / ASSIGNMENT
                    </p>
                    <p className="font-extrabold text-stone-800 mt-1">
                      {selectedTask?.course || selectedDetailVideo.courseAndBatch || "Kathak Course"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                      CATEGORY / FOCUS
                    </p>
                    <p className="font-extrabold text-stone-800 mt-1">
                      {selectedTask?.category || selectedDetailVideo.videoTitle || "Kathak Practice"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                      DEADLINE / PRIORITY
                    </p>
                    <p className="font-extrabold text-stone-800 mt-1">
                      {selectedTask?.cutOffTime ? `Cutoff: ${selectedTask.cutOffTime}` : (selectedTask?.priority ? `Priority: ${selectedTask.priority}` : "Active Task")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Evaluation Panel (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-2xs space-y-6">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
                <SlidersHorizontal className="w-5 h-5 text-[#900C27]" />
                <h3 className="font-extrabold text-base text-[#0B1C30]">Evaluation Panel</h3>
              </div>

              {/* CUSTOM EVALUATION CRITERIA BUILDER */}
              <div className="space-y-4 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80">
                <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
                  <div>
                    <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                      PERFORMANCE SCORE
                    </p>
                    <p className="text-[11px] font-semibold text-stone-500">Add your custom criteria &amp; score</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
                    <span className="text-xl font-black text-[#900C27]">{performanceScore10}</span>
                    <span className="text-xs font-extrabold text-stone-400">/100</span>
                  </div>
                </div>

                {/* Add Custom Criterion Form */}
                <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-2 shadow-2xs">
                  <p className="text-[10px] font-black uppercase text-stone-700 tracking-wider">
                    + ADD CUSTOM EVALUATION CRITERION
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Criterion Name (e.g. Footwork, Posture)..."
                      value={newCriterionName}
                      onChange={(e) => setNewCriterionName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCriterion();
                        }
                      }}
                      className="flex-1 h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27]"
                    />
                    <div className="w-20">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={newCriterionMaxMarks}
                        onChange={(e) => setNewCriterionMaxMarks(parseInt(e.target.value, 10) || 100)}
                        className="w-full h-9 px-2 text-center rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:border-[#900C27]"
                        title="Max Marks (Default 100)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCriterion}
                      className="h-9 px-3 rounded-xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs transition-colors cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Dynamic Added Criteria List */}
                <div className="space-y-3 pt-1">
                  {criteriaList.length === 0 ? (
                    <div className="py-6 text-center text-stone-400 text-xs font-semibold border-2 border-dashed border-stone-200 rounded-xl bg-white/50 space-y-1">
                      <p className="font-extrabold text-stone-600">No evaluation criteria added yet.</p>
                      <p className="text-[11px] text-stone-400">Type a custom criterion name above   (e.g., &quot;Footwork&quot;, &quot;Chakkar Balance&quot;) &amp; click &quot;+ Add&quot;.
                      </p>
                    </div>
                  ) : (
                    criteriaList.map((crit) => (
                      <div key={crit.id} className="space-y-1 bg-white p-3 rounded-xl border border-stone-200/60 shadow-2xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#0B1C30]">{crit.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[#900C27] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 text-xs">
                              {crit.score} / {crit.maxMarks}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCriterion(crit.id)}
                              className="text-stone-400 hover:text-rose-600 font-bold px-1 text-xs"
                              title="Delete Criterion"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="range"
                            min={0}
                            max={crit.maxMarks}
                            step={1}
                            value={crit.score}
                            onChange={(e) => handleUpdateCriterionScore(crit.id, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#900C27]"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CORRECTION NOTES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                    CORRECTION NOTES
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (newCorrectionNoteInput.trim()) {
                        setCorrectionNotes((prev) => [...prev, newCorrectionNoteInput.trim()]);
                        setNewCorrectionNoteInput("");
                      }
                    }}
                    className="text-[10px] font-extrabold text-[#900C27] uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    ADD POINT +
                  </button>
                </div>

                {/* List of correction points */}
                <div className="space-y-2">
                  {correctionNotes.map((note, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 text-xs font-semibold text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                      <span>• {note}</span>
                      <button
                        type="button"
                        onClick={() => setCorrectionNotes((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-stone-400 hover:text-rose-600 font-bold px-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <input
                    type="text"
                    placeholder="• Add a new observation..."
                    value={newCorrectionNoteInput}
                    onChange={(e) => setNewCorrectionNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newCorrectionNoteInput.trim()) {
                          setCorrectionNotes((prev) => [...prev, newCorrectionNoteInput.trim()]);
                          setNewCorrectionNoteInput("");
                        }
                      }
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27]"
                  />
                </div>
              </div>

              {/* OVERALL COMPREHENSIVE REVIEW */}
              <div className="space-y-2">
                <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                  OVERALL COMPREHENSIVE REVIEW
                </p>
                <textarea
                  rows={4}
                  value={overallReviewText}
                  onChange={(e) => setOverallReviewText(e.target.value)}
                  placeholder="Provide detailed feedback on rhythmic accuracy, facial expressions, and overall poise..."
                  className="w-full p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs font-medium text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27]"
                />
              </div>

              {/* Submit Review Button */}
              <button
                type="button"
                onClick={handleSaveDetailEvaluation}
                className="w-full py-3.5 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Submit Review</span>
              </button>
            </div>
          </div>

          {/* Bottom Section: Student Submission History Grid / Slider */}
          <div className="space-y-4 pt-4 border-t border-stone-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#0B1C30]">
                Student Submission History
              </h3>
              <button
                type="button"
                onClick={() => setViewMode("STUDENT_HUB")}
                className="text-xs font-extrabold text-[#900C27] hover:underline cursor-pointer"
              >
                View All Records
              </button>
            </div>

            {/* Real student history cards (replaces earlier hardcoded placeholder cards) */}
            {studentHistoryList.filter((h) => h.id !== selectedDetailVideo.id).length === 0 ? (
              <div className="py-10 text-center text-stone-400 text-xs font-semibold border-2 border-dashed border-stone-200 rounded-2xl bg-white/50">
                No previous submissions found for this student.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {studentHistoryList
                  .filter((h) => h.id !== selectedDetailVideo.id)
                  .slice(0, 4)
                  .map((historyItem) => (
                    <div
                      key={historyItem.id}
                      onClick={() => openDetailEvaluation(historyItem)}
                      className="bg-white rounded-3xl border border-stone-200/80 p-3 shadow-2xs hover:shadow-md transition-all space-y-3 cursor-pointer group"
                    >
                      <div className="aspect-video rounded-2xl bg-stone-900 overflow-hidden relative border border-stone-200/80">
                        {historyItem.fileUrl ? (
                          <video
                            src={historyItem.fileUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-500 text-[10px] font-bold uppercase">
                            No Preview
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-900 shadow-sm">
                            <Play className="w-3.5 h-3.5 fill-stone-900 ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-xs text-[#0B1C30] tracking-tight group-hover:text-[#900C27] transition-colors leading-tight uppercase truncate">
                          {historyItem.videoTitle}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mt-1">
                          <span className="text-[#0B1C30] font-extrabold">
                            {typeof historyItem.marks === "number" ? `${historyItem.marks}/100` : "— N/A —"}
                          </span>
                          <span>{historyItem.submissionDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIDEO EVALUATION & PLAYER MODAL */}
      {/* ========================================================================= */}
      {selectedReviewVideo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#0B1C30]">
                  Video Evaluation &amp; Grade
                </h3>
                <p className="text-xs font-bold text-stone-400 mt-0.5">
                  {selectedReviewVideo.studentName} • {selectedReviewVideo.videoTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewVideo(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="aspect-video rounded-2xl bg-black overflow-hidden relative border border-stone-200 shadow-inner">
              <video
                src={selectedReviewVideo.fileUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                controls
                className="w-full h-full object-contain"
              />
            </div>

            {/* Evaluation Form */}
            <form onSubmit={handleSaveEvaluation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-stone-700">Overall Score (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={reviewScore}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      const capped = isNaN(val) ? "" : Math.min(100, Math.max(0, val));
                      setReviewScore(capped);
                    }}
                    className="w-full h-11 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-black text-[#900C27] focus:bg-white focus:outline-none focus:border-[#900C27]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-stone-700">Evaluation Status</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-extrabold text-stone-800 focus:bg-white focus:outline-none focus:border-[#900C27] cursor-pointer"
                  >
                    <option value="REVIEWED">Reviewed (Passed)</option>
                    <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-stone-700">Teacher Notes &amp; Constructive Feedback</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter detailed feedback on posture, rhythm, and mudras..."
                  className="w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 focus:bg-white focus:outline-none focus:border-[#900C27]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedReviewVideo(null)}
                  className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}