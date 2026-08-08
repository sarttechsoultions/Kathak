import React from 'react';
import Link from 'next/link';
export default function ExamCommandCenter() {
  return (
    <div
      className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-8"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');
        `
      }} />

      <main className="max-w-[1200px] mx-auto">
        {/* Page Header (Title Area) */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#0B1C30] leading-[38.4px] tracking-[-0.8px]">
              Exam Command Center
            </h1>
            <p className="text-[16px] text-[#464555] leading-[25.6px] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Orchestrate and monitor all digital assessments across your departments.
            </p>
          </div>

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
  href="/teacher/exam/create" // Change this route to match wherever you save the new page
  className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-sm font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
  Create New Exam
</Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Total Exams */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">Total Exams</div>
              <div className="text-[48px] font-bold leading-[48px] tracking-[-0.96px] text-[#0B1C30]">124</div>
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
              <div className="text-[48px] font-bold leading-[48px] tracking-[-0.96px] text-[#0B1C30]">08</div>
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
              <div className="text-[48px] font-bold leading-[48px] tracking-[-0.96px] text-[#0B1C30]">15</div>
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
          {/* Schedule Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-[#0B1C30]">Exam Schedule</h2>
              <p className="text-sm text-gray-500 mt-0.5">View and manage upcoming and historical examination sessions.</p>
            </div>
            <div className="flex bg-[#F8F9FB] p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-bold bg-[#FFF1F1] text-[#A42E30] shadow-sm">All</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-semibold text-gray-500 hover:text-gray-700">Live</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-semibold text-gray-500 hover:text-gray-700">Scheduled</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-semibold text-gray-500 hover:text-gray-700">Draft</button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
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
              {/* Row 1 */}
              <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1.5fr_auto] items-center px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-[#0B1C30]">Advanced Macroeconomics - Finals</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: EX-2024-001</div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-[#F0F9FF] text-[#0284C7] text-xs font-bold tracking-wide">
                    B-COM-2024
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0B1C30]">Oct 24, 2023</div>
                  <div className="text-xs text-gray-500 mt-0.5">09:00 AM - 12:00 PM</div>
                </div>
                <div className="text-sm font-medium text-[#0B1C30]">180 Mins</div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1F1] text-[#A42E30] text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A42E30]"></span>
                    LIVE
                  </span>
                </div>
                <div className="flex justify-end">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z" /></svg>
                  </button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1.5fr_auto] items-center px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#0EA5E9] mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-[#0B1C30]">Data Structures & Algorithms</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: EX-2024-045</div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-[#F0F9FF] text-[#0284C7] text-xs font-bold tracking-wide">
                    CS-YEAR-2
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0B1C30]">Oct 26, 2023</div>
                  <div className="text-xs text-gray-500 mt-0.5">10:30 AM - 12:30 PM</div>
                </div>
                <div className="text-sm font-medium text-[#0B1C30]">120 Mins</div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F9FF] text-[#0284C7] text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]"></span>
                    SCHEDULED
                  </span>
                </div>
                <div className="flex justify-end">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z" /></svg>
                  </button>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1.5fr_auto] items-center px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#9CA3AF] mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-[#0B1C30]">Business Ethics Mid-Term</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: EX-2024-089</div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-[#F0F9FF] text-[#0284C7] text-xs font-bold tracking-wide">
                    MBA-Q3
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0B1C30]">Nov 02, 2023</div>
                  <div className="text-xs text-gray-500 mt-0.5">TBD</div>
                </div>
                <div className="text-sm font-medium text-[#0B1C30]">90 Mins</div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"></span>
                    DRAFT
                  </span>
                </div>
                <div className="flex justify-end">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z" /></svg>
                  </button>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1fr_1.5fr_auto] items-center px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#0EA5E9] mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-[#0B1C30]">Organic Chemistry Lab Theory</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: EX-2024-092</div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-[#F0F9FF] text-[#0284C7] text-xs font-bold tracking-wide">
                    BIO-CHEM
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0B1C30]">Oct 28, 2023</div>
                  <div className="text-xs text-gray-500 mt-0.5">02:00 PM - 03:30 PM</div>
                </div>
                <div className="text-sm font-medium text-[#0B1C30]">90 Mins</div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F9FF] text-[#0284C7] text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]"></span>
                    SCHEDULED
                  </span>
                </div>
                <div className="flex justify-end">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-6 border-t border-gray-100">
              <div className="text-sm text-gray-500 font-medium">Showing 1 to 4 of 124 exams</div>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold bg-[#A42E30] text-white">1</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">2</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">3</button>
                <button className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}