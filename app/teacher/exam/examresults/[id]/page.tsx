'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function ExamResultDetail() {
  const [q1Score, setQ1Score] = useState('10');
  const [q2Score, setQ2Score] = useState('0');
  const [overrideScore, setOverrideScore] = useState('+2.0');
  const [flagged, setFlagged] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1200px] mx-auto">
        
        {/* Top Navigation */}
        <div className="mb-6">
          <Link href="/teacher/exam/examresults" className="inline-flex items-center text-[#0B1C30] hover:text-gray-600 transition-colors p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        {/* Student Header Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-6 mb-8 flex items-center justify-between">
          
          <div className="flex items-center gap-5">
            <img src="https://i.pravatar.cc/150?img=47" alt="Ananya Patel" className="w-16 h-16 rounded-full object-cover border border-gray-100" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[24px] font-bold text-[#0B1C30] leading-none">Ananya Patel</h1>
                <span className="text-[12px] font-semibold text-[#8B2627] bg-[#FFF1F1] px-2 py-0.5 rounded">#KL-88210</span>
              </div>
              <div className="flex items-center gap-4 text-[14px] font-medium text-gray-500">
                <span className="text-[#0B1C30]">Advanced Harmony - Finals</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-[#8B2627]">Spring Semester 2024</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-[#F8F9FB] px-6 py-4 rounded-2xl border border-gray-100">
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">FINAL SCORE</div>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-[#A42E30] leading-none">94</span>
                <span className="text-[14px] font-bold text-gray-400">/ 100</span>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">PERCENTILE</div>
              <div className="text-[24px] font-bold text-[#0EA5E9] leading-none">98th</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="text-[11px] font-bold text-[#10B981] tracking-wider uppercase">PASSED</div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex gap-8 items-start">
          
          {/* Left Column: Questions */}
          <div className="flex-1 space-y-6">
            
            {/* Question 1 */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#A42E30] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-[#0B1C30] leading-snug">Harmonic Progression Identification</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F9FB] px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">AWARD:</span>
                  <input type="text" value={q1Score} onChange={(e) => setQ1Score(e.target.value)} className="w-10 text-center py-1 border border-gray-200 rounded text-sm font-bold text-[#A42E30] outline-none focus:border-[#A42E30]" />
                  <span className="text-[11px] font-bold text-[#A42E30]">/ 10 Points</span>
                </div>
              </div>

              <p className="text-[14px] text-[#464555] mb-6 leading-relaxed">
                Identify the key and the final cadence used in the following four-bar phrase.
              </p>

              {/* Mock Image Placeholder */}
              <div className="w-full h-48 bg-[#F4EBE3] rounded-xl mb-6 flex items-center justify-center border border-gray-200 overflow-hidden relative">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #000 20px)', backgroundSize: '100% 20px' }}></div>
                <span className="text-gray-500 text-sm font-medium z-10 bg-white/80 px-4 py-1 rounded">Sheet Music Placeholder</span>
              </div>

              <div className="mb-6">
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">REFERENCE ANSWER (TEACHER KEY)</div>
                <div className="bg-[#F8F9FB] p-4 rounded-xl text-[14px] font-medium text-[#0B1C30] border border-gray-100">
                  G Major, Authentic Cadence
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Correct Selection */}
                <div className="border-2 border-[#10B981] bg-[#F0FDF4] rounded-xl p-4 relative">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-bold text-[#0B1C30] mb-0.5">G Major, Authentic Cadence</div>
                      <div className="text-[10px] font-bold text-[#10B981] tracking-wider uppercase">STUDENT SELECTION</div>
                    </div>
                    <div className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">CORRECT</div>
                  </div>
                  
                  {/* Segmentation Control inside card */}
                  <div className="flex gap-1 mt-4">
                    <button className="flex-1 py-1 bg-[#10B981] text-white text-[10px] font-bold rounded uppercase tracking-wider">CORRECT</button>
                    <button className="flex-1 py-1 bg-white text-gray-400 border border-gray-200 text-[10px] font-bold rounded uppercase tracking-wider hover:bg-gray-50">INCORRECT</button>
                    <button className="flex-1 py-1 bg-white text-gray-400 border border-gray-200 text-[10px] font-bold rounded uppercase tracking-wider hover:bg-gray-50">PARTIAL</button>
                  </div>
                </div>

                {/* Other Option */}
                <div className="border border-gray-200 bg-white rounded-xl p-4 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                  <div className="text-[14px] text-gray-400 font-medium">E Minor, Plagal Cadence</div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">TEACHER FEEDBACK</div>
                <textarea 
                  className="w-full h-24 bg-[#F8F9FB] border border-gray-100 rounded-xl p-4 text-[14px] text-[#0B1C30] outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all resize-none placeholder-gray-400"
                  placeholder="Add specific notes on the student's reasoning..."
                ></textarea>
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#A42E30] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-[#0B1C30] leading-snug">Modal Interchange Selection</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F9FB] px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">AWARD:</span>
                  <input type="text" value={q2Score} onChange={(e) => setQ2Score(e.target.value)} className="w-10 text-center py-1 border border-[#FCA5A5] rounded text-sm font-bold text-[#A42E30] outline-none focus:border-[#A42E30] bg-[#FFF1F1]" />
                  <span className="text-[11px] font-bold text-[#A42E30]">/ 15 Points</span>
                </div>
              </div>

              <p className="text-[14px] text-[#464555] mb-6 leading-relaxed">
                Which of the following chords represents a Borrowed Chord from the parallel minor in a C Major context?
              </p>

              <div className="mb-6">
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">REFERENCE ANSWER (TEACHER KEY)</div>
                <div className="bg-[#F8F9FB] p-4 rounded-xl text-[14px] font-medium text-[#0B1C30] border border-gray-100">
                  Ab Major (bVI)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Incorrect Selection */}
                <div className="border-2 border-[#EF4444] bg-[#FEF2F2] rounded-xl p-4 relative">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-bold text-[#0B1C30] mb-0.5">D Major (II)</div>
                      <div className="text-[10px] font-bold text-[#EF4444] tracking-wider uppercase">STUDENT SELECTION</div>
                    </div>
                    <div className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider">INCORRECT</div>
                  </div>
                  
                  {/* Segmentation Control */}
                  <div className="flex gap-1 mt-4">
                    <button className="flex-1 py-1 bg-white text-gray-400 border border-gray-200 text-[10px] font-bold rounded uppercase tracking-wider hover:bg-gray-50">CORRECT</button>
                    <button className="flex-1 py-1 bg-[#EF4444] text-white text-[10px] font-bold rounded uppercase tracking-wider">INCORRECT</button>
                    <button className="flex-1 py-1 bg-white text-gray-400 border border-gray-200 text-[10px] font-bold rounded uppercase tracking-wider hover:bg-gray-50">PARTIAL</button>
                  </div>
                </div>

                {/* Correct Option indicator */}
                <div className="border-2 border-[#10B981] bg-[#F0FDF4] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div className="flex-1">
                     <div className="text-[14px] font-bold text-[#0B1C30] mb-0.5">Ab Major (bVI)</div>
                  </div>
                  <div className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider text-right">CORRECT<br/>ANSWER</div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">TEACHER FEEDBACK</div>
                <textarea 
                  className="w-full h-24 bg-[#F8F9FB] border border-gray-100 rounded-xl p-4 text-[14px] text-[#0B1C30] outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all resize-none"
                  defaultValue="Student seems to have confused Secondary Dominants with Modal Interchange. Review Session 4 materials."
                ></textarea>
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div className="w-[340px] flex-shrink-0 sticky top-8">
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-6">
              
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-[#A42E30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-[16px] font-bold text-[#0B1C30]">Final Evaluation</h2>
              </div>

              <div className="space-y-4 mb-6">
                {/* Base System Score */}
                <div className="flex items-center justify-between bg-[#F8F9FB] p-4 rounded-xl border border-gray-100">
                  <span className="text-[13px] font-semibold text-gray-500">Base System Score</span>
                  <span className="text-[16px] font-bold text-[#0B1C30]">92 / 100</span>
                </div>

                {/* Teacher Overrides */}
                <div className="flex items-center justify-between bg-[#F8F9FB] p-4 rounded-xl border border-gray-100">
                  <span className="text-[13px] font-semibold text-gray-500">Teacher<br/>Overrides</span>
                  <div className="flex items-center gap-2">
                    <button className="w-6 h-6 rounded bg-gray-200 text-gray-500 flex items-center justify-center font-bold hover:bg-gray-300">-</button>
                    <input type="text" value={overrideScore} onChange={(e) => setOverrideScore(e.target.value)} className="w-12 text-center bg-transparent text-[14px] font-bold text-[#A42E30] outline-none" />
                    <button className="w-6 h-6 rounded bg-gray-200 text-gray-500 flex items-center justify-center font-bold hover:bg-gray-300">+</button>
                  </div>
                </div>

                {/* Manually Validated Score */}
                <div className="flex items-center justify-between bg-[#A42E30] p-4 rounded-xl text-white shadow-md shadow-[#A42E30]/20">
                  <span className="text-[13px] font-semibold">Manually Validated<br/>Score</span>
                  <div className="text-right">
                    <span className="text-[20px] font-bold block leading-none">94 /</span>
                    <span className="text-[16px] font-bold">100</span>
                  </div>
                </div>
              </div>

              {/* Overall Feedback */}
              <div className="mb-6">
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-2">OVERALL FEEDBACK</div>
                <textarea 
                  className="w-full h-32 bg-[#F0F5FA] border border-transparent rounded-xl p-4 text-[13px] text-[#464555] outline-none focus:border-[#A42E30] focus:bg-white transition-all resize-none leading-relaxed"
                  defaultValue="Ananya, your grasp of harmonic structure is exceptional. The minor error in Modal Interchange was consistent across your work—I suggest a quick refresher on minor-key relationship. Otherwise, brilliant final assessment."
                ></textarea>
              </div>

              {/* Flag Toggle */}
              <div className="flex items-center justify-between bg-[#F8F9FB] p-4 rounded-xl border border-gray-100 mb-6">
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#0B1C30]">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                  Flag for Discussion
                </div>
                <button 
                  onClick={() => setFlagged(!flagged)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${flagged ? 'bg-[#A42E30]' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flagged ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full py-3.5 bg-[#A42E30] text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#8B2627] transition-all shadow-md shadow-[#A42E30]/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Verify & Finalize Result
                </button>
                <button className="w-full py-3.5 bg-white border border-gray-200 text-[#0B1C30] rounded-xl text-[14px] font-bold flex items-center justify-center hover:bg-gray-50 transition-all">
                  Download PDF Report
                </button>
              </div>

              {/* Other Recent Reviews */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-4">OTHER RECENT REVIEWS</div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Liam Chen" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-[13px] font-bold text-[#0B1C30] group-hover:text-[#A42E30] transition-colors">Liam Chen</div>
                      <div className="text-[11px] text-gray-500 font-medium">Score: 88/100</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <img src="https://i.pravatar.cc/150?img=32" alt="Sofia Rodriguez" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-[13px] font-bold text-[#0B1C30] group-hover:text-[#A42E30] transition-colors">Sofia Rodriguez</div>
                      <div className="text-[11px] text-gray-500 font-medium">Score: 91/100</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}