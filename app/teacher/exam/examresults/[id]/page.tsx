'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, LockOpen, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface FeedbackEntry {
  id: string;
  role: string;
  text: string;
  updatedAt: string;
}

const parseFeedbackArray = (raw: any): FeedbackEntry[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [{ id: Math.random().toString(36).substr(2, 9), role: 'Admin', text: raw, updatedAt: new Date().toISOString() }];
    } catch {
      return [{ id: Math.random().toString(36).substr(2, 9), role: 'Admin', text: raw, updatedAt: new Date().toISOString() }];
    }
  }
  return [];
};

export default function ExamResultDetail() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  // --- States ---
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  // Edit Mode State (Lock/Unlock)
  const [isEditable, setIsEditable] = useState(true);

  // Dynamic Form States
  const [questionScores, setQuestionScores] = useState<Record<number, string>>({});
  const [questionFeedbacks, setQuestionFeedbacks] = useState<Record<number, FeedbackEntry[]>>({});
  const [overrideScore, setOverrideScore] = useState('0');
  const [overallFeedbacks, setOverallFeedbacks] = useState<FeedbackEntry[]>([]);
  const [flagged, setFlagged] = useState(false);

  // Fetch Result Details
  useEffect(() => {
    const fetchResultDetail = async () => {
      try {
        const res = await apiRequest<{ data?: { results?: any[] } }>("/admin/exams/results");
        if (res?.data?.results) {
          const currentResult = res.data.results.find(r => r.id === resultId);
          if (currentResult) {
            setResultData(currentResult);
            setOverallFeedbacks(parseFeedbackArray(currentResult.feedback));
            setFlagged(currentResult.flagged || false);
            
            const isAlreadyGraded = currentResult.status === 'Passed' || currentResult.status === 'Failed' || currentResult.status === 'PASS' || currentResult.status === 'FAIL';
            
            if (isAlreadyGraded) {
              setIsEditable(false);
            }

            // Data extraction with Robust Fallbacks
            const qData = currentResult.exam?.questionsData || [];
            let aData = currentResult.answersData || {};
            let savedEvals = currentResult.questionEvaluations || {};

            // If JSON comes stringified, parse it
            if (typeof aData === 'string') { try { aData = JSON.parse(aData); } catch(e) {} }
            if (typeof savedEvals === 'string') { try { savedEvals = JSON.parse(savedEvals); } catch(e) {} }

            let initScores: Record<number, string> = {};
            let initFeedbacks: Record<number, FeedbackEntry[]> = {};

            qData.forEach((q: any, idx: number) => {
              // 1. Fetch saved Evaluation (Score & Feedback)
              const evalData = savedEvals[idx] || savedEvals[q.id] || savedEvals[String(idx)];
              
              if (evalData && typeof evalData === 'object') {
                initScores[idx] = evalData.score?.toString() ?? evalData.marks?.toString() ?? '0';
                initFeedbacks[idx] = parseFeedbackArray(evalData.feedback);
              } else if (evalData) {
                initScores[idx] = evalData.toString(); // Fallback if just score was saved
                initFeedbacks[idx] = [];
              } else {
                // 2. Auto-grade fallback for completely new evaluation
                let studentAns = '';
                if (Array.isArray(aData)) {
                   const found = aData.find((a: any) => a.questionId === q.id || a.questionIndex === idx);
                   studentAns = found?.answer || found?.selectedOption || found?.text || '';
                } else {
                   studentAns = aData[q.id] || aData[idx] || aData[q.questionText] || '';
                }
                if (typeof studentAns === 'object') studentAns = (studentAns as any).text || (studentAns as any).answer || '';

                if (q.options && Array.isArray(q.options)) {
                   const matchedOption = q.options.find((o: any) => o.id === studentAns);
                   if (matchedOption) {
                      studentAns = matchedOption.text;
                   }
                }

                const correctOpt = q.options?.find((o: any) => o.isCorrect)?.text || '';
                
                if (studentAns && correctOpt && String(studentAns).trim().toLowerCase() === String(correctOpt).trim().toLowerCase()) {
                  initScores[idx] = (q.marks || 0).toString();
                } else {
                  initScores[idx] = '0';
                }
                initFeedbacks[idx] = [];
              }
            });

            setQuestionScores(initScores);
            setQuestionFeedbacks(initFeedbacks);

            // Calculate override score safely
            const sumOfQScores = Object.values(initScores).reduce((acc: number, val: any) => acc + (parseFloat(val) || 0), 0);
            if (currentResult.marksObtained && currentResult.marksObtained !== sumOfQScores) {
              setOverrideScore((currentResult.marksObtained - sumOfQScores).toString());
            }
          }
        }
      } catch (error) {
        console.error("Failed to load result details", error);
      } finally {
        setLoading(false);
      }
    };

    if (resultId) {
      fetchResultDetail();
    }
  }, [resultId]);

  // Derived Calculations
  const questionsList = resultData?.exam?.questionsData || [];
  let answersData = resultData?.answersData || {};
  if (typeof answersData === 'string') { try { answersData = JSON.parse(answersData); } catch(e) {} }
  
  const baseScore = Object.values(questionScores).reduce((sum: number, val) => sum + (parseFloat(val) || 0), 0);
  const totalScore = baseScore + (parseFloat(overrideScore) || 0);
  const maxScore = resultData?.exam?.totalMarks || resultData?.totalMarks || 100;
  
  // Validation Handler
  const handleScoreChange = (index: number, val: string, maxMarks: number) => {
    if (val === '') {
      setQuestionScores(prev => ({ ...prev, [index]: '' }));
      return;
    }
    let num = parseFloat(val);
    if (num < 0) num = 0;
    if (num > maxMarks) num = maxMarks; 
    setQuestionScores(prev => ({ ...prev, [index]: num.toString() }));
  };

  const handleQuickGrade = (index: number, maxMarks: number, type: 'CORRECT' | 'INCORRECT' | 'PARTIAL') => {
    if (!isEditable) return;
    let score = '0';
    if (type === 'CORRECT') score = maxMarks.toString();
    else if (type === 'PARTIAL') score = (maxMarks / 2).toString();
    handleScoreChange(index, score, maxMarks);
  };

  const handleFinalizeResult = async () => {
    setIsSubmitting(true);

    // Score aur Feedback ko merge karke JSON banayein (Robust saving)
    const packedEvaluations: Record<string, any> = {};
    questionsList.forEach((q: any, idx: number) => {
       const evalObj = {
          score: questionScores[idx] || '0',
          marks: parseFloat(questionScores[idx] || '0'),
          feedback: JSON.stringify(questionFeedbacks[idx] || [])
       };
       // Save with both index and question ID to ensure it loads next time
       packedEvaluations[idx] = evalObj;
       if (q.id) packedEvaluations[q.id] = evalObj;
    });

    try {
      await apiRequest(`/admin/exams/results/${resultId}/evaluate`, {
        method: "POST",
        body: JSON.stringify({
          marksObtained: totalScore,
          feedback: JSON.stringify(overallFeedbacks),
          flagged: flagged,
          questionEvaluations: packedEvaluations, // Save cleanly to DB
          grade: "A", 
          status: totalScore >= (resultData?.exam?.passingMarks || 40) ? 'PASS' : 'FAIL'
        })
      });
      alert("Evaluation updated successfully!");
      setIsEditable(false); 
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update evaluation.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#A42E30] animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading Evaluation Data...</p>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <p className="text-gray-500 font-semibold text-sm">Record not found.</p>
      </div>
    );
  }

  const isPassing = totalScore >= (resultData.exam?.passingMarks || 40);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
        
        {/* Top Navigation */}
        <div className="mb-6 ">
          <Link href="/teacher/exam/examresults" className="inline-flex items-center border border-[#c8c8c8] rounded text-[#0B1C30] hover:text-white hover:bg-[#A42E30] transition-colors">
            <span className="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" />
              Back 
            </span>
          </Link>
        </div>

        {/* Student Header Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultData.studentAvatar || "https://i.pravatar.cc/150?img=47"} alt={resultData.studentName} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[24px] font-bold text-[#0B1C30] leading-none">{resultData.studentName}</h1>
                <span className="text-[12px] font-semibold text-[#8B2627] bg-[#FFF1F1] px-2 py-0.5 rounded">{resultData.studentIdCode}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[14px] font-medium text-gray-500">
                <span className="text-[#0B1C30]">{resultData.exam?.title || 'Assessment'}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-[#8B2627]">{resultData.batchName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-[#F8F9FB] px-6 py-4 rounded-2xl border border-gray-100 w-full sm:w-auto">
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">FINAL SCORE</div>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-[#A42E30] leading-none">{totalScore}</span>
                <span className="text-[14px] font-bold text-gray-400">/ {maxScore}</span>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">PERCENTILE</div>
              <div className="text-[24px] font-bold text-[#0EA5E9] leading-none">{resultData.percentile || '--'}th</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex flex-col items-center min-w-[60px]">
              {isPassing ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="text-[11px] font-bold text-[#10B981] tracking-wider uppercase">PASSED</div>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center text-white mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <div className="text-[11px] font-bold text-[#EF4444] tracking-wider uppercase">FAILED</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: DYNAMIC Questions */}
          <div className="flex-1 space-y-6 w-full">
            {questionsList.length === 0 ? (
              <div className="bg-white rounded-[20px] border border-gray-100 p-8 text-center text-gray-500 font-medium">
                No questions found in this assessment.
              </div>
            ) : (
              questionsList.map((q: any, index: number) => {
                const maxMarks = parseFloat(q.marks) || 0;
                const currentScore = parseFloat(questionScores[index]) || 0;
                
                // Segment status based on current score
                let segmentStatus = 'INCORRECT';
                if (currentScore === maxMarks) segmentStatus = 'CORRECT';
                else if (currentScore > 0 && currentScore < maxMarks) segmentStatus = 'PARTIAL';

                // Robustly find student's answer (Handles Arrays and Objects)
                let rawStudentSelection = '';
                if (Array.isArray(answersData)) {
                   const found = answersData.find((a: any) => a.questionId === q.id || a.questionIndex === index);
                   rawStudentSelection = found?.answer || found?.selectedOption || found?.text || '';
                } else {
                   rawStudentSelection = answersData[q.id] || answersData[index] || answersData[q.questionText] || '';
                }
                
                // If the answer is an object (e.g., { text: 'Option 1' }), extract the string
                if (typeof rawStudentSelection === 'object') {
                   rawStudentSelection = (rawStudentSelection as any).text || (rawStudentSelection as any).answer || '';
                }

                // If student selection is an ID, find the option text
                if (q.options && Array.isArray(q.options)) {
                   const matchedOption = q.options.find((o: any) => o.id === rawStudentSelection);
                   if (matchedOption) {
                      rawStudentSelection = matchedOption.text;
                   }
                }

                const studentSelectionStr = String(rawStudentSelection).trim().toLowerCase();
                const teacherKey = q.options?.find((o: any) => o.isCorrect)?.text || 'N/A';

                return (
                  <div key={index} className={`bg-white rounded-[20px] border ${isEditable ? 'border-gray-200 shadow-sm' : 'border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]'} p-8 transition-all`}>
                    
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#A42E30] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <h2 className="text-[18px] font-bold text-[#0B1C30] leading-snug">{q.questionText || 'Untitled Question'}</h2>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isEditable ? 'bg-white border-[#FCA5A5]' : 'bg-[#F8F9FB] border-gray-100'}`}>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">AWARD:</span>
                        <input 
                          type="number" 
                          min="0"
                          max={maxMarks}
                          value={questionScores[index] ?? '0'} 
                          onChange={(e) => handleScoreChange(index, e.target.value, maxMarks)} 
                          disabled={!isEditable}
                          className="w-12 text-center py-1 border border-gray-200 rounded text-sm font-bold text-[#A42E30] outline-none focus:border-[#A42E30] disabled:bg-transparent disabled:border-transparent" 
                        />
                        <span className="text-[11px] font-bold text-[#A42E30]">/ {maxMarks} Points</span>
                      </div>
                    </div>

                    {/* Question Description / Instructions */}
                    {q.description && (
                      <p className="text-[14px] text-[#464555] mb-6 leading-relaxed">
                        {q.description}
                      </p>
                    )}

                    {/* Dynamic Media Attachment */}
                    {(q.mediaUrl || q.imageUrl) && (
                      <div className="w-full bg-[#F4EBE3] rounded-xl mb-6 flex items-center justify-center border border-gray-200 overflow-hidden relative min-h-[12rem]">
                        {(q.questionType === 'video' || (q.mediaUrl && q.mediaUrl.match(/\.(mp4|webm|ogg)$/i))) ? (
                          <video src={q.mediaUrl || q.imageUrl} controls className="max-w-full max-h-64 object-contain" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={q.imageUrl || q.mediaUrl} alt="Question Attachment" className="max-w-full max-h-64 object-contain" />
                        )}
                      </div>
                    )}

                    {/* Reference Answer */}
                    <div className="mb-6">
                      <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">REFERENCE ANSWER (TEACHER KEY)</div>
                      <div className="bg-[#F8F9FB] p-4 rounded-xl text-[14px] font-medium text-[#0B1C30] border border-gray-100">
                        {teacherKey}
                      </div>
                    </div>

                    {/* Dynamic Options Grid */}
                    {q.questionType === 'Long Text' || q.questionType === 'long_text' ? (
                      <div className="mb-6">
                         <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">STUDENT'S ANSWER</div>
                         <div className="bg-white p-4 rounded-xl text-[14px] font-medium text-[#0B1C30] border border-gray-200 whitespace-pre-wrap">
                           {rawStudentSelection || <span className="text-gray-400 italic">No answer provided.</span>}
                         </div>
                         
                         <div className={`flex gap-1 mt-4 max-w-sm ${!isEditable && 'opacity-60 pointer-events-none'}`}>
                            <button onClick={() => handleQuickGrade(index, maxMarks, 'CORRECT')} className={`flex-1 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${segmentStatus === 'CORRECT' ? 'bg-[#10B981] text-white' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}>CORRECT</button>
                            <button onClick={() => handleQuickGrade(index, maxMarks, 'INCORRECT')} className={`flex-1 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${segmentStatus === 'INCORRECT' ? 'bg-[#EF4444] text-white' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}>INCORRECT</button>
                            <button onClick={() => handleQuickGrade(index, maxMarks, 'PARTIAL')} className={`flex-1 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${segmentStatus === 'PARTIAL' ? 'bg-[#F59E0B] text-white' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}>PARTIAL</button>
                         </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {q.options?.map((opt: any, optIdx: number) => {
                          const isSelected = String(opt.text).trim().toLowerCase() === studentSelectionStr;
                          const isCorrect = opt.isCorrect;

                          if (isSelected && isCorrect) {
                            return (
                              <div key={optIdx} className="border-2 border-[#10B981] bg-[#F0FDF4] rounded-xl p-4 relative">
                                <div className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-[14px] font-bold text-[#0B1C30] mb-0.5">{opt.text}</div>
                                    <div className="text-[10px] font-bold text-[#10B981] tracking-wider uppercase">STUDENT SELECTION</div>
                                  </div>
                                  <div className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">CORRECT</div>
                                </div>
                              </div>
                            );
                          }

                          if (isSelected && !isCorrect) {
                            return (
                              <div key={optIdx} className="border-2 border-[#EF4444] bg-[#FEF2F2] rounded-xl p-4 relative">
                                <div className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-[14px] font-bold text-[#0B1C30] mb-0.5">{opt.text}</div>
                                    <div className="text-[10px] font-bold text-[#EF4444] tracking-wider uppercase">STUDENT SELECTION</div>
                                  </div>
                                  <div className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider">INCORRECT</div>
                                </div>
                              </div>
                            );
                          }

                          if (!isSelected && isCorrect) {
                            return (
                              <div key={optIdx} className="border-2 border-[#10B981] bg-[#F0FDF4] rounded-xl p-4 flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                                <div className="flex-1">
                                  <div className="text-[14px] font-bold text-[#0B1C30] mb-0.5">{opt.text}</div>
                                </div>
                                <div className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider text-right">CORRECT<br/>ANSWER</div>
                              </div>
                            );
                          }

                          return (
                            <div key={optIdx} className="border border-gray-200 bg-white rounded-xl p-4 flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                              <div className="text-[14px] text-gray-400 font-medium">{opt.text}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* NEW: PER-QUESTION TEACHER FEEDBACK */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                         <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">TEACHER FEEDBACK</div>
                         {isEditable && (
                           <button onClick={() => {
                             const newFbs = [...(questionFeedbacks[index] || [])];
                             newFbs.push({ id: Math.random().toString(36).substr(2,9), role: 'Teacher', text: '', updatedAt: new Date().toISOString() });
                             setQuestionFeedbacks(prev => ({ ...prev, [index]: newFbs }));
                           }} className="text-[10px] font-bold text-[#A42E30] uppercase hover:underline">+ Add Note</button>
                         )}
                      </div>
                      
                      {(questionFeedbacks[index] || []).map((fb, fbIdx) => (
                        <div key={fb.id} className="mb-2">
                           <div className="text-[10px] font-bold text-gray-400 mb-1 flex justify-between">
                              <span>{fb.role} Feedback</span>
                              <span>{new Date(fb.updatedAt).toLocaleDateString()}</span>
                           </div>
                           {isEditable && fb.role === 'Teacher' ? (
                             <textarea 
                               className="w-full h-20 rounded-xl p-3 text-[13px] text-[#0B1C30] outline-none transition-all resize-none border bg-[#F8F9FB] border-gray-100 focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30]"
                               placeholder="Enter your feedback here..."
                               value={fb.text}
                               onChange={(e) => {
                                  const val = e.target.value;
                                  setQuestionFeedbacks(prev => {
                                     const newArr = [...(prev[index] || [])];
                                     newArr[fbIdx] = { ...newArr[fbIdx], text: val, updatedAt: new Date().toISOString() };
                                     return { ...prev, [index]: newArr };
                                  });
                               }}
                             />
                           ) : (
                             <div className="p-3 bg-orange-50/50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap border border-orange-100/50 font-medium italic">
                               {fb.text}
                             </div>
                           )}
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })
            )}

          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-[340px] flex-shrink-0 sticky top-8">
            <div className={`bg-white rounded-[20px] border ${isEditable ? 'border-[#FCA5A5] shadow-lg shadow-rose-100/50' : 'border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]'} p-6 transition-all`}>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#A42E30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h2 className="text-[16px] font-bold text-[#0B1C30]">Final Evaluation</h2>
                </div>
                {isEditable && (
                  <span className="px-2.5 py-1 bg-rose-50 text-[#A42E30] text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse">Edit Mode</span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {/* Base System Score */}
                <div className="flex items-center justify-between bg-[#F8F9FB] p-4 rounded-xl border border-gray-100">
                  <span className="text-[13px] font-semibold text-gray-500">Base System Score</span>
                  <span className="text-[16px] font-bold text-[#0B1C30]">{baseScore} / {maxScore}</span>
                </div>

                {/* Teacher Overrides */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isEditable ? 'bg-white border-[#FCA5A5]' : 'bg-[#F8F9FB] border-gray-100'}`}>
                  <span className="text-[13px] font-semibold text-gray-500">Teacher<br/>Overrides</span>
                  <div className={`flex items-center gap-2 ${!isEditable && 'opacity-70 pointer-events-none'}`}>
                    <button onClick={() => setOverrideScore(String(parseFloat(overrideScore) - 1))} className="w-6 h-6 rounded bg-gray-200 text-gray-500 flex items-center justify-center font-bold hover:bg-gray-300">-</button>
                    <input 
                      type="number" 
                      value={overrideScore} 
                      onChange={(e) => setOverrideScore(e.target.value)} 
                      disabled={!isEditable}
                      className="w-12 text-center bg-transparent text-[14px] font-bold text-[#A42E30] outline-none disabled:bg-transparent" 
                    />
                    <button onClick={() => setOverrideScore(String(parseFloat(overrideScore) + 1))} className="w-6 h-6 rounded bg-gray-200 text-gray-500 flex items-center justify-center font-bold hover:bg-gray-300">+</button>
                  </div>
                </div>

                {/* Manually Validated Score */}
                <div className="flex items-center justify-between bg-[#A42E30] p-4 rounded-xl text-white shadow-md shadow-[#A42E30]/20">
                  <span className="text-[13px] font-semibold">Manually Validated<br/>Score</span>
                  <div className="text-right">
                    <span className="text-[20px] font-bold block leading-none">{totalScore} /</span>
                    <span className="text-[16px] font-bold">{maxScore}</span>
                  </div>
                </div>
              </div>

              {/* Overall Feedback */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-gray-500 block">OVERALL FEEDBACK</span>
                  {isEditable && (
                    <button onClick={() => {
                      setOverallFeedbacks([...overallFeedbacks, { id: Math.random().toString(36).substr(2,9), role: 'Teacher', text: '', updatedAt: new Date().toISOString() }]);
                    }} className="text-[10px] font-bold text-[#A42E30] uppercase hover:underline">+ Add Feedback</button>
                  )}
                </div>

                {overallFeedbacks.map((fb, idx) => (
                   <div key={fb.id} className="mb-3">
                      <div className="text-[10px] font-bold text-gray-400 mb-1 flex justify-between">
                         <span>{fb.role} Feedback</span>
                         <span>{new Date(fb.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {isEditable && fb.role === 'Teacher' ? (
                        <textarea
                          rows={3}
                          value={fb.text}
                          onChange={(e) => {
                             const newArr = [...overallFeedbacks];
                             newArr[idx] = { ...newArr[idx], text: e.target.value, updatedAt: new Date().toISOString() };
                             setOverallFeedbacks(newArr);
                          }}
                          placeholder="Provide final constructive feedback..."
                          className="w-full p-4 rounded-[12px] bg-[#F8F9FB] border border-gray-100 text-[14px] text-[#0B1C30] focus:bg-white focus:outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] resize-none"
                        />
                      ) : (
                        <div className="w-full p-4 rounded-[12px] bg-gray-50 border border-gray-200 text-[14px] text-gray-700 font-medium italic whitespace-pre-wrap">
                          {fb.text}
                        </div>
                      )}
                   </div>
                ))}
              </div>

              {/* Flag Toggle */}
              <div className={`flex items-center justify-between p-4 rounded-xl border mb-6 transition-colors ${isEditable ? 'bg-white border-[#FCA5A5]' : 'bg-[#F8F9FB] border-gray-100'}`}>
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#0B1C30]">
                  <svg className={`w-4 h-4 ${flagged ? 'text-[#A42E30]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                  Flag for Discussion
                </div>
                <button 
                  onClick={() => isEditable && setFlagged(!flagged)}
                  disabled={!isEditable}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${flagged ? 'bg-[#A42E30]' : 'bg-gray-300'} ${!isEditable && 'opacity-70 cursor-not-allowed'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flagged ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {!isEditable ? (
                  <button 
                    onClick={() => setIsEditable(true)}
                    className="w-full py-3.5 bg-[#F8F9FB] border border-gray-200 text-[#0B1C30] rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-white hover:border-[#A42E30] hover:text-[#A42E30] transition-all group"
                  >
                    <LockOpen className="w-4 h-4 text-gray-400 group-hover:text-[#A42E30]" />
                    Unlock to Update Evaluation
                  </button>
                ) : (
                  <button 
                    onClick={handleFinalizeResult}
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#A42E30] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#8B2627] transition-all shadow-md shadow-[#A42E30]/20 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Verify & Finalize Result
                  </button>
                )}
                
                <button className="w-full py-3.5 bg-white border border-gray-200 text-[#0B1C30] rounded-xl text-[14px] font-bold flex items-center justify-center hover:bg-gray-50 transition-all">
                  Download PDF Report
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}