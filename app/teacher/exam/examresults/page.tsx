'use client';
import React from 'react';
import Link from 'next/link';

export default function ExamResults() {
  const students = [
    {
      id: 'KL-2024-0891',
      name: 'Elena Rodriguez',
      email: 'elena.rod@institution.edu',
      batch: 'Harmony Alpha 24',
      score: '92/100',
      status: 'Passed',
      img: 'https://i.pravatar.cc/150?img=47'
    },
    {
      id: 'KL-2024-0722',
      name: 'Julian Vance',
      email: 'j.vance@institution.edu',
      batch: 'Harmony Beta 24',
      score: '--',
      status: 'Absent',
      img: 'https://i.pravatar.cc/150?img=11'
    },
    {
      id: 'KL-2024-0445',
      name: 'Saki Nakamura',
      email: 'saki.n@institution.edu',
      batch: 'Harmony Alpha 24',
      score: '88/100',
      status: 'Passed',
      img: 'https://i.pravatar.cc/150?img=32'
    },
    {
      id: 'KL-2024-1102',
      name: 'Marcus Thorne',
      email: 'm.thorne@institution.edu',
      batch: 'Harmony Gamma 24',
      score: '42/100',
      status: 'Failed',
      img: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 'KL-2024-0556',
      name: 'Amina Patel',
      email: 'a.patel@institution.edu',
      batch: 'Harmony Alpha 24',
      score: '98/100',
      status: 'Passed',
      img: 'https://i.pravatar.cc/150?img=5'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1200px] mx-auto">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
              <span>Exam</span>
              <span>›</span>
              <span className="font-semibold text-[#0B1C30]">Exam Results</span>
            </div>
            <h1 className="text-[32px] font-bold text-[#0B1C30] leading-tight mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Exam Participation & Results
            </h1>
            <p className="text-sm text-gray-500">
              Detailed performance and attendance report for Final Assessment Cycle.
            </p>
          </div>
          
          <button className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#9333EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">TOTAL STUDENTS</div>
              <div className="text-[24px] font-bold leading-none text-[#0B1C30]">124</div>
            </div>
          </div>

          {/* Students Passed */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F4EB] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">STUDENTS PASSED</div>
              <div className="text-[24px] font-bold leading-none text-[#0B1C30]">108</div>
            </div>
          </div>

          {/* Highest Score */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">HIGHEST SCORE</div>
              <div className="text-[24px] font-bold leading-none text-[#0B1C30]">98/100</div>
            </div>
          </div>

          {/* Lowest Score */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">LOWEST SCORE</div>
              <div className="text-[24px] font-bold leading-none text-[#0B1C30]">42/100</div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Table Header Controls */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-[18px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Individual Exam Participation
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 13a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            {/* Headers */}
            <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] items-center px-6 py-4 bg-[#F8F9FB] border-b border-gray-100">
              <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">STUDENT NAME</div>
              <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">STUDENT ID</div>
              <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">BATCH NAME</div>
              <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">SCORE</div>
              <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">STATUS</div>
              <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase text-right">ACTIONS</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {students.map((student, index) => (
                <div key={index} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                  
                  {/* Name & Avatar */}
                  <div className="flex items-center gap-3">
                    <img src={student.img} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-[14px] text-[#0B1C30]">{student.name}</div>
                      <div className="text-[12px] text-gray-500">{student.email}</div>
                    </div>
                  </div>

                  {/* Student ID */}
                  <div className="text-[14px] font-semibold text-[#0B1C30]">
                    {student.id}
                  </div>

                  {/* Batch Name */}
                  <div className="text-[14px] text-gray-500">
                    {student.batch}
                  </div>

                  {/* Score */}
                  <div className="text-[14px] font-medium text-[#0B1C30]">
                    {student.score}
                  </div>

                  {/* Status Pill */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold
                      ${student.status === 'Passed' ? 'bg-[#E6F4EB] text-[#10B981]' : ''}
                      ${student.status === 'Absent' || student.status === 'Failed' ? 'bg-[#FEF2F2] text-[#EF4444]' : ''}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full 
                        ${student.status === 'Passed' ? 'bg-[#10B981]' : ''}
                        ${student.status === 'Absent' || student.status === 'Failed' ? 'bg-[#EF4444]' : ''}
                      `}></span>
                      {student.status}
                    </span>
                  </div>

                  {/* Actions - View Button with Link */}
                  <div className="flex justify-end pr-2">
                    {/* Yahan par link set kiya gaya hai jo detail page par le jayega */}
                   <Link href={`/teacher/exam/examresults/${student.id.toLowerCase()}`} className="text-[#A42E30] hover:text-[#8B2627] transition-colors p-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-6 border-t border-gray-100">
              <div className="text-[13px] text-gray-500 font-medium">Showing 1-5 of 124 results</div>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold bg-[#A42E30] text-white">1</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">2</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">3</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-semibold text-gray-400">...</button>
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