"use client";

import React, { useState } from "react";
import {
  Download,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Check,
  X,
  Share2,
  Award,
  Users,
  TrendingUp,
  Percent
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
      const res = await apiRequest("/admin/exams/results");
      if (res?.data?.results) {
        setResultsList(res.data.results);
      }
    } catch (err) {
      console.error("Failed to fetch exam results:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchExamResults();
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
    } catch (err: any) {
      alert(err?.message || "Failed to finalize evaluation.");
    }
  };

  return (
    <div>
      {/* ================= VIEW 1: EXAM PARTICIPATION & RESULTS MAIN TABLE ================= */}
      {!selectedStudentResult ? (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
                <span>Exam</span>
                <span>&gt;</span>
                <span className="text-[#9E0C25] font-bold">Exam Results</span>
              </div>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Exam Participation &amp; Results
              </h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500">
                Detailed performance and attendance report for Final Assessment Cycle.
              </p>
            </div>

            <button
              onClick={() => alert("Exporting Report PDF...")}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>

          {/* 4 Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL STUDENTS</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">124</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">STUDENTS PASSED</p>
                <h3 className="font-sans font-extrabold text-2xl text-emerald-600 mt-1">108</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">HIGHEST SCORE</p>
                <h3 className="font-sans font-extrabold text-2xl text-blue-600 mt-1">98/100</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">LOWEST SCORE</p>
                <h3 className="font-sans font-extrabold text-2xl text-rose-600 mt-1">42/100</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Individual Exam Participation Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg text-stone-900">Individual Exam Participation</h3>
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">STUDENT NAME</th>
                    <th className="py-3.5 px-4">STUDENT ID</th>
                    <th className="py-3.5 px-4">BATCH NAME</th>
                    <th className="py-3.5 px-4">SCORE</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {resultsList.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* Student Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.studentAvatar} alt={row.studentName} className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0" />
                          <div>
                            <button
                              onClick={() => handleOpenEvaluation(row)}
                              className="font-bold text-stone-900 text-sm hover:text-[#9E0C25] transition-colors cursor-pointer text-left block"
                            >
                              {row.studentName}
                            </button>
                            <span className="text-[11px] text-stone-400 font-medium block">{row.studentEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-4 px-4 font-bold text-stone-600">{row.studentIdCode}</td>

                      {/* Batch Name */}
                      <td className="py-4 px-4 font-bold text-stone-800">{row.batchName}</td>

                      {/* Score */}
                      <td className="py-4 px-4 font-extrabold text-stone-900 text-sm">{row.score}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold ${
                          row.status === "Passed"
                            ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200/60"
                            : row.status === "Absent"
                            ? "bg-rose-100/80 text-rose-700 border border-rose-200/60"
                            : "bg-red-100/80 text-red-700 border border-red-200/60"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "Passed" ? "bg-emerald-500" : "bg-rose-600"
                          }`} />
                          {row.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenEvaluation(row)}
                          title="View Detailed Student Exam Paper"
                          className="p-2 hover:text-[#9E0C25] hover:bg-rose-50 rounded-xl text-stone-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4.5 h-4.5 text-rose-700" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-400">
              <div>Showing 1-5 of 124 results</div>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-400 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">3</button>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ================= VIEW 2: STUDENT INDIVIDUAL EXAM EVALUATION (EXACT FIGMA MATCH) ================= */
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Back Navigation Link */}
          <button
            onClick={() => setSelectedStudentResult(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
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
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900">
                    {selectedStudentResult.studentName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9E0C25] text-[10.5px] font-extrabold border border-rose-200">
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
                <span className="text-[10px] font-extrabold uppercase text-stone-400 block">FINAL SCORE</span>
                <span className="font-sans font-extrabold text-2xl text-stone-900 block mt-0.5">
                  94 <span className="text-xs text-stone-400 font-bold">/ 100</span>
                </span>
              </div>

              <div className="bg-stone-50 px-5 py-3 rounded-2xl border border-stone-200/80 text-center">
                <span className="text-[10px] font-extrabold uppercase text-stone-400 block">PERCENTILE</span>
                <span className="font-sans font-extrabold text-2xl text-sky-600 block mt-0.5">98th</span>
              </div>

              <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200 text-center">
                <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                  PASSED
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT QUESTION REVIEW COLUMN */}
            <div className="flex-1 w-full space-y-6">
              
              {/* QUESTION 1 BOX */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#9E0C25] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h4 className="font-bold text-sm text-stone-900">Harmonic Progression Identification</h4>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-sky-100/80 text-sky-800 text-[10.5px] font-extrabold uppercase">
                    AWARD: 10 / 10 Points
                  </span>
                </div>

                <p className="text-xs font-semibold text-stone-700 leading-relaxed">
                  Identify the key and the final cadence used in the following four-bar phrase.
                </p>

                {/* Sheet Music / Diagram Asset Box */}
                <div className="relative aspect-[16/7] rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/kathak_course_dancer_1785146082697.jpg"
                    alt="Musical Notation / Kathak Stance"
                    className="w-full h-full object-cover opacity-85"
                  />
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                    REFERENCE ANSWER (TEACHER KEY)
                  </span>
                  <span className="font-bold text-xs text-stone-800 block">G Major, Authentic Cadence</span>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-950">G Major, Authentic Cadence</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[9px] uppercase">CORRECT</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">STUDENT SELECTION</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-1 opacity-60">
                    <span className="font-semibold text-xs text-stone-700">E Minor, Plagal Cadence</span>
                  </div>
                </div>

                {/* Teacher Feedback Input */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-stone-700">TEACHER FEEDBACK</label>
                  <textarea
                    rows={3}
                    placeholder="Add specific notes on the student's reasoning..."
                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>

              {/* QUESTION 2 BOX */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#9E0C25] text-white flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h4 className="font-bold text-sm text-stone-900">Modal Interchange Selection</h4>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-rose-100/80 text-rose-800 text-[10.5px] font-extrabold uppercase">
                    AWARD: 0 / 15 Points
                  </span>
                </div>

                <p className="text-xs font-semibold text-stone-700 leading-relaxed">
                  Which of the following chords represents a Borrowed Chord from the parallel minor in a C Major context?
                </p>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                    REFERENCE ANSWER (TEACHER KEY)
                  </span>
                  <span className="font-bold text-xs text-stone-800 block">Ab Major (bVI)</span>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border-2 border-rose-400 bg-rose-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-950">D Major (II)</span>
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold text-[9px] uppercase">INCORRECT</span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 uppercase block">STUDENT SELECTION</span>
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-950">Ab Major (bVI)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[9px] uppercase">CORRECT ANSWER</span>
                    </div>
                  </div>
                </div>

                {/* Teacher Feedback Input */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-stone-700">TEACHER FEEDBACK</label>
                  <textarea
                    rows={3}
                    defaultValue="Student seems to have confused Secondary Dominants with Modal Interchange. Review Session 4 materials."
                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: FINAL EVALUATION PANEL */}
            <div className="w-full lg:w-96 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <Award className="w-5 h-5 text-[#9E0C25]" />
                  <h3 className="font-sans font-bold text-base text-stone-900">Final Evaluation</h3>
                </div>

                <form onSubmit={handleVerifyResult} className="space-y-5">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Base System Score</span>
                    <span className="font-extrabold text-stone-900">92 / 100</span>
                  </div>

                  {/* Teacher Override Counter */}
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
                      <span className="font-extrabold text-stone-900">+{teacherOverride.toFixed(1)}</span>
                      <button
                        type="button"
                        onClick={() => setTeacherOverride(teacherOverride + 1)}
                        className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Manually Validated Score Card */}
                  <div className="p-4 rounded-2xl bg-[#9E0C25] text-white text-center shadow-md">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 block">
                      MANUALLY VALIDATED SCORE
                    </span>
                    <span className="font-sans font-extrabold text-3xl block mt-1">
                      94 <span className="text-sm font-bold text-white/70">/ 100</span>
                    </span>
                  </div>

                  {/* Overall Feedback */}
                  <div className="space-y-2">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      OVERALL FEEDBACK
                    </span>
                    <textarea
                      rows={4}
                      value={overallFeedback}
                      onChange={(e) => setOverallFeedback(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25] leading-relaxed"
                    />
                  </div>

                  {/* Toggle: Flag for Discussion */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-xs font-bold text-stone-800">Flag for Discussion</span>
                    <button
                      type="button"
                      onClick={() => setFlagDiscussion(!flagDiscussion)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        flagDiscussion ? "bg-[#9E0C25]" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        flagDiscussion ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
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

              {/* OTHER RECENT REVIEWS BOX */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 block">
                  OTHER RECENT REVIEWS
                </span>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/Sunita.png" alt="Liam" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span className="block font-bold text-xs text-stone-900">Liam Chen</span>
                        <span className="block text-[10px] text-stone-400 font-semibold">Score: 88/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/Meera.png" alt="Sofia" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <span className="block font-bold text-xs text-stone-900">Sofia Rodriguez</span>
                        <span className="block text-[10px] text-stone-400 font-semibold">Score: 91/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
