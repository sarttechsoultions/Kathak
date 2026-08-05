"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Users,
  Wifi,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Clock,
  Play,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Bell,
  Sparkles,
  Loader2,
  Hand,
  Send,
  Monitor,
  MoreVertical,
  LogOut,
  Flag
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

interface LiveClassData {
  id: string;
  title: string;
  teacherName: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  batchName?: string;
  batchCode?: string;
}

interface StatsData {
  completedCount: number;
  upcomingCount: number;
  overallAttendance: string;
}

export default function TeacherLiveClassesView() {
  const [loading, setLoading] = useState(true);
  const [isInClass, setIsInClass] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [stats, setStats] = useState<StatsData>({
    completedCount: 42,
    upcomingCount: 12,
    overallAttendance: "92%"
  });

  const [liveClasses, setLiveClasses] = useState<LiveClassData[]>([]);
  const [selectedDate, setSelectedDate] = useState<number>(15);

  // Chat Feed State (1:1 Figma Matching Messages)
  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      sender: "Ananya Sharma",
      time: "10:42 AM",
      text: "Guru ji, could you please repeat the footwork for the last Teentaal sequence?",
      isMe: false,
      isGuru: false
    },
    {
      id: "2",
      sender: "You",
      time: "10:43 AM",
      text: "Yes, I also found the transition a bit tricky!",
      isMe: true,
      isGuru: false
    },
    {
      id: "3",
      sender: "Guru Pt. Birju Maharaj Jr.",
      time: "10:45 AM",
      text: "Focus on the landing of the heel. Let me demonstrate once more slowly.",
      isMe: false,
      isGuru: true
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchLiveClasses = async () => {
      try {
        const res = await apiRequest<{ data?: { classes?: LiveClassData[]; stats?: StatsData } }>(
          ENDPOINTS.LIVE_CLASS_TEACHER
        );

        if (isMounted && res.data) {
          if (res.data.classes) setLiveClasses(res.data.classes);
          if (res.data.stats) setStats(res.data.stats);
        }
      } catch {
        // Silently handle error
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLiveClasses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "You",
        time: timeString,
        text: newMessage.trim(),
        isMe: true,
        isGuru: false
      }
    ]);

    setNewMessage("");
  };

  // If Teacher clicked "Join Class Now" -> Render 1:1 Figma Interactive Live Class Room View
  if (isInClass) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-[1280px] mx-auto pb-12">
        
        {/* Main Content Canvas (1:1 Figma Room View - Fixed 1000px x 960px canvas style) */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Large Video Player & Control Toolbar (8 Cols - 626px Figma Fill) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Main Large Video Stage Box */}
              <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl h-[680px] flex flex-col justify-between p-6 group">
                
                {/* High Quality Kathak Performance Video Stream Background */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop"
                  alt="Kathak Live Stream Stage View"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:scale-102 transition-transform duration-500"
                />

                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/85 pointer-events-none" />

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#900C27] text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                      RECORDING
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs border border-white/20">
                      <Clock className="w-3.5 h-3.5 text-stone-300" />
                      42:19
                    </span>
                  </div>

                  {/* Guru Top-Right Floating Glassmorphism Badge */}
                  <div className="bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/60 text-right shadow-lg">
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-amber-700">Guru</p>
                    <p className="text-xs font-black text-slate-900 leading-tight">Pt. Birju Maharaj Jr.</p>
                  </div>
                </div>

                {/* Floating PIP (Picture-in-Picture) Self Camera View (Bottom Right) */}
                <div className="absolute bottom-6 right-6 z-10 w-48 h-36 rounded-2xl overflow-hidden border-3 border-white shadow-2xl bg-stone-950 group/pip">
                  {isCameraOn ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
                      alt="Self Webcam Video View"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-900 flex items-center justify-center text-stone-400 font-extrabold text-xs">
                      Camera Off
                    </div>
                  )}
                  
                  {/* YOU Badge */}
                  <span className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    YOU
                  </span>
                </div>

              </div>

              {/* Bottom Control Toolbar */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                
                <div className="flex items-center gap-2.5">
                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className={`p-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      isCameraOn
                        ? "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 shadow-2xs"
                        : "bg-rose-100 border-rose-200 text-rose-700"
                    }`}
                    title="Toggle Camera"
                  >
                    {isCameraOn ? <Camera className="w-4.5 h-4.5" /> : <CameraOff className="w-4.5 h-4.5" />}
                  </button>

                  {/* Mic Button */}
                  <button
                    type="button"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      isMicOn
                        ? "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 shadow-2xs"
                        : "bg-rose-100 border-rose-200 text-rose-700"
                    }`}
                    title="Toggle Mic"
                  >
                    {isMicOn ? <Mic className="w-4.5 h-4.5" /> : <MicOff className="w-4.5 h-4.5" />}
                  </button>

                  {/* Raise Hand Button */}
                  <button
                    type="button"
                    onClick={() => setIsHandRaised(!isHandRaised)}
                    className={`px-5 py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                      isHandRaised
                        ? "bg-amber-600 text-white"
                        : "bg-[#BA1A1A] hover:bg-[#780A20] text-white"
                    }`}
                  >
                    <Hand className="w-4.5 h-4.5" />
                    <span>{isHandRaised ? "Hand Raised" : "Raise Hand"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Screen Share Button */}
                  <button
                    type="button"
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`p-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      isScreenSharing
                        ? "bg-sky-100 border-sky-200 text-sky-700"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 shadow-2xs"
                    }`}
                    title="Screen Share"
                  >
                    <Monitor className="w-4.5 h-4.5" />
                  </button>

                  {/* More Options Button */}
                  <button
                    type="button"
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 shadow-2xs transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>

                  {/* Leave Class Button */}
                  <button
                    type="button"
                    onClick={() => setIsInClass(false)}
                    className="px-6 py-3 rounded-xl bg-[#BA1A1A] hover:bg-[#780A20] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    <span>Leave Class</span>
                  </button>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Live Chat & Engagement Analytics (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 1. Live Chat Panel */}
              <div className="rounded-3xl border border-stone-200/80 bg-white shadow-2xs overflow-hidden flex flex-col h-[540px]">
                
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2 bg-stone-50/50">
                  <Flag className="w-4 h-4 text-[#900C27]" />
                  <h3 className="font-extrabold text-sm text-[#900C27] tracking-tight">
                    Live Chat
                  </h3>
                </div>

                {/* Messages Feed Stream */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
                  
                  {chatMessages.map((msg) => {
                    if (msg.isGuru) {
                      return (
                        <div key={msg.id} className="space-y-1">
                          <div className="flex items-center justify-between text-[10.5px]">
                            <span className="font-bold text-[#900C27]">{msg.sender}</span>
                            <span className="text-stone-400">{msg.time}</span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-white border border-rose-200/80 text-stone-800 font-medium italic shadow-2xs">
                            &ldquo;{msg.text}&rdquo;
                          </div>
                        </div>
                      );
                    }

                    if (msg.isMe) {
                      return (
                        <div key={msg.id} className="space-y-1 text-right">
                          <div className="flex items-center justify-end gap-2 text-[10.5px]">
                            <span className="text-stone-400">{msg.time}</span>
                            <span className="font-extrabold text-sky-700">You</span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-stone-900 font-medium text-left ml-auto max-w-[90%]">
                            {msg.text}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-bold text-stone-900">{msg.sender}</span>
                          <span className="text-stone-400">{msg.time}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-stone-800 font-medium max-w-[90%]">
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}

                  {/* System Pinned Message Badge */}
                  <div className="text-center my-3">
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 font-extrabold text-[9.5px] uppercase tracking-wider border border-stone-200">
                      GURU MAHARAJ PINNED A MESSAGE
                    </span>
                  </div>

                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-100 flex items-center gap-2 bg-stone-50/30">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 h-11 px-4 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#900C27]"
                  />
                  <button
                    type="submit"
                    className="w-11 h-11 rounded-xl bg-[#BA1A1A] hover:bg-[#780A20] text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-2xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>

              {/* 2. Engagement Analytics Panel */}
              <div className="p-6 rounded-3xl border border-stone-200/80 bg-white shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-400">
                    ENGAGEMENT
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
                    Live Analytics
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  {/* Box 1: Students */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                    <p className="text-[10px] font-bold uppercase text-[#900C27]">
                      STUDENTS
                    </p>
                    <h3 className="text-2xl font-black text-[#900C27] mt-0.5">
                      124
                    </h3>
                  </div>

                  {/* Box 2: Hand Raises */}
                  <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <p className="text-[10px] font-bold uppercase text-[#0284C7]">
                      HAND RAISES
                    </p>
                    <h3 className="text-2xl font-black text-[#0284C7] mt-0.5">
                      8
                    </h3>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // Live Classes Overview & Sessions List View
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Page Title & Subtitle */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-[#0B1C30] tracking-tight">
          Live Classes
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Stay synchronized with your Guru. Join live sessions to perfect your Mudras and Taal.
        </p>
      </div>

      {/* 2. Top Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1: Completed Classes */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-4 transition-all hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#900C27] shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Completed Classes
            </p>
            <h3 className="text-2xl font-black text-stone-900 leading-tight mt-0.5">
              {stats.completedCount}
            </h3>
          </div>
        </div>

        {/* Card 2: Upcoming Classes */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-4 transition-all hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284C7] shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Upcoming Classes
              </p>
              <span className="text-[10px] font-extrabold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                This Month
              </span>
            </div>
            <h3 className="text-2xl font-black text-stone-900 leading-tight mt-0.5">
              {stats.upcomingCount}
            </h3>
          </div>
        </div>

        {/* Card 3: Overall Attendance */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-4 transition-all hover:shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0EA5E9] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Overall Attendance
            </p>
            <h3 className="text-2xl font-black text-stone-900 leading-tight mt-0.5">
              {stats.overallAttendance}
            </h3>
          </div>
        </div>

      </div>

      {/* 3. Main Content Split Grid (Left Column 60% vs Right Column 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Featured Hero Live Banner & Upcoming Sessions List (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Hero Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-800 bg-stone-950 min-h-[380px] flex flex-col justify-end p-6 sm:p-8 group">
            
            {/* Background Kathak Dance Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop"
              alt="Kathak Basics - Advanced Footwork Live Class"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-60 group-hover:scale-105 transition-transform duration-700"
            />

            {/* Dark Gradient Overlay for High Contrast Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#900C27] text-white font-extrabold text-xs tracking-wider uppercase shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  ● LIVE NOW
                </span>
                <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-semibold text-xs border border-white/20">
                  42 Students Watching
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 space-y-4 pt-16">
              
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                Kathak Basics - Advanced Footwork
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#900C27] text-white flex items-center justify-center font-extrabold text-xs border border-white/40">
                    M
                  </div>
                  <div>
                    <p className="font-bold text-white leading-none">Guru Meenakshi</p>
                    <p className="text-[10px] text-stone-300">Senior Faculty</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-rose-200 font-bold bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-rose-300" />
                  <span>Ends in 45:20</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsInClass(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-[#900C27] hover:bg-stone-100 font-black text-sm transition-all shadow-lg hover:scale-102 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-[#900C27]" />
                  <span>Join Class Now</span>
                </button>
              </div>

            </div>
          </div>

          {/* Upcoming Sessions List Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                Upcoming Sessions
              </h3>
              <button
                type="button"
                className="text-xs font-extrabold text-[#900C27] hover:underline cursor-pointer"
              >
                View Full Calendar
              </button>
            </div>

            {/* Session Card 1 */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-stone-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-black uppercase text-[#0284C7] leading-none">JUL</span>
                  <span className="text-xl font-black text-[#0284C7] leading-none mt-1">20</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    Abhinaya Expressions - Navarasa
                  </h4>
                  <p className="text-xs font-semibold text-stone-400">
                    Guru Rahul • 10:30 AM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  Remind Me
                </button>
                <button
                  type="button"
                  onClick={() => setIsInClass(true)}
                  className="px-4 py-2 rounded-xl bg-[#900C27] text-white font-bold text-xs hover:bg-[#780A20] cursor-pointer shadow-xs transition-colors"
                >
                  Join Session
                </button>
              </div>
            </div>

            {/* Session Card 2 */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-stone-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-black uppercase text-[#0284C7] leading-none">JUL</span>
                  <span className="text-xl font-black text-[#0284C7] leading-none mt-1">22</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    Rhythm &amp; Taal Patterns (Teen Taal)
                  </h4>
                  <p className="text-xs font-semibold text-stone-400">
                    Guru Harshita • 04:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#900C27] hover:bg-[#780A20] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Set Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setIsInClass(true)}
                  className="px-4 py-2 rounded-xl bg-[#900C27] text-white font-bold text-xs hover:bg-[#780A20] cursor-pointer shadow-xs transition-colors"
                >
                  Join Session
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Diagnostics, Mini Calendar, Today's Reminders & Guru's Tip (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Widget 1: System Readiness Diagnostics */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 text-stone-900">
              <Sparkles className="w-4 h-4 text-[#900C27]" />
              <h3 className="font-extrabold text-sm tracking-tight text-stone-900">
                Ready for Class?
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-stone-800">Internet Connection</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-stone-800">Camera Status</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-stone-800">Microphone</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-2xl border-2 border-dashed border-stone-200 hover:border-stone-400 text-stone-700 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Run Diagnostics
            </button>
          </div>

          {/* Widget 2: Interactive Mini Calendar & Today's Reminders */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6">
            
            {/* Month Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-stone-900">
                July 2025
              </h3>
              <div className="flex items-center gap-1">
                <button type="button" className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-stone-400 uppercase">
                <span>SU</span>
                <span>MO</span>
                <span>TU</span>
                <span>WE</span>
                <span>TH</span>
                <span>FR</span>
                <span>SA</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-stone-700">
                <span className="py-1.5 text-stone-300">13</span>
                <span className="py-1.5 text-stone-300">14</span>
                <button
                  type="button"
                  onClick={() => setSelectedDate(15)}
                  className={`py-1.5 rounded-full mx-auto w-7 h-7 flex items-center justify-center transition-all cursor-pointer ${
                    selectedDate === 15
                      ? "bg-[#900C27] text-white font-black shadow-xs"
                      : "hover:bg-stone-100"
                  }`}
                >
                  15
                </button>
                <span className="py-1.5">16</span>
                <span className="py-1.5">17</span>
                <span className="py-1.5">18</span>
                <span className="py-1.5">19</span>
                <span className="py-1.5 text-[#0284C7] font-black">20</span>
                <span className="py-1.5">21</span>
                <span className="py-1.5 text-[#0284C7] font-black">22</span>
                <span className="py-1.5">23</span>
                <span className="py-1.5">24</span>
                <span className="py-1.5">25</span>
                <span className="py-1.5">26</span>
              </div>
            </div>

            {/* Today's Reminders Section */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <p className="text-[10.5px] font-bold text-stone-400 uppercase tracking-wider">
                TODAY&apos;S REMINDERS
              </p>
              <div className="pl-3 border-l-4 border-[#900C27] space-y-0.5">
                <h4 className="font-extrabold text-xs text-stone-900">
                  Footwork Practise
                </h4>
                <p className="text-[11px] font-semibold text-stone-400">
                  05:00 PM • Live in 15m
                </p>
              </div>
            </div>

          </div>

          {/* Widget 3: Guru's Tip for Today Card */}
          <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#075985] text-white shadow-lg space-y-3 overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none">
              <Lightbulb className="w-36 h-36" />
            </div>

            <div className="flex items-center gap-2 text-sky-200">
              <Lightbulb className="w-4 h-4 text-sky-200" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider">
                Guru&apos;s Tip for Today
              </h4>
            </div>

            <blockquote className="text-xs font-semibold leading-relaxed italic text-sky-50/95 relative z-10">
              &ldquo;Remember, the Taal lives in your breath as much as your feet. Sync your breathing to the Teen Taal for natural fluidity.&rdquo;
            </blockquote>

            <p className="text-[11px] font-extrabold text-sky-200 text-right pt-1 relative z-10">
              — Guru Meenakshi
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
