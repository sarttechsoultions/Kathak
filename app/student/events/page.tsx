"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  Grid,
  List,
  X,
  Loader2,
  IndianRupee,
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess, openThemeError } from "@/components/ThemeDialogProvider";

interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  badgeTag: string;
  fillingFast: boolean;
  bannerImage: string | null;
  targetDateTime: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  category: string;
  thumbnailImage: string | null;
  priceLabel: string;
  isFree: boolean;
  startDate: string;
  startTime: string;
  locationOrLink: string;
  instructorName: string | null;
  instructorAvatar: string | null;
  isRegistered: boolean;
  fillingFast: boolean;
}

interface MyRegistration {
  id: string;
  eventId: string;
  title: string;
  category: string;
  startDate: string;
  startTime: string;
  badge: string;
}

interface CalendarData {
  month: number;
  year: number;
  eventDates: number[];
  nextReminder: { title: string; date: string; time: string } | null;
}

interface EventDetails {
  id: string;
  title: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  durationMins: number;
  level: string;
  locationOrLink: string;
  priceLabel: string;
  registrationFee: number;
  capacity: number;
  seatsLeft: number;
  isRegistered: boolean;
  leadInstructor?: { fullName: string; avatarUrl: string | null };
}

interface CompetitionTrackItem {
  id: string;
  title: string;
  description: string;
  timeLabel: string | null;
}

interface Countdown {
  days: number;
  hours: number;
  mins: number;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CATEGORY_EMOJI: Record<string, string> = {
  Workshop: "🎭",
  Competition: "🏆",
  Seminar: "📚",
};

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  return `${h % 12 || 12}:${minutes} ${h >= 12 ? "PM" : "AM"}`;
}

function getCountdown(targetIso: string): Countdown {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
  };
}

function badgeClasses(badge: string) {
  switch (badge) {
    case "Confirmed":
      return "bg-[#E6F7ED] text-[#22A05B]";
    case "Completed":
      return "bg-stone-100 text-stone-600";
    case "Cancelled":
      return "bg-[#FEE2E2] text-[#DC2626]";
    default:
      return "bg-[#FEF3C7] text-[#D97706]";
  }
}

function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const cells: { day: number; current: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - daysInMonth - firstDay + 2, current: false });
  }
  return cells;
}

export default function StudentEventsWorkshopsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [featured, setFeatured] = useState<FeaturedEvent | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingEvent[]>([]);
  const [registrations, setRegistrations] = useState<MyRegistration[]>([]);
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [competitionItems, setCompetitionItems] = useState<CompetitionTrackItem[]>([]);

  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, mins: 0 });

  const [detailsEvent, setDetailsEvent] = useState<EventDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<{ eventId: string; priceLabel: string; title: string } | null>(null);

  const loadPageData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [featuredRes, upcomingRes, regsRes, calRes, compRes] = await Promise.all([
        apiRequest<{ success: boolean; data: FeaturedEvent | null }>(`${ENDPOINTS.STUDENT_EVENTS}/featured`),
        apiRequest<{ success: boolean; data: UpcomingEvent[] }>(`${ENDPOINTS.STUDENT_EVENTS}/upcoming`),
        apiRequest<{ success: boolean; data: MyRegistration[] }>(`${ENDPOINTS.STUDENT_EVENTS}/my-registrations?limit=5`),
        apiRequest<{ success: boolean; data: CalendarData }>(
          `${ENDPOINTS.STUDENT_EVENTS}/calendar?month=${calMonth}&year=${calYear}`
        ),
        apiRequest<{ success: boolean; data: { items: CompetitionTrackItem[] } }>(ENDPOINTS.STUDENT_COMPETITION_TRACK),
      ]);

      if (featuredRes.success) setFeatured(featuredRes.data);
      if (upcomingRes.success) setUpcoming(upcomingRes.data || []);
      if (regsRes.success) setRegistrations(regsRes.data || []);
      if (calRes.success) setCalendar(calRes.data);
      if (compRes.success) setCompetitionItems(compRes.data?.items || []);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [calMonth, calYear]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!active) return;
      await loadPageData();
    };

    void run();

    return () => {
      active = false;
    };
  }, [loadPageData]);

  useEffect(() => {
    if (!featured?.targetDateTime) return;

    const syncCountdown = () => {
      setCountdown(getCountdown(featured.targetDateTime));
    };

    const timer = setInterval(syncCountdown, 60_000);
    const initialTimer = setTimeout(syncCountdown, 0);

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, [featured?.targetDateTime]);

  const shiftCalendar = async (delta: number) => {
    let m = calMonth + delta;
    let y = calYear;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setCalMonth(m);
    setCalYear(y);
  };

  const openDetails = async (eventId: string) => {
    setDetailsLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: EventDetails }>(
        `${ENDPOINTS.STUDENT_EVENTS}/${eventId}`
      );
      if (res.success) setDetailsEvent(res.data);
    } catch (error) {
      openThemeError((error as Error).message || "Failed to load event details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRegister = async (eventId: string, isFree: boolean, priceLabel: string = "Free", title: string = "Event") => {
    if (!isFree) {
      setPaymentModalData({ eventId, priceLabel, title });
      return;
    }
    
    setActionLoading(eventId);
    try {
      await apiRequest(`${ENDPOINTS.STUDENT_EVENTS}/${eventId}/register`, { method: "POST" });
      await openThemeSuccess("You're registered!", "See you at the event.");
      await loadPageData();
      if (detailsEvent?.id === eventId) await openDetails(eventId);
    } catch (error) {
      openThemeError((error as Error).message || "Registration failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const processPaymentAndRegister = async () => {
    if (!paymentModalData) return;
    const { eventId, title, priceLabel } = paymentModalData;
    setActionLoading(eventId);
    try {
      // Simulate payment delay
      await new Promise((res) => setTimeout(res, 1500));
      await apiRequest(`${ENDPOINTS.STUDENT_EVENTS}/${eventId}/register`, { method: "POST" });
      
      await openThemeSuccess(`Payment of ${priceLabel} Successful!`, `You are now registered for ${title}.`);
      setPaymentModalData(null);
      await loadPageData();
      if (detailsEvent?.id === eventId) await openDetails(eventId);
    } catch (error) {
      openThemeError((error as Error).message || "Registration failed after payment.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (eventId: string) => {
    setActionLoading(eventId);
    try {
      await apiRequest(`${ENDPOINTS.STUDENT_EVENTS}/${eventId}/register`, { method: "DELETE" });
      await openThemeSuccess("Registration cancelled.");
      await loadPageData();
      setDetailsEvent(null);
    } catch (error) {
      openThemeError((error as Error).message || "Failed to cancel registration.");
    } finally {
      setActionLoading(null);
    }
  };

  const calendarCells = buildCalendarCells(calYear, calMonth);
  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() + 1 === calMonth && today.getFullYear() === calYear;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-stone-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-16">

      {/* Featured Hero Banner */}
      {featured ? (
        <div className="bg-stone-900 rounded-[24px] overflow-hidden relative shadow-xl p-6 sm:p-8 border border-stone-800 text-white min-h-[260px] flex flex-col justify-between">
          <div className="absolute inset-0 z-0 bg-[#0f0c0c] overflow-hidden">
            {/* Blurred background filling the banner */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.bannerImage || "/gurukul-dancer.jpg"}
              alt="bg"
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-3xl scale-110"
              onError={(e) => { (e.target as HTMLImageElement).src = "/classesbg.png"; }}
            />
            
            {/* Actual image, uncropped, right-aligned */}
            <div className="absolute inset-0 flex justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.bannerImage || "/gurukul-dancer.jpg"}
                alt={featured.title}
                className="h-full w-full md:w-3/4 lg:w-2/3 object-contain opacity-90"
                style={{ objectPosition: 'right center' }}
                onError={(e) => { (e.target as HTMLImageElement).src = "/classesbg.png"; }}
              />
            </div>

            {/* Gradient overlay to make text pop */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0c0c] via-[#0f0c0c]/80 to-transparent" />
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <span className="bg-[#900C27] text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              {featured.badgeTag || "FEATURED"}
            </span>
            {featured.fillingFast && (
              <span className="bg-rose-950/80 backdrop-blur-md border border-rose-400/30 text-rose-200 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>Filling Fast</span>
              </span>
            )}
          </div>

          <div className="relative z-10 space-y-3 pt-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight max-w-xl">
              {featured.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 font-normal max-w-lg leading-relaxed line-clamp-2">
              {featured.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-center">
                {(["days", "hours", "mins"] as const).map((unit, i) => (
                  <div key={unit} className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl">
                    <span className="text-base font-extrabold text-white block leading-none">
                      {String([countdown.days, countdown.hours, countdown.mins][i]).padStart(2, "0")}
                    </span>
                    <span className="text-[8px] font-bold text-stone-300 uppercase block tracking-wider pt-0.5">
                      {unit.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openDetails(featured.id)}
                disabled={actionLoading === featured.id}
                className="bg-[#900C27] hover:bg-[#780A20] text-white px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {actionLoading === featured.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-stone-100 rounded-[24px] p-8 text-center border border-stone-200">
          <p className="text-stone-500 text-sm font-medium">No featured events right now. Check upcoming workshops below.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">

          {/* Upcoming Workshops */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1B1B24]">Upcoming Workshops</h2>
                <p className="text-xs text-stone-400 font-medium">Curated sessions for every skill level</p>
              </div>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white text-[#900C27] shadow-xs" : "text-stone-400"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white text-[#900C27] shadow-xs" : "text-stone-400"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {upcoming.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-400 text-sm">
                No upcoming events scheduled yet.
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-4"}>
                {upcoming.map((event) => (
                  <div
                    key={event.id}
                    className={`bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden flex ${
                      viewMode === "list" ? "flex-row" : "flex-col"
                    } justify-between hover:shadow-md transition-shadow group`}
                  >
                    <div className={`${viewMode === "list" ? "w-36 shrink-0" : "h-36"} bg-stone-900 relative overflow-hidden`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.thumbnailImage || "/classesbg.png"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/classesbg.png"; }}
                      />
                      <span className="absolute top-2.5 left-2.5 bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        {event.category}
                      </span>
                      <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs ${
                        event.isFree ? "bg-emerald-100 text-emerald-800" : "bg-white/90 backdrop-blur-md text-[#1B1B24]"
                      }`}>
                        {event.priceLabel}
                      </span>
                      {event.fillingFast && (
                        <span className="absolute bottom-2 left-2 bg-rose-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5" /> Filling Fast
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-[#1B1B24] group-hover:text-[#900C27] transition-colors leading-snug">
                          {event.title}
                        </h3>
                        {event.instructorName && (
                          <div className="flex items-center gap-2 text-[11px] text-stone-500">
                            {event.instructorAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={event.instructorAvatar} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-stone-300 shrink-0" />
                            )}
                            <span>by {event.instructorName}</span>
                          </div>
                        )}
                        <div className="space-y-1 text-[11px] text-stone-500 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>{formatShortDate(event.startDate)}</span>
                            <Clock className="w-3.5 h-3.5 text-stone-400 ml-2" />
                            <span>{formatTime(event.startTime)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span className="truncate">{event.locationOrLink}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                        <button
                          onClick={() => openDetails(event.id)}
                          className="flex-1 border border-stone-200 hover:border-stone-300 text-stone-700 py-1.5 rounded-xl text-xs font-semibold"
                        >
                          Details
                        </button>
                        {event.isRegistered ? (
                          <button
                            onClick={() => handleCancel(event.id)}
                            disabled={actionLoading === event.id}
                            className="flex-1 border border-stone-300 text-stone-600 py-1.5 rounded-xl text-xs font-bold"
                          >
                            {actionLoading === event.id ? "..." : "Cancel"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegister(event.id, event.isFree, event.priceLabel, event.title)}
                            disabled={actionLoading === event.id}
                            className="flex-1 bg-[#900C27] hover:bg-[#780A20] text-white py-1.5 rounded-xl text-xs font-bold shadow-2xs"
                          >
                            {actionLoading === event.id ? "..." : event.isFree ? "Join Free" : "Register"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Registrations */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-[#1B1B24]">My Registrations</h3>
            </div>

            {registrations.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">You haven&apos;t registered for any events yet.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {registrations.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#900C27] flex items-center justify-center shrink-0 font-bold">
                        {CATEGORY_EMOJI[reg.category] || "🎭"}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1B1B24]">{reg.title}</h4>
                        <span className="text-[10px] text-stone-400">
                          {formatEventDate(reg.startDate)} • {formatTime(reg.startTime)}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${badgeClasses(reg.badge)}`}>
                      {reg.badge}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">

          {/* Calendar Widget */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider">
                {MONTH_NAMES[calMonth - 1]} {calYear}
              </h4>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <button onClick={() => shiftCalendar(-1)} className="hover:text-black p-1">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => shiftCalendar(1)} className="hover:text-black p-1">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-400 uppercase">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              {calendarCells.map((cell, idx) => {
                const hasEvent = cell.current && calendar?.eventDates.includes(cell.day);
                const todayCell = cell.current && isToday(cell.day);
                return (
                  <span
                    key={idx}
                    className={`py-1 ${!cell.current ? "text-stone-300" : ""} ${
                      todayCell
                        ? "w-7 h-7 mx-auto rounded-full bg-[#900C27] text-white flex items-center justify-center font-bold"
                        : hasEvent
                          ? "w-7 h-7 mx-auto rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center"
                          : ""
                    }`}
                  >
                    {cell.day}
                  </span>
                );
              })}
            </div>

            {calendar?.nextReminder && (
              <div className="pt-2 border-t border-stone-100 text-[10px] font-semibold text-stone-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#900C27]" />
                  {formatShortDate(calendar.nextReminder.date)} - {calendar.nextReminder.title}
                </span>
                <span className="text-stone-400">{formatTime(calendar.nextReminder.time)}</span>
              </div>
            )}
          </div>

          {/* Competition Track */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#1B1B24]">Competition Track</h3>

            {competitionItems.length === 0 ? (
              <p className="text-[11px] text-stone-400">No active competition updates for you right now.</p>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-200">
                {competitionItems.map((item, idx) => (
                  <div key={item.id} className="relative space-y-1">
                    <div className={`w-2.5 h-2.5 rounded-full bg-[#900C27] absolute -left-[21px] top-1 ${idx === 0 ? "ring-4 ring-rose-100" : ""}`} />
                    <h4 className="text-xs font-bold text-[#1B1B24]">{item.title}</h4>
                    <p className="text-[11px] text-stone-500 leading-snug">{item.description}</p>
                    {item.timeLabel && (
                      <span className="text-[10px] text-stone-400 font-medium block">{item.timeLabel}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Promo Banner */}
          <div className="bg-gradient-to-br from-[#800020] via-[#8B1D2C] to-[#600018] rounded-2xl p-6 text-white space-y-3 shadow-md relative overflow-hidden">
            <span className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-rose-100">
              EARLY BIRD SPECIAL
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">Masterclass Series Pass</h3>
            <p className="text-xs text-rose-100 font-normal leading-relaxed">
              Get 25% off when you book 3 or more workshops this month.
            </p>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {(detailsEvent || detailsLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {detailsLoading ? (
              <div className="flex items-center justify-center p-12 gap-2 text-stone-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : detailsEvent && (
              <>
                <div className="flex items-start justify-between p-6 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] font-bold text-[#900C27] uppercase">{detailsEvent.category}</span>
                    <h2 className="text-lg font-bold text-[#1B1B24] mt-1">{detailsEvent.title}</h2>
                  </div>
                  <button onClick={() => setDetailsEvent(null)} className="text-stone-400 hover:text-stone-700 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4 text-sm">
                  <p className="text-stone-600 leading-relaxed">{detailsEvent.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-stone-50 rounded-xl p-3">
                      <span className="text-stone-400 block mb-1">Date</span>
                      <span className="font-semibold text-[#1B1B24]">{formatEventDate(detailsEvent.startDate)}</span>
                    </div>
                    <div className="bg-stone-50 rounded-xl p-3">
                      <span className="text-stone-400 block mb-1">Time</span>
                      <span className="font-semibold text-[#1B1B24]">{formatTime(detailsEvent.startTime)}</span>
                    </div>
                    <div className="bg-stone-50 rounded-xl p-3">
                      <span className="text-stone-400 block mb-1">Level</span>
                      <span className="font-semibold text-[#1B1B24]">{detailsEvent.level.replace("_", " ")}</span>
                    </div>
                    <div className="bg-stone-50 rounded-xl p-3">
                      <span className="text-stone-400 block mb-1">Seats Left</span>
                      <span className="font-semibold text-[#1B1B24]">{detailsEvent.seatsLeft} / {detailsEvent.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{detailsEvent.locationOrLink}</span>
                  </div>

                  {detailsEvent.leadInstructor && (
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      {detailsEvent.leadInstructor.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={detailsEvent.leadInstructor.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-stone-200" />
                      )}
                      <span>Instructor: <strong>{detailsEvent.leadInstructor.fullName}</strong></span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-base font-bold text-[#900C27]">{detailsEvent.priceLabel}</span>
                    {detailsEvent.isRegistered ? (
                      <button
                        onClick={() => handleCancel(detailsEvent.id)}
                        disabled={actionLoading === detailsEvent.id}
                        className="px-5 py-2 border border-stone-300 text-stone-600 rounded-full text-xs font-bold"
                      >
                        Cancel Registration
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(detailsEvent.id, detailsEvent.registrationFee === 0, `₹${detailsEvent.registrationFee}`, detailsEvent.title)}
                        disabled={actionLoading === detailsEvent.id || detailsEvent.seatsLeft <= 0}
                        className="px-5 py-2 bg-[#900C27] hover:bg-[#780A20] text-white rounded-full text-xs font-bold disabled:opacity-50"
                      >
                        {detailsEvent.seatsLeft <= 0 ? "Fully Booked" : detailsEvent.registrationFee === 0 ? "Join Free" : "Register Now"}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal for Paid Events */}
      {paymentModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-4 relative">
            <button
              onClick={() => setPaymentModalData(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 bg-stone-100 p-2 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800">Complete Payment</h2>
              <p className="text-stone-500 mt-2 text-sm">
                To complete your registration for <strong className="text-stone-700">{paymentModalData.title}</strong>, please pay the registration fee.
              </p>
            </div>
            
            <div className="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-100 flex justify-between items-center">
              <span className="font-semibold text-stone-600 text-sm">Registration Fee</span>
              <span className="text-xl font-bold text-[#900C27]">{paymentModalData.priceLabel}</span>
            </div>

            <button
              onClick={processPaymentAndRegister}
              disabled={actionLoading === paymentModalData.eventId}
              className="w-full py-4 bg-[#900C27] hover:bg-[#780A20] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20 disabled:opacity-70"
            >
              {actionLoading === paymentModalData.eventId ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${paymentModalData.priceLabel} securely`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
