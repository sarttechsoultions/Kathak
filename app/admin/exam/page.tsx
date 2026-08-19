"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreVertical,
  FileText,
  Zap,
  AlignLeft,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface ExamItem {
  id: string;
  examCode: string;
  title: string;
  courseName?: string;
  batchName?: string;
  date?: string;
  durationMins?: number;
  status: "LIVE" | "SCHEDULED" | "DRAFT" | "COMPLETED";
}

export default function ExamsListPage() {
  const router = useRouter();
  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilterTab, setActiveFilterTab] = useState<"All" | "Live" | "Scheduled" | "Draft">("All");

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/admin/exams");
      if (res?.data?.exams) {
        setExamsList(res.data.exams);
      }
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchExams());
  }, []);

  const filteredExams = examsList.filter((exam) => {
    if (activeFilterTab === "All") return true;
    return exam.status.toUpperCase() === activeFilterTab.toUpperCase();
  });

  return (
    <div className="font-sans text-[#0B1C30]">
      <div className="space-y-8 animate-in fade-in duration-300 max-w-full">
        
        {/* Header & Create Exam Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-sans font-bold text-4xl text-[#0B1C30] tracking-tight">
              Exam Command Center
            </h1>
            <p className="text-base text-stone-500">
              Orchestrate and monitor all digital assessments across your departments.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/exam/create")}
            className="px-6 py-3 rounded-lg bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Exam</span>
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">TOTAL EXAMS</p>
              <h3 className="font-sans font-bold text-4xl text-[#0B1C30]">{examsList.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">ACTIVE TODAY</p>
              <h3 className="font-sans font-bold text-4xl text-[#0B1C30]">
                {examsList.filter((e) => e.status === "LIVE").length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">PENDING RESULTS</p>
              <h3 className="font-sans font-bold text-4xl text-[#0B1C30]">0</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <AlignLeft className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Exam Schedule Table Box */}
        <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-stone-100">
            <div>
              <h3 className="font-sans font-semibold text-lg text-[#0B1C30]">Exam Schedule</h3>
              <p className="text-sm text-stone-500">View and manage upcoming and historical examination sessions.</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
              {(["All", "Live", "Scheduled", "Draft"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilterTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                    activeFilterTab === tab
                      ? "bg-white text-[#0B1C30] shadow-sm"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-4 px-2">EXAM TITLE</th>
                  <th className="py-4 px-2">COURSE / BATCH</th>
                  <th className="py-4 px-2">DATE & TIME</th>
                  <th className="py-4 px-2">DURATION</th>
                  <th className="py-4 px-2">STATUS</th>
                  <th className="py-4 px-2 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm text-[#0B1C30]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                      Loading exams...
                    </td>
                  </tr>
                ) : filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-start gap-2">
                          <div className="mt-1.5 shrink-0">
                            <div className={`w-2 h-2 rounded-full ${
                              exam.status === "LIVE" ? "bg-rose-500" :
                              exam.status === "SCHEDULED" ? "bg-sky-400" :
                              "bg-stone-400"
                            }`} />
                          </div>
                          <div>
                            <span className="block font-bold text-sm">{exam.title}</span>
                            <span className="block text-[11px] text-stone-500 uppercase mt-0.5">{`ID: ${exam.examCode}`}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* 👇 COURSE / BATCH COMBINED COLUMN 👇 */}
                      <td className="py-4 px-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/70 border border-blue-100 text-[#006591] text-xs font-bold rounded-lg">
                          <span>{exam.courseName && exam.courseName !== "All Courses" ? exam.courseName : "All Courses"}</span>
                          {exam.batchName && exam.batchName !== "All Batches" && (
                            <>
                              <span className="text-blue-300">/</span>
                              <span className="text-blue-800">{exam.batchName}</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-2">
                        <div className="text-sm">
                          <span className="block">
                            {exam.date ? new Date(exam.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}
                          </span>
                          <span className="block text-stone-500 text-xs mt-0.5">
                            {exam.date ? new Date(exam.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "TBD"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm">
                        {exam.durationMins ? `${exam.durationMins} Mins` : "120 Mins"}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          exam.status === "LIVE"
                            ? "bg-rose-50 text-rose-600"
                            : exam.status === "SCHEDULED"
                            ? "bg-sky-50 text-sky-500"
                            : "bg-stone-100 text-stone-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            exam.status === "LIVE" ? "bg-rose-500" : exam.status === "SCHEDULED" ? "bg-sky-400" : "bg-stone-400"
                          }`} />
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer inline-flex justify-center items-center">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-stone-300" />
                        </div>
                        <p className="text-stone-500 font-bold text-sm">No exams found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && examsList.length > 0 && (
            <div className="flex items-center justify-between pt-4 mt-2">
              <span className="text-xs text-stone-500">
                Showing {filteredExams.length > 0 ? 1 : 0} to {filteredExams.length} of {examsList.length} exams
              </span>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 text-stone-400 cursor-not-allowed">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#9E0C25] text-white font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 text-stone-400 cursor-not-allowed">&gt;</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}