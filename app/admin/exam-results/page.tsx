"use client";

import React, { useState } from "react";
import {
  Download,
  Filter,
  ArrowLeft,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Users,
  Award
} from "lucide-react";

import { apiRequest } from "@/lib/api";

interface StudentExamResultItem {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  studentIdCode: string;
  batchName: string;
  score: string;
  status: "Passed" | "Absent" | "Failed";
}

export default function ExamResultsView() {
  const [resultsList, setResultsList] = useState<StudentExamResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentResult, setSelectedStudentResult] = useState<StudentExamResultItem | null>(null);

  // Evaluation Form State
  const [teacherOverride, setTeacherOverride] = useState(2.0);
  const [flagDiscussion, setFlagDiscussion] = useState(false);
  const [overallFeedback, setOverallFeedback] = useState("");

  const fetchExamResults = async () => {
    try {
      setLoading(true);
      // Fallback mock data if API fails during UI building
      const res = await apiRequest("/admin/exams/results").catch(() => null);
      if (res?.data?.results) {
        setResultsList(res.data.results);
      } else {
        // Dummy data exactly matching Figma for UI testing
        setResultsList([
          { id: "1", studentName: "Elena Rodriguez", studentEmail: "elena.rod@institution.edu", studentAvatar: "/Meera.png", studentIdCode: "KL-2024-0891", batchName: "Harmony Alpha 24", score: "92/100", status: "Passed" },
          { id: "2", studentName: "Julian Vance", studentEmail: "j.vance@institution.edu", studentAvatar: "/Sunita.png", studentIdCode: "KL-2024-0722", batchName: "Harmony Beta 24", score: "--", status: "Absent" },
          { id: "3", studentName: "Saki Nakamura", studentEmail: "saki.n@institution.edu", studentAvatar: "/Meera.png", studentIdCode: "KL-2024-0445", batchName: "Harmony Alpha 24", score: "88/100", status: "Passed" },
          { id: "4", studentName: "Marcus Thorne", studentEmail: "m.thorne@institution.edu", studentAvatar: "/Sunita.png", studentIdCode: "KL-2024-1102", batchName: "Harmony Gamma 24", score: "42/100", status: "Failed" },
          { id: "5", studentName: "Amina Patel", studentEmail: "a.patel@institution.edu", studentAvatar: "/Meera.png", studentIdCode: "KL-2024-0556", batchName: "Harmony Alpha 24", score: "98/100", status: "Passed" },
        ]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch exam results:", msg);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const loadExamResults = async () => {
      await Promise.resolve();
      await fetchExamResults();
    };

    void loadExamResults();
  }, []);

  const handleOpenEvaluation = (student: StudentExamResultItem) => {
    setSelectedStudentResult(student);
  };

  const handleVerifyResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentResult?.id) return;

    try {
      const rawScore = selectedStudentResult.score.split("/")[0] || "0";
      await apiRequest(`/admin/exams/results/${selectedStudentResult.id}/evaluate`, {
        method: "POST",
        body: JSON.stringify({
          grade: rawScore,
          feedback: overallFeedback || "Exam evaluation finalized.",
          status: "GRADED"
        }),
      });

      alert(`Result for "${selectedStudentResult.studentName}" verified & finalized!`);
      setSelectedStudentResult(null);
      fetchExamResults();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg || "Failed to finalize evaluation.");
    }
  };

  return (
    <div className="font-sans bg-[#FAFAFA] min-h-screen p-6 sm:p-8">
      {/* ================= VIEW 1: EXAM PARTICIPATION & RESULTS MAIN TABLE ================= */}
      {!selectedStudentResult ? (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[12px] font-semibold text-stone-500 mb-2">
                <span>Exam</span>
                <span>&gt;</span>
                <span className="text-[#0B1C30] font-bold">Exam Results</span>
              </div>
              
              <h1 className="font-bold text-[32px] text-[#0B1C30] tracking-[-0.32px] leading-[38.4px]">
                Exam Participation &amp; Results
              </h1>
              <p className="text-[16px] font-normal text-[#464555] leading-[24px]">
                Detailed performance and attendance report for Final Assessment Cycle.
              </p>
            </div>

            <button
              onClick={() => alert("Exporting Report PDF...")}
              className="px-5 py-2.5 rounded-xl bg-[#9B3434] hover:bg-[#7A2828] text-white font-semibold text-[14px] shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>

          {/* 4 Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">TOTAL STUDENTS</p>
                <h3 className="font-semibold text-[24px] text-[#0B1C30] leading-[31.2px]">124</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">STUDENTS PASSED</p>
                <h3 className="font-semibold text-[24px] text-[#0B1C30] leading-[31.2px]">108</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">HIGHEST SCORE</p>
                <h3 className="font-semibold text-[24px] text-[#0B1C30] leading-[31.2px]">98/100</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.6px] text-[#777587] mb-1">LOWEST SCORE</p>
                <h3 className="font-semibold text-[24px] text-[#0B1C30] leading-[31.2px]">42/100</h3>
              </div>
            </div>
          </div>

          {/* Individual Exam Participation Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-semibold text-[18px] text-[#0B1C30] leading-[25.2px]">Individual Exam Participation</h3>
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-[0.6px] text-[#777587]">
                    <th className="py-4 px-2 w-[25%]">STUDENT NAME</th>
                    <th className="py-4 px-2 w-[15%]">STUDENT ID</th>
                    <th className="py-4 px-2 w-[20%]">BATCH NAME</th>
                    <th className="py-4 px-2 w-[15%]">SCORE</th>
                    <th className="py-4 px-2 w-[15%]">STATUS</th>
                    <th className="py-4 px-2 text-right w-[10%]">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {resultsList.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50/50 transition-colors">
                      
                      {/* Student Name */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.studentAvatar} alt={row.studentName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                          <div>
                            <span className="block font-semibold text-[16px] text-[#0B1C30] leading-[24px]">
                              {row.studentName}
                            </span>
                            <span className="block font-normal text-[12px] text-[#777587] leading-[16px]">
                              {row.studentEmail}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-4 px-2 font-medium text-[13px] text-[#0B1C30] leading-[13px]">
                        {row.studentIdCode}
                      </td>

                      {/* Batch Name */}
                      <td className="py-4 px-2 font-medium text-[13px] text-[#0B1C30] leading-[13px]">
                        {row.batchName}
                      </td>

                      {/* Score */}
                      <td className="py-4 px-2 font-medium text-[13px] text-[#0B1C30] leading-[13px]">
                        {row.score}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
                          row.status === "Passed"
                            ? "bg-[#ECFDF5] text-[#059669]"
                            : row.status === "Absent"
                            ? "bg-[#FEF2F2] text-[#DC2626]"
                            : "bg-[#FEF2F2] text-[#DC2626]"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "Passed" ? "bg-[#10B981]" : "bg-[#EF4444]"
                          }`} />
                          {row.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-2 text-right">
                        <button
                          onClick={() => handleOpenEvaluation(row)}
                          title="View Detailed Student Exam Paper"
                          className="p-2 text-rose-600/60 hover:text-[#9B3434] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-100">
              <div className="text-[12px] font-medium text-[#777587]">Showing 1-5 of 124 results</div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg border border-stone-200 text-[#777587] flex items-center justify-center cursor-not-allowed hover:bg-stone-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#9B3434] text-white font-bold text-[13px] flex items-center justify-center transition-colors">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg border border-stone-200 text-[#464555] hover:bg-stone-50 font-bold text-[13px] flex items-center justify-center transition-colors">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg border border-stone-200 text-[#464555] hover:bg-stone-50 font-bold text-[13px] flex items-center justify-center transition-colors">
                  3
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-[#777587]">...</span>
                <button className="w-8 h-8 rounded-lg border border-stone-200 text-[#777587] hover:bg-stone-50 flex items-center justify-center cursor-pointer transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ================= VIEW 2: STUDENT INDIVIDUAL EXAM EVALUATION ================= */
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          {/* Back Navigation Link */}
          <button
            onClick={() => setSelectedStudentResult(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9B3434] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Exam Participation &amp; Results</span>
          </button>

          {/* Student Profile Score Banner Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedStudentResult.studentAvatar}
                alt={selectedStudentResult.studentName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md bg-stone-100 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-[#0B1C30]">
                    {selectedStudentResult.studentName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9B3434] text-[10.5px] font-extrabold border border-rose-200">
                    {selectedStudentResult.studentIdCode}
                  </span>
                </div>
                <p className="text-xs font-semibold text-stone-600">Advanced Harmony - Finals</p>
                <p className="text-xs font-semibold text-rose-700 font-mono">Spring Semester 2024</p>
              </div>
            </div>

            {/* Score Metric Cards */}
            <div className="flex items-center gap-4 self-end sm:self-center">
              <div className="bg-stone-50 px-5 py-3 rounded-2xl border border-stone-200/80 text-center">
                <span className="text-[10px] font-extrabold uppercase text-[#777587] block">FINAL SCORE</span>
                <span className="font-sans font-extrabold text-2xl text-[#0B1C30] block mt-0.5">
                  {selectedStudentResult.score.split("/")[0] || "--"} <span className="text-xs text-[#777587] font-bold">/ 100</span>
                </span>
              </div>

              <div className="bg-stone-50 px-5 py-3 rounded-2xl border border-stone-200/80 text-center">
                <span className="text-[10px] font-extrabold uppercase text-[#777587] block">PERCENTILE</span>
                <span className="font-sans font-extrabold text-2xl text-sky-600 block mt-0.5">98th</span>
              </div>

              <div className="bg-[#ECFDF5] px-4 py-3 rounded-2xl border border-green-100 text-center">
                <span className="text-[#15803D] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 fill-[#15803D] text-white" />
                  PASSED
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* LEFT QUESTION REVIEW COLUMN */}
            <div className="flex-1 w-full space-y-6">
              
              {/* Dummy Question for UI Demo */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#9B3434] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h4 className="font-bold text-sm text-[#0B1C30]">Harmonic Progression Identification</h4>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-sky-100/80 text-sky-800 text-[10.5px] font-extrabold uppercase">
                    AWARD: 10 / 10 Points
                  </span>
                </div>

                <p className="text-[16px] text-[#0B1C30] leading-[26px]">
                  Identify the key and the final cadence used in the following four-bar phrase.
                </p>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#777587] block">
                    REFERENCE ANSWER (TEACHER KEY)
                  </span>
                  <span className="font-bold text-xs text-[#0B1C30] block">G Major, Authentic Cadence</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-[#0B1C30]">TEACHER FEEDBACK</label>
                  <textarea
                    rows={3}
                    placeholder="Add specific notes on the student's reasoning..."
                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-[14px] text-[#0B1C30] focus:bg-white focus:outline-none focus:border-[#9B3434]"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FINAL EVALUATION PANEL */}
            <div className="w-full lg:w-96 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <Award className="w-5 h-5 text-[#9B3434]" />
                  <h3 className="font-sans font-bold text-base text-[#0B1C30]">Final Evaluation</h3>
                </div>

                <form onSubmit={handleVerifyResult} className="space-y-5">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Base System Score</span>
                    <span className="font-extrabold text-[#0B1C30]">92 / 100</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Teacher Overrides</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTeacherOverride(Math.max(0, teacherOverride - 1))}
                        className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-[#0B1C30]">+{teacherOverride.toFixed(1)}</span>
                      <button
                        type="button"
                        onClick={() => setTeacherOverride(teacherOverride + 1)}
                        className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#9B3434] text-white text-center shadow-md">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 block">
                      MANUALLY VALIDATED SCORE
                    </span>
                    <span className="font-sans font-extrabold text-3xl block mt-1">
                      94 <span className="text-sm font-bold text-white/70">/ 100</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#777587] block">
                      OVERALL FEEDBACK
                    </span>
                    <textarea
                      rows={4}
                      value={overallFeedback}
                      onChange={(e) => setOverallFeedback(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-[14px] text-[#0B1C30] focus:bg-white focus:outline-none focus:border-[#9B3434] leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-xs font-bold text-[#0B1C30]">Flag for Discussion</span>
                    <button
                      type="button"
                      onClick={() => setFlagDiscussion(!flagDiscussion)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        flagDiscussion ? "bg-[#9B3434]" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        flagDiscussion ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#9B3434] hover:bg-[#7A2828] text-white font-bold text-xs shadow-sm transition-all cursor-pointer text-center"
                    >
                      Verify &amp; Finalize Result
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Downloading PDF Report...")}
                      className="w-full py-3 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer text-center"
                    >
                      Download PDF Report
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}