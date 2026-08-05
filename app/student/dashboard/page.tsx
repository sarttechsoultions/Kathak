"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  Play,
  Calendar,
  Clock,
  FileText,
  BookOpen,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface StudentUser {
  fullName?: string;
  name?: string;
  role?: string;
}

interface LiveClass {
  title?: string;
  instructor?: string;
  timeStr?: string;
  meetingLink?: string;
  subtitle?: string;
  durationStr?: string;
}

interface RecentClass {
  title: string;
  subtitle: string;
  status: string;
  date: string;
}

interface CourseProgress {
  name: string;
  percent: number;
}

interface Reminder {
  title: string;
  subtitle: string;
}

interface DashboardData {
  user?: {
    fullName?: string;
    email?: string;
    phone?: string;
    profileImage?: string | null;
  };
  currentCourse?: {
    title: string;
    subtitle: string;
    completedLessons: number;
    totalLessons: number;
    progressPercent: number;
  } | null;
  todayLiveClass?: LiveClass | null;
  recentClasses?: RecentClass[];
  upcomingLiveClass?: LiveClass | null;
  courseProgress?: CourseProgress[];
  metrics?: {
    completedLessons: number;
    practiceHours: string;
    assignmentsPending: number;
  };
  reminders?: Reminder[];
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function StudentDashboardPage() {
  const [studentUser, setStudentUser] = useState<StudentUser | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    let isMounted = true;

    // localStorage se user nikaalo (async style – warning avoid)
    const saved = localStorage.getItem("kathak_student_user");
    if (saved) {
      try {
        const u = JSON.parse(saved) as StudentUser;
        if (u && (u.role === "STUDENT" || !u.role)) {
          // microtask mein set karo taaki cascading render warning na aaye
          queueMicrotask(() => {
            if (isMounted) setStudentUser(u);
          });
        }
      } catch {
        // ignore
      }
    }

    const fetchDashboard = async () => {
      try {
        const res = await apiRequest("/student/dashboard");
        if (isMounted && res?.data) {
          setDashboardData(res.data);
          if (res.data.user) {
            setStudentUser(res.data.user);
            localStorage.setItem(
              "kathak_student_user",
              JSON.stringify(res.data.user)
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch student dashboard:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const studentFirstName = (
    dashboardData?.user?.fullName ||
    studentUser?.fullName ||
    studentUser?.name ||
    "Student"
  ).split(" ")[0];

  const currentCourse = dashboardData?.currentCourse;
  const todayLiveClass = dashboardData?.todayLiveClass;
  const recentClasses: RecentClass[] = dashboardData?.recentClasses || [];
  const upcomingLiveClass = dashboardData?.upcomingLiveClass;
  const courseProgressList: CourseProgress[] = dashboardData?.courseProgress || [];
  const metrics = dashboardData?.metrics || {
    completedLessons: 0,
    practiceHours: "0h 00m",
    assignmentsPending: 0,
  };
  const reminders: Reminder[] = dashboardData?.reminders || [];

  if (loading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#900C27]" />
        <span className="text-xs font-semibold text-slate-500">
          Loading student dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* 1. GREETING HEADER */}
      <div className="space-y-1">
        <h1 className="text-[32px] font-bold text-[#1B1B24] leading-[40px] tracking-[-0.32px]">
          {getGreeting()}, {studentFirstName}! 👋
        </h1>
        <p className="text-base font-normal text-[#464555] leading-[24px]">
          {todayLiveClass
            ? `Keep learning, keep growing. Your next class is at ${todayLiveClass.timeStr}.`
            : "Keep learning, keep growing. Welcome to your learning portal."}
        </p>
      </div>

      {/* 2. TOP HERO ROW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CARD 1: CURRENT COURSE */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#800020] via-[#8B1D2C] to-[#600018] rounded-[24px] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[380px]">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4">
            <div className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-white tracking-wide">
              Current Course
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-md">
                <h2 className="text-[32px] font-bold text-white leading-[40px] tracking-[-0.32px]">
                  {currentCourse?.title || "No Enrolled Course Yet"}
                </h2>
                <p className="text-base font-normal text-white/80 leading-[24px]">
                  {currentCourse?.subtitle || "Enroll in a Kathak course to view your curriculum, lessons, and practice progress!"}
                </p>
              </div>

              {/* Circular Progress Widget */}
           <div className="relative w-42 h-42">
  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
    <path
      className="text-white/20"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    />
    <path
      className="text-white"
      stroke="currentColor"
      strokeWidth="3"
      strokeDasharray={`${currentCourse?.progressPercent || 0}, 100`}
      strokeLinecap="round"
      fill="none"
      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    />
  </svg>
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-2xl font-bold text-white">{currentCourse?.progressPercent || 0}%</span>
    <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/90">PROGRESS</span>
  </div>
</div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/student/classes"
              className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-[#800020] px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Continue Learning</span>
              <Play className="w-4 h-4 fill-[#800020]" />
            </Link>
          </div>

        </div>

        {/* CARD 2: TODAY'S LIVE CLASS */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between min-h-[380px]">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#1B1B24]">
                Today&apos;s Live Class
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                todayLiveClass ? "bg-rose-50 text-[#C10F3A] border border-rose-200" : "bg-stone-100 text-stone-500"
              }`}>
                {todayLiveClass && <span className="w-1.5 h-1.5 rounded-full bg-[#C10F3A] animate-ping" />}
                {todayLiveClass ? "LIVE" : "SCHEDULED"}
              </span>
            </div>

            <div className="bg-[#F6F2FF] rounded-[16px] p-4 flex items-center gap-4 border border-purple-100">
              <div className="bg-purple-100 text-purple-950 px-3 py-2 rounded-xl text-center shrink-0">
                <span className="text-xs font-bold block">{todayLiveClass?.timeStr ? todayLiveClass.timeStr.split(" ")[0] : "--"}</span>
                <span className="text-[10px] font-semibold text-purple-700 uppercase block">{todayLiveClass?.timeStr ? (todayLiveClass.timeStr.split(" ")[1] || "PM") : "TIME"}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B1B24]">
                  {todayLiveClass?.title || "No Live Class Today"}
                </h4>
                <p className="text-xs text-stone-500 font-medium">
                  {todayLiveClass?.instructor ? `by ${todayLiveClass.instructor}` : "Check schedule for upcoming classes"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href={todayLiveClass?.meetingLink || "/student/classes"}
              className="w-full bg-[#900C27] hover:bg-[#780A20] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Video className="w-4 h-4 fill-white" />
              <span>{todayLiveClass ? "Join Live Class" : "View Class Schedule"}</span>
            </Link>
          </div>

        </div>

      </div>

      {/* 3. QUICK ACTIONS GRID SECTION */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xl font-semibold text-[#1B1B24]">
          Quick Actions
        </h3>

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

      {/* 4. MIDDLE 3-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: ATTENDANCE CALENDAR */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1B1B24]">
              Attendance Calendar
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
              <button className="hover:text-black">‹</button>
              <span>August 2026</span>
              <button className="hover:text-black">›</button>
            </div>
          </div>

          <div className="space-y-2 text-center text-xs">
            <div className="grid grid-cols-7 gap-1 font-semibold text-stone-400 text-[11px] pb-1">
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            <div className="grid grid-cols-7 gap-1 font-medium">
              <span className="text-stone-300 py-1.5">26</span>
              <span className="text-stone-300 py-1.5">27</span>
              <span className="text-stone-300 py-1.5">28</span>
              <span className="text-stone-300 py-1.5">29</span>
              <span className="text-stone-300 py-1.5">30</span>
              <span className="text-stone-300 py-1.5">31</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">1</span>

              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">2</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">3</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">4</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">5</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">6</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-600 font-bold">7</span>
              <span className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border-2 border-rose-500 text-rose-600 font-bold">8</span>
            </div>
          </div>

          <p className="text-[10px] text-stone-400 text-center pt-2">
            Click on any date to see class details
          </p>
        </div>

        {/* COLUMN 2: RECENT CLASSES */}
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
            {recentClasses.length > 0 ? (
                  recentClasses.map((rc, idx) => (                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#900C27] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-[#1B1B24] block">{rc.title}</span>
                      <span className="text-[10px] text-stone-500">{rc.subtitle}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold block ${
                      rc.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {rc.status}
                    </span>
                    <span className="text-[10px] text-stone-400">{rc.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
                No recent attendance records found.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: UPCOMING LIVE CLASS & COURSE PROGRESS */}
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

            <h4 className="text-sm font-bold text-[#1B1B24]">
              {upcomingLiveClass?.title || "No Upcoming Class Scheduled"}
            </h4>
            <p className="text-xs text-stone-500">
              {upcomingLiveClass?.subtitle || "Check back soon for new live sessions"}
            </p>

            {upcomingLiveClass && (
              <div className="text-[11px] text-stone-400 flex items-center gap-3 pt-1">
                <span>📅 {upcomingLiveClass.timeStr}</span>
                <span>⏱️ {upcomingLiveClass.durationStr}</span>
              </div>
            )}

            <a
              href={upcomingLiveClass?.meetingLink || "/student/classes"}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#900C27] hover:bg-[#780A20] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all block text-center"
            >
              <Video className="w-3.5 h-3.5 fill-white" />
              <span>{upcomingLiveClass ? "Join Live Class" : "View Schedule"}</span>
            </a>
          </div>

          {/* Course Progress Card */}
          <div className="bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1B1B24]">Course Progress</h3>
              <Link href="/student/progress" className="text-xs text-[#900C27] font-semibold hover:underline">View All</Link>
            </div>

            <div className="space-y-3 text-xs">
              {courseProgressList.length > 0 ? (
                courseProgressList.map((cp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-[#1B1B24]">{cp.name}</span>
                      <span className="text-stone-500">{cp.percent}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#900C27] h-full rounded-full transition-all duration-500" style={{ width: `${cp.percent}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
                  No course progress tracked yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 5. BOTTOM ROW: METRIC CARDS & REMINDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 3 Stat Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#900C27] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">COMPLETED LESSONS</span>
              <span className="text-2xl font-bold text-[#1B1B24]">{metrics.completedLessons}</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">PRACTICE HOURS</span>
              <span className="text-2xl font-bold text-[#1B1B24]">{metrics.practiceHours}</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">ASSIGNMENTS PENDING</span>
              <span className="text-2xl font-bold text-[#1B1B24]">{metrics.assignmentsPending}</span>
            </div>
          </div>

        </div>

        {/* Right Reminders Box */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1B1B24]">Reminders</h3>
            <button className="text-xs text-rose-500 font-semibold hover:underline cursor-pointer">Clear all</button>
          </div>

          <div className="space-y-3 text-xs">
            {reminders.length > 0 ? (
              reminders.map((rem, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-50/60 border-l-4 border-[#900C27]">
                  <span className="font-bold text-[#1B1B24] block">{rem.title}</span>
                  <span className="text-[10px] text-stone-500">{rem.subtitle}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
                No active reminders.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
