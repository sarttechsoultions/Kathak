"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2, Calendar, UserCheck, Settings, Wifi, Video, Mic,
  ChevronLeft, ChevronRight, Play, Clock, Plus, Loader2, Users
} from "lucide-react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { apiRequest } from "@/lib/api";

interface BatchInfo {
  name: string;
  code: string;
  courseName: string;
}

interface LiveClass {
  id: string;
  batchId: string;
  title: string;
  teacherName: string;
  scheduledStart: string;
  scheduledEnd: string;
  roomName: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  batch: BatchInfo;
}

interface StudentStats {
  completedCount: number;
  upcomingCount: number;
  overallAttendance: string | null;
}

export default function StudentLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    try {
      const res = await apiRequest<{ status: string; data: { classes: LiveClass[], stats: StudentStats } }>("/student/classes");
      if (res.status === "success" && res.data) {
        setClasses(res.data.classes);
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch live classes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchClasses();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchClasses]);

  useEffect(() => {
    const socketInstance: Socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });

    socketInstance.on("liveclass:class-updated", (updatedClass: LiveClass) => {
      setClasses((prev) =>
        prev.map((c) => (c.id === updatedClass.id ? { ...c, ...updatedClass } : c))
      );
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);


  const [, forceTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => forceTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Class abhi join karne layak hai ya nahi
  const isClassJoinable = (cls: LiveClass) => {
    const now = new Date();
    const end = new Date(cls.scheduledEnd);
    return (cls.status === "LIVE" || cls.status === "SCHEDULED") && now <= end;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-6 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#9B3434] animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Loading Your Classes...</p>
        </div>
      </div>
    );
  }

  // Categories
  const completedClasses = classes.filter(c => c.status === "COMPLETED");
  const upcomingClasses = classes.filter(c => c.status === "SCHEDULED" && isClassJoinable(c));
  const liveClasses = classes.filter(c => c.status === "LIVE" && isClassJoinable(c));

  // Hero Card Class
  const heroClass = liveClasses.length > 0 ? liveClasses[0] : upcomingClasses[0];

  // Helper for Date formatting
  const formatMonth = (dateString: string) => new Date(dateString).toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const formatDay = (dateString: string) => new Date(dateString).toLocaleString('en-US', { day: '2-digit' });
  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-8 font-sans flex justify-center">
      <div className="w-full max-w-[1200px] mx-auto animate-in fade-in duration-300">

        {/* 1. Header Section */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-4 mb-8 gap-4">
          <div>
            <h1 className="text-[#0B1C30] text-[32px] font-bold leading-[38.4px] tracking-[-0.32px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              My Live Classes
            </h1>
            <p className="text-[#464555] text-[16px] leading-[25.6px] mt-1">
              Stay synchronized with your Guru. Join live sessions to perfect your Mudras and Taal.
            </p>
          </div>
        </div>

        {/* 2. Top Stats Row */}
        <div className="w-full border-b border-stone-200 pb-8 mb-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#464555] text-[14px] font-medium leading-[20px]">Completed<br />Classes</span>
              <span className="text-[#0B1C30] text-[24px] font-bold leading-[31.2px]">{stats?.completedCount || completedClasses.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#464555] text-[14px] font-medium leading-[20px]">Upcoming<br />Classes</span>
              <span className="flex items-baseline gap-2">
                <span className="text-[#0B1C30] text-[24px] font-bold leading-[31.2px]">{stats?.upcomingCount || upcomingClasses.length}</span>
                <span className="text-stone-400 text-[10px] font-semibold uppercase">Total</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Video className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#464555] text-[14px] font-medium leading-[20px]">Currently<br />Live</span>
              <span className="text-[#0B1C30] text-[24px] font-bold leading-[31.2px]">{liveClasses.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#464555] text-[14px] font-medium leading-[20px]">Attendance<br />Rate</span>
              <span className="text-[#0B1C30] text-[24px] font-bold leading-[31.2px]">{stats?.overallAttendance ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">

          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Hero Live Class Card */}
            {heroClass ? (
              <div className="relative w-full rounded-[24px] overflow-hidden bg-stone-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-70"
                  style={{ backgroundImage: "url('/images/kathak-hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

                <div className="relative z-10 p-8 flex flex-col justify-end h-full min-h-[340px]">
                  <div className="flex items-center gap-3 mb-4">
                    {heroClass.status === "LIVE" ? (
                      <span className="bg-[#DC2626] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE NOW
                      </span>
                    ) : (
                      <span className="bg-sky-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        UPCOMING
                      </span>
                    )}
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1.5 rounded-full border border-white/10">
                      {heroClass.batch.name}
                    </span>
                  </div>

                  <h2 className="text-[32px] md:text-[40px] font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {heroClass.title}
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-stone-700 flex items-center justify-center text-white font-bold text-xs">
                          {heroClass.teacherName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-[14px] font-bold">{heroClass.teacherName}</span>
                          <span className="text-stone-300 text-[11px] font-medium">Instructor</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="w-4 h-4 text-stone-300" />
                        <span className="text-[14px] font-medium">
                          {formatMonth(heroClass.scheduledStart)} {formatDay(heroClass.scheduledStart)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-white">
                        <Clock className="w-4 h-4 text-stone-300" />
                        <span className="text-[14px] font-medium">{formatTime(heroClass.scheduledStart)}</span>
                      </div>
                    </div>

                    <Link href={`/student/classes/room/${heroClass.id}`} className="bg-white hover:bg-stone-100 text-[#9B3434] px-6 py-3.5 rounded-xl font-bold text-[14px] transition-colors shadow-lg flex items-center justify-center gap-2">
                      <Play className="w-4 h-4 fill-current" /> Join Class
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full bg-white rounded-[24px] border border-stone-200 shadow-sm min-h-[340px] flex flex-col items-center justify-center text-stone-400">
                <Video className="w-12 h-12 mb-3 opacity-20" />
                <p>No active or upcoming classes at the moment.</p>
              </div>
            )}

            {/* Upcoming Sessions List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#0B1C30] text-[20px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upcoming Sessions</h3>
              </div>

              <div className="space-y-4">
                {upcomingClasses.length > 0 ? upcomingClasses.map((session) => (
                  <div key={session.id} className="bg-white border border-stone-100 rounded-[20px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-[60px] h-[60px] rounded-[16px] bg-sky-50 border border-sky-100 flex flex-col items-center justify-center text-sky-700 shrink-0">
                        <span className="text-[11px] font-bold uppercase">{formatMonth(session.scheduledStart)}</span>
                        <span className="text-[20px] font-bold leading-none mt-0.5">{formatDay(session.scheduledStart)}</span>
                      </div>
                      <div>
                        <h4 className="text-[#0B1C30] text-[15px] font-bold leading-tight mb-1">{session.title}</h4>
                        <p className="text-[#464555] text-[12px] flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5" /> {session.teacherName} • {formatTime(session.scheduledStart)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/student/classes/room/${session.id}`} className="px-5 py-2.5 rounded-xl bg-[#9B3434] text-white hover:bg-[#7a2828] text-[13px] font-bold transition-colors">
                        Enter Room
                      </Link>
                    </div>
                  </div>
                )) : (
                  <p className="text-[13px] text-stone-400 italic">No future sessions scheduled.</p>
                )}
              </div>
            </div>

            {/* Class History (Completed Sessions) */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#0B1C30] text-[20px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Class History</h3>
                <span className="text-stone-400 text-[12px] font-semibold">{completedClasses.length} completed</span>
              </div>

              <div className="space-y-4">
                {completedClasses.length > 0 ? completedClasses
                  .slice()
                  .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())
                  .map((session) => (
                    <div key={session.id} className="bg-white border border-stone-100 shadow-sm rounded-[20px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-[60px] h-[60px] rounded-[16px] bg-stone-50 border border-stone-200 flex flex-col items-center justify-center text-stone-500 shrink-0">
                          <span className="text-[11px] font-bold uppercase">{formatMonth(session.scheduledStart)}</span>
                          <span className="text-[20px] font-bold leading-none mt-0.5">{formatDay(session.scheduledStart)}</span>
                        </div>
                        <div>
                          <h4 className="text-[#0B1C30] text-[15px] font-bold leading-tight mb-1">{session.title}</h4>
                          <p className="text-[#464555] text-[12px] flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5" /> {session.teacherName} • {formatTime(session.scheduledStart)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[12px] font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      </div>
                    </div>
                  )) : (
                  <p className="text-[13px] text-stone-400 italic">No completed classes yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Diagnostics Card (Static Helper) */}
            <div className="bg-white rounded-[24px] border border-stone-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6">
              <h3 className="text-[#0B1C30] text-[16px] font-bold flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-[#9B3434]" /> Ready for Class?
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-3 text-[13px] font-semibold text-[#0B1C30]">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Wifi className="w-4 h-4" /></div>
                    Internet Connection
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></div>
                </div>
              </div>
              <button className="w-full py-3 rounded-xl border-2 border-dashed border-stone-200 text-[#464555] text-[13px] font-bold hover:bg-stone-50 transition-colors">
                Run Diagnostics
              </button>
            </div>

            {/* Quick Helper Quote */}
            <div className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] rounded-[24px] p-6 text-white shadow-lg shadow-sky-900/20 relative overflow-hidden">
              <h4 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Student Tip
              </h4>
              <p className="text-[13px] font-medium leading-relaxed text-sky-50 italic">
                &quot;Join your classes 5 minutes early to test your camera and microphone. Consistent attendance improves your Kathak skills!&quot;
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}