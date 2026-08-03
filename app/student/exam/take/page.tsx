"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Info,
  HelpCircle,
  Flag,
  ChevronLeft,
  ArrowRight,
  Video,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface ExamQuestion {
  id: string;
  questionText: string;
  questionType: string;
  marks: number;
  options: QuestionOption[];
  mediaType?: "image" | "video" | null;
  mediaUrl?: string | null;
}

export default function StudentLiveExamTakePage() {
  const router = useRouter();

  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(120 * 60);

  useEffect(() => {
    let isMounted = true;
    const fetchExam = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get("id");

        let fetchedExam: any = null;
        if (id) {
          const res = await apiRequest(`/student/exams/${id}`);
          if (isMounted && res?.data) {
            fetchedExam = res.data;
          }
        } else {
          const res = await apiRequest("/student/exams");
          if (isMounted && res?.data?.exams && res.data.exams.length > 0) {
            fetchedExam = res.data.exams[0];
          }
        }

        if (fetchedExam && isMounted) {
          if (fetchedExam.submission || fetchedExam.status === "Submitted" || fetchedExam.status === "Completed") {
            router.replace(`/student/exam/results?id=${fetchedExam.id || id}`);
            return;
          }

          setExamData(fetchedExam);
          const mins = parseInt(fetchedExam.durationMins || "120", 10);
          setTimeLeftSeconds((isNaN(mins) ? 120 : mins) * 60);

          if (Array.isArray(fetchedExam.questions) && fetchedExam.questions.length > 0) {
            setQuestions(fetchedExam.questions);
          } else {
            // Default 1-question placeholder if admin hasn't added questions yet
            setQuestions([
              {
                id: "q-1",
                questionText: "Complete the practical assessment demo task as instructed by your evaluator.",
                questionType: "Multiple Choice",
                marks: 10,
                options: [
                  { id: "opt-1", text: "Task Completed Successfully" },
                  { id: "opt-2", text: "In Progress / Pending Review" }
                ]
              }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch exam:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExam();
    return () => {
      isMounted = false;
    };
  }, []);

  // Live countdown timer
  useEffect(() => {
    if (timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentQuestionIndex] || {
    id: "q-default",
    questionText: "Assessment Question",
    questionType: "Multiple Choice",
    marks: 5,
    options: []
  };

  const handleSelectOption = (optId: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleClearAnswer = () => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex]
    }));
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitExam();
    }
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const examId = examData?.id || "demo-exam";
      await apiRequest("/student/exams/submit", {
        method: "POST",
        body: JSON.stringify({
          examId,
          answers: userAnswers,
          notes: "Exam completed and submitted by student."
        }),
      });
      router.push(`/student/exam/results?id=${examId}`);
    } catch (err: any) {
      alert(err?.message || "Failed to submit exam.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#900C27]" />
        <span className="text-xs font-semibold text-slate-500">Loading examination environment...</span>
      </div>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const totalQCount = questions.length;

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* 1. TOP HEADER BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#900C27] text-white flex items-center justify-center text-xs font-bold shrink-0">
              ⏱️
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#900C27]">
              {examData?.title || examData?.name || "Examination"}
            </h1>
          </div>
          <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 pl-9">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Time Remaining: {formatTime(timeLeftSeconds)}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer">
            <Info className="w-4 h-4 text-stone-500" />
            <span>Info</span>
          </button>
          <button className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer">
            <HelpCircle className="w-4 h-4 text-stone-500" />
            <span>Support</span>
          </button>

          <button
            onClick={handleSubmitExam}
            disabled={submitting}
            className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>

      </div>

      {/* 2. MAIN EXAM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Question Navigator & Proctor Status */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Question Navigator Box */}
          <div className="bg-[#EBF3FE] border border-[#D5E5FD] rounded-2xl p-5 space-y-5">
            <h3 className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider">
              Question Navigator
            </h3>

            {/* Numbers Grid */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = Boolean(userAnswers[q.id]);
                const isFlagged = Boolean(flaggedQuestions[idx]);

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                      isCurrent
                        ? "border-2 border-[#900C27] bg-white text-[#900C27] font-extrabold shadow-sm"
                        : isFlagged
                        ? "bg-[#D97706] text-white shadow-xs"
                        : isAnswered
                        ? "bg-[#900C27] text-white shadow-xs"
                        : "bg-white border border-stone-200/90 text-stone-500 font-medium hover:border-slate-300"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend Box */}
            <div className="pt-3 border-t border-[#D5E5FD] space-y-2 text-xs font-semibold text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#900C27]" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-[#D97706]" />
                <span>Flagged for Review ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-white border border-stone-300" />
                <span>Unvisited ({totalQCount - answeredCount})</span>
              </div>
            </div>

            {/* PROCTOR STATUS BOX */}
            <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl p-4 text-[#3730A3] space-y-1 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4338CA] block">
                PROCTOR STATUS
              </span>
              <div className="flex items-center gap-2 text-xs font-bold text-[#3730A3]">
                <Video className="w-4 h-4 text-[#4F46E5]" />
                <span>Camera Active</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Active Question Canvas */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-[#F3E8FF] text-[#7E22CE] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {currentQ.questionType === "Multiple Choice" ? "OBJECTIVE ASSESSMENT" : "DESCRIPTIVE QUESTION"}
              </span>
              <h2 className="text-2xl font-bold text-[#1B1B24]">
                Question {currentQuestionIndex + 1} of {totalQCount}
              </h2>
            </div>

            <button
              onClick={toggleFlag}
              className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                flaggedQuestions[currentQuestionIndex]
                  ? "bg-amber-50 border-[#D97706] text-[#D97706]"
                  : "border-[#900C27] text-[#900C27] hover:bg-rose-50"
              }`}
            >
              <Flag className="w-4 h-4" />
              <span>{flaggedQuestions[currentQuestionIndex] ? "FLAGGED FOR REVIEW" : "FLAG FOR REVIEW"}</span>
            </button>
          </div>

          <div className="space-y-5">
            <p className="text-sm sm:text-base text-stone-700 font-medium leading-relaxed">
              {currentQ.questionText}
            </p>

            {/* Media Box (Only rendered if media is attached by teacher/admin) */}
            {currentQ.mediaUrl && (
              <div className="bg-[#EBF3FE] border border-[#D5E5FD] rounded-2xl p-4 sm:p-6 text-center">
                {currentQ.mediaType === "video" || currentQ.mediaUrl.endsWith(".mp4") || currentQ.mediaUrl.startsWith("data:video") ? (
                  <video
                    src={currentQ.mediaUrl}
                    controls
                    className="max-w-full sm:max-w-md mx-auto max-h-56 rounded-lg object-contain bg-black shadow-2xs"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentQ.mediaUrl}
                    alt="Question Attachment"
                    className="max-w-full sm:max-w-md mx-auto h-40 object-contain rounded-lg"
                  />
                )}
              </div>
            )}

            {/* Options List */}
            {currentQ.questionType === "Multiple Choice" ? (
              <div className="space-y-3 pt-2">
                {(currentQ.options || []).map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#FFF5F5] border-[#900C27] text-slate-900 font-bold"
                          : "border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 font-medium"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-[#900C27] bg-[#900C27] text-white" : "border-stone-300 bg-white"
                      }`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs sm:text-sm">{opt.text}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-stone-700">YOUR RESPONSE</label>
                <textarea
                  rows={5}
                  placeholder="Type your answer here..."
                  value={userAnswers[currentQ.id] || ""}
                  onChange={(e) => setUserAnswers({ ...userAnswers, [currentQ.id]: e.target.value })}
                  className="w-full p-4 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:border-[#900C27]"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-100">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
            >
              ← PREVIOUS
            </button>

            <button
              onClick={handleClearAnswer}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              CLEAR ANSWER
            </button>

            <button
              onClick={handleSaveAndNext}
              className="px-6 py-2.5 rounded-xl bg-[#900C27] hover:bg-[#780A20] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{currentQuestionIndex === totalQCount - 1 ? "FINISH & SUBMIT" : "SAVE & NEXT"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
