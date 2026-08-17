"use client";

import React, { useState } from "react";
import { 
  Building2, 
  UserCircle, 
  CreditCard, 
  Bell, 
  Save, 
  Camera, 
  CheckCircle2, 
  Upload,
  Loader2
} from "lucide-react";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Institute Profile");
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { name: "Institute Profile", icon: Building2 },
    { name: "Admin Account", icon: UserCircle },
    { name: "Payments", icon: CreditCard },
    { name: "Notifications", icon: Bell },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      openThemeSuccess("Settings Saved", "Your changes have been saved successfully.");
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F8F9] p-6 lg:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Settings
          </h1>
          <p className="text-sm text-[#464555] mt-1">
            Manage your academy's preferences and configuration.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#9B3434] hover:bg-[#832c2c] text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#E0DCE8] p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-[#9B3434]/10 text-[#9B3434]" 
                      : "text-[#464555] hover:bg-gray-50 hover:text-[#0B1C30]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#9B3434]" : "text-gray-400"}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === "Institute Profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#E0DCE8] p-6 lg:p-8">
                <h2 className="text-[18px] font-bold text-[#0B1C30] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  General Information
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-[#9B3434]/50 transition-colors">
                      <Building2 className="w-8 h-8 text-gray-400 group-hover:opacity-0 transition-opacity" />
                      <div className="absolute inset-0 bg-[#9B3434]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#464555] uppercase">Academy Logo</span>
                  </div>

                  <div className="flex-1 space-y-5">
                    <div>
                      <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Academy Name</label>
                      <input type="text" defaultValue="Kathak by Harshita" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Tagline (Optional)</label>
                      <input type="text" defaultValue="Learn the art of Kathak" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                    </div>
                  </div>
                </div>

                <h2 className="text-[18px] font-bold text-[#0B1C30] mb-6 pt-6 border-t border-gray-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Official Email</label>
                    <input type="email" defaultValue="hello@kathakbyharshita.com" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Support Phone</label>
                    <input type="tel" defaultValue="+91 9876543210" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Physical Address</label>
                    <textarea rows={3} defaultValue="123 Dance Studio, Mumbai, India" className="w-full p-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all resize-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Admin Account" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#E0DCE8] p-6 lg:p-8">
                <h2 className="text-[18px] font-bold text-[#0B1C30] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Profile Settings
                </h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-rose-100 border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <span className="text-xl font-bold text-rose-700 group-hover:opacity-0 transition-opacity">HA</span>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800">Harshita Sharma</h3>
                    <p className="text-sm font-medium text-[#9B3434]">Super Admin</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Full Name</label>
                    <input type="text" defaultValue="Harshita Sharma" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Email Address</label>
                    <input type="email" defaultValue="admin@kathakbyharshita.com" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                </div>

                <h2 className="text-[18px] font-bold text-[#0B1C30] mb-6 pt-6 border-t border-gray-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Change Password
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Payments" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#E0DCE8] p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[18px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Payment Gateway
                  </h2>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Primary UPI ID</label>
                    <input type="text" defaultValue="kathakbyharshita@okicici" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                    <p className="text-xs text-gray-500 mt-2">All student fees will be credited to this UPI ID by default.</p>
                  </div>
                </div>

                <h2 className="text-[18px] font-bold text-[#0B1C30] mb-6 pt-6 border-t border-gray-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Bank Account Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Account Name</label>
                    <input type="text" defaultValue="Harshita Sharma" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Account Number</label>
                    <input type="password" defaultValue="123456789012" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">IFSC Code</label>
                    <input type="text" defaultValue="ICIC0001234" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">GSTIN (Optional)</label>
                    <input type="text" placeholder="27XXXXX1234X1X1" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-xl focus:border-[#9B3434] focus:outline-none focus:ring-1 focus:ring-[#9B3434] transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#E0DCE8] p-6 lg:p-8">
                <h2 className="text-[18px] font-bold text-[#0B1C30] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Email Notifications
                </h2>
                <div className="space-y-4">
                  {[
                    { title: "New Student Enrollment", desc: "Get notified immediately when a new student registers.", on: true },
                    { title: "Fee Payments", desc: "Receive alerts for successful and failed fee payments.", on: true },
                    { title: "Assignment Submissions", desc: "Notify me when a student uploads a video assignment.", on: false },
                    { title: "Live Class Reminders", desc: "Send me a reminder 15 minutes before a live class starts.", on: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 border border-[#E0DCE8] rounded-xl hover:bg-gray-50/50 transition-colors">
                      <div className="pr-4">
                        <h4 className="font-bold text-[#0B1C30]">{item.title}</h4>
                        <p className="text-sm text-[#464555] mt-1">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.on} />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9B3434]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
