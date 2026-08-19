"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  BookOpen,
  Video,
  Loader2,
  TrendingUp,
  // Calendar,
  // ChevronRight
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

interface StudentRecord {
  id: string;
  name: string;
  avatar: string;
  status: "Active" | "Inactive" | "Blocked";
}

const mockStudents: StudentRecord[] = [
  { id: "STU-1001", name: "Alex Rivera", avatar: "/Ananya.png", status: "Active" },
  { id: "STU-1002", name: "Maya Sterling", avatar: "/Sunita.png", status: "Active" },
  { id: "STU-1003", name: "Julian Chen", avatar: "/Meera.png", status: "Inactive" },
  { id: "STU-1004", name: "Sarah Jenkins", avatar: "/Grace1.png", status: "Active" },
];

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalStudents: 1248,
    totalTeachers: 56,
    activeCourses: 24,
    liveClassesToday: 18,
    totalRevenue: "₹18,75,000",
    attendanceRate: "87%"
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dynamic stats from Express Backend API
  useEffect(() => {
    async function fetchDashboardStats() {
      setIsLoading(true);
      try {
        const res = await apiRequest(ENDPOINTS.ADMIN_DASHBOARD);
        if (res.data?.overview) {
          setStats((prev) => ({
            ...prev,
            ...res.data.overview
          }));
        }
      } catch (err) {
        console.log("Dashboard Stats fallback mode active");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-500">
            Unified management console for institutional operations.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9E0C25]" />
            <span>Updating Dashboard...</span>
          </div>
        )}
      </div>

      {/* 4 Primary Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">TOTAL STUDENTS</p>
            <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">
              {stats.totalStudents.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#9E0C25] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Teachers */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">TOTAL TEACHERS</p>
            <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">
              {stats.totalTeachers}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Active Courses */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">ACTIVE COURSES</p>
            <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">
              {stats.activeCourses}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Live Classes Today */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">LIVE CLASSES TODAY</p>
            <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">
              {stats.liveClassesToday}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Revenue & Attendance Widget Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Overview (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-sans font-bold text-base text-stone-900">Revenue Overview</h3>
              <p className="text-xs text-stone-400 font-medium">Monthly revenue trends and performance</p>
            </div>
            <div className="text-right">
              <h4 className="font-sans font-extrabold text-xl text-stone-900">{stats.totalRevenue}</h4>
              <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+16.5% Growth</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 border-t border-stone-100 px-2">
            {[
              { month: "JAN", height: "45%" },
              { month: "FEB", height: "60%" },
              { month: "MAR", height: "55%" },
              { month: "APR", height: "70%" },
              { month: "MAY", height: "65%" },
              { month: "JUN", height: "90%", highlight: true }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className={`w-full rounded-t-xl transition-all ${
                    bar.highlight ? "bg-[#9E0C25]" : "bg-stone-100"
                  }`}
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] font-bold text-stone-400 uppercase">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-base text-stone-900">Attendance Summary</h3>
            <p className="text-xs text-stone-400 font-medium">Daily attendance tracking rate</p>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36 rounded-full border-8 border-stone-100 flex flex-col items-center justify-center border-t-emerald-500 border-r-emerald-500">
              <span className="font-sans font-extrabold text-2xl text-stone-900">{stats.attendanceRate}</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">PRESENT TODAY</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-stone-100">
            <div>
              <p className="text-[10px] font-bold text-stone-400">PRESENT</p>
              <h5 className="font-bold text-sm text-emerald-600">87%</h5>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400">ABSENT</p>
              <h5 className="font-bold text-sm text-rose-600">9%</h5>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400">LEAVE</p>
              <h5 className="font-bold text-sm text-amber-600">4%</h5>
            </div>
          </div>
        </div>

      </div>

      {/* Schedule & Recent Students Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Schedule (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-base text-stone-900">Today&apos;s Schedule</h3>
            <button className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">View Full Schedule</button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-stone-900">Kathak Beginner</h4>
                <p className="text-xs text-stone-500 font-medium">Basic Footwork • 07:00 PM – 08:00 PM</p>
                <span className="text-[10px] font-bold text-stone-400">28 Students</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">Upcoming</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-stone-900">Kathak Intermediate</h4>
                <p className="text-xs text-stone-500 font-medium">Chakkar Techniques • 08:15 PM – 09:15 PM</p>
                <span className="text-[10px] font-bold text-stone-400">32 Students</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Recent Students (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-base text-stone-900">Recent Students</h3>
            <button className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">View All</button>
          </div>

          <div className="space-y-3">
            {mockStudents.map((stu) => (
              <div key={stu.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stu.avatar} alt={stu.name} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                  <span className="font-bold text-xs text-stone-900">{stu.name}</span>
                </div>
                <span className={`text-[10px] font-extrabold uppercase ${stu.status === "Active" ? "text-emerald-600" : "text-stone-400"}`}>
                  {stu.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
