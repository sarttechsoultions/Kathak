"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  // Download,
  // Calendar,
  Users,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Filter,
  MoreVertical
} from "lucide-react";
import { apiRequest } from "@/lib/api";

// ─── TYPESCRIPT INTERFACES ───
interface ExamItem {
  id: string;
  examCode: string;
  title: string;
  type: string;
  batchName: string;
  courseName: string;
  date: string;
  durationMins: number;
  totalMarks: number;
  passingMarks: number;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | string;
  creatorName: string;
  submissionsCount: number;
}

interface ExamResultItem {
  id: string;
  studentName?: string;
  status: "Passed" | "Failed" | string;
  marksObtained?: number | null;
  totalMarks?: number;
}

export default function ExamResultsPage() {
  const router = useRouter();
  
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [resultsList, setResultsList] = useState<ExamResultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both exams and results to compute global metrics
        const [examsRes, resultsRes] = await Promise.all([
          apiRequest<{ data?: { exams?: ExamItem[] } }>("/admin/exams"),
          apiRequest<{ data?: { results?: ExamResultItem[] } }>("/admin/exams/results")
        ]);
        
        if (isMounted) {
          if (examsRes?.data?.exams) setExams(examsRes.data.exams);
          if (resultsRes?.data?.results) setResultsList(resultsRes.data.results);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Global Metrics Calculation
  const totalStudents = resultsList.length;
  const passedStudents = resultsList.filter(r => r.status === "Passed").length;
  
  const validScores = resultsList.filter((r): r is ExamResultItem & { marksObtained: number } => r.marksObtained !== null && r.marksObtained !== undefined);
  const highestScore = validScores.length > 0 ? Math.max(...validScores.map(r => r.marksObtained)) : 0;
  const lowestScore = validScores.length > 0 ? Math.min(...validScores.map(r => r.marksObtained)) : 0;
  
  // To display "/100" or similar, we can find the max possible score for the highest/lowest. 
  // Let's assume a default of 100 if we can't map it exactly, or we can just show the max.
  const highestScoreObj = validScores.find(r => r.marksObtained === highestScore);
  const lowestScoreObj = validScores.find(r => r.marksObtained === lowestScore);
  const maxForHighest = highestScoreObj?.totalMarks || 100;
  const maxForLowest = lowestScoreObj?.totalMarks || 100;

  // Pagination Logic
  const totalExams = exams.length;
  const totalPages = Math.max(1, Math.ceil(totalExams / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExams = exams.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LIVE":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#ECFDF5] text-[#15803D] text-[12px] font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></div>
          Live
        </span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#EFF6FF] text-[#1D4ED8] text-[12px] font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]"></div>
          Completed
        </span>;
      case "SCHEDULED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FFFBEB] text-[#B45309] text-[12px] font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></div>
          Scheduled
        </span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#F1F5F9] text-stone-700 text-[12px] font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-stone-500"></div>
          {status}
        </span>;
    }
  };

  return (
    <div className="font-sans bg-[#FAFAFA] min-h-screen p-6 sm:p-8">
      <div className="space-y-10 animate-in fade-in duration-300 max-w-[2000px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="font-bold text-[32px] text-[#0B1C30] tracking-[-0.32px] leading-[38.4px]">
              Exams List
            </h1>
            <p className="text-[16px] font-normal text-[#464555] leading-[24px]">
              Select an exam to view detailed student participation and evaluate results.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="text-stone-400 font-medium">Loading exams...</span>
          </div>
        ) : (
          <>
            {/* ================= METRICS CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">TOTAL STUDENTS</p>
                  <h3 className="font-bold text-[24px] text-[#0B1C30] leading-[31.2px]">{totalStudents}</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">STUDENTS PASSED</p>
                  <h3 className="font-bold text-[24px] text-[#0B1C30] leading-[31.2px]">{passedStudents}</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">HIGHEST SCORE</p>
                  <h3 className="font-bold text-[24px] text-[#0B1C30] leading-[31.2px]">{validScores.length > 0 ? `${highestScore}/${maxForHighest}` : '--'}</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">LOWEST SCORE</p>
                  <h3 className="font-bold text-[24px] text-[#0B1C30] leading-[31.2px]">{validScores.length > 0 ? `${lowestScore}/${maxForLowest}` : '--'}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-[0px_4px_6px_rgba(0,0,0,0.02)] overflow-hidden mt-8">
            
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="font-sans font-semibold text-[18px] text-[#0B1C30]">
                  All Exams
                </h2>
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-stone-50 rounded-lg text-stone-500 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-stone-50 rounded-lg text-stone-500 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 bg-white">
                      <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                        EXAM TITLE
                      </th>
                      <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                        DATE
                      </th>
                      <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                        BATCH
                      </th>
                      <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                        DURATION & MARKS
                      </th>
                      <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                        STATUS
                      </th>
                      <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap text-right">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {paginatedExams.map(exam => (
                      <tr 
                        key={exam.id} 
                        className="hover:bg-stone-50/40 transition-colors cursor-pointer group"
                        onClick={() => router.push(`/admin/exam/results/exam/${exam.id}`)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-inter font-semibold text-[14px] text-[#0B1C30] group-hover:text-[#9B3434] transition-colors">{exam.title}</span>
                            <span className="font-inter font-normal text-[12px] text-[#777587]">{exam.examCode} • {exam.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-inter font-medium text-[13px] text-[#0B1C30]">{new Date(exam.date).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-inter font-medium text-[13px] text-[#0B1C30]">{exam.batchName}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-inter font-medium text-[13px] text-[#0B1C30]">
                            {exam.durationMins} mins • {exam.totalMarks} marks
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {exam.status === "LIVE" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#ECFDF5] text-[#15803D] text-[12px] font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></div>
                                Live
                              </span>
                            )}
                            {exam.status === "COMPLETED" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#EFF6FF] text-[#1D4ED8] text-[12px] font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]"></div>
                                Completed
                              </span>
                            )}
                            {exam.status === "SCHEDULED" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FFFBEB] text-[#B45309] text-[12px] font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></div>
                                Scheduled
                              </span>
                            )}
                            {!["LIVE", "COMPLETED", "SCHEDULED"].includes(exam.status) && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#F1F5F9] text-stone-700 text-[12px] font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-stone-500"></div>
                                {exam.status}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-rose-50 text-[11px] font-bold text-[#9B3434]">
                              {exam.submissionsCount} Subs
                            </span>
                            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#9B3434] transition-transform group-hover:translate-x-1" />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedExams.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-500 font-medium text-[14px]">
                          No exams found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-5 border-t border-stone-100 flex items-center justify-between bg-white">
                <span className="text-[13px] font-medium text-[#777587]">
                  Showing {totalExams > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, totalExams)} of {totalExams} results
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-[6px] text-[13px] font-medium text-stone-500 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] font-medium ${
                        currentPage === i + 1 
                          ? "bg-[#9B3434] text-white border border-[#9B3434]" 
                          : "border border-stone-200 text-stone-500 hover:bg-stone-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-[6px] text-[13px] font-medium text-stone-500 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

          </>
        )}

      </div>
    </div>
  );
}