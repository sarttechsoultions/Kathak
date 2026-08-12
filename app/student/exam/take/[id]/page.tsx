"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Timer, 
  Info, 
  Flag, 
  Video, 
  ArrowRight, 
  ArrowLeft,
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeConfirm } from "@/components/ThemeDialogProvider";

interface ExamOption {
  id: string;
  text: string;
}

interface ExamQuestion {
  id: string;
  text: string;
  questionType?: string;
  options?: ExamOption[];
  imageUrl?: string;
  marks?: number;
}

interface ExamData {
  id: string;
  title: string;
  examCode: string;
  date: string;
  durationMins: number;
  totalMarks: number;
  questionsData: ExamQuestion[];
}

function formatTime(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<ExamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submittedRef = useRef(false);
  

  // ── Fetch exam ──
  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ data?: { exam?: ExamData } }>(
          `/student/exams/${examId}/attempt`
        );
        if (res.data?.exam) {
          setExam(res.data.exam);
          setSecondsLeft((res.data.exam.durationMins || 60) * 60);
        } else {
          setLoadError("Exam not found.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load exam.";
        setLoadError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    if (examId) fetchExam();
  }, [examId]);

  const questions = exam?.questionsData || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isFlagged = currentQuestion ? flagged.includes(currentQuestion.id) : false;

  // ── Submit handler ──
  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submittedRef.current || !exam) return;

      if (!auto) {
        const confirmed = await openThemeConfirm(
          "Are you sure you want to submit the exam? You cannot change your answers after this.",
          "Submit Exam"
        );
        if (!confirmed) return;
      }

      submittedRef.current = true;
      setIsSubmitting(true);

      try {
        const res = await apiRequest<{ data?: { id?: string } }>(
          `/student/exams/${examId}/submit`,
          {
            method: "POST",
            body: JSON.stringify({ answers }),
          }
        );
        const resultId = res.data?.id;
        router.push(resultId ? `/student/exams/result/${resultId}` : "/student/exams");
      } catch (err: unknown) {
        submittedRef.current = false;
        setIsSubmitting(false);
        const msg = err instanceof Error ? err.message : "Failed to submit exam.";
        alert(msg);
      }
    },
    [exam, examId, answers, router]
  );

  // ── Timer ──
  useEffect(() => {
    if (!exam || submittedRef.current) return;

    if (secondsLeft <= 0) {
      const timeoutId = window.setTimeout(() => {
        if (!submittedRef.current) {
          handleSubmit(true);
        }
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [exam, secondsLeft, handleSubmit]);

  // Handlers
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleTextAnswerChange = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleClearAnswer = () => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion.id];
    setAnswers(newAnswers);
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id]
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getQuestionStatusClass = (questionId: string, index: number) => {
    const isActive = index === currentQuestionIndex;
    const isAnswered = !!answers[questionId];
    const isQuestionFlagged = flagged.includes(questionId);

    let baseClass = "w-10 h-10 flex items-center justify-center rounded-[8px] text-[13px] font-bold cursor-pointer transition-all ";

    if (isAnswered) {
      baseClass += "bg-[#9B3434] text-white border-transparent ";
    } else if (isQuestionFlagged) {
      baseClass += "bg-[#B45309] text-white border-transparent ";
    } else {
      baseClass += "bg-white text-[#464555] border border-stone-200 hover:bg-stone-50 ";
    }

    if (isActive) {
      baseClass += "ring-2 ring-indigo-500 ring-offset-2 ";
    }

    return baseClass;
  };

  // ── Loading / Error states ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-sm font-bold text-stone-400 animate-pulse">Loading exam...</span>
      </div>
    );
  }

  if (loadError || !exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-stone-800">{loadError || "This exam has no questions."}</h2>
          <button
            onClick={() => router.push("/student/exams")}
            className="px-5 py-2.5 rounded-xl bg-[#9B3434] text-white text-xs font-bold"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#0B1C30] flex flex-col overflow-hidden">
      
      {/* ================= TOP HEADER ================= */}
      <header className="h-[80px] bg-white border-b border-stone-200 flex items-center justify-between px-6 sm:px-10 shrink-0 z-10 shadow-sm">
        
        {/* Left: Title & Timer */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Timer className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-[24px] font-semibold text-[#0B1C30] leading-none tracking-tight">
              {exam.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1.5 ml-11">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-[13px] font-bold text-stone-600">Time Remaining:</span>
            <span className="text-[13px] font-bold text-[#0B1C30]">{formatTime(secondsLeft)}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-stone-200 pr-6">
            <button className="flex items-center gap-1.5 text-[13px] font-semibold text-stone-500 hover:text-stone-800 transition-colors">
              <Info className="w-4 h-4" /> Info
            </button>
            <button className="flex items-center gap-1.5 text-[13px] font-semibold text-stone-500 hover:text-stone-800 transition-colors">
              <Flag className="w-4 h-4" /> Support
            </button>
          </div>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#9B3434] hover:bg-[#7A2828] text-white rounded-[8px] text-[14px] font-bold shadow-sm transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT SPLIT ================= */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ================= LEFT SIDEBAR (NAVIGATOR) ================= */}
        <aside className="w-[280px] lg:w-[320px] bg-[#F8FAFC] border-r border-stone-200 flex flex-col shrink-0">
          
          <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-[16px] font-bold text-[#0B1C30] mb-5">Question Navigator</h3>
            
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={getQuestionStatusClass(q.id, index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legend & Proctoring (Bottom Fixed) */}
          <div className="p-6 border-t border-stone-200 bg-[#F8FAFC] space-y-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-[4px] bg-[#9B3434]" />
                <span className="text-[13px] font-medium text-stone-600">Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-[4px] bg-[#B45309]" />
                <span className="text-[13px] font-medium text-stone-600">Flagged for Review ({flagged.length})</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-[4px] bg-white border border-stone-300" />
                <span className="text-[13px] font-medium text-stone-600">Unvisited ({questions.length - Object.keys(answers).length})</span>
              </div>
            </div>

            <div className="bg-[#EEF2FF] rounded-[12px] p-4 flex flex-col gap-1.5 border border-indigo-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">Proctor Status</span>
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-[13px]">
                <Video className="w-4 h-4" /> Camera Active
              </div>
            </div>

          </div>
        </aside>

        {/* ================= RIGHT MAIN AREA (QUESTION) ================= */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-[718px] mx-auto py-10 px-6 sm:px-8 flex flex-col h-full">
            
            {/* Category Tag */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {exam.examCode}
              </span>
            </div>

            {/* Question Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[28px] font-bold text-[#0B1C30] tracking-tight">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <button 
                onClick={handleToggleFlag}
                className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-bold border transition-colors ${
                  isFlagged 
                    ? "border-[#B45309] bg-[#FFFBEB] text-[#B45309]" 
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <Flag className={`w-4 h-4 ${isFlagged ? "fill-[#B45309]" : ""}`} /> 
                {isFlagged ? "FLAGGED" : "FLAG FOR REVIEW"}
              </button>
            </div>

            {/* Question Content */}
            <div className="flex-1 space-y-6">
              
              {/* Question Text */}
              <p className="text-[16px] text-[#0B1C30] leading-[26px]">
                {currentQuestion.text}
              </p>

              {/* Media Image Attachment */}
              {currentQuestion.imageUrl && (
                <div className="bg-[#E0F2FE] rounded-[12px] p-6 flex items-center justify-center w-full min-h-[200px] border border-sky-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question attachment"
                    className="max-w-full max-h-[400px] rounded-lg shadow-sm border border-stone-200"
                  />
                </div>
              )}

              {/* Options (Multiple Choice) or Text Answer (Long Text) */}
              {currentQuestion.questionType === "Long Text" ? (
                <div className="pt-4">
                  <textarea
                    rows={8}
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleTextAnswerChange(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 rounded-[12px] border border-stone-200 text-[15px] font-medium text-[#0B1C30] focus:border-indigo-600 focus:outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-3 pt-4">
                  {(currentQuestion.options || []).map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.id;
                    return (
                      <div 
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`flex items-center gap-4 p-4 rounded-[12px] border cursor-pointer transition-all ${
                          isSelected 
                            ? "border-indigo-600 bg-indigo-50/50" 
                            : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-indigo-600" : "border-stone-300"
                        }`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                        </div>
                        <span className="text-[15px] font-medium text-[#0B1C30]">
                          {opt.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-12 pt-6 border-t border-stone-100 flex items-center justify-between">
              
              <button 
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-[14px] font-bold text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50 border border-stone-200"
              >
                <ArrowLeft className="w-4 h-4" /> PREVIOUS
              </button>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={handleClearAnswer}
                  disabled={!answers[currentQuestion.id]}
                  className="text-[14px] font-bold text-stone-500 hover:text-stone-800 disabled:opacity-50 transition-colors"
                >
                  CLEAR ANSWER
                </button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <button 
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-[#9B3434] hover:bg-[#7A2828] text-white rounded-[8px] text-[14px] font-bold shadow-sm transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT EXAM"}
                  </button>
                ) : (
                  <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-[#9B3434] hover:bg-[#7A2828] text-white rounded-[8px] text-[14px] font-bold shadow-sm transition-colors"
                  >
                    SAVE & NEXT <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>

          </div>
        </main>

      </div>
    </div>
  );
}