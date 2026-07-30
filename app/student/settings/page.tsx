"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Pencil,
  Sun,
  Moon,
  Laptop,
  Lock,
  HardDrive
} from "lucide-react";

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "preferences">("account");
  
  // Form states
  const [fullName, setFullName] = useState("Rahul Sharma");
  const [studentId] = useState("NR-2025-042");
  const [email, setEmail] = useState("rahul.sharma@nritya.edu");

  // Toggles
  const [liveClassReminders, setLiveClassReminders] = useState(true);
  const [assignmentDeadlines, setAssignmentDeadlines] = useState(true);
  const [academyAnnouncements, setAcademyAnnouncements] = useState(false);

  // App Theme
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("English (US)");

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* 2-COLUMN LAYOUT (Left Profile Nav & Storage | Right Settings Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Profile Nav Card & Storage Usage (4 cols / W: ~260px) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PROFILE NAV CARD */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-6">
            
            {/* Avatar & Info */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/rahul-avatar.png"
                    alt="Rahul Sharma"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/Ananya.png";
                    }}
                  />
                </div>
                <button
                  className="w-6 h-6 rounded-full bg-[#900C27] text-white flex items-center justify-center absolute bottom-0 right-0 border-2 border-white shadow-sm cursor-pointer"
                  title="Edit Profile Picture"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1B1B24]">Rahul Sharma</h3>
                <span className="text-xs text-stone-400 font-medium">Kathak Advanced Level</span>
              </div>
            </div>

            {/* Menu List */}
            <div className="space-y-1 text-xs font-semibold">
              
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "account"
                    ? "bg-[#FDF2F4] text-[#900C27]"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span>Account Settings</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "notifications"
                    ? "bg-[#FDF2F4] text-[#900C27]"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span>Notifications</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "preferences"
                    ? "bg-[#FDF2F4] text-[#900C27]"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span>App Preferences</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* STORAGE USAGE CARD */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-[#1B1B24]">Storage Usage</h4>
            
            {/* Progress Bar */}
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#900C27] h-full rounded-full" style={{ width: "85%" }} />
            </div>

            <p className="text-[11px] text-stone-400 font-medium">
              8.5 GB of 10 GB used for Video Submissions
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Settings Forms & Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* BOX 1: ACCOUNT SETTINGS */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
            
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <User className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-base font-bold text-[#1B1B24]">Account Settings</h3>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-stone-200 focus:border-[#900C27] rounded-xl p-3 text-xs font-semibold text-stone-800 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    STUDENT ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    disabled
                    className="w-full bg-[#F4F0F7] border border-stone-200 rounded-xl p-3 text-xs font-semibold text-stone-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-stone-200 focus:border-[#900C27] rounded-xl p-3 text-xs font-semibold text-stone-800 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button className="text-xs font-bold text-[#900C27] hover:underline flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>
              </div>

            </div>

          </div>

          {/* BOX 2: NOTIFICATION PREFERENCES */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
            
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Bell className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-base font-bold text-[#1B1B24]">Notification Preferences</h3>
            </div>

            <div className="space-y-4">
              
              {/* Toggle 1 */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="text-xs font-bold text-[#1B1B24]">Live Classes</h4>
                  <p className="text-[11px] text-stone-400">Reminders 15 mins before class starts</p>
                </div>
                <button
                  onClick={() => setLiveClassReminders(!liveClassReminders)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    liveClassReminders ? "bg-[#900C27]" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                      liveClassReminders ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="text-xs font-bold text-[#1B1B24]">Assignment Deadlines</h4>
                  <p className="text-[11px] text-stone-400">Notifications for upcoming submission dates</p>
                </div>
                <button
                  onClick={() => setAssignmentDeadlines(!assignmentDeadlines)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    assignmentDeadlines ? "bg-[#900C27]" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                      assignmentDeadlines ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="text-xs font-bold text-[#1B1B24]">Academy Announcements</h4>
                  <p className="text-[11px] text-stone-400">New courses, workshops, and events</p>
                </div>
                <button
                  onClick={() => setAcademyAnnouncements(!academyAnnouncements)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    academyAnnouncements ? "bg-[#900C27]" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                      academyAnnouncements ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

            </div>

          </div>

          {/* BOX 3: APP PREFERENCES */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
            
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Sliders className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-base font-bold text-[#1B1B24]">App Preferences</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Default Language */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-600 block">Default Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#F4F0F7] border border-stone-200 focus:border-[#900C27] rounded-xl p-3 text-xs font-semibold text-stone-800 focus:outline-none transition-colors"
                >
                  <option>English (US)</option>
                  <option>Hindi (हिन्दी)</option>
                  <option>Marathi (मराठी)</option>
                </select>
              </div>

              {/* Display Theme */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-600 block">Display Theme</label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-[#900C27] bg-white text-[#900C27] shadow-xs"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === "dark"
                        ? "border-[#900C27] bg-stone-900 text-white shadow-xs"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* BOX 4: PRIVACY & SECURITY */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
            
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <ShieldCheck className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-base font-bold text-[#1B1B24]">Privacy & Security</h3>
            </div>

            <div className="space-y-4">
              
              {/* Active Sessions */}
              <div className="bg-[#F4F0F7] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-stone-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1B1B24]">Active Sessions</h4>
                    <p className="text-[11px] text-stone-500 font-medium">Currently logged in on 2 devices</p>
                  </div>
                </div>

                <button className="text-xs font-bold text-[#900C27] hover:underline shrink-0">
                  Log Out All
                </button>
              </div>

              {/* Deactivate Account */}
              <div className="bg-[#FDF2F4] border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#900C27]">Deactivate Account</h4>
                  <p className="text-[11px] text-stone-500 font-medium">Temporarily disable your profile and access</p>
                </div>

                <button className="border border-[#900C27] text-[#900C27] hover:bg-[#900C27] hover:text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0">
                  Deactivate
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
