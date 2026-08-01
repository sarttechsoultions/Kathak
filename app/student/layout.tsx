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
  X
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
  { label: "Communication", href: "/student/communication", icon: MessageSquare },
  { label: "Events & Workshops", href: "/student/events", icon: Sparkles },
  { label: "Exam", href: "/student/exam", icon: FileCheck },
  { label: "Settings", href: "/student/settings", icon: Settings },
  { label: "Support", href: "/student/support", icon: HelpCircle },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentUser, setStudentUser] = useState<{ fullName?: string; name?: string; email?: string; studentId?: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const studentSaved = localStorage.getItem("kathak_student_user");
    if (studentSaved) {
      try {
        const parsed = JSON.parse(studentSaved);
        if (parsed && (parsed.role === "STUDENT" || !parsed.role)) {
          setStudentUser(parsed);
        }
      } catch {}
    } else {
      const sessionSaved = localStorage.getItem("kathak_session_user");
      if (sessionSaved) {
        try {
          const parsed = JSON.parse(sessionSaved);
          if (parsed && parsed.role === "STUDENT") {
            setStudentUser(parsed);
          }
        } catch {}
      }
    }

    const studentToken = localStorage.getItem("kathak_student_token");
    if (studentToken) {
      import("@/lib/api").then(({ apiRequest, ENDPOINTS }) => {
        apiRequest<{ data: { user?: any; profile?: any } }>(ENDPOINTS.AUTH_ME, {
          headers: { Authorization: `Bearer ${studentToken}` }
        })
          .then((res) => {
            const u = res.data?.user || res.data?.profile;
            if (u) {
              setStudentUser(u);
              localStorage.setItem("kathak_student_user", JSON.stringify(u));
            }
          })
          .catch(() => {});
      });
    }
  }, []);

  const displayName = studentUser?.fullName || studentUser?.name || "Student";
  const studentIdDisplay = studentUser?.studentId ? `#${studentUser.studentId}` : studentUser?.email ? studentUser.email : "#DNC2025";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "ST";

  // If on login or enroll full-screen pages, render children directly without sidebar
  if (pathname === "/student/login" || pathname === "/student/enroll") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("kathak_student_user");
    localStorage.removeItem("kathak_session_user");
    router.push("/student/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1B1B24] flex selection:bg-[#900C27] selection:text-white font-sans">
      
      {/* MOBILE TOP NAVIGATION BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-stone-100 text-stone-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Kathak Logo" className="h-8 w-auto object-contain" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#900C27] text-white font-bold flex items-center justify-center text-xs">
            {initials}
          </div>
        </div>
      </div>

      {/* FIGMA SIDEBAR (W: 250px, Background: White #FFFFFF, Border: #E5E7EB) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white border-r border-stone-200 flex flex-col justify-between transition-all duration-300 ${
          collapsed ? "w-20" : "w-[250px]"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full overflow-y-auto px-4 py-5 scrollbar-thin">
          
          {/* Logo & Collapse Header */}
          <div className="flex items-center justify-between mb-6 px-1">
            <Link href="/student/dashboard" className="flex items-center gap-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Kathak by Harshita"
                className="h-30 max-h-[64px] w-auto ml-5 object-contain shrink-0"
              />
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Menu List */}
          <nav className="space-y-1.5 flex-1">
            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/student/dashboard" && pathname === "/student");

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

            {/* Logout Button */}
            <button
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

      {/* MAIN LAYOUT WRAPPER (Top Header + Page Content) */}
      <div className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
        
        {/* FIGMA TOP HEADER (Search bar + Bell + Student Profile Badge) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 lg:px-10 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left Search Bar (Pill with soft background) */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search lessons, progress, or teachers..."
                className="w-full bg-[#F5F5F7] border border-stone-200/80 focus:border-[#900C27] focus:bg-white rounded-full pl-11 pr-4 py-2.5 text-xs sm:text-sm text-[#1B1B24] placeholder-stone-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Notifications & Student Profile */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#900C27]" />
            </button>

            {/* Student Profile Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="font-semibold text-sm text-[#1B1B24] block leading-tight">
                  {displayName}
                </span>
                <span className="text-[11px] text-stone-500 font-sans block">
                  Student ID: {studentIdDisplay}
                </span>
              </div>

              {/* Student Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#900C27] to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-sm overflow-hidden shrink-0">
                {studentUser?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={studentUser.avatarUrl}
                    alt={`${displayName} Avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : null}
                <span>{initials}</span>
              </div>
            </div>

          </div>

        </header>

        {/* MAIN PAGE CONTAINER */}
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
