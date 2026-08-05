"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Video,
  BookOpen,
  Calendar,
  Clock,
  UserPlus,
  CalendarPlus,
  UploadCloud,
  FilePlus,
  Award,
  BarChart2,
  Bell,
  Play,
  ArrowRight,
  Loader2
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

const fontJakarta = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const fontInter = { fontFamily: "'Inter', sans-serif" };

interface DashboardStats {
  totalStudents: number;
  todaysClasses: number;
  pendingReviews: number;
  totalCourses: number;
  attendanceRate: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  batchInfo: string;
  studentsCount: number;
  status: "LIVE" | "UPCOMING";
  startsIn?: string;
}

interface RecentSubmission {
  id: string;
  studentName: string;
  avatar: string;
  topic: string;
  timeAgo: string;
}

export default function TeacherDashboardView() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 128,
    todaysClasses: 3,
    pendingReviews: 12,
    totalCourses: 8,
    attendanceRate: "91%"
  });

  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([
    {
      id: "sch-1",
      time: "14:00 PM",
      title: "Advanced Kathak Foundations",
      batchInfo: "Batch A-2",
      studentsCount: 18,
      status: "LIVE"
    },
    {
      id: "sch-2",
      time: "16:30 PM",
      title: "Introduction to Odissi",
      batchInfo: "Batch B-1",
      studentsCount: 24,
      status: "UPCOMING",
      startsIn: "Starts in 4h"
    }
  ]);

  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([
    {
      id: "sub-1",
      studentName: "Aryan Sharma",
      avatar: "/Ananya.png",
      topic: "Chhau Basics - Module 3",
      timeAgo: "10m ago"
    },
    {
      id: "sub-2",
      studentName: "Isha Patel",
      avatar: "/Sunita.png",
      topic: "Kathak Footwork Drills",
      timeAgo: "45m ago"
    },
    {
      id: "sub-3",
      studentName: "Meera Iyer",
      avatar: "/Meera.png",
      topic: "Hand Gestures (Mudras)",
      timeAgo: "2h ago"
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTeacherDashboardData = async () => {
      try {
        const res = await apiRequest<{
          status: string;
          data?: {
            stats?: Partial<DashboardStats>;
            schedules?: ScheduleItem[];
            submissions?: RecentSubmission[];
          };
        }>(ENDPOINTS.ADMIN_DASHBOARD);

        if (!isMounted) return;

        if (res.data?.stats) {
          setStats((prev) => ({
            ...prev,
            ...res.data?.stats
          }));
        }

        if (Array.isArray(res.data?.schedules) && res.data.schedules.length > 0) {
          setScheduleList(res.data.schedules);
        }

        if (Array.isArray(res.data?.submissions) && res.data.submissions.length > 0) {
          setRecentSubmissions(res.data.submissions);
        }
      } catch (err: unknown) {
        console.log("Teacher dashboard fallback data active:", (err as Error).message || err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTeacherDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* GREETING HEADER BANNER & DATE PICKER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight"
            style={fontJakarta}
          >
            Good Morning, Harshita Ma&apos;am!
          </h1>
          <p className="text-sm font-medium text-slate-500" style={fontInter}>
            You have <strong className="text-[#9E0C25] font-bold">{stats.todaysClasses} classes</strong> scheduled for today and{" "}
            <strong className="text-blue-600 font-bold">{stats.pendingReviews} practice videos</strong> waiting for your review.
          </p>
        </div>

        {/* Dynamic Date Badge Card */}
        <div className="bg-white border border-stone-200/80 rounded-2xl px-4 py-2.5 shadow-2xs flex items-center gap-2.5 self-stretch sm:self-auto justify-center">
          <Calendar className="w-4 h-4 text-[#9E0C25]" />
          <span className="text-xs font-bold text-stone-700">{currentDate || "June 14, 2024"}</span>
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9E0C25] ml-1" />}
        </div>
      </div>

      {/* TOP 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Students */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL STUDENTS</p>
          <h3
            className="text-4xl font-extrabold text-[#0B1C30] tracking-tight"
            style={fontInter}
          >
            {stats.totalStudents}
          </h3>
        </div>

        {/* Card 2: Today's Classes */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">TODAY&apos;S CLASSES</p>
          <h3
            className="text-4xl font-extrabold text-[#0B1C30] tracking-tight"
            style={fontInter}
          >
            {String(stats.todaysClasses).padStart(2, "0")}
          </h3>
        </div>

        {/* Card 3: Pending Reviews */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">PENDING REVIEWS</p>
          <h3
            className="text-4xl font-extrabold text-[#0B1C30] tracking-tight"
            style={fontInter}
          >
            {stats.pendingReviews}
          </h3>
        </div>

        {/* Card 4: Total Courses */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL COURSES</p>
          <h3
            className="text-4xl font-extrabold text-[#0B1C30] tracking-tight"
            style={fontInter}
          >
            {String(stats.totalCourses).padStart(2, "0")}
          </h3>
        </div>
      </div>

      {/* MAIN CONTENT 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (lg:col-span-7 / ~605px width in Figma) */}
        <div className="lg:col-span-7 space-y-8">
          {/* TODAY'S SCHEDULE SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900" style={fontJakarta}>
                Today&apos;s Schedule
              </h3>
              <button className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">
                View Calendar
              </button>
            </div>

            <div className="space-y-3.5">
              {scheduleList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Time Badge */}
                    <div
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 ${
                        item.status === "LIVE"
                          ? "bg-rose-50 text-[#9E0C25] border border-rose-100"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {item.time}
                    </div>

                    {/* Class Details */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-stone-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.batchInfo} • {item.studentsCount} Students</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {item.status === "LIVE" ? (
                      <button className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Live Class</span>
                      </button>
                    ) : (
                      <span className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-500 text-xs font-bold block text-center">
                        {item.startsIn || "Upcoming"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ATTENDANCE OVERVIEW & RECENT SUBMISSIONS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Attendance Overview Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-stone-900" style={fontJakarta}>
                Attendance Overview
              </h3>

              <div className="flex flex-col items-center justify-center py-2">
                {/* Donut Ring Chart */}
                <div className="w-36 h-36 rounded-full border-[10px] border-[#9E0C25] flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="text-2xl font-extrabold text-stone-900" style={fontInter}>
                    {stats.attendanceRate}
                  </span>
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                    AVERAGE
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-500 text-center font-medium leading-relaxed">
                Exceptional attendance rate today across all dance batches.
              </p>
            </div>

            {/* Recent Submissions Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900" style={fontJakarta}>
                  Recent Submissions
                </h3>
                <button className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">
                  See all
                </button>
              </div>

              <div className="space-y-3.5">
                {recentSubmissions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sub.avatar}
                        alt={sub.studentName}
                        className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <h5 className="font-bold text-xs text-stone-900 leading-tight">
                          {sub.studentName}
                        </h5>
                        <p className="text-[11px] font-semibold text-stone-400">
                          {sub.topic}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-400 whitespace-nowrap">
                      {sub.timeAgo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (lg:col-span-5 - Quick Actions & Announcement) */}
        <div className="lg:col-span-5 space-y-8">
          {/* QUICK ACTIONS (2x3 Grid) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-900" style={fontJakarta}>
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Button 1: Add Student */}
              <button className="p-4 rounded-2xl bg-[#EFF6FF] hover:bg-blue-100/80 border border-blue-100 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-stone-800">Add Student</span>
              </button>

              {/* Button 2: Schedule Class */}
              <button className="p-4 rounded-2xl bg-[#EFF6FF] hover:bg-blue-100/80 border border-blue-100 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  <CalendarPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-stone-800">Schedule Class</span>
              </button>

              {/* Button 3: Upload Course */}
              <button className="p-4 rounded-2xl bg-[#EFF6FF] hover:bg-blue-100/80 border border-blue-100 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-stone-800">Upload Course</span>
              </button>

              {/* Button 4: Create Assignment */}
              <button className="p-4 rounded-2xl bg-[#EFF6FF] hover:bg-blue-100/80 border border-blue-100 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  <FilePlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-stone-800">Create Assignment</span>
              </button>

              {/* Button 5: Issue Certificate */}
              <button className="p-4 rounded-2xl bg-[#EFF6FF] hover:bg-blue-100/80 border border-blue-100 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-stone-800">Issue Certificate</span>
              </button>

              {/* Button 6: View Reports */}
              <button className="p-4 rounded-2xl bg-[#EFF6FF] hover:bg-blue-100/80 border border-blue-100 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-stone-800">View Reports</span>
              </button>
            </div>
          </div>

          {/* ANNOUNCEMENT CARD */}
          <div className="bg-[#9E0C25] rounded-3xl p-7 text-white space-y-4 shadow-lg relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-widest text-white/90">
              <Bell className="w-3 h-3" />
              <span>ANNOUNCEMENT</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-playfair font-bold text-xl leading-tight">
                Annual Nritya Festival 2024
              </h4>
              <p className="text-xs text-rose-100/90 leading-relaxed font-normal">
                Prepare your students for the upcoming national showcase. Registrations close in 5 days.
              </p>
            </div>

            <button className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-[#9E0C25] font-extrabold text-xs shadow-md transition-all cursor-pointer">
              Details
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-stone-400">
        <div className="flex items-center gap-4">
          <span className="text-[#9E0C25] font-bold">Nritya Academy</span>
          <span>© 2024 Dance & Music Academy</span>
        </div>
        <div className="flex items-center gap-6 text-stone-400">
          <button className="hover:text-stone-700 transition-colors cursor-pointer">Privacy Policy</button>
          <button className="hover:text-stone-700 transition-colors cursor-pointer">Terms of Service</button>
        </div>
      </footer>
    </div>
  );
}
