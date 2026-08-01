"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, LogIn, Eye, EyeOff } from "lucide-react";

import { apiRequest, ENDPOINTS } from "@/lib/api";

// Font stacks matching Figma spec — same as Enroll page
const fontJakarta = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const fontInter = { fontFamily: "'Inter', sans-serif" };

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await apiRequest(ENDPOINTS.AUTH_LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.data?.token) {
        localStorage.setItem("kathak_token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("kathak_student_user", JSON.stringify(res.data.user));
        }
        router.push("/student/dashboard");
      } else {
        setError("Invalid email or password. Please check your credentials or complete enrollment first.");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Invalid credentials. Only registered students who have completed enrollment can log in.";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Figma Frame: Fill #FFFFFF, Corner radius 0
    <div className="min-h-screen relative bg-white text-stone-900 flex flex-col justify-between selection:bg-[#C10F3A] selection:text-white overflow-x-hidden">

      {/* Background Image Layer with Translucent Vignette — matches Enroll page */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/adminlogin.png"
          alt="Kathak Feet Background"
          className="w-full h-full object-cover object-center filter grayscale opacity-90 scale-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/50" />
      </div>

      {/* Main Container — Figma card: max-w 480px, padding 40px, gap ~32px */}
      <div className="relative z-10 w-full max-w-[480px] mx-auto px-4 flex-1 flex flex-col justify-center">

        {/* LOGIN CARD — Figma: Fill #FFFFFF 70%, Stroke #FFFFFF 40%, corner radius 12 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-md rounded-xl p-10 shadow-sm border border-white/40 space-y-8"
        >
          {/* Logo + Subtitle */}
          <div className="text-center space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Kathak by Harshita" className="h-16 mx-auto object-contain" />
            <p
              className="text-xs font-semibold tracking-widest uppercase text-stone-500"
              style={fontInter}
            >
              Student Portal Access
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Student ID / Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Student ID / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter your student ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-stone-200 focus:border-[#C10F3A] rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-[#C10F3A] focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="/student/forgot-password"
                className="text-[#C10F3A] font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit Button — Figma: "Sign In to Portal" */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C10F3A] hover:bg-[#A01830] text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>{isSubmitting ? "Signing In..." : "Sign In to Portal"}</span>
            {!isSubmitting && <LogIn className="w-4 h-4" />}
          </button>

          {/* Enroll Now Link */}
          <p className="text-center text-xs text-stone-500">
            Don&apos;t have an account?{" "}
            <Link href="/student/enroll" className="text-[#C10F3A] font-semibold hover:underline">
              Enroll Now 
            </Link>
          </p>
        </form>
      </div>

      {/* Page Footer */}
      <footer className="relative z-10 text-center py-4 text-stone-500 text-xs">
        © {new Date().getFullYear()} Kathak by Harshita. All rights reserved.
      </footer>
    </div>
  );
}