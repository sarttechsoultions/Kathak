"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, TrendingUp, Flag } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface FeedbackEntry {
  id: string;
  role: string;
  text: string;
  updatedAt: string;
}

const parseFeedbackArray = (raw: unknown): FeedbackEntry[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as FeedbackEntry[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as FeedbackEntry[];
      return [{ id: Math.random().toString(36).substr(2, 9), role: 'Admin', text: raw, updatedAt: new Date().toISOString() }];
    } catch {
      return [{ id: Math.random().toString(36).substr(2, 9), role: 'Admin', text: raw, updatedAt: new Date().toISOString() }];
    }
  }
  return [];
};

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

interface ExamQuestionEvaluation {
  marks?: number;
  feedback?: string;
}

interface StudentExamResultItem {
  id: string;
  examId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  studentIdCode: string;
  batchName: string;
  score: string;
  marksObtained: number;
  totalMarks: number;
  passingMarks: number;
  percentile?: number;
  status: string;
  answersData: Record<string, string>;
  feedback: string;
  grade: string;
  flagged?: boolean;
  questionEvaluations?: Record<string, ExamQuestionEvaluation>;
  exam: {
    title: string;
    totalMarks: number;
    passingMarks: number;
    questionsData: ExamQuestion[];
  };
}

export default function DetailedEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  
  const resultId = params.resultId as string;

  const [result, setResult] = useState<StudentExamResultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

  // Form States
  const [teacherOverride, setTeacherOverride] = useState(0);
  const [flagDiscussion, setFlagDiscussion] = useState(false);
  const [overallFeedbacks, setOverallFeedbacks] = useState<FeedbackEntry[]>([]);

  const [questionAwards, setQuestionAwards] = useState<Record<string, number>>({});
  const [questionFeedbacks, setQuestionFeedbacks] = useState<Record<string, FeedbackEntry[]>>({});

  useEffect(() => {
    const fetchResultDetail = async () => {
      setLoading(true);
      try {
        const res = await apiRequest<{ data?: { results?: StudentExamResultItem[] } }>("/admin/exams/results");
        if (res?.data?.results) {
          const foundResult = res.data.results.find((r: StudentExamResultItem) => r.id === resultId);
          if (foundResult) {
            setResult(foundResult);
            setIsEditing(foundResult.status === "PENDING");
            setOverallFeedbacks(parseFeedbackArray(foundResult.feedback));
            setFlagDiscussion(foundResult.flagged || false);

            const initialAwards: Record<string, number> = {};
            const initialExistingFeedback: Record<string, FeedbackEntry[]> = {};

            foundResult.exam.questionsData?.forEach((q: ExamQuestion) => {
              // Agar pehle se evaluate ho chuka hai, wahi value use karo
              const existing = foundResult.questionEvaluations?.[q.id];
              if (existing) {
                initialAwards[q.id] = existing.marks ?? 0;
                initialExistingFeedback[q.id] = parseFeedbackArray(existing.feedback);
              } else {
                const studentAns = foundResult.answersData?.[q.id];
                const isCorrect = q.options?.find(o => o.isCorrect)?.id === studentAns;
                initialAwards[q.id] = isCorrect ? (q.marks || 5) : 0;
              }
            });

            setQuestionAwards(initialAwards);
            setQuestionFeedbacks(initialExistingFeedback);
          }
        }
      } catch (err) {
        console.error("Failed to fetch result detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (resultId) fetchResultDetail();
  }, [resultId]);

  const baseSystemScore = result?.marksObtained ?? 0;
  const questionTotalScore = Object.values(questionAwards).reduce((a, b) => a + (Number(b) || 0), 0);
  const manualTotalScore = questionTotalScore + teacherOverride;
  const passingMarks = result?.exam?.passingMarks || 10;
  const isPassed = manualTotalScore >= passingMarks;

  const handleVerifyResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;

    try {
      await apiRequest(`/admin/exams/results/${result.id}/evaluate`, {
        method: "POST",
        body: JSON.stringify({
          marksObtained: manualTotalScore,
          feedback: JSON.stringify(overallFeedbacks),
          status: isPassed ? "PASS" : "FAIL",
          flagged: flagDiscussion,
          questionEvaluations: Object.keys(questionAwards).reduce((acc, qId) => {
            acc[qId] = {
              marks: questionAwards[qId],
              feedback: JSON.stringify(questionFeedbacks[qId] || [])
            };
            return acc;
          }, {} as Record<string, { marks: number; feedback: string }>)
        }),
      });

      setResult((prev) => prev ? { ...prev, status: isPassed ? "PASS" : "FAIL" } : null);
      setIsEditing(false);
      alert(`Result for "${result.studentName}" finalized with ${manualTotalScore} marks!`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to finalize evaluation.";
      alert(errorMessage);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-stone-500 font-bold">Loading Evaluation...</div>;
  }

  if (!result) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-rose-600 font-bold">Result not found.</div>;
  }

  return (
    <div className="font-sans bg-[#FAFAFA] min-h-screen p-6 sm:p-8">
      <div className="max-w-[1300px] mx-auto space-y-6 animate-in fade-in duration-300">

        {/* Back Navigation & Edit Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (result?.examId) {
                router.push(`/admin/exam/results/exam/${result.examId}`);
              } else {
                router.push("/admin/exam/results");
              }
            }}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-stone-900 hover:text-[#9B3434] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Students
          </button>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#9B3434] text-white font-bold rounded-lg hover:bg-[#7A2828] text-sm shadow-sm transition-all"
            >
              Edit Evaluation
            </button>
          )}
        </div>

        {/* ================= TOP BANNER ================= */}
        <div className="bg-white rounded-[16px] border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between">
          <div className="flex items-center gap-6 p-6 flex-1 border-b md:border-b-0 md:border-r border-stone-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.studentAvatar || "/placeholder.png"}
              alt={result.studentName}
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
              className="w-[88px] h-[88px] rounded-[16px] object-cover bg-stone-100 shrink-0 border border-stone-200"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-[32px] text-[#0B1C30] tracking-[-0.32px] leading-[38.4px]">
                  {result.studentName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-[6px] bg-rose-50 text-[#9B3434] text-[13px] font-medium tracking-[-0.13px]">
                  {result.studentIdCode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[18px] text-[#464555] leading-[25.2px]">
                  {result.exam.title}
                </p>
                <span className="w-1 h-1 rounded-full bg-stone-300" />
                <p className="font-semibold text-[18px] text-[#9B3434] leading-[25.2px]">
                  {result.batchName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10 p-6 bg-[#F8FAFC] rounded-r-[16px]">
            <div className="text-center">
              <span className="text-[11px] font-extrabold uppercase text-[#777587] block leading-tight">FINAL<br />SCORE</span>
              <div className="mt-1">
                <span className="font-bold text-[36px] text-[#9B3434] leading-none">{manualTotalScore}</span>
                <span className="text-[18px] font-semibold text-stone-400"> / {result.totalMarks}</span>
              </div>
            </div>

            <div className="w-px h-12 bg-stone-200" />

            <div className="text-center">
              <span className="text-[11px] font-extrabold uppercase text-[#777587] block leading-tight">PERCENTILE</span>
              <span className="font-extrabold text-[32px] text-[#0EA5E9] leading-[38.4px] block mt-1 tracking-[-0.32px]">
                {result.percentile ? `${result.percentile}th` : "98th"}
              </span>
            </div>

            <div className="w-px h-12 bg-stone-200" />

            <div className={`px-4 py-3 rounded-[12px] border flex items-center gap-2 ${isPassed ? "bg-[#ECFDF5] border-green-100 text-[#15803D]" : "bg-[#FEF2F2] border-red-100 text-[#DC2626]"}`}>
              {isPassed ? <CheckCircle2 className="w-5 h-5 fill-[#10B981] text-white" /> : <XCircle className="w-5 h-5 fill-[#EF4444] text-white" />}
              <span className="font-bold text-[14px] uppercase tracking-wider">{isPassed ? "PASSED" : "FAILED"}</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT SPLIT ================= */}
        <div className="flex flex-col lg:flex-row items-start gap-8">

          {/* LEFT: QUESTIONS */}
          <div className="flex-1 w-full space-y-6">
            {result.exam.questionsData?.map((q, index) => {
              const studentAnswerText = result.answersData?.[q.id] || "";
              const isMCQ = q.questionType === "Multiple Choice";
              const correctOption = isMCQ ? q.options?.find((o) => o.isCorrect) : undefined;
              const isCorrect = isMCQ ? studentAnswerText === correctOption?.id : undefined;

              const qText = q.questionText || q.text || "Question text not provided.";
              const qImage = q.mediaUrl || q.imageUrl;
              const currentAward = questionAwards[q.id] ?? 0;

              return (
                <div key={q.id} className="bg-white rounded-[16px] p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-[#9B3434] text-white flex items-center justify-center font-bold text-[14px]">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-[18px] text-[#0B1C30]">{q.questionType || "Multiple Choice"}</h4>
                    </div>

                    <div className="flex items-center gap-2 bg-[#EEF2FF] px-3 py-1.5 rounded-full border border-indigo-100">
                      <span className="text-[12px] font-bold text-indigo-900 uppercase">AWARD:</span>
                      <input
                        type="number"
                        min={0}
                        max={q.marks || 5}
                        disabled={!isEditing}
                        value={currentAward}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const maxAllowed = q.marks || 5;
                          let num = raw === "" ? 0 : Number(raw);
                          if (isNaN(num)) num = 0;
                          num = Math.max(0, Math.min(maxAllowed, num));
                          setQuestionAwards((prev) => ({ ...prev, [q.id]: num }));
                        }}
                        className="w-12 h-7 text-center rounded border border-indigo-200 font-bold text-indigo-900 focus:outline-none focus:border-indigo-400"
                      />
                      <span className="text-[12px] font-bold text-[#9B3434]">/ {q.marks || 5} Points</span>
                    </div>
                  </div>

                  <p className="font-normal text-[16px] text-[#464555] leading-[25.6px] whitespace-pre-wrap">
                    {qText}
                  </p>

                  {qImage && (
                    <div className="rounded-[12px] overflow-hidden border border-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qImage} alt="Question Diagram" className="w-full h-auto object-contain max-h-[400px]" />
                    </div>
                  )}

                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#464555]">REFERENCE ANSWER (TEACHER KEY)</span>
                    <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-stone-200 text-[14px] text-[#0B1C30] font-medium">
                      {correctOption?.text || "Reference answer not available"}
                    </div>
                  </div>

                  {isMCQ && (
                    <div className="grid grid-cols-1 gap-4 pt-2">
                      {q.options?.map((opt) => {
                        const isStudentSelection = opt.id === studentAnswerText;
                        if (!isStudentSelection) return null;

                        return (
                          <div key={opt.id} className={`p-5 rounded-[16px] border-[2px] ${isCorrect ? "border-[#34D399] bg-[#ECFDF5]" : "border-[#F87171] bg-[#FEF2F2]"} space-y-3`}>
                            <div className="flex items-center justify-between">
                              <span className={`font-bold text-[16px] ${isCorrect ? "text-[#064E3B]" : "text-[#7F1D1D]"}`}>{opt.text}</span>
                              <span className="text-[12px] font-bold uppercase tracking-wider text-stone-500">STUDENT SELECTION</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-1.5 pt-4">
                    <div className="flex items-center justify-between">
                       <label className="block text-[12px] font-bold text-[#464555] uppercase">FEEDBACK</label>
                       {isEditing && (
                         <button type="button" onClick={() => {
                           const newFbs = [...(questionFeedbacks[q.id] || [])];
                           newFbs.push({ id: Math.random().toString(36).substr(2,9), role: 'Teacher', text: '', updatedAt: new Date().toISOString() });
                           setQuestionFeedbacks(prev => ({ ...prev, [q.id]: newFbs }));
                         }} className="text-[10px] font-bold text-[#9B3434] uppercase hover:underline">+ Add Note</button>
                       )}
                    </div>
                    
                    {(questionFeedbacks[q.id] || []).map((fb, fbIdx) => (
                      <div key={fb.id} className="mb-2">
                         <div className="text-[10px] font-bold text-stone-400 mb-1 flex justify-between">
                           <span>{fb.role} Feedback</span>
                           <span>{new Date(fb.updatedAt).toLocaleDateString()}</span>
                         </div>
                         {isEditing ? (
                           <textarea
                             rows={2}
                             value={fb.text}
                             onChange={(e) => {
                                const val = e.target.value;
                                setQuestionFeedbacks(prev => {
                                   const newArr = [...(prev[q.id] || [])];
                                   newArr[fbIdx] = { ...newArr[fbIdx], text: val, updatedAt: new Date().toISOString() };
                                   return { ...prev, [q.id]: newArr };
                                });
                             }}
                             className="w-full p-4 rounded-[12px] bg-[#F8FAFC] border border-stone-200 text-[14px] text-[#0B1C30] focus:bg-white focus:outline-none focus:border-[#9B3434] resize-none"
                             placeholder="Provide constructive feedback..."
                           />
                         ) : (
                           <div className="p-3 bg-orange-50/50 rounded-[12px] text-sm text-stone-700 whitespace-pre-wrap border border-orange-100/50 font-medium italic">
                             {fb.text || <span className="text-stone-400 italic">No feedback provided.</span>}
                           </div>
                         )}
                      </div>
                    ))}
                    
                    {(questionFeedbacks[q.id] || []).length === 0 && !isEditing && (
                      <div className="p-3 bg-stone-50 rounded-[12px] text-sm text-stone-400 border border-stone-100 italic">
                        No feedback provided.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: EVALUATION PANEL */}
          <div className="w-full lg:w-[384px] shrink-0 lg:sticky lg:top-[88px] space-y-6">
            <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">

              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <TrendingUp className="w-5 h-5 text-[#9B3434]" />
                <h3 className="font-bold text-[18px] text-[#0B1C30]">Final Evaluation</h3>
              </div>

              <form onSubmit={handleVerifyResult} className="space-y-6">

                <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-[12px] border border-stone-200">
                  <span className="text-[14px] font-semibold text-[#464555]">Base System Score</span>
                  <span className="font-bold text-[16px] text-[#0B1C30]">{baseSystemScore} / {result.totalMarks}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-[12px] border border-stone-200">
                  <span className="text-[14px] font-semibold text-[#464555]">Teacher Overrides</span>
                  <div className="flex items-center gap-3">
                    <button type="button" disabled={!isEditing} onClick={() => setTeacherOverride(teacherOverride - 0.5)} className="w-8 h-8 rounded-[8px] bg-stone-200 text-stone-600 font-bold hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed">-</button>
                    <span className="font-bold text-[16px] text-[#9B3434]">
                      {teacherOverride > 0 ? "+" : ""}{teacherOverride.toFixed(1)}
                    </span>
                    <button type="button" disabled={!isEditing} onClick={() => setTeacherOverride(teacherOverride + 0.5)} className="w-8 h-8 rounded-[8px] bg-stone-200 text-stone-600 font-bold hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                  </div>
                </div>

                <div className="p-6 rounded-[16px] bg-[#9B3434] shadow-md flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#DAD7FF] leading-[21px] w-[130px]">
                    Manually Validated Score
                  </span>
                  <span className="font-bold text-[32px] text-white leading-[38.4px] text-right">
                    {manualTotalScore} <span className="text-[16px] text-[#DAD7FF]">/ {result.totalMarks}</span>
                  </span>
                </div>

                {/* OVERALL FEEDBACK */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#464555] block">OVERALL FEEDBACK</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setOverallFeedbacks((prev) => [
                            ...prev,
                            { id: Math.random().toString(36).substr(2, 9), role: 'Teacher', text: '', updatedAt: new Date().toISOString() }
                          ]);
                        }}
                        className="text-[10px] font-bold text-[#9B3434] uppercase hover:underline"
                      >
                        + Add Note
                      </button>
                    )}
                  </div>
                  
                  {overallFeedbacks.map((fb, idx) => (
                    <div key={fb.id} className="mb-2">
                      <div className="text-[10px] font-bold text-stone-400 mb-1 flex justify-between">
                        <span>{fb.role} Feedback</span>
                        <span>{new Date(fb.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={fb.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOverallFeedbacks((prev) => {
                              const newArr = [...prev];
                              newArr[idx] = { ...newArr[idx], text: val, updatedAt: new Date().toISOString() };
                              return newArr;
                            });
                          }}
                          placeholder="Provide constructive feedback..."
                          className="w-full p-4 rounded-[12px] bg-[#F8FAFC] border border-stone-200 text-[14px] text-[#0B1C30] focus:bg-white focus:outline-none focus:border-[#9B3434] resize-none"
                        />
                      ) : (
                        <div className="p-4 bg-[#F8FAFC] rounded-[12px] text-[14px] text-[#0B1C30] border border-stone-200 whitespace-pre-wrap font-medium">
                          {fb.text || <span className="text-stone-400 italic">No feedback provided.</span>}
                        </div>
                      )}
                    </div>
                  ))}

                  {overallFeedbacks.length === 0 && !isEditing && (
                    <div className="p-4 bg-[#F8FAFC] rounded-[12px] text-[14px] text-stone-400 border border-stone-200 italic">
                      No overall feedback provided.
                    </div>
                  )}
                </div>

                {/* 🔥 FIXED TOGGLE SWITCH STYLING */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-stone-500" />
                    <span className="text-[14px] font-semibold text-[#0B1C30]">Flag for Discussion</span>
                  </div>
                  <div
                    onClick={() => isEditing && setFlagDiscussion(!flagDiscussion)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-70"} ${flagDiscussion ? "bg-[#9B3434]" : "bg-stone-300"
                      }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${flagDiscussion ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {isEditing && (
                    <button type="submit" className="w-full py-4 rounded-[12px] bg-[#9B3434] hover:bg-[#7A2828] text-white font-bold text-[14px] shadow-sm transition-all text-center cursor-pointer">
                      Verify &amp; Finalize Result
                    </button>
                  )}
                  <button type="button" onClick={() => window.print()} className="w-full py-4 rounded-[12px] border-[2px] border-stone-200 bg-white text-[#464555] font-bold text-[14px] hover:bg-stone-50 transition-colors text-center cursor-pointer">
                    Download PDF Report
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}