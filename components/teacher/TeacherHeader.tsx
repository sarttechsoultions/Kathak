"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";

interface TeacherHeaderProps {
  onToggleMobileMenu?: () => void;
  className?: string;
}

export default function TeacherHeader({
  onToggleMobileMenu,
  className = "",
}: TeacherHeaderProps) {
  const [profile, setProfile] = useState({
    name: "Teacher",
    avatar: "",
    id: "",
  });

  useEffect(() => {
    const savedUser =
      localStorage.getItem("kathak_teacher_user") ||
      localStorage.getItem("kathak_session_user") ||
      localStorage.getItem("kathak_admin_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const name = parsed.fullName || parsed.name || "Teacher";
        const avatar = parsed.avatarUrl || "";
        const id = parsed.teacherId || (parsed.id ? `#${String(parsed.id).slice(0, 6).toUpperCase()}` : "");

        const timer = setTimeout(() => {
          setProfile({ name, avatar, id });
        }, 0);
        return () => clearTimeout(timer);
      } catch {
        // keep defaults
      }
    }
  }, []);

  const initial = profile.name.trim().charAt(0).toUpperCase() || "T";

  return (
    <header className={`w-full h-16 sm:h-[72px] bg-white border-b border-stone-200/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs shrink-0 ${className}`}>
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 lg:hidden cursor-pointer shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full min-w-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full h-10 sm:h-11 pl-10 pr-3 sm:pr-4 rounded-full bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#900C27] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 pl-2">
        <button
          type="button"
          className="relative p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-[#900C27] absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        <Link
          href="/teacher/settings"
          className="flex items-center gap-2.5 rounded-full hover:bg-stone-50 transition-colors pl-1"
          title="Settings"
        >
          <div className="text-right hidden md:block">
            <h4 className="font-extrabold text-xs text-stone-900 leading-tight">
              {profile.name}
            </h4>
            {profile.id ? (
              <p className="text-[10px] font-semibold text-stone-400">
                Teacher ID: {profile.id}
              </p>
            ) : null}
          </div>

          {profile.avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#900C27] text-white flex items-center justify-center font-extrabold text-sm">
              {initial}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
