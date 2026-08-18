"use client";

import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Clock, Loader2, Play, CheckCircle2, Video, Users } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

type LiveClass = {
  id: string;
  title: string;
  teacherName: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  batchName: string;
  courseName: string;
};

type TeacherStats = {
  completedCount: number;
  upcomingCount: number;
  overallAttendance: string | null;
};

const format = (value: string) =>
  new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default function TeacherLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);

  // ✅ Teacher ke paas manually class start karne ka permission hai ya nahi
  const user = typeof window !== "undefined" ? getSessionUser("admin") : null;
  const canStartClass = user?.permissions?.includes("START_LIVE_CLASS") ?? false;

  const fetchClasses = useCallback(() => {
    apiRequest<{ status: string; data: { classes: LiveClass[]; stats: TeacherStats } }>(ENDPOINTS.LIVE_CLASS_TEACHER)
      .then((response) => {
        setClasses(response.data.classes ?? []);
        setStats(response.data.stats ?? null);
      })
      .catch(() => {
        setClasses([]);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // ✅ Real-time updates — jaise hi koi class ki status change ho (LIVE/COMPLETED),
  // list bina refresh kiye update ho jaye
  useEffect(() => {
    const socketInstance: Socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });

    socketInstance.on("liveclass:class-updated", (updated: LiveClass) => {
      setClasses((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const isJoinable = (item: LiveClass) => {
    const now = new Date();
    const end = new Date(item.scheduledEnd);
    return (item.status === "LIVE" || item.status === "SCHEDULED") && now <= end;
  };

  const handleStartClass = async (id: string) => {
    setStartingId(id);
    try {
      const res = await apiRequest<{ status: string; data: LiveClass }>(`/admin/classes/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "LIVE" }),
      });
      setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...res.data } : c)));
    } catch (err) {
      console.error("Failed to start class:", err);
      alert("Could not start the class. Please try again.");
    } finally {
      setStartingId(null);
    }
  };

  const upcoming = classes.filter((c) => c.status === "SCHEDULED" && isJoinable(c));
  const live = classes.filter((c) => c.status === "LIVE" && isJoinable(c));
  const completed = classes.filter((c) => c.status === "COMPLETED");

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">My Live Classes</h1>
        <p className="text-sm text-stone-500 mt-1">Manage and join your scheduled Kathak sessions.</p>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Completed</p>
              <p className="text-xl font-bold text-stone-900">{stats.completedCount}</p>
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Upcoming</p>
              <p className="text-xl font-bold text-stone-900">{stats.upcomingCount}</p>
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-rose-50 text-[#900C27] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Attendance Rate</p>
              <p className="text-xl font-bold text-stone-900">{stats.overallAttendance ?? "—"}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="inline animate-spin" /> Loading your classes…
        </div>
      ) : (
        <>
          {/* Live Now */}
          {live.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Live Now</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {live.map((item) => (
                  <ClassCard key={item.id} item={item} canStartClass={canStartClass} startingId={startingId} onStart={handleStartClass} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900">Upcoming Sessions</h2>
            {upcoming.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5">
                {upcoming.map((item) => (
                  <ClassCard key={item.id} item={item} canStartClass={canStartClass} startingId={startingId} onStart={handleStartClass} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400 italic">No upcoming sessions scheduled.</p>
            )}
          </div>

          {/* History */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-900">Class History</h2>
            {completed.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5">
                {completed
                  .slice()
                  .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())
                  .map((item) => (
                    <div key={item.id} className="bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                        <Video className="w-5 h-5 text-stone-300" />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900">{item.title}</h3>
                        <p className="text-sm text-stone-500">{item.batchName} · {item.courseName}</p>
                      </div>
                      <p className="text-sm text-stone-600 flex gap-2">
                        <Calendar className="w-4 h-4" /> {format(item.scheduledStart)}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400 italic">No completed classes yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ClassCard({
  item,
  canStartClass,
  startingId,
  onStart,
}: {
  item: LiveClass;
  canStartClass: boolean;
  startingId: string | null;
  onStart: (id: string) => void;
}) {
  const isLive = item.status === "LIVE";
  const isStarting = startingId === item.id;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-5">
      <div className="flex justify-between">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            isLive ? "bg-rose-100 text-rose-700 animate-pulse" : "bg-sky-100 text-sky-700"
          }`}
        >
          {isLive ? "LIVE NOW 🔴" : "UPCOMING"}
        </span>
        <Video className="w-5 h-5 text-[#900C27]" />
      </div>
      <div>
        <h2 className="font-bold text-lg text-stone-900">{item.title}</h2>
        <p className="text-sm text-stone-500">
          {item.batchName} · {item.courseName}
        </p>
      </div>
      <div className="text-sm text-stone-600 space-y-1">
        <p className="flex gap-2">
          <Calendar className="w-4 h-4" /> {format(item.scheduledStart)}
        </p>
        <p className="flex gap-2">
          <Clock className="w-4 h-4" /> Ends: {format(item.scheduledEnd)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* ✅ Sirf tab dikhega jab teacher ke paas START_LIVE_CLASS permission ho aur class abhi SCHEDULED ho */}
        {canStartClass && item.status === "SCHEDULED" && (
          <button
            onClick={() => onStart(item.id)}
            disabled={isStarting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 disabled:opacity-50 text-white font-bold text-sm transition-all"
          >
            {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            {isStarting ? "Starting…" : "Start Class"}
          </button>
        )}

        <Link
          href={`/admin/class-management/room/${item.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#900C27] hover:bg-[#780A20] text-white font-bold text-sm shadow-md transition-all"
        >
          <Play className="w-4 h-4 fill-white" /> Enter Room
        </Link>
      </div>
    </div>
  );
}