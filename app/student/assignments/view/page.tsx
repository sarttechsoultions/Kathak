"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface SubmissionViewData {
  id: string;
  name: string;
  typeTag: string;
  course: string;
  dueDate: string;
  status: "PENDING" | "SUBMITTED" | "EVALUATED";
  grade: string;
  feedback?: string;
  notes?: string;
  fileUrl?: string;
}

// Safely format video URLs (backend uploads, relative filenames, iframe embeds, cloud URLs, or fallback)
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
  } else if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://") && !cleanUrl.startsWith("blob:") && !cleanUrl.startsWith("data:")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const backendRoot = apiBase.replace(/\/api\/v1\/?$/, "");
    cleanUrl = `${backendRoot}/uploads/${cleanUrl.replace(/^\//, "")}`;
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

export default function StudentAssignmentViewPage() {
  const [data, setData] = useState<SubmissionViewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAssignmentView = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get("id");

        const res = await apiRequest("/student/assignments");
        if (isMounted && res?.data && Array.isArray(res.data.assignments)) {
          const list: any[] = res.data.assignments;
          const found = id ? list.find((item) => item.id === id) : list[0];

          if (found) {
            setData({
              id: found.id,
              name: found.name || "Practical Exercise",
              typeTag: found.typeTag || "Video Submission",
              course: found.course || "KATHAK",
              dueDate: found.dueDate || "Aug 01, 2026",
              status: found.status || "EVALUATED",
              grade: found.grade && found.grade !== "—" ? found.grade : "0/100",
              feedback: found.feedback || found.notes,
              notes: found.notes,
              fileUrl: found.fileUrl,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch assignment view details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAssignmentView();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#8C2329]" />
        <span className="text-xs font-semibold text-slate-500">Loading evaluation &amp; grade details...</span>
      </div>
    );
  }

  const rawScore = data?.grade?.split("/")[0] || "0";
  const numericScore = parseInt(rawScore, 10) || 0;

  // Pure dynamic data extraction from JSON feedback
  let displayComment = data?.feedback || data?.notes || "";
  let displayPointers: string[] = [];
  let displayParts: { name: string; score: number }[] = [];

  if (data?.feedback && data.feedback.startsWith("{")) {
    try {
      const obj = JSON.parse(data.feedback);
      if (obj.comment) displayComment = obj.comment;
      if (Array.isArray(obj.pointers)) {
        displayPointers = obj.pointers.filter((p: string) => p && p.trim() !== "");
      }
      if (Array.isArray(obj.criteriaParts)) {
        displayParts = obj.criteriaParts.map((cp: any) => ({
          name: cp.name || "Criterion",
          score: typeof cp.score === "number" ? cp.score : parseInt(cp.score || "0", 10) || 0,
        }));
      }
    } catch {
      // ignore
    }
  }

  const performanceLevel =
    numericScore >= 85
      ? "Distinction Level"
      : numericScore >= 65
      ? "Merit Level"
      : numericScore >= 40
      ? "Pass Level"
      : "Review Needed";

  return (
    <div className="w-full space-y-8 font-sans pb-16 text-slate-800">
      {/* BREADCRUMB & PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Link href="/student/assignments" className="hover:text-[#8C2329] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>MY ASSIGNMENTS</span>
            </Link>
            <span>›</span>
            <span className="text-[#8C2329] font-bold">TASK EVALUATION</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {data?.name || "Kathak Practice"}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className={`px-3 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider border ${
              data?.status === "EVALUATED"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-sky-50 text-sky-800 border-sky-200"
            }`}>
              • {data?.status || "EVALUATED"}
            </span>
            <span className="text-slate-500 font-semibold">
              Course: {data?.course || "HOBBY KATHAK BATCH"}
            </span>
          </div>
        </div>

        {/* TOP RIGHT ACTION: Practice Again */}
        <div className="shrink-0">
          <Link
            href={`/student/assignments/upload?id=${data?.id || ""}`}
            className="bg-[#8C2329] hover:bg-[#721c21] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </Link>
        </div>
      </div>

      {/* TOP GRID: Video Player Left | Overall Performance Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* VIDEO PLAYER CONTAINER (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[24px] overflow-hidden relative shadow-lg min-h-[340px] border border-slate-800 flex flex-col justify-between p-2">
          {(() => {
            const { isIframe, url } = formatVideoUrl(data?.fileUrl);

            if (isIframe) {
              return (
                <iframe
                  src={url}
                  className="w-full h-full min-h-[320px] rounded-2xl border-0"
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
                preload="auto"
                className="w-full h-full min-h-[320px] rounded-2xl object-contain"
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
                Your browser does not support video playback.
              </video>
            );
          })()}
        </div>

        {/* OVERALL PERFORMANCE CARD (4 cols - Dynamic Maroon Red Background) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#701623] via-[#8C2329] to-[#5C121A] rounded-[24px] p-6 text-white flex flex-col justify-between space-y-6 shadow-md border border-rose-950">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-200 block">
              OVERALL PERFORMANCE
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">{numericScore}</span>
              <span className="text-xl font-bold text-rose-200">/100</span>
            </div>

            <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-white">
              {performanceLevel}
            </span>
          </div>

          {/* Progress Breakdown Bars - Completely Dynamic from Backend Criteria Parts */}
          {displayParts.length > 0 && (
            <div className="space-y-3.5 pt-2 text-xs">
              {displayParts.map((part, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-rose-100 uppercase">{part.name}</span>
                    <span className="text-white font-bold">{part.score}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, part.score))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE GRID: Guru's Comprehensive Review Left | Dynamic Correction Notes Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT BOX: Guru's Comprehensive Review (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">
            Guru&apos;s Comprehensive Review &amp; Feedback
          </h3>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
            &ldquo;{displayComment || "No comment provided."}&rdquo;
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 gap-2">
            <div>
              <span className="block text-[10px] uppercase text-slate-400 font-bold">DUE DATE</span>
              <span className="text-slate-700 font-semibold">{data?.dueDate}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-400 font-bold">STATUS</span>
              <span className="text-emerald-600 font-bold">✓ {data?.status}</span>
            </div>
          </div>
        </div>

        {/* RIGHT BOX: Dynamic Correction Notes / Key Evaluation Pointers (5 cols) */}
        {displayPointers.length > 0 && (
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                KEY EVALUATION POINTERS
              </h3>
            </div>

            <div className="space-y-3 text-xs font-medium">
              {displayPointers.map((pointerText, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-[#8C2329] text-[11px] font-bold flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </span>
                  <p className="text-slate-700 leading-snug">{pointerText}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
