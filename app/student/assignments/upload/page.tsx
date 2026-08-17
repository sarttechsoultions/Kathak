"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
import {
  Upload,
  Calendar,
  Star,
  PlayCircle,
  HelpCircle,
  Video,
  AlertCircle,
  Loader2,
  Lightbulb,
  UserCheck,
  Volume2,
  CheckCircle2
} from "lucide-react";

const getFullVideoUrl = (url?: string | null) => {
  if (!url) return "";
  let cleanUrl = url.trim();

  if (cleanUrl.startsWith("/uploads") || cleanUrl.startsWith("uploads/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const backendRoot = apiBase.replace(/\/api\/v1\/?$/, "");
    const relativePath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
    cleanUrl = `${backendRoot}${relativePath}`;
  }

  return cleanUrl;
};

export default function StudentVideoSubmissionUpload() {
  const router = useRouter();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const [notesForGuru, setNotesForGuru] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setTaskId(id);
      fetchTaskDetails(id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTaskDetails = async (id: string) => {
    try {
      const res = await apiRequest<any>(`/student/tasks/tasks/${id}`);
      setTask(res.data);
    } catch (err: any) {
      alert("Failed to load task details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploadProgress(0);
    setUploadingFile(true);
    setUploadedUrl("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const isVideo = file.type.startsWith("video/");
      const endpoint = isVideo ? "/upload/video" : "/upload/image";
      
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${apiBase}${endpoint}`, true);
      xhr.withCredentials = true;

      const token = typeof window !== "undefined" ? localStorage.getItem("kathak_token") : null;
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        }
      };

      const result = await new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (err) {
              reject(new Error("Invalid JSON response"));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network Error"));
        xhr.send(formData);
      });

      if (result.status === "success" && result.data?.url) {
        setUploadedUrl(result.data.url);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload video");
      setSelectedFile(null);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadedUrl) {
      alert("Please select an assignment file to upload.");
      return;
    }

    try {
      setIsSubmitting(true);

      const finalUrl = uploadedUrl || (selectedFile ? URL.createObjectURL(selectedFile) : "");

      const res = await apiRequest<any>("/student/assignments/submit", {
        method: "POST",
        body: JSON.stringify({
          assignmentId: task?.id,
          fileUrl: finalUrl,
          notes: notesForGuru,
        }),
      });

      await openThemeSuccess("Assignment Submitted!", "Your guru will review your submission soon.");
      const subId = res?.data?.id || res?.data?.submission?.id;
      if (subId) {
        router.push(`/student/assignments/evaluation?submissionId=${subId}`);
      } else {
        router.push("/student/assignments");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to submit assignment.");
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
    <div className="max-w-[1240px] mx-auto font-sans pb-20 text-stone-800 animate-in fade-in duration-300">
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4 border-b border-stone-200 border-dashed pb-6">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                {task?.category || "KATHAK"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {task?.title || "Rhythmic Footwork Week 3"}
            </h1>

            <p className="text-sm text-stone-600 font-medium max-w-2xl leading-relaxed">
              {task?.detailedInstructions || "Demonstrate proficiency in 'Tatkar' variations at three distinct speeds (Laya)."}
            </p>
          </div>

          {/* Cards for Due Date & Marks */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="flex items-center gap-4 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
              <div className="w-12 h-12 rounded-xl bg-white text-rose-700 flex items-center justify-center shadow-xs border border-rose-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Due Date</p>
                <p className="text-sm font-extrabold text-stone-900">
                  {task?.submissionDate
                    ? new Date(task.submissionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Oct 24, 2024"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50">
              <div className="w-12 h-12 rounded-xl bg-white text-sky-600 flex items-center justify-center shadow-xs border border-sky-100">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Max Marks</p>
                <p className="text-sm font-extrabold text-stone-900">
                  {task?.totalPoints || "100"} pts
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Submission Area */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-lg">
              <Upload className="w-5 h-5" />
              <h2>Assignment Submission</h2>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,image/*,video/*,.doc,.docx"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
              className="hidden"
            />

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFileSelect(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-[1.5px] border-dashed border-stone-300 hover:border-indigo-400 bg-white rounded-3xl p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] relative overflow-hidden group"
            >
              {!selectedFile && !uploadedUrl && !uploadingFile ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm border border-indigo-100/50">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 mt-4">
                    <h3 className="font-bold text-lg text-stone-800">
                      Drag and drop your assignment file here
                    </h3>
                    <p className="text-sm text-stone-500 font-medium">
                      or click to browse your local storage
                    </p>
                  </div>
                  <div className="flex gap-6 text-xs font-bold text-stone-400 pt-6">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-stone-300" /> Supported: PDF, Image, Video</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-stone-300" /> Max Size: 500MB</span>
                  </div>
                </>
              ) : uploadingFile ? (
                <div className="space-y-3 w-full max-w-xs mx-auto py-8">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-stone-700">
                    Uploading file ({uploadProgress}%)...
                  </p>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 w-full text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm border border-emerald-100/50 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-lg">
                      {selectedFile?.name || "File selected"}
                    </p>
                    <p className="text-sm font-bold text-emerald-600 mt-1">
                      Ready to submit
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submission Notes */}
          <div className="space-y-3 pt-6">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Submission Notes (Optional)
            </label>
            <textarea
              value={notesForGuru}
              onChange={(e) => setNotesForGuru(e.target.value)}
              placeholder="Add any specific details you want your teacher to know about your practice session..."
              className="w-full h-32 p-5 rounded-2xl bg-white border border-stone-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none text-sm font-medium placeholder:text-stone-400 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.02)]"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-stone-200 border-dashed">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors text-sm w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingFile}
              className="px-10 py-3.5 rounded-xl font-bold text-white bg-[#8B1D2C] hover:bg-[#6c1622] disabled:opacity-50 transition-all active:scale-95 shadow-[0_4px_20px_-4px_rgba(139,29,44,0.4)] text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Submit Assignment <span className="text-lg leading-none mt-[-2px]">»</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-8 lg:pl-4">
          
          {/* Submission Guidelines */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-lg">
              <Lightbulb className="w-5 h-5 text-sky-500" />
              <h2>Submission Guidelines</h2>
            </div>
            
            <div className="space-y-6 pt-2 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-stone-100 -z-10" />
              
              <div className="flex gap-4 items-start relative bg-white/50">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="pt-1.5">
                  <h4 className="font-bold text-stone-900 text-[13px]">Optimal Lighting</h4>
                  <p className="text-[13px] text-stone-500 font-medium leading-relaxed mt-1">
                    Ensure the room is well-lit. Avoid recording against a bright window or backlight.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start relative bg-white/50">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="pt-1.5">
                  <h4 className="font-bold text-stone-900 text-[13px]">Full Body View</h4>
                  <p className="text-[13px] text-stone-500 font-medium leading-relaxed mt-1">
                    Position the camera to capture your entire form, from head to toes, to allow for posture evaluation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start relative bg-white/50">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="pt-1.5">
                  <h4 className="font-bold text-stone-900 text-[13px]">Clear Audio</h4>
                  <p className="text-[13px] text-stone-500 font-medium leading-relaxed mt-1">
                    Ensure your footwork sounds (Ghungroo) are clearly audible over any background music.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Video Card */}
          {task?.referenceFileUrl && (
            <div className="rounded-3xl overflow-hidden bg-stone-900 shadow-xl shadow-black/10 relative group">
              {/* Background preview */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                {(() => {
                  const url = getFullVideoUrl(task.referenceFileUrl);
                  const lowerUrl = url.toLowerCase();
                  if (lowerUrl.endsWith(".pdf")) return <div className="w-full h-full bg-stone-800" />;
                  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(lowerUrl) || (lowerUrl.includes("/image/upload/") && !lowerUrl.endsWith(".mp4"))) {
                    /* eslint-disable-next-line @next/next/no-img-element */
                    return <img src={url} className="w-full h-full object-cover" alt="" />;
                  }
                  return (
                    <video src={url} className="w-full h-full object-cover" muted playsInline />
                  );
                })()}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />
              
              <div className="relative p-6 pt-32 space-y-6">
                <div>
                  <p className="text-[10px] font-extrabold tracking-widest text-stone-400 uppercase">Reference Video</p>
                  <h3 className="text-xl font-bold text-white mt-1 leading-snug">
                    {task.referenceVideoTitle || "Laya Variations Guide"}
                  </h3>
                </div>
                
                <a
                  href={getFullVideoUrl(task.referenceFileUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-[#8B1D2C] hover:bg-stone-50 font-bold text-sm rounded-xl transition-all shadow-sm group-hover:shadow-md"
                >
                  <PlayCircle className="w-5 h-5" />
                  Watch Tutorial
                </a>
              </div>
            </div>
          )}

          {/* Support Box */}
          <div className="bg-indigo-50/50 rounded-2xl p-6 mt-8 flex gap-4 border border-indigo-100/50">
            <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-stone-900">Need help with uploading?</p>
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:underline mt-1 inline-block">
                Contact IT Support
              </a>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
