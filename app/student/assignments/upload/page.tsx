"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
import {
  UploadCloud,
  Calendar,
  Award,
  Sparkles,
  Play,
  CheckCircle2,
  FileVideo,
  Loader2,
  ArrowRight
} from "lucide-react";

interface AssignmentDetails {
  id: string;
  name: string;
  typeTag: string;
  course: string;
  description: string;
  dueDate: string;
  maxPoints: string;
  referenceFileUrl?: string;
}

// Safely format video URLs (backend uploads, iframe embeds, cloud URLs, or sample fallback)
const formatVideoUrl = (rawUrl?: string): { isIframe: boolean; url: string } => {
  const fallbackVideo = "https://vjs.zencdn.net/v/oceans.mp4";

  if (!rawUrl || rawUrl.trim() === "" || rawUrl === "---" || rawUrl === "null" || rawUrl === "undefined") {
    return { isIframe: false, url: fallbackVideo };
  }

  let cleanUrl = rawUrl.trim();

  // Prepend backend URL if relative path
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

export default function StudentAssignmentUploadPage() {
  const router = useRouter();

  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form submission state
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch dynamic assignment details from API (runs only once on mount)
  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get("id");

        const res = await apiRequest("/student/assignments");
        if (isMounted && res?.data && Array.isArray(res.data.assignments)) {
          const list: any[] = res.data.assignments;
          const found = id ? list.find((item) => item.id === id) : list[0];

          if (found) {
            setAssignment({
              id: found.id,
              name: found.name || "Practical Exercise",
              typeTag: found.typeTag || "Video Submission",
              course: found.course || "KATHAK",
              description:
                found.description ||
                "Demonstrate proficiency in 'Tatkar' variations at three distinct speeds (Laya).",
              dueDate: found.dueDate || "Oct 24, 2024",
              maxPoints: found.maxPoints || "100 pts",
              referenceFileUrl: found.referenceFileUrl || found.fileUrl,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch assignment details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle direct file upload to backend API
  const handleFileUpload = async (file: File) => {
    if (file.size > 500 * 1024 * 1024) {
      alert("File size exceeds maximum 500MB limit.");
      return;
    }

    setSelectedFile(file);
    try {
      const localPreview = URL.createObjectURL(file);
      setFilePreviewUrl(localPreview);
    } catch {
      // ignore preview blob error
    }

    setUploadingFile(true);
    setUploadProgress(0);

    const token =
      localStorage.getItem("kathak_student_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("kathak_token") ||
      "";

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const endpoint = `${base}/upload/video`;

    const formData = new FormData();
    formData.append("video", file);

    try {
      const url = await new Promise<string>((resolve) => {
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
                json?.data?.directUrl ||
                json?.data?.url ||
                json?.data?.iframeUrl ||
                json?.data?.secure_url ||
                "";
              if (!u) resolve(`/uploads/${file.name}`);
              else resolve(u);
            } else {
              resolve(`/uploads/${file.name}`);
            }
          } catch {
            resolve(`/uploads/${file.name}`);
          }
        };

        xhr.onerror = () => resolve(`/uploads/${file.name}`);
        xhr.send(formData);
      });

      setUploadedFileUrl(url);
      setUploadProgress(100);
    } catch (err) {
      console.error(err);
      setUploadedFileUrl(`/uploads/${file.name}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadedFileUrl) {
      alert("Please select a video file to upload before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const assignmentId = searchParams.get("id") || assignment?.id || "asg-1";

      await apiRequest("/student/assignments/submit", {
        method: "POST",
        body: JSON.stringify({
          assignmentId,
          fileUrl: uploadedFileUrl || (selectedFile ? `/uploads/${selectedFile.name}` : "/demo-submission.mp4"),
          notes: submissionNotes,
        }),
      });

      setIsSubmitted(true);
      await openThemeSuccess("Assignment submitted successfully!", "Submission Complete");
      setTimeout(() => {
        router.push("/student/assignments");
      }, 1200);
    } catch (err: any) {
      alert(err?.message || "Failed to submit assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8C2329]" />
        <span className="text-xs font-semibold text-slate-500">Loading assignment details...</span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-sans pb-16 text-slate-800">
      {/* BREADCRUMB & HEADER SECTION */}
      <div className="space-y-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/student/assignments" className="hover:text-[#8C2329] transition-colors">
            My Assignments
          </Link>
          <span>›</span>
          <span className="text-slate-700 font-semibold">Upload Submission</span>
        </div>

        {/* Course Pill Badge */}
        <div className="pt-1">
          <span className="bg-[#FDF2F4] text-[#8C2329] border border-rose-100/70 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-block">
            {assignment?.course || "KATHAK"}
          </span>
        </div>

        {/* Assignment Title & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {assignment?.name || "Rhythmic Footwork Week 3"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
          {assignment?.description ||
            "Demonstrate proficiency in 'Tatkar' variations at three distinct speeds (Laya)."}
        </p>

        {/* Due Date & Max Marks Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="bg-slate-100/70 border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-slate-700 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Due Date:</span>
            <span className="font-bold text-slate-900">{assignment?.dueDate || "Oct 24, 2024"}</span>
          </div>

          <div className="bg-slate-100/70 border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-slate-700 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-slate-500" />
            <span>Max Marks:</span>
            <span className="font-bold text-slate-900">{assignment?.maxPoints || "100 pts"}</span>
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Dropzone Box & Notes Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* VIDEO SUBMISSION DROPZONE */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-[#8C2329]" />
                <span>VIDEO SUBMISSION</span>
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (uploadingFile) return;
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFileUpload(f);
                }}
                className="border-2 border-dashed border-sky-300 hover:border-[#8C2329] bg-[#F8FAFC] rounded-2xl p-6 text-center transition-all relative group cursor-pointer min-h-[180px] flex flex-col items-center justify-center"
              >
                <input
                  type="file"
                  accept="video/mp4,video/mov,video/webm"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />

                <div className="w-12 h-12 rounded-full bg-rose-50 text-[#8C2329] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform shadow-2xs">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 pt-3 w-full">
                  {uploadingFile ? (
                    <div className="w-full max-w-xs space-y-2 mx-auto">
                      <p className="text-xs font-bold text-slate-700">Uploading video… {uploadProgress}%</p>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[#8C2329] transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : selectedFile ? (
                    <div className="space-y-3 w-full max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                        <span>Ready: {selectedFile.name}</span>
                      </div>

                      {/* Video Player Preview */}
                      {filePreviewUrl && (
                        <div className="w-full aspect-video rounded-xl bg-slate-900 overflow-hidden shadow-xs relative z-20">
                          <video
                            src={filePreviewUrl}
                            controls
                            playsInline
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <p className="text-[11px] text-slate-400 font-medium">Click or drop to select a different video</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Drag and drop your video file here
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        or click to browse your local storage
                      </p>
                    </>
                  )}

                  <div className="text-[10.5px] text-slate-400 font-medium pt-2 flex items-center justify-center gap-3">
                    <span>Supported: MP4, MOV</span>
                    <span>•</span>
                    <span>Max Size: 500MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMISSION NOTES */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                SUBMISSION NOTES (OPTIONAL)
              </label>
              <textarea
                rows={4}
                placeholder="Add any specific details you want your teacher to know about your practice session..."
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#8C2329] focus:bg-white rounded-xl p-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
              />
            </div>

            {/* BOTTOM BUTTONS */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <Link
                href="/student/assignments"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting || uploadingFile}
                className="bg-[#8C2329] hover:bg-[#721c21] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
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

        {/* RIGHT COLUMN: Submission Guidelines & Reference Video */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: SUBMISSION GUIDELINES */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Submission Guidelines</h3>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold">◆</span>
                <div>
                  <span className="font-extrabold text-slate-900 block">Optimal Lighting</span>
                  <span className="text-slate-500 font-normal">
                    Ensure the room is well-lit. Avoid recording against a bright window or backlight.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold">◆</span>
                <div>
                  <span className="font-extrabold text-slate-900 block">Full Body View</span>
                  <span className="text-slate-500 font-normal">
                    Position the camera to capture your entire form, from head to toes, to allow for posture evaluation.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold">◆</span>
                <div>
                  <span className="font-extrabold text-slate-900 block">Clear Audio</span>
                  <span className="text-slate-500 font-normal">
                    Ensure your footwork sounds (Ghungroo) are clearly audible over any background music.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: REFERENCE VIDEO PLAYER */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="h-44 rounded-2xl bg-slate-900 overflow-hidden relative shadow-inner flex items-center justify-center">
              {(() => {
                const { isIframe, url } = formatVideoUrl(assignment?.referenceFileUrl);

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
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallbackApplied) {
                        target.dataset.fallbackApplied = "true";
                        target.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
                        target.load();
                      }
                    }}
                  >
                    <source src={url} type="video/mp4" />
                    <source src={url} type="video/webm" />
                    Your browser does not support video playback.
                  </video>
                );
              })()}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                REFERENCE VIDEO
              </span>
              <h4 className="text-sm font-extrabold text-slate-900">
                {assignment?.name ? `${assignment.name} Reference` : "Laya Variations Guide"}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => {
                const { url } = formatVideoUrl(assignment?.referenceFileUrl);
                window.open(url, "_blank");
              }}
              className="w-full border border-slate-200 hover:border-slate-300 text-[#8C2329] font-extrabold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-[#8C2329]" />
              <span>Watch Tutorial</span>
            </button>
          </div>
        </div>
      </div>

      {isSubmitted && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 text-white" />
          <span>Assignment Submitted Successfully! Redirecting...</span>
        </div>
      )}
    </div>
  );
}
