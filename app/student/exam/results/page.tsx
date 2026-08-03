"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  CheckCircle2,
  MessageSquare,
  ChevronLeft,
  Loader2,
  Award,
  Clock,
  Check,
  X,
  FileText,
  Star,
  Zap,
  TrendingUp,
  Percent,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function StudentExamResultsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchResult = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get("id");

        if (id) {
          const res = await apiRequest(`/student/exams/${id}`);
          if (isMounted && res?.data) {
            setData(res.data);
          }
        } else {
          const res = await apiRequest("/student/exams");
          if (isMounted && res?.data?.exams && res.data.exams.length > 0) {
            setData(res.data.exams[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch exam result:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResult();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#900C27]" />
        <span className="text-xs font-semibold text-slate-500">Loading performance report...</span>
      </div>
    );
  }

  let feedbackText = "Your exam has been submitted successfully! Detailed feedback and criteria breakdown will be published once evaluated by your instructor.";
  let studentAnswersObj: Record<string, any> = {};
  let criteriaParts: { name: string; score: number }[] = [];
  let evaluationPointers: string[] = [];

  const rawFeedback = data?.submission?.feedback || data?.feedback || data?.submission?.notes || "";

  if (rawFeedback) {
    if (typeof rawFeedback === "string" && (rawFeedback.trim().startsWith("{") || rawFeedback.trim().startsWith("["))) {
      try {
        const parsed = JSON.parse(rawFeedback);
        if (parsed.answers) studentAnswersObj = parsed.answers;
        if (parsed.criteriaParts) criteriaParts = parsed.criteriaParts;
        if (parsed.pointers) evaluationPointers = parsed.pointers;

        if (parsed.comment || parsed.feedback) {
          feedbackText = parsed.comment || parsed.feedback;
        } else if (parsed.notes && parsed.notes !== "Exam completed and submitted by student.") {
          feedbackText = parsed.notes;
        }
      } catch {
        feedbackText = rawFeedback;
      }
    } else {
      feedbackText = rawFeedback;
    }
  }

  const questionsList: any[] = data?.questions || [];

  // Calculate Correct Answers & Percentage
  let correctCount = 0;
  questionsList.forEach((q) => {
    const selectedOptId = studentAnswersObj[q.id];
    if (selectedOptId && Array.isArray(q.options)) {
      const correctOpt = q.options.find((o: any) => o.isCorrect);
      if (correctOpt && correctOpt.id === selectedOptId) {
        correctCount++;
      }
    }
  });

  const totalQuestions = questionsList.length;
  const rawGrade = data?.submission?.grade || data?.score?.split("/")[0];
  const percentageScore = rawGrade
    ? parseInt(rawGrade, 10) || 0
    : totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const isEvaluated = Boolean(data?.submission?.status === "GRADED" || rawGrade);
  const statusStr = percentageScore >= (data?.passingMark || 40) ? "Passed" : "Needs Review";

  return (
    <div className="space-y-8 font-sans pb-16 max-w-[1250px] mx-auto">
      
      {/* 1. HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div className="space-y-1.5">
          <Link
            href="/student/exam"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-[#900C27] transition-colors mb-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Examinations</span>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1B24] tracking-tight">
              {data?.title || "Exam Results & Performance Report"}
            </h1>
            <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-mono font-bold">
              {data?.examCode ? `Code: ${data.examCode}` : `Batch: ${data?.batchCourse || "Kathak"}`}
            </span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Official PDF</span>
        </button>
      </div>

      {/* 2. TOP 4 RESULT METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: PERCENTAGE SCORE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-2">
          <span className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-rose-700" />
            <span>OVERALL PERCENTAGE</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#900C27]">{percentageScore}%</span>
            <span className="text-xs font-bold text-stone-400">Score Percentage</span>
          </div>
        </div>

        {/* Card 2: CORRECT ANSWERS COUNT */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-2">
          <span className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>CORRECT ANSWERS</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-600">{correctCount}</span>
            <span className="text-xl font-bold text-stone-400">/ {totalQuestions} Correct</span>
          </div>
        </div>

        {/* Card 3: PERFORMANCE GRADE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-2">
          <span className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider block">PERFORMANCE TIER</span>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span className="text-2xl font-extrabold text-stone-900">
              {percentageScore >= 85 ? "Distinction (A+)" : percentageScore >= 65 ? "Merit (B)" : percentageScore >= 40 ? "Pass (C)" : "Needs Work"}
            </span>
          </div>
        </div>

        {/* Card 4: STATUS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-2">
          <span className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider block">STATUS</span>
          <div className="space-y-1">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              percentageScore >= (data?.passingMark || 40)
                ? "bg-[#E6F7ED] text-[#22A05B]"
                : "bg-rose-100 text-rose-700"
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {statusStr}
            </span>
          </div>
        </div>

      </div>

      {/* 3. GURU'S REVIEW & CRITERIA BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / MAIN COLUMN: Teacher Feedback & Criteria */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TEACHER FEEDBACK CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#900C27] uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>Guru&apos;s Feedback &amp; Evaluation</span>
              </div>
              <span className="text-xs font-bold text-stone-400">Official Faculty Review</span>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 text-sm sm:text-base text-stone-800 font-serif italic leading-relaxed">
              &ldquo;{feedbackText}&rdquo;
            </div>
          </div>

          {/* CRITERIA BREAKDOWN */}
          {criteriaParts.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#900C27]" />
                <span>Evaluation Criteria Breakdown</span>
              </h3>

              <div className="space-y-4">
                {criteriaParts.map((part, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-stone-800">
                      <span>{part.name}</span>
                      <span className="text-[#900C27]">{part.score} / 100</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#900C27] transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, part.score))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAILED QUESTION REVIEW & CORRECT ANSWERS DISPLAY */}
          {questionsList.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1B1B24]">
                  Detailed Question Review &amp; Correct Answers
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {correctCount} / {totalQuestions} Questions Correct
                </span>
              </div>

              <div className="space-y-5">
                {questionsList.map((q: any, idx: number) => {
                  const selectedOptId = studentAnswersObj[q.id];
                  const correctOpt = Array.isArray(q.options)
                    ? q.options.find((o: any) => o.isCorrect)
                    : null;
                  const isUserCorrect = correctOpt && selectedOptId === correctOpt.id;

                  return (
                    <div key={q.id || idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
                      
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10.5px] font-extrabold text-[#900C27] uppercase tracking-wider">
                              QUESTION {idx + 1}
                            </span>
                            {selectedOptId ? (
                              isUserCorrect ? (
                                <span className="bg-[#E6F7ED] text-[#22A05B] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Correct (+{q.marks || 5} pts)
                                </span>
                              ) : (
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <X className="w-3 h-3" /> Incorrect (0 pts)
                                </span>
                              )
                            ) : (
                              <span className="bg-stone-100 text-stone-500 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                Not Answered
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-[#1B1B24] leading-relaxed pt-1">
                            {q.questionText}
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-lg shrink-0">
                          {q.marks || 5} Marks
                        </span>
                      </div>

                      {/* Media Attachment if present */}
                      {q.mediaUrl && (
                        <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl max-w-md">
                          {q.mediaType === "video" || q.mediaUrl.endsWith(".mp4") ? (
                            <video src={q.mediaUrl} controls className="max-h-48 w-full rounded-xl object-contain bg-black" />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={q.mediaUrl} alt="Question diagram" className="max-h-48 rounded-xl object-contain mx-auto" />
                          )}
                        </div>
                      )}

                      {/* Options & Correct Answer Display */}
                      {q.questionType === "Multiple Choice" && Array.isArray(q.options) && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider block">OPTIONS &amp; ANSWERS</span>
                          <div className="space-y-2">
                            {q.options.map((opt: any) => {
                              const isStudentChoice = selectedOptId === opt.id;
                              const isCorrectAnswer = opt.isCorrect;

                              return (
                                <div
                                  key={opt.id}
                                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                                    isCorrectAnswer
                                      ? "bg-[#E6F7ED] border-[#22A05B] text-emerald-950 font-bold"
                                      : isStudentChoice
                                      ? "bg-rose-50 border-rose-300 text-rose-950 font-bold"
                                      : "bg-white border-stone-200 text-stone-700"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      isCorrectAnswer
                                        ? "border-[#22A05B] bg-[#22A05B] text-white"
                                        : isStudentChoice
                                        ? "border-rose-600 bg-rose-600 text-white"
                                        : "border-stone-300"
                                    }`}>
                                      {isCorrectAnswer ? (
                                        <Check className="w-3 h-3 text-white" />
                                      ) : isStudentChoice ? (
                                        <X className="w-3 h-3 text-white" />
                                      ) : null}
                                    </div>
                                    <span>{opt.text}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {isStudentChoice && (
                                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                                        isCorrectAnswer ? "bg-emerald-200/80 text-emerald-900" : "bg-rose-200/80 text-rose-900"
                                      }`}>
                                        Your Choice
                                      </span>
                                    )}
                                    {isCorrectAnswer && (
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#22A05B] text-white px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Correct Answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Key Evaluation Pointers & Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* KEY EVALUATION POINTERS CARD */}
          {evaluationPointers.length > 0 && (
            <div className="bg-[#900C27] text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/20">
                <Star className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base text-white">Key Evaluation Pointers</h3>
              </div>

              <div className="space-y-3 text-xs text-white/90 font-medium">
                {evaluationPointers.map((pointer, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-300 mt-1.5 shrink-0" />
                    <p className="leading-relaxed">{pointer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCURACY & SCORE SUMMARY CARD */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">Performance Breakdown</h3>

            <div className="space-y-3 text-xs font-semibold text-stone-600 divide-y divide-stone-100">
              <div className="flex justify-between pt-1">
                <span>Correct Answers</span>
                <span className="font-bold text-emerald-700">{correctCount} of {totalQuestions}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Overall Percentage</span>
                <span className="font-bold text-[#900C27]">{percentageScore}%</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Passing Requirement</span>
                <span className="font-bold text-stone-900">{data?.passingMark || 60}%</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>Result Outcome</span>
                <span className={`font-bold ${percentageScore >= (data?.passingMark || 40) ? "text-emerald-600" : "text-rose-600"}`}>
                  {statusStr}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
