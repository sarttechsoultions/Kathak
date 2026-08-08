'use client';
import React from 'react';
import Link from 'next/link';

export default function ApplyForLeave() {
  return (
    <div className="min-h-screen bg-white p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[920px] mx-auto">
        
        {/* Back Link */}
        <Link 
          href="/teacher/attendance" // Isko apne actual attendance page ke route se replace karein
          className="inline-flex items-center gap-1.5 text-[14px] text-[#464555] hover:text-[#0B1C30] transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Attendance
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-[#0B1C30] mb-2 leading-tight">Apply for Leave</h1>
          <p className="text-[14px] text-[#464555] leading-[21px]">
            Submit your leave request for administrative review. Please provide all necessary<br/>details.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          
          {/* Leave Type */}
          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">
              LEAVE TYPE
            </label>
            <div className="relative">
            <select defaultValue="" className="w-full appearance-none bg-white border border-gray-200 text-[#0B1C30] text-[15px] py-3.5 pl-4 pr-10 rounded-lg outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all">
  
 <option value="" disabled>Select leave category</option>
  
  <option value="sick">Sick Leave</option>
  <option value="casual">Casual Leave</option>
  <option value="earned">Earned Leave</option>
</select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Picker Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">
                START DATE
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="mm/dd/yyyy" 
                  className="w-full bg-white border border-gray-200 text-[#0B1C30] placeholder-gray-400 text-[15px] py-3.5 pl-4 pr-10 rounded-lg outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" 
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">
                END DATE
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="mm/dd/yyyy" 
                  className="w-full bg-white border border-gray-200 text-[#0B1C30] placeholder-gray-400 text-[15px] py-3.5 pl-4 pr-10 rounded-lg outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" 
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>

          {/* Total Days */}
          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">
              TOTAL DAYS
            </label>
            <div className="w-full bg-[#F8F9FB] border border-gray-200 rounded-lg px-4 py-3.5 flex justify-between items-center">
              <span className="text-gray-500 text-[15px]">Calculated Duration</span>
              <span className="text-[#A42E30] font-bold text-[15px]">0 Days</span>
            </div>
          </div>

          {/* Reason for Leave */}
          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">
              REASON FOR LEAVE
            </label>
            <textarea 
              rows={4} 
              placeholder="Briefly describe the purpose of your leave..." 
              className="w-full bg-white border border-gray-200 text-[#0B1C30] placeholder-gray-400 text-[15px] py-3.5 px-4 rounded-lg outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all resize-none"
            ></textarea>
          </div>

          {/* Handover Notes */}
          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">
              HANDOVER NOTES / SUBSTITUTE TEACHER <span className="normal-case text-gray-400 ml-1 tracking-normal">(Optional)</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g., Mr. Smith will cover Physics 101" 
              className="w-full bg-white border border-gray-200 text-[#0B1C30] placeholder-gray-400 text-[15px] py-3.5 px-4 rounded-lg outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" 
            />
          </div>

          {/* Attachment Box */}
          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">
              ATTACHMENT
            </label>
            <div className="w-full border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-10 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mb-3">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
                <path d="M12 18v-6"></path>
                <path d="M9 15l3-3 3 3"></path>
              </svg>
              <div className="text-[14px] font-semibold text-[#0B1C30] mb-1">Click to upload medical certificates or documents</div>
              <div className="text-[12px] text-[#464555]">PDF, JPG, PNG (Max 5MB)</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-6 pt-4">
            <button className="text-[15px] font-medium text-[#464555] hover:text-[#0B1C30] transition-colors">
              Cancel
            </button>
            <button className="bg-[#9B3434] hover:bg-[#852C2C] text-white text-[15px] font-semibold py-3.5 px-8 rounded-lg shadow-sm transition-colors">
              Submit Application
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}