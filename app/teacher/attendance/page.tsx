'use client';
import React from 'react';
import Link from 'next/link';   
export default function AttendanceRecordsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-8 pb-24" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-[#0B1C30] leading-[38.4px] tracking-[-0.8px] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Attendance Records
            </h1>
            <p className="text-[16px] text-[#464555] leading-[25.6px]">
              Manage your monthly presence and leave requests.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-[#0B1C30] text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Attendance
            </button>
         <Link 
  href="/teacher/attendance/leave" /* Yahan apna exact route path daal dijiye */
  className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
  Apply for Leave
</Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Working Days */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#9333EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-[#464555] tracking-wider uppercase mb-0.5">TOTAL WORKING DAYS</div>
              <div className="text-[28px] font-bold leading-none text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>26</div>
            </div>
          </div>

          {/* Present Days */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F4EB] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-[#464555] tracking-wider uppercase mb-0.5">PRESENT DAYS</div>
              <div className="text-[28px] font-bold leading-none text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>22</div>
            </div>
          </div>

          {/* Total Absent */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-[#464555] tracking-wider uppercase mb-0.5">TOTAL ABSENT</div>
              <div className="text-[28px] font-bold leading-none text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>2</div>
            </div>
          </div>

          {/* Total Leaves */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-[#464555] tracking-wider uppercase mb-0.5">TOTAL LEAVES</div>
              <div className="text-[28px] font-bold leading-none text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>2</div>
            </div>
          </div>
        </div>

        {/* Main Content Area (Table + Calendar) */}
        <div className="flex gap-6 items-start">
          
          {/* Left Column: Recent Logs Table */}
          <div className="flex-1 bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            
            {/* Table Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-[18px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Logs</h2>
              <div className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-500 hover:text-gray-700">
                October 2023
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Table Structure */}
            <div className="w-full">
              {/* Columns Header */}
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-gray-100 text-[12px] font-semibold text-gray-500">
                <div>Date</div>
                <div>Day</div>
                <div>Check-in</div>
                <div>Check-out</div>
                <div>Total Hours</div>
                <div>Status</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {/* Row 1 */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-5 text-[14px] text-[#0B1C30] hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Oct 24, 2023</div>
                  <div className="text-gray-500">Tuesday</div>
                  <div className="font-medium">09:30 AM</div>
                  <div className="font-medium">06:30 PM</div>
                  <div className="text-gray-500">9h 00m</div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F4EB] text-[#10B981] text-[12px] font-semibold">Present</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-5 text-[14px] text-[#0B1C30] hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Oct 23, 2023</div>
                  <div className="text-gray-500">Monday</div>
                  <div className="font-medium">09:45 AM</div>
                  <div className="font-medium">06:15 PM</div>
                  <div className="text-gray-500">8h 30m</div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FEF9C3] text-[#D97706] text-[12px] font-semibold">Late</span>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-5 text-[14px] text-[#0B1C30] hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Oct 22, 2023</div>
                  <div className="text-gray-500">Sunday</div>
                  <div className="text-gray-400">--</div>
                  <div className="text-gray-400">--</div>
                  <div className="text-gray-400">--</div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#3B82F6] text-[12px] font-semibold">Weekly Off</span>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-5 text-[14px] text-[#0B1C30] hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Oct 21, 2023</div>
                  <div className="text-gray-500">Saturday</div>
                  <div className="text-gray-400">--</div>
                  <div className="text-gray-400">--</div>
                  <div className="text-gray-400">--</div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FEF2F2] text-[#EF4444] text-[12px] font-semibold">Absent</span>
                  </div>
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-5 text-[14px] text-[#0B1C30] hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Oct 20, 2023</div>
                  <div className="text-gray-500">Friday</div>
                  <div className="text-gray-400">--</div>
                  <div className="text-gray-400">--</div>
                  <div className="text-gray-400">--</div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#3B82F6] text-[12px] font-semibold">On Leave</span>
                  </div>
                </div>

                {/* Row 6 */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-5 text-[14px] text-[#0B1C30] hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Oct 19, 2023</div>
                  <div className="text-gray-500">Thursday</div>
                  <div className="font-medium">09:15 AM</div>
                  <div className="font-medium">06:45 PM</div>
                  <div className="text-gray-500">9h 30m</div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F4EB] text-[#10B981] text-[12px] font-semibold">Present</span>
                  </div>
                </div>
              </div>
              
              {/* Footer Link */}
              <div className="p-6 text-center">
                <button className="text-[14px] font-bold text-[#A42E30] hover:underline transition-all">
                  View Full History
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Calendar Widget */}
          <div className="w-[320px] flex-shrink-0 bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Calendar</h2>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="text-gray-400 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="text-center font-bold text-[#0B1C30] mb-6">
              October 2023
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center text-[12px] font-semibold text-gray-400 mb-4">
              <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 text-center gap-y-4 text-[14px] font-medium">
              
              {/* Row 1 */}
              <div className="text-[#BFDBFE]">24</div>
              <div className="text-[#BFDBFE]">25</div>
              <div className="text-[#BFDBFE]">26</div>
              <div className="text-[#BFDBFE]">27</div>
              <div className="text-[#BFDBFE]">28</div>
              <div className="text-[#BFDBFE]">29</div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">
                1
                <span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">2<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">3<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">4<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">5<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">6<span className="w-1 h-1 rounded-full bg-[#EF4444] mt-1"></span></div>
              <div className="text-[#0B1C30]">7</div>
              <div className="text-[#0B1C30]">8</div>

              {/* Row 3 */}
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">9<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">10<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">11<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">12<span className="w-1 h-1 rounded-full bg-[#F59E0B] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">13<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="text-[#0B1C30]">14</div>
              <div className="text-[#0B1C30]">15</div>

              {/* Row 4 */}
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">16<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">17<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">18<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">19<span className="w-1 h-1 rounded-full bg-[#10B981] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">20<span className="w-1 h-1 rounded-full bg-[#3B82F6] mt-1"></span></div>
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">21<span className="w-1 h-1 rounded-full bg-[#EF4444] mt-1"></span></div>
              <div className="text-[#0B1C30]">22</div>

              {/* Row 5 */}
              <div className="flex flex-col items-center justify-center text-[#0B1C30]">23<span className="w-1 h-1 rounded-full bg-[#F59E0B] mt-1"></span></div>
              
              {/* Highlighted Date 24 */}
              <div className="flex flex-col items-center justify-center text-[#0B1C30] w-8 h-10 mx-auto rounded-xl border-[1.5px] border-[#6366F1] shadow-sm">
                24<span className="w-1 h-1 rounded-full bg-[#10B981] mt-0.5"></span>
              </div>
              
              <div className="text-[#D1D5DB] flex items-center justify-center">25</div>
              <div className="text-[#D1D5DB] flex items-center justify-center">26</div>
              <div className="text-[#D1D5DB] flex items-center justify-center">27</div>
              <div className="text-[#D1D5DB] flex items-center justify-center">28</div>
            </div>

            {/* Legend */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#0B1C30]">
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                Present
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#0B1C30]">
                <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                Absent
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#0B1C30]">
                <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                On Leave
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#0B1C30]">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                Late
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}