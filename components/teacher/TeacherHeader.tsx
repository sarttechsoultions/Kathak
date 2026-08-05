"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";

interface TeacherHeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function TeacherHeader({ onToggleMobileMenu }: TeacherHeaderProps) {
  const [profile, setProfile] = useState({
    name: "Harshita Sharma",
    avatar: "",
    id: "#TCH-2025"
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("kathak_admin_user") || localStorage.getItem("kathak_teacher_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const name = parsed.fullName || parsed.name || "Harshita Sharma";
        const avatar = parsed.avatarUrl || "";
        const id = parsed.teacherId || (parsed.id ? `#TCH-${parsed.id.slice(0, 4).toUpperCase()}` : "#TCH-2025");
        
        const timer = setTimeout(() => {
          setProfile({ name, avatar, id });
        }, 0);
        return () => clearTimeout(timer);
      } catch {
        // Fallback
      }
    }
  }, []);

  const initial = profile.name.trim().charAt(0).toUpperCase() || "H";

  return (
    <header className="h-[96px] bg-white border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lessons, progress, or teachers..."
            className="w-full h-11 pl-10 pr-4 rounded-full bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Right: Notification Bell & Teacher Profile Badge */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Button */}
        <button className="relative p-2.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-100">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-[#900C27] absolute top-2 right-2 ring-2 ring-white" />
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-stone-200/80">
          <div className="text-right hidden sm:block">
            <h4 className="font-extrabold text-xs text-stone-900 leading-tight">
              {profile.name}
            </h4>
            <p className="text-[10px] font-semibold text-stone-400">
              Teacher ID: {profile.id}
            </p>
          </div>

          {profile.avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#900C27] shadow-2xs"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#900C27] text-white flex items-center justify-center font-extrabold text-base border-2 border-white shadow-2xs">
              {initial}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
