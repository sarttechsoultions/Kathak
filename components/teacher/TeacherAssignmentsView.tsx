"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Briefcase,
  TrendingUp,
  BarChart3,
  Upload,
  ArrowLeft,
  ChevronRight,
  Filter,
  Layers,
  Lock,
  Loader2,
  Sparkles,
  Info,
  Check,
  Users,
  Eye,
  AlertTriangle,
  GraduationCap,
  SlidersHorizontal,
  Folder,
  Download,
  ClipboardList,
  Play,
  LayoutGrid,
  List,
  Pencil,
  MessageSquare,
  Film
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

interface AssignmentItem {
  id: string;
  teacherName?: string;
  teacherDept?: string;
  teacherAvatar?: string;
  title: string;
  typeTag: string;
  targetBatch: string;
  dueDate: string;
  totalStudents: string;
  instructions?: string;
}

interface SubmittedAssignmentRecord {
  id: string;
  studentName: string;
  studentId: string;
  studentAvatar?: string;
  assignmentTitle: string;
  batch: string;
  submittedDate: string;
  status: "Submitted" | "Overdue" | "Pending";
  assignmentId?: string;
  fileUrl?: string;
  grade?: string | null;
  feedback?: string | null;
  notes?: string | null;
}

interface TeacherBatch {
  id: string;
  name: string;
  code: string;
  courseId?: string;
  courseName?: string;
  totalStudents?: number;
  status?: string;
  teacherId?: string;
  teacherName?: string;
  instructor?: string; // fallback
}

interface Metrics {
  totalActive: number;
  pendingReviews: number;
  submissionsThisWeek: number;
  avgCompletionRate: string;
}

interface VideoSubmissionCard {
  id: string;
  studentName: string;
  studentAvatar: string;
  submittedTime: string;
  thumbnail: string;
  duration: string;
  status: "Pending Review" | "Reviewed";
  score?: string;
  codePill: string;
  message?: string;
  fileUrl?: string;
}

interface CriteriaPart {
  id: string;
  name: string;
  score: number;
}

// Format video URL helper
const formatVideoUrl = (rawUrl?: string): { isIframe: boolean; url: string } => {
  const fallbackVideo = "https://vjs.zencdn.net/v/oceans.mp4";

  if (!rawUrl || rawUrl.trim() === "" || rawUrl === "---" || rawUrl === "null" || rawUrl === "undefined") {
    return { isIframe: false, url: fallbackVideo };
  }

  let cleanUrl = rawUrl.trim();

  if (cleanUrl.startsWith("/uploads") || cleanUrl.startsWith("uploads/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const backendRoot = apiBase.replace(/\/api\/v1\/?$/, "");
    const relativePath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
    cleanUrl = `${backendRoot}${relativePath}`;
  }

  const isIframeLink =
    cleanUrl.includes("iframe.mediadelivery.net") ||
    cleanUrl.includes("youtube.com/embed") ||
    cleanUrl.includes("youtu.be") ||
    cleanUrl.includes("vimeo.com") ||
    cleanUrl.includes("/embed/");

  return {
    isIframe: isIframeLink,
    url: cleanUrl,
  };
};

export default function TeacherAssignmentsView() {
  // Screen View Modes matching Admin Flow
  const [viewMode, setViewMode] = useState<"LIST" | "CREATE" | "DETAILS" | "SUBMISSIONS">("LIST");
  const [selectedVideoReview, setSelectedVideoReview] = useState<VideoSubmissionCard | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // File Upload State & Progress
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Dynamic Teacher Profile
  const [teacherProfile, setTeacherProfile] = useState({
    name: "Teacher",
    dept: "Faculty Instructor",
    avatarUrl: ""
  });

  // DB Data States
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submittedList, setSubmittedList] = useState<SubmittedAssignmentRecord[]>([]);
  const [teacherBatches, setTeacherBatches] = useState<TeacherBatch[]>([]);
  const [selectedAssignmentDetail, setSelectedAssignmentDetail] = useState<AssignmentItem | null>(null);
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState<AssignmentItem | null>(null);

  // Dynamic Metrics
  const [metrics, setMetrics] = useState<Metrics>({
    totalActive: 0,
    pendingReviews: 0,
    submissionsThisWeek: 0,
    avgCompletionRate: "0%"
  });

  // Search & Filters - Main List
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatchFilter, setSelectedBatchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "DRAFT">("ACTIVE");

  // Search & Filters - Submissions List
  const [submissionBatchFilter, setSubmissionBatchFilter] = useState("ALL");
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState("");
  const [submissionsViewMode, setSubmissionsViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<"ALL" | "PENDING">("ALL");
  const [submissionSort, setSubmissionSort] = useState<"NEWEST" | "OLDEST">("NEWEST");

  // Create Assignment Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Video Submission");
  const [instructions, setInstructions] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [allowLate, setAllowLate] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const instructionsTextareaRef = useRef<HTMLTextAreaElement>(null);

  const applyInstructionsFormat = (type: "bold" | "italic" | "list" | "link") => {
    const textarea = instructionsTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = instructions.substring(start, end);

    let replacement = "";
    if (type === "bold") {
      replacement = `**${selectedText || "bold text"}**`;
    } else if (type === "italic") {
      replacement = `_${selectedText || "italic text"}_`;
    } else if (type === "list") {
      replacement = selectedText
        ? selectedText.split("\n").map((line) => `• ${line}`).join("\n")
        : "• Step 1\n• Step 2\n• Step 3";
    } else if (type === "link") {
      const url = prompt("Enter URL:", "https://");
      if (url) {
        replacement = `[${selectedText || "Link Title"}](${url})`;
      } else {
        return;
      }
    }

    const newInstructions = instructions.substring(0, start) + replacement + instructions.substring(end);
    setInstructions(newInstructions);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // Evaluation Form State
  const [reviewRhythmScore, setReviewRhythmScore] = useState("0");
  const [criteriaParts, setCriteriaParts] = useState<{ id: string; name: string; score: number }[]>([]);
  const [newCriteriaName, setNewCriteriaName] = useState("");
  const [reviewPointers, setReviewPointers] = useState<string[]>([]);
  const [newPointerInput, setNewPointerInput] = useState("");

  // Auto-calculate Overall Grade (0-100) as the Average of Evaluation Criteria Parts (capped at 100)
  useEffect(() => {
    if (criteriaParts.length > 0) {
      const sum = criteriaParts.reduce((acc, part) => {
        const val = Math.min(100, Math.max(0, Number(part.score) || 0));
        return acc + val;
      }, 0);
      const avg = Math.round(sum / criteriaParts.length);
      setReviewRhythmScore(String(Math.min(100, Math.max(0, avg))));
    }
  }, [criteriaParts]);
  const [reviewFeedbackText, setReviewFeedbackText] = useState("");

  // Live File Upload Handler (Connected to /api/v1/upload/video or /api/v1/upload/image)
  const handleAssignmentFileUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      alert("File must be under 50MB");
      return;
    }

    setUploadingFile(true);
    setUploadProgress(0);
    setUploadedFileUrl("");
    setUploadedFileName("");

    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");

    const token =
      localStorage.getItem("kathak_admin_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("kathak_token") ||
      "";

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const endpoint = isVideo || isAudio ? `${base}/upload/video` : `${base}/upload/image`;
    const fieldName = isVideo || isAudio ? "video" : "image";

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
      xhr.withCredentials = true; 
        xhr.open("POST", endpoint);

        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText || "{}");
            if (xhr.status >= 200 && xhr.status < 300) {
              const u =
                json?.data?.url ||
                json?.data?.directUrl ||
                json?.data?.iframeUrl ||
                json?.data?.secure_url ||
                "";
              if (!u) reject(new Error("No URL returned from upload server"));
              else resolve(u);
            } else {
              reject(new Error(json?.message || `Upload failed (${xhr.status})`));
            }
          } catch {
            reject(new Error("Invalid server response"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(formData);
      });

      setUploadedFileUrl(url);
      setUploadedFileName(file.name);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("File upload failed");
      }
    } finally {
      setUploadingFile(false);
    }
  };

  // Fetch Logged-in Teacher Data and DB Records
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
  // 1. Get logged-in teacher
  const savedUserStr =
    localStorage.getItem("kathak_teacher_user") ||
    localStorage.getItem("kathak_admin_user") ||
    localStorage.getItem("kathak_session_user");

  let currentTeacherId = "";
  let currentTeacherName = "";

  if (savedUserStr) {
    try {
      const u = JSON.parse(savedUserStr);
      currentTeacherId = u.id || "";
      currentTeacherName = u.fullName || u.name || "";
      setTeacherProfile({
        name: currentTeacherName || "Teacher",
        dept: u.role ? `${u.role} Faculty` : "Faculty Instructor",
        avatarUrl: u.avatarUrl || u.avatar || "",
      });
    } catch {
      // Ignore
    }
  }

  // 2. Fetch Assignments from DB
  const assignmentsRes = await apiRequest<{
    status: string;
    data?: {
      assignments?: AssignmentItem[];
      metrics?: Metrics;
    };
  }>("/admin/assignments");

  if (assignmentsRes.data) {
    const list = assignmentsRes.data.assignments || [];
    setAssignments(list);
    if (assignmentsRes.data.metrics) {
      setMetrics(assignmentsRes.data.metrics);
    } else {
      setMetrics({
        totalActive: list.length,
        pendingReviews: 0,
        submissionsThisWeek: 0,
        avgCompletionRate: "0%",
      });
    }
  }


  // 3. Fetch Student Submissions from DB
  const subRes = await apiRequest<{
    status: string;
    data?: {
      submissions?: SubmittedAssignmentRecord[];
    };
  }>("/admin/assignments/submissions");

  if (subRes.data?.submissions) {
    setSubmittedList(subRes.data.submissions);
  }

  // 4. Fetch Assigned Courses & Batches for logged-in teacher
  const assignedRes = await apiRequest<{
    data?: {
      courses?: Array<{
        id: string;
        title: string;
        batches?: Array<{ id: string; name: string; code?: string; courseId: string; courseName: string }>;
      }>;
    };
  }>("/video/teacher/assigned-courses-batches");

  const teacherCourses = assignedRes?.data?.courses || [];
  const finalBatches: TeacherBatch[] = [];

  teacherCourses.forEach((c) => {
    if (Array.isArray(c.batches)) {
      c.batches.forEach((b) => {
        finalBatches.push({
          id: String(b.id),
          name: b.name,
          code: b.code || "",
          courseId: String(b.courseId || c.id),
          courseName: b.courseName || c.title,
        });
      });
    }
  });

  setTeacherBatches(finalBatches);

  if (finalBatches.length > 0) {
    setSelectedBatchIds((prev) => (prev && prev.length > 0 ? prev : [finalBatches[0].id]));
  }
}catch {
      // Handle silently
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  void fetchAllData();
}, [fetchAllData]);

  const handleToggleBatch = (id: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleCreateAssignmentSubmit = async (isDraft = false) => {
    if (!title.trim()) {
      alert("Please enter an assignment title.");
      return;
    }
    if (selectedBatchIds.length === 0) {
      alert("Please select at least one eligible target batch.");
      return;
    }

    setSubmitting(true);
    try {
      const selectedBatchObjects = teacherBatches.filter((b) => selectedBatchIds.includes(b.id));
      const targetBatchNames = selectedBatchObjects.map((b) => b.name).join(", ");

      const payload = {
  title: title.trim(),
  description: instructions || "Complete assignment tasks as instructed.",
  batchId: selectedBatchIds[0],
  targetBatch: targetBatchNames,
  dueDate: deadlineDate
    ? `${deadlineDate}T${deadlineTime || "23:59"}:00`
    : undefined,
  typeTag: category,
  totalPoints: 100,
  referenceFileUrl: uploadedFileUrl || undefined,
  referenceFileName: uploadedFileName || undefined,
  status: isDraft ? "DRAFT" : "ACTIVE",

  // Teacher info add karo
  teacherId: teacherProfile.name ? undefined : undefined, // backend req.user se lega
  teacherName: teacherProfile.name,
};

      await apiRequest("/admin/assignments", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      await openThemeSuccess(
        isDraft ? "Assignment saved as draft!" : "New Assignment published successfully to assigned batches!",
        isDraft ? "Draft Saved" : "Assignment Published"
      );

      setTitle("");
      setInstructions("");
      setUploadedFile(null);
      setUploadedFileUrl("");
      setUploadedFileName("");
      setViewMode("LIST");

      await fetchAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg || "Failed to create assignment.");
    } finally {
      setSubmitting(false);
    }
  };
console.log("UI teacherBatches length:", teacherBatches.length, teacherBatches);
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoReview?.id) return;

    try {
      const feedbackPayload = JSON.stringify({
        comment: reviewFeedbackText,
        criteriaParts: criteriaParts.map((p) => ({ name: p.name, score: p.score })),
        pointers: reviewPointers.filter((p) => p.trim() !== "")
      });

      await apiRequest(`/admin/assignments/submissions/${selectedVideoReview.id}/grade`, {
        method: "POST",
        body: JSON.stringify({
          grade: reviewRhythmScore,
          feedback: feedbackPayload,
        }),
      });

      await openThemeSuccess(
        `Evaluation submitted for ${selectedVideoReview.studentName}!`,
        "Evaluation Saved"
      );

      setSelectedVideoReview(null);
      setReviewFeedbackText("");
      await fetchAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg || "Failed to submit grade.");
    }
  };

  const openReviewFromSubmission = (row: SubmittedAssignmentRecord) => {
    setSelectedVideoReview({
      id: row.id,
      studentName: row.studentName,
      studentAvatar: row.studentAvatar || "",
      submittedTime: row.submittedDate,
      thumbnail: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop",
      duration: "--:--",
      status: row.grade ? "Reviewed" : "Pending Review",
      score: row.grade || undefined,
      codePill: row.studentId || "#SUB",
      message: row.notes || (row.feedback && !row.feedback.startsWith("{") ? row.feedback : "Student submission ready for evaluation."),
      fileUrl: row.fileUrl,
    });

    const isGraded = Boolean(row.grade && row.grade !== "Pending");
    const gradeScore = isGraded ? String(row.grade) : "";
    setReviewRhythmScore(gradeScore);

    let commentStr = "";
    let pointersList: string[] = [];
    let criteriaList: CriteriaPart[] = [];

    if (row.feedback && row.feedback.startsWith("{")) {
      try {
        const obj = JSON.parse(row.feedback);
        commentStr = obj.comment || "";
        if (Array.isArray(obj.pointers)) {
          pointersList = obj.pointers.filter((p: string) => p && typeof p === "string" && p.trim() !== "");
        }
        if (Array.isArray(obj.criteriaParts) && obj.criteriaParts.length > 0) {
          criteriaList = obj.criteriaParts.map((cp: any, idx: number) => ({
            id: String(idx + 1),
            name: cp.name || "Criterion",
            score: typeof cp.score === "number" ? cp.score : parseInt(cp.score || "0", 10) || 0,
          }));
        }
      } catch {
        commentStr = row.feedback;
      }
    } else if (row.feedback && !row.feedback.startsWith("{")) {
      commentStr = row.feedback;
    }

    setCriteriaParts(criteriaList);
    setReviewFeedbackText(commentStr);
    setReviewPointers(pointersList);
  };

  const openAssignmentSubmissions = async (asg: AssignmentItem) => {
    setSelectedAssignmentForSubmissions(asg);
    try {
      const res = await apiRequest<{
        status: string;
        data?: { submissions?: SubmittedAssignmentRecord[] };
      }>(`/admin/assignments/${asg.id}/submissions`);

      const submissions = res.data?.submissions || [];
      if (submissions.length > 0) {
        setSubmittedList(submissions);
      }
    } catch {
      // ignore
    }
    setSubmissionSearchTerm(asg.title);
    setViewMode("SUBMISSIONS");
  };

  // Filtered Assignments List (Strictly for Teacher's Assigned Batches)
  const teacherOnlyAssignments = useMemo(() => {
    const teacherBatchNames = teacherBatches.map((b) => (b.name || "").toLowerCase());

    return assignments.filter((a) => {
      if (teacherBatchNames.length === 0) return true;
      const targetBatch = (a.targetBatch || "").toLowerCase();
      const teacherName = (a.teacherName || "").toLowerCase();
      const loggedTeacherName = (teacherProfile.name || "").toLowerCase();

      return (
        teacherBatchNames.some(
          (bName) =>
            targetBatch.includes(bName) ||
            bName.includes(targetBatch)
        ) ||
        (teacherName && loggedTeacherName && teacherName.includes(loggedTeacherName))
      );
    });
  }, [assignments, teacherBatches, teacherProfile.name]);

  const filteredAssignments = useMemo(() => {
    return teacherOnlyAssignments.filter((a) => {
      const targetBatch = (a.targetBatch || "").toLowerCase();
      const title = (a.title || "").toLowerCase();
      const search = (searchQuery || "").toLowerCase();
      const selectedBatch = (selectedBatchFilter || "ALL").toLowerCase();

      // Rule: If in DETAILS mode, show ONLY assignments belonging to THAT specific batch
      if (viewMode === "DETAILS" && selectedAssignmentDetail) {
        const detailBatch = (selectedAssignmentDetail.targetBatch || "").toLowerCase();
        const isSameBatch =
          a.id === selectedAssignmentDetail.id ||
          targetBatch.includes(detailBatch) ||
          detailBatch.includes(targetBatch);

        if (!isSameBatch) return false;
      }

      const matchesSearch =
        !search ||
        title.includes(search) ||
        targetBatch.includes(search);

      const matchesBatch =
        selectedBatchFilter === "ALL" ||
        targetBatch.includes(selectedBatch);

      return matchesSearch && matchesBatch;
    });
  }, [
    teacherOnlyAssignments,
    searchQuery,
    selectedBatchFilter,
    viewMode,
    selectedAssignmentDetail,
  ]);

  // Filtered Submissions List (Strictly for Teacher's Assigned Batches & Clicked Assignment)
  const filteredSubmissions = useMemo(() => {
    let list = submittedList;

    // Rule 1: Filter strictly for logged-in teacher's assigned batches
    const teacherBatchNames = teacherBatches.map((b) => (b.name || "").toLowerCase());
    if (teacherBatchNames.length > 0) {
      list = list.filter((sub) => {
        const subBatch = (sub.batch || "").toLowerCase();
        return teacherBatchNames.some(
          (bName) => subBatch.includes(bName) || bName.includes(subBatch)
        );
      });
    }

    // Rule 2: If teacher clicked Eye on a specific assignment, filter strictly for that assignment
    if (selectedAssignmentForSubmissions) {
      const targetAsgId = selectedAssignmentForSubmissions.id;
      const targetTitle = (selectedAssignmentForSubmissions.title || "").trim().toLowerCase();

      list = list.filter((sub) => {
        const subAsgId = sub.assignmentId;
        const subTitle = (sub.assignmentTitle || "").trim().toLowerCase();

        if (subAsgId && subAsgId === targetAsgId) return true;
        if (subTitle && targetTitle && (subTitle === targetTitle || subTitle.includes(targetTitle) || targetTitle.includes(subTitle))) return true;

        return false;
      });
    }

    // Rule 3: Search bar & Status filter matching
    let filtered = list.filter((sub) => {
      const batch = (sub.batch || "").toLowerCase();
      const assignmentTitle = (sub.assignmentTitle || "").toLowerCase();
      const studentName = (sub.studentName || "").toLowerCase();
      const search = (submissionSearchTerm || "").trim().toLowerCase();

      const matchesBatch =
        submissionBatchFilter === "ALL" || batch.includes(submissionBatchFilter.toLowerCase());

      const matchesStatus =
        submissionStatusFilter === "ALL" ||
        (submissionStatusFilter === "PENDING" && (!sub.grade || sub.grade === "Pending"));

      const matchesTitle =
        !search ||
        (assignmentTitle && assignmentTitle.includes(search)) ||
        (studentName && studentName.includes(search));

      return matchesBatch && matchesStatus && matchesTitle;
    });

    if (submissionSort === "OLDEST") {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [
    submittedList,
    teacherBatches,
    submissionBatchFilter,
    submissionSearchTerm,
    submissionStatusFilter,
    submissionSort,
    selectedAssignmentForSubmissions,
  ]);

  // Course Name derived from assigned batches
  const primaryCourseName = teacherBatches.length > 0 ? (teacherBatches[0].courseName || "Kathak Foundation Course") : "Kathak Foundation Course";

  // Helper Avatar Renderer
  const renderTeacherAvatar = (name: string, url?: string) => {
    if (url) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
        />
      );
    }
    const initial = (name || "T").charAt(0).toUpperCase();
    return (
      <div className="w-10 h-10 rounded-full bg-[#900C27] text-white font-black text-sm flex items-center justify-center border border-white/20 shrink-0 shadow-2xs">
        {initial}
      </div>
    );
  };

  // ================= VIEW MODE 1: EVALUATION / VIDEO REVIEW SCREEN (MATCHING ADMIN FLOW) =================
  if (selectedVideoReview) {
    return (
      <div className="space-y-6 max-w-[1280px] mx-auto animate-in fade-in duration-300 pb-12">
        <div className="flex items-center gap-4 border-b border-stone-200/80 pb-4">
          <button
            type="button"
            onClick={() => setSelectedVideoReview(null)}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {renderTeacherAvatar(selectedVideoReview.studentName, selectedVideoReview.studentAvatar)}
          <div>
            <h2 className="font-extrabold text-xl text-stone-900">{selectedVideoReview.studentName}</h2>
            <p className="text-xs font-semibold text-stone-400">{selectedVideoReview.submittedTime}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Video Player Canvas & Student Message */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                  STUDENT SUBMISSION MESSAGE
                </h4>
                <span className="text-[10px] font-bold text-stone-400">Scrollable</span>
              </div>
              <div className="max-h-[160px] overflow-y-auto pr-2 text-xs italic text-stone-700 font-medium leading-relaxed space-y-2 font-sans">
                {selectedVideoReview.message ? (
                  selectedVideoReview.message.split("\n\n").map((para, i, arr) => (
                    <p key={i} className="whitespace-pre-line leading-relaxed">
                      {i === 0 ? `“${para}` : para}
                      {i === arr.length - 1 ? `”` : ""}
                    </p>
                  ))
                ) : (
                  <p className="text-stone-400 font-normal">No submission message attached.</p>
                )}
              </div>
            </div>

            {/* Video Player */}
            <div className="bg-stone-950 rounded-3xl overflow-hidden aspect-video flex items-center justify-center shadow-xl relative border border-stone-800 min-h-[360px]">
              {(() => {
                const { isIframe, url } = formatVideoUrl(selectedVideoReview.fileUrl);

                if (isIframe) {
                  return (
                    <iframe
                      src={url}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }

                return (
                  <video
                    key={url}
                    controls
                    autoPlay={false}
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain"
                  >
                    <source src={url} type="video/mp4" />
                    <source src={url} type="video/webm" />
                    Your browser does not support video playback.
                  </video>
                );
              })()}
            </div>
          </div>

          {/* Right Column: Grading & Evaluation Form */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-lg text-stone-900">Evaluation</h3>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-[#900C27] border border-rose-200">
                Grade Score
              </span>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-5">
              
              {/* Overall Grade Score Input */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-stone-800">Overall Grade (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={reviewRhythmScore}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val)) {
                        setReviewRhythmScore("");
                      } else {
                        setReviewRhythmScore(String(Math.min(100, Math.max(0, val))));
                      }
                    }}
                    className="w-20 h-10 rounded-xl bg-white border border-stone-200 text-center font-black text-sm text-[#900C27] focus:outline-none focus:border-[#900C27]"
                  />
                </div>
              </div>

              {/* Evaluation Parts / Criteria Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase text-stone-400 tracking-wider">
                    EVALUATION CRITERIA PARTS ({criteriaParts.length})
                  </p>
                </div>

                {criteriaParts.map((part, index) => (
                  <div key={part.id || index} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-stone-800">{part.name}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={part.score}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            const capped = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                            const updated = [...criteriaParts];
                            updated[index].score = capped;
                            setCriteriaParts(updated);
                          }}
                          className="w-16 h-7 rounded-lg bg-white border border-stone-200 text-center font-extrabold text-xs text-[#900C27]"
                        />
                        <button
                          type="button"
                          onClick={() => setCriteriaParts((prev) => prev.filter((_, i) => i !== index))}
                          className="text-stone-400 hover:text-rose-600 font-bold px-1 text-xs"
                          title="Remove Criterion"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Criterion Row */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add criterion name (e.g. Abhinaya, Chakkar)..."
                    value={newCriteriaName}
                    onChange={(e) => setNewCriteriaName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newCriteriaName.trim()) {
                          setCriteriaParts((prev) => [
                            ...prev,
                            { id: Date.now().toString(), name: newCriteriaName.trim(), score: 75 },
                          ]);
                          setNewCriteriaName("");
                        }
                      }
                    }}
                    className="flex-1 h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCriteriaName.trim()) {
                        setCriteriaParts((prev) => [
                          ...prev,
                          { id: Date.now().toString(), name: newCriteriaName.trim(), score: 75 },
                        ]);
                        setNewCriteriaName("");
                      }
                    }}
                    className="h-9 px-3.5 rounded-xl bg-[#900C27] text-white text-xs font-extrabold cursor-pointer hover:bg-[#780A20] transition-colors shrink-0 shadow-2xs"
                  >
                    + Add Part
                  </button>
                </div>
              </div>

              {/* KEY EVALUATION POINTERS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase text-stone-400 tracking-wider">
                    KEY EVALUATION POINTERS ({reviewPointers.length})
                  </p>
                </div>

                <div className="space-y-2">
                  {reviewPointers.map((pt, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                      <span className="font-semibold text-stone-700 leading-tight">
                        <span className="text-[#900C27] font-bold mr-1.5">0{idx + 1}.</span>
                        {pt}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReviewPointers((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-stone-400 hover:text-rose-600 font-bold px-1.5 py-0.5 rounded hover:bg-stone-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add key improvement pointer..."
                      value={newPointerInput}
                      onChange={(e) => setNewPointerInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newPointerInput.trim()) {
                            setReviewPointers((prev) => [...prev, newPointerInput.trim()]);
                            setNewPointerInput("");
                          }
                        }
                      }}
                      className="flex-1 h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPointerInput.trim()) {
                          setReviewPointers((prev) => [...prev, newPointerInput.trim()]);
                          setNewPointerInput("");
                        }
                      }}
                      className="h-9 px-3 rounded-xl bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-800 text-xs font-extrabold cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-stone-700">
                  Teacher Feedback &amp; Comments
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter constructive notes for student performance..."
                  value={reviewFeedbackText}
                  onChange={(e) => setReviewFeedbackText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Submit Evaluation &amp; Grade
              </button>

            </form>
          </div>

        </div>

      </div>
    );
  }

  // ================= VIEW MODE 2: STUDENT SUBMISSIONS VIEW (MATCHING FIGMA SPEC) =================
  if (viewMode === "SUBMISSIONS") {
    const totalSubmissionsCount = filteredSubmissions.length;
    const pendingSubmissionsCount = filteredSubmissions.filter((s) => !s.grade || s.grade === "Pending").length;
    const evaluatedSubmissionsCount = filteredSubmissions.filter((s) => s.grade && s.grade !== "Pending").length;

    return (
      <div className="space-y-8 animate-in fade-in duration-300 max-w-[1340px] mx-auto pb-16">
        {/* Top Header matching Figma Spec */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => setViewMode(selectedAssignmentDetail ? "DETAILS" : "LIST")}
              className="p-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs mt-1 shrink-0"
              title="Back to Batch Details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#900C27] tracking-wider uppercase">
                  {selectedAssignmentForSubmissions?.targetBatch || "KATHAK PRO 2024-B"}
                </span>
                <span className="text-[10px] text-stone-300 font-bold">•</span>
                <span className="text-[10px] font-extrabold text-stone-500">
                  {selectedAssignmentForSubmissions?.totalStudents || "45"} Students Enrolled
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-[#0B1C30] tracking-tight">
                {selectedAssignmentForSubmissions?.title || "Rhythmic Footwork Week 3"}
              </h1>

              <p className="text-xs sm:text-sm font-medium text-[#464555] max-w-3xl leading-relaxed">
                {selectedAssignmentForSubmissions?.instructions || "Review and evaluate technical proficiency in Tatkar patterns and rhythmic variations."}{" "}
                <span className="font-extrabold text-stone-800 ml-1">
                  Deadline: {selectedAssignmentForSubmissions?.dueDate || "Oct 24th, 2024"}.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 Metric Cards matching Figma Spec */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
              TOTAL SUBMISSIONS
            </p>
            <h3 className="text-3xl font-black text-[#0B1C30]">{totalSubmissionsCount}</h3>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
              PENDING
            </p>
            <h3 className="text-3xl font-black text-[#0B1C30]">{pendingSubmissionsCount}</h3>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
              SUBMITTED
            </p>
            <h3 className="text-3xl font-black text-[#0B1C30]">{evaluatedSubmissionsCount}</h3>
          </div>
        </div>

        {/* Submissions Control / Filter & Layout Bar matching Figma Spec */}
        <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Tabs (All Submissions | Pending) */}
          <div className="flex items-center gap-2 bg-stone-100/70 p-1.5 rounded-2xl border border-stone-200/60 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSubmissionStatusFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                submissionStatusFilter === "ALL"
                  ? "bg-[#900C27] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              All Submissions
            </button>
            <button
              type="button"
              onClick={() => setSubmissionStatusFilter("PENDING")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                submissionStatusFilter === "PENDING"
                  ? "bg-[#900C27] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Pending ({pendingSubmissionsCount})
            </button>
          </div>

          {/* Search Input & Right Controls */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or title..."
                value={submissionSearchTerm}
                onChange={(e) => setSubmissionSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#900C27]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={submissionSort}
                onChange={(e) => setSubmissionSort(e.target.value as "NEWEST" | "OLDEST")}
                className="bg-stone-50 border border-stone-200 text-[#900C27] font-extrabold rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
              </select>
            </div>

            {/* View Mode Toggle Buttons (Grid vs Table) */}
            <div className="flex items-center gap-1 bg-stone-100/70 p-1 rounded-2xl border border-stone-200/60 shrink-0">
              <button
                type="button"
                onClick={() => setSubmissionsViewMode("GRID")}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionsViewMode === "GRID"
                    ? "bg-white text-[#900C27] shadow-xs border border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Grid View Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSubmissionsViewMode("TABLE")}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionsViewMode === "TABLE"
                    ? "bg-white text-[#900C27] shadow-xs border border-stone-200"
                    : "text-stone-500 hover:text-stone-800"
                }`}
                title="Table List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body: Grid View Cards vs Table List View */}
        {submissionsViewMode === "GRID" ? (
          /* ================= FIGMA SPEC GRID VIEW CARDS ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubmissions.length === 0 ? (
              <div className="col-span-full py-16 text-center text-stone-400 font-semibold bg-white rounded-3xl border border-stone-200/80 shadow-2xs">
                No student submissions found.
              </div>
            ) : (
              filteredSubmissions.map((row) => {
                const isGraded = Boolean(row.grade && row.grade !== "Pending");
                return (
                  <div
                    key={row.id}
                    className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
                  >
                    {/* Video Box Container */}
                    <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden border border-stone-200/80 group">
                      {row.fileUrl ? (
                        <video
                          src={row.fileUrl}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src="https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop"
                          alt="Dance Video Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                      {/* Top Overlay Badge */}
                      {isGraded ? (
                        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-amber-600 font-black text-xs px-2.5 py-1 rounded-full border border-amber-200 shadow-sm flex items-center gap-1">
                          <span>⭐</span>
                          <span>{row.grade}/100</span>
                        </div>
                      ) : (
                        <div className="absolute top-2.5 left-2.5 bg-[#900C27] text-white font-extrabold text-[9.5px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                          PENDING REVIEW
                        </div>
                      )}

                      {/* Video Duration Badge */}
                      <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        02:45
                      </div>
                    </div>

                    {/* Card Student Footer */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3">
                        {renderTeacherAvatar(row.studentName, row.studentAvatar)}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-xs text-stone-900 leading-tight truncate">
                            {row.studentName}
                          </h4>
                          <p className="text-[10px] font-medium text-stone-400 truncate mt-0.5">
                            Submitted {row.submittedDate}
                          </p>
                        </div>
                      </div>

                      {/* Action Bar matching Figma Spec Screenshot */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 gap-2">
                        {isGraded ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openReviewFromSubmission(row)}
                              className="py-1.5 px-3 rounded-xl bg-[#EAF2FF] hover:bg-blue-100 text-[#2563EB] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-blue-100"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Feedback</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* Red Square Video/Review Button */}
                            <button
                              type="button"
                              onClick={() => openReviewFromSubmission(row)}
                              className="w-9 h-9 rounded-xl bg-[#900C27] hover:bg-[#780A20] text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                              title="Review & Grade Video"
                            >
                              <Film className="w-4 h-4" />
                            </button>

                            {/* Blue Square Edit Icon Button */}
                            <button
                              type="button"
                              onClick={() => openReviewFromSubmission(row)}
                              className="w-9 h-9 rounded-xl bg-[#EAF2FF] hover:bg-blue-100 text-slate-700 flex items-center justify-center cursor-pointer transition-colors border border-blue-100/80"
                              title="Edit Evaluation"
                            >
                              <Pencil className="w-4 h-4 text-slate-700" />
                            </button>

                            {/* Blue Square Comment Icon Button */}
                            <button
                              type="button"
                              onClick={() => openReviewFromSubmission(row)}
                              className="w-9 h-9 rounded-xl bg-[#EAF2FF] hover:bg-blue-100 text-slate-700 flex items-center justify-center cursor-pointer transition-colors border border-blue-100/80"
                              title="Add Feedback Comment"
                            >
                              <MessageSquare className="w-4 h-4 text-slate-700" />
                            </button>
                          </div>
                        )}

                        {/* Student ID Pill Tag */}
                        <span className="text-[10.5px] font-mono font-bold text-[#1E293B] px-3 py-1.5 bg-[#EAF2FF] rounded-2xl border border-blue-100/80 shrink-0">
                          {row.studentId || "#2024-089"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* ================= TABLE LIST VIEW ================= */
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-50/60 border-b border-sky-100 text-[11px] font-black uppercase tracking-wider text-stone-600">
                    <th className="py-4 px-6">STUDENT</th>
                    <th className="py-4 px-6">ASSIGNMENT</th>
                    <th className="py-4 px-6">BATCH</th>
                    <th className="py-4 px-6">SUBMITTED DATE</th>
                    <th className="py-4 px-6">GRADE / STATUS</th>
                    <th className="py-4 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-semibold">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                        No student submissions found in database.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((row) => (
                      <tr key={row.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {renderTeacherAvatar(row.studentName, row.studentAvatar)}
                            <div>
                              <p className="font-extrabold text-stone-900 leading-tight">{row.studentName}</p>
                              <p className="text-[10px] text-stone-400 font-bold">{row.studentId || "#SUB"}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <p className="font-extrabold text-stone-900 leading-tight">{row.assignmentTitle}</p>
                        </td>

                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] font-extrabold text-[11px] border border-sky-100">
                            {row.batch}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-bold text-stone-800">
                          {row.submittedDate}
                        </td>

                        <td className="py-4 px-6">
                          {row.grade ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-100">
                              Grade: {row.grade}/100
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-extrabold text-[11px] border border-amber-100">
                              Pending Review
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => openReviewFromSubmission(row)}
                            className="px-4 py-1.5 rounded-xl bg-[#900C27] hover:bg-[#780A20] text-white font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW MODE 3: TEACHER DETAILS SUB-VIEW (FIGMA SCREENSHOT 2) =================
  if (viewMode === "DETAILS") {
    const activeCount = filteredAssignments.length;
    const pendingCount = metrics.pendingReviews;
    const completionRateStr = metrics.avgCompletionRate;

    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-[1280px] mx-auto pb-12">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-2">
          <button
            type="button"
            onClick={() => setViewMode("LIST")}
            className="hover:text-[#900C27] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Assignment Management</span>
          </button>
          <span>/</span>
          <span className="text-stone-900 font-bold">
            {selectedAssignmentDetail ? `Batch Details: ${selectedAssignmentDetail.targetBatch}` : "Teacher Details"}
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {renderTeacherAvatar(teacherProfile.name, teacherProfile.avatarUrl)}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {teacherProfile.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-500">
              <span className="flex items-center gap-1.5 text-stone-700">
                <GraduationCap className="w-4 h-4 text-[#900C27]" />
                {teacherProfile.dept}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-stone-700">
                <Briefcase className="w-4 h-4 text-[#900C27]" />
                Faculty Member
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#900C27] font-bold">
                <Folder className="w-4 h-4" />
                {filteredAssignments.length} Batch Assignments
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                ACTIVE ASSIGNMENTS
              </p>
              <h3 className="text-3xl font-black text-stone-900 mt-1">{activeCount}</h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                PENDING REVIEWS
              </p>
              <h3 className="text-3xl font-black text-stone-900 mt-1">{pendingCount}</h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10.5px] font-black uppercase text-stone-400 tracking-wider">
                AVG COMPLETION RATE
              </p>
              <h3 className="text-3xl font-black text-stone-900 mt-1">{completionRateStr}</h3>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#900C27]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="h-10 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-extrabold text-stone-800 focus:outline-none"
            >
              <option value="ALL">All Batches</option>
              {teacherBatches.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/60 border-b border-sky-100 text-[11px] font-black uppercase tracking-wider text-stone-600">
                  <th className="py-4 px-6">ASSIGNMENT TITLE</th>
                  <th className="py-4 px-6">DUE DATE</th>
                  <th className="py-4 px-6">TARGET BATCH</th>
                  <th className="py-4 px-6">SUBMISSIONS</th>
                  <th className="py-4 px-6">STATUS</th>
                  <th className="py-4 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-semibold">
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                      No assignments available in database.
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-extrabold text-stone-900 leading-tight">{row.title}</p>
                        <p className="text-[10px] text-sky-600 font-bold mt-0.5">{row.typeTag}</p>
                      </td>

                      <td className="py-4 px-6 font-bold text-stone-800">
                        {row.dueDate}
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] font-extrabold text-[11px] border border-sky-100">
                          {row.targetBatch}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-bold text-stone-800">
                        {row.totalStudents}
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-extrabold text-[11px] border border-purple-100 flex items-center gap-1.5 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                          Active
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => openAssignmentSubmissions(row)}
                          className="p-2 rounded-xl border border-rose-200 text-[#900C27] hover:bg-rose-50 cursor-pointer inline-flex items-center justify-center transition-colors shadow-2xs"
                          title="View Student Submissions & Evaluate"
                        >
                          <Eye className="w-4 h-4" />
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
    );
  }

  // ================= VIEW MODE 4: CREATE NEW ASSIGNMENT FORM (SCREENSHOTS 1, 2 & 3) =================
  if (viewMode === "CREATE") {
    return (
      <div className="space-y-8 animate-in fade-in duration-300 max-w-[1280px] mx-auto pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
              <button
                type="button"
                onClick={() => setViewMode("LIST")}
                className="hover:text-[#900C27] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Assignments</span>
              </button>
              <span>/</span>
              <span className="text-stone-900 font-bold">Create New</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B1C30] tracking-tight">
              Create New Assignment
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className="px-5 py-2.5 rounded-2xl border border-stone-200 text-stone-700 font-extrabold text-xs hover:bg-stone-100 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleCreateAssignmentSubmit(true)}
              disabled={submitting || uploadingFile}
              className="px-5 py-2.5 rounded-2xl border border-rose-200 text-[#900C27] bg-rose-50/50 hover:bg-rose-100 font-extrabold text-xs cursor-pointer transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleCreateAssignmentSubmit(false)}
              disabled={submitting || uploadingFile}
              className="px-6 py-2.5 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs cursor-pointer transition-colors shadow-xs flex items-center gap-2"
            >
              {(submitting || uploadingFile) && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Publish Assignment</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
              <div className="flex items-center gap-2 text-stone-900 border-b border-stone-100 pb-4">
                <Info className="w-4 h-4 text-[#900C27]" />
                <h3 className="font-extrabold text-sm text-stone-900 tracking-tight">
                  Assignment Basics
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-stone-700">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Kathak Mudras Practical Exam"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-stone-700">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-extrabold text-stone-800 focus:bg-white focus:outline-none focus:border-[#900C27]"
                    >
                      <option value="Video Submission">Video Submission</option>
                      <option value="Theory Assessment">Theory Assessment</option>
                      <option value="Practical Demonstration">Practical Demonstration</option>
                      <option value="Rhythm & Taal Practice">Rhythm &amp; Taal Practice</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-stone-700">
                        Course
                      </label>
                      <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-stone-400" />
                        Locked to Assigned Batches
                      </span>
                    </div>
                    <div className="w-full h-12 px-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs font-bold text-stone-500 flex items-center justify-between cursor-not-allowed">
                      <span className="truncate">{primaryCourseName}</span>
                      <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
              <div className="flex items-center gap-2 text-stone-900 border-b border-stone-100 pb-4">
                <FileText className="w-4 h-4 text-[#900C27]" />
                <h3 className="font-extrabold text-sm text-stone-900 tracking-tight">
                  Instructions &amp; Resources
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-stone-700">
                    Assignment Instructions
                  </label>
                  <div className="rounded-2xl border border-stone-200 overflow-hidden">
                    <div className="bg-slate-50 border-b border-stone-200 px-4 py-2 flex items-center gap-3 text-xs font-bold text-stone-600 select-none">
                      <button
                        type="button"
                        onClick={() => applyInstructionsFormat("bold")}
                        className="px-2.5 py-1 rounded hover:bg-stone-200 text-stone-800 font-black cursor-pointer transition-colors"
                        title="Bold text (**text**)"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => applyInstructionsFormat("italic")}
                        className="px-2.5 py-1 rounded hover:bg-stone-200 text-stone-800 italic font-black cursor-pointer transition-colors"
                        title="Italic text (_text_)"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => applyInstructionsFormat("list")}
                        className="px-2.5 py-1 rounded hover:bg-stone-200 text-stone-800 font-extrabold cursor-pointer transition-colors"
                        title="Bullet List (• item)"
                      >
                        ≡
                      </button>
                      <button
                        type="button"
                        onClick={() => applyInstructionsFormat("link")}
                        className="px-2.5 py-1 rounded hover:bg-stone-200 text-stone-800 font-extrabold cursor-pointer transition-colors"
                        title="Insert Link ([title](url))"
                      >
                        🔗
                      </button>
                    </div>
                    <textarea
                      ref={instructionsTextareaRef}
                      rows={5}
                      placeholder="Provide detailed steps for the students..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full p-4 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Reference Materials File Upload Box with LIVE Video Preview */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-stone-700">
                    Reference Materials
                  </label>
                  <div
                    className={`p-6 rounded-3xl transition-all text-center flex flex-col items-center justify-center space-y-3 ${
                      uploadedFileUrl
                        ? "bg-emerald-50/60 border-2 border-emerald-300"
                        : uploadingFile
                        ? "bg-rose-50/40 border-2 border-rose-200"
                        : "bg-sky-50/50 border-2 border-dashed border-sky-200 hover:border-sky-400 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!uploadedFileUrl && !uploadingFile) {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    {uploadingFile ? (
                      <div className="space-y-2 w-full max-w-xs mx-auto py-4">
                        <Loader2 className="w-8 h-8 text-[#900C27] animate-spin mx-auto" />
                        <p className="text-xs font-bold text-stone-800">
                          Uploading video ({uploadProgress}%)...
                        </p>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#900C27] h-full rounded-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : uploadedFileUrl ? (
                      <div className="space-y-3 w-full text-center">
                        <div className="flex items-center justify-center gap-2 text-emerald-700 font-extrabold text-xs">
                          <Check className="w-5 h-5 bg-emerald-500 text-white rounded-full p-0.5" />
                          <span>{uploadedFileName || uploadedFile?.name || "Uploaded Reference File"}</span>
                        </div>

                        {/* Interactive Preview Player */}
                        <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg border border-stone-800 bg-black aspect-video flex items-center justify-center">
                          {(() => {
                            const fileName = uploadedFileName || uploadedFile?.name || uploadedFileUrl || "";
                            const isPdf = fileName.toLowerCase().endsWith(".pdf") || uploadedFile?.type === "application/pdf";
                            const isImage = uploadedFile?.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                            
                            if (isPdf) {
                              return (
                                <iframe src={uploadedFileUrl} className="w-full h-full bg-white" title="PDF Preview" />
                              );
                            } else if (isImage) {
                              /* eslint-disable-next-line @next/next/no-img-element */
                              return (
                                <img src={uploadedFileUrl} className="w-full h-full object-contain bg-stone-900" alt="Preview" />
                              );
                            } else {
                              return (
                                <video
                                  src={uploadedFileUrl}
                                  controls
                                  playsInline
                                  className="w-full h-full object-contain"
                                />
                              );
                            }
                          })()}
                        </div>

                        <div className="pt-1 flex items-center justify-center gap-3">
                          <span className="text-[11px] font-bold text-emerald-600">
                            ✓ Uploaded &amp; Ready to Publish
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="text-xs font-bold text-stone-600 underline hover:text-[#900C27] cursor-pointer"
                          >
                            Change File
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white text-sky-600 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-stone-900">
                            Click or drag files to upload
                          </p>
                          <p className="text-[11px] font-semibold text-stone-400 mt-0.5">
                            Upload PDFs, Performance Videos, or Audio clips (Max 50MB)
                          </p>
                        </div>
                      </>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*,audio/*,image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFile(file);
                          handleAssignmentFileUpload(file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#900C27]" />
                <h3 className="font-extrabold text-sm text-stone-900 tracking-tight">
                  Evaluation Criteria
                </h3>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-rose-50 text-[#900C27] font-black text-xs border border-rose-200">
                Total Marks: 100
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 text-stone-900 border-b border-stone-100 pb-3">
                <CalendarIcon className="w-4 h-4 text-[#900C27]" />
                <h3 className="font-extrabold text-sm text-stone-900 tracking-tight">
                  Submission Schedule
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-stone-700">
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:border-[#900C27]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-stone-700">
                    Deadline Time
                  </label>
                  <input
                    type="time"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    className="w-full h-11 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:bg-white focus:outline-none focus:border-[#900C27]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-stone-900">
                      Allow late submissions
                    </p>
                    <p className="text-[10px] font-semibold text-stone-500 mt-0.5">
                      Submissions marked &apos;Late&apos; after deadline
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowLate(!allowLate)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                      allowLate ? "bg-[#900C27]" : "bg-stone-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        allowLate ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 border-b border-stone-100 pb-3">
                <Users className="w-4 h-4 text-[#900C27]" />
                <h3 className="font-extrabold text-sm text-stone-900 tracking-tight">
                  Target Batches
                </h3>
              </div>

              <div className="space-y-3">
  <p className="text-xs font-bold text-stone-500">
    Select Eligible Batches
  </p>

  {teacherBatches.length === 0 ? (
    <div className="p-4 rounded-2xl bg-stone-50 text-center text-xs font-semibold text-stone-400">
      No assigned batches found.
    </div>
  ) : (
    teacherBatches.map((b) => {
      const isSelected = selectedBatchIds.includes(b.id);

      return (
        <div
          key={b.id}
          onClick={() => handleToggleBatch(b.id)}
          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
            isSelected
              ? "bg-rose-50/60 border-rose-300 text-stone-900 shadow-2xs"
              : "bg-white border-stone-200 hover:bg-stone-50 text-stone-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                isSelected
                  ? "bg-[#900C27] border-[#900C27]"
                  : "border-stone-300 bg-white"
              }`}
            >
              {isSelected && (
                <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
              )}
            </div>
            <div>
              <p className="text-xs font-extrabold text-stone-900">{b.name}</p>
              <p className="text-[10px] font-bold text-stone-400">
                {b.code} · {b.status || "ACTIVE"}
              </p>
            </div>
          </div>
        </div>
      );
    })
  )}
</div>
            </div>

            {/* 1:1 Figma Matched "Need Help?" Card with Circular Watermark Accent */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-[#900C27] text-white shadow-xl space-y-4 overflow-hidden">
              {/* Circular Watermark Shape (1:1 Figma Match) */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border-[16px] border-white/10 pointer-events-none" />

              <div className="space-y-2 relative z-10">
                <h4 className="font-extrabold text-lg tracking-tight">
                  Need Help?
                </h4>
                <p className="text-xs text-rose-100/90 font-medium leading-relaxed">
                  Need inspiration for your rubric? Check our institution&apos;s standard grading templates to ensure consistency across batches.
                </p>
              </div>

              <div className="pt-1 relative z-10">
                <button
                  type="button"
                  className="w-full py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white font-extrabold text-xs transition-colors cursor-pointer text-center border border-white/25 shadow-2xs"
                >
                  View Templates
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }

  // ================= VIEW MODE 5: ASSIGNMENT MANAGEMENT MAIN LIST VIEW (MATCHING ADMIN FLOW) =================
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Assignment Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-500">
            Review, evaluate, and assign Kathak practice modules for your batches.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("SUBMISSIONS")}
            className="px-5 py-2.5 rounded-2xl border border-rose-200 text-[#900C27] bg-rose-50/50 hover:bg-rose-100 font-extrabold text-xs cursor-pointer transition-colors"
          >
            Submitted Assignment
          </button>

          <button
            type="button"
            onClick={() => setViewMode("CREATE")}
            className="px-6 py-2.5 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white font-extrabold text-xs cursor-pointer transition-colors shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-4 transition-all hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#900C27] shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
              TOTAL ACTIVE
            </p>
            <h3 className="text-2xl font-black text-stone-900 leading-tight mt-0.5">
              {teacherOnlyAssignments.length}
            </h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-4 transition-all hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284C7] shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
              PENDING REVIEWS
            </p>
            <h3 className="text-2xl font-black text-stone-900 leading-tight mt-0.5">
              {metrics.pendingReviews}
            </h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-4 transition-all hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
              SUBMISSIONS THIS WEEK
            </p>
            <h3 className="text-2xl font-black text-stone-900 leading-tight mt-0.5">
              {metrics.submissionsThisWeek}
            </h3>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-4 transition-all hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0E7490] shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
              AVG COMPLETION RATE
            </p>
            <h3 className="text-2xl font-black text-stone-900 leading-tight mt-0.5">
              {metrics.avgCompletionRate}
            </h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by assignment name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500">Batch:</span>
              <select
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
                className="h-10 px-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#900C27]"
              >
                <option value="ALL">All Teacher Batches</option>
                {teacherBatches.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-2xl bg-stone-100 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setStatusFilter("ACTIVE")}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  statusFilter === "ACTIVE"
                    ? "bg-white text-[#900C27] shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("DRAFT")}
                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                  statusFilter === "DRAFT"
                    ? "bg-white text-[#900C27] shadow-xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Draft
              </button>
            </div>

            <button
              type="button"
              className="h-10 px-4 rounded-2xl border border-stone-200 bg-white text-stone-700 font-extrabold text-xs hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-stone-500" />
              <span>Date Range</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#900C27] animate-spin mx-auto" />
            <p className="text-xs font-mono font-bold text-stone-400 uppercase">Loading Assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">No Assignments Found</p>
            <p className="text-xs font-semibold text-stone-400">
              Click &quot;Create New Assignment&quot; to assign tasks to your batches.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/60 border-b border-sky-100 text-[11px] font-black uppercase tracking-wider text-stone-600">
                  <th className="py-4 px-6">TEACHER</th>
                  <th className="py-4 px-6">ASSIGNMENT TITLE</th>
                  <th className="py-4 px-6">TARGET BATCH</th>
                  <th className="py-4 px-6">DUE DATE</th>
                  <th className="py-4 px-6">TOTAL STUDENTS</th>
                  <th className="py-4 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-semibold">
                {filteredAssignments.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                   <td className="py-4 px-6">
  <div className="flex items-center gap-3">
    {renderTeacherAvatar(
      item.teacherName || teacherProfile.name,
      item.teacherAvatar
    )}
    <div>
      <p className="font-extrabold text-stone-900 leading-tight">
        {item.teacherName || teacherProfile.name}
      </p>
      <p className="text-[10px] text-stone-400 font-bold flex items-center gap-1 mt-0.5">
        <span
          className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
            item.teacherDept === "Admin"
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : "bg-rose-50 text-[#900C27] border border-rose-200"
          }`}
        >
          {item.teacherDept || "Teacher"}
        </span>
      </p>
    </div>
  </div>
</td>

                    <td className="py-4 px-6">
                      <div>
                        <p className="font-extrabold text-stone-900 leading-tight">{item.title}</p>
                        <p className="text-[10.5px] font-bold text-sky-600 hover:underline cursor-pointer">
                          {item.typeTag}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] font-extrabold text-[11px] border border-sky-100">
                        {item.targetBatch}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-stone-800">
                      {item.dueDate}
                    </td>

                    <td className="py-4 px-6 font-bold text-stone-700">
                      {item.totalStudents}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAssignmentDetail(item);
                          setViewMode("DETAILS");
                        }}
                        className="px-4 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold hover:bg-stone-100 cursor-pointer transition-colors shadow-2xs"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-500">
          <span>Showing 1-{filteredAssignments.length} of {assignments.length} results</span>
          <div className="flex items-center gap-1.5">
            <button type="button" className="p-1 rounded-lg border border-stone-200 text-stone-400 hover:bg-stone-50 cursor-pointer">
              &lt;
            </button>
            <button type="button" className="w-7 h-7 rounded-lg bg-[#900C27] text-white flex items-center justify-center font-bold">
              1
            </button>
            <button type="button" className="w-7 h-7 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center justify-center">
              2
            </button>
            <button type="button" className="w-7 h-7 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center justify-center">
              3
            </button>
            <span className="px-1 text-stone-300">...</span>
            <button type="button" className="w-7 h-7 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center justify-center">
              12
            </button>
            <button type="button" className="p-1 rounded-lg border border-stone-200 text-stone-400 hover:bg-stone-50 cursor-pointer">
              &gt;
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
