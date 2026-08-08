"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Clock,
  CheckCircle2,
  Video,
  Award,
  AlertCircle,
  Calendar,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";

export default function StudentNotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const notificationsList = [
    {
      id: 1,
      type: "Feedback",
      title: "New Feedback Received",
      message: "Guru S. Mukherjee has reviewed your 'Tatkar' video submission.",
      time: "2 hours ago",
      isUnread: true,
      icon: Video,
      color: "bg-indigo-100 text-indigo-700",
      link: "/student/progress"
    },
    {
      id: 2,
      type: "Announcement",
      title: "Dussehra Holiday Schedule",
      message: "The academy will remain closed from Oct 22 to Oct 24 for Dussehra celebrations.",
      time: "1 day ago",
      isUnread: true,
      icon: AlertCircle,
      color: "bg-amber-100 text-amber-700",
      link: "#"
    },
    {
      id: 3,
      type: "Achievement",
      title: "Module Completed!",
      message: "Congratulations! You have successfully completed the 'Basic Mudras' module.",
      time: "2 days ago",
      isUnread: false,
      icon: Award,
      color: "bg-emerald-100 text-emerald-700",
      link: "/student/progress"
    },
    {
      id: 4,
      type: "Class Alert",
      title: "Live Session Reminder",
      message: "Your 'Advanced Kathak' live session starts in 15 minutes. Click to join.",
      time: "3 days ago",
      isUnread: false,
      icon: Clock,
      color: "bg-sky-100 text-sky-700",
      link: "/student/live-classes"
    },
    {
      id: 5,
      type: "Payment",
      title: "Payment Successful",
      message: "We have received your fee payment for the Oct-Dec quarter. View receipt.",
      time: "1 week ago",
      isUnread: false,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-700",
      link: "#"
    },
    {
      id: 6,
      type: "System",
      title: "System Maintenance",
      message: "The learning portal will be down for scheduled maintenance on Sunday from 2 AM to 4 AM.",
      time: "2 weeks ago",
      isUnread: false,
      icon: Calendar,
      color: "bg-stone-200 text-stone-700",
      link: "#"
    },
  ];

  const unreadCount = notificationsList.filter(n => n.isUnread).length;

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-[#900C27] text-white text-[11px] font-bold px-2 py-0.5 rounded-full relative -top-1">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-sm font-normal text-[#464555]">
            Stay updated with your latest feedback, class alerts, and academy news.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors">
            <Check className="w-4 h-4" />
            Mark all as read
           </button>
        </div>
      </div>

      {/* 2. NOTIFICATIONS LIST SECTION */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        
        {/* Filters Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {["All", "Feedback", "Announcements", "Classes", "Payments"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedFilter === filter
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button className="p-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-50 bg-white shrink-0">
             <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="divide-y divide-stone-100">
          {notificationsList.map((notification) => {
            const Icon = notification.icon;
            return (
              <div 
                key={notification.id} 
                className={`p-4 sm:p-6 transition-colors hover:bg-stone-50 flex gap-4 ${notification.isUnread ? 'bg-sky-50/30' : ''}`}
              >
                {/* Icon Column */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${notification.color}`}>
                   <Icon className="w-5 h-5" />
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-1 relative">
                  {notification.isUnread && (
                    <div className="absolute -left-2 top-2 w-2 h-2 rounded-full bg-[#900C27]" />
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className={`text-[15px] ${notification.isUnread ? 'font-bold text-[#1B1B24]' : 'font-semibold text-stone-800'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[11px] font-medium text-stone-400 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  
                  <p className="text-sm text-stone-600 leading-relaxed pr-8">
                    {notification.message}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                     <Link href={notification.link} className="text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline">
                        View Details
                     </Link>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="shrink-0">
                  <button className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors">
                     <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium bg-stone-50/50">
          <span>Showing 1 to 6 of 24 notifications</span>

          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-200 border border-stone-200 bg-white">
               <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-200 border border-stone-200 bg-white">
               <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}