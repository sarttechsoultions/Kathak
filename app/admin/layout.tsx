"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";
import { AuthSessionUser, canAccessRoute, getDefaultAccessibleRoute } from "@/lib/permissions";
import { apiRequest, ENDPOINTS } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 1. Direct API Authentication Check via GET /api/v1/auth/me
  useEffect(() => {
    if (pathname === "/admin/login") {
      const savedUserStr = localStorage.getItem("kathak_session_user");
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          if (user?.role === "ADMIN") {
            const destination = getDefaultAccessibleRoute(user) || "/admin/dashboard";
            router.replace(destination);
          }
        } catch {
          // stay on login
        }
      }
      setTimeout(() => setIsAuthenticated(true), 0);
      return;
    }

    const savedUser = localStorage.getItem("kathak_session_user");
    let isMounted = true;

    // 1. Instant optimistic check using saved user session if available
    let currentUser: AuthSessionUser | null = null;
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser) as AuthSessionUser;
      } catch {
        currentUser = null;
      }
    }

    if (currentUser && currentUser.role !== "ADMIN") {
      setTimeout(() => setIsAuthenticated(false), 0);
      router.replace(currentUser.role === "TEACHER" ? "/teacher/dashboard" : "/login");
      return;
    }

    if (currentUser && canAccessRoute(currentUser, pathname)) {
      // Avoid calling setState synchronously within the effect to prevent cascading renders
      setTimeout(() => setIsAuthenticated(true), 0);
    } else if (currentUser && !canAccessRoute(currentUser, pathname)) {
      const destination = getDefaultAccessibleRoute(currentUser);
      router.replace(destination || "/admin/login");
    }

    // 2. Validate session directly against PostgreSQL Database via GET /api/v1/auth/me API (HttpOnly Cookie)
    async function verifyAuthWithApi() {
      try {
        const res = await apiRequest<{ data?: { user?: AuthSessionUser } }>(ENDPOINTS.AUTH_ME);
        const user = res.data?.user as AuthSessionUser | undefined;

        if (user && isMounted) {
          if (user.role !== "ADMIN") {
            setIsAuthenticated(false);
            router.replace(user.role === "TEACHER" ? "/teacher/dashboard" : "/login");
            return;
          }
          localStorage.setItem("kathak_session_user", JSON.stringify(user));
          if (canAccessRoute(user, pathname)) {
            setIsAuthenticated(true);
          } else {
            const destination = getDefaultAccessibleRoute(user);
            router.replace(destination || "/admin/login");
          }
        } else if (!user && !currentUser && isMounted) {
          setIsAuthenticated(false);
          router.replace("/admin/login");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("API Auth check:", msg);
        // If explicitly Unauthorized (401 / 403) from API, clear session and redirect
        if (msg.includes("401") || msg.includes("403") || msg.includes("Unauthorized") || msg.includes("expired") || !currentUser) {
          localStorage.removeItem("kathak_session_user");
          if (isMounted) {
            setIsAuthenticated(false);
            router.replace("/admin/login");
          }
        }
      }
    }

    verifyAuthWithApi();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // 2. Direct Step-by-Step Back Button Handling
  useEffect(() => {
    if (pathname === "/admin/login") return;

    const handlePopState = (e: PopStateEvent) => {
      if (pathname === "/admin/dashboard") {
        e.preventDefault();
        router.push("/");
      } else if (pathname.startsWith("/admin/") && pathname !== "/admin/dashboard") {
        e.preventDefault();
        router.push("/admin/dashboard");
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname, router]);

  // Do not render Admin Sidebar/Header on Login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading spinner while verifying security credentials
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-stone-900 text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#9E0C25] animate-spin" />
        <p className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  // If not authenticated, prevent flash of admin layout before redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-stone-900 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#9E0C25] animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#F8FAFC] font-sans flex text-stone-800 relative overflow-hidden">
      {/* Fixed Independent Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Independently Scrollable Main Content Area */}
      <main className="flex-1 h-screen flex flex-col min-w-0 overflow-y-auto w-full">
        <AdminHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className={`mx-auto w-full flex-1 ${pathname.includes("/class-management/room") ? "p-3 sm:p-4 lg:p-6 max-w-[1600px]" : "p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px]"}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
