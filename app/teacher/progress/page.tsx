'use client';
import React from 'react';
import Link from 'next/link';

export default function StudentProgressHub() {
  const students = [
    {
      id: 'BN-2024-042',
      name: 'Priya Iyer',
      level: 'Intermediate Level',
      exams: '5/5',
      assignments: '14/14',
      video: '10/10',
      progress: '100%',
      progressColor: 'text-[#A42E30]',
      img: 'https://i.pravatar.cc/150?img=47'
    },
    {
      id: 'BN-2024-089',
      name: 'Arjun Nair',
      level: 'Intermediate Level',
      exams: '4/5',
      assignments: '12/14',
      video: '8/10',
      progress: '82%',
      progressColor: 'text-[#0EA5E9]',
      img: 'https://i.pravatar.cc/150?img=11'
    },
    {
      id: 'BN-2024-112',
      name: 'Meera Reddy',
      level: 'Intermediate Level',
      exams: '2/5',
      assignments: '7/14',
      video: '4/10',
      progress: '45%',
      progressColor: 'text-[#D97706]',
      img: 'https://i.pravatar.cc/150?img=32'
    },
    {
      id: 'BN-2024-055',
      name: 'Kavya Suresh',
      level: 'Intermediate Level',
      exams: '5/5',
      assignments: '13/14',
      video: '9/10',
      progress: '92%',
      progressColor: 'text-[#A42E30]',
      img: 'https://i.pravatar.cc/150?img=5'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 text-[#0B1C30]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1100px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0B1C30] tracking-tight mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Student Progress Hub
            </h1>
            <div className="flex items-center gap-2 text-[14px] text-[#464555]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Monitoring performance across active batches
            </div>
          </div>
          
          <button className="bg-[#9D3C39] hover:bg-[#85322F] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-5">
          {/* Total Students */}
          <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">
              TOTAL STUDENTS
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-[#0B1C30] leading-none">32</span>
              <span className="text-[14px] font-semibold text-[#3525CD]">+4 this month</span>
            </div>
          </div>

          {/* Avg Attendance */}
          <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">
              AVG. ATTENDANCE
            </div>
            <div className="text-[32px] font-bold text-[#0B1C30] leading-none">94.2%</div>
          </div>

          {/* Avg Performance */}
          <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">
              AVG. PERFORMANCE
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-[#0B1C30] leading-none">8.4<span className="text-[20px] text-gray-400 font-semibold">/10</span></span>
              <span className="text-[14px] font-medium text-gray-500">Stable</span>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">
              PENDING REVIEWS
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-[#D97706] leading-none">12</span>
              <span className="text-[14px] font-medium text-gray-500">Tasks</span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {/* Table Header Controls */}
          <div className="flex items-center justify-between p-6 bg-white">
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Student Rosters & Metrics
              </h2>
              <span className="bg-[#FFF1F1] text-[#9D3C39] px-3 py-1 rounded-full text-[12px] font-semibold">
                Showing 32 Students
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 text-[#0B1C30] text-[13px] font-medium py-2 pl-4 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-gray-200">
                  <option>Bharatnatyam Intermediate - Batch B</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              </button>
              <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            {/* Column Headers */}
            <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr_auto] items-center px-6 py-3 bg-[#F8F9FB] border-y border-gray-100">
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase">STUDENT NAME</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase">STUDENT ID</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase text-center">EXAMS TAKEN</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase text-center">ASSIGNMENTS</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase text-center">VIDEO TASKS</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase text-center">OVERALL PROGRESS</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase text-right w-12">ACTIONS</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {students.map((student, idx) => (
                <div key={idx} className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                  
                  {/* Name & Avatar */}
                  <div className="flex items-center gap-3">
                    <img src={student.img} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-[14px] text-[#0B1C30]">{student.name}</div>
                      <div className="text-[12px] text-gray-500">{student.level}</div>
                    </div>
                  </div>

                  {/* Student ID */}
                  <div className="text-[13px] text-gray-600 font-medium">{student.id}</div>

                  {/* Exams */}
                  <div className="text-[14px] font-medium text-[#0B1C30] text-center">{student.exams}</div>

                  {/* Assignments */}
                  <div className="text-[14px] font-medium text-[#0B1C30] text-center">{student.assignments}</div>

                  {/* Video Tasks */}
                  <div className="text-[14px] font-medium text-[#0B1C30] text-center">{student.video}</div>

                  {/* Progress */}
                  <div className={`text-[14px] font-semibold text-center ${student.progressColor}`}>
                    {student.progress}
                  </div>

                  {/* Actions */}
                 <div className="flex justify-end w-12">
  <Link 
    href={`/teacher/progress/${student.id.toLowerCase()}`} // Apne actual route ke hisaab se path adjust kar lein
    className={`${student.progressColor} hover:opacity-80 transition-opacity p-1`}
  >
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
              <div className="text-[13px] text-gray-500 font-medium">Showing 1 to 4 of 32 students</div>
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-7 h-7 rounded flex items-center justify-center text-[13px] font-semibold bg-[#9D3C39] text-white">1</button>
                <button className="w-7 h-7 rounded flex items-center justify-center text-[13px] font-semibold text-[#464555] hover:bg-gray-50">2</button>
                <button className="w-7 h-7 rounded flex items-center justify-center text-[13px] font-semibold text-[#464555] hover:bg-gray-50">3</button>
                <button className="w-7 h-7 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Widgets */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-6">
          
          {/* Skill Proficiency Breakdown */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Skill Proficiency Breakdown
              </h3>
              <button className="text-[13px] font-semibold text-[#3525CD] hover:underline flex items-center gap-1">
                View Details <span className="text-[16px] leading-none">→</span>
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#F4F7FB] p-4 rounded-xl">
                <div className="text-[12px] font-semibold text-[#464555] mb-2">Abhinaya</div>
                <div className="text-[20px] font-bold text-[#4F46E5]">8.8</div>
              </div>
              <div className="bg-[#F4F7FB] p-4 rounded-xl">
                <div className="text-[12px] font-semibold text-[#464555] mb-2">Nritta</div>
                <div className="text-[20px] font-bold text-[#0EA5E9]">7.4</div>
              </div>
              <div className="bg-[#F4F7FB] p-4 rounded-xl">
                <div className="text-[12px] font-semibold text-[#464555] mb-2">Mudras</div>
                <div className="text-[20px] font-bold text-[#0284C7]">9.2</div>
              </div>
              <div className="bg-[#F4F7FB] p-4 rounded-xl">
                <div className="text-[12px] font-semibold text-[#464555] mb-2">Rhythm</div>
                <div className="text-[20px] font-bold text-[#D97706]">8.1</div>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <h3 className="text-[16px] font-semibold text-[#0B1C30] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Recent Submissions
            </h3>
            
            <div className="space-y-5 mb-6">
              {/* Item 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#0B1C30] leading-tight">Adavu Practice - Part 2</div>
                  <div className="text-[12px] text-[#464555] mt-1">Submitted by Priya Iyer • 2h ago</div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#38BDF8] text-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#0B1C30] leading-tight">Theoretical Origins of Natya</div>
                  <div className="text-[12px] text-[#464555] mt-1">Submitted by Rahul V • 5h ago</div>
                </div>
              </div>
            </div>

            <button className="w-full py-2 border border-gray-200 rounded-lg text-[13px] font-semibold text-[#3525CD] hover:bg-[#F4F7FB] transition-colors">
              Review All Tasks
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}