"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Users,
  Edit,
  MoreHorizontal,
  GraduationCap,
  TrendingUp,
  ShieldAlert,
  Save,
  Lock,
  Trash2
} from "lucide-react";

export default function StudentProfilePage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* 1. TOP PROFILE BANNER CARD */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        
        {/* Top Banner Image (using /student/Background.png) */}
        <div className="h-32 sm:h-40 w-full relative overflow-hidden bg-[#800020]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/student/Background.png"
            alt="Profile Banner Background"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback to upper case Background.png or background.png
              const target = e.target as HTMLImageElement;
              if (target.src.includes("Background.png")) {
                target.src = "/student/background.png";
              }
            }}
          />
        </div>

        {/* Profile Details Header Row */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 sm:-mt-14 relative z-10 text-center sm:text-left">
            {/* Avatar Photo with White Border */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-stone-100 shadow-md overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Ananya.png"
                alt="Rahul Sharma Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            {/* Name & Subtext */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1B24]">
                Rahul Sharma
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-stone-500 font-medium">
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md">
                  🎓 Intermediate Level
                </span>
                <span>📅 Joined August 2024</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-3 shrink-0">
            <button className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer">
              <Edit className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>
            <button className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 2. MAIN 2-COLUMN GRID (Personal/Contact | Academic/Guardians) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (6 cols): Personal Information & Contact Details */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* CARD 1: PERSONAL INFORMATION */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <User className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">FULL NAME</span>
                <span className="font-semibold text-[#1B1B24]">Rahul Sharma</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">DATE OF BIRTH</span>
                <span className="font-semibold text-[#1B1B24]">12th May 2002</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">GENDER</span>
                <span className="font-semibold text-[#1B1B24]">Male</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">BATCH</span>
                <span className="font-semibold text-[#1B1B24]">Kathak Basics - B1</span>
              </div>
            </div>
          </div>

          {/* CARD 2: CONTACT DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Mail className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
                Contact Details
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">PHONE NUMBER</span>
                  <span className="font-semibold text-[#1B1B24]">+91 98765 43210</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">EMAIL ADDRESS</span>
                  <span className="font-semibold text-[#1B1B24] break-all">rahul.sharma@danceacademy.com</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">RESIDENTIAL ADDRESS</span>
                <span className="font-semibold text-[#1B1B24] block pt-0.5">
                  Flat 402, Royal Residency, Sector 15, Vashi, Navi Mumbai - 400703
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (6 cols): Academic Profile & Guardians */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* CARD 1: ACADEMIC PROFILE */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <BookOpen className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
                Academic Profile
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">COURSE NAME</span>
                <span className="font-semibold text-[#1B1B24]">Kathak Foundations</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">CURRENT LEVEL</span>
                <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-bold text-[10px] mt-0.5">
                  Intermediate
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">BATCH TIMING</span>
                <span className="font-semibold text-[#1B1B24]">Tue & Thu | 06:00 PM</span>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">ASSIGNED GURU</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="font-semibold text-[#1B1B24]">Guru Meenakshi</span>
                  <div className="w-4 h-4 rounded-full bg-stone-300 overflow-hidden shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: GUARDIANS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Users className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
                Guardians
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">FATHER</span>
                  <span className="font-semibold text-[#1B1B24]">Mr. Suresh Sharma</span>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">MOTHER</span>
                  <span className="font-semibold text-[#1B1B24]">Mrs. Sunita Sharma</span>
                </div>
              </div>

              <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                <span className="text-[10px] text-[#900C27] font-bold uppercase block">EMERGENCY CONTACT</span>
                <span className="font-bold text-[#900C27] text-sm">+91 91234 56789</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. PERFORMANCE & FINANCIAL SUMMARY CARD */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <TrendingUp className="w-4 h-4 text-[#900C27]" />
          <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
            Performance & Financial Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1 text-xs">
          
          {/* Attendance */}
          <div className="space-y-2">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">ATTENDANCE</span>
            <span className="text-2xl font-extrabold text-[#1B1B24]">92%</span>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#900C27] h-full rounded-full" style={{ width: "92%" }} />
            </div>
          </div>

          {/* Assignments */}
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">ASSIGNMENTS</span>
            <span className="text-2xl font-extrabold text-[#1B1B24]">14 / 16</span>
            <span className="text-[11px] text-stone-500 block font-medium">87.5% Completion Rate</span>
          </div>

          {/* Financial Summary */}
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">FINANCIAL SUMMARY</span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block">Total Fee</span>
                <span className="text-lg font-bold text-[#1B1B24]">₹12,000</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold block">Pending</span>
                <span className="text-lg font-bold text-[#900C27]">₹2,000</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. ACADEMIC PERFORMANCE CARD */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <GraduationCap className="w-4 h-4 text-[#900C27]" />
          <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
            Academic Performance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          
          {/* Column 1: Assignment Scoring */}
          <div className="space-y-3">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">ASSIGNMENT SCORING</span>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-800">Hand Movement Practice</span>
                <span className="font-bold text-[#1B1B24]">18/20</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-800">Footwork Basics (Tatkar)</span>
                <span className="font-bold text-[#1B1B24]">15/20</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50">
                <span className="font-semibold text-stone-800">Expression (Abhinaya) Intro</span>
                <span className="font-bold text-[#1B1B24]">19/20</span>
              </div>
            </div>
          </div>

          {/* Column 2: Assessment / Test Results */}
          <div className="space-y-3">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">ASSESSMENT / TEST RESULTS</span>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50">
                <div>
                  <span className="font-semibold text-stone-800 block">Monthly Kathak Theory</span>
                  <span className="text-[10px] text-stone-400">12th Jul 2024</span>
                </div>
                <span className="font-bold text-rose-600">45/50</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-stone-50">
                <div>
                  <span className="font-semibold text-stone-800 block">Quarterly Practical Exam</span>
                  <span className="text-[10px] text-stone-400">21st Sept 2024</span>
                </div>
                <span className="font-bold text-rose-600">88/100</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. ACCOUNT PREFERENCES CARD */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <User className="w-4 h-4 text-[#900C27]" />
          <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
            Account Preferences
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-800 block">Email Notifications</span>
              <span className="text-[10px] text-stone-400">Announcements & Assignments</span>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                emailNotifs ? "bg-[#900C27]" : "bg-stone-300"
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emailNotifs ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-800 block">SMS Alerts</span>
              <span className="text-[10px] text-stone-400">Class timings & cancellations</span>
            </div>
            <button
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                smsAlerts ? "bg-[#900C27]" : "bg-stone-300"
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${smsAlerts ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-800 block">Profile Visibility</span>
              <span className="text-[10px] text-stone-400">Visible to other students</span>
            </div>
            <button
              onClick={() => setProfileVisibility(!profileVisibility)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                profileVisibility ? "bg-[#900C27]" : "bg-stone-300"
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${profileVisibility ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

        </div>
      </div>

      {/* 6. BOTTOM ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-[#900C27] hover:bg-[#780A20] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Save Changes
          </button>
          <button className="border border-[#900C27] text-[#900C27] hover:bg-rose-50 px-6 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer">
            Change Password
          </button>
        </div>

        <button className="text-rose-600 hover:underline font-bold text-xs cursor-pointer">
          Deactivate Account
        </button>
      </div>

      {savedMsg && (
        <div className="fixed bottom-6 right-6 bg-[#900C27] text-white px-5 py-3 rounded-xl text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-50">
          ✓ Profile Changes Saved Successfully!
        </div>
      )}

    </div>
  );
}
