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
    <header className="h-16 sm:h-[72px] bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full min-w-0">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full h-10 sm:h-11 pl-10 pr-3 sm:pr-4 rounded-full bg-stone-100/80 text-xs sm:text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9E0C25]/20 border border-stone-200/60 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
        
        <button type="button" className="p-2 rounded-full hover:bg-stone-100 relative text-stone-600 transition-colors cursor-pointer" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-[#9E0C25] absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/profile")}
          className="flex items-center gap-2.5 rounded-full sm:rounded-2xl sm:pl-1 sm:pr-3 sm:py-1 border-0 sm:border sm:border-stone-200/80 hover:bg-stone-50 transition-all cursor-pointer group"
          title="My Profile"
        >
          <div className="relative shrink-0">
            {userProfile?.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={userProfile.avatarUrl}
                alt={nameString || "User"}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#9E0C25] text-white flex items-center justify-center font-extrabold text-sm">
                {initial}
              </div>
            )}
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
          </div>

          <div className="hidden md:block text-left">
            <h4 className="text-xs font-extrabold text-stone-900 leading-tight group-hover:text-[#9E0C25] transition-colors flex items-center gap-1.5">
              <span className="truncate max-w-[140px]">{nameString}</span>
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

          <ChevronRight className="w-4 h-4 text-stone-400 hidden sm:block group-hover:text-[#9E0C25] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

    </header>
  );
}
