"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  ChevronRight
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

interface UserProfileData {
  id?: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  avatarUrl?: string;
  designation?: string;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    fullName: "Guru Harshita",
    email: "kathakbyharshita@gmail.com",
    role: "ADMIN",
    avatarUrl: "/Ananya.png",
    designation: "Head of Faculty & Founder"
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await apiRequest(ENDPOINTS.AUTH_ME);
        if (res.data?.user) {
          const u = res.data.user;
          setUserProfile({
            id: u.id,
            fullName: u.fullName || u.name || "Guru Harshita",
            email: u.email || "kathakbyharshita@gmail.com",
            role: u.role || "ADMIN",
            avatarUrl: u.avatarUrl || "/Ananya.png",
            designation: u.role === "ADMIN" ? "Head of Faculty & Founder" : "Kathak Instructor"
          });
        }
      } catch (err) {
        console.log("Using cached profile specs");
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <header className="h-[76px] bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-all">
      
      {/* Left Search & Mobile Toggle */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer shrink-0"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search lessons, progress, or faculty..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-stone-100/80 text-xs sm:text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9E0C25]/20 border border-stone-200/60 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Top Bar Profile Section */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0 pl-2">
        
        <button className="p-2.5 rounded-full hover:bg-stone-100 relative text-stone-600 transition-colors cursor-pointer border border-stone-100">
          <Bell className="w-5 h-5" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#9E0C25] absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse" />
        </button>

        {/* Interactive Top Bar Profile Button - Opens Full Page Profile (/admin/profile) */}
        <button
          onClick={() => router.push("/admin/profile")}
          className="flex items-center gap-3.5 pl-3 pr-4 py-1.5 rounded-2xl border border-stone-200/80 hover:border-[#9E0C25]/40 hover:bg-rose-50/40 transition-all cursor-pointer group shadow-2xs"
          title="Click to view My Profile & Reset Password"
        >
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userProfile.avatarUrl || "/Ananya.png"}
              alt={userProfile.fullName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#9E0C25] group-hover:scale-105 transition-transform"
            />
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
          </div>

          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-extrabold text-stone-900 leading-tight group-hover:text-[#9E0C25] transition-colors flex items-center gap-1.5">
              <span>{userProfile.fullName}</span>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                {userProfile.role}
              </span>
            </h4>
            <p className="text-[10.5px] font-semibold text-stone-500 truncate max-w-[170px]">
              {userProfile.email}
            </p>
          </div>

          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#9E0C25] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

    </header>
  );
}
