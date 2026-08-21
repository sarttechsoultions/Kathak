"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  User,
  Video,
  PlaySquare,
  FileText,
  Upload,
  Calendar,
  TrendingUp,
  Award,
  CreditCard,
  MessageSquare,
  Sparkles,
  FileCheck,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const sidebarMenuItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutGrid },
  { label: "Profile", href: "/student/profile", icon: User },
  { label: "Live Classes", href: "/student/classes", icon: Video },
  { label: "Recorded Classes", href: "/student/recorded-classes", icon: PlaySquare },
  { label: "Assignments", href: "/student/assignments", icon: FileText },
  { label: "Video Submission", href: "/student/video-submission", icon: Upload },
  { label: "Attendance", href: "/student/attendance", icon: Calendar },
  { label: "Progress", href: "/student/progress", icon: TrendingUp },
  { label: "Certificates", href: "/student/certificates", icon: Award },
  { label: "Fee Management", href: "/student/finance", icon: CreditCard },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Events & Workshops", href: "/student/events", icon: Sparkles },
  { label: "Exam", href: "/student/exam", icon: FileCheck },
  { label: "Settings", href: "/student/settings", icon: Settings },
  { label: "Support", href: "/student/support", icon: HelpCircle },
];

type AuthMeResponse = {
  data: {
    user?: {
      fullName?: string;
      name?: string;
      email?: string;
      studentId?: string;
      avatarUrl?: string;
      role?: string;
      [key: string]: unknown;
    };
    profile?: {
      fullName?: string;
      name?: string;
      email?: string;
      studentId?: string;
      avatarUrl?: string;
      role?: string;
      [key: string]: unknown;
    };
  };
};

function clearAllStudentTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("kathak_student_token");
  localStorage.removeItem("kathak_token");
  localStorage.removeItem("kathak_student_user");
  localStorage.removeItem("kathak_session_user");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentUser, setStudentUser] = useState<{
    fullName?: string;
    name?: string;
    email?: string;
    studentId?: string;
    avatarUrl?: string;
  } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Auth guard + user load
useEffect(() => {
  let cancelled = false;

  const checkAuth = async () => {
    // Login / enroll pages → guard skip
    if (pathname === "/student/login" || pathname === "/student/enroll") {
      if (!cancelled) setAuthChecked(true);
      return;
    }

    // Local user load
    const studentSaved = localStorage.getItem("kathak_student_user") || localStorage.getItem("kathak_session_user");
    let currentUser: any = null;
    if (studentSaved) {
      try {
        currentUser = JSON.parse(studentSaved);
        if (currentUser && (currentUser.role === "STUDENT" || !currentUser.role)) {
          if (!cancelled) setStudentUser(currentUser);
        }
      } catch {}
    }

    // Fresh profile fetch via HttpOnly cookie
    try {
      const { apiRequest, ENDPOINTS } = await import("@/lib/api");
      const res = await apiRequest<AuthMeResponse>(ENDPOINTS.AUTH_ME);
      const u = res.data?.user || res.data?.profile;
      if (u && !cancelled) {
        setStudentUser(u);
        localStorage.setItem("kathak_student_user", JSON.stringify(u));
      } else if (!u && !currentUser) {
        clearAllStudentTokens();
        router.replace("/login");
        return;
      }
    } catch {
      if (!currentUser) {
        clearAllStudentTokens();
        router.replace("/login");
        return;
      }
    }

    if (!cancelled) setAuthChecked(true);
  };

  checkAuth();

  return () => {
    cancelled = true;
  };
}, [pathname, router]);

  const displayName = studentUser?.fullName || studentUser?.name || "Student";
  const studentIdDisplay = studentUser?.studentId
    ? `#${studentUser.studentId}`
    : studentUser?.email
    ? studentUser.email
    : "#DNC2025";
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "ST";

  // Login / enroll pe sidebar mat dikhao
  if (pathname === "/student/login" || pathname === "/student/enroll") {
    return <>{children}</>;
  }

  // Auth check complete hone tak blank (optional loader)
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-2 border-[#900C27] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("kathak_student_token");

    try {
      // Backend logout call (token revoke + cookie clear)
      if (token) {
        const { apiRequest, ENDPOINTS } = await import("@/lib/api");
        const logoutEndpoint =
          (ENDPOINTS as Record<string, string>).STUDENT_LOGOUT ||
          ENDPOINTS.AUTH_LOGOUT ||
          "/api/v1/student/logout";
        await apiRequest(logoutEndpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {
          // fallback to auth logout
          return apiRequest("/api/v1/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        });
      }
    } catch {
      // ignore network errors – local clear still hoga
    }

    clearAllStudentTokens();
    router.push("/student/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1B1B24] flex selection:bg-[#900C27] selection:text-white font-sans">
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-stone-900/40 lg:hidden print:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white border-r border-stone-200 flex flex-col justify-between transition-all duration-300 print:hidden ${
          collapsed ? "w-20" : "w-[250px]"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full overflow-y-auto px-4 py-5 scrollbar-thin">
          <div className="flex items-center justify-between mb-6 px-1">
            <Link href="/student/dashboard" className="flex items-center gap-2 overflow-hidden" onClick={() => setMobileMenuOpen(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Kathak by Harshita"
                className="h-12 max-h-[56px] w-auto ml-2 object-contain shrink-0"
              />
            </Link>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="space-y-1.5 flex-1">
            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/student/dashboard" && pathname === "/student");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#9B3434] text-white shadow-md shadow-rose-950/20"
                      : "text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 font-medium"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-stone-600"}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-medium text-stone-700 hover:text-[#900C27] hover:bg-rose-50 transition-all cursor-pointer text-left mt-2"
              title={collapsed ? "Log Out" : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0 text-stone-600" />
              {!collapsed && <span>Log Out</span>}
            </button>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 h-16 sm:h-[72px] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 print:hidden">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/student/dashboard" className="lg:hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Kathak by Harshita" className="h-8 w-auto object-contain" />
            </Link>

            <div className="relative hidden sm:block w-full min-w-0">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                placeholder="Search lessons, progress, or teachers..."
                className="w-full h-10 sm:h-11 bg-[#F5F5F7] border border-stone-200/80 focus:border-[#900C27] focus:bg-white rounded-full pl-10 pr-4 text-xs sm:text-sm text-[#1B1B24] placeholder-stone-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/student/notifications"
              className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#900C27]" />
            </Link>

            <Link
              href="/student/profile"
              className="flex items-center gap-2.5 rounded-full sm:rounded-2xl sm:pl-2 sm:pr-3 sm:py-1 hover:bg-stone-50 transition-colors"
              title="My profile"
            >
              <div className="text-right hidden md:block">
                <span className="font-semibold text-sm text-[#1B1B24] block leading-tight">
                  {displayName}
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Student ID: {studentIdDisplay}
                </span>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#900C27] flex items-center justify-center font-bold text-white text-sm shadow-sm overflow-hidden shrink-0">
                {studentUser?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={studentUser.avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
                <span>{initials}</span>
              </div>
            </Link>
          </div>
        </header>

        <main className={`flex-1 w-full mx-auto ${pathname.includes("/classes/room") ? "p-3 sm:p-4 lg:p-6 max-w-[1600px]" : "p-4 sm:p-6 lg:p-10 max-w-[1400px]"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}