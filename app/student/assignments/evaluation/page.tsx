"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import {
  RotateCcw,
  ListChecks,
  Quote,
  MessageSquare,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface EvaluationCriteriaItem {
  label: string;
  score: number;
}

interface SubmissionRecord {
  id: string;
  taskId?: string | null;
  AssignmentTitle: string;
  studentName: string;
  studentAvatar?: string | null;
  studentBatch?: string | null;
  courseAndBatch?: string | null;
  fileUrl: string;
  status: "PENDING" | "REVIEWED" | "NEEDS_IMPROVEMENT";
  marks?: number | null;
  scoreBreakdown?: EvaluationCriteriaItem[] | null;
  feedbackNotes?: string | null;
  correctionNotes?: string[] | null;
  submissionDate?: string;
  updatedAt?: string;
}

const getFullAssignmentUrl = (rawUrl?: string): string => {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("blob:")) {
    return rawUrl;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const backendRoot = apiBase.replace(/\/api\/v1\/?$/, "");
  const cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${backendRoot}${cleanPath}`;
};

const formatDisplayTitle = (rawTitle?: string): string => {
  if (!rawTitle) return "Tatkar Footwork Practice";
  const clean = rawTitle.trim();
  const lower = clean.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm") || /^\d{5,}/.test(clean)) {
    return "Tatkar Footwork Practice";
  }
  return clean;
};

export default function StudentTaskEvaluationPage() {
  const [data, setData] = useState<SubmissionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const searchParams = new URLSearchParams(window.location.search);
        const subId = searchParams.get("submissionId");

        const savedUserStr = localStorage.getItem("kathak_student_user") || localStorage.getItem("kathak_token");
        let studentId = "student-me";
        if (savedUserStr) {
          try {
            const u = JSON.parse(savedUserStr);
            if (u.id) studentId = u.id;
          } catch {}
        }

        const res = await apiRequest<{ data?: any[] }>(`/Assignment/student/${studentId}/history`);
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const list = res.data;
          const matched = subId ? list.find((item: any) => item.id === subId) || list[0] : list[0];

          let corrArr: string[] = [];
          if (Array.isArray(matched.correctionNotes)) {
            corrArr = matched.correctionNotes.filter(Boolean);
          } else if (typeof matched.correctionNotes === "string" && matched.correctionNotes.trim()) {
            corrArr = [matched.correctionNotes];
          }

          let parsedBreakdown: EvaluationCriteriaItem[] | null = null;
          if (Array.isArray(matched.scoreBreakdown)) {
            parsedBreakdown = matched.scoreBreakdown;
          } else if (matched.rubric) {
            try {
              parsedBreakdown = typeof matched.rubric === "string" ? JSON.parse(matched.rubric) : matched.rubric;
            } catch {}
          }

          setData({
            id: matched.id,
            taskId: matched.taskId,
            AssignmentTitle: matched.AssignmentTitle || "Practice Submission",
            studentName: matched.studentName || "Student",
            studentAvatar: matched.studentAvatar,
            studentBatch: matched.studentBatch || "Kathak Batch",
            courseAndBatch: matched.courseAndBatch || matched.studentBatch || "Kathak Rhythm",
            fileUrl: matched.fileUrl || "",
            status: matched.status || "PENDING",
            marks: matched.marks !== undefined && matched.marks !== null ? matched.marks : null,
            scoreBreakdown: parsedBreakdown,
            feedbackNotes: matched.feedbackNotes || null,
            correctionNotes: corrArr,
            submissionDate: matched.submissionDate
              ? new Date(matched.submissionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
              : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            updatedAt: matched.updatedAt
              ? new Date(matched.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "Pending Evaluation",
          });
        }
      } catch (err) {
        console.error("Fetch Evaluation History Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B1D2C]" />
        <span className="text-xs font-semibold text-stone-500">Loading submission details...</span>
      </div>
    );
  }

  const isEvaluated = data?.status === "REVIEWED" && data?.marks !== null && data?.marks !== undefined;
  const numericScore100 = isEvaluated && data?.marks ? (data.marks <= 10 ? Math.round(data.marks * 10) : Math.round(data.marks)) : null;
  const AssignmentSourceUrl = getFullAssignmentUrl(data?.fileUrl);

  // Dynamic Rubric Evaluation Items (Fallback to dynamic criteria if set by teacher)
  const evalBreakdown: EvaluationCriteriaItem[] = data?.scoreBreakdown && data.scoreBreakdown.length > 0
    ? data.scoreBreakdown
    : isEvaluated
    ? [
        { label: "Performance Score", score: numericScore100 || 85 }
      ]
    : [];

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 font-sans pb-20 text-stone-800 animate-in fade-in duration-300">
      
      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-stone-400 uppercase tracking-wider">
            <Link href="/student/assignments" className="hover:text-[#8B1D2C] transition-colors">
              ASSIGNMENTS
            </Link>
            <span>›</span>
            <span className="text-[#8B1D2C] font-extrabold">TASK EVALUATION</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {formatDisplayTitle(data?.AssignmentTitle)}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {data?.status === "PENDING" ? (
              <span className="bg-purple-100/90 text-purple-800 border border-purple-200 px-3 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-purple-600" />
                • SUBMITTED - PENDING REVIEW
              </span>
            ) : data?.status === "NEEDS_IMPROVEMENT" ? (
              <span className="bg-rose-100 text-rose-800 border border-rose-200 px-3 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider">
                • NEEDS IMPROVEMENT
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                • EVALUATED
              </span>
            )}

            <span className="text-stone-500 font-semibold">
              Course: {data?.courseAndBatch || "Kathak Practice"}
            </span>
          </div>
        </div>

        {/* TOP RIGHT ACTION: Practice Again */}
        <div className="shrink-0">
          <Link
            href="/student/assignments/upload"
            className="bg-[#8B1D2C] hover:bg-[#701522] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </Link>
        </div>
      </div>

      {/* TOP GRID: Real Assignment Player Left | Overall Performance Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* REAL Assignment PLAYER CONTAINER (8 cols) */}
        <div className="lg:col-span-8 bg-black rounded-[28px] overflow-hidden relative shadow-lg min-h-[380px] border border-stone-800 flex flex-col justify-between p-2 text-white">
          {AssignmentSourceUrl ? (
            <div className="w-full h-full flex flex-col justify-between min-h-[360px] relative">
              <video
                src={AssignmentSourceUrl}
                controls
                preload="metadata"
                playsInline
                className="w-full h-full max-h-[460px] object-contain rounded-2xl bg-black"
              />
              <div className="p-3 bg-stone-900/90 rounded-xl mt-2 flex items-center justify-between text-xs text-stone-300 font-mono">
                <span>TASK: {formatDisplayTitle(data?.AssignmentTitle)}</span>
                <span className="text-emerald-400 font-bold">SUBMITTED Assignment</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full py-20 flex flex-col items-center justify-center space-y-2 text-stone-400">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <span className="text-xs font-semibold">No Assignment file available for playback.</span>
            </div>
          )}
        </div>

        {/* OVERALL PERFORMANCE CARD (4 cols - Solid Maroon Red Background) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#800020] via-[#8B1D2C] to-[#600018] rounded-[28px] p-8 text-white flex flex-col justify-between space-y-6 shadow-md border border-rose-950">
          
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-200 block">
              OVERALL PERFORMANCE
            </span>

            {isEvaluated ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    {data?.marks ? (data.marks <= 10 ? Math.round(data.marks * 10) : Math.round(data.marks)) : 100}
                  </span>
                  <span className="text-xl font-bold text-rose-200">/ 100</span>
                </div>

                <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white">
                  Evaluated Score
                </span>
              </>
            ) : (
              <>
                <div className="space-y-1 py-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">AWAITING REVIEW</span>
                  <p className="text-xs text-rose-200 font-medium">Your Guru is reviewing this submission</p>
                </div>

                <span className="inline-block bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-rose-100">
                  Pending Evaluation
                </span>
              </>
            )}
          </div>

          {/* DYNAMIC EVALUATION CRITERIA / RUBRIC BARS */}
          {isEvaluated ? (
            <div className="space-y-4 pt-2 text-xs">
              {evalBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-bold mb-1.5 uppercase">
                    <span className="text-rose-100">{item.label}</span>
                    <span className="text-white font-extrabold">{item.score}/10</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, item.score * 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center space-y-1.5">
              <Clock className="w-5 h-5 text-rose-200 mx-auto" />
              <p className="text-xs font-bold text-white">Evaluation Parameters Pending</p>
              <p className="text-[11px] text-rose-200 font-medium leading-relaxed">
                Guru evaluation criteria will be populated here once reviewed.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* MIDDLE GRID: Guru's Comprehensive Review Left | Correction Notes Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: GURU'S COMPREHENSIVE REVIEW (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <h3 className="font-bold text-base text-stone-900">Guru's Comprehensive Review</h3>

          {data?.feedbackNotes ? (
            <div className="relative pl-6 border-l-4 border-[#8B1D2C] italic text-stone-700 text-xs sm:text-sm leading-relaxed space-y-2">
              <Quote className="w-6 h-6 text-rose-200 absolute -top-3 left-2 -z-10 opacity-50" />
              <p className="font-medium text-stone-800">
                "{data.feedbackNotes}"
              </p>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 text-center space-y-2">
              <Clock className="w-7 h-7 text-amber-500 mx-auto" />
              <p className="font-bold text-stone-800 text-sm">Submission Awaiting Evaluation</p>
              <p className="text-xs text-stone-500 font-medium max-w-md mx-auto">
                Your practice Assignment "{formatDisplayTitle(data?.AssignmentTitle)}" has been received successfully and is currently in queue for Guru review.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-4 text-xs font-semibold text-stone-500">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-stone-400 block tracking-wider">DATE SUBMITTED</span>
              <span className="text-stone-900 font-bold">{data?.submissionDate || "Aug 6, 2026"}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-stone-400 block tracking-wider">EVALUATION DATE</span>
              <span className="text-stone-900 font-bold">
                {isEvaluated ? data?.updatedAt || "Evaluated" : "Pending Evaluation"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORRECTION NOTES & REVIEWER (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CORRECTION NOTES CARD */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#8B1D2C]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500">CORRECTION NOTES</h3>
            </div>

            <div className="space-y-3">
              {data?.correctionNotes && data.correctionNotes.length > 0 ? (
                data.correctionNotes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3 text-xs font-semibold text-stone-700">
                    <span className="w-6 h-6 rounded-full bg-rose-50 text-[#8B1D2C] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      0{index + 1}
                    </span>
                    <p className="text-stone-800 leading-snug">{note}</p>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-stone-400 text-xs font-medium italic">
                  Correction notes will be added by your Guru during evaluation.
                </div>
              )}
            </div>
          </div>

          {/* REVIEWED BY CARD */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">REVIEWED BY</span>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Ananya.png"
                  alt="Faculty"
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Guru Faculty</h4>
                  <p className="text-[10px] text-stone-500 font-semibold">Senior Kathak Instructor</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-400">
                <MessageSquare className="w-4 h-4 hover:text-[#8B1D2C] cursor-pointer" />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
