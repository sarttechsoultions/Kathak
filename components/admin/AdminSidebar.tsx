"use client";

import React, { useState, useEffect } from "react";
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
  { label: "Exam Results", icon: Award, href: "/admin/exam-results" },
  { label: "Attendance", icon: CalendarCheck, href: "/admin/attendance" },
  { label: "Events & Workshops", icon: CalendarDays, href: "/admin/events" },
  { label: "Communication", icon: MessageSquare, href: "/admin/communication" },
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
  
  // State for Website accordion expansion
  const isWebsiteRoute = pathname.startsWith("/admin/website");
  const [isWebsiteExpanded, setIsWebsiteExpanded] = useState(true);
  const [sessionUser, setSessionUser] = useState<AuthSessionUser | null>(null);

  useEffect(() => {
    if (isWebsiteRoute) {
      setIsWebsiteExpanded(true);
    }
  }, [pathname, isWebsiteRoute]);

  useEffect(() => {
    const savedUser = localStorage.getItem("kathak_session_user");
    if (savedUser) {
      try {
        setSessionUser(JSON.parse(savedUser) as AuthSessionUser);
      } catch {
        localStorage.removeItem("kathak_session_user");
      }
    }
  }, []);

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
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* Logo Header & Close Button on Mobile */}
        <div className="px-1 py-2 ml-10 flex items-center justify-between">
          <Link href="/" onClick={handleNavClick}>
            <Image
              src="/logo.png"
              alt="Kathak by Harshita Logo"
              width={160}
              height={50}
              className="h-10 sm:h-12 w-auto object-contain"
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

        {/* Navigation Items List */}
        <nav className="space-y-2">
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
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isParentActive
                        ? "bg-[#9E0C25] text-white shadow-md"
                        : "bg-[#EFEAEA] text-stone-700 hover:bg-stone-200/80 hover:text-stone-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isParentActive ? "text-white" : "text-stone-600"}`} />
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
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                              isSubActive
                                ? "bg-[#9E0C25] text-white shadow-sm"
                                : "bg-[#EFEAEA] text-stone-700 hover:bg-stone-200/80 hover:text-stone-900"
                            }`}
                          >
                            <SubIcon className={`w-4 h-4 shrink-0 ${isSubActive ? "text-white" : "text-stone-600"}`} />
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
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#9E0C25] text-white shadow-md"
                    : "bg-[#EFEAEA] text-stone-700 hover:bg-stone-200/80 hover:text-stone-900"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-stone-600"}`} />
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
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer bg-[#EFEAEA] text-stone-700 hover:bg-rose-100 hover:text-rose-700"
          >
            <LogOut className="w-4 h-4 shrink-0 text-stone-600" />
            <span className="truncate">Log Out</span>
          </button>
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className="pt-4 border-t border-stone-200 text-center">
        <p className="text-[11px] font-semibold text-stone-400">
          Kathak Management System v1.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:flex w-[305px] shrink-0 bg-white border-r border-stone-200/80 min-h-screen p-4.5 sticky top-0 h-screen overflow-y-auto z-40">
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
          <aside className="relative w-[300px] max-w-[85vw] bg-white h-full p-4.5 overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
    );
}
