"use client";

import React, { useState, useEffect } from "react";
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
  MoreVertical,
  Loader2,
  Trash2
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api";
import { openThemeSuccess, openThemeError } from "@/components/ThemeDialogProvider";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isUnread: boolean;
  link: string | null;
  createdAt: string;
}

export default function StudentNotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(ENDPOINTS.NOTIFICATIONS);
      if (res.data) {
        setNotifications(res.data);
      }
    } catch (err: any) {
      console.error(err);
      openThemeError("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await apiRequest(`${ENDPOINTS.NOTIFICATIONS}/read-all`, { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
      openThemeSuccess("All notifications marked as read.", "Success");
    } catch (err: any) {
      openThemeError("Failed to mark all as read");
    }
  };

  const markAsRead = async (id: string, isUnread: boolean) => {
    if (!isUnread) return;
    try {
      await apiRequest(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`, { method: "PUT" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const filteredNotifications = notifications.filter(n => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Feedback" && n.type === "FEEDBACK") return true;
    if (selectedFilter === "Announcements" && n.type === "ANNOUNCEMENT") return true;
    if (selectedFilter === "Classes" && n.type === "CLASS") return true;
    if (selectedFilter === "Payments" && n.type === "PAYMENT") return true;
    return false;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "FEEDBACK": return { icon: Video, color: "bg-indigo-100 text-indigo-700" };
      case "ANNOUNCEMENT": return { icon: AlertCircle, color: "bg-amber-100 text-amber-700" };
      case "ACHIEVEMENT": return { icon: Award, color: "bg-emerald-100 text-emerald-700" };
      case "CLASS": return { icon: Clock, color: "bg-sky-100 text-sky-700" };
      case "PAYMENT": return { icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" };
      default: return { icon: Bell, color: "bg-stone-200 text-stone-700" };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
           <button 
             onClick={markAllAsRead}
             disabled={unreadCount === 0 || isLoading}
             className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-50 cursor-pointer"
           >
            <Check className="w-4 h-4" />
            Mark all as read
           </button>
        </div>
      </div>

      {/* 2. NOTIFICATIONS LIST SECTION */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        
        {/* Filters Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {["All", "Feedback", "Announcements", "Classes", "Payments"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === filter
                    ? "bg-[#900C27] text-white shadow-sm"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button className="p-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-50 bg-white shrink-0 cursor-pointer">
             <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="divide-y divide-stone-100 flex-1">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const { icon: Icon, color } = getIcon(notification.type);
              return (
                <div 
                  key={notification.id} 
                  onClick={() => markAsRead(notification.id, notification.isUnread)}
                  className={`p-4 sm:p-6 transition-colors hover:bg-stone-50/80 flex gap-4 cursor-pointer ${notification.isUnread ? 'bg-sky-50/30' : ''}`}
                >
                  {/* Icon Column */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${color}`}>
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
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-stone-600 leading-relaxed pr-8">
                      {notification.message}
                    </p>

                    {notification.link && (
                      <div className="pt-2 flex items-center gap-3">
                         <Link href={notification.link} className="text-xs font-bold text-[#900C27] hover:text-[#780a20] hover:underline">
                            View Details
                         </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <Bell className="w-12 h-12 text-stone-200 mb-3" />
              <p className="text-sm font-semibold text-stone-500">No notifications found.</p>
              <p className="text-xs text-stone-400 mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}