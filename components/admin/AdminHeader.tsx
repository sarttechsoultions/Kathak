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
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  designation?: string;
}

export default function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const router = useRouter();

  // Lazy state initializer reads localStorage synchronously before initial render (React 19 Best Practice)
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kathak_session_user") || localStorage.getItem("kathak_admin_user");
      if (saved) {
        try {
          const u = JSON.parse(saved);
          if (u) {
            return {
              id: u.id,
              fullName: u.fullName || u.name || "",
              email: u.email || "",
              role: u.role || "ADMIN",
              avatarUrl: u.avatarUrl || ""
            };
          }
        } catch {
          // Ignore
        }
      }
    }
    return null;
  });

  useEffect(() => {
    let isMounted = true;

    // Fetch fresh user profile from API asynchronously
    const fetchUserProfile = async () => {
      try {
        const res = await apiRequest<{ data?: { user?: UserProfileData } }>(ENDPOINTS.AUTH_ME);
        if (isMounted && res.data?.user) {
          const u = res.data.user;
          const updated: UserProfileData = {
            id: u.id,
            fullName: u.fullName || u.name || "",
            email: u.email || "",
            role: u.role || "ADMIN",
            avatarUrl: u.avatarUrl || ""
          };
          setUserProfile(updated);
          localStorage.setItem("kathak_session_user", JSON.stringify(updated));
        }
      } catch {
        // Handle error silently
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const nameString = userProfile?.fullName || userProfile?.name || "";
  const initial = nameString.trim().charAt(0).toUpperCase() || "A";

  return (
    <header className="h-[96px] bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-all">
      
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
        
        <button className="p-1.5 rounded-full hover:bg-stone-100 relative text-stone-600 transition-colors cursor-pointer border border-stone-100">
          <Bell className="w-5 h-5" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#9E0C25] absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse" />
        </button>

        {/* Interactive Top Bar Profile Button - Opens Full Page Profile (/admin/profile) */}
        <button
          onClick={() => router.push("/admin/profile")}
          className="flex items-center gap-3.5 pl-3 pr-4 py-2 rounded-2xl border border-stone-200/80 hover:border-[#9E0C25]/40 hover:bg-rose-50/40 transition-all cursor-pointer group shadow-2xs"
          title="Click to view My Profile & Reset Password"
        >
          <div className="relative">
            {userProfile?.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={userProfile.avatarUrl}
                alt={nameString || "User"}
                className="w-11 h-11 rounded-full object-cover border-1 border-[#9E0C25] group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#9E0C25] text-white flex items-center justify-center font-extrabold text-base border-2 border-white shadow-xs group-hover:scale-105 transition-transform">
                {initial}
              </div>
            )}
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
          </div>

          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-extrabold text-stone-900 leading-tight group-hover:text-[#9E0C25] transition-colors flex items-center gap-1.5">
              <span>{nameString}</span>
              {userProfile?.role && (
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                  {userProfile.role}
                </span>
              )}
            </h4>
            <p className="text-[10.5px] font-semibold text-stone-500 truncate max-w-[170px]">
              {userProfile?.email || ""}
            </p>
          </div>

          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#9E0C25] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

    </header>
  );
}
