"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { apiRequest } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
import {
  Plus,
  Search,
  ChevronDown,
  Calendar,
  FileText,
  Clock,
  CheckSquare,
  BarChart3,
  ArrowLeft,
  Info,
  Upload,
  HelpCircle,
  // Play,
  Lock,
  Download,
  Eye,
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Briefcase,
  SlidersHorizontal
} from "lucide-react";

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

interface BatchOption {
  id: string;
  name: string;
  courseId?: string;
  courseName?: string;
}

interface CourseOption {
  id: string;
  title: string;
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

// Format video URL to handle relative backend paths, cloud URLs, iframe embeds, and fallbacks
const formatVideoUrl = (rawUrl?: string): { isIframe: boolean; url: string } => {
  const fallbackVideo = "https://vjs.zencdn.net/v/oceans.mp4";

  if (!rawUrl || rawUrl.trim() === "" || rawUrl === "---" || rawUrl === "null" || rawUrl === "undefined") {
    return { isIframe: false, url: fallbackVideo };
  }

  let cleanUrl = rawUrl.trim();

  // If path is relative to backend (e.g. /uploads/video.mp4 or uploads/video.mp4)
  if (cleanUrl.startsWith("/uploads") || cleanUrl.startsWith("uploads/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const backendRoot = apiBase.replace(/\/api\/v1\/?$/, "");
    const relativePath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
    cleanUrl = `${backendRoot}${relativePath}`;
  }

  // Detect iframe / embed links (BunnyStream, YouTube, Vimeo, Cloudinary embed)
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

export default function AssignmentView() {
  const [assignmentsList, setAssignmentsList] = useState<AssignmentItem[]>([]);
  const [submittedList, setSubmittedList] = useState<SubmittedAssignmentRecord[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [metrics, setMetrics] = useState({
    totalActive: 0,
    pendingReviews: 0,
    submissionsThisWeek: 0,
    avgCompletionRate: "0%",
  });
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 10;
  const [assignmentsPage, setAssignmentsPage] = useState(1);
  const [submissionsPage, setSubmissionsPage] = useState(1);

  // Filter States - Main List
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState("");
  const [assignmentBatchFilter, setAssignmentBatchFilter] = useState("All Batches");
  const [assignmentCourseFilter, setAssignmentCourseFilter] = useState("All Courses");
  const [assignmentStatusTab, setAssignmentStatusTab] = useState<"Active" | "Draft">("Active");

  // Filter States - Student Submissions List
  const [submissionBatchFilter, setSubmissionBatchFilter] = useState("All Batches");
  const [submissionTitleSearch, setSubmissionTitleSearch] = useState("");
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState("All");

  // Filter States - Teacher Detail View
  const [detailSearchTerm, setDetailSearchTerm] = useState("");
  // const [detailBatchFilter, setDetailBatchFilter] = useState("All Batches");
  const [detailStatusFilter, setDetailStatusFilter] = useState("All Status");

  // View Mode Navigation
  const [isViewingSubmittedAssignments, setIsViewingSubmittedAssignments] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [selectedTeacherDetail, setSelectedTeacherDetail] = useState<AssignmentItem | null>(null);
  const [assignmentDetails, setAssignmentDetails] = useState<any>(null);
  const [selectedVideoReview, setSelectedVideoReview] = useState<VideoSubmissionCard | null>(null);

  // Evaluation state
  const [reviewRhythmScore, setReviewRhythmScore] = useState("0");
  const [criteriaParts, setCriteriaParts] = useState<{ id: string; name: string; score: number }[]>([]);
  const [newCriteriaName, setNewCriteriaName] = useState("");
  const [reviewPointers, setReviewPointers] = useState<string[]>([]);
  const [newPointerInput, setNewPointerInput] = useState("");
  const [reviewFeedbackText, setReviewFeedbackText] = useState("");

  const recalculateOverallGrade = (parts: { id: string; name: string; score: number }[]) => {
    if (parts.length === 0) {
      setReviewRhythmScore("0");
      return;
    }
    const total = parts.reduce((acc, p) => acc + (p.score || 0), 0);
    const avg = Math.round(total / parts.length);
    setReviewRhythmScore(avg.toString());
  };

  // Create Form State
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentCategory, setNewAssignmentCategory] = useState("Video Submission");
  const [newAssignmentCourseId, setNewAssignmentCourseId] = useState("");
  const [newAssignmentCourseTitle, setNewAssignmentCourseTitle] = useState("");
  const [newAssignmentInstructions, setNewAssignmentInstructions] = useState("");
  const [newAssignmentDeadlineDate, setNewAssignmentDeadlineDate] = useState("");
  const [newAssignmentDeadlineTime, setNewAssignmentDeadlineTime] = useState("");
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);

  const adminInstructionsTextareaRef = useRef<HTMLTextAreaElement>(null);

  const applyAdminInstructionsFormat = (type: "bold" | "italic" | "list" | "link") => {
    const textarea = adminInstructionsTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newAssignmentInstructions.substring(start, end);

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

    const newInstructions = newAssignmentInstructions.substring(0, start) + replacement + newAssignmentInstructions.substring(end);
    setNewAssignmentInstructions(newInstructions);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };
  const [selectedTargetBatches, setSelectedTargetBatches] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // File Upload State
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadingFile, setUploadingFile] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileType, setUploadedFileType] = useState<"image" | "video" | "other">("other");

  const toggleBatchSelection = (batchName: string) => {
    setSelectedTargetBatches((prev) =>
      prev.includes(batchName) ? prev.filter((b) => b !== batchName) : [...prev, batchName]
    );
  };

  const fetchAssignmentsData = useCallback(async () => {
    try {
      const res = await apiRequest("/admin/assignments");
      if (res?.data) {
        const fetchedList = res.data.assignments || res.data.records || [];
        setAssignmentsList(fetchedList);
        if (res.data.metrics) {
          setMetrics({
            totalActive: res.data.metrics.totalActive ?? fetchedList.length,
            pendingReviews: res.data.metrics.pendingReviews ?? 0,
            submissionsThisWeek: res.data.metrics.submissionsThisWeek ?? 0,
            avgCompletionRate: res.data.metrics.avgCompletionRate ?? "0%",
          });
        } else {
          setMetrics({
            totalActive: fetchedList.length,
            pendingReviews: 0,
            submissionsThisWeek: 0,
            avgCompletionRate: "0%",
          });
        }
      }

      const subRes = await apiRequest("/admin/assignments/submissions");
      if (subRes?.data) {
        const fetchedSubmissions = subRes.data.submissions || subRes.data.records || [];
        setSubmittedList(fetchedSubmissions);
      }
    } catch (err) {
      console.error("Failed to fetch assignments from API:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchAssignmentDetails = useCallback(async (id: string) => {
    try {
      const res = await apiRequest(`/admin/assignments/${id}`);

      const a = res.data;

      const formattedAssignment = {
        ...a,

        teacherName: "Admin User",
        teacherDept: "Faculty Lead",
        teacherAvatar: "/Ananya.png",

        targetBatch:
          a.batchName ||
          a.batch?.name ||
          "No Batch Assigned",

        dueDate: a.dueDate
          ? new Date(a.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
          : "-",

        totalStudents: `${a.submissions?.length || 0} Submissions`,
      };

      setAssignmentDetails(formattedAssignment);
      setSelectedTeacherDetail(formattedAssignment);

    } catch (err) {
      console.error("Failed to fetch assignment details:", err);
    }
  }, []);

  const fetchBatches = useCallback(async () => {
    try {
      const res = await apiRequest("/admin/batches");
      const list = res.data?.batches || [];
      setBatches(
        list.map((b: any) => ({
          id: b.id,
          name: b.name || b.code || "Unnamed Batch",
          courseId: b.courseId || b.course?.id,
          courseName: b.courseName || b.course?.title || b.course,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch batches from API:", err);
    }
  }, []);

  const availableBatchesForSelectedCourse = useMemo(() => {
    if (!newAssignmentCourseId && !newAssignmentCourseTitle) return batches;

    const filtered = batches.filter((b) => {
      if (b.courseId && newAssignmentCourseId && b.courseId === newAssignmentCourseId) {
        return true;
      }
      if (b.courseName && newAssignmentCourseTitle) {
        const bCourse = b.courseName.toLowerCase().trim();
        const selectedCourse = newAssignmentCourseTitle.toLowerCase().trim();
        if (bCourse.includes(selectedCourse) || selectedCourse.includes(bCourse)) {
          return true;
        }
      }
      return false;
    });

    return filtered.length > 0 ? filtered : batches;
  }, [batches, newAssignmentCourseId, newAssignmentCourseTitle]);

  const fetchCourses = useCallback(async () => {
    try {
      let res;
      try {
        res = await apiRequest("/admin/courses");
      } catch {
        res = await apiRequest("/courses");
      }
      const list = res.data?.courses || res.data || [];
      const mapped = (Array.isArray(list) ? list : []).map((c: any) => ({
        id: c.id,
        title: c.title || c.name || "Untitled Course",
      }));
      setCourses(mapped);
      if (mapped.length > 0 && !newAssignmentCourseId) {
        setNewAssignmentCourseId(mapped[0].id);
        setNewAssignmentCourseTitle(mapped[0].title);
      }
    } catch (err) {
      console.error("Failed to fetch courses from API:", err);
    }
  }, [newAssignmentCourseId]);

  useEffect(() => {
    fetchAssignmentsData();
    fetchBatches();
    fetchCourses();
  }, [fetchAssignmentsData, fetchBatches, fetchCourses]);
 
  useEffect(() => {
    setAssignmentsPage(1);
  }, [assignmentSearchTerm, assignmentBatchFilter, assignmentCourseFilter, assignmentStatusTab]);

  useEffect(() => {
    setSubmissionsPage(1);
  }, [submissionBatchFilter, submissionTitleSearch, submissionStatusFilter]);

  const filteredAssignments = useMemo(() => {
    return assignmentsList.filter((asg) => {
      const matchesSearch =
        !assignmentSearchTerm ||
        asg.title?.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
        asg.typeTag?.toLowerCase().includes(assignmentSearchTerm.toLowerCase());
      const matchesBatch =
        assignmentBatchFilter === "All Batches" || asg.targetBatch === assignmentBatchFilter;
      return matchesSearch && matchesBatch;
    });
  }, [assignmentsList, assignmentSearchTerm, assignmentBatchFilter]);

  const filteredSubmissions = useMemo(() => {
    return submittedList.filter((sub) => {
      const matchesBatch =
        submissionBatchFilter === "All Batches" || sub.batch === submissionBatchFilter;
      const matchesTitle =
        !submissionTitleSearch ||
        sub.assignmentTitle?.toLowerCase().includes(submissionTitleSearch.toLowerCase()) ||
        sub.studentName?.toLowerCase().includes(submissionTitleSearch.toLowerCase());
      const matchesStatus =
        submissionStatusFilter === "All" || sub.status === submissionStatusFilter;
      return matchesBatch && matchesTitle && matchesStatus;
    });
  }, [submittedList, submissionBatchFilter, submissionTitleSearch, submissionStatusFilter]);

  const totalAssignmentsPages = Math.max(1, Math.ceil(filteredAssignments.length / PAGE_SIZE));
  const paginatedAssignments = useMemo(() => {
    const start = (assignmentsPage - 1) * PAGE_SIZE;
    return filteredAssignments.slice(start, start + PAGE_SIZE);
  }, [filteredAssignments, assignmentsPage]);

  // const totalSubmissionsPages = Math.max(1, Math.ceil(filteredSubmissions.length / PAGE_SIZE));
  // const paginatedSubmissions = useMemo(() => {
  //   const start = (submissionsPage - 1) * PAGE_SIZE;
  //   return filteredSubmissions.slice(start, start + PAGE_SIZE);
  // }, [filteredSubmissions, submissionsPage]);
  // Dynamic filter for Teacher Detail view assignments table
  const teacherDetailAssignments = useMemo(() => {
    if (!assignmentDetails) return [];

    return [assignmentDetails];
  }, [assignmentDetails]);

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
    const isImage = file.type.startsWith("image/");

    setUploadedFileType(isVideo ? "video" : isImage ? "image" : "other");

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
              if (!u) reject(new Error("No URL returned"));
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

  const resetCreateForm = () => {
    setNewAssignmentTitle("");
    setNewAssignmentInstructions("");
    setNewAssignmentDeadlineDate("");
    setNewAssignmentDeadlineTime("");
    setSelectedTargetBatches([]);
    setNewAssignmentCategory("Video Submission");
    setUploadedFileUrl("");
    setUploadedFileName("");
    if (courses[0]) {
      setNewAssignmentCourseId(courses[0].id);
      setNewAssignmentCourseTitle(courses[0].title);
    }
  };

  const handlePublishAssignment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newAssignmentTitle.trim()) {
      alert("Please enter assignment title.");
      return;
    }

    setIsPublishing(true);
    try {
      const targetBatchesStr = selectedTargetBatches.length > 0 ? selectedTargetBatches.join(", ") : "All Batches";
      const matchedBatch = batches.find((b) => selectedTargetBatches.includes(b.name));

      let dueDateIso: string;
      if (newAssignmentDeadlineDate) {
        const datePart = newAssignmentDeadlineDate;
        const timePart = newAssignmentDeadlineTime || "23:59";
        const parsed = new Date(`${datePart}T${timePart}`);
        dueDateIso = Number.isNaN(parsed.getTime())
          ? new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
          : parsed.toISOString();
      } else {
        dueDateIso = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
      }

      await apiRequest("/admin/assignments", {
        method: "POST",
        body: JSON.stringify({
          title: newAssignmentTitle.trim(),
          typeTag: newAssignmentCategory,
          targetBatch: targetBatchesStr,
          batchId: matchedBatch?.id,
          description: newAssignmentInstructions || "Complete the assignment as instructed.",
          dueDate: dueDateIso,
          totalPoints: 100,
          courseId: newAssignmentCourseId || undefined,
          courseTitle: newAssignmentCourseTitle || undefined,
          referenceFileUrl: uploadedFileUrl || undefined,
          referenceFileName: uploadedFileName || undefined,
        }),
      });

      await openThemeSuccess(
        `Assignment "${newAssignmentTitle}" published successfully!`,
        "Assignment Published"
      );

      setIsCreatingAssignment(false);
      resetCreateForm();
      await fetchAssignmentsData();
    } catch (err: any) {
      alert(err?.message || "Failed to publish assignment.");
    } finally {
      setIsPublishing(false);
    }
  };

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
      fetchAssignmentsData();
    } catch (err: any) {
      alert(err?.message || "Failed to submit grade.");
    }
  };

  const openAssignmentSubmission = async (assignmentId: string) => {
    try {
      const res = await apiRequest(
        `/admin/assignments/${assignmentId}/submissions`
      );

      const submission = res.data?.submissions?.[0];

      if (!submission) {
        alert("No submissions found.");
        return;
      }

      openReviewFromSubmission(submission);
    } catch (err) {
      console.error(err);
    }
  };

  const openReviewFromSubmission = (row: SubmittedAssignmentRecord) => {
    setSelectedVideoReview({
      id: row.id,
      studentName: row.studentName,
      studentAvatar: row.studentAvatar || "/Ananya.png",
      submittedTime: row.submittedDate,
      thumbnail: "/kathak_course_dancer_1785146082697.jpg",
      duration: "--:--",
      status: row.grade ? "Reviewed" : "Pending Review",
      score: row.grade || undefined,
      codePill: row.studentId || "#SUB",
      message: row.notes || row.feedback || "Student submission ready for evaluation.",
      fileUrl: row.fileUrl,
    });

    const gradeScore = row.grade || "0";
    setReviewRhythmScore(gradeScore);

    let commentStr = row.feedback || "";
    let loadedParts: { id: string; name: string; score: number }[] = [];
    let loadedPointers: string[] = [];

    if (row.feedback && row.feedback.startsWith("{")) {
      try {
        const obj = JSON.parse(row.feedback);
        commentStr = obj.comment || "";
        if (Array.isArray(obj.criteriaParts)) {
          loadedParts = obj.criteriaParts.map((cp: any, idx: number) => ({
            id: `cp-${idx}`,
            name: cp.name || `Part ${idx + 1}`,
            score: typeof cp.score === "number" ? cp.score : parseInt(cp.score || "0", 10) || 0,
          }));
        }
        if (Array.isArray(obj.pointers)) {
          loadedPointers = obj.pointers;
        }
      } catch {
        // fallback
      }
    } else if (row.feedback && !row.feedback.startsWith("{")) {
      commentStr = row.feedback;
    }

    setCriteriaParts(loadedParts);
    if (loadedParts.length > 0) {
      recalculateOverallGrade(loadedParts);
    }
    setReviewPointers(loadedPointers);
    setReviewFeedbackText(commentStr);
  };

  // Helper for Avatar rendering
  const renderAvatar = (name: string, avatarUrl?: string, bgHex: string = "bg-[#00B4D8]") => {
    if (avatarUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name}
          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100"
        />
      );
    }
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return (
      <div
        className={`w-10 h-10 rounded-full ${bgHex} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
      >
        {initials || "ST"}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen text-slate-800 font-sans pb-16">
      {/* ================= 1. MAIN ASSIGNMENT MANAGEMENT LIST ================= */}
      {!isViewingSubmittedAssignments &&
        !isCreatingAssignment &&
        !selectedTeacherDetail &&
        !selectedVideoReview && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Title & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Assignment Management
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsViewingSubmittedAssignments(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#8C2329] hover:bg-[#721c21] text-white font-semibold text-xs shadow-xs cursor-pointer transition-all"
                >
                  Submitted Assignment
                </button>
                <button
                  onClick={() => setIsCreatingAssignment(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#8C2329] hover:bg-[#721c21] text-white font-semibold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Assignment</span>
                </button>
              </div>
            </div>

            {/* Top 4 Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: TOTAL ACTIVE */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-xs flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-100/70 text-[#8C2329] flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    TOTAL ACTIVE
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {metrics.totalActive}
                  </h3>
                </div>
              </div>

              {/* Card 2: PENDING REVIEWS */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-xs flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-100/70 text-sky-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    PENDING REVIEWS
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {metrics.pendingReviews}
                  </h3>
                </div>
              </div>

              {/* Card 3: SUBMISSIONS THIS WEEK */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-xs flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    SUBMISSIONS THIS WEEK
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {metrics.submissionsThisWeek}
                  </h3>
                </div>
              </div>

              {/* Card 4: AVG COMPLETION RATE */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-xs flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    AVG COMPLETION RATE
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {metrics.avgCompletionRate}
                  </h3>
                </div>
              </div>
            </div>

            {/* Filter Section Container */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
              {/* Row 1 Filters: Search, Batch, Course */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto flex-1">
                  {/* Search Input */}
                  <div className="relative min-w-[260px] max-w-sm flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by assignment name..."
                      value={assignmentSearchTerm}
                      onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#8C2329] transition-all"
                    />
                  </div>

                  {/* Batch Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Batch:</span>
                    <div className="relative">
                      <select
                        value={assignmentBatchFilter}
                        onChange={(e) => setAssignmentBatchFilter(e.target.value)}
                        className="h-10 pl-3 pr-8 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-[#8C2329] cursor-pointer shadow-2xs"
                      >
                        <option value="All Batches">All Batches</option>
                        {batches.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Course Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Course:</span>
                    <div className="relative">
                      <select
                        value={assignmentCourseFilter}
                        onChange={(e) => setAssignmentCourseFilter(e.target.value)}
                        className="h-10 pl-3 pr-8 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-[#8C2329] cursor-pointer shadow-2xs"
                      >
                        <option value="All Courses">All Courses</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 Filters: Status tabs & Date Range */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Status:</span>
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                    <button
                      onClick={() => setAssignmentStatusTab("Active")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${assignmentStatusTab === "Active"
                          ? "bg-white text-[#8C2329] shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setAssignmentStatusTab("Draft")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${assignmentStatusTab === "Draft"
                          ? "bg-white text-[#8C2329] shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                      Draft
                    </button>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs transition-all">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>Date Range</span>
                </button>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto rounded-xl border border-slate-100 mt-4">
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead>
                    <tr className="bg-[#EEF2FF] text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200/70">
                      <th className="py-3.5 px-5">TEACHER</th>
                      <th className="py-3.5 px-5">ASSIGNMENT TITLE</th>
                      <th className="py-3.5 px-5">TARGET BATCH</th>
                      <th className="py-3.5 px-5">DUE DATE</th>
                      <th className="py-3.5 px-5">TOTAL STUDENTS</th>
                      <th className="py-3.5 px-5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                          Loading assignments...
                        </td>
                      </tr>
                    ) : filteredAssignments.length > 0 ? (
                      paginatedAssignments.map((asg) => (
                        <tr key={asg.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* TEACHER */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              {renderAvatar(
                                asg.teacherName || "Admin User",
                                asg.teacherAvatar,
                                "bg-[#8C2329]"
                              )}
                              <div>
                                <span className="block font-bold text-slate-900 text-sm">
                                  {asg.teacherName || "Admin User"}
                                </span>
                                <span className="block text-xs text-slate-400 font-normal">
                                  {asg.teacherDept || "Faculty Lead"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* ASSIGNMENT TITLE */}
                          <td className="py-4 px-5">
                            <span className="block font-bold text-slate-900 text-sm">
                              {asg.title}
                            </span>
                            <span className="block text-xs font-semibold text-sky-500 mt-0.5">
                              {asg.typeTag}
                            </span>
                          </td>

                          {/* TARGET BATCH */}
                          <td className="py-4 px-5">
                            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold inline-block border border-blue-100/60">
                              {asg.targetBatch}
                            </span>
                          </td>

                          {/* DUE DATE */}
                          <td className="py-4 px-5 font-bold text-slate-800">
                            {asg.dueDate}
                          </td>

                          {/* TOTAL STUDENTS */}
                          <td className="py-4 px-5 font-bold text-slate-800">
                            {asg.totalStudents}
                          </td>

                          {/* ACTIONS */}
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => fetchAssignmentDetails(asg.id)}
                              className="px-4 py-1.5 rounded-lg border border-indigo-200/80 bg-white hover:bg-indigo-50 text-indigo-600 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                          No assignments found. Click &quot;Create New Assignment&quot; to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs">
                <span className="text-slate-500 font-medium">
                  Showing {filteredAssignments.length > 0 ? (assignmentsPage - 1) * PAGE_SIZE + 1 : 0}-
                  {Math.min(assignmentsPage * PAGE_SIZE, filteredAssignments.length)} of {filteredAssignments.length} results
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAssignmentsPage((p) => Math.max(1, p - 1))}
                    disabled={assignmentsPage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-[#8C2329] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {assignmentsPage}
                  </button>
                  <span className="text-slate-400 text-xs px-1">of {totalAssignmentsPages}</span>
                  <button
                    onClick={() => setAssignmentsPage((p) => Math.min(totalAssignmentsPages, p + 1))}
                    disabled={assignmentsPage === totalAssignmentsPages}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ================= 2. STUDENT ASSIGNMENT STATUS SCREEN (SUBMISSIONS VIEW) ================= */}
      {isViewingSubmittedAssignments && !isCreatingAssignment && !selectedVideoReview && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header with Back Arrow & Export Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => setIsViewingSubmittedAssignments(false)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs mt-1 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Student Assignment Status
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Real-time overview of current student submissions and review pipeline.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-2xs transition-all">
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: TOTAL ASSIGNMENTS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TOTAL ASSIGNMENTS
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{submittedList.length}</h3>
              </div>
            </div>

            {/* Card 2: SUBMITTED */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SUBMITTED
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  {submittedList.filter((s) => s.status === "Submitted").length}
                </h3>
              </div>
            </div>

            {/* Card 3: PENDING */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  PENDING
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  {submittedList.filter((s) => s.status !== "Submitted").length}
                </h3>
              </div>
            </div>
          </div>

          {/* Filter Bar Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* All Batches Dropdown */}
              <div className="relative">
                <select
                  value={submissionBatchFilter}
                  onChange={(e) => setSubmissionBatchFilter(e.target.value)}
                  className="h-10 pl-4 pr-9 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-[#8C2329] cursor-pointer shadow-2xs"
                >
                  <option value="All Batches">All Batches</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Assignment Title Input */}
              <input
                type="text"
                placeholder="Assignment Title"
                value={submissionTitleSearch}
                onChange={(e) => setSubmissionTitleSearch(e.target.value)}
                className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#8C2329] shadow-2xs"
              />

              {/* Status Dropdown */}
              <div className="relative">
                <select
                  value={submissionStatusFilter}
                  onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                  className="h-10 pl-4 pr-9 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-[#8C2329] cursor-pointer shadow-2xs"
                >
                  <option value="All">Status: All</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Pending">Pending</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredSubmissions.length > 0 ? 1 : 0}-{filteredSubmissions.length} of {submittedList.length} students
            </span>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200/70">
                    <th className="py-3.5 px-5">STUDENT</th>
                    <th className="py-3.5 px-5">ASSIGNMENT</th>
                    <th className="py-3.5 px-5">BATCH</th>
                    <th className="py-3.5 px-5">SUBMITTED DATE</th>
                    <th className="py-3.5 px-5">STATUS BADGE</th>
                    <th className="py-3.5 px-5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* STUDENT */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            {renderAvatar(row.studentName, row.studentAvatar, "bg-[#00B4D8]")}
                            <div>
                              <span className="block font-bold text-slate-900 text-sm">
                                {row.studentName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-normal">
                                {row.studentId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* ASSIGNMENT */}
                        <td className="py-4 px-5 font-semibold text-slate-800">
                          {row.assignmentTitle}
                        </td>

                        {/* BATCH */}
                        <td className="py-4 px-5">
                          <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-100/70 text-xs font-bold inline-block">
                            {row.batch}
                          </span>
                        </td>

                        {/* SUBMITTED DATE */}
                        <td className="py-4 px-5 text-slate-700 font-medium">
                          {row.submittedDate}
                        </td>

                        {/* STATUS BADGE */}
                        <td className="py-4 px-5">
                          {row.status === "Submitted" && (
                            <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Submitted
                            </span>
                          )}
                          {row.status === "Overdue" && (
                            <span className="px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                              Overdue
                            </span>
                          )}
                          {row.status === "Pending" && (
                            <span className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-bold inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              Pending
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => openReviewFromSubmission(row)}
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer inline-flex items-center justify-center transition-colors"
                            title="View / Review"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                        No submissions found in backend database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. EVALUATION / VIDEO REVIEW SCREEN ================= */}
      {selectedVideoReview && (
        <div className="space-y-6 max-w-[1300px] mx-auto animate-in fade-in">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedVideoReview(null)}
              className="p-2 rounded-xl bg-white border border-slate-200 cursor-pointer shadow-2xs text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedVideoReview.studentAvatar}
              alt=""
              className="w-11 h-11 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h2 className="font-bold text-xl text-slate-900">{selectedVideoReview.studentName}</h2>
              <p className="text-xs text-slate-400">{selectedVideoReview.submittedTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
                <h4 className="text-[10.5px] font-extrabold uppercase text-slate-400 tracking-wider">
                  STUDENT MESSAGE
                </h4>
                <p className="text-sm italic text-slate-700 mt-2">
                  &ldquo;{selectedVideoReview.message}&rdquo;
                </p>
              </div>

              {/* ENHANCED DYNAMIC VIDEO PLAYER WITH IFRAME & DIRECT VIDEO SUPPORT */}
              <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video flex items-center justify-center shadow-lg relative min-h-[320px]">
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
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallbackApplied) {
                          target.dataset.fallbackApplied = "true";
                          target.src = "https://vjs.zencdn.net/v/oceans.mp4";
                          target.load();
                        }
                      }}
                    >
                      <source src={url} type="video/mp4" />
                      <source src={url} type="video/webm" />
                      <source src={url} type="video/ogg" />
                      Your browser does not support video playback.
                    </video>
                  );
                })()}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xl text-slate-900">Evaluation</h3>
                {(() => {
                  const score = parseInt(reviewRhythmScore, 10) || 0;
                  if (score >= 85) return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Distinction</span>;
                  if (score >= 65) return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">Merit</span>;
                  if (score >= 40) return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Pass</span>;
                  return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">Review Needed</span>;
                })()}
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-5">
                {/* 1. OVERALL GRADE SCORE */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-800">Overall Grade Score (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={reviewRhythmScore}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setReviewRhythmScore("0");
                          return;
                        }
                        const num = parseInt(val, 10);
                        if (isNaN(num)) setReviewRhythmScore("0");
                        else if (num < 0) setReviewRhythmScore("0");
                        else if (num > 100) setReviewRhythmScore("100");
                        else setReviewRhythmScore(num.toString());
                      }}
                      className="w-20 h-10 rounded-xl bg-white border border-slate-200 text-center font-extrabold text-sm text-slate-900 focus:border-[#8C2329] focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* 2. EVALUATION PARTS (DYNAMIC CRITERIA NAME & SCORE EDITING) */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                      EVALUATION CRITERIA PARTS
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Auto-Calculates Grade</span>
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
                    {criteriaParts.map((part, index) => (
                      <div key={part.id || index} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          {/* Editable Part Name */}
                          <input
                            type="text"
                            value={part.name}
                            onChange={(e) => {
                              const updated = [...criteriaParts];
                              updated[index].name = e.target.value;
                              setCriteriaParts(updated);
                            }}
                            className="flex-1 h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:border-[#8C2329] focus:outline-none"
                          />

                          {/* Editable Part Score */}
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={part.score}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              const num = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                              const updated = [...criteriaParts];
                              updated[index].score = num;
                              setCriteriaParts(updated);
                              recalculateOverallGrade(updated);
                            }}
                            className="w-16 h-8 rounded-lg bg-white border border-slate-200 text-center font-extrabold text-xs text-[#8C2329] focus:outline-none shadow-2xs"
                          />

                          {/* Remove Part Button */}
                          {criteriaParts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = criteriaParts.filter((_, i) => i !== index);
                                setCriteriaParts(updated);
                                recalculateOverallGrade(updated);
                              }}
                              className="text-slate-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
                              title="Remove Criterion"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#8C2329] h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, part.score))}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add New Criterion Input */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                      <input
                        type="text"
                        placeholder="Add criterion name (e.g. Abhinaya)..."
                        value={newCriteriaName}
                        onChange={(e) => setNewCriteriaName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newCriteriaName.trim()) {
                              const updated = [
                                ...criteriaParts,
                                { id: `part-${Date.now()}`, name: newCriteriaName.trim(), score: 50 },
                              ];
                              setCriteriaParts(updated);
                              recalculateOverallGrade(updated);
                              setNewCriteriaName("");
                            }
                          }
                        }}
                        className="flex-1 h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium placeholder-slate-400 focus:border-[#8C2329] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCriteriaName.trim()) {
                            const updated = [
                              ...criteriaParts,
                              { id: `part-${Date.now()}`, name: newCriteriaName.trim(), score: 50 },
                            ];
                            setCriteriaParts(updated);
                            recalculateOverallGrade(updated);
                            setNewCriteriaName("");
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-2xs cursor-pointer shrink-0"
                      >
                        + Add Part
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. KEY EVALUATION POINTERS (DYNAMIC ADD/REMOVE BY ADMIN) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                      KEY EVALUATION POINTERS
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{reviewPointers.length} Added</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {reviewPointers.map((pointerText, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-rose-100 text-[#8C2329] font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          0{index + 1}
                        </span>
                        <input
                          type="text"
                          value={pointerText}
                          onChange={(e) => {
                            const updated = [...reviewPointers];
                            updated[index] = e.target.value;
                            setReviewPointers(updated);
                          }}
                          className="flex-1 h-8 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:border-[#8C2329] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setReviewPointers(reviewPointers.filter((_, i) => i !== index));
                          }}
                          className="text-slate-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
                          title="Remove Pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Add New Pointer Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add custom evaluation pointer..."
                        value={newPointerInput}
                        onChange={(e) => setNewPointerInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newPointerInput.trim()) {
                              setReviewPointers([...reviewPointers, newPointerInput.trim()]);
                              setNewPointerInput("");
                            }
                          }
                        }}
                        className="flex-1 h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-medium placeholder-slate-400 focus:border-[#8C2329] focus:outline-none shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newPointerInput.trim()) {
                            setReviewPointers([...reviewPointers, newPointerInput.trim()]);
                            setNewPointerInput("");
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-2xs cursor-pointer shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. FEEDBACK COMMENTS */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-extrabold text-slate-700">Feedback Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive feedback for the student..."
                    value={reviewFeedbackText}
                    onChange={(e) => setReviewFeedbackText(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#8C2329] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#8C2329] hover:bg-[#721c21] text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                >
                  Submit Grade
                </button>
              </form>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Lock className="w-3.5 h-3.5" /> Grades private until published
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. CREATE ASSIGNMENT SCREEN ================= */}
      {isCreatingAssignment && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => {
                  setIsCreatingAssignment(false);
                  resetCreateForm();
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#8C2329] cursor-pointer mb-1"
              >
                <ArrowLeft className="w-4 h-4" /> Assignments &gt; Create New
              </button>
              <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Create New Assignment
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingAssignment(false);
                  resetCreateForm();
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPublishing}
                onClick={() => handlePublishAssignment()}
                className="px-6 py-2.5 rounded-xl bg-[#8C2329] hover:bg-[#721c21] text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-60 transition-all"
              >
                {isPublishing ? "Publishing..." : "Publish Assignment"}
              </button>
            </div>
          </div>

          <form onSubmit={handlePublishAssignment} className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1 w-full space-y-6">
              {/* Basics */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6 shadow-2xs">
                <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                  <Info className="w-4.5 h-4.5 text-[#8C2329]" /> Assignment Basics
                </h3>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Assignment Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Mudras & Expressions Vol. 1"
                      value={newAssignmentTitle}
                      onChange={(e) => setNewAssignmentTitle(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#8C2329] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Category</label>
                      <div className="relative">
                        <select
                          value={newAssignmentCategory}
                          onChange={(e) => setNewAssignmentCategory(e.target.value)}
                          className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold appearance-none cursor-pointer focus:border-[#8C2329] focus:outline-none"
                        >
                          <option>Practical Assessment</option>
                          <option>Video Submission</option>
                          <option>Audio Recording</option>
                          <option>Research Paper</option>
                          <option>Mid-term Quiz</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Course</label>
                      <div className="relative">
                        <select
                          value={newAssignmentCourseId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setNewAssignmentCourseId(id);
                            const found = courses.find((c) => c.id === id);
                            const title = found?.title || "";
                            setNewAssignmentCourseTitle(title);

                            const matching = batches.filter((b) => {
                              if (b.courseId && id && b.courseId === id) return true;
                              if (b.courseName && title) {
                                const bCourse = b.courseName.toLowerCase().trim();
                                const selCourse = title.toLowerCase().trim();
                                return bCourse.includes(selCourse) || selCourse.includes(bCourse);
                              }
                              return false;
                            });
                            if (matching.length > 0) {
                              setSelectedTargetBatches([matching[0].name]);
                            } else {
                              setSelectedTargetBatches([]);
                            }
                          }}
                          className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold appearance-none cursor-pointer focus:border-[#8C2329] focus:outline-none"
                        >
                          {courses.length === 0 ? (
                            <option value="">No courses found</option>
                          ) : (
                            courses.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.title}
                              </option>
                            ))
                          )}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions + File/Video upload */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6 shadow-2xs">
                <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                  <FileText className="w-4.5 h-4.5 text-[#8C2329]" /> Instructions &amp; Resources
                </h3>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Assignment Instructions
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Provide detailed steps for the students..."
                      value={newAssignmentInstructions}
                      onChange={(e) => setNewAssignmentInstructions(e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#8C2329] focus:outline-none"
                    />
                  </div>

                  {/* Reference Materials */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Reference Materials (PDF / Video / Audio)
                    </label>

                    <div
                      onClick={() => {
                        if (!uploadingFile) {
                          document.getElementById("assignment-file-input")?.click();
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        if (uploadingFile) return;
                        const f = e.dataTransfer.files?.[0];
                        if (f) await handleAssignmentFileUpload(f);
                      }}
                      className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-[#8C2329] transition-colors cursor-pointer min-h-[160px]"
                    >
                      {uploadingFile && (
                        <div className="w-full max-w-xs space-y-2">
                          <p className="text-xs font-bold text-slate-700">Uploading… {uploadProgress}%</p>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-[#8C2329] transition-all duration-200"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {!uploadingFile && uploadedFileUrl && (
                        <div className="w-full space-y-3">
                          {uploadedFileType === "image" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={uploadedFileUrl}
                              alt="Preview"
                              className="max-h-40 mx-auto rounded-xl object-contain border border-slate-200"
                            />
                          )}

                          {uploadedFileType === "video" && (
                            <video
                              src={uploadedFileUrl}
                              controls
                              className="max-h-48 w-full mx-auto rounded-xl bg-black"
                            />
                          )}

                          {uploadedFileType === "other" && (
                            <div className="text-xs font-semibold text-slate-600 break-all px-2">
                              📎 {uploadedFileName || "File uploaded"}
                            </div>
                          )}

                          <p className="text-[11px] text-emerald-600 font-semibold">
                            ✓ {uploadedFileName}
                          </p>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFileUrl("");
                              setUploadedFileName("");
                              setUploadProgress(0);
                              setUploadedFileType("other");
                            }}
                            className="text-[11px] font-bold text-[#8C2329] hover:underline"
                          >
                            Remove &amp; upload another
                          </button>
                        </div>
                      )}

                      {!uploadingFile && !uploadedFileUrl && (
                        <>
                          <div className="w-12 h-12 rounded-full bg-rose-50 text-[#8C2329] flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            Click or drag files to upload
                          </span>
                          <span className="text-[10.5px] text-slate-400 font-medium">
                            PDF, Video (mp4/mov/webm), Audio — Max 50MB
                          </span>
                        </>
                      )}
                    </div>

                    <input
                      id="assignment-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx,image/*,video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) await handleAssignmentFileUpload(f);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-5 shadow-2xs">
                <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                  <Calendar className="w-4.5 h-4.5 text-[#8C2329]" /> Submission Schedule
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Deadline Date</label>
                    <input
                      type="date"
                      value={newAssignmentDeadlineDate}
                      onChange={(e) => setNewAssignmentDeadlineDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-[#8C2329] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Deadline Time</label>
                    <input
                      type="time"
                      value={newAssignmentDeadlineTime}
                      onChange={(e) => setNewAssignmentDeadlineTime(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-[#8C2329] focus:outline-none"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="allowLate"
                      checked={allowLateSubmissions}
                      onChange={(e) => setAllowLateSubmissions(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded cursor-pointer text-[#8C2329]"
                    />
                    <label htmlFor="allowLate" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Allow late submissions
                    </label>
                  </div>
                </div>
              </div>

              {/* Target Batches */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4 shadow-2xs">
                <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
                  <CheckSquare className="w-4.5 h-4.5 text-[#8C2329]" /> Target Batches
                </h3>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {availableBatchesForSelectedCourse.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium">No batches available for this course.</p>
                  ) : (
                    availableBatchesForSelectedCourse.map((batch) => {
                      const isChecked = selectedTargetBatches.includes(batch.name);
                      return (
                        <div
                          key={batch.id}
                          onClick={() => toggleBatchSelection(batch.name)}
                          className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer border transition-all ${isChecked
                              ? "bg-rose-50/50 border-[#8C2329]/40"
                              : "border-slate-100"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => { }}
                            className="w-4 h-4 rounded cursor-pointer text-[#8C2329]"
                          />
                          <div>
                            <span className="text-xs font-semibold text-slate-800 block">{batch.name}</span>
                            {batch.courseName && (
                              <span className="text-[10px] text-slate-400 font-medium block">
                                {batch.courseName}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#701623] to-[#8C2329] rounded-3xl p-6 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <HelpCircle className="w-5 h-5 text-rose-200" /> Need Help?
                </div>
                <p className="text-xs text-rose-100 leading-relaxed">
                  Courses and batches load from your database. Select at least one batch so students can see this assignment.
                </p>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ================= 5. TEACHER DETAILS VIEW ================= */}
      {selectedTeacherDetail && !selectedVideoReview && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <button
              onClick={() => {
                setSelectedTeacherDetail(null);
                setAssignmentDetails(null);
                setDetailSearchTerm("");
                // setDetailBatchFilter("All Batches");
                setDetailStatusFilter("All Status");
              }}
              className="inline-flex items-center gap-2 hover:text-[#8C2329] cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>Assignment Management</span>
            </button>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-900">Teacher Details</span>
          </div>

          {/* Teacher Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
            <div className="relative shrink-0">
              {renderAvatar(
                selectedTeacherDetail.teacherName || "Admin User",
                selectedTeacherDetail.teacherAvatar,
                "bg-[#8C2329]"
              )}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div className="space-y-2 text-center md:text-left flex-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedTeacherDetail.teacherName || "Admin User"}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  {selectedTeacherDetail.teacherDept || "Classical Dance Dept."}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  Senior Faculty
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-indigo-600">
                  <ClipboardList className="w-4 h-4 text-indigo-600" />
                  {assignmentsList.length > 0 ? assignmentsList.length : 1} Total Assignments
                </span>
              </div>
            </div>
          </div>

          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: ACTIVE ASSIGNMENTS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ACTIVE ASSIGNMENTS
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  {assignmentDetails ? 1 : 0}
                </h3>
              </div>
            </div>

            {/* Card 2: PENDING REVIEWS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  PENDING REVIEWS
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  {metrics.pendingReviews}
                </h3>
              </div>
            </div>

            {/* Card 3: COMPLETION ASSIGNMENT */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  COMPLETION ASSIGNMENT
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  {submittedList.filter((s) => s.status === "Submitted").length}
                </h3>
              </div>
            </div>
          </div>

          {/* Filter Bar Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
              {/* Search Assignments */}
              <div className="relative min-w-[220px] max-w-xs flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={detailSearchTerm}
                  onChange={(e) => setDetailSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-slate-200 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#8C2329] shadow-2xs"
                />
              </div>

              {/* All Batches Dropdown */}
              {/* Target Batch */}
              <div className="h-10 px-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center">
                <span className="text-xs font-bold text-blue-700">
                  {assignmentDetails?.targetBatch || "No Batch Assigned"}
                </span>
              </div>

              {/* All Status Dropdown */}
              <div className="relative">
                <select
                  value={detailStatusFilter}
                  onChange={(e) => setDetailStatusFilter(e.target.value)}
                  className="h-10 pl-4 pr-9 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:border-[#8C2329] cursor-pointer shadow-2xs"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs transition-all">
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span>More Filters</span>
            </button>
          </div>

          {/* Teacher Assignments Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-[#EEF2FF] text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200/70">
                    <th className="py-3.5 px-5">ASSIGNMENT TITLE</th>
                    <th className="py-3.5 px-5">DATES</th>
                    <th className="py-3.5 px-5">TARGET BATCH</th>
                    <th className="py-3.5 px-5">SUBMISSIONS</th>
                    <th className="py-3.5 px-5">STATUS</th>
                    <th className="py-3.5 px-5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {teacherDetailAssignments.length > 0 ? (
                    teacherDetailAssignments.map((asg) => (
                      <tr key={asg.id}>

                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900">
                            {asg.title}
                          </span>

                          <span className="block text-sky-500 mt-1">
                            {asg.typeTag}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          {asg.dueDate}
                        </td>

                        <td className="py-4 px-5">
                          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                            {asg.targetBatch}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          {asg.totalStudents}
                        </td>

                        <td className="py-4 px-5">
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                            Active
                          </span>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => openAssignmentSubmission(asg.id)}
                            className="text-indigo-600 font-bold hover:underlinepx-4 px-6 py-1.5 rounded-lg border border-indigo-200/80 bg-white hover:bg-indigo-50 text-indigo-600 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-slate-400"
                      >
                        No assignment found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}