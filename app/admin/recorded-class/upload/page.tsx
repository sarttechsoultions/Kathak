"use client";

import React, { useState, useEffect } from "react";
import {
    Upload,
    BookOpen,
    ChevronDown,
    SlidersHorizontal,
    FileText,
    Music,
    ArrowLeft,
    Info,
    X,
    FileVideo,
    Trash2,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

interface CourseItem {
    id: string;
    title: string;
}

interface BatchItem {
    id: string;
    name: string;
    courseId?: string;
}

interface ResourceItem {
    name: string;
    size: string;
    type: "pdf" | "music";
    url: string; 
}

export default function AdminUploadRecordedClassPage() {
    const router = useRouter();

    // Dynamic Data States
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [batches, setBatches] = useState<BatchItem[]>([]);
    const [isLoadingPrereqs, setIsLoadingPrereqs] = useState(true);

    // Form States
    const [sessionTitle, setSessionTitle] = useState("");
    const [sessionDescription, setSessionDescription] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [sessionLevel, setSessionLevel] = useState("Intermediate (L2)");
    const [topicTags, setTopicTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    // Video File State
    const [videoFileUrl, setVideoFileUrl] = useState("");
    const [uploadedFileName, setUploadedFileName] = useState("No file chosen");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [uploadedVideoId, setUploadedVideoId] = useState("");
    const [videoThumbnailUrl, setVideoThumbnailUrl] = useState("");
    const [videoDuration, setVideoDuration] = useState("");  

    // Learning Resources State
    const [resources, setResources] = useState<ResourceItem[]>([]);


    // Resource upload progress
    const [isUploadingResource, setIsUploadingResource] = useState(false);
    const [resourceUploadProgress, setResourceUploadProgress] = useState(0);
    // Toggles
    const [makePublic, setMakePublic] = useState(true);
    const [allowDownloads, setAllowDownloads] = useState(true);
    const [notifyStudents, setNotifyStudents] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPrerequisites = async () => {
            try {
                const [courseRes, batchRes] = await Promise.all([
                    apiRequest<{ data?: { courses?: CourseItem[] } }>(ENDPOINTS.COURSES || "/courses"),
                    apiRequest<{ data?: { batches?: BatchItem[] } }>(ENDPOINTS.ADMIN_BATCHES || "/admin/batches")
                ]);

                if (courseRes.data?.courses && courseRes.data.courses.length > 0) {
                    setCourses(courseRes.data.courses);
                    setSelectedCourseId(courseRes.data.courses[0].id);
                }
                if (batchRes.data?.batches) {
                    setBatches(batchRes.data.batches);
                    if (batchRes.data.batches.length > 0) {
                        setSelectedBatchId(batchRes.data.batches[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to load courses/batches", err);
            } finally {
                setIsLoadingPrereqs(false);
            }
        };
        fetchPrerequisites();
    }, []);

    // Professional Video Upload

    const getVideoDuration = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const totalSeconds = Math.floor(video.duration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      resolve(`${minutes}m ${seconds}s`);
    };
    video.onerror = () => resolve("");
    video.src = URL.createObjectURL(file);
  });
};

    const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFileName(file.name);
        setIsUploadingFile(true);
        setUploadProgress(25);
          const duration = await getVideoDuration(file);
  setVideoDuration(duration);
        try {
            const formData = new FormData();
            formData.append("video", file);

            const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api/v1";
            setUploadProgress(60);

            const res = await fetch(`${base}/upload/video`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await res.json();
            setUploadProgress(100);

            if (!res.ok || data.status === "error") {
                throw new Error(data.message || "Failed to upload video file.");
            }

            const fileUrl = data.data?.url || data.data?.iframeUrl || data.data?.fileUrl || data.data?.secure_url || data.url;
            const videoId = data.data?.videoId || "";
            const thumbUrl = data.data?.thumbnailUrl || "";

            setVideoFileUrl(fileUrl);
            setUploadedVideoId(videoId);
            setVideoThumbnailUrl(thumbUrl);
        } catch (err: unknown) {
            console.error(err);
            const msg = err instanceof Error ? err.message : "Video upload failed.";
            alert(msg);
            setUploadedFileName("No file chosen");
            setUploadProgress(0);
            setVideoFileUrl("");
            setUploadedVideoId("");
            setVideoThumbnailUrl("");
        } finally {
            setIsUploadingFile(false);
        }
    };

    // Professional Resource File Upload Handler
   const handleResourceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  e.target.value = "";

  const isMusic = file.type.startsWith("audio/") || file.name.endsWith(".mp3");
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";

  setIsUploadingResource(true);
  setResourceUploadProgress(20);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api/v1";
    setResourceUploadProgress(50);

    const res = await fetch(`${base}/upload/image`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    setResourceUploadProgress(100);

    if (!res.ok || data.status === "error") {
      throw new Error(data.message || "Failed to upload resource.");
    }

    const fileUrl = data.data?.url || data.data?.fileUrl || data.url || "";

    setResources((prev) => [
      ...prev,
      {
        name: file.name,
        size: fileSizeMB,
        type: isMusic ? "music" : "pdf",
        url: fileUrl,   // 👈 ab save ho raha hai
      },
    ]);
  } catch (err: unknown) {
    console.error(err);
    const msg = err instanceof Error ? err.message : "Resource upload failed.";
    alert(msg);
  } finally {
    setIsUploadingResource(false);
    setTimeout(() => setResourceUploadProgress(0), 800);
  }
};

    const handleAddTag = () => {
        if (tagInput.trim() && !topicTags.includes(tagInput.trim())) {
            setTopicTags([...topicTags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTopicTags(topicTags.filter((t) => t !== tag));
    };

    const handleRemoveResource = (index: number) => {
        setResources(resources.filter((_, i) => i !== index));
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionTitle.trim()) {
            alert("Please enter a session title.");
            return;
        }
        if (!videoFileUrl) {
            alert("Please wait for the video file to finish uploading.");
            return;
        }

        setIsSubmitting(true);

        try {
            await apiRequest(ENDPOINTS.ADMIN_RECORDED_CLASSES || "/admin/recorded-classes", {
                method: "POST",
                body: JSON.stringify({
                    title: sessionTitle.trim(),
                    description: sessionDescription.trim() || null,
                    videoUrl: videoFileUrl,
                    thumbnail: videoThumbnailUrl || null,
                    courseId: selectedCourseId || null,
                    batchId: selectedBatchId || null,
                    duration: videoDuration || null,
                    isPublic: makePublic,
                    isDownloadable: allowDownloads,
                    notifyStudents: notifyStudents,
                    tags: topicTags,
                    resources: resources.map(r => r.name),
                }),
            });

            openThemeSuccess(`Session "${sessionTitle}" published successfully!`, "Upload Complete");
            router.push("/admin/recorded-class");
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Failed to upload session.";
            alert(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1250px] mx-auto">

            <button
                onClick={() => router.push("/admin/recorded-class")}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Recorded Class Archives</span>
            </button>

            <form onSubmit={handleUploadSubmit} className="flex flex-col lg:flex-row items-start gap-8">

                {/* LEFT COLUMN CARDS */}
                <div className="flex-1 w-full space-y-6">

                    {/* CARD 1: Session Media */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                        <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                            <FileVideo className="w-4.5 h-4.5 text-[#9E0C25]" />
                            <span>Session Media</span>
                        </h3>

                        <div className="relative border-2 border-dashed border-stone-300 bg-stone-50/80 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#9E0C25] transition-colors cursor-pointer overflow-hidden">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            />
                            <div className="w-14 h-14 rounded-full bg-rose-50 text-[#9E0C25] flex items-center justify-center shadow-xs">
                                <Upload className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-stone-900">Drag and drop video files</h4>
                                <p className="text-xs text-stone-400 font-medium mt-0.5">MP4, MOV, or WEBM up to 2GB</p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <span className="px-5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs shadow-2xs">
                                    {isUploadingFile ? "Uploading Video..." : "Browse Files"}
                                </span>
                            </div>
                        </div>

                        {(isUploadingFile || uploadProgress > 0) && (
                            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                                    <span className="truncate">{uploadedFileName}</span>
                                    <span className="text-[#9E0C25]">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                                    <div style={{ width: `${uploadProgress}%` }} className="bg-[#9E0C25] h-full rounded-full transition-all duration-300" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CARD 2: Session Details */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                        <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                            <Info className="w-4.5 h-4.5 text-[#9E0C25]" />
                            <span>Session Details</span>
                        </h3>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-stone-700">SESSION TITLE</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Kathak Tatkar & Rhythm Masterclass"
                                    value={sessionTitle}
                                    onChange={(e) => setSessionTitle(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-stone-700">DESCRIPTION</label>
                                <textarea
                                    rows={4}
                                    placeholder="Detailed instructional lesson for this session..."
                                    value={sessionDescription}
                                    onChange={(e) => setSessionDescription(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-stone-700">RECORDING DATE</label>
                                <input
                                    type="date"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: Metadata & Mapping */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                        <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                            <SlidersHorizontal className="w-4.5 h-4.5 text-[#9E0C25]" />
                            <span>Metadata &amp; Mapping</span>
                        </h3>

                        {isLoadingPrereqs ? (
                            <div className="py-4 text-xs text-stone-400 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-[#9E0C25]" /> Loading courses & batches...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-stone-700">COURSE</label>
                                    <div className="relative">
                                        <select
                                            value={selectedCourseId}
                                            onChange={(e) => setSelectedCourseId(e.target.value)}
                                            className="w-full h-11 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none focus:bg-white focus:border-[#9E0C25] focus:outline-none cursor-pointer"
                                        >
                                            {courses.map((c) => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-stone-700">ASSIGN BATCH</label>
                                    <div className="relative">
                                        <select
                                            value={selectedBatchId}
                                            onChange={(e) => setSelectedBatchId(e.target.value)}
                                            className="w-full h-11 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none focus:bg-white focus:border-[#9E0C25] focus:outline-none cursor-pointer"
                                        >
                                            <option value="">-- General / All Batches --</option>
                                            {batches.map((b) => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-stone-700">TOPIC TAGS</label>
                                    <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/80 rounded-xl p-1.5">
                                        <input
                                            type="text"
                                            placeholder="Add Tag..."
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                                            className="w-full h-8 px-2 bg-transparent text-xs font-semibold focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {topicTags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-[#9E0C25] border border-rose-200 text-[10.5px] font-extrabold">
                                                {tag}
                                                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-stone-900 cursor-pointer"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CARD 4: Professional Learning Resources */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                        <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                            <BookOpen className="w-4.5 h-4.5 text-[#9E0C25]" />
                            <span>Learning Resources</span>
                        </h3>

                        <input
                            type="file"
                            id="resourceFilePicker"
                            onChange={handleResourceFileChange}
                            accept=".pdf,.mp3,.wav,.docx,.zip"
                            className="hidden"
                        />

                        <div
                            onClick={() => document.getElementById("resourceFilePicker")?.click()}
                            className="border-2 border-dashed border-stone-300 bg-stone-50/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-3 hover:border-[#9E0C25] transition-colors cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#9E0C25] flex items-center justify-center shadow-xs">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-stone-900">Drag and drop resource files</h4>
                                <p className="text-xs text-stone-400 font-medium mt-0.5">PDF notes, audio tracks, or documents up to 50MB</p>
                            </div>
                            <span className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs shadow-2xs">
                                Browse Files
                            </span>
                        </div>


                        {/* Resource Upload Progress */}
                        {(isUploadingResource || resourceUploadProgress > 0) && (
                            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                                    <span>Uploading resource...</span>
                                    <span className="text-[#9E0C25]">{resourceUploadProgress}%</span>
                                </div>
                                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${resourceUploadProgress}%` }}
                                        className="bg-[#9E0C25] h-full rounded-full transition-all duration-300"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {resources.map((res, index) => (
                                <div key={index} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${res.type === 'music' ? 'bg-purple-100 text-purple-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {res.type === 'music' ? <Music className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-xs text-stone-900">{res.name}</h5>
                                            <p className="text-[10px] text-stone-400 font-medium">{res.size} • Attached Resource</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveResource(index)} className="p-1.5 text-stone-400 hover:text-rose-600 cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN STICKY CARDS */}
                <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-[88px]">

                    {/* LIVE PREVIEW CARD */}
                    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">LIVE PREVIEW</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9.5px] font-extrabold uppercase">DRAFT PREVIEW</span>
                        </div>

                        <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden shadow-sm flex items-center justify-center">
                            {videoFileUrl ? (
                                videoFileUrl.includes("iframe") ||
                                    videoFileUrl.includes("mediadelivery") ||
                                    videoFileUrl.includes("bunny") ? (
                                    <iframe
                                        src={videoFileUrl}
                                        className="w-full h-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        src={videoFileUrl}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                )
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-950">
                                    <span className="text-white text-[11px] font-bold bg-black/60 px-3 py-1 rounded-full">
                                        {isUploadingFile ? "Uploading Video..." : "Upload Video to Preview"}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded bg-rose-50 text-[#9E0C25] text-[9px] font-extrabold uppercase">RECORDING</span>
                                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[9px] font-extrabold uppercase">KATHAK</span>
                            </div>
                            <h4 className="font-bold text-sm text-stone-900 leading-snug">
                                {sessionTitle.trim() ? sessionTitle : "Intro to Kathak Tatkar & Rhythm"}
                            </h4>
                            <p className="text-xs text-stone-500 font-medium leading-relaxed line-clamp-3 break-words">
                                {sessionDescription.trim()
                                    ? sessionDescription
                                    : "An introductory session covering the fundamental feet & rhythmic variations."}
                            </p>
                        </div>
                    </div>

                    {/* VISIBILITY CONTROLS CARD */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
                        <h4 className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">VISIBILITY CONTROLS</h4>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-xs font-bold text-stone-900">Make Public</span>
                                    <span className="block text-[10.5px] text-stone-400 font-medium">Visible in catalog</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMakePublic(!makePublic)}
                                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${makePublic ? "bg-emerald-500" : "bg-stone-300"
                                        }`}
                                >
                                    <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${makePublic ? "right-0.5" : "left-0.5"
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-xs font-bold text-stone-900">Allow Downloads</span>
                                    <span className="block text-[10.5px] text-stone-400 font-medium">Offline student access</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAllowDownloads(!allowDownloads)}
                                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${allowDownloads ? "bg-emerald-500" : "bg-stone-300"
                                        }`}
                                >
                                    <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${allowDownloads ? "right-0.5" : "left-0.5"
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-xs font-bold text-stone-900">Notify Students</span>
                                    <span className="block text-[10.5px] text-stone-400 font-medium">Alert enrolled members</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setNotifyStudents(!notifyStudents)}
                                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${notifyStudents ? "bg-emerald-500" : "bg-stone-300"
                                        }`}
                                >
                                    <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${notifyStudents ? "right-0.5" : "left-0.5"
                                        }`} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving..." : "Save & Publish Session"}
                            </button>
                        </div>
                    </div>

                </div>

            </form>
        </div>
    );
}