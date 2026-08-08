"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, GraduationCap, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";

const fontInter = { fontFamily: "'Inter', sans-serif" };

export default function CombinedLoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (authMode === "STUDENT") {
        const res = await apiRequest<{
          status: string;
          message?: string;
          data?: { token?: string; user?: Record<string, unknown> };
        }>("/student/login", {
          method: "POST",
          body: JSON.stringify({
            emailOrPhone: email.trim(),
            password,
            rememberMe
          })
        });

        const user = res?.data?.user;

        if (user || res?.status === "success") {
          if (user) {
            localStorage.setItem("kathak_student_user", JSON.stringify(user));
            localStorage.setItem("kathak_session_user", JSON.stringify(user));
          }
          router.replace("/student/dashboard");
        } else {
          setError(res?.message || "Invalid student credentials. Please check your email/phone and password.");
        }
      } else {
        const res = await apiRequest<{
          status: string;
          message?: string;
          data?: { token?: string; user?: Record<string, unknown> };
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            password,
            rememberMe
          })
        });

        const user = res?.data?.user;

        if (user || res?.status === "success") {
          if (user) {
            localStorage.setItem("kathak_admin_user", JSON.stringify(user));
            localStorage.setItem("kathak_teacher_user", JSON.stringify(user));
            localStorage.setItem("kathak_session_user", JSON.stringify(user));
          }
          router.replace("/teacher/dashboard");
        } else {
          setError(res?.message || "Invalid teacher credentials. Please check your teacher ID/email and password.");
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Invalid credentials. Please verify your account details.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = (mode: "STUDENT" | "TEACHER") => {
    if (mode === authMode || isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setAuthMode(mode);
      setError("");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        setIsFlipping(false);
      }, 150);
    }, 180);
  };

  return (
    <div className="min-h-screen relative bg-white text-stone-900 flex flex-col justify-between selection:bg-[#C10F3A] selection:text-white overflow-x-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/adminlogin.png"
          alt="Kathak Feet Background"
          className="w-full h-full object-cover object-center filter grayscale opacity-90 scale-125 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/50" />
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-[540px] mx-auto px-4 py-8 flex-1 flex flex-col justify-center [perspective:1200px]">
        {/* Portal Mode Selection Switcher */}
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-stone-200/80 mb-4 flex items-center gap-1">
          <button
            type="button"
            onClick={() => toggleAuthMode("STUDENT")}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider ${
              authMode === "STUDENT"
                ? "bg-[#C10F3A] text-white shadow-md scale-[1.02]"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => toggleAuthMode("TEACHER")}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider ${
              authMode === "TEACHER"
                ? "bg-[#C10F3A] text-white shadow-md scale-[1.02]"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Teacher Portal</span>
          </button>
        </div>

        {/* MAIN LOGIN CARD WITH 3D FLIP ANIMATION */}
        <div className="relative">
          <form
            onSubmit={handleSubmit}
            className={`bg-white/90 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-xl border border-white/60 space-y-6 transition-all duration-300 ease-in-out transform-gpu origin-center ${
              isFlipping
                ? "opacity-0 scale-90 [transform:rotateY(90deg)]"
                : "opacity-100 scale-100 [transform:rotateY(0deg)]"
            }`}
          >
            {/* Logo & Access Label */}
            <div className="text-center space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Kathak by Harshita" className="h-16 mx-auto object-contain" />
              <p
                className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-stone-500"
                style={fontInter}
              >
                {authMode === "STUDENT" ? "STUDENT PORTAL ACCESS" : "TEACHER PORTAL ACCESS"}
              </p>
            </div>

            {/* Heading */}
            <div className="text-center space-y-1">
              <h2 className="font-playfair font-bold text-2xl text-stone-900">
                {authMode === "STUDENT" ? "Student Access" : "Teacher Access"}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {authMode === "STUDENT"
                  ? "Please enter your credentials to access your student account."
                  : "Please enter your credentials to manage your classes."}
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl px-4 py-3 font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* ID / Email */}
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-700">
                  {authMode === "STUDENT" ? "STUDENT ID OR EMAIL" : "TEACHER ID OR EMAIL"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={authMode === "STUDENT" ? "Enter your student ID or email" : "T-8829-EMS"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:bg-white focus:border-[#C10F3A] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-700">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50/50 border border-stone-200 focus:bg-white focus:border-[#C10F3A] rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none transition-colors shadow-2xs"
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
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-600 font-semibold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 text-[#C10F3A] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>
                <Link
                  href="/student/forgot-password"
                  className="text-[#C10F3A] font-bold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C10F3A] hover:bg-[#A01830] text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? "Signing In..." : authMode === "STUDENT" ? "Student Login" : "Teacher Login"}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* New Student Enrollment / Registration Banner */}
            {authMode === "STUDENT" && (
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-center space-y-2">
                <p className="text-xs font-semibold text-stone-700">
                  Don&apos;t have a student account yet?
                </p>
                <Link
                  href="/student/enroll"
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#C10F3A] text-[#C10F3A] font-extrabold text-xs hover:bg-[#C10F3A] hover:text-white transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>New Student Registration / Enroll Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Contact Admin Note */}
            <div className="pt-1 text-center text-xs text-stone-500 flex items-center justify-center gap-1.5 font-medium">
              <span>Having trouble signing in?</span>
              <Link href="/admin/support" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact Admin</span>
              </Link>
            </div>

            {/* Mode Switcher Footer Prompt */}
            <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-500">
              {authMode === "STUDENT" ? (
                <p>
                  Are you a Teacher/Faculty?{" "}
                  <button
                    type="button"
                    onClick={() => toggleAuthMode("TEACHER")}
                    className="text-[#C10F3A] font-bold hover:underline cursor-pointer"
                  >
                    Switch to Teacher Login
                  </button>
                </p>
              ) : (
                <p>
                  Are you a Student?{" "}
                  <button
                    type="button"
                    onClick={() => toggleAuthMode("STUDENT")}
                    className="text-[#C10F3A] font-bold hover:underline cursor-pointer"
                  >
                    Switch to Student Login
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="relative z-10 text-center py-4 text-stone-500 text-xs font-semibold">
        © {new Date().getFullYear()} Kathak by Harshita. All rights reserved.
      </footer>
    </div>
  );
}
