'use client';
import React from 'react';

export default function TeacherSupportPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 text-[#0B1C30]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[#0B1C30] tracking-tight mb-2 leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Help & Support Center
            </h1>
            <p className="text-[15px] text-[#464555]">
              Find answers, reach out to the administration, or track your support tickets.
            </p>
          </div>
          
          <button className="bg-[#A42E30] hover:bg-[#8B2627] text-white text-[14px] font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Ticket
          </button>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* IT Support */}
          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-bold text-gray-400 tracking-wider uppercase mb-1">TECHNICAL SUPPORT</div>
              <div className="text-[16px] font-bold text-[#0B1C30] mb-0.5">it.support@institution.edu</div>
              <div className="text-[13px] font-medium text-gray-500">Ext: 4001 (Mon-Fri, 9am-5pm)</div>
            </div>
          </div>

          {/* Admin & HR */}
          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#9333EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-bold text-gray-400 tracking-wider uppercase mb-1">HR & ADMINISTRATION</div>
              <div className="text-[16px] font-bold text-[#0B1C30] mb-0.5">admin@institution.edu</div>
              <div className="text-[13px] font-medium text-gray-500">Ext: 2005 (Mon-Sat, 9am-6pm)</div>
            </div>
          </div>

          {/* Average Resolution Time */}
          <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-[#E6F4EB] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-bold text-gray-400 tracking-wider uppercase mb-1">AVG. RESOLUTION TIME</div>
              <div className="flex items-baseline gap-1.5">
                 <div className="text-[28px] font-bold text-[#0B1C30] leading-none">2.4</div>
                 <div className="text-[14px] font-semibold text-gray-500">Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column (Tickets & FAQs) */}
          <div className="flex-1 space-y-8">
            
            {/* Recent Tickets Table */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-[18px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Recent Tickets
                </h2>
                <button className="text-[13px] font-semibold text-[#A42E30] hover:underline">
                  View All
                </button>
              </div>

              <div className="w-full">
                <div className="grid grid-cols-[1fr_2.5fr_1fr_1fr] px-6 py-3 bg-[#F8F9FB] border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <div>TICKET ID</div>
                  <div>SUBJECT</div>
                  <div>DATE</div>
                  <div>STATUS</div>
                </div>

                <div className="divide-y divide-gray-100">
                  <div className="grid grid-cols-[1fr_2.5fr_1fr_1fr] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="text-[13px] font-bold text-[#0B1C30]">#TCK-0892</div>
                    <div className="text-[14px] font-medium text-[#464555]">Smartboard not syncing in Room 302</div>
                    <div className="text-[13px] text-gray-500">Oct 24, 2023</div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FFF4E5] text-[#D97706] text-[11px] font-bold tracking-wider uppercase">
                        In Progress
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_2.5fr_1fr_1fr] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="text-[13px] font-bold text-[#0B1C30]">#TCK-0845</div>
                    <div className="text-[14px] font-medium text-[#464555]">Leave balance discrepancy in portal</div>
                    <div className="text-[13px] text-gray-500">Oct 18, 2023</div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F4EB] text-[#10B981] text-[11px] font-bold tracking-wider uppercase">
                        Resolved
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_2.5fr_1fr_1fr] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="text-[13px] font-bold text-[#0B1C30]">#TCK-0711</div>
                    <div className="text-[14px] font-medium text-[#464555]">Request for new lab equipment</div>
                    <div className="text-[13px] text-gray-500">Sep 05, 2023</div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#E6F4EB] text-[#10B981] text-[11px] font-bold tracking-wider uppercase">
                        Resolved
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
              <h2 className="text-[18px] font-bold text-[#0B1C30] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {/* FAQ 1 */}
                <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#0B1C30] group-hover:text-[#A42E30] transition-colors">How do I update my syllabus for the new semester?</h3>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#A42E30] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* FAQ 2 (Expanded State Example) */}
                <div className="border border-[#A42E30]/20 bg-[#FFF1F1]/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[14px] font-bold text-[#A42E30]">What is the process for applying for extended medical leave?</h3>
                    <svg className="w-5 h-5 text-[#A42E30]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                  </div>
                  <p className="text-[13px] text-[#464555] leading-relaxed pr-8">
                    To apply for extended medical leave (more than 3 days), you need to submit a leave request via the Attendance page and attach a valid medical certificate. The request will be reviewed by the HR department within 48 hours.
                  </p>
                </div>

                {/* FAQ 3 */}
                <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-[#0B1C30] group-hover:text-[#A42E30] transition-colors">How can I request maintenance for my classroom?</h3>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[#A42E30] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Submit Request Form) */}
          <div className="w-full lg:w-[400px] flex-shrink-0 sticky top-8">
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#A42E30]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Submit a Request</h2>
                  <p className="text-[12px] text-gray-500 mt-0.5">We typically reply within 2-4 hours.</p>
                </div>
              </div>

              <div className="space-y-5">
                
                {/* Category */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select defaultValue="" className="w-full appearance-none bg-white border border-gray-200 text-[#0B1C30] text-[14px] font-medium py-3 pl-4 pr-10 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all">
                      <option value="" disabled>Select issue type</option>
                      <option value="it">IT & Technical Support</option>
                      <option value="hr">HR & Payroll</option>
                      <option value="facilities">Facilities & Maintenance</option>
                      <option value="other">Other Queries</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input 
                    type="text" 
                    placeholder="Brief title of your issue" 
                    className="w-full bg-white border border-gray-200 text-[#0B1C30] placeholder-gray-400 text-[14px] font-medium py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all" 
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea 
                    rows={4} 
                    placeholder="Provide details about your request..." 
                    className="w-full bg-white border border-gray-200 text-[#0B1C30] placeholder-gray-400 text-[14px] py-3 px-4 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all resize-none"
                  ></textarea>
                </div>

                {/* Attachment Box */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Attachment <span className="normal-case text-gray-400 ml-1 font-normal">(Optional)</span>
                  </label>
                  <div className="w-full border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-6 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all">
                    <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    <div className="text-[13px] font-bold text-[#0B1C30]">Upload a screenshot</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">JPG, PNG or PDF</div>
                  </div>
                </div>

                {/* Submit Button */}
                <button className="w-full py-3.5 bg-[#A42E30] hover:bg-[#8B2627] text-white text-[14px] font-bold rounded-xl transition-all shadow-md shadow-[#A42E30]/20 flex items-center justify-center gap-2">
                  Submit Request
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}