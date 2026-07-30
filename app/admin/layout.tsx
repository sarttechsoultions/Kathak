"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";
import { AuthSessionUser, canAccessRoute, getDefaultAccessibleRoute } from "@/lib/permissions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 1. Persistent Session & Token Expiration Check
  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem("kathak_admin_token");
    const tokenExpiry = localStorage.getItem("kathak_admin_token_expiry");
    const savedUser = localStorage.getItem("kathak_session_user");

    // Check if token exists and is valid
    if (token) {
      if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
        // Expired -> Clean and redirect to login
        localStorage.removeItem("kathak_admin_token");
        localStorage.removeItem("kathak_admin_token_expiry");
        localStorage.removeItem("kathak_session_user");
        document.cookie = "kathak_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsAuthenticated(false);
        router.replace("/admin/login");
      } else {
        try {
          const user = savedUser ? (JSON.parse(savedUser) as AuthSessionUser) : null;
          if (!canAccessRoute(user, pathname)) {
            const destination = getDefaultAccessibleRoute(user);
            if (destination) {
              router.replace(destination);
              setIsAuthenticated(true);
              return;
            }
            localStorage.removeItem("kathak_admin_token");
            localStorage.removeItem("kathak_admin_token_expiry");
            localStorage.removeItem("kathak_session_user");
            document.cookie = "kathak_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            router.replace("/admin/login");
            setIsAuthenticated(false);
            return;
          }
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem("kathak_session_user");
          router.replace("/admin/login");
          setIsAuthenticated(false);
        }
      }
    } else {
      // No token -> Block access & redirect to login
      setIsAuthenticated(false);
      router.replace("/admin/login");
    }
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
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
