'use client';
import React from 'react';

export default function StudentPerformance() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 text-[#0B1C30]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1100px] mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#9B3434] hover:bg-red-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#0B1C30] leading-none mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Student Performance
            </h1>
            <div className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
              EDUPREMIUMPORTAL / PROFILES
            </div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 relative overflow-hidden flex items-center justify-between">
          {/* Left Red Accent Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#9B3434]"></div>
          
          <div className="flex items-center gap-5 ml-2">
            {/* Avatar */}
            <div className="relative">
              <img 
                src="https://i.pravatar.cc/150?img=47" 
                alt="Priya Iyer" 
                className="w-[96px] h-[96px] rounded-2xl object-cover shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0EA5E9] rounded-full border-2 border-white flex items-center justify-center text-white">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            
            {/* Student Details */}
            <div>
              <h2 className="text-[20px] font-bold text-[#0B1C30] mb-3">Priya Iyer</h2>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 bg-[#F8F9FB] px-3 py-1.5 rounded-lg border border-gray-100 text-[13px] font-medium text-[#464555]">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21l9-5-9-5-9 5 9 5z" /></svg>
                  Bharatnatyam Intermediate
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8F9FB] px-3 py-1.5 rounded-lg border border-gray-100 text-[13px] font-medium text-[#464555]">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                  ID: EDU-2024-089
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Score */}
          <div className="w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ATTENDANCE SCORE</span>
              <span className="text-[16px] font-bold text-[#0EA5E9]">94%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>

        {/* Grid Layout for Top Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Exam Performance */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#9B3434] flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                </div>
                <h3 className="text-[16px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Exam Performance</h3>
              </div>
              <button className="text-[13px] font-medium text-[#9B3434] hover:underline">Download Report</button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-gray-100 pb-3 mb-4">
                <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">EXAM NAME</div>
                <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">DATE</div>
                <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider text-center">MAX MARKS</div>
                <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider text-right">OBTAINED</div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center">
                  <div className="text-[14px] font-semibold text-[#0B1C30]">Mid-Term Theory</div>
                  <div className="text-[14px] text-[#464555]">Oct 12, 2023</div>
                  <div className="text-[14px] text-[#464555] text-center">50</div>
                  <div className="text-[14px] font-bold text-[#9B3434] text-right">48</div>
                </div>
                
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center">
                  <div className="text-[14px] font-semibold text-[#0B1C30]">Practical Level 1</div>
                  <div className="text-[14px] text-[#464555]">Nov 05, 2023</div>
                  <div className="text-[14px] text-[#464555] text-center">100</div>
                  <div className="text-[14px] font-bold text-[#9B3434] text-right">92</div>
                </div>
                
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center">
                  <div className="text-[14px] font-semibold text-[#0B1C30]">Stage Presentation</div>
                  <div className="text-[14px] text-[#464555]">Dec 20, 2023</div>
                  <div className="text-[14px] text-[#464555] text-center">50</div>
                  <div className="text-[14px] font-bold text-[#9B3434] text-right">45</div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Task Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0EA5E9] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-[16px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Video Task Reviews</h3>
            </div>

            <div className="space-y-5">
              {/* Task 1 */}
              <div className="flex items-center gap-4">
                <div className="w-[72px] h-[48px] rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=200" alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#0B1C30] leading-tight mb-1">Adavu Practice Part 2</div>
                  <div className="text-[11px] text-[#464555]">Yesterday, 4:15 PM</div>
                </div>
                <div className="text-[14px] font-bold text-[#0EA5E9]">
                  8.5 <span className="text-[11px] text-gray-400 font-normal">/10</span>
                </div>
              </div>

              {/* Task 2 */}
              <div className="flex items-center gap-4">
                <div className="w-[72px] h-[48px] rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=200" alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#0B1C30] leading-tight mb-1">Expression (Abhinaya) Test</div>
                  <div className="text-[11px] text-[#464555]">Oct 28, 2023</div>
                </div>
                <div className="text-[14px] font-bold text-[#0EA5E9]">
                  9.2 <span className="text-[11px] text-gray-400 font-normal">/10</span>
                </div>
              </div>

              {/* Task 3 */}
              <div className="flex items-center gap-4">
                <div className="w-[72px] h-[48px] rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=200" alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold text-[#0B1C30] leading-tight mb-1">Footwork Speed Drill</div>
                  <div className="text-[11px] text-[#464555]">Oct 15, 2023</div>
                </div>
                <div className="text-[14px] font-bold text-[#0EA5E9]">
                  7.8 <span className="text-[11px] text-gray-400 font-normal">/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#9B3434] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-[16px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Assignment History</h3>
            </div>
            <div className="relative">
              <select className="appearance-none bg-[#F8F9FB] border border-gray-200 text-[#0B1C30] text-[13px] font-medium py-2 pl-4 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-gray-200">
                <option>Filter: All Status</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] items-center px-6 py-4 bg-[#F8F9FB] border-y border-gray-100">
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase">ASSIGNMENT TITLE</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase">SUBMISSION DATE</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase">STATUS</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase">MARKS</div>
              <div className="text-[11px] font-bold text-[#6B7280] tracking-wider uppercase text-right">ACTIONS</div>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Item 1 */}
              <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] items-center px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-[14px] font-bold text-[#0B1C30]">Mudra Identification Paper</span>
                </div>
                <div className="text-[14px] text-[#464555]">Nov 18, 2023</div>
                <div>
                  <span className="inline-flex px-2.5 py-1 rounded bg-[#E5EEFF] text-[#2563EB] text-[10px] font-bold tracking-wider uppercase">
                    SUBMITTED
                  </span>
                </div>
                <div className="text-[14px] font-bold text-[#0B1C30]">(22/25)</div>
                <div className="flex justify-end">
                  <button className="text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] items-center px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-[14px] font-bold text-[#0B1C30]">History of Natya Shastra</span>
                </div>
                <div className="text-[14px] text-[#464555]">Oct 29, 2023</div>
                <div>
                  <span className="inline-flex px-2.5 py-1 rounded bg-[#FFF4E5] text-[#D97706] text-[10px] font-bold tracking-wider uppercase">
                    PENDING REVIEW
                  </span>
                </div>
                <div className="text-[14px] text-gray-500 font-medium">Grading...</div>
                <div className="flex justify-end">
                  <button className="bg-[#9B3434] hover:bg-[#852C2C] text-white px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-colors">
                    Grade Now
                  </button>
                </div>
              </div>

              {/* Item 3 */}
              <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] items-center px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-[14px] font-bold text-[#0B1C30]">Rasa & Bhava Essay</span>
                </div>
                <div className="text-[14px] text-[#464555]">Oct 05, 2023</div>
                <div>
                  {/* Empty state for status matching the image */}
                </div>
                <div className="text-[14px] font-bold text-[#0B1C30]">(25/25)</div>
                <div className="flex justify-end">
                  <button className="text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}