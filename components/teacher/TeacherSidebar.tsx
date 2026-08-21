"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Layers,
  Video,
  FileText,
  Film,
  CalendarCheck,
  FileSpreadsheet,
  TrendingUp,
  MessageSquare,
  Award,
  Settings,
  HelpCircle,
  LogOut,
  X
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const teacherSidebarItems: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/teacher/dashboard" },
  // { label: "Profile", icon: User, href: "/teacher/profile" },
  { label: "My Batches", icon: Layers, href: "/teacher/batches" },
  { label: "Live Classes", icon: Video, href: "/teacher/live-classes" },
  { label: "Assignments", icon: FileText, href: "/teacher/assignments" },
  { label: "Video", icon: Film, href: "/teacher/video" },
  { label: "Attendance", icon: CalendarCheck, href: "/teacher/attendance" },
  { label: "Exam", icon: FileSpreadsheet, href: "/teacher/exam" },
  { label: "Progress", icon: TrendingUp, href: "/teacher/progress" },
  // { label: "Communication", icon: MessageSquare, href: "/teacher/communication" },
  // { label: "Certificates", icon: Award, href: "/teacher/certificates" },
  { label: "Settings", icon: Settings, href: "/teacher/settings" },
  { label: "Support", icon: HelpCircle, href: "/teacher/support" },
];

interface TeacherSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function TeacherSidebar({ isMobileOpen = false, onCloseMobile }: TeacherSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

const handleLogout = async () => {
    try {
      await apiRequest(ENDPOINTS.AUTH_LOGOUT, { method: "POST" });
    } catch (err) {
      console.log("Logout API call handled");
    } finally {
      // 1. Clear Local Storage (Saari relevant keys)
      localStorage.removeItem("token");
      localStorage.removeItem("kathak_token");
      localStorage.removeItem("kathak_teacher_token");
      localStorage.removeItem("kathak_teacher_user");
      localStorage.removeItem("kathak_session_user");
      localStorage.removeItem("kathak_admin_token");
      localStorage.removeItem("kathak_admin_user");

      // 2. Clear Session Storage
      sessionStorage.removeItem("kathak_teacher_token");
      sessionStorage.removeItem("token");

      // 3. Clear Cookies (Ye sabse important hai Next.js ke liye)
      document.cookie = "kathak_teacher_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // 4. Redirect to Home/Login
      router.push("/");
    }
  };

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sticky Fixed Logo Header */}
      <div className="shrink-0 pb-4 pt-1 px-2 flex items-center justify-between border-b border-stone-100/80 bg-white z-10">
        <Link href="/teacher/dashboard" onClick={handleNavClick} className="mx-auto">
          <Image
            src="/logo.png"
            alt="Kathak by Harshita Logo"
            width={180}
            height={70}
            className="h-15 w-auto object-contain mx-auto"
          />
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 lg:hidden cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Independently Scrollable Navigation Items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-2.5">
        {teacherSidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/teacher/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className={`w-full h-12 flex items-center gap-3 px-12 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#900C27] text-white shadow-sm"
                  : "bg-[#F3EFEF] text-stone-900 hover:bg-stone-200/90"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-stone-800"}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* Log Out Button */}
        <button
          onClick={() => {
            handleLogout();
            handleNavClick();
          }}
          className="w-full h-12 flex items-center gap-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer bg-[#F3EFEF] text-stone-900 hover:bg-rose-100 hover:text-rose-700"
        >
          <LogOut className="w-4 h-4 shrink-0 text-stone-800" />
          <span className="truncate">Log Out</span>
        </button>
      </nav>

      {/* Fixed Sidebar Footer */}
      <div className="shrink-0 pt-3 border-t border-stone-200 text-center bg-white">
        <p className="text-[11px] font-semibold text-stone-400">
          Faculty Portal v1.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[275px] shrink-0 bg-white border-r border-stone-200/80 sticky top-0 h-screen p-4 overflow-hidden z-40">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[280px] max-w-[85vw] bg-white h-full p-4 overflow-hidden shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
