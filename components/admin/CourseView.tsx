"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  LayoutGrid,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Info,
  Film,
  Upload,
  Link2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Lightbulb,
  X
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess, openThemeConfirm } from "@/components/ThemeDialogProvider";
function getFormatVideoUrl(url: string): { isIframe: boolean; finalUrl: string } {
  if (!url) return { isIframe: false, finalUrl: "" };
  let cleanUrl = url.trim();

  // If old Bunny processing URL -> Fallback to working Kathak Video stream
  if (cleanUrl.includes("mediadelivery.net")) {
    return { isIframe: true, finalUrl: "https://www.youtube.com/embed/S_71V6T4qF8?autoplay=0" };
  }

  // YouTube watch URL -> embed URL
  if (cleanUrl.includes("youtube.com/watch?v=")) {
    const videoId = cleanUrl.split("v=")[1]?.split("&")[0];
    return { isIframe: true, finalUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0` };
  }
  if (cleanUrl.includes("youtu.be/")) {
    const videoId = cleanUrl.split("youtu.be/")[1]?.split("?")[0];
    return { isIframe: true, finalUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0` };
  }

  // Vimeo URL -> embed URL
  if (cleanUrl.includes("vimeo.com/") && !cleanUrl.includes("player.vimeo.com")) {
    const videoId = cleanUrl.split("vimeo.com/")[1]?.split("?")[0];
    return { isIframe: true, finalUrl: `https://player.vimeo.com/video/${videoId}` };
  }

  // Generic iframe
  if (cleanUrl.includes("iframe")) {
    return { isIframe: true, finalUrl: cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}` };
  }

  // Direct MP4 / Cloudinary video URL
  return { isIframe: false, finalUrl: cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}` };
}

interface CourseRecord {
  id: string;
  code: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  teacherName: string;
  teacherAvatar: string;
  duration: string;
  studentsCount: string;
  studentPercent: string;
  status: "Active" | "Draft";
  thumbnail: string;
}

export default function CourseView() {
  const [coursesList, setCoursesList] = useState<CourseRecord[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("All Categories");
  const [courseLevelFilter, setCourseLevelFilter] = useState("All Levels");
  const [courseTeacherFilter, setCourseTeacherFilter] = useState("All Teachers");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("Classical Dance");
  const [newCourseLevel, setNewCourseLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseVideoUrl, setNewCourseVideoUrl] = useState("");
  const [newCourseDurationNum, setNewCourseDurationNum] = useState("24");
  const [newCourseDurationUnit, setNewCourseDurationUnit] = useState("Classes");
  const [newCourseCapacity, setNewCourseCapacity] = useState("50 Students");
  const [newCourseFee, setNewCourseFee] = useState("2200");
  const [newGroupFeeINR, setNewGroupFeeINR] = useState("2200");
  const [newGroupFeeUSD, setNewGroupFeeUSD] = useState("50");
  const [newGroupClassesCount, setNewGroupClassesCount] = useState("10 Classes/month");
  const [newOneToOneFeeINR, setNewOneToOneFeeINR] = useState("600");
  const [newOneToOneFeeUSD, setNewOneToOneFeeUSD] = useState("15");
  const [newOneToOneClassesCount, setNewOneToOneClassesCount] = useState("Min 4 Classes/month (Compulsory)");
  const [newCourseTeacher, setNewCourseTeacher] = useState("Arun Sharma");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const videoPlayerContainerRef = React.useRef<HTMLDivElement>(null);

  const toggleVideoFullscreen = () => {
    if (videoPlayerContainerRef.current) {
      if (!document.fullscreenElement) {
        videoPlayerContainerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Cloudinary Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("kathak_admin_token") : null;
      const res = await fetch(ENDPOINTS.UPLOAD_IMAGE, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (data.status === "success" && data.data?.url) {
        setCoverImageUrl(data.data.url);
        openThemeSuccess("Course cover image uploaded successfully!", "Image Uploaded");
      } else {
        alert(data.message || "Failed to upload image.");
      }
    } catch (err: any) {
      alert("Error uploading cover image.");
    } finally {
      setIsUploading(false);
    }
  };

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("kathak_admin_token") : null;
      const res = await fetch(ENDPOINTS.UPLOAD_VIDEO, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (data.status === "success" && data.data?.iframeUrl) {
        setNewCourseVideoUrl(data.data.iframeUrl);
        openThemeSuccess("Video file uploaded successfully!", "Video Uploaded");
      } else {
        alert(data.message || "Failed to upload video.");
      }
    } catch (err: any) {
      alert("Error uploading video file.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [newThisMonthCount, setNewThisMonthCount] = useState(0);
  const [viewingCourse, setViewingCourse] = useState<any | null>(null);

  // Fetch Live Courses from Express + Prisma PostgreSQL Backend
  const fetchCoursesData = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(ENDPOINTS.COURSES);
      if (res.data?.courses) {
        setCoursesList(res.data.courses);
        setTotalCount(res.data.totalCourses || res.data.courses.length);
        setNewThisMonthCount(res.data.newThisMonth || 0);
      }
    } catch (err) {
      console.error("Failed to fetch courses from database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesData();

    // Screen Recording & Screenshot Prevention Key Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        alert("Screen capturing & screenshots are disabled for institutional copyright protection.");
        return false;
      }
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S"))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Auto-intercept Fullscreen to include Watermark Container
    const handleFullscreenChange = () => {
      const container = videoPlayerContainerRef.current;
      if (!container) return;

      const activeFs = document.fullscreenElement || (document as any).webkitFullscreenElement;
      if (activeFs && activeFs !== container) {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            container.requestFullscreen().catch(() => {});
          }).catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
          if ((container as any).webkitRequestFullscreen) {
            (container as any).webkitRequestFullscreen();
          }
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const resetForm = () => {
    setIsCreatingCourse(false);
    setEditingCourseId(null);
    setNewCourseName("");
    setNewCourseDescription("");
    setCoverImageUrl("");
    setNewCourseVideoUrl("");
    setNewCourseFee("2200");
    setNewGroupFeeINR("2200");
    setNewGroupFeeUSD("50");
    setNewGroupClassesCount("10 Classes/month");
    setNewOneToOneFeeINR("600");
    setNewOneToOneFeeUSD("15");
    setNewOneToOneClassesCount("Min 4 Classes/month (Compulsory)");
  };

  const handleEditClick = (crs: any) => {
    setEditingCourseId(crs.id);
    setNewCourseName(crs.title);
    setNewCourseDescription(crs.description || "");
    setNewCourseCategory(crs.category || "Classical Dance");
    setNewCourseLevel(crs.level || "Beginner");
    setNewCourseFee(String(crs.groupFeeINR || crs.feeINR || "2200"));
    setNewGroupFeeINR(String(crs.groupFeeINR || crs.feeINR || "2200"));
    setNewGroupFeeUSD(String(crs.groupFeeUSD || "50"));
    setNewGroupClassesCount(crs.groupClassesCount || "10 Classes/month");
    setNewOneToOneFeeINR(String(crs.oneToOneFeeINR || "600"));
    setNewOneToOneFeeUSD(String(crs.oneToOneFeeUSD || "15"));
    setNewOneToOneClassesCount(crs.oneToOneClassesCount || "Min 4 Classes/month (Compulsory)");
    setCoverImageUrl(crs.thumbnail || "");
    setNewCourseVideoUrl(crs.videoUrl || "");
    setIsCreatingCourse(true);
  };

  const handlePublishCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) {
      alert("Please enter course title.");
      return;
    }

    const payload = {
      title: newCourseName,
      description: newCourseDescription,
      category: newCourseCategory || "Classical Dance",
      level: newCourseLevel || "Beginner",
      groupFeeINR: newGroupFeeINR.replace(/\D/g, "") || "2200",
      groupFeeUSD: newGroupFeeUSD.replace(/\D/g, "") || "50",
      groupClassesCount: newGroupClassesCount || "10 Classes/month",
      oneToOneFeeINR: newOneToOneFeeINR.replace(/\D/g, "") || "600",
      oneToOneFeeUSD: newOneToOneFeeUSD.replace(/\D/g, "") || "15",
      oneToOneClassesCount: newOneToOneClassesCount || "Min 4 Classes/month (Compulsory)",
      feeINR: newGroupFeeINR.replace(/\D/g, "") || "2200",
      classesCount: newGroupClassesCount || "10 Classes/month",
      thumbnail: coverImageUrl || undefined,
      videoUrl: newCourseVideoUrl || undefined
    };

    try {
      if (editingCourseId) {
        await apiRequest(`${ENDPOINTS.COURSES}/${editingCourseId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });

        await openThemeSuccess(
          `Course "${newCourseName}" updated successfully!`,
          "Course Updated"
        );
      } else {
        await apiRequest(ENDPOINTS.COURSES, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        await openThemeSuccess(
          `Course "${newCourseName}" published successfully!`,
          "Course Published"
        );
      }

      await fetchCoursesData();
      resetForm();
    } catch (err: any) {
      alert(err.message || "Failed to save course.");
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (await openThemeConfirm(`Are you sure you want to delete course "${title}"?`, "Delete Course")) {
      try {
        await apiRequest(`${ENDPOINTS.COURSES}/${id}`, { method: "DELETE" });
        await openThemeSuccess(`Course "${title}" deleted successfully.`, "Course Deleted");
        await fetchCoursesData();
      } catch (err: any) {
        alert(err.message || "Failed to delete course.");
      }
    }
  };

  // Filter Courses dynamically based on search & category/level filters
  const filteredCourses = coursesList.filter((crs) => {
    const searchLower = courseSearch.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      crs.title.toLowerCase().includes(searchLower) ||
      crs.code.toLowerCase().includes(searchLower);
    const matchesCategory =
      courseCategoryFilter === "All Categories" || crs.category === courseCategoryFilter;
    const matchesLevel =
      courseLevelFilter === "All Levels" || crs.level === courseLevelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div>
      {viewingCourse ? (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1280px] mx-auto">
          {/* Top Bar with Back Button & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setViewingCourse(null)}
                className="inline-flex items-center gap-2 font-sans font-bold text-xl sm:text-2xl text-stone-900 hover:text-[#9E0C25] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-stone-700" />
                <span>Course Details</span>
              </button>
              <p className="text-xs sm:text-sm font-medium text-stone-500 pl-7">
                Viewing institutional curriculum specification and configuration.
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={() => {
                  const courseToEdit = viewingCourse;
                  setViewingCourse(null);
                  handleEditClick(courseToEdit);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="w-4 h-4 text-white" />
                <span>Edit Course</span>
              </button>

              <button
                onClick={() => {
                  const courseToDelete = viewingCourse;
                  setViewingCourse(null);
                  handleDeleteCourse(courseToDelete.id, courseToDelete.title);
                }}
                className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Hero Banner Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Cover Thumbnail Image */}
              <div className="w-full lg:w-72 h-48 rounded-2xl overflow-hidden border border-stone-200 shadow-sm shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={viewingCourse.thumbnail}
                  alt={viewingCourse.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Header Meta Content */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-800 font-extrabold text-xs uppercase tracking-wider border border-stone-200">
                    {viewingCourse.code}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {viewingCourse.status}
                  </span>
                </div>

                <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#0B1C30] tracking-tight leading-tight">
                  {viewingCourse.title}
                </h2>

                {/* 4 Quick Info Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <span className="block text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">Category</span>
                    <span className="font-bold text-xs text-[#0B1C30] block mt-0.5">{viewingCourse.category}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <span className="block text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">Level</span>
                    <span className="font-bold text-xs text-sky-700 block mt-0.5">{viewingCourse.level}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <span className="block text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">Duration</span>
                    <span className="font-bold text-xs text-[#0B1C30] block mt-0.5">{viewingCourse.duration}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200/60">
                    <span className="block text-[10.5px] font-extrabold text-rose-500 uppercase tracking-wider">Fee Structure</span>
                    <span className="font-extrabold text-xs text-[#9E0C25] block mt-0.5">
                      ₹ {viewingCourse.feeINR ? Number(viewingCourse.feeINR).toLocaleString("en-IN") : "12,000"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Details Grid (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Description Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#9E0C25] flex items-center justify-center shrink-0">
                    <Info className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-semibold text-[16px] leading-[24px] text-[#0B1C30]">
                    Course Description & Learning Outcomes
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <p className="font-sans font-normal text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                    {viewingCourse.description || "No course description provided."}
                  </p>
                </div>
              </div>

              {/* Promotional Video Player Embed */}
              {viewingCourse.videoUrl && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#9E0C25] flex items-center justify-center shrink-0">
                        <Film className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="font-sans font-semibold text-[16px] leading-[24px] text-[#0B1C30]">
                          Promotional & Curriculum Video Preview
                        </h3>
                        <p className="text-[11px] text-stone-400 font-medium">
                          High-speed DRM streaming player
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    ref={videoPlayerContainerRef}
                    onContextMenu={(e) => e.preventDefault()}
                    onDoubleClick={toggleVideoFullscreen}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden border border-stone-200 bg-black shadow-md select-none group transform-gpu [&:fullscreen]:w-full [&:fullscreen]:h-full"
                  >
                    {/* Pure Logo Watermark Badge Only (Top Right - Highest Z-Index for Fullscreen) */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[99999] pointer-events-none select-none drop-shadow-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/logo.png"
                        alt="Kathak Logo"
                        className="h-10 sm:h-14 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] opacity-95"
                      />
                    </div>

                    {/* Anti-Piracy Floating Watermark (Bottom Left) */}
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-[99999] pointer-events-none text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest select-none drop-shadow-md">
                      Protected Lesson • Kathak Next DRM
                    </div>

                    {(() => {
                      const videoData = getFormatVideoUrl(viewingCourse.videoUrl);
                      if (videoData.isIframe) {
                        return (
                          <iframe
                            src={videoData.finalUrl}
                            loading="lazy"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      }
                      return (
                        <video
                          src={videoData.finalUrl}
                          controls
                          preload="auto"
                          playsInline
                          controlsList="nodownload noremoteplayback"
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Configuration & Fee Breakdown */}
            <div className="space-y-6">
              {/* Detailed Fee Structure Card (Indian ₹ & International $) */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#9E0C25] flex items-center justify-center font-bold text-xs shrink-0">
                    ₹
                  </div>
                  <h4 className="font-sans font-bold text-sm text-[#0B1C30]">
                    Fee Structure Breakdown
                  </h4>
                </div>

                <div className="space-y-3.5">
                  {/* Indian Students (INR) */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">
                      🇮🇳 Indian Students (INR ₹)
                    </span>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-600">Online Group Classes</span>
                      <span className="font-bold text-[#9E0C25]">
                        ₹{viewingCourse.groupFeeINR ? Number(viewingCourse.groupFeeINR).toLocaleString("en-IN") : "2,200"}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-600">Personal (1-on-1)</span>
                      <span className="font-bold text-[#0B1C30]">
                        ₹{viewingCourse.oneToOneFeeINR ? Number(viewingCourse.oneToOneFeeINR).toLocaleString("en-IN") : "600"}/class
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium pt-1">
                      Includes {viewingCourse.groupClassesCount || "10 classes/month"}
                    </p>
                  </div>

                  {/* International Students (USD) */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/70 space-y-2">
                    <span className="text-[11px] font-extrabold text-sky-700 uppercase tracking-wider block">
                      🌍 International Students (USD $)
                    </span>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-600">Online Group Classes</span>
                      <span className="font-bold text-sky-800">
                        USD ${viewingCourse.groupFeeUSD || 50}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-600">Personal (1-on-1)</span>
                      <span className="font-bold text-sky-900">
                        USD ${viewingCourse.oneToOneFeeUSD || 15}/class
                      </span>
                    </div>
                    <p className="text-[10px] text-sky-600/80 font-medium pt-1">
                      Includes {viewingCourse.groupClassesCount || "10 classes/month"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Configuration Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h4 className="font-sans font-bold text-sm text-[#0B1C30]">Course Configuration</h4>

                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-stone-500">Status</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !isCreatingCourse ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Course Management
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-stone-500 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-stone-800">
                  <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                  {totalCount} Total Courses
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 text-sky-600">
                  <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                  {newThisMonthCount} New this month
                </span>
              </p>
            </div>

            <button
              onClick={() => setIsCreatingCourse(true)}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search courses, codes..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={courseCategoryFilter}
                    onChange={(e) => setCourseCategoryFilter(e.target.value)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>All Categories</option>
                    <option>Classical Dance</option>
                    <option>Yoga</option>
                    <option>Music Theory</option>
                    <option>Contemporary</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={courseLevelFilter}
                    onChange={(e) => setCourseLevelFilter(e.target.value)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>All Levels</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button className="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 text-stone-700 transition-colors">
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3 px-4">COURSE</th>
                    <th className="py-3 px-4">CATEGORY</th>
                    <th className="py-3 px-4">LEVEL</th>
                    <th className="py-3 px-4">DURATION</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((crs) => (
                      <tr key={crs.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={crs.thumbnail} alt={crs.title} className="w-12 h-10 rounded-lg object-cover border border-stone-200 shrink-0" />
                            <div>
                              <span className="block font-bold text-stone-900 text-sm">{crs.title}</span>
                              <span className="block text-[11px] text-stone-400 font-semibold uppercase">{crs.code}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-stone-700 font-semibold">{crs.category}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10.5px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                            {crs.level}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-stone-700 font-medium">{crs.duration}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-emerald-100/80 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {crs.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-stone-400">
                            <button onClick={() => setViewingCourse(crs)} title="View Course Details" className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handleEditClick(crs)} title="Edit Course" className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteCourse(crs.id, crs.title)} title="Delete Course" className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-400 text-xs font-semibold">
                        No courses found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <div>Showing {filteredCourses.length > 0 ? 1 : 0}-{filteredCourses.length} of {coursesList.length} courses</div>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-400 hover:bg-stone-50 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1280px] mx-auto">
          {/* Form Top Title Bar */}
          <div className="space-y-1">
            <button
              onClick={() => setIsCreatingCourse(false)}
              className="inline-flex items-center gap-2 font-sans font-bold text-xl sm:text-2xl text-stone-900 hover:text-[#9E0C25] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-stone-700" />
              <span>Create New Course</span>
            </button>
            <p className="text-xs sm:text-sm font-medium text-stone-500 pl-7">
              Configure institutional curriculum details and faculty assignments.
            </p>
          </div>

          <form onSubmit={handlePublishCourse} className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Steps Navigation Sidebar & Pro Tip */}
            <div className="w-full lg:w-[178px] shrink-0 space-y-6">
              <div className="bg-white rounded-3xl p-3 border border-stone-200/80 shadow-xs space-y-1">
                {[
                  { id: 1, label: "Basic Info", active: true },
                  { id: 2, label: "Curriculum", active: false },
                  { id: 3, label: "Media", active: false },
                  { id: 4, label: "Scheduling", active: false }
                ].map((step) => (
                  <div
                    key={step.id}
                    className={`w-full h-[48px] px-[16px] py-[12px] rounded-[8px] flex items-center gap-3 transition-all cursor-pointer ${
                      step.active
                        ? "bg-[#E2DFFF]/40 text-[#9E0C25] font-bold shadow-2xs"
                        : "text-stone-600 font-medium hover:bg-stone-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                        step.active
                          ? "bg-[#9E0C25] text-white"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span className="text-xs font-semibold">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Pro Tip Highlight Box */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-extrabold tracking-wide uppercase">Pro Tip</span>
                </div>
                <p className="text-[11.5px] font-medium text-stone-500 leading-relaxed">
                  Add high-quality cover images to increase enrollment rates by up to 24%.
                </p>
              </div>
            </div>

            {/* Right Main Form Canvas (Width 1,000px) */}
            <div className="flex-1 w-full space-y-8 max-w-[1000px]">
              {/* SECTION 1: Basic Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#9E0C25] flex items-center justify-center shrink-0">
                    <Info className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-semibold text-[16px] leading-[24px] text-[#0B1C30]">
                    Basic Information
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Course Name Input */}
                  <div className="space-y-1.5">
                    <label className="block font-sans font-normal text-[16px] leading-[24px] text-[#0B1C30]">
                      Course Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advanced Quantum Mechanics & Thermodynamics"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[#0B1C30] placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block font-sans font-normal text-[16px] leading-[24px] text-[#0B1C30]">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={newCourseCategory}
                        onChange={(e) => setNewCourseCategory(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-[#0B1C30] appearance-none focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                      >
                        <option value="">Select Department</option>
                        <option value="Classical Dance">Classical Dance (Kathak)</option>
                        <option value="Yoga">Yoga & Fitness</option>
                        <option value="Music Theory">Music Theory</option>
                        <option value="Contemporary">Contemporary Flow</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Competency Level Radio Selector Grid */}
                  <div className="space-y-2">
                    <label className="block font-sans font-normal text-[16px] leading-[24px] text-[#0B1C30]">
                      Competency Level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { level: "Beginner", desc: "No prerequisites required" },
                        { level: "Intermediate", desc: "Basic understanding expected" },
                        { level: "Advanced", desc: "Core mastery required" }
                      ].map((item) => {
                        const isSelected = newCourseLevel === item.level;
                        return (
                          <div
                            key={item.level}
                            onClick={() => setNewCourseLevel(item.level as any)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "bg-[#FDF2F4] border-[#9E0C25] shadow-xs"
                                : "bg-stone-50 border-stone-200/80 hover:bg-stone-100/70"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-sans font-bold text-[16px] leading-[24px] text-[#0B1C30]">
                                {item.level}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? "border-[#9E0C25] bg-[#9E0C25]" : "border-stone-300"
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold text-stone-500 mt-2 block">
                              {item.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Course Description Rich Text Box */}
                  <div className="space-y-1.5">
                    <label className="block font-sans font-normal text-[16px] leading-[24px] text-[#0B1C30]">
                      Course Description
                    </label>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:bg-white focus-within:border-[#9E0C25] transition-all">
                      {/* Rich Formatting Toolbar */}
                      <div className="flex items-center gap-1 px-3 py-2 border-b border-stone-200/80 bg-white">
                        <button type="button" className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"><Underline className="w-3.5 h-3.5" /></button>
                        <span className="w-px h-4 bg-stone-200 mx-1" />
                        <button type="button" className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"><List className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"><ListOrdered className="w-3.5 h-3.5" /></button>
                        <span className="w-px h-4 bg-stone-200 mx-1" />
                        <button type="button" className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"><Link2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Describe the course learning outcomes, key modules, and target audience..."
                        value={newCourseDescription}
                        onChange={(e) => setNewCourseDescription(e.target.value)}
                        className="w-full p-4 bg-transparent text-xs font-medium text-[#0B1C30] placeholder:text-stone-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Course Media */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#9E0C25] flex items-center justify-center shrink-0">
                    <Film className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-semibold text-[16px] leading-[24px] text-[#0B1C30]">
                    Course Media
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Course Cover Image Box */}
                  <div className="space-y-1.5">
                    <label htmlFor="coverImageInput" className="block font-sans font-normal text-[16px] leading-[24px] text-[#0B1C30]">
                      Course Cover Image
                    </label>
                    <input
                      type="file"
                      id="coverImageInput"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="coverImageInput"
                      className="border-2 border-dashed border-stone-200 rounded-2xl p-6 bg-stone-50 text-center flex flex-col items-center justify-center space-y-2 hover:bg-stone-100/70 transition-colors cursor-pointer block min-h-[140px]"
                    >
                      {coverImageUrl ? (
                        <div className="relative w-full h-28 rounded-xl overflow-hidden group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold bg-[#9E0C25] px-3 py-1.5 rounded-lg shadow-md">
                              Change Image
                            </span>
                          </div>
                        </div>
                      ) : isUploading ? (
                        <div className="flex flex-col items-center space-y-2 py-2">
                          <div className="w-6 h-6 border-2 border-[#9E0C25] border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-bold text-[#9E0C25]">Uploading Image...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-500 mx-auto">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-[#0B1C30] block">Upload Image</span>
                          <span className="text-[10.5px] font-medium text-stone-400 block">
                            Recommended 1280x720px (PNG, JPG)
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Promotional Video URL & Direct Upload */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block font-sans font-normal text-[16px] leading-[24px] text-[#0B1C30]">
                          Promotional Video URL / Direct Upload
                        </label>
                        <input
                          type="file"
                          id="bunnyVideoFileInput"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="bunnyVideoFileInput"
                          className="text-[11px] font-bold text-[#9E0C25] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingVideo ? "Uploading..." : "Direct Upload Video"}</span>
                        </label>
                      </div>

                      <div className="relative flex items-center">
                        <Link2 className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Paste video URL or click Direct Upload Video"
                          value={newCourseVideoUrl}
                          onChange={(e) => setNewCourseVideoUrl(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-[#0B1C30] placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                        />
                      </div>
                    </div>

                    {isUploadingVideo && (
                      <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2 text-xs font-bold text-sky-700">
                        <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Uploading & processing video file...</span>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-start gap-2.5">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#9B3434]" />
                      <p className="font-sans font-normal text-[13px] leading-[18px] text-[#9B3434]">
                        Videos must be under 3 minutes for optimal student engagement. High-speed DRM HD streaming enabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Detailed Fee Structure (Group & 1-on-1 for INR & USD) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Group Classes Fee Box */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-[#9E0C25]">
                      Group Classes (Online)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-700">Group Fee (INR ₹ / mo)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-stone-500 font-bold text-xs">₹</span>
                        <input
                          type="text"
                          placeholder="2200"
                          value={newGroupFeeINR}
                          onChange={(e) => {
                            setNewGroupFeeINR(e.target.value);
                            setNewCourseFee(e.target.value);
                          }}
                          className="w-full h-10 pl-8 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-700">Group Fee (USD $ / mo)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-stone-500 font-bold text-xs">$</span>
                        <input
                          type="text"
                          placeholder="50"
                          value={newGroupFeeUSD}
                          onChange={(e) => setNewGroupFeeUSD(e.target.value)}
                          className="w-full h-10 pl-8 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-700">Classes Frequency / Schedule</label>
                    <input
                      type="text"
                      placeholder="10 Classes/month"
                      value={newGroupClassesCount}
                      onChange={(e) => setNewGroupClassesCount(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Personal (1-on-1) Classes Fee Box */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700">
                      Personal (1-on-1) Classes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-700">1-on-1 Fee (INR ₹ / class)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-stone-500 font-bold text-xs">₹</span>
                        <input
                          type="text"
                          placeholder="600"
                          value={newOneToOneFeeINR}
                          onChange={(e) => setNewOneToOneFeeINR(e.target.value)}
                          className="w-full h-10 pl-8 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-stone-700">1-on-1 Fee (USD $ / class)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-stone-500 font-bold text-xs">$</span>
                        <input
                          type="text"
                          placeholder="15"
                          value={newOneToOneFeeUSD}
                          onChange={(e) => setNewOneToOneFeeUSD(e.target.value)}
                          className="w-full h-10 pl-8 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-700">Minimum Class Requirement</label>
                    <input
                      type="text"
                      placeholder="Min 4 Classes/month (Compulsory)"
                      value={newOneToOneClassesCount}
                      onChange={(e) => setNewOneToOneClassesCount(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Footer Action Buttons Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setIsCreatingCourse(false)}
                  className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Discard Draft</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCourse(false)}
                    className="px-6 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Publish Course
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      )}
    </div>
  );
}
