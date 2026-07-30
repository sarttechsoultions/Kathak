"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Info,
  HelpCircle,
  Flag,
  ChevronLeft,
  ArrowRight,
  Camera,
  CheckCircle2
} from "lucide-react";

export default function StudentLiveExamTakePage() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(4);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [flagged, setFlagged] = useState(false);

  const options = [
    { id: 1, text: "It+6 resolving to V (G Major)" },
    { id: 2, text: "Ger+6 resolving to V via I 6/4" },
    { id: 3, text: "Fr+6 resolving directly to I (C Major)" },
    { id: 4, text: "Secondary Dominant vii°7/V resolving to V" },
  ];

  const handleSaveAndNext = () => {
    if (currentQuestion < 20) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      router.push("/student/exam/results");
    }
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* 1. TOP HEADER BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#900C27] text-white flex items-center justify-center text-xs font-bold">
              ⏱️
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#900C27]">
              Theory Examination: Advanced Harmony
            </h1>
          </div>
          <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 pl-8">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Time Remaining: 48:12</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Info</span>
          </button>
          <button className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>

          <Link
            href="/student/exam/results"
            className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Submit Exam
          </Link>
        </div>

      </div>

      {/* 2. MAIN EXAM GRID (Left Navigator & Proctor | Right Active Question Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Question Navigator & Proctor Status (4 cols / W: 280px) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Question Navigator Box */}
          <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider">
              Question Navigator
            </h3>

            {/* Numbers Grid (1 to 20) */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
              {[1, 2, 3].map((num) => (
                <div key={num} className="w-8 h-8 rounded-lg bg-[#900C27] text-white flex items-center justify-center shadow-2xs">
                  {num}
                </div>
              ))}

              {/* Current Question 4 */}
              <div className="w-8 h-8 rounded-lg border-2 border-sky-600 bg-white text-sky-900 font-extrabold flex items-center justify-center shadow-xs">
                4
              </div>

              {/* Flagged Question 5 */}
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-2xs">
                5
              </div>

              {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                <div key={num} className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-stone-500 flex items-center justify-center font-medium">
                  {num}
                </div>
              ))}
            </div>

            {/* Legend Box */}
            <div className="pt-3 border-t border-sky-100 space-y-1.5 text-[11px] font-semibold text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#900C27]" />
                <span>Answered (3)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-600" />
                <span>Flagged for Review (1)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-white border border-stone-300" />
                <span>Unvisited (16)</span>
              </div>
            </div>
          </div>

          {/* Proctor Status Box */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">PROCTOR STATUS</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-950">
              <Camera className="w-4 h-4 text-purple-700" />
              <span>Camera Active</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Active Question Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
          
          <div className="flex items-center justify-between">
            <span className="bg-rose-50 text-[#900C27] border border-rose-200 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              PART 1: MUSICAL THEORY
            </span>

            <button
              onClick={() => setFlagged(!flagged)}
              className={`px-3.5 py-1 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                flagged
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-amber-600 text-amber-800 hover:bg-amber-50"
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{flagged ? "Flagged" : "FLAG FOR REVIEW"}</span>
            </button>
          </div>

          <h2 className="text-xl font-bold text-[#1B1B24]">
            Question {currentQuestion} of 20
          </h2>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
            Identify the functional harmonic relationship of the chord progression presented below in the context of C Major. The progression includes an augmented sixth chord resolving to the dominant.
          </p>

          {/* Music Score Diagram Container */}
          <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-6 text-center space-y-2">
            <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/classesbg.png"
                alt="Harmonic Analysis Diagram"
                className="w-full h-32 object-contain"
              />
              <span className="text-[10px] font-mono text-stone-400 block pt-1">
                Harmonic Analysis: Augmented Sixth Chords
              </span>
            </div>
          </div>

          {/* 4 Radio Option Cards */}
          <div className="space-y-3 pt-2">
            {options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 text-xs sm:text-sm font-medium ${
                  selectedOption === opt.id
                    ? "border-[#900C27] bg-rose-50/50 text-[#900C27] font-bold"
                    : "border-stone-200 hover:border-stone-300 text-stone-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedOption === opt.id ? "border-[#900C27] bg-[#900C27]" : "border-stone-300"
                  }`}
                >
                  {selectedOption === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <span>{opt.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom Control Buttons */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(1, prev - 1))}
              disabled={currentQuestion === 1}
              className="border border-stone-200 hover:bg-stone-50 text-stone-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>

            <button
              onClick={() => setSelectedOption(null)}
              className="text-stone-500 font-bold hover:text-stone-800 transition-colors uppercase tracking-wider"
            >
              CLEAR ANSWER
            </button>

            <button
              onClick={handleSaveAndNext}
              className="bg-[#900C27] hover:bg-[#780A20] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>SAVE & NEXT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
