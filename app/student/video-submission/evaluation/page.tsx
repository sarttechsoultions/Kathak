"use client";

import React from "react";
import Link from "next/link";
import {
  RotateCcw,
  Play,
  Lock,
  Sparkles,

} from "lucide-react";

export default function StudentTaskEvaluationPage() {
  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* BREADCRUMB & PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            <Link href="/student/video-submission" className="hover:text-[#900C27] transition-colors">
              ASSIGNMENTS
            </Link>
            <span>›</span>
            <span className="text-[#900C27] font-bold">TASK EVALUATION</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1B24]">
            Tatkar Footwork Practice
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider">
              • EVALUATED
            </span>
            <span className="text-stone-500 font-medium">
              Course: Foundation of Kathak Rhythm
            </span>
          </div>
        </div>

        {/* TOP RIGHT ACTION: Practice Again */}
        <div className="shrink-0">
          <Link
            href="/student/assignments/upload"
            className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </Link>
        </div>
      </div>

      {/* TOP GRID: Video Player Left | Overall Performance Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* VIDEO PLAYER CONTAINER (8 cols) */}
        <div className="lg:col-span-8 bg-stone-900 rounded-[24px] overflow-hidden relative shadow-lg min-h-[340px] border border-stone-800 flex flex-col justify-between p-6 text-white">
          {/* Background Video Stream */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gurukul-dancer.jpg"
              alt="Submitted Video Take 2"
              className="w-full h-full object-cover object-center filter brightness-90"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/classesbg.png";
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Center Play Button Overlay */}
          <div className="relative z-10 my-auto mx-auto">
            <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </button>
          </div>

          {/* Bottom Video Info Overlay */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/90 font-medium pt-8">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-mono text-[11px]">
              SUBMISSION VIDEO: TAKE 2
            </span>
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-mono text-[10px]">
              MP4 • 1080p • 42MB (03:42 / 05:20)
            </span>
          </div>
        </div>

        {/* OVERALL PERFORMANCE CARD (4 cols - Solid Maroon Red Background) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#800020] via-[#8B1D2C] to-[#600018] rounded-[24px] p-6 text-white flex flex-col justify-between space-y-6 shadow-md border border-rose-950">
          
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-200 block">
              OVERALL PERFORMANCE
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">8.5</span>
              <span className="text-xl font-bold text-rose-200">/10</span>
            </div>

            <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white">
              Distinction Level
            </span>
          </div>

          {/* Progress Breakdown Bars */}
          <div className="space-y-3 pt-2 text-xs">
            
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-rose-100">TECHNIQUE</span>
                <span className="text-white font-bold">9/10</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: "90%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-rose-100">RHYTHM (TAAL)</span>
                <span className="text-white font-bold">8/10</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: "80%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-rose-100">POSTURE</span>
                <span className="text-white font-bold">8.5/10</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MIDDLE GRID: Guru's Comprehensive Review Left | Correction Notes Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT BOX: Guru's Comprehensive Review (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
          <h3 className="text-base font-bold text-[#1B1B24]">
            Guru&apos;s Comprehensive Review
          </h3>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 text-xs sm:text-sm text-stone-700 leading-relaxed italic">
            &ldquo;Arjun, your dedication to the rhythm is evident. Your speed (Laya) in the second section was commendable, but it should not come at the cost of clarity. The &apos;Tath&apos; sounds are becoming muffled as you accelerate. Focus on the distinct separation of foot movements even in Drut Laya. Your upper body posture has improved significantly since the last session, but ensure your arms remain engaged during transitions between Chakkars.&rdquo;
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400 font-medium pt-2 border-t border-stone-100 gap-2">
            <div>
              <span className="block text-[10px] uppercase text-stone-400 font-bold">DATE SUBMITTED</span>
              <span className="text-stone-700 font-semibold">Oct 12, 2023 • 09:15 AM</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-stone-400 font-bold">EVALUATION DATE</span>
              <span className="text-stone-700 font-semibold">Oct 14, 2023 • 02:30 PM</span>
            </div>
          </div>
        </div>

        {/* RIGHT BOX: Correction Notes (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider">
              CORRECTION NOTES
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                01
              </span>
              <p className="text-stone-700 leading-snug">
                Heel impact needs more weight for a grounded &apos;Tath&apos; sound.
              </p>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                02
              </span>
              <p className="text-stone-700 leading-snug">
                Maintain upright posture during Chakkars; avoid leaning forward.
              </p>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                03
              </span>
              <p className="text-stone-700 leading-snug">
                Hand placement (Hasta) must be firm and not shaky during footwork.
              </p>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                04
              </span>
              <p className="text-stone-700 leading-snug">
                Eyes should follow the direction of the hands (Drishti Bheda).
              </p>
            </div>

          </div>

          {/* REVIEWED BY BOX */}
          <div className="pt-3 border-t border-stone-100">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-2">
              REVIEWED BY
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-300 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Ananya.png" alt="Guru Priya Darshini" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1B1B24]">Guru Priya Darshini</h4>
                <p className="text-[10px] text-stone-500 font-medium">Senior Evaluator • Kathak Maestro</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM ROW: Recommended for You (3 Cards) */}
      <div className="space-y-4 pt-2">
        <h3 className="text-lg font-bold text-[#1B1B24]">
          Recommended for You
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden p-4 space-y-3">
            <div className="h-32 bg-stone-900 rounded-xl overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Grace1.png" alt="Advanced Tatkar" className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                NEW LESSON
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1B1B24]">Advanced Tatkar Patterns</h4>
              <p className="text-[10px] text-stone-400 font-medium">32 Modules • 45 mins</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden p-4 space-y-3">
            <div className="h-32 bg-stone-900 rounded-xl overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Grace2.png" alt="Teental Rhythmic" className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-[#900C27] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                RECOMMENDED
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1B1B24]">Rhythmic Variations: Teental</h4>
              <p className="text-[10px] text-stone-400 font-medium">18 Modules • 30 mins</p>
            </div>
          </div>

          {/* Card 3 (Locked) */}
          <div className="bg-stone-100 rounded-2xl border border-stone-200/80 p-4 flex flex-col justify-between space-y-3">
            <div className="h-32 rounded-xl bg-stone-200/80 flex items-center justify-center text-stone-400">
              <Lock className="w-6 h-6 text-stone-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-500">Laya Mastery (Locked)</h4>
              <p className="text-[10px] text-stone-400 font-medium">Requires 9.0 Grade</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
