"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MoreVertical,
  Filter,
  ArrowLeft
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface StudentAttempt {
  id: string; // studentId
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  studentIdCode: string;
  batchName: string;
  resultId: string | null;
  marksObtained: number | null;
  totalMarks: number;
  score: string;
  status: "Passed" | "Pending" | "Failed" | "Absent" | string;
  submittedAt: string | null;
}
interface ExamInfo {
  id: string;
  title: string;
  totalMarks: number;
}

export default function ExamStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [students, setStudents] = useState<StudentAttempt[]>([]);
const [examInfo, setExamInfo] = useState<ExamInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Image shows 5 results per page

  useEffect(() => {
    let isMounted = true;
    const fetchStudents = async () => {
      try {
        setLoading(true);
const res = await apiRequest<{ data?: { exam: ExamInfo, students: StudentAttempt[] } }>(
    `/admin/exams/${examId}/students`
  );
        if (isMounted && res?.data) {
          setExamInfo(res.data.exam);
          setStudents(res.data.students);
        }
      } catch (err) {
        console.error("Failed to fetch students for exam:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (examId) fetchStudents();
    return () => { isMounted = false; };
  }, [examId]);

  // Calculations
  const totalStudents = students.length;
  const passedStudents = students.filter(s => s.status === "Passed").length;
  
  const validScores = students.filter(s => s.marksObtained !== null && s.marksObtained !== undefined);
  const highestScore = validScores.length > 0 ? Math.max(...validScores.map(s => s.marksObtained!)) : 0;
  const lowestScore = validScores.length > 0 ? Math.min(...validScores.map(s => s.marksObtained!)) : 0;
  const maxPossibleScore = examInfo?.totalMarks || 100;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalStudents / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = students.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-stone-500 bg-[#FAFAFA]">Loading Students...</div>;
  }

  return (
    <div className="font-sans bg-[#FAFAFA] min-h-screen p-6 sm:p-8">
      <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-stone-500 mb-2 cursor-pointer" onClick={() => router.push("/admin/exam/results")}>
              <span className="hover:text-stone-700 hover:underline">Exam</span>
              <span>&gt;</span>
              <span className="text-[#0B1C30] font-bold">Exam Results</span>
            </div>
            
            <h1 className="font-bold text-[32px] text-[#0B1C30] tracking-[-0.32px] leading-[38.4px]">
              Exam Participation &amp; Results
            </h1>
            <p className="text-[16px] font-normal text-[#464555] leading-[24px]">
              Detailed performance and attendance report for {examInfo?.title || "Final Assessment Cycle"}.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-[#9B3434] hover:bg-[#7A2828] text-white font-semibold text-[14px] shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

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
              <h3 className="font-bold text-[24px] text-[#0B1C30] leading-[31.2px]">{highestScore}/{maxPossibleScore}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0px_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">LOWEST SCORE</p>
              <h3 className="font-bold text-[24px] text-[#0B1C30] leading-[31.2px]">{lowestScore}/{maxPossibleScore}</h3>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-[0px_4px_6px_rgba(0,0,0,0.02)] overflow-hidden">
          
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-sans font-semibold text-[18px] text-[#0B1C30]">
              Individual Exam Participation
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
                <tr className="border-b border-stone-100">
                  <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                    STUDENT NAME
                  </th>
                  <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                    STUDENT ID
                  </th>
                  <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                    BATCH NAME
                  </th>
                  <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                    SCORE
                  </th>
                  <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap">
                    STATUS
                  </th>
                  <th className="py-4 px-6 font-inter font-semibold text-[12px] text-[#464555] uppercase tracking-[0.6px] whitespace-nowrap text-center">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedStudents.map((s, index) => (
                  <tr key={s.id || index} className="hover:bg-stone-50/40 transition-colors">
                    
                    <td className="py-4 px-6 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.studentAvatar || "/placeholder.png"}
                          alt={s.studentName}
                          className="w-10 h-10 rounded-full object-cover bg-stone-100 shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                        />
                        <div className="flex flex-col">
                          <span className="font-inter font-semibold text-[14px] text-[#0B1C30] leading-[20px]">
                            {s.studentName}
                          </span>
                          <span className="font-inter font-normal text-[12px] text-[#777587] leading-[16px]">
                            {s.studentEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-inter font-medium text-[13px] text-[#0B1C30]">
                        {s.studentIdCode}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-inter font-medium text-[13px] text-[#0B1C30]">
                        {s.batchName}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-inter font-medium text-[14px] text-[#0B1C30]">
                        {s.status === "Absent" ? "--" : s.score}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {s.status === "Passed" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#ECFDF5] text-[#15803D] text-[12px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></div>
                            Passed
                          </span>
                        )}
                        {s.status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FFFBEB] text-[#B45309] text-[12px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#B45309]"></div>
                            Pending
                          </span>
                        )}
                        {s.status === "Failed" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FEF2F2] text-[#DC2626] text-[12px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></div>
                            Failed
                          </span>
                        )}
                        {s.status === "Absent" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FEF2F2] text-[#DC2626] text-[12px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></div>
                            Absent
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        {s.status !== "Absent" && s.resultId ? (
                          <button
                            onClick={() => router.push(`/admin/exam/results/evaluate/${s.resultId}`)}
                            className="p-1.5 rounded-lg text-[#9B3434] hover:bg-rose-50 transition-colors"
                            title="Evaluate"
                          >
                            <Eye className="w-[18px] h-[18px]" />
                          </button>
                        ) : (
                          <button disabled className="p-1.5 rounded-lg text-[#9B3434] opacity-50 cursor-not-allowed">
                            <Eye className="w-[18px] h-[18px]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-500 font-medium text-[14px]">
                      No students found for this exam.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#777587]">
              Showing {totalStudents > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, totalStudents)} of {totalStudents} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-[6px] text-[13px] font-medium text-stone-500 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              
              {/* Simple page numbers */}
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
      </div>
    </div>
  );
}
