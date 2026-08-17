"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react";
import { apiRequest } from "@/lib/api";

// ─── STRICT TYPESCRIPT INTERFACES ───
interface ExamOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface ExamQuestion {
  id: string;
  questionText?: string;
  text?: string;
  questionType?: string;
  options?: ExamOption[];
  mediaUrl?: string;
  imageUrl?: string;
  marks?: number;
}

interface ResultData {
  id: string;
  examId: string;
  answersData: Record<string, string>;
  marksObtained: number;
  status: "PASS" | "FAIL" | "PENDING" | "GRADED" | string;
  grade?: string | null;
  feedback?: string | null;
  submittedAt: string;
  exam: {
    title: string;
    type: string;
    totalMarks: number;
    passingMarks: number;
    date: string;
    questionsData: ExamQuestion[];
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  
  // Handled safely depending on your folder structure ([id] vs [resultId])
  const resultId = (params.id || params.resultId) as string;

  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ data?: { result?: ResultData } }>(
          `/student/exam/result/${resultId}`
        );
        if (res.data?.result) {
          setResult(res.data.result);
        } else {
          setLoadError("Result not found.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load result.";
        setLoadError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (resultId) fetchResult();
  }, [resultId]);

  const handleDownload = (): void => {
    window.print();
  };

  // ─── LOADING & ERROR STATES ───
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <span className="text-sm font-bold text-stone-400 animate-pulse">Loading result...</span>
      </div>
    );
  }

  if (loadError || !result) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-stone-800">{loadError || "Result not found."}</h2>
          <button
            onClick={() => router.push("/student/exam")}
            className="px-5 py-2.5 rounded-xl bg-[#9B3434] text-white text-xs font-bold transition-all hover:bg-[#7A2828]"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  const { exam } = result;
  const questions: ExamQuestion[] = exam.questionsData || [];

  // Dynamic Status Configuration
  let statusConfig = {
    label: "Passed",
    classes: "bg-[#ECFDF5] text-[#15803D] border-green-100",
    icon: <CheckCircle2 className="w-4 h-4 text-[#15803D]" />,
  };

  if (result.status === "FAIL") {
    statusConfig = {
      label: "Failed",
      classes: "bg-[#FEF2F2] text-[#DC2626] border-red-100",
      icon: <XCircle className="w-4 h-4 text-[#DC2626]" />,
    };
  } else if (result.status === "PENDING") {
    statusConfig = {
      label: "Awaiting Review",
      classes: "bg-[#FFFBEB] text-[#B45309] border-amber-100",
      icon: <Clock className="w-4 h-4 text-[#B45309]" />,
    };
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#0B1C30] p-6 sm:p-10">
      <div className="max-w-[1000px] mx-auto space-y-10 animate-in fade-in duration-300">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="font-sans font-bold text-[32px] tracking-[-0.32px] text-[#0B1C30]">
            Exam Results
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/student/exam")}
              className="px-6 py-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-[14px] font-bold transition-all shadow-sm"
            >
              Back to Exams
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9B3434] hover:bg-[#7A2828] text-white text-[14px] font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
          </div>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[800px]">
          
          {/* Card 1: Final Score */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-center">
            <p className="font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-wider mb-1">
              FINAL SCORE
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-[36px] text-[#9B3434] leading-none">
                {result.marksObtained}
              </span>
              <span className="font-sans font-bold text-[18px] text-stone-400">
                / {exam.totalMarks}
              </span>
            </div>
          </div>

          {/* Card 2: Percentile */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-center">
            <p className="font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-wider mb-1">
              PERCENTILE
            </p>
            <span className="font-sans font-bold text-[36px] text-[#9B3434] leading-none">
              —
            </span>
          </div>

          {/* Card 3: Status */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-center">
            <p className="font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-wider mb-2.5">
              STATUS
            </p>
            <div className="flex flex-col items-start gap-1.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[14px] font-semibold border ${statusConfig.classes}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
              <span className="font-inter text-[12px] text-[#464555] mt-1">
                Exam completed on<br />{formatDate(result.submittedAt)}
              </span>
            </div>
          </div>

        </div>

        {/* ================= DETAILED QUESTION REVIEW ================= */}
        <div className="pt-4">
          <h2 className="font-sans font-bold text-[24px] text-[#0B1C30] mb-8">
            Detailed Question Review
          </h2>

          <div className="space-y-12">
            {questions.map((q, index) => {
              // Extract Answer logic safely
              const studentAnswerText = result.answersData?.[q.id] || "";
              const isMCQ = q.questionType === "Multiple Choice";
              const correctOption = isMCQ ? q.options?.find((o) => o.isCorrect) : undefined;
              const isCorrect = isMCQ ? studentAnswerText === correctOption?.id : undefined;
              const selectedOptionText = isMCQ
                ? q.options?.find((o) => o.id === studentAnswerText)?.text
                : undefined;

              // Safe fallback for text and image matching our backend data structure
              const qText = q.questionText || q.text || "Question text not available.";
              const qImage = q.mediaUrl || q.imageUrl;

              return (
                <React.Fragment key={q.id}>
                  <div className="flex gap-4 sm:gap-6 group">
                    {/* Question Number */}
                    <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-[16px] shrink-0 mt-1">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-sans font-normal text-[16px] text-[#0B1C30] whitespace-pre-wrap">
                            {qText}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {isMCQ ? (
                            <span
                              className={`px-3 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-widest ${
                                isCorrect
                                  ? "bg-[#DCFCE7] text-[#16A34A]"
                                  : "bg-[#FEE2E2] text-[#DC2626]"
                              }`}
                            >
                              {isCorrect ? "CORRECT" : "INCORRECT"}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-[6px] bg-[#FFFBEB] text-[#B45309] text-[10px] font-bold uppercase tracking-widest">
                              {result.status === "PENDING" ? "PENDING REVIEW" : "REVIEWED"}
                            </span>
                          )}
                          {isMCQ && (
                            <span className="font-sans font-bold text-[16px] text-[#9B3434]">
                              {isCorrect ? q.marks || 1 : 0}/{q.marks || 1} pts
                            </span>
                          )}
                        </div>
                      </div>

                      {qImage && (
                        <div className="w-full max-w-2xl bg-[#E0F2FE] border border-sky-100 p-6 rounded-xl overflow-hidden flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={qImage} alt="Question Attachment" className="max-w-full max-h-[300px] rounded-lg shadow-sm" />
                        </div>
                      )}

                      <div className="space-y-3">
                        <p className="font-inter font-bold text-[11px] text-stone-400 uppercase tracking-widest">
                          YOUR ANSWER
                        </p>
                        <p className="font-inter italic text-[14px] text-[#0B1C30] leading-[24px] max-w-3xl">
                          {isMCQ
                            ? selectedOptionText || "Not answered"
                            : studentAnswerText || "Not answered"}
                        </p>
                      </div>
                      
                      {/* Show Correct Answer for MCQ if the student answered incorrectly */}
                      {isMCQ && !isCorrect && correctOption && (
                        <div className="space-y-2">
                           <p className="font-inter font-bold text-[11px] text-[#15803D] uppercase tracking-widest">
                            CORRECT ANSWER
                          </p>
                          <p className="font-inter font-medium text-[14px] text-[#15803D] bg-[#ECFDF5] px-4 py-2 rounded-lg border border-green-100 inline-block">
                            {correctOption.text}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {index < questions.length - 1 && (
                    <div className="h-px w-full bg-stone-200/70" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Overall Teacher Feedback (exam-level, not per-question) */}
          {result.feedback && (
            <div className="mt-12 bg-[#F0F9FF] border border-sky-100 rounded-xl p-5 max-w-4xl">
              <div className="flex items-center gap-2 mb-2.5">
                <MessageSquare className="w-4 h-4 text-[#0EA5E9]" />
                <span className="font-inter font-bold text-[12px] text-[#0EA5E9] uppercase tracking-wider">
                  OVERALL TEACHER FEEDBACK{result.grade ? ` • GRADE: ${result.grade}` : ""}
                </span>
              </div>
              <p className="font-inter text-[14px] text-[#0B1C30] leading-[21px]">
                {result.feedback}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}