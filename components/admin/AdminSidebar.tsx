"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Layers,
  FileText,
  Video,
  Film,
  Eye,
  FileSpreadsheet,
  Award,
  CalendarCheck,
  CalendarDays,
  MessageSquare,
  FolderKanban,
  CreditCard,
  Globe,
  BarChart3,
  FileCheck,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Layout,
  X
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { AuthSessionUser, canAccessRoute } from "@/lib/permissions";

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  href: string;
  hasSubItems?: boolean;
  subItems?: { label: string; href: string; icon: React.ElementType }[];
}

const websiteSubItems = [
  { label: "Hero Video", href: "/admin/website/hero-video", icon: Layout },
  { label: "Gallery", href: "/admin/website/gallery", icon: Layout },
  { label: "Banner", href: "/admin/website/banner", icon: Layout },
  { label: "Blog", href: "/admin/website/blog", icon: Layout }
];

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Student", icon: Users, href: "/admin/student" },
  { label: "Teachers", icon: UserCheck, href: "/admin/teachers" },
  { label: "Course Management", icon: BookOpen, href: "/admin/courses" },
  { label: "Batch Management", icon: Layers, href: "/admin/batches" },
  { label: "Assignment Management", icon: FileText, href: "/admin/assignments" },
  { label: "Class Management", icon: Video, href: "/admin/class-management" },
  { label: "Recorded Class", icon: Film, href: "/admin/recorded-class" },
  { label: "Video Review", icon: Eye, href: "/admin/video-review" },
  { label: "Exam", icon: FileSpreadsheet, href: "/admin/exam" },
  { label: "Exam Results", icon: Award, href: "/admin/exam/results" },
  { label: "Attendance", icon: CalendarCheck, href: "/admin/attendance" },
  { label: "Events & Workshops", icon: CalendarDays, href: "/admin/events" },
  // { label: "Communication", icon: MessageSquare, href: "/admin/communication" },
  { label: "Content Library", icon: FolderKanban, href: "/admin/content-library" },
  { label: "Finance", icon: CreditCard, href: "/admin/finance" },
  {
    label: "Website",
    icon: Globe,
    href: "/admin/website",
    hasSubItems: true,
    subItems: websiteSubItems
  },
  { label: "Reports & Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Certificates", icon: FileCheck, href: "/admin/certificates" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Support", icon: HelpCircle, href: "/admin/support" },
];

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ isMobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // State for Website accordion expansion & Session User (React 19 Best Practice: Lazy initializers)
  const isWebsiteRoute = pathname.startsWith("/admin/website");
  const [isWebsiteExpanded, setIsWebsiteExpanded] = useState(() => isWebsiteRoute);

  const [sessionUser] = useState<AuthSessionUser | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("kathak_session_user");
      if (savedUser) {
        try {
          return JSON.parse(savedUser) as AuthSessionUser;
        } catch {
          localStorage.removeItem("kathak_session_user");
        }
      }
    }
    return null;
  });

  const handleLogout = async () => {
    try {
      await apiRequest(ENDPOINTS.AUTH_LOGOUT, { method: "POST" });
    } catch (err) {
      console.log("Logout API call handled");
    } finally {
      localStorage.removeItem("kathak_admin_token");
      localStorage.removeItem("kathak_admin_token_expiry");
      localStorage.removeItem("kathak_session_user");
      sessionStorage.removeItem("kathak_admin_token");
      document.cookie = "kathak_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
        <Link href="/admin/dashboard" onClick={handleNavClick} className="mx-auto">
          <Image
            src="/logo.png"
            alt="Kathak by Harshita Logo"
            width={180}
            height={70}
            className="h-15 w-auto object-contain mx-auto"
          />
        </Link>

        {/* Close button for mobile */}
        <button
          onClick={onCloseMobile}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 lg:hidden cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Independently Scrollable Navigation Items List */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-2.5">
        {sidebarItems.filter((item) => canAccessRoute(sessionUser, item.href)).map((item) => {
          const Icon = item.icon;

          if (item.hasSubItems) {
            const isParentActive = pathname === "/admin/website";

            return (
              <div key={item.label} className="space-y-2">
                {/* Website Main Accordion Trigger */}
                <button
                  onClick={() => {
                    setIsWebsiteExpanded(!isWebsiteExpanded);
                    router.push("/admin/website");
                    handleNavClick();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isParentActive
                      ? "bg-[#9E0C25] text-white shadow-md"
                      : "bg-[#F3EFEF] text-stone-900 hover:bg-stone-200/90"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isParentActive ? "text-white" : "text-stone-800"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isWebsiteExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Sub-Items */}
                {isWebsiteExpanded && item.subItems && (
                  <div className="pl-4 space-y-2 pt-0.5 animate-in fade-in duration-200">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = pathname === sub.href;

                      return (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={handleNavClick}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                            isSubActive
                              ? "bg-[#9E0C25] text-white shadow-sm"
                              : "bg-[#F3EFEF] text-stone-900 hover:bg-stone-200/90"
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? "text-white" : "text-stone-800"}`} />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href + "/") &&
              !(item.href === "/admin/exam" && pathname.startsWith("/admin/exam/results")));

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#9E0C25] text-white shadow-md"
                  : "bg-[#F3EFEF] text-stone-900 hover:bg-stone-200/90"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-stone-800"}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={() => {
            handleLogout();
            handleNavClick();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer bg-[#F3EFEF] text-stone-900 hover:bg-rose-100 hover:text-rose-700"
        >
          <LogOut className="w-4 h-4 shrink-0 text-stone-800" />
          <span className="truncate">Log Out</span>
        </button>
      </nav>

      {/* Fixed Sidebar Footer Info */}
      <div className="shrink-0 pt-3 border-t border-stone-200 text-center bg-white">
        <p className="text-[11px] font-semibold text-stone-400">
          Kathak Management System v1.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:flex w-[275px] shrink-0 bg-white border-r border-stone-200/80 sticky top-0 h-screen p-4 overflow-hidden z-40">
        {SidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-out Panel */}
          <aside className="relative w-[300px] max-w-[85vw] bg-white h-full p-4 overflow-hidden shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
