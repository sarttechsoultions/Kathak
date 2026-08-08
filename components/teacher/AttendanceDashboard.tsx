import React from 'react';

export default function AttendanceDashboard() {
  return (
    <div
      className="min-h-screen bg-[#F8F9FA] text-[#0B1C30]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        `
      }} />

   

      {/* Main Content */}
      <main className="px-8 py-8 max-w-[1400px] mx-auto">
        <h1 className="text-[24px] font-bold text-[#0B1C30] mb-6 tracking-tight">Attendance Management</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Total Students */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="text-sm text-gray-500 font-medium mb-1">Total Students</div>
            <div className="text-[48px] font-bold leading-none tracking-[-0.96px] text-[#0B1C30]">1,248</div>
          </div>

          {/* Present Today */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-gray-500 font-medium mb-1">Present Today</div>
            <div className="text-[48px] font-bold leading-none tracking-[-0.96px] text-[#0B1C30]">1,150</div>
          </div>

          {/* Absent */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-gray-500 font-medium mb-1">Absent</div>
            <div className="text-[48px] font-bold leading-none tracking-[-0.96px] text-[#0B1C30]">98</div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="text-sm text-gray-500 font-medium mb-1">Leave Requests</div>
            <div className="text-[48px] font-bold leading-none tracking-[-0.96px] text-[#0B1C30]">12</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0B1C30] hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            October 24, 2023
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0B1C30] hover:bg-gray-50 transition-colors">
            Batch 2024-A
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#0B1C30] hover:bg-gray-50 transition-colors">
            Morning Session
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-6 items-start">
          {/* Left Column - Attendance List */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#0B1C30]">Today`&apos;`s Attendance List</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-[#0B1C30] hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-[#0B1C30] hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </div>
            </div>

            <div className="bg-[#F8F9FB] grid grid-cols-[2fr_1.5fr_1.5fr] px-6 py-3 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">STUDENT</div>
              <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">BATCH / COURSE</div>
              <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">STATUS</div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-gray-100">
              {/* Row 1 */}
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=33" alt="Marcus Chen" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-[#0B1C30]">Marcus Chen</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: KL-2024-001</div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[#0B1C30] text-sm">2024-A</div>
                  <div className="text-xs text-gray-500 mt-0.5">B.Sc Computer Science</div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold bg-[#10B981] text-white">P</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">A</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">L</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">LV</button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=5" alt="Aria Sterling" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-[#0B1C30]">Aria Sterling</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: KL-2024-045</div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[#0B1C30] text-sm">2024-A</div>
                  <div className="text-xs text-gray-500 mt-0.5">B.Sc Computer Science</div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">P</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold bg-[#992023] text-white">A</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">L</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">LV</button>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=60" alt="Jameson Blake" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-[#0B1C30]">Jameson Blake</div>
                    <div className="text-xs text-gray-500 mt-0.5">ID: KL-2024-112</div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[#0B1C30] text-sm">2024-C</div>
                  <div className="text-xs text-gray-500 mt-0.5">B.Tech IT</div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">P</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">A</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold bg-[#F59E0B] text-white">L</button>
                  <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold border border-gray-200 text-gray-400 bg-white hover:border-gray-300">LV</button>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-6 border-t border-gray-100">
              <div className="text-sm text-gray-500 font-medium">Showing 1-10 of 1,248 students</div>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold bg-[#8B2627] text-white">1</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">2</button>
                <button className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">3</button>
                <button className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Widgets */}
          <div className="w-[340px] flex flex-col gap-6">
            
            {/* Calendar Widget */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0B1C30]">
                  <svg className="w-5 h-5 text-[#8B2627]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  October 2023
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-4">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>

              <div className="grid grid-cols-7 text-center text-xs font-bold text-[#0B1C30] gap-y-3">
                <div className="text-gray-300">29</div>
                <div className="text-gray-300">30</div>
                <div className="w-7 h-7 mx-auto flex items-center justify-center rounded bg-[#E6F4EB] text-[#10B981]">1</div>
                <div className="w-7 h-7 mx-auto flex items-center justify-center rounded bg-[#E6F4EB] text-[#10B981]">2</div>
                <div className="w-7 h-7 mx-auto flex items-center justify-center rounded bg-[#E6F4EB] text-[#10B981]">3</div>
                <div className="w-7 h-7 mx-auto flex items-center justify-center rounded bg-[#E6F4EB] text-[#10B981]">4</div>
                <div className="w-7 h-7 mx-auto flex items-center justify-center rounded bg-[#F3E8FF] text-[#9333EA]">5</div>
                
                <div className="flex items-center justify-center w-7 h-7 mx-auto">...</div>
                <div className="w-7 h-7 mx-auto flex items-center justify-center rounded bg-[#8B2627] text-white">24</div>
                <div className="flex items-center justify-center w-7 h-7 mx-auto">25</div>
                <div className="flex items-center justify-center w-7 h-7 mx-auto">26</div>
                <div className="w-7 h-7 mx-auto flex items-center justify-center rounded border border-[#FCA5A5] text-[#EF4444] bg-[#FEF2F2]">27</div>
                <div className="flex items-center justify-center w-7 h-7 mx-auto">28</div>
                <div className="flex items-center justify-center w-7 h-7 mx-auto">29</div>

                <div className="flex items-center justify-center w-7 h-7 mx-auto">30</div>
                <div className="flex items-center justify-center w-7 h-7 mx-auto">31</div>
              </div>

              <div className="flex items-center justify-between mt-8 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                  Streak: 14 Days
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                  Holiday
                </div>
              </div>
            </div>

            {/* Analytics Widget */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0B1C30] mb-6">
                <svg className="w-5 h-5 text-[#8B2627]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Batch-wise Analytics
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[#0B1C30]">Batch 2024-A</span>
                    <span className="text-[#10B981]">96%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[#0B1C30]">Batch 2024-C</span>
                    <span className="text-[#8B2627]">88%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B2627] rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[#0B1C30]">Batch 2023-B</span>
                    <span className="text-[#8B2627]">72%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B2627] rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a href="#" className="text-sm font-bold text-[#8B2627] hover:underline">View All Batches</a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}