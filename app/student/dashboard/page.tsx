"use client";

import React from "react";
import Link from "next/link";
import {
  Video,
  Play,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  Award,
  CreditCard,
  HelpCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowUpRight
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* 1. GREETING HEADER (Exact Figma Specs: Inter Bold 32px #1B1B24) */}
      <div className="space-y-1">
        <h1 className="text-[32px] font-bold text-[#1B1B24] leading-[40px] tracking-[-0.32px]">
          Good Morning, Rahul! 👋
        </h1>
        <p className="text-base font-normal text-[#464555] leading-[24px]">
          Keep learning, keep growing. Your next class is in 6 hours.
        </p>
      </div>

      {/* 2. TOP HERO ROW GRID (W: 960px, H: 412px, Gap: 24px) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CARD 1: CURRENT COURSE (W: 632px / 8 cols, Maroon Red Gradient, Corner Radius: 24px) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#800020] via-[#8B1D2C] to-[#600018] rounded-[24px] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[380px]">
          
          {/* Subtle Glow Background Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Section */}
          <div className="space-y-4">
            <div className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-white tracking-wide">
              Current Course
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-md">
                <h2 className="text-[32px] font-bold text-white leading-[40px] tracking-[-0.32px]">
                  Bharatanatyam Intermediate
                </h2>
                <p className="text-base font-normal text-white/80 leading-[24px]">
                  Master the rhythm of the soul. You&apos;ve completed 28 of 40 lessons. Practice your Mudras today!
                </p>
              </div>

              {/* Circular Progress Widget (72% PROGRESS) */}
              <div className="shrink-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-white/30 border-t-white flex flex-col items-center justify-center text-center p-2 relative bg-white/5 backdrop-blur-xs">
                  <span className="text-2xl font-bold text-white">72%</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/90">PROGRESS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="pt-6">
            <a
              href="#continue"
              className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-[#800020] px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Continue Learning</span>
              <Play className="w-4 h-4 fill-[#800020]" />
            </a>
          </div>

        </div>

        {/* CARD 2: TODAY'S LIVE CLASS (W: 304px / 4 cols, White, Corner Radius: 24px) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between min-h-[380px]">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#1B1B24]">
                Today&apos;s Live Class
              </h3>
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-[#C10F3A] border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C10F3A] animate-ping" />
                LIVE
              </span>
            </div>

            {/* Class Details Tint Box */}
            <div className="bg-[#F6F2FF] rounded-[16px] p-4 flex items-center gap-4 border border-purple-100">
              <div className="bg-purple-100 text-purple-950 px-3 py-2 rounded-xl text-center shrink-0">
                <span className="text-xs font-bold block">05:00</span>
                <span className="text-[10px] font-semibold text-purple-700 uppercase block">PM</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B1B24]">Kathak Practice Session</h4>
                <p className="text-xs text-stone-500 font-medium">by Neha Sharma</p>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <div className="pt-4">
            <Link
              href="/student/classes/room"
              className="w-full bg-[#900C27] hover:bg-[#780A20] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Video className="w-4 h-4 fill-white" />
              <span>Join Live Class</span>
            </Link>
          </div>

        </div>

      </div>

      {/* 3. QUICK ACTIONS GRID SECTION */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xl font-semibold text-[#1B1B24]">
          Quick Actions
        </h3>

        {/* 8 Action Items Row matching Figma Real Icons */}
        <div className="bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: "Recorded Classes", href: "/student/recorded-classes", iconSrc: "/student/recordedclasses.png" },
            { label: "Assignments", href: "/student/assignments", iconSrc: "/student/assignments.png" },
            { label: "Upload Practice", href: "/student/video-submission", iconSrc: "/student/upload.png" },
            { label: "Attendance", href: "/student/attendance", iconSrc: "/student/attendance.png" },
            { label: "Certificates", href: "/student/certificates", iconSrc: "/student/certificate.png" },
            { label: "Fee Management", href: "/student/finance", iconSrc: "/student/fee.png" },
            { label: "Support", href: "/student/support", iconSrc: "/student/support.png" },
            { label: "Events", href: "/student/events", iconSrc: "/student/events.png" },
          ].map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-[#F8F6FA] transition-all group cursor-pointer text-center space-y-2.5"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F6ECEF] flex items-center justify-center group-hover:scale-105 transition-all shadow-2xs p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={action.iconSrc}
                  alt={action.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-medium text-[#1B1B24] group-hover:text-[#900C27] transition-colors leading-snug">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. MIDDLE 3-COLUMN GRID (Attendance Calendar | Recent Classes | Upcoming Live Class) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: ATTENDANCE CALENDAR (W: 304px / 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1B1B24]">
              Attendance Calendar
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
              <button className="hover:text-black">‹</button>
              <span>July 2026</span>
              <button className="hover:text-black">›</button>
            </div>
          </div>

          {/* Days Grid */}
          <div className="space-y-2 text-center text-xs">
            <div className="grid grid-cols-7 gap-1 font-semibold text-stone-400 text-[11px] pb-1">
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            {/* Calendar Dates */}
            <div className="grid grid-cols-7 gap-1 font-medium">
              <span className="text-stone-300 py-1.5">29</span>
              <span className="text-stone-300 py-1.5">30</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">1</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">2</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">3</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">4</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-rose-500 text-rose-600 font-bold">5</span>

              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">6</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">7</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">8</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">9</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">10</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-amber-500 text-amber-600 font-bold">11</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-rose-500 text-rose-600 font-bold">12</span>
            </div>
          </div>

          <p className="text-[10px] text-stone-400 text-center pt-2">
            Click on any date to see class details
          </p>
        </div>

        {/* COLUMN 2: RECENT CLASSES (W: 304px / 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1B1B24]">
              Recent Classes
            </h3>
            <Link href="/student/recorded-classes" className="text-xs text-[#900C27] font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-800 shrink-0" />
                <div>
                  <span className="font-bold text-[#1B1B24] block">Tatkaar Practice</span>
                  <span className="text-[10px] text-stone-500">Basic Footwork</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold block">Present</span>
                <span className="text-[10px] text-stone-400">12 Jul, 2026</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-950 shrink-0" />
                <div>
                  <span className="font-bold text-[#1B1B24] block">Live Class</span>
                  <span className="text-[10px] text-stone-500">Rhythm & Taal</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold block">Present</span>
                <span className="text-[10px] text-stone-400">11 Jul, 2026</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-700 shrink-0" />
                <div>
                  <span className="font-bold text-[#1B1B24] block">Theory Session</span>
                  <span className="text-[10px] text-stone-500">Kathak History</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold block">Absent</span>
                <span className="text-[10px] text-stone-400">10 Jul, 2026</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-800 shrink-0" />
                <div>
                  <span className="font-bold text-[#1B1B24] block">Abhinaya Workshop</span>
                  <span className="text-[10px] text-stone-500">Expressions</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold block">Present</span>
                <span className="text-[10px] text-stone-400">9 Jul, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: UPCOMING LIVE CLASS & COURSE PROGRESS (W: 304px / 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Live Class Card */}
          <div className="bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1B1B24]">Upcoming Live Class</h3>
              <Link href="/student/classes" className="text-xs text-[#900C27] font-semibold hover:underline">View All</Link>
            </div>

            <div className="h-32 bg-stone-900 rounded-2xl flex items-center justify-center relative overflow-hidden group">
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-white" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-[#1B1B24]">Kathak Intermediate</h4>
            <p className="text-xs text-stone-500">Chakkar Techniques</p>

            <div className="text-[11px] text-stone-400 flex items-center gap-3 pt-1">
              <span>📅 Today, 7:00 PM</span>
              <span>⏱️ 60 min</span>
            </div>

            <a
              href="https://zoom.us"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#900C27] hover:bg-[#780A20] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all block text-center"
            >
              <Video className="w-3.5 h-3.5 fill-white" />
              <span>Join Live Class</span>
            </a>
          </div>

          {/* Course Progress Card */}
          <div className="bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1B1B24]">Course Progress</h3>
              <Link href="/student/progress" className="text-xs text-[#900C27] font-semibold hover:underline">View All</Link>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#1B1B24]">Beginner Course</span>
                  <span className="text-stone-500">75%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#900C27] h-full rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#1B1B24]">Tatkaar & Footwork</span>
                  <span className="text-stone-500">90%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#900C27] h-full rounded-full" style={{ width: "90%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-[#1B1B24]">Abhinaya Course</span>
                  <span className="text-stone-500">60%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#900C27] h-full rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. BOTTOM ROW: METRIC CARDS & REMINDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 3 Stat Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#900C27] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">COMPLETED LESSONS</span>
              <span className="text-2xl font-bold text-[#1B1B24]">12</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">PRACTICE HOURS</span>
              <span className="text-2xl font-bold text-[#1B1B24]">8h 24m</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">ASSIGNMENTS PENDING</span>
              <span className="text-2xl font-bold text-[#1B1B24]">4</span>
            </div>
          </div>

        </div>

        {/* Right Reminders Box (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1B1B24]">Reminders</h3>
            <button className="text-xs text-rose-500 font-semibold hover:underline">Clear all</button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-rose-50/60 border-l-4 border-[#900C27]">
              <span className="font-bold text-[#1B1B24] block">Hasta Mudras Practice</span>
              <span className="text-[10px] text-stone-500">Submission due in 2 hours</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 border-l-4 border-[#900C27]">
              <span className="font-bold text-[#1B1B24] block">Kathak Practice Session</span>
              <span className="text-[10px] text-stone-500">Starting at 05:00 PM</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 border-l-4 border-[#900C27]">
              <span className="font-bold text-[#1B1B24] block">July Monthly Fee</span>
              <span className="text-[10px] text-stone-500">Payment processed</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
