"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { persistAuthSession } from "@/lib/auth";
import { getDefaultAccessibleRoute } from "@/lib/permissions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("kathak_admin_token");
  //   const savedUserStr = localStorage.getItem("kathak_session_user");
  //   if (token && savedUserStr) {
  //     try {
  //       const user = JSON.parse(savedUserStr);
  //       const destination = getDefaultAccessibleRoute(user) || "/admin/class-management";
  //       router.replace(destination);
  //     } catch {
  //       router.replace("/admin/dashboard");
  //     }
  //   }
  // }, [router]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await apiRequest<{
        status: string;
        message?: string;
        data?: {
          token?: string;
          user?: {
            id: string;
            role: "ADMIN" | "TEACHER" | "STUDENT";
            permissions: string[];
            fullName?: string;
            email?: string;
          };
        };
      }>(ENDPOINTS.AUTH_LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const user = res?.data?.user;
      const token = res?.data?.token;

      if (user || res?.status === "success") {
        const role = user?.role || "ADMIN";

        if (role !== "ADMIN") {
          setErrorMessage(
            role === "TEACHER"
              ? "Teacher accounts cannot access the admin terminal. Please use Teacher Login."
              : "Student accounts cannot access the admin terminal. Please use Student Login."
          );
          return;
        }

        persistAuthSession({
          role: "ADMIN",
          token,
          user: user || { role: "ADMIN", email },
          rememberMe,
        });

        router.replace(
          getDefaultAccessibleRoute(user || { role: "ADMIN", permissions: [] }) ||
            "/admin/dashboard"
        );
      } else {
        setErrorMessage(res?.message || "Invalid credentials or unauthorized access.");
      }
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      setErrorMessage(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-stone-100 text-stone-800 font-sans overflow-y-auto">
      {/* Background Image Layer with Transparent White Overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/adminlogin.png"
          alt="Kathak Admin Login Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Soft Transparent White Overlay */}
        <div className="absolute inset-0 bg-white/0.5 backdrop-blur-[3px] z-10" />
      </div>

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center flex-1">
        
        {/* Top Branding Section: Logo & Subtitle */}
        <div className="flex flex-col items-center space-y-2 mb-6 text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Kathak by Harshita Logo"
              width={200}
              height={70}
              className="h-14 sm:h-18 w-auto object-contain drop-shadow-md"
            />
          </Link>
          <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-stone-700 uppercase drop-shadow-xs">
            Education Management System Terminal
          </span>
        </div>

        {/* Floating White Login Card */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-100/90 space-y-6 sm:space-y-7">
          
          {/* Card Header */}
          <div className="space-y-1">
            <h1 className="font-inter font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Administrative Access
            </h1>
            <p className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[1.5px] text-stone-400">
              VERIFY CREDENTIALS TO PROCEED
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input 1: Administrator Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                ADMINISTRATOR EMAIL
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="admin@kathakbyharshita.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#C10F3A] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Input 2: Secure Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  SECURE PASSWORD
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Please contact system administrator to reset password.");
                  }}
                  className="text-[11px] font-bold text-[#C10F3A] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-11 rounded-xl bg-stone-50 border border-stone-200 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#C10F3A] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-[#C10F3A] focus:ring-[#C10F3A] accent-[#C10F3A] cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs font-medium text-stone-600 cursor-pointer">
                Remember this terminal for 30 days
              </label>
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-[#C10F3A] hover:bg-[#A01830] text-white font-inter font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{isLoading ? "Authenticating..." : "Sign In To Terminal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* Security Banner Badge */}
          <div className="bg-[#FDF2F4] border border-[#FAD0D6] rounded-xl py-2.5 px-3 text-center flex items-center justify-center gap-2 text-[#C10F3A]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider">
              SECURE ENCRYPTED ENDPOINT : 256-BIT AES
            </span>
          </div>

        </div>

        {/* Footer Info Links */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-stone-600">
            <a href="#status" className="hover:text-stone-900 transition-colors">System Status</a>
            <span>•</span>
            <a href="#support" className="hover:text-stone-900 transition-colors">Support Portal</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-stone-900 transition-colors">Privacy Protocol</a>
          </div>
          <p className="text-[11px] font-medium text-stone-500">
            © 2024 Kathak by Harshita. Authorized personnel only.
          </p>
        </div>

      </div>
    </div>
  );
}
