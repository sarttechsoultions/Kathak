"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  Play,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Bell,
  Wifi,
  Camera,
  Mic,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function StudentLiveClassesPage() {
  const [reminded1, setReminded1] = useState(false);
  const [reminded2, setReminded2] = useState(true);

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-bold text-[#0B1C30] tracking-tight">
          Live Classes
        </h1>
        <p className="text-sm font-normal text-[#464555]">
          Stay synchronized with your Guru. Join live sessions to perfect your Mudras and Taal.
        </p>
      </div>

      {/* TOP STATS BAR (3 Metric Items) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#900C27] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-stone-400 font-medium block">Completed Classes</span>
            <span className="text-2xl font-extrabold text-[#0B1C30]">42</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-400 font-medium block">Upcoming Classes</span>
              <span className="text-2xl font-extrabold text-[#0B1C30]">12</span>
            </div>
          </div>
          <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">This Month</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-stone-400 font-medium block">Overall Attendance</span>
            <span className="text-2xl font-extrabold text-[#0B1C30]">92%</span>
          </div>
        </div>

      </div>

      {/* MAIN 2-COLUMN GRID (W: 603px Left Column | W: 290px Right Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (8 cols): Hero Live Banner & Upcoming Sessions */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* MAIN LIVE SESSION BANNER CARD */}
          <div className="bg-stone-900 rounded-[24px] overflow-hidden relative shadow-lg min-h-[380px] flex flex-col justify-between p-6 sm:p-8 text-white border border-stone-800">
            
            {/* Background Dancer Performance Image */}
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gurukul-dancer.jpg"
                alt="Live Kathak Class"
                className="w-full h-full object-cover object-center filter brightness-60"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/classesbg.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/40" />
            </div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#C10F3A] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  LIVE NOW
                </span>
                <span className="bg-black/50 backdrop-blur-md border border-white/20 text-white/90 px-3 py-1 rounded-full text-xs font-medium">
                  42 Students Watching
                </span>
              </div>
            </div>

            {/* Center & Bottom Title, Guru & Action */}
            <div className="relative z-10 space-y-4 pt-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Kathak Basics - Advanced Footwork
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-stone-700 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/Ananya.png" alt="Guru Meenakshi" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">Guru Meenakshi</span>
                    <span className="text-xs text-white/70">Senior Faculty</span>
                  </div>
                </div>

                <div className="text-xs text-rose-200 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ends in 45:20</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/student/classes/room"
                  className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-[#900C27] font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-[#900C27]" />
                  <span>Join Class Now</span>
                </Link>
              </div>
            </div>

          </div>

          {/* UPCOMING SESSIONS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0B1C30]">
                Upcoming Sessions
              </h3>
              <a href="#calendar" className="text-xs font-semibold text-[#900C27] hover:underline">
                View Full Calendar
              </a>
            </div>

            <div className="space-y-3">
              
              {/* Session 1 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase">JUL</span>
                    <span className="text-lg font-extrabold leading-none">20</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1C30]">
                      Abhinaya Expressions - Navarasa
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      👤 Guru Rahul • 10:30 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setReminded1(!reminded1)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      reminded1
                        ? "bg-rose-50 border-[#900C27] text-[#900C27]"
                        : "border-stone-200 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {reminded1 ? "✓ Reminder Set" : "Remind Me"}
                  </button>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-400 cursor-not-allowed">
                    Join Session
                  </button>
                </div>
              </div>

              {/* Session 2 */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase">JUL</span>
                    <span className="text-lg font-extrabold leading-none">22</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1C30]">
                      Rhythm & Taal Patterns (Teen Taal)
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      👤 Guru Harshita • 04:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setReminded2(!reminded2)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      reminded2
                        ? "bg-[#900C27] text-white shadow-sm"
                        : "border border-stone-200 text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {reminded2 ? "Set Reminder" : "Remind Me"}
                  </button>
                  <button disabled className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-400 cursor-not-allowed">
                    Join Session
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 cols): System Check, Mini Calendar & Guru's Tip */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SYSTEM DIAGNOSTICS CARD: "Ready for Class?" */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-semibold text-[#0B1C30]">
                Ready for Class?
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-2.5">
                  <Wifi className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold text-[#0B1C30]">Internet Connection</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-2.5">
                  <Camera className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold text-[#0B1C30]">Camera Status</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold text-[#0B1C30]">Microphone</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>

            <button className="w-full border border-dashed border-stone-300 hover:border-stone-400 text-stone-700 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Diagnostics</span>
            </button>
          </div>

          {/* MINI CALENDAR & TODAY'S REMINDERS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#0B1C30] uppercase tracking-wider">July 2025</h4>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <button className="hover:text-black">‹</button>
                <button className="hover:text-black">›</button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-400">
              <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              <span className="text-stone-300 py-1">13</span>
              <span className="text-stone-300 py-1">14</span>
              <span className="w-7 h-7 mx-auto rounded-full bg-[#900C27] text-white flex items-center justify-center font-bold">15</span>
              <span className="py-1">16</span>
              <span className="py-1">17</span>
              <span className="py-1">18</span>
              <span className="py-1">19</span>
              <span className="w-7 h-7 mx-auto rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center">20</span>
              <span className="w-7 h-7 mx-auto rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center">21</span>
              <span className="w-7 h-7 mx-auto rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center">22</span>
              <span className="py-1">23</span>
              <span className="py-1">24</span>
              <span className="py-1">25</span>
              <span className="py-1">26</span>
            </div>

            {/* TODAY'S REMINDERS */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">TODAY&apos;S REMINDERS</span>
              
              <div className="p-3 rounded-xl bg-rose-50/70 border-l-4 border-[#900C27] text-xs">
                <span className="font-bold text-[#0B1C30] block">Footwork Practise</span>
                <span className="text-[10px] text-stone-500">05:00 PM • Live in 15m</span>
              </div>
            </div>
          </div>

          {/* GURU'S TIP FOR TODAY CARD */}
          <div className="bg-[#2ba4e3] rounded-2xl p-10 text-white space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Guru&apos;s Tip for Today
            </h3>
            <p className="text-xs font-normal text-white/95 italic leading-relaxed">
              &ldquo;Remember, the Taal lives in your breath as much as your feet. Sync your breathing to the Teen Taal for natural fluidity.&rdquo;
            </p>
            <span className="text-xs font-semibold text-white/80 block text-right">
              — Guru Meenakshi
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
