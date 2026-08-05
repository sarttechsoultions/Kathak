"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import TeacherHeader from "@/components/teacher/TeacherHeader";
import { Loader2 } from "lucide-react";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token =
      localStorage.getItem("kathak_teacher_token") ||
      localStorage.getItem("kathak_admin_token") ||
      localStorage.getItem("kathak_token");

    if (!token) {
      setIsAuthenticated(false);
      router.replace("/login");
      return;
    }

    setIsAuthenticated(true);
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
