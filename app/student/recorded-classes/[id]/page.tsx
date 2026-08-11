"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Film,
  Calendar,
  BookOpen,
  Loader2,
  FileText,
  Music,
  X,
  Tag,
  Users,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Clock
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

interface RecordedClassDetail {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  createdAt: string;
  resources?: string[];
  tags?: string[];
  course?: { title: string };
  batch?: { name: string };
}

interface ParsedResource {
  name: string;
  url: string;
  type: "pdf" | "audio" | "other";
}

function parseResources(raw: string[] = []): ParsedResource[] {
  return raw.map((r) => {
    const [name, url] = r.split("|");
    const lower = (name || "").toLowerCase();
    const type: ParsedResource["type"] = lower.endsWith(".pdf")
      ? "pdf"
      : lower.endsWith(".mp3") || lower.endsWith(".wav")
      ? "audio"
      : "other";
    return { name: name || r, url: url || "", type };
  });
}

export default function StudentRecordedClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [classData, setClassData] = useState<RecordedClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "resources">("overview");
  const [viewerResource, setViewerResource] = useState<ParsedResource | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiRequest<{ data?: { classes?: RecordedClassDetail[]; recordedClass?: RecordedClassDetail } }>(
          `${ENDPOINTS.STUDENT_RECORDED_CLASSES || "/student/recorded-classes"}/${classId}`
        );
        
        let foundClass = null;

        if (res.data?.recordedClass) {
          foundClass = res.data.recordedClass;
        } else if (res.data?.classes) {
          foundClass = res.data.classes.find((c) => c.id === classId) || null;
        }

        if (foundClass) {
          setClassData(foundClass);

          // 🔥 SILENT BACKGROUND API CALL TO RECORD THE VIEW & ANALYTICS
          apiRequest(`${ENDPOINTS.STUDENT_RECORDED_CLASSES || "/student/recorded-classes"}/${classId}/view`, { 
            method: "POST" 
          }).catch((err) => console.error("Analytics tracking failed:", err));
        }

      } catch (err) {
        console.error("Failed to fetch recorded class detail", err);
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchDetail();
  }, [classId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4 bg-white/50 p-8 rounded-3xl border border-stone-100 shadow-sm backdrop-blur-sm">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-rose-100 animate-ping absolute inset-0 opacity-50"></div>
            <Loader2 className="w-12 h-12 animate-spin text-[#900C27] relative z-10" />
          </div>
          <span className="text-sm font-bold text-stone-500 tracking-wide uppercase">Preparing Masterclass...</span>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-5 bg-white rounded-[2rem] border border-stone-200/60 shadow-xl p-10 mt-12">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-[#900C27] flex items-center justify-center mx-auto shadow-inner">
          <Film className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-stone-900 mb-2">Class Not Found</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            The recorded session you are looking for might have been removed or you do not have access.
          </p>
        </div>
        <button
          onClick={() => router.push("/student/recorded-classes")}
          className="w-full py-3.5 rounded-2xl bg-[#900C27] hover:bg-[#780A20] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>
      </div>
    );
  }

  const resources = parseResources(classData.resources);

  return (
    <div className="space-y-8 max-w-[1100px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Floating Navigation */}
      <div className="sticky top-0 z-10 py-4 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:py-0 sm:static">
        <button
          onClick={() => router.push("/student/recorded-classes")}
          className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-stone-200/80 shadow-sm text-xs font-bold text-stone-600 hover:text-[#900C27] hover:border-rose-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Library</span>
        </button>
      </div>

      {/* Cinematic Video Player Container */}
      <div className="bg-black rounded-[0.5rem] overflow-hidden shadow-2xl shadow-[#900C27]/5 border border-stone-200/50 aspect-video w-full relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        {classData.videoUrl.includes("iframe") || classData.videoUrl.startsWith("http") ? (
          <iframe
            src={classData.videoUrl}
            className="w-full h-full border-0 relative z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={classData.videoUrl} controls className="w-full h-full object-cover relative z-10" />
        )}
      </div>

      {/* Main Content Dashboard */}
      <div className="bg-white rounded-[0.5rem] p-6 sm:p-10 border border-stone-200/60 shadow-lg shadow-stone-200/40 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-stone-100">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-[#900C27] text-[10px] font-extrabold uppercase tracking-wider border border-rose-100 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {classData.course?.title || "Masterclass"}
              </span>
              {classData.batch?.name && (
                <span className="px-3.5 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 border border-stone-200/80 shadow-xs">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  {classData.batch.name}
                </span>
              )}
            </div>
            {/* Clean Sans Font, NO Playfair */}
            <h1 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 leading-tight tracking-tight">
              {classData.title}
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-600 bg-stone-50 border border-stone-200/80 px-4 py-2.5 rounded-2xl shadow-xs w-full justify-center md:justify-start">
              <Calendar className="w-4 h-4 text-[#900C27]" />
              {new Date(classData.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-stone-600 bg-stone-50 border border-stone-200/80 px-4 py-2.5 rounded-2xl shadow-xs w-full justify-center md:justify-start">
              <Clock className="w-4 h-4 text-[#900C27]" />
              {classData.duration || "1 Hour Session"}
            </div>
          </div>
        </div>

        {/* Modern Segmented Control Tabs */}
        <div className="flex items-center bg-stone-100/80 p-1.5 rounded-2xl w-fit border border-stone-200/50">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === "overview"
                ? "bg-white text-[#900C27] shadow-sm ring-1 ring-stone-200/50"
                : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
            }`}
          >
            Session Overview
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activeTab === "resources"
                ? "bg-white text-[#900C27] shadow-sm ring-1 ring-stone-200/50"
                : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
            }`}
          >
            Learning Resources
            {resources.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${
                activeTab === "resources" ? "bg-rose-100 text-[#900C27]" : "bg-stone-200 text-stone-500"
              }`}>
                {resources.length}
              </span>
            )}
          </button>
        </div>

        {/* Dynamic Tab Content */}
        <div className="min-h-[250px]">
          {activeTab === "overview" ? (
            <div className="space-y-8 animate-in slide-in-from-left-4 fade-in duration-300">
              
              <div className="space-y-3">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-300" />
                  About This Session
                </h3>
                <div className="text-sm font-medium text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/50 p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-inner shadow-stone-100/50">
                  {classData.description || (
                    <span className="italic text-stone-400">No detailed description provided by the instructor.</span>
                  )}
                </div>
              </div>

              {classData.tags && classData.tags.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-4 h-4 text-stone-300" />
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {classData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[#900C27]/30 hover:shadow-md hover:-translate-y-0.5 text-stone-700 text-xs font-bold transition-all flex items-center gap-2 cursor-default"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#900C27]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
              {resources.length === 0 ? (
                <div className="py-16 text-center space-y-4 bg-stone-50/50 rounded-3xl border border-stone-200/60 border-dashed">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-stone-100">
                    <BookOpen className="w-8 h-8 text-stone-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">No resources available</h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      There are currently no notes, PDFs, or audio tracks attached to this specific masterclass.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => res.url && setViewerResource(res)}
                      disabled={!res.url}
                      className="group relative w-full flex items-center justify-between p-5 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all duration-300 text-left cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-50/0 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform duration-300 group-hover:scale-105 ${
                            res.type === "audio"
                              ? "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 border border-purple-100"
                              : "bg-gradient-to-br from-rose-100 to-rose-50 text-[#900C27] border border-rose-100"
                          }`}
                        >
                          {res.type === "audio" ? <Music className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                        </div>
                        <div className="pr-4">
                          <h5 className="font-bold text-sm text-stone-900 group-hover:text-[#900C27] transition-colors truncate max-w-[200px] sm:max-w-[280px]">
                            {res.name}
                          </h5>
                          <p className="text-xs text-stone-400 font-medium mt-1 flex items-center gap-1.5">
                            {res.url ? (
                              <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready to view</>
                            ) : (
                              "Preview unavailable"
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {res.url && (
                        <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center group-hover:bg-[#900C27] group-hover:text-white group-hover:border-[#900C27] group-hover:rotate-12 transition-all duration-300 shrink-0 relative z-10 shadow-sm">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cinematic Interactive Resource Viewer Modal */}
      {viewerResource && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setViewerResource(null)}
        >
          <div
            className="bg-white rounded-[2rem] w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/20 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-stone-100 shrink-0 bg-white relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                  viewerResource.type === 'audio' ? 'bg-purple-50 text-purple-600' : 'bg-rose-50 text-[#900C27]'
                }`}>
                  {viewerResource.type === 'audio' ? <Music className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-black text-base text-stone-900 truncate max-w-[200px] sm:max-w-md">{viewerResource.name}</h4>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Protected Resource Viewer</span>
                </div>
              </div>
              <button
                onClick={() => setViewerResource(null)}
                className="w-10 h-10 rounded-full bg-stone-100 hover:bg-rose-100 hover:text-[#900C27] text-stone-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-stone-100 overflow-hidden relative flex items-center justify-center">
              {viewerResource.type === "audio" ? (
                <div className="flex flex-col items-center justify-center h-full w-full p-8 bg-gradient-to-br from-stone-900 to-stone-950 relative">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
                  </div>

                  <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 space-y-8 text-center shadow-2xl relative z-10">
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                      <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-purple-400 rounded-full flex items-center justify-center shadow-xl relative z-10 ring-4 ring-purple-500/30">
                        <Music className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{viewerResource.name}</h3>
                      <p className="text-purple-200 text-xs mt-1">Audio Reference Track</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <audio controls controlsList="nodownload" className="w-full custom-audio-player">
                        <source src={viewerResource.url} />
                      </audio>
                    </div>
                  </div>
                </div>
              ) : viewerResource.type === "pdf" ? (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    viewerResource.url
                  )}&embedded=true`}
                  className="w-full h-full border-0 bg-white"
                  title={viewerResource.name}
                />
              ) : (
                <iframe src={viewerResource.url} className="w-full h-full border-0 bg-white" title={viewerResource.name} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}