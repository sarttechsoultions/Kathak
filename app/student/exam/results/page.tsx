"use client";

import React from "react";
import Link from "next/link";
import { Download, CheckCircle2, MessageSquare, ChevronLeft } from "lucide-react";

export default function StudentExamResultsPage() {
  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/student/exam"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-[#900C27] transition-colors mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Examinations</span>
          </Link>
          <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
            Exam Results
          </h1>
        </div>

        <button className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0">
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* TOP 3 RESULT METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: FINAL SCORE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">FINAL SCORE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#900C27]">94</span>
            <span className="text-xl font-bold text-stone-400">/ 100</span>
          </div>
        </div>

        {/* Card 2: PERCENTILE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">PERCENTILE</span>
          <span className="text-4xl font-extrabold text-[#900C27]">98th</span>
        </div>

        {/* Card 3: STATUS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">STATUS</span>
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-[#E6F7ED] text-[#22A05B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22A05B]" />
              Passed
            </span>
            <span className="text-[11px] text-stone-500 font-medium block">
              Exam completed on May 12, 2024
            </span>
          </div>
        </div>

      </div>

      {/* DETAILED QUESTION REVIEW SECTION */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-[#1B1B24]">
          Detailed Question Review
        </h2>

        <div className="space-y-6">
          
          {/* QUESTION 1 (CORRECT - 10/10 pts) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#1B1B24]">
                    The Significance of Modal Interchange
                  </h3>
                  <p className="text-xs text-stone-500">
                    Explain how modal interchange enhances harmonic complexity in a major key composition.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-[#E6F7ED] text-[#22A05B] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider block">
                  CORRECT
                </span>
                <span className="text-sm font-bold text-[#900C27] block pt-0.5">10/10 pts</span>
              </div>
            </div>

            {/* YOUR ANSWER */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">YOUR ANSWER</span>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-xs sm:text-sm text-stone-700 leading-relaxed font-serif italic">
                &ldquo;Modal Interchange allows a composer to borrow chords from parallel modes, such as the natural minor. This introduces a chromatic color while maintaining the functional center. For instance, using a iv chord in a major key creates a sentimental, &apos;darker&apos; resolution to the tonic.&rdquo;
              </div>
            </div>

            {/* TEACHER FEEDBACK */}
            <div className="bg-sky-50/70 border border-sky-100 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>TEACHER FEEDBACK (DR. HARRISON)</span>
              </div>
              <p className="text-xs text-sky-950 leading-relaxed font-medium">
                Excellent conceptual understanding. Your example of the minor subdominant in a major context is textbook perfect. Keep exploring the lydian dominant for even more tension.
              </p>
            </div>

          </div>

          {/* QUESTION 2 (PARTIAL - 14/15 pts) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#1B1B24]">
                    Constraints of Unison Movement
                  </h3>
                  <p className="text-xs text-stone-500">
                    Identify the primary restrictions when composing for four-part vocal harmony in unison passages.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider block">
                  PARTIAL
                </span>
                <span className="text-sm font-bold text-[#900C27] block pt-0.5">14/15 pts</span>
              </div>
            </div>

            {/* YOUR ANSWER */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">YOUR ANSWER</span>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-xs sm:text-sm text-stone-700 leading-relaxed font-serif italic">
                &ldquo;The primary restriction is maintaining range balance. All voices must remain within their comfortable tessitura to avoid strain. Furthermore, the volume must be balanced to ensure no single section overpowers the collective unison sound.&rdquo;
              </div>
            </div>

            {/* TEACHER FEEDBACK */}
            <div className="bg-sky-50/70 border border-sky-100 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>TEACHER FEEDBACK (DR. HARRISON)</span>
              </div>
              <p className="text-xs text-sky-950 leading-relaxed font-medium">
                Excellent summary. Deducted 1 point for not explicitly mentioning the specific unison movement restrictions regarding parallel octaves transition—though your focus on vocal strain was valid.
              </p>
            </div>

          </div>

          {/* QUESTION 3 (CORRECT - 20/20 pts) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#1B1B24]">
                    Harmonic Analysis Practice
                  </h3>
                  <p className="text-xs text-stone-500">
                    Label the functional analysis for the cadence shown in measures 4-8.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-[#E6F7ED] text-[#22A05B] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider block">
                  CORRECT
                </span>
                <span className="text-sm font-bold text-[#900C27] block pt-0.5">20/20 pts</span>
              </div>
            </div>

            {/* Diagram Image */}
            <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/classesbg.png" alt="Harmonic Analysis Diagram" className="max-w-md mx-auto h-32 object-contain" />
            </div>

            {/* YOUR ANSWER */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">YOUR ANSWER</span>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-xs sm:text-sm text-stone-700 leading-relaxed font-serif italic">
                &ldquo;ii7 - V7(b9) - imaj9. This is a standard jazz-influenced turnaround with an altered dominant leading to a tonic with an added ninth.&rdquo;
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
