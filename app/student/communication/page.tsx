"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Users,
  Megaphone,
  Clock,
  Mail,
  Smartphone,
  MessageCircle,
  Ticket,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Plus
} from "lucide-react";

export default function StudentCommunicationPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const communicationsList = [
    {
      id: 1,
      fromInitials: "GS",
      fromColor: "bg-sky-100 text-sky-800",
      fromName: "Guru S. Mukherjee",
      preview: "Feedback on your 'Tatkar' video submission — Your footwork has in",
      isUnread: false,
      type: "In-App",
      typeIcon: MessageSquare,
    },
    {
      id: 2,
      fromInitials: "AO",
      fromColor: "bg-indigo-100 text-indigo-800",
      fromName: "Admin Office",
      preview: "Upcoming Dussehra Holiday Schedule — Academy will remain clo",
      isUnread: true,
      type: "Email",
      typeIcon: Mail,
    },
    {
      id: 3,
      fromInitials: "NS",
      fromColor: "bg-amber-100 text-amber-800",
      fromName: "Nritya Support",
      preview: "Payment Success Confirmation — Fee for Advanced Kathak (Oct-De",
      isUnread: false,
      type: "SMS",
      typeIcon: Smartphone,
    },
    {
      id: 4,
      fromInitials: "WB",
      fromColor: "bg-emerald-100 text-emerald-800",
      fromName: "Auto-Bot",
      preview: "Quick Reminder: Class starting in 15 mins. Join the live session now!",
      isUnread: false,
      type: "WhatsApp",
      typeIcon: MessageCircle,
    },
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* 1. PAGE HEADER & TOP BADGES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
            Communication Center
          </h1>
          <p className="text-sm font-normal text-[#464555]">
            Stay connected with your gurus and stay updated on academy events.
          </p>
        </div>

        {/* Top Right Badges Box */}
        <div className="flex items-center gap-3 bg-white border border-stone-200/80 rounded-2xl p-2.5 shadow-2xs shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50/70 border border-rose-100 rounded-xl">
            <span className="text-sm font-bold text-[#900C27]">03</span>
            <span className="text-[11px] font-semibold text-stone-600 leading-none">
              New<br />Messages
            </span>
          </div>

          <div className="w-px h-8 bg-stone-200" />

          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/70 border border-amber-100 rounded-xl">
            <span className="text-sm font-bold text-amber-800">01</span>
            <span className="text-[11px] font-semibold text-stone-600 leading-none">
              Announcements
            </span>
          </div>
        </div>
      </div>

      {/* 2. TOP ROW: 3 FEATURE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Direct Messages */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1B1B24]">Direct Messages</h3>
              <p className="text-xs text-stone-500 font-normal leading-relaxed pt-1">
                Private chat with your Guru and Support staff regarding your progress.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center -space-x-2">
              <div className="w-6 h-6 rounded-full bg-stone-300 border-2 border-white overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Ananya.png" alt="Guru" className="w-full h-full object-cover" />
              </div>
              <div className="w-6 h-6 rounded-full bg-stone-400 border-2 border-white overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Grace1.png" alt="Guru 2" className="w-full h-full object-cover" />
              </div>
              <span className="w-6 h-6 rounded-full bg-rose-100 text-[#900C27] border-2 border-white text-[9px] font-bold flex items-center justify-center">
                +2
              </span>
            </div>

            <button className="text-xs font-bold text-sky-700 hover:text-[#900C27] flex items-center gap-1 transition-colors">
              <span>Open Chat</span>
              <span>➔</span>
            </button>
          </div>
        </div>

        {/* Card 2: Batch Announcements */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1B1B24]">Batch Announcements</h3>
              <p className="text-xs text-stone-500 font-normal leading-relaxed pt-1">
                Updates specifically for the <strong className="text-[#900C27]">Advanced Kathak (Batch B)</strong> students.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
              1 New Alert
            </span>

            <button className="text-xs font-bold text-sky-700 hover:text-[#900C27] flex items-center gap-1 transition-colors">
              <span>View Batch</span>
              <span>➔</span>
            </button>
          </div>
        </div>

        {/* Card 3: Academy Broadcasts */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1B1B24]">Academy Broadcasts</h3>
              <p className="text-xs text-stone-500 font-normal leading-relaxed pt-1">
                Global news, holiday alerts, and upcoming workshop notifications for everyone.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-400 font-medium">
              No new updates
            </span>

            <button className="text-xs font-bold text-sky-700 hover:text-[#900C27] flex items-center gap-1 transition-colors">
              <span>View Global</span>
              <span>➔</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION: RECENT COMMUNICATIONS TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
        
        {/* Table Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-500" />
            <h3 className="text-base font-bold text-[#1B1B24]">
              Recent Communications
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            {["All", "Direct", "Broadcast"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-4">FROM</th>
                <th className="py-3 px-6">SUBJECT / PREVIEW</th>
                <th className="py-3 px-4 text-right">TYPE</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs">
              {communicationsList.map((item) => {
                const IconComponent = item.typeIcon;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    
                    {/* FROM */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${item.fromColor}`}>
                          {item.fromInitials}
                        </div>
                        <span className="font-semibold text-stone-800">{item.fromName}</span>
                      </div>
                    </td>

                    {/* SUBJECT / PREVIEW */}
                    <td className="py-4 px-6">
                      <span className={`line-clamp-1 ${item.isUnread ? "font-bold text-[#1B1B24]" : "text-stone-600 font-normal"}`}>
                        {item.preview}
                      </span>
                    </td>

                    {/* TYPE */}
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 border border-stone-200 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-stone-600 bg-white shadow-2xs">
                        <IconComponent className="w-3 h-3 text-stone-500" />
                        <span>{item.type}</span>
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-medium">
          <span>Showing 4 of 24 communications</span>

          <div className="flex items-center gap-1 text-stone-600">
            <button className="p-1 rounded hover:bg-stone-100 border border-stone-200">‹</button>
            <button className="p-1 rounded hover:bg-stone-100 border border-stone-200">›</button>
          </div>
        </div>

      </div>

      {/* 4. BOTTOM ROW: 2 HELP CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: WHATSAPP SUPPORT (Green Background Card) */}
        <div className="bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-[24px] p-6 sm:p-8 text-white space-y-4 relative overflow-hidden shadow-md">
          {/* Background Watermark Icon */}
          <div className="absolute top-0 right-0 -mr-6 -mt-6 text-white/10 pointer-events-none">
            <MessageCircle className="w-48 h-48" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white fill-white" />
              <h3 className="text-lg font-bold text-white">WhatsApp Support</h3>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-normal max-w-sm">
              Connect with our dedicated support team instantly for any technical or batch queries.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <a
              href="https://wa.me"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-emerald-800 font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-md cursor-pointer"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* CARD 2: RAISE A TICKET */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-dashed border-stone-300 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1B1B24]">Raise a Ticket</h3>
              <Ticket className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-normal">
              Found a bug or need administrative help? We&apos;re here to assist.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-400 font-medium text-[11px]">
              • Response time: ~2 hours
            </span>

            <button className="text-sky-700 font-bold hover:underline flex items-center gap-1">
              <span>Create Ticket</span>
              <Plus className="w-3.5 h-3.5 text-sky-700" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
