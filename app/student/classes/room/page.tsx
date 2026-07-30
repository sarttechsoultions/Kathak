"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Hand,
  Monitor,
  MessageSquare,
  PhoneOff,
  Send,
  Pin,
  Users,
  Clock,
  Sparkles,
  ChevronLeft
} from "lucide-react";

export default function StudentLiveClassRoomPage() {
  const router = useRouter();

  // Media Controls State
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  // Chat messages list
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Ananya Sharma",
      time: "10:40 AM",
      text: "Guru Ji, could you please repeat the footwork for the last Teentaal sequence?",
      isSelf: false,
      isGuru: false,
    },
    {
      id: 2,
      sender: "You",
      time: "10:43 AM",
      text: "Yes, I also found the transition a bit tricky!",
      isSelf: true,
      isGuru: false,
    },
    {
      id: 3,
      sender: "Guru Pt. Birju Maharaj Jr.",
      time: "10:45 AM",
      text: "Focus on the landing of the heel. Let me demonstrate once more slowly.",
      isSelf: false,
      isGuru: true,
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: chatMessage,
      isSelf: true,
      isGuru: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setChatMessage("");
  };

  const handleLeaveClass = () => {
    router.push("/student/classes");
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      
      {/* Top Header back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/classes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#900C27] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Live Classes Schedule</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-[#900C27] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#900C27] animate-ping" />
            LIVE SESSION ACTIVE
          </span>
        </div>
      </div>

      {/* MAIN LIVE CLASS ROOM GRID (Left Video Stream | Right Live Chat & Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Video Player & Control Bar (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* VIDEO PLAYER CONTAINER */}
          <div className="bg-stone-900 rounded-[24px] overflow-hidden relative shadow-xl h-[480px] sm:h-[540px] border border-stone-800 flex flex-col justify-between p-4 sm:p-6">
            
            {/* Background Live Stream Feed */}
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gurukul-dancer.jpg"
                alt="Kathak Live Performance Stream"
                className="w-full h-full object-cover object-center filter brightness-95"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/classesbg.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
            </div>

            {/* TOP OVERLAY BADGES */}
            <div className="relative z-10 flex items-center justify-between">
              
              {/* Left Badge: RECORDING + TIMER */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  RECORDING
                </span>
                <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white/90 px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>42:19</span>
                </span>
              </div>

              {/* Right Badge: GURU NAME */}
              <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                <span className="text-[10px] text-amber-300 font-mono uppercase">Guru</span>
                <span>Pt. Birju Maharaj Jr.</span>
              </div>

            </div>

            {/* BOTTOM RIGHT PICTURE-IN-PICTURE (Student Webcam View) */}
            <div className="relative z-10 flex justify-end">
              <div className="w-32 sm:w-40 aspect-video rounded-xl overflow-hidden border-2 border-white/80 shadow-2xl bg-stone-800 relative group">
                {isVideoOn ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src="/Ananya.png"
                    alt="Student Webcam Feed"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-900 text-stone-400 text-xs font-bold">
                    Camera Off
                  </div>
                )}
                <span className="absolute bottom-1 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  YOU
                </span>
              </div>
            </div>

          </div>

          {/* VIDEO CONTROL BAR BELOW PLAYER */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs flex flex-wrap items-center justify-center sm:justify-between gap-3">
            
            <div className="flex items-center gap-3">
              {/* Camera Toggle */}
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isVideoOn
                    ? "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200"
                    : "bg-rose-100 border-rose-200 text-rose-600"
                }`}
                title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              {/* Microphone Toggle */}
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isMicOn
                    ? "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200"
                    : "bg-rose-100 border-rose-200 text-rose-600"
                }`}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Center Main Action: Raise Hand */}
            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                handRaised
                  ? "bg-amber-500 text-white shadow-amber-500/30"
                  : "bg-[#900C27] hover:bg-[#780A20] text-white"
              }`}
            >
              <Hand className="w-4 h-4" />
              <span>{handRaised ? "Hand Raised ✋" : "Raise Hand"}</span>
            </button>

            {/* Right Control Actions & Leave Button */}
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors">
                <Monitor className="w-4 h-4" />
              </button>

              <button
                onClick={handleLeaveClass}
                className="bg-[#C10F3A] hover:bg-[#A01830] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <PhoneOff className="w-4 h-4 fill-white" />
                <span>Leave Class</span>
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Live Chat & Engagement Analytics (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* LIVE CHAT PANEL CARD */}
          <div className="bg-white rounded-[24px] border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col h-[520px]">
            
            {/* Top Chat Header Tab */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2 border-b-2 border-[#900C27] pb-1">
                <MessageSquare className="w-4 h-4 text-[#900C27]" />
                <span className="text-xs font-bold text-[#1B1B24]">Live Chat</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">124 Participants</span>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#1B1B24]">{msg.sender}</span>
                    <span className="text-[9px] text-stone-400 font-mono">{msg.time}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.isGuru
                        ? "bg-[#FDF2F4] text-[#900C27] border border-rose-200 font-medium"
                        : msg.isSelf
                        ? "bg-[#E5F2FF] text-sky-950 font-medium"
                        : "bg-[#F4F0F7] text-stone-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Pinned Guru Notice */}
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center gap-2 text-[10px] text-amber-900 font-semibold my-2">
                <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>GURU SHIVANGI PINNED A MESSAGE</span>
              </div>

            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-stone-50 border border-stone-200 focus:border-[#900C27] rounded-xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-[#900C27] hover:bg-[#780A20] text-white p-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

          {/* ENGAGEMENT & LIVE ANALYTICS CARD */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">ENGAGEMENT</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-md">Live Analytics</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FDF2F4] border border-rose-100 p-3 rounded-xl text-center">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">STUDENTS</span>
                <span className="text-xl font-bold text-[#900C27]">124</span>
              </div>

              <div className="bg-[#E5F2FF] border border-sky-100 p-3 rounded-xl text-center">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">HAND RAISES</span>
                <span className="text-xl font-bold text-sky-700">8</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
