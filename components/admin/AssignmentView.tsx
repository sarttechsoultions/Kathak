"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
import {
  AssignmentItem,
  SubmittedAssignmentRecord,
  BatchOption,
  CourseOption,
  VideoSubmissionCard,
  CriteriaPart,
} from "./assignments/types";
import { MainAssignmentList } from "./assignments/MainAssignmentList";
import { TeacherDetailsView } from "./assignments/TeacherDetailsView";
import { AssignmentSubmissionsTable } from "./assignments/AssignmentSubmissionsTable";
import { SubmissionReviewModal } from "./assignments/SubmissionReviewModal";
import { CreateAssignmentModal } from "./assignments/CreateAssignmentModal";
import { SubmittedAssignmentsModal } from "./assignments/SubmittedAssignmentsModal";

function AssignmentViewContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  const [detailStatusFilter, setDetailStatusFilter] = useState("All Status");

  // View Mode State
  const [selectedTeacherDetail, setSelectedTeacherDetail] = useState<AssignmentItem | null>(null);
  const [assignmentDetails, setAssignmentDetails] = useState<any>(null);
  const [viewingAssignmentSubmissions, setViewingAssignmentSubmissions] = useState<any | null>(null);
  const [specificAssignmentSubmissions, setSpecificAssignmentSubmissions] = useState<SubmittedAssignmentRecord[]>([]);
  const [loadingSpecificSubmissions, setLoadingSpecificSubmissions] = useState(false);
  const [selectedVideoReview, setSelectedVideoReview] = useState<VideoSubmissionCard | null>(null);
  const [isViewingSubmittedAssignments, setIsViewingSubmittedAssignments] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  // Evaluation state
  const [reviewRhythmScore, setReviewRhythmScore] = useState("0");
  const [criteriaParts, setCriteriaParts] = useState<CriteriaPart[]>([]);
  const [newCriteriaName, setNewCriteriaName] = useState("");
  const [reviewPointers, setReviewPointers] = useState<string[]>([]);
  const [newPointerInput, setNewPointerInput] = useState("");
  const [reviewFeedbackText, setReviewFeedbackText] = useState("");

  const recalculateOverallGrade = (parts: CriteriaPart[]) => {
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
  const [selectedTargetBatches, setSelectedTargetBatches] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // File Upload State
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileType, setUploadedFileType] = useState<"image" | "video" | "other">("other");

  const toggleBatchSelection = (batchName: string) => {
    setSelectedTargetBatches((prev) =>
      prev.includes(batchName) ? prev.filter((b) => b !== batchName) : [...prev, batchName]
    );
  };

  // Sync URL Params Helper
  const setUrlParam = useCallback((viewName: string | null, extraParams: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    if (viewName) {
      params.set("view", viewName);
      Object.entries(extraParams).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.push(pathname);
    }
  }, [pathname, router]);

  // Data Fetching
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

  const fetchSpecificSubmissions = useCallback(async (assignmentId: string) => {
    try {
      setLoadingSpecificSubmissions(true);
      const res = await apiRequest(`/admin/assignments/${assignmentId}/submissions`);
      if (res?.data?.submissions) {
        setSpecificAssignmentSubmissions(res.data.submissions);
      } else {
        // Fallback filter from submittedList
        const matched = submittedList.filter((s) => s.assignmentId === assignmentId);
        setSpecificAssignmentSubmissions(matched);
      }
    } catch {
      const matched = submittedList.filter((s) => s.assignmentId === assignmentId);
      setSpecificAssignmentSubmissions(matched);
    } finally {
      setLoadingSpecificSubmissions(false);
    }
  }, [submittedList]);

  const fetchAssignmentDetails = useCallback(async (id: string, pushUrl = true) => {
    try {
      const currentAsg = assignmentsList.find((x) => x.id === id);
      const res = await apiRequest(`/admin/assignments/${id}`);

      const a = res?.data || currentAsg;
      if (!a) return;

      const formattedAssignment = {
        ...a,
        teacherName:
          a.teacherName ||
          currentAsg?.teacherName ||
          a.createdByName ||
          a.createdBy?.fullName ||
          a.teacher?.fullName ||
          "Teacher",
        teacherDept:
          a.teacherDept ||
          currentAsg?.teacherDept ||
          (a.createdBy?.role ? `${a.createdBy.role} Faculty` : "Classical Dance Dept."),
        teacherAvatar:
          a.teacherAvatar ||
          currentAsg?.teacherAvatar ||
          a.createdBy?.avatarUrl ||
          a.teacher?.avatarUrl ||
          "",
        teacherDesignation:
          a.teacherDesignation ||
          currentAsg?.teacherDesignation ||
          "Senior Faculty",
        targetBatch:
          a.targetBatch ||
          a.batchName ||
          a.batch?.name ||
          currentAsg?.targetBatch ||
          "No Batch Assigned",
        dueDate: a.dueDate || currentAsg?.dueDate || "-",
        totalStudents: a.totalStudents || currentAsg?.totalStudents || `${a.submissions?.length || 0} Submissions`,
      };

      setAssignmentDetails(formattedAssignment);
      setSelectedTeacherDetail(formattedAssignment);

      if (pushUrl) {
        setUrlParam("teacher-details", { id });
      }
    } catch (err) {
      console.error("Failed to fetch assignment details:", err);
      const currentAsg = assignmentsList.find((x) => x.id === id);
      if (currentAsg) {
        setAssignmentDetails(currentAsg);
        setSelectedTeacherDetail(currentAsg);
        if (pushUrl) {
          setUrlParam("teacher-details", { id });
        }
      }
    }
  }, [assignmentsList, setUrlParam]);

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

  // URL search params sync on mount or URL change
  useEffect(() => {
    const view = searchParams.get("view");
    const id = searchParams.get("id");
    const assignmentId = searchParams.get("assignmentId");

    if (view === "teacher-details" && id) {
      fetchAssignmentDetails(id, false);
      setViewingAssignmentSubmissions(null);
      setIsCreatingAssignment(false);
      setIsViewingSubmittedAssignments(false);
      setSelectedVideoReview(null);
    } else if (view === "assignment-submissions" && id) {
      fetchAssignmentDetails(id, false);
      fetchSpecificSubmissions(id);
      setViewingAssignmentSubmissions({ id });
      setIsCreatingAssignment(false);
      setIsViewingSubmittedAssignments(false);
      setSelectedVideoReview(null);
    } else if (view === "submission-review" && id) {
      setIsCreatingAssignment(false);
      setIsViewingSubmittedAssignments(false);
    } else if (view === "create") {
      setIsCreatingAssignment(true);
      setSelectedTeacherDetail(null);
      setViewingAssignmentSubmissions(null);
      setIsViewingSubmittedAssignments(false);
    } else if (view === "submissions") {
      setIsViewingSubmittedAssignments(true);
      setSelectedTeacherDetail(null);
      setViewingAssignmentSubmissions(null);
      setIsCreatingAssignment(false);
    } else if (!view) {
      setSelectedTeacherDetail(null);
      setViewingAssignmentSubmissions(null);
      setIsCreatingAssignment(false);
      setIsViewingSubmittedAssignments(false);
      setSelectedVideoReview(null);
    }
  }, [searchParams, fetchAssignmentDetails, fetchSpecificSubmissions]);

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

  const teacherDetailAssignments = useMemo(() => {
    if (!assignmentDetails) return [];
    return [assignmentDetails];
  }, [assignmentDetails]);

  const handleAssignmentFileUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      alert("File must be under 50MB");
      return;
    }

    try {
      setUploadingFile(true);
      setUploadProgress(10);
      setUploadedFileName(file.name);

      const mime = file.type;
      if (mime.startsWith("image/")) {
        setUploadedFileType("image");
      } else if (mime.startsWith("video/")) {
        setUploadedFileType("video");
      } else {
        setUploadedFileType("other");
      }

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 80 ? prev + 15 : prev));
      }, 200);

      const formData = new FormData();
      formData.append("file", file);

      const res = await apiRequest<{
        status: string;
        data?: { fileUrl?: string; url?: string };
        fileUrl?: string;
        url?: string;
      }>("/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const uploadedUrl =
        res.data?.fileUrl ||
        res.data?.url ||
        res.fileUrl ||
        res.url ||
        URL.createObjectURL(file);

      setUploadedFileUrl(uploadedUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload reference media.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handlePublishAssignment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!newAssignmentTitle.trim()) {
      alert("Please enter assignment title.");
      return;
    }

    if (selectedTargetBatches.length === 0) {
      alert("Please select at least one target batch.");
      return;
    }

    const fullDeadline = newAssignmentDeadlineDate
      ? new Date(
        `${newAssignmentDeadlineDate}T${newAssignmentDeadlineTime || "23:59:00"}`
      ).toISOString()
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const payload = {
      title: newAssignmentTitle.trim(),
      category: newAssignmentCategory,
      description: newAssignmentInstructions,
      dueDate: fullDeadline,
      allowLate: allowLateSubmissions,
      batches: selectedTargetBatches,
      fileUrl: uploadedFileUrl || null,
      courseId: newAssignmentCourseId || null,
    };

    try {
      setIsPublishing(true);
      const res = await apiRequest("/admin/assignments", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res?.status === "success" || res?.data) {
        openThemeSuccess("Assignment published successfully!", "Success");
        setIsCreatingAssignment(false);
        setUrlParam(null);
        resetCreateForm();
        await fetchAssignmentsData();
      }
    } catch (err) {
      console.error("Failed to publish assignment:", err);
      alert("Failed to publish assignment.");
    } finally {
      setIsPublishing(false);
    }
  };

  const resetCreateForm = () => {
    setNewAssignmentTitle("");
    setNewAssignmentInstructions("");
    setNewAssignmentDeadlineDate("");
    setNewAssignmentDeadlineTime("");
    setSelectedTargetBatches([]);
    setUploadedFileUrl("");
    setUploadedFileName("");
    setUploadProgress(0);
  };

  const openReviewFromSubmission = (sub: SubmittedAssignmentRecord) => {
    setSelectedVideoReview({
      id: sub.id,
      studentName: sub.studentName,
      studentAvatar: sub.studentAvatar || "/Ananya.png",
      submittedTime: sub.submittedDate,
      thumbnail: "/Ananya.png",
      duration: "03:45",
      status: sub.status === "Submitted" ? "Pending Review" : "Reviewed",
      score: sub.grade || undefined,
      codePill: sub.batch,
      message: sub.notes || "Completed assignment and practice video uploaded for faculty evaluation.",
      fileUrl: sub.fileUrl || "https://vjs.zencdn.net/v/oceans.mp4",
    });

    setReviewRhythmScore(sub.grade ? String(parseInt(sub.grade, 10) || 75) : "75");
    setCriteriaParts([
      { id: "part-1", name: "Footwork Precision (Tatkar)", score: 85 },
      { id: "part-2", name: "Hand Gestures (Hastaks & Mudras)", score: 75 },
      { id: "part-3", name: "Rhythmic Alignment (Layakari)", score: 80 },
    ]);
    setReviewPointers([
      "Clear footwork clarity in Teental drut laya",
      "Graceful angashuddhi during chakkars",
    ]);
    setReviewFeedbackText(sub.feedback || "");

    const currentId = assignmentDetails?.id || sub.assignmentId || "";
    setUrlParam("submission-review", { assignmentId: currentId, id: sub.id });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoReview) return;

    try {
      const overall = parseInt(reviewRhythmScore, 10) || 0;
      await apiRequest(`/admin/assignments/submissions/${selectedVideoReview.id}/grade`, {
        method: "POST",
        body: JSON.stringify({
          grade: `${overall}/100`,
          feedback: reviewFeedbackText,
          criteria: criteriaParts,
          pointers: reviewPointers,
        }),
      });

      openThemeSuccess("Evaluation submitted successfully!", "Graded");
      setSelectedVideoReview(null);
      if (assignmentDetails) {
        setUrlParam("assignment-submissions", { id: assignmentDetails.id });
      } else {
        setUrlParam(null);
      }
      await fetchAssignmentsData();
    } catch (err) {
      console.error("Evaluation submit error:", err);
      alert("Failed to submit review.");
    }
  };

  // 1. SUBMISSION / VIDEO REVIEW VIEW
  if (selectedVideoReview) {
    return (
      <SubmissionReviewModal
        selectedVideoReview={selectedVideoReview}
        reviewRhythmScore={reviewRhythmScore}
        setReviewRhythmScore={setReviewRhythmScore}
        criteriaParts={criteriaParts}
        setCriteriaParts={setCriteriaParts}
        newCriteriaName={newCriteriaName}
        setNewCriteriaName={setNewCriteriaName}
        reviewPointers={reviewPointers}
        setReviewPointers={setReviewPointers}
        newPointerInput={newPointerInput}
        setNewPointerInput={setNewPointerInput}
        reviewFeedbackText={reviewFeedbackText}
        setReviewFeedbackText={setReviewFeedbackText}
        recalculateOverallGrade={recalculateOverallGrade}
        handleReviewSubmit={handleReviewSubmit}
        onBack={() => {
          setSelectedVideoReview(null);
          if (assignmentDetails) {
            setUrlParam("assignment-submissions", { id: assignmentDetails.id });
          } else {
            setUrlParam(null);
          }
        }}
      />
    );
  }

  // 2. ASSIGNMENT-SPECIFIC SUBMISSIONS TABLE VIEW (Triggered from "View" button in Teacher Details)
  if (viewingAssignmentSubmissions && assignmentDetails) {
    return (
      <AssignmentSubmissionsTable
        assignment={assignmentDetails}
        submissions={
          specificAssignmentSubmissions.length > 0
            ? specificAssignmentSubmissions
            : assignmentDetails?.submissions?.map((s: any) => ({
                id: s.id,
                assignmentId: s.assignmentId || assignmentDetails.id,
                studentName: s.studentName || s.student?.fullName || "Student",
                studentId: `#STU-${(s.studentId || s.student?.id || "0000").substring(0, 4).toUpperCase()}`,
                studentAvatar: s.student?.avatarUrl || "/Ananya.png",
                assignmentTitle: assignmentDetails.title || "Kathak Practice",
                batch: assignmentDetails.targetBatch || assignmentDetails.batchName || "Kathak Beginner",
                submittedDate: s.submittedAt
                  ? new Date(s.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "Aug 10, 2026",
                status: s.status === "GRADED" ? "Submitted" : s.status || "Submitted",
                grade: s.grade,
                feedback: s.feedback,
                notes: s.notes,
                fileUrl: s.fileUrl,
              })) || []
        }
        loading={loadingSpecificSubmissions}
        onBackToTeacher={() => {
          setViewingAssignmentSubmissions(null);
          setUrlParam("teacher-details", { id: assignmentDetails.id });
        }}
        onBackToMain={() => {
          setViewingAssignmentSubmissions(null);
          setSelectedTeacherDetail(null);
          setAssignmentDetails(null);
          setUrlParam(null);
        }}
        onViewStudentSubmission={(sub) => {
          openReviewFromSubmission(sub);
        }}
      />
    );
  }

  // 3. CREATE ASSIGNMENT VIEW
  if (isCreatingAssignment) {
    return (
      <CreateAssignmentModal
        newAssignmentTitle={newAssignmentTitle}
        setNewAssignmentTitle={setNewAssignmentTitle}
        newAssignmentCategory={newAssignmentCategory}
        setNewAssignmentCategory={setNewAssignmentCategory}
        newAssignmentCourseId={newAssignmentCourseId}
        setNewAssignmentCourseId={setNewAssignmentCourseId}
        newAssignmentCourseTitle={newAssignmentCourseTitle}
        setNewAssignmentCourseTitle={setNewAssignmentCourseTitle}
        newAssignmentInstructions={newAssignmentInstructions}
        setNewAssignmentInstructions={setNewAssignmentInstructions}
        newAssignmentDeadlineDate={newAssignmentDeadlineDate}
        setNewAssignmentDeadlineDate={setNewAssignmentDeadlineDate}
        newAssignmentDeadlineTime={newAssignmentDeadlineTime}
        setNewAssignmentDeadlineTime={setNewAssignmentDeadlineTime}
        allowLateSubmissions={allowLateSubmissions}
        setAllowLateSubmissions={setAllowLateSubmissions}
        selectedTargetBatches={selectedTargetBatches}
        toggleBatchSelection={toggleBatchSelection}
        setSelectedTargetBatches={setSelectedTargetBatches}
        courses={courses}
        batches={batches}
        availableBatchesForSelectedCourse={availableBatchesForSelectedCourse}
        isPublishing={isPublishing}
        handlePublishAssignment={handlePublishAssignment}
        resetCreateForm={resetCreateForm}
        onCancel={() => {
          setIsCreatingAssignment(false);
          setUrlParam(null);
        }}
        uploadedFileUrl={uploadedFileUrl}
        setUploadedFileUrl={setUploadedFileUrl}
        uploadedFileName={uploadedFileName}
        setUploadedFileName={setUploadedFileName}
        uploadingFile={uploadingFile}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        uploadedFileType={uploadedFileType}
        setUploadedFileType={setUploadedFileType}
        handleAssignmentFileUpload={handleAssignmentFileUpload}
      />
    );
  }

  // 4. GLOBAL SUBMITTED ASSIGNMENTS MODAL
  if (isViewingSubmittedAssignments) {
    return (
      <SubmittedAssignmentsModal
        submittedList={submittedList}
        filteredSubmissions={filteredSubmissions}
        submissionBatchFilter={submissionBatchFilter}
        setSubmissionBatchFilter={setSubmissionBatchFilter}
        submissionTitleSearch={submissionTitleSearch}
        setSubmissionTitleSearch={setSubmissionTitleSearch}
        submissionStatusFilter={submissionStatusFilter}
        setSubmissionStatusFilter={setSubmissionStatusFilter}
        batches={batches}
        onBack={() => {
          setIsViewingSubmittedAssignments(false);
          setUrlParam(null);
        }}
        openReviewFromSubmission={openReviewFromSubmission}
      />
    );
  }

  // 5. TEACHER DETAILS VIEW (Screenshot 1)
  if (selectedTeacherDetail) {
    return (
      <TeacherDetailsView
        selectedTeacherDetail={selectedTeacherDetail}
        assignmentDetails={assignmentDetails}
        teacherDetailAssignments={teacherDetailAssignments}
        metrics={metrics}
        assignmentsListLength={assignmentsList.length}
        detailSearchTerm={detailSearchTerm}
        setDetailSearchTerm={setDetailSearchTerm}
        detailStatusFilter={detailStatusFilter}
        setDetailStatusFilter={setDetailStatusFilter}
        onBack={() => {
          setSelectedTeacherDetail(null);
          setAssignmentDetails(null);
          setUrlParam(null);
        }}
        onViewSubmission={(detail) => {
          // Open the Dedicated Submissions Table for this assignment!
          setViewingAssignmentSubmissions(detail);
          fetchSpecificSubmissions(detail.id);
          setUrlParam("assignment-submissions", { id: detail.id });
        }}
      />
    );
  }

  // 6. MAIN ASSIGNMENT LIST VIEW (Screenshot 2)
  return (
    <MainAssignmentList
      assignmentsList={assignmentsList}
      filteredAssignments={filteredAssignments}
      paginatedAssignments={paginatedAssignments}
      metrics={metrics}
      loading={loading}
      assignmentSearchTerm={assignmentSearchTerm}
      setAssignmentSearchTerm={setAssignmentSearchTerm}
      assignmentBatchFilter={assignmentBatchFilter}
      setAssignmentBatchFilter={setAssignmentBatchFilter}
      assignmentCourseFilter={assignmentCourseFilter}
      setAssignmentCourseFilter={setAssignmentCourseFilter}
      assignmentStatusTab={assignmentStatusTab}
      setAssignmentStatusTab={setAssignmentStatusTab}
      batches={batches}
      courses={courses}
      assignmentsPage={assignmentsPage}
      setAssignmentsPage={setAssignmentsPage}
      totalAssignmentsPages={totalAssignmentsPages}
      PAGE_SIZE={PAGE_SIZE}
      onOpenCreateModal={() => {
        setIsCreatingAssignment(true);
        setUrlParam("create");
      }}
      onOpenSubmittedModal={() => {
        setIsViewingSubmittedAssignments(true);
        setUrlParam("submissions");
      }}
      onSelectAssignment={(asg) => fetchAssignmentDetails(asg.id, true)}
    />
  );
}

export default function AssignmentView() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading assignments...</div>}>
      <AssignmentViewContent />
    </Suspense>
  );
}