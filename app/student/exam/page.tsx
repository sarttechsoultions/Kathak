"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  CalendarClock,
  Eye,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

interface ExamItem {
  id: string;
  examCode: string;
  title: string;
  category: string;
  date: string;
  durationMins: number;
  totalMarks: number;
  score: string;
  status: "Upcoming" | "In Progress" | "Completed" | "Missed" | "LIVE";
  resultId: string | null;
}

const ITEMS_PER_PAGE = 10;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadgeClasses(status: string) {
  switch (status) {
    case "LIVE":           
      return "bg-rose-50 text-rose-600 border border-rose-200";
    case "Completed":
      return "bg-[#ECFDF5] text-[#059669]";
    case "Upcoming":
      return "bg-[#EFF6FF] text-[#2563EB]";
    case "In Progress":
      return "bg-[#FEF3C7] text-[#D97706]";
    case "Missed":
      return "bg-[#FEE2E2] text-[#DC2626]";
    default:
      return "bg-stone-100 text-stone-600";
  }
}

function statusDotClasses(status: string) {
  switch (status) {
    case "LIVE":
      return "bg-rose-600 animate-ping";
    case "Completed":
      return "bg-[#10B981]";
    case "Upcoming":
      return "bg-[#3B82F6]";
    case "In Progress":
      return "bg-[#F59E0B]";
    case "Missed":
      return "bg-[#EF4444]";
    default:
      return "bg-stone-400";
  }
}

function categoryBadgeClasses(category: string) {
  const map: Record<string, string> = {
    FINAL: "bg-[#EEF2FF] text-[#4F46E5]",
    MIDTERM: "bg-[#E0F2FE] text-[#0369A1]",
    MONTHLY: "bg-[#F0F9FF] text-[#0284C7]",
    THEORY: "bg-[#F0F9FF] text-[#0284C7]",
  };
  return map[category?.toUpperCase()] || "bg-stone-100 text-stone-600";
}

function getMinutesUntil(dateStr: string) {
  const diffMs = new Date(dateStr).getTime() - Date.now();
  return Math.round(diffMs / 60000);
}

export default function StudentExamsPage() {
  const router = useRouter();
  const [activeFilterTab, setActiveFilterTab] = useState<"All" | "Midterm" | "Final">("All");
  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const studentExamsEndpoint = (ENDPOINTS as Record<string, string>).STUDENT_EXAMS || "/student/exams";

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ data?: { exams?: ExamItem[] } }>(studentExamsEndpoint);
        if (res.data?.exams) {
          setExamsList(res.data.exams);
        }
      } catch (err) {
        console.error("Failed to fetch exams", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, [studentExamsEndpoint]);

  // ── Metrics (real, computed from data) ──
  const totalExams = examsList.length;
  const completedCount = examsList.filter((e) => e.status === "Completed").length;
  const upcomingCount = examsList.filter((e) => e.status === "Upcoming").length;
  const averageScore = useMemo(() => {
    const scored = examsList.filter((e) => e.status === "Completed" && e.score !== "--");
    if (scored.length === 0) return "—";
    const pct = scored.reduce((sum, e) => {
      const [obtained, total] = e.score.split("/").map(Number);
      return sum + (total > 0 ? (obtained / total) * 100 : 0);
    }, 0) / scored.length;
    return `${Math.round(pct)}%`;
  }, [examsList]);

  // ── Nearest upcoming exam for banner ──
  const nextUpcomingExam = useMemo(() => {
    const upcoming = examsList
      .filter((e) => e.status === "Upcoming")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] || null;
  }, [examsList]);

  // ── Tab filter ──
  const filteredExams = useMemo(() => {
    if (activeFilterTab === "All") return examsList;
    const target = activeFilterTab.toUpperCase();
    return examsList.filter((e) => e.category?.toUpperCase() === target);
  }, [examsList, activeFilterTab]);
  const totalPages = Math.max(1, Math.ceil(filteredExams.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExams = filteredExams.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTabChange = (tab: "All" | "Midterm" | "Final") => {
    setActiveFilterTab(tab);
    setCurrentPage(1);
  };

const handleViewExam = (exam: ExamItem) => {
  if (exam.resultId) {
    router.push(`/student/exam/results/${exam.resultId}`);
  } else if (exam.status === "Upcoming" || exam.status === "LIVE") {  
    router.push(`/student/exam/take/${exam.id}`);
  } else {
    alert("This exam is either missed or not available.");
  }
};

  return (
    <div className="font-sans text-[#0B1C30] min-h-screen bg-[#FAFAFA] p-6 sm:p-8">
      <div className="max-w-[1100px] mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* ================= UPCOMING EXAM BANNER ================= */}
        {nextUpcomingExam && (
          <div className="bg-[#FEF3C7] border border-[#D97706]/20 rounded-[16px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#D97706]" />
              </div>
              <div>
                <h2 className="font-bold text-[14px] text-[#0B1C30]">
                  Upcoming Exam: {nextUpcomingExam.title}
                </h2>
                <p className="text-[12px] text-[#D97706] font-medium mt-0.5">
                  {(() => {
                    const mins = getMinutesUntil(nextUpcomingExam.date);
                    if (mins <= 0) return "Starting now";
                    if (mins < 60) return `Starts in ${mins} minutes`;
                    const hrs = Math.floor(mins / 60);
                    return `Starts in ${hrs} hour${hrs > 1 ? "s" : ""} (${new Date(nextUpcomingExam.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })})`;
                  })()}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/student/${nextUpcomingExam.id}/attempt`)}
              className="px-6 py-2.5 rounded-[12px] bg-[#D97706] hover:bg-[#B45309] text-white text-[12px] font-bold transition-all shadow-sm shrink-0"
            >
              Join Exam Lobby
            </button>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="space-y-1.5">
          <h1 className="font-bold text-[32px] tracking-tight text-[#0B1C30]">
            My Examinations
          </h1>
          <p className="text-[16px] text-[#464555] max-w-2xl">
            Track your assessment history, monitor performance trends, and prepare for upcoming milestones.
          </p>
        </div>

        {/* ================= 4 METRIC CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Exams */}
          <div className="bg-white rounded-[20px] p-6 border border-stone-200/60 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#464555] mb-1">TOTAL EXAMS</p>
              <h3 className="font-bold text-[28px] leading-none text-[#0B1C30]">{isLoading ? "—" : totalExams}</h3>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-white rounded-[20px] p-6 border border-stone-200/60 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#464555] mb-1">COMPLETED</p>
              <h3 className="font-bold text-[28px] leading-none text-[#0B1C30]">{isLoading ? "—" : completedCount}</h3>
            </div>
          </div>

          {/* Card 3: Average Score */}
          <div className="bg-white rounded-[20px] p-6 border border-stone-200/60 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#464555] mb-1">AVERAGE SCORE</p>
              <h3 className="font-bold text-[28px] leading-none text-[#0B1C30]">{isLoading ? "—" : averageScore}</h3>
            </div>
          </div>

          {/* Card 4: Upcoming */}
          <div className="bg-white rounded-[20px] p-6 border border-stone-200/60 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#464555] mb-1">UPCOMING</p>
              <h3 className="font-bold text-[28px] leading-none text-[#0B1C30]">{isLoading ? "—" : upcomingCount}</h3>
            </div>
          </div>
        </div>

        {/* ================= ASSESSMENT HISTORY TABLE ================= */}
        <div className="bg-white rounded-[24px] border border-stone-200/60 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Section Header & Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-[20px] text-[#0B1C30]">Assessment History</h3>
              <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full border border-rose-100 uppercase tracking-wider">
                Academic Year {new Date().getFullYear()}
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-50 rounded-[10px] border border-stone-100">
              {(["All", "Midterm", "Final"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-5 py-1.5 rounded-[6px] text-[12px] font-bold transition-all ${
                    activeFilterTab === tab
                      ? "bg-white text-rose-600 shadow-sm border border-stone-200/50"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-stone-100 text-[11px] font-bold uppercase tracking-widest text-[#464555]">
                  <th className="py-4 px-2 w-[35%]">EXAM NAME</th>
                  <th className="py-4 px-2 w-[15%]">DATE</th>
                  <th className="py-4 px-2 w-[15%]">CATEGORY</th>
                  <th className="py-4 px-2 w-[15%]">SCORE</th>
                  <th className="py-4 px-2 w-[15%]">STATUS</th>
                  <th className="py-4 px-2 text-right w-[5%]">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[14px]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-stone-400 text-sm font-semibold">
                      Loading your exams...
                    </td>
                  </tr>
                ) : paginatedExams.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-stone-400 text-sm font-semibold">
                      No exams found.
                    </td>
                  </tr>
                ) : (
                  paginatedExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="py-5 px-2">
                        <span className="block font-bold text-[#0B1C30]">{exam.title}</span>
                        <span className="block text-[12px] text-[#464555] mt-0.5">Code: {exam.examCode}</span>
                      </td>
                      <td className="py-5 px-2 text-[#464555] font-medium">{formatDate(exam.date)}</td>
                      <td className="py-5 px-2">
                        <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${categoryBadgeClasses(exam.category)}`}>
                          {exam.category}
                        </span>
                      </td>
                      <td className={`py-5 px-2 font-bold ${exam.score !== "--" && exam.score.startsWith("0/") ? "text-rose-600" : exam.score === "--" ? "text-[#464555]" : "text-[#0B1C30]"}`}>
                        {exam.score}
                      </td>
                      <td className="py-5 px-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${statusBadgeClasses(exam.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDotClasses(exam.status)}`} />
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-5 px-2 text-right">
                        <button
                          onClick={() => handleViewExam(exam)}
                          className="p-2 text-rose-600/60 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-100">
            <span className="text-[12px] font-medium text-[#464555]">
              Showing {filteredExams.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredExams.length)} of {filteredExams.length} assessments
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-[#464555] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "w-8 h-8 flex items-center justify-center rounded-lg bg-[#9E0C25] text-white font-bold text-[13px]"
                      : "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-[#464555] font-bold text-[13px] transition-colors"
                  }
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-[#464555] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}