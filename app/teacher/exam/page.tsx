"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api'; // Make sure this path is correct for your project

// --- Interfaces ---
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
  status: string;
  creatorName: string;
  submissionsCount: number;
}

export default function ExamPage() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Pagination State
  const [activeTab, setActiveTab] = useState<"ALL" | "LIVE" | "SCHEDULED" | "DRAFT">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Fetch Data from Backend
  useEffect(() => {
    let isMounted = true;
    const fetchExams = async () => {
      try {
        setLoading(true);
        // Using the same getExams controller endpoint which handles Teacher logic safely
        const res = await apiRequest<{ data?: { exams?: ExamItem[] } }>("/admin/exams");
        if (isMounted && res?.data?.exams) {
          setExams(res.data.exams);
        }
      } catch (err) {
        console.error("Failed to load exams", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchExams();
    return () => { isMounted = false; };
  }, []);

  // --- Dynamic Stats Calculations ---
  const totalExams = exams.length;
  const activeToday = exams.filter(e => e.status === "LIVE").length;
  // Assuming pending results are roughly equal to submissions count for now (or customize as needed)
  const pendingResults = exams.reduce((sum, e) => sum + (e.submissionsCount || 0), 0);

  // --- Filtering Logic ---
  const filteredExams = useMemo(() => {
    if (activeTab === "ALL") return exams;
    return exams.filter(e => e.status.toUpperCase() === activeTab);
  }, [exams, activeTab]);

  // --- Pagination Logic ---
  const totalPages = Math.max(1, Math.ceil(filteredExams.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExams = filteredExams.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };

  // --- Helpers for Formatting ---
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const formatTimeRange = (dateStr: string, durationMins: number) => {
    const start = new Date(dateStr);
    const end = new Date(start.getTime() + durationMins * 60000);
    const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return `${start.toLocaleTimeString('en-US', opts)} - ${end.toLocaleTimeString('en-US', opts)}`;
  };

  // Status Badge UI Renderer (Matches your exact HTML)
  const renderStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    if (upperStatus === "LIVE") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1F1] text-[#A42E30] text-xs font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A42E30]"></span> LIVE
        </span>
      );
    }
    if (upperStatus === "SCHEDULED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F9FF] text-[#0284C7] text-xs font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]"></span> SCHEDULED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] text-xs font-bold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"></span> {upperStatus}
      </span>
    );
  };

  // Status Dot Renderer for the title section
  const renderStatusDot = (status: string) => {
    const upperStatus = status.toUpperCase();
    if (upperStatus === "LIVE") return "bg-[#EF4444]";
    if (upperStatus === "SCHEDULED") return "bg-[#0EA5E9]";
    return "bg-[#9CA3AF]";
  };

  return (
    <div
      className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-6 sm:p-8"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');
        `
      }} />

      <main className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
        {/* Page Header (Title Area) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#0B1C30] leading-[38.4px] tracking-[-0.8px]">
              Exam Command Center
            </h1>
            <p className="text-[16px] text-[#464555] leading-[25.6px] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Orchestrate and monitor all digital assessments across your assigned batches.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/teacher/exam/examresults" 
              className="bg-white border border-gray-200 hover:bg-gray-50 text-[#0B1C30] text-sm font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Results
            </Link>

            <Link 
              href="/teacher/exam/create"
              className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-sm font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Total Exams */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">Total Exams</div>
              <div className="text-[48px] font-bold leading-[48px] tracking-[-0.96px] text-[#0B1C30]">
                {loading ? "--" : totalExams.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFF1F1] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#A42E30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>

          {/* Active Today */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">Active Today</div>
              <div className="text-[48px] font-bold leading-[48px] tracking-[-0.96px] text-[#0B1C30]">
                {loading ? "--" : activeToday.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F0F9FF] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          {/* Pending Results */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">Pending Results</div>
              <div className="text-[48px] font-bold leading-[48px] tracking-[-0.96px] text-[#0B1C30]">
                {loading ? "--" : pendingResults.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F0F9FF] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {/* Schedule Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-100 gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0B1C30]">Exam Schedule</h2>
              <p className="text-sm text-gray-500 mt-0.5">View and manage upcoming and historical examination sessions.</p>
            </div>
            <div className="flex bg-[#F8F9FB] p-1 rounded-lg overflow-x-auto">
              <button 
                onClick={() => { setActiveTab("ALL"); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${activeTab === "ALL" ? "font-bold bg-[#FFF1F1] text-[#A42E30] shadow-sm" : "font-semibold text-gray-500 hover:text-gray-700"}`}
              >All</button>
              <button 
                onClick={() => { setActiveTab("LIVE"); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${activeTab === "LIVE" ? "font-bold bg-[#FFF1F1] text-[#A42E30] shadow-sm" : "font-semibold text-gray-500 hover:text-gray-700"}`}
              >Live</button>
              <button 
                onClick={() => { setActiveTab("SCHEDULED"); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${activeTab === "SCHEDULED" ? "font-bold bg-[#FFF1F1] text-[#A42E30] shadow-sm" : "font-semibold text-gray-500 hover:text-gray-700"}`}
              >Scheduled</button>
              <button 
                onClick={() => { setActiveTab("DRAFT"); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${activeTab === "DRAFT" ? "font-bold bg-[#FFF1F1] text-[#A42E30] shadow-sm" : "font-semibold text-gray-500 hover:text-gray-700"}`}
              >Draft</button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Table Header */}
              <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1.5fr_auto] items-center px-6 py-4 bg-[#F8F9FB] border-b border-gray-100">
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">EXAM TITLE</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">BATCH/COURSE</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">DATE & TIME</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">DURATION</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">STATUS</div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase text-right">ACTIONS</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-12 text-center text-sm font-semibold text-gray-500">Loading schedules...</div>
                ) : paginatedExams.length === 0 ? (
                  <div className="p-12 text-center text-sm font-semibold text-gray-500">No exams found for this category.</div>
                ) : (
                  paginatedExams.map((exam) => (
                    <div key={exam.id} className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1.5fr_auto] items-center px-6 py-5 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full ${renderStatusDot(exam.status)} mt-1.5 flex-shrink-0`}></div>
                        <div>
                          <div className="font-bold text-[#0B1C30]">{exam.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">ID: {exam.examCode}</div>
                        </div>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-[#F0F9FF] text-[#0284C7] text-xs font-bold tracking-wide">
                          {exam.batchName || exam.courseName}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#0B1C30]">{formatDate(exam.date)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{formatTimeRange(exam.date, exam.durationMins)}</div>
                      </div>
                      <div className="text-sm font-medium text-[#0B1C30]">{exam.durationMins} Mins</div>
                      <div>
                        {renderStatusBadge(exam.status)}
                      </div>
                      <div className="flex justify-end">
                        <button className="text-gray-400 hover:text-[#A42E30] transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z" /></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          {!loading && filteredExams.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredExams.length)} of {filteredExams.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="text-xs font-bold text-gray-700 px-2">Page {currentPage} of {totalPages}</div>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}