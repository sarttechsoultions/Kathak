"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";

// ─── STRICT TYPESCRIPT INTERFACES ───
interface ExamOption {
  id: string;
  text: string;
}

interface ExamQuestion {
  id: string;
  questionText?: string;
  text?: string;
  description?: string;
  questionType?: string;
  options?: ExamOption[];
  mediaType?: string;
  mediaUrl?: string;
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

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  // State
  const [exam, setExam] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Load Exam
  useEffect(() => {
    const fetchExam = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ data?: { exam?: ExamData } }>(`/student/exams/${examId}/attempt`);
        if (res.data?.exam) {
          setExam(res.data.exam);
          setQuestions(res.data.exam.questionsData || []);
          setTimeLeft(res.data.exam.durationMins * 60); // duration in seconds
        } else {
          setLoadError("Exam not found or already submitted.");
        }
      } catch (err: any) {
        setLoadError(err.message || "Failed to load exam. You might have already submitted it.");
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) fetchExam();
  }, [examId]);

  // Timer Effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isSubmitting || loadError) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, loadError]);

  const handleAutoSubmit = async () => {
    alert("Time is up! Submitting your exam automatically.");
    await submitExam();
  };

  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest(`/student/exams/${examId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers })
      });
      alert("Exam submitted successfully!");
      router.push("/student/exam");
    } catch (err: any) {
      alert(err.message || "Failed to submit exam.");
      setIsSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    let msg = "Are you sure you want to submit your exam?";
    if (unansweredCount > 0) {
      msg = `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`;
    }
    if (window.confirm(msg)) {
      submitExam();
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ─── LOADING & ERROR STATES ───
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#A42E30] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-bold text-gray-500">Preparing your exam...</span>
      </div>
    );
  }

  if (loadError || !exam) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0B1C30] mb-2">Notice</h2>
        <p className="text-gray-500 mb-6 max-w-md">{loadError || "Exam not found."}</p>
        <button
          onClick={() => router.push("/student/exam")}
          className="px-6 py-3 rounded-xl bg-[#0B1C30] text-white text-sm font-bold transition-all hover:bg-gray-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const currentQIndexStr = currentQuestionIndex.toString();
  const currentQId = currentQ?.id || currentQIndexStr;
  const qText = currentQ?.questionText || currentQ?.text || "Untitled Question";
  const qImage = currentQ?.mediaUrl || currentQ?.imageUrl;
  const isMCQ = currentQ?.questionType === "Multiple Choice";
  const isLongText = currentQ?.questionType === "Long Text" || currentQ?.questionType === "long_text";

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── HEADER ─── */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if(window.confirm("Are you sure you want to exit? Your progress will be lost if you haven't submitted.")) {
                router.push("/student/exam");
              }
            }}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-[18px] text-[#0B1C30] leading-tight">{exam.title}</h1>
            <p className="text-[12px] text-gray-500 font-medium">Exam Code: {exam.examCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-bold text-[14px] ${timeLeft && timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-gray-50 border-gray-200 text-[#0B1C30]'}`}>
            <Clock className="w-4 h-4" />
            {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
          </div>
          
          <button
            onClick={handleSubmitClick}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-[#A42E30] text-white text-[14px] font-bold shadow-sm hover:bg-[#8B2627] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
            {!isSubmitting && <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ─── MAIN LAYOUT ─── */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR: Question Navigator */}
        <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-[14px] text-[#0B1C30] uppercase tracking-wider">Question Navigator</h2>
            <div className="flex items-center gap-4 mt-3 text-[12px] font-medium text-gray-500">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#10B981]"></div> Answered</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-200"></div> Unanswered</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => {
                const qId = q.id || idx.toString();
                const isAnswered = !!answers[qId];
                const isActive = idx === currentQuestionIndex;
                return (
                  <button
                    key={qId}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center text-[14px] font-bold transition-all
                      ${isActive ? 'ring-2 ring-offset-2 ring-[#0B1C30]' : ''}
                      ${isAnswered ? 'bg-[#10B981] text-white border-transparent' : 'bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-300'}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT AREA: Active Question */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          <div className="max-w-[800px] mx-auto">
            
            {/* Question Card */}
            <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              <div className="flex items-start justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Question {currentQuestionIndex + 1} of {questions.length}</span>
                </div>
                <div className="text-[14px] font-bold text-[#A42E30] bg-rose-50 px-3 py-1 rounded-lg">
                  {currentQ?.marks || 1} Points
                </div>
              </div>

              <h2 className="text-[20px] sm:text-[24px] font-bold text-[#0B1C30] leading-snug mb-4 whitespace-pre-wrap">
                {qText}
              </h2>

              {currentQ?.description && (
                <p className="text-[15px] text-gray-600 mb-6 leading-relaxed">
                  {currentQ.description}
                </p>
              )}

              {qImage && (
                <div className="w-full bg-[#F8F9FA] rounded-[16px] mb-8 flex items-center justify-center overflow-hidden border border-gray-200 p-4">
                  {currentQ?.mediaType === "video" || (typeof qImage === 'string' && (qImage.startsWith("data:video/") || qImage.includes("/video/upload/") || qImage.match(/\.(mp4|webm|ogg|mov)$/i))) ? (
                    <video src={qImage} controls className="max-w-full max-h-[300px] rounded-lg outline-none" />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={qImage} alt="Question Media" className="max-w-full max-h-[300px] rounded-lg object-contain" />
                  )}
                </div>
              )}

              {/* Options / Answer Input */}
              <div className="mt-8">
                {isMCQ ? (
                  <div className="space-y-3">
                    {currentQ?.options?.map((opt, oIdx) => {
                      const optId = opt.id || `opt-${oIdx}`;
                      const isSelected = answers[currentQId] === optId;
                      return (
                        <div 
                          key={optId}
                          onClick={() => handleAnswerChange(currentQId, optId)}
                          className={`
                            group flex items-center p-4 rounded-[16px] border-2 cursor-pointer transition-all
                            ${isSelected ? 'border-[#0B1C30] bg-slate-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
                          `}
                        >
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 transition-colors
                            ${isSelected ? 'border-[#0B1C30]' : 'border-gray-300 group-hover:border-gray-400'}
                          `}>
                            {isSelected && <div className="w-3 h-3 rounded-full bg-[#0B1C30]" />}
                          </div>
                          <span className={`text-[16px] font-medium ${isSelected ? 'text-[#0B1C30]' : 'text-gray-700'}`}>
                            {opt.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : isLongText ? (
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Your Answer</label>
                    <textarea
                      value={answers[currentQId] || ""}
                      onChange={(e) => handleAnswerChange(currentQId, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full h-48 p-5 rounded-[16px] border-2 border-gray-200 bg-gray-50 text-[#0B1C30] text-[16px] focus:bg-white focus:border-[#0B1C30] focus:ring-0 outline-none transition-all resize-y"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm font-medium">
                    Unsupported question type: {currentQ?.questionType}
                  </div>
                )}
              </div>

            </div>

            {/* Prev / Next Controls */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-[14px] flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(p => Math.min(questions.length - 1, p + 1))}
                  className="px-5 py-3 rounded-xl bg-[#0B1C30] text-white font-bold text-[14px] flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitClick}
                  className="px-6 py-3 rounded-xl bg-[#A42E30] text-white font-bold text-[14px] flex items-center gap-2 hover:bg-[#8B2627] transition-colors shadow-sm"
                >
                  Submit Exam <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}