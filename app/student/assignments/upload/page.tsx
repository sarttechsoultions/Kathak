"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
import {
  Upload,
  CheckCircle2,
  Clock,
  Info,
  X,
  FileVideo,
  MessageSquare,
  ArrowRight,
  Loader2,
  Video,
  FileText
} from "lucide-react";

interface PracticeTask {
  id: string;
  title: string;
  category?: string;
  course?: string;
  batchName?: string;
  submissionDate?: string;
  cutOffTime?: string;
  detailedInstructions?: string;
  referenceFileUrl?: string;
  createdByName?: string;
}

const getFullVideoUrl = (rawUrl?: string): string => {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("blob:")) {
    return rawUrl;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const backendRoot = apiBase.replace(/\/api\/v1\/?$/, "");
  const cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${backendRoot}${cleanPath}`;
};

export default function StudentPracticeVideoUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [task, setTask] = useState<PracticeTask | null>(null);
  const [loading, setLoading] = useState(true);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileProgress, setFileProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  // Notes state
  const [notesForGuru, setNotesForGuru] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(window.location.search);
        const taskId = searchParams.get("id");

        const res = await apiRequest<{ data?: PracticeTask[] }>("/video/tasks");
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const matched = taskId ? res.data.find((t) => t.id === taskId) : res.data[0];
          setTask(matched || res.data[0]);
        } else {
          setTask({
            id: "task-default",
            title: "Tatkar Footwork Speed Test – 140 BPM",
            category: "KATHAK",
            course: "Level 3 • Practice Sessions",
            submissionDate: "2026-10-24",
            cutOffTime: "23:59",
            createdByName: "Super Admin",
            detailedInstructions: "Please practice Tatkar at 140 BPM with clear footwork and audible Ghungroo sound. Keep your posture upright.",
          });
        }
      } catch (err) {
        console.error("Fetch Task Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTaskDetails();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    setFileProgress(5);

    const localPreviewUrl = URL.createObjectURL(file);
    setUploadedUrl(localPreviewUrl);

    // Track real network upload byte progress via XMLHttpRequest
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    xhr.open("POST", `${base}/upload/video`, true);

    const token = typeof window !== "undefined" ? localStorage.getItem("kathak_token") : null;
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && e.total > 0) {
        const percent = Math.min(99, Math.round((e.loaded / e.total) * 100));
        setFileProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          const remoteUrl = res?.data?.url || res?.data?.fileUrl || res?.data?.directUrl || res?.url;
          if (remoteUrl) setUploadedUrl(remoteUrl);
        } catch {}
      }
      setFileProgress(100);
      setIsUploading(false);
    };

    xhr.onerror = () => {
      setFileProgress(100);
      setIsUploading(false);
    };

    xhr.send(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadedUrl) {
      alert("Please select a practice video file to upload.");
      return;
    }

    try {
      setIsSubmitting(true);

      const videoTitle = task?.title || selectedFile?.name || "Tatkar Footwork Practice";
      const finalUrl = uploadedUrl || (selectedFile ? URL.createObjectURL(selectedFile) : "");

      const res = await apiRequest<any>("/video/student/submit", {
        method: "POST",
        body: JSON.stringify({
          taskId: task?.id,
          videoTitle,
          fileUrl: finalUrl,
          courseAndBatch: task?.course || task?.batchName || "Hobby Kathak Batch",
          studentNotes: notesForGuru,
        }),
      });

      await openThemeSuccess("Practice Video Submitted!", "Your guru will review your submission soon.");
      const subId = res?.data?.id;
      if (subId) {
        router.push(`/student/video-submission/evaluation?submissionId=${subId}`);
      } else {
        router.push("/student/video-submission/evaluation");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to submit practice video.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B1D2C]" />
        <span className="text-xs font-semibold text-stone-500">Loading task details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 font-sans pb-20 text-stone-800 animate-in fade-in duration-300">
      
      {/* HEADER SECTION WITH DYNAMIC CATEGORY & TITLE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
            {task?.category || "KATHAK"}
          </span>
          <span className="text-stone-500 font-semibold">
            {task?.course || task?.batchName || "Level 3 • Practice Sessions"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          {task?.title || "Tatkar Footwork Speed Test – 140 BPM"}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-3xl">
          Submit your practice session video to receive feedback from Guru {task?.createdByName || "Super Admin"}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* MAIN 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT MAIN AREA (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* ADMIN REFERENCE VIDEO & DETAILED INSTRUCTIONS CARD (LIGHT PROFESSIONAL THEME) */}
            {(task?.referenceFileUrl || task?.detailedInstructions) && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#8B1D2C] border border-rose-100 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-stone-900 tracking-tight">
                        Task Guidance &amp; Reference Media
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        Instructions provided by {task?.createdByName || "Super Admin"}
                      </p>
                    </div>
                  </div>

                  <span className="bg-rose-50 text-[#8B1D2C] border border-rose-200/70 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Official Guidance
                  </span>
                </div>

                {/* Detailed Instructions (Scrollable, Light Professional Paper Box) */}
                {task?.detailedInstructions && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8B1D2C]">
                        DETAILED INSTRUCTIONS
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">SCROLL TO READ</span>
                    </div>

                    <div className="bg-amber-50/40 border-l-4 border-[#8B1D2C] border-y border-r border-amber-200/60 rounded-2xl p-5 max-h-64 overflow-y-auto font-sans leading-relaxed text-xs sm:text-sm text-stone-800 space-y-3 shadow-2xs">
                      <div className="whitespace-pre-wrap font-medium break-words text-stone-800 space-y-2">
                        {task.detailedInstructions}
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Reference Video Player */}
                {task?.referenceFileUrl && (
                  <div className="space-y-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                      <Video className="w-4 h-4 text-[#8B1D2C]" />
                      <span>Reference Video Attached by Guru</span>
                    </div>

                    <div className="rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 shadow-xs">
                      {task.referenceFileUrl.endsWith(".mp4") || task.referenceFileUrl.endsWith(".mov") || task.referenceFileUrl.includes("/uploads/") ? (
                        <video
                          src={getFullVideoUrl(task.referenceFileUrl)}
                          controls
                          preload="metadata"
                          playsInline
                          className="w-full max-h-[300px] object-contain bg-black"
                        />
                      ) : (
                        <a
                          href={getFullVideoUrl(task.referenceFileUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 p-4 bg-stone-50 hover:bg-stone-100 transition-colors text-xs font-bold text-[#8B1D2C]"
                        >
                          <Video className="w-5 h-5 text-[#8B1D2C]" />
                          <span>View Reference Media Attachment</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}
            
            {/* DROPZONE CONTAINER */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                accept="video/mp4,video/mov,video/webm"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
                className="hidden"
              />

              {/* Dashed Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFileSelect(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-[#8B1D2C] bg-stone-50/60 rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-rose-50 text-[#8B1D2C] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-stone-900">
                    Drag and drop your practice video
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Support for high-quality MP4, MOV files. Recommended 1080p resolution.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#8B1D2C] hover:bg-[#701522] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Browse Files
                </button>
              </div>

              {/* UPLOADING / SELECTED FILE CARD */}
              {selectedFile && (
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#8B1D2C] flex items-center justify-center shrink-0">
                        <FileVideo className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-stone-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-stone-500 font-medium">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • {isUploading ? "Uploading..." : "Ready to submit"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isUploading ? (
                        <span className="font-bold text-xs text-[#8B1D2C]">
                          {fileProgress}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Uploaded</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadedUrl("");
                          setFileProgress(0);
                        }}
                        className="w-7 h-7 rounded-full hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 rounded-full ${
                        isUploading ? "bg-[#8B1D2C]" : "bg-emerald-500"
                      }`}
                      style={{ width: isUploading ? `${fileProgress}%` : "100%" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* NOTES FOR GURU CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-[#8B1D2C]" />
                <h3 className="font-bold text-sm text-stone-900">Notes for Guru</h3>
              </div>

              <textarea
                rows={4}
                value={notesForGuru}
                onChange={(e) => setNotesForGuru(e.target.value)}
                placeholder="Share any specific challenges you faced or areas where you want feedback (e.g., foot clarity during transitions)..."
                className="w-full p-4 rounded-2xl bg-stone-50/70 border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#8B1D2C] transition-colors resize-none"
              />
            </div>
          </div>

          {/* RIGHT COLUMN CARD: SUBMISSION RULES & DEADLINE (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SUBMISSION RULES CARD */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
              <h3 className="font-bold text-sm text-stone-900">Submission Rules</h3>

              <div className="space-y-4 text-xs font-semibold text-stone-700">
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-stone-900">Video Format</p>
                    <p className="text-[11px] text-stone-500 font-medium">MP4 or MOV preferred. Max size 2GB.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-stone-900">Lighting Requirements</p>
                    <p className="text-[11px] text-stone-500 font-medium">Well-lit from front. Feet must be clearly visible.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-stone-900">Audio Clarity</p>
                    <p className="text-[11px] text-stone-500 font-medium">Ghungroo sound must be audible over the background track.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-stone-900">One Take Only</p>
                    <p className="text-[11px] text-stone-500 font-medium">The sequence must be performed without cuts.</p>
                  </div>
                </div>

              </div>

              {/* DEADLINE BOX */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">DEADLINE</span>
                  <span className="bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                    2 DAYS LEFT
                  </span>
                </div>

                <div className="bg-rose-50/80 border border-rose-100/70 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-bold text-[#8B1D2C]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>
                    {task?.submissionDate
                      ? new Date(task.submissionDate).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
                      : "Friday, 24 Oct"}
                    {" • "}
                    {task?.cutOffTime || "11:59 PM"}
                  </span>
                </div>
              </div>

              {/* INSTRUCTOR INFO BOX */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Ananya.png"
                    alt={task?.createdByName || "Super Admin"}
                    className="w-9 h-9 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <p className="font-bold text-xs text-stone-900">{task?.createdByName || "Super Admin"}</p>
                    <p className="text-[10px] text-stone-500 font-medium">Senior Kathak Instructor</p>
                  </div>
                </div>

                <Info className="w-4 h-4 text-stone-400 cursor-pointer hover:text-stone-700" />
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM ACTION FOOTER BAR */}
        <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-6">
          <Link
            href="/student/video-submission"
            className="text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel Submission
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-[#8B1D2C] hover:bg-[#701522] text-white font-bold text-xs transition-all cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Video...</span>
              </>
            ) : (
              <>
                <span>Submit Assignment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
