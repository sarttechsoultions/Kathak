"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  UserCheck,
  BookOpen,
  MonitorPlay,
  TrendingUp,
  Circle,
  Clock,
  PlusCircle,
  CalendarPlus,
  CheckSquare,
  FileText,
  User,
  UserPlus
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api"; // Aapka API helper

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================
interface DashboardData {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    activeCourses: number;
    liveClassesToday: number;
    totalRevenue: number;
    revenueGrowth: number;
  };
  revenueChart: { month: string; revenue: number }[];
  attendanceSummary: {
    presentPercent: number;
    absentPercent: number;
    leavePercent: number;
  };
  todaysSchedule: {
    id: string;
    title: string;
    subtitle: string;
    time: string;
    studentsCount: number;
    status: string;
  }[];
  recentStudents: {
    id: string;
    name: string;
    avatar: string | null;
    status: string;
  }[];
  recentActivities: {
    id: string;
    type: "STUDENT" | "ASSIGNMENT" | "PAYMENT" | "CLASS";
    title: string;
    subtitle: string;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Yahan type mein 'success: boolean' ki jagah 'status: string' kar diya
        const response = await apiRequest<{ status: string; data: DashboardData }>(ENDPOINTS.ADMIN_DASHBOARD);

        // YAHAN MAIN CHANGE HAI: response.success ki jagah response.status === "success" check kiya
        if (response.status === "success" && response.data) {
          setData(response.data);
        } else {
          console.error("Data fetch failed or empty:", response);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 flex justify-center items-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#9B3434] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-sm">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Helper for dynamic bar chart heights
  const maxRevenue = Math.max(...data.revenueChart.map(d => d.revenue), 1);
  const isLastMonth = (index: number) => index === data.revenueChart.length - 1;

  // Helper for dynamic Donut Chart SVG calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // Approx 251.2
  const presentOffset = circumference - (data.attendanceSummary.presentPercent / 100) * circumference;
  const absentOffset = circumference - (data.attendanceSummary.absentPercent / 100) * circumference;
  const absentRotation = (data.attendanceSummary.presentPercent / 100) * 360 - 90;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">

        {/* 1. Header Section */}
        <div className="w-full h-[24px] flex flex-col justify-center mb-8">
          <h1 className="text-[#0B1C30] text-[24px] font-bold leading-[24px] tracking-[0px]">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Unified management console for institutional operations.
          </p>
        </div>

        {/* 2. Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full lg:h-[114px]">

          {/* Stat 1 */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex flex-col h-[32px] justify-between">
              <span className="text-[#464555] text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px]">
                TOTAL STUDENTS
              </span>
              <span className="text-[#0B1C30] text-[20px] font-bold leading-[20px]">
                {data.overview.totalStudents.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col h-[32px] justify-between">
              <span className="text-[#464555] text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px]">
                TOTAL TEACHERS
              </span>
              <span className="text-[#0B1C30] text-[20px] font-bold leading-[20px]">
                {data.overview.totalTeachers.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex flex-col h-[32px] justify-between">
              <span className="text-[#464555] text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px]">
                ACTIVE COURSES
              </span>
              <span className="text-[#0B1C30] text-[20px] font-bold leading-[20px]">
                {data.overview.activeCourses.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <div className="flex flex-col h-[32px] justify-between">
              <span className="text-[#464555] text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px]">
                LIVE CLASSES TODAY
              </span>
              <span className="text-[#0B1C30] text-[20px] font-bold leading-[20px]">
                {data.overview.liveClassesToday.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        </div>

        {/* 3. Middle Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[576.67px_1fr] gap-6">

          {/* Revenue Chart Container */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-[24px] min-h-[300px] flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-[#0B1C30] text-[16px] font-bold">Revenue Overview</h3>
                <p className="text-[12px] text-gray-400">Monthly revenue trends and performance</p>
              </div>
              <div className="text-right">
                <span className="text-[#0B1C30] text-[24px] font-bold leading-[32px] block">
                  ₹{data.overview.totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className={`text-[12px] font-bold flex items-center justify-end gap-1 ${data.overview.revenueGrowth >= 0 ? "text-[#00A67E]" : "text-[#D92D20]"}`}>
                  <TrendingUp className={`w-3 h-3 ${data.overview.revenueGrowth < 0 && "rotate-180"}`} />
                  {Math.abs(data.overview.revenueGrowth)}% {data.overview.revenueGrowth >= 0 ? "Growth" : "Decline"}
                </span>
              </div>
            </div>

            {/* Dynamic Bar Chart */}
            <div className="flex-1 flex items-end justify-between gap-4 mt-auto">
              {data.revenueChart.map((item, i) => {
                const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={i} className="w-full flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex items-end justify-center h-[120px]">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-700 ease-out ${isLastMonth(i) ? "bg-[#9B3434] shadow-sm" : "bg-[#E8D4D4] group-hover:bg-[#d8bcbc]"}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-1 rounded font-bold transition-opacity whitespace-nowrap z-10">
                        ₹{(item.revenue / 1000).toFixed(1)}k
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${isLastMonth(i) ? "text-[#9B3434]" : "text-gray-400"}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attendance Donut Chart Container */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-[24px] min-h-[300px] flex flex-col items-center justify-between">
            <h3 className="text-[#0B1C30] text-[16px] font-bold w-full text-left">Attendance Summary</h3>

            {/* Dynamic SVG Donut Chart */}
            <div className="relative w-36 h-36 mt-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background (Leave) */}
                <circle cx="50" cy="50" r={radius} stroke="#F2F4F7" strokeWidth="12" fill="none" />
                {/* Absent Segment */}
                <circle
                  cx="50" cy="50" r={radius}
                  stroke="#D92D20" strokeWidth="12" fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={absentOffset}
                  style={{ transformOrigin: 'center', transform: `rotate(${absentRotation}deg)` }}
                  className="transition-all duration-1000 ease-out"
                />
                {/* Present Segment */}
                <circle
                  cx="50" cy="50" r={radius}
                  stroke="#00A67E" strokeWidth="12" fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={presentOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[24px] font-bold text-[#0B1C30]">{data.attendanceSummary.presentPercent}%</span>
                <span className="text-[8px] font-bold text-[#00A67E] uppercase tracking-wide">Present Today</span>
              </div>
            </div>

            <div className="flex items-center justify-between w-full mt-6 px-4">
              <div className="text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Present</div>
                <div className="text-[14px] text-[#00A67E] font-bold">{data.attendanceSummary.presentPercent}%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Absent</div>
                <div className="text-[14px] text-[#D92D20] font-bold">{data.attendanceSummary.absentPercent}%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Leave</div>
                <div className="text-[14px] text-gray-600 font-bold">{data.attendanceSummary.leavePercent}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Dynamic Today's Schedule Card */}
            <div className="w-full xl:w-[378px] bg-white/90 backdrop-blur-[8px] rounded-[24px] border border-white/30 p-[24px] shadow-[0_0_4px_0_rgba(0,0,0,0.25)] flex flex-col">
              <h3 className="text-[#0B1C30] text-[16px] font-bold mb-6">Today&apos;s Schedule</h3>

              <div className="relative space-y-6 flex-1 before:absolute before:inset-0 before:ml-[7px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-gray-200 before:to-transparent">

                {data.todaysSchedule.length > 0 ? (
                  data.todaysSchedule.map((cls, idx) => (
                    <div key={cls.id || idx} className="relative flex gap-4">
                      <Circle className="w-4 h-4 text-[#9B3434] bg-white z-10 shrink-0 mt-1" strokeWidth={4} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[14px] font-bold text-[#0B1C30]">{cls.title}</h4>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${cls.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-red-50 text-[#9B3434]'}`}>
                            {cls.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">{cls.subtitle}</p>
                        <p className="text-[11px] text-gray-500 font-medium mt-2">{cls.time}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1"><Users className="w-3 h-3" /> {cls.studentsCount} Students</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] text-gray-400 italic py-4">No live classes scheduled for today.</p>
                )}
              </div>

              <button className="w-full py-3 mt-6 border border-[#9B3434]/20 rounded-xl text-[#9B3434] text-[12px] font-bold transition-colors hover:bg-red-50">
                View Full Schedule
              </button>
            </div>

            {/* Quick Actions (With Navigation) */}
            <div>
              <h3 className="text-[#0B1C30] text-[16px] font-bold flex items-center gap-2 mb-4">
                <span className="text-[#9B3434]">⚡</span> Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                {/* 1. Add Student (Aapke naye enrollment page par bhejega) */}
                <Link href="/admin/dashboard" className="bg-white border border-gray-100 p-4 rounded-[16px] shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-[#9B3434] flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
                  <span className="text-[11px] font-bold text-[#0B1C30]">Add Student</span>
                </Link>

                {/* 2. Add Teacher */}
                <Link href="/admin/teachers" className="bg-white border border-gray-100 p-4 rounded-[16px] shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><UserCheck className="w-5 h-5" /></div>
                  <span className="text-[11px] font-bold text-[#0B1C30]">Add Teacher</span>
                </Link>

                {/* 3. Create Course */}
                <Link href="/admin/courses" className="bg-white border border-gray-100 p-4 rounded-[16px] shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><PlusCircle className="w-5 h-5" /></div>
                  <span className="text-[11px] font-bold text-[#0B1C30]">Create Course</span>
                </Link>

                {/* 4. Schedule Class */}
                <Link href="/admin/class-management" className="bg-white border border-gray-100 p-4 rounded-[16px] shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><CalendarPlus className="w-5 h-5" /></div>
                  <span className="text-[11px] font-bold text-[#0B1C30]">Schedule Class</span>
                </Link>

                {/* 5. Mark Attendance */}
                <Link href="/admin/attendance" className="bg-white border border-gray-100 p-4 rounded-[16px] shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckSquare className="w-5 h-5" /></div>
                  <span className="text-[11px] font-bold text-[#0B1C30]">Mark Attendance</span>
                </Link>

                {/* 6. Generate Report */}
                <Link href="/admin/analytics" className="bg-white border border-gray-100 p-4 rounded-[16px] shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                  <span className="text-[11px] font-bold text-[#0B1C30]">Generate Report</span>
                </Link>

              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Dynamic Recent Students Card */}
            <div className="bg-white/90 backdrop-blur-[8px] rounded-[24px] border border-white/30 p-[24px] shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[#0B1C30] text-[16px] font-bold">Recent Students</h3>
                <Link href="/admin/students" className="text-[11px] font-bold text-[#9B3434] hover:underline">View All</Link>
              </div>

              <div className="space-y-4">
                {data.recentStudents.map((student, idx) => {
                  const sStatus = student.status.toUpperCase();
                  const statusColors = {
                    PRESENT: "text-[#00A67E] bg-green-50",
                    ABSENT: "text-[#D92D20] bg-red-50",
                    LATE: "text-amber-500 bg-amber-50",
                    LEAVE: "text-gray-500 bg-gray-100"
                  };
                  const colorClass = statusColors[sStatus as keyof typeof statusColors] || statusColors.PRESENT;

                  return (
                    <div key={student.id || idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">

                        {/* 100% Dynamic & No Dummy Data Approach */}
                        {student.avatar ? (
                          <Image
                            src={student.avatar}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200"
                            alt={student.name}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-stone-400" />
                          </div>
                        )}

                        <span className="text-[13px] font-bold text-[#0B1C30]">{student.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${colorClass}`}>
                        {sStatus.toLowerCase()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dynamic Recent Activities */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#0B1C30] text-[16px] font-bold">Recent Activities</h3>
                <Link href="/admin/activities" className="text-[10px] font-bold text-[#9B3434] uppercase tracking-wider hover:underline">Clear Logs</Link>
              </div>

              <div className="space-y-4">
                {data.recentActivities.length > 0 ? data.recentActivities.map((activity, idx) => {

                  // Icon mapping based on activity type
                  let Icon = UserPlus;
                  let colorClass = "bg-rose-50 text-[#9B3434]";

                  if (activity.type === "ASSIGNMENT") { Icon = FileText; colorClass = "bg-orange-50 text-orange-600"; }
                  if (activity.type === "PAYMENT") { Icon = CheckSquare; colorClass = "bg-emerald-50 text-emerald-600"; }
                  if (activity.type === "CLASS") { Icon = MonitorPlay; colorClass = "bg-red-50 text-red-600"; }

                  return (
                    <div key={activity.id || idx} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#0B1C30]">{activity.title}</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">{activity.subtitle}</p>
                      </div>
                    </div>
                  )
                }) : (
                  <p className="text-[13px] text-gray-400 italic">No recent activities logged.</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}