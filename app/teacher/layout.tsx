"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import TeacherHeader from "@/components/teacher/TeacherHeader";
import { Loader2 } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Instant optimistic check using saved user session if available
    const savedUserStr = localStorage.getItem("kathak_teacher_user") || localStorage.getItem("kathak_session_user");
    let currentUser: any = null;
    
    if (savedUserStr) {
      try {
        currentUser = JSON.parse(savedUserStr);
        if (currentUser && (currentUser.role === "TEACHER" || currentUser.role === "ADMIN")) {
          // Optimistically show UI
          setTimeout(() => { if (isMounted) setIsAuthenticated(true); }, 0);
        }
      } catch {
        currentUser = null;
      }
    }

    // 2. Validate session directly against API (HttpOnly Cookie aware)
    async function verifyAuthWithApi() {
      try {
        const res = await apiRequest<{ data?: { user?: any, profile?: any } }>(ENDPOINTS.AUTH_ME);
        const user = res.data?.user || res.data?.profile;

        if (user && isMounted) {
          if (user.role === "TEACHER" || user.role === "ADMIN") {
            localStorage.setItem("kathak_teacher_user", JSON.stringify(user));
            localStorage.setItem("kathak_session_user", JSON.stringify(user));
            setIsAuthenticated(true);
          } else {
            // Not a teacher or admin, clear and redirect
            localStorage.removeItem("kathak_teacher_user");
            setIsAuthenticated(false);
            router.replace("/login");
          }
        } else if (!user && !currentUser && isMounted) {
          setIsAuthenticated(false);
          router.replace("/login");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("API Auth check:", msg);
        // If explicitly Unauthorized (401 / 403) from API, clear session and redirect
        if (msg.includes("401") || msg.includes("403") || msg.includes("Unauthorized") || msg.includes("expired") || !currentUser) {
          localStorage.removeItem("kathak_teacher_user");
          localStorage.removeItem("kathak_session_user");
          if (isMounted) {
            setIsAuthenticated(false);
            router.replace("/login");
          }
        }
      }
    }

    verifyAuthWithApi();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-white text-stone-900 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#900C27] animate-spin" />
        <p className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
          Loading Teacher Portal...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-[#F8FAFC] font-sans flex text-stone-800 relative overflow-hidden">
      {/* Teacher Sidebar */}
      <TeacherSidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Teacher Content Area */}
      <main className="flex-1 h-screen flex flex-col min-w-0 overflow-y-auto w-full">
        <TeacherHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
