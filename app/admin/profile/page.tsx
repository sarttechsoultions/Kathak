"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Loader2,
  BookOpen,
  Award,
  Sparkles
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState<"SPECS" | "SECURITY">("SPECS");
  const [isLoading, setIsLoading] = useState(true);

  // User Profile State
  const [fullName, setFullName] = useState("Guru Harshita");
  const [email, setEmail] = useState("kathakbyharshita@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [role, setRole] = useState<"ADMIN" | "TEACHER">("ADMIN");
  const [designation, setDesignation] = useState("Head of Faculty & Founder");
  const [avatarUrl, setAvatarUrl] = useState("/Ananya.png");
  const [assignedBatches, setAssignedBatches] = useState<string[]>([
    "Beginners Morning Zen",
    "Intermediate Evening",
    "Advanced Mastery"
  ]);
  const [permissions, setPermissions] = useState<string[]>([
    "VIEW_DASHBOARD",
    "MANAGE_COURSES",
    "MANAGE_STUDENTS",
    "MANAGE_TEACHERS",
    "MANAGE_BATCHES"
  ]);
  const [joinedDate, setJoinedDate] = useState<string>("Recently Registered");

  // Password Reset State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest(ENDPOINTS.AUTH_ME);
        if (res.data?.user) {
          const u = res.data.user;
          setFullName(u.fullName || u.name || "Guru Harshita");
          setEmail(u.email || "kathakbyharshita@gmail.com");
          setPhone(u.phone || "+91 98765 43210");
          setRole(u.role || "ADMIN");
          setAvatarUrl(u.avatarUrl || "/Ananya.png");
          setDesignation(u.role === "ADMIN" ? "Head of Faculty & Founder" : "Kathak Instructor");
          if (u.assignedBatches) setAssignedBatches(u.assignedBatches);
          if (u.permissions) setPermissions(u.permissions);

          if (u.createdAt) {
            const d = new Date(u.createdAt);
            const formatted = d.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            });
            setJoinedDate(formatted);
          }
        }
      } catch (err) {
        console.log("Loaded cached profile specifications");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    setIsResetting(true);
    try {
      await apiRequest(ENDPOINTS.AUTH_CHANGE_PASSWORD, {
        method: "POST",
        body: JSON.stringify({ newPassword })
      });
      await openThemeSuccess("Your account password has been updated successfully!", "Password Reset");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("SPECS");
    } catch (err: any) {
      alert(err.message || "Failed to update password.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1250px] mx-auto pb-12">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-[#9E0C25] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-bold">My Account Profile</span>
          </div>
          <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight flex items-center gap-3">
            <span>Account Profile &amp; Settings</span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#9E0C25] text-white">
              {role}
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-500">
            View your official academy credentials, assigned cohorts, system privileges, and security settings.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 rounded-3xl bg-white border border-stone-200 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#9E0C25] animate-spin" />
          <p className="text-xs font-mono font-bold text-stone-400 uppercase">Loading Account Specs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile Overview Card */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 self-start">
            
            {/* Avatar & Photo Upload Box */}
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="relative group cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#9E0C25] shadow-lg group-hover:opacity-90 transition-all"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-stone-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Change Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div>
                <h3 className="font-bold text-xl text-stone-900 leading-tight">{fullName}</h3>
                <p className="text-xs font-semibold text-stone-500 mt-1">{designation}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-200">
                  ✓ Verified Active User
                </span>
              </div>
            </div>

            {/* Account Specs Details List */}
            <div className="space-y-4 pt-4 border-t border-stone-100 text-xs font-semibold">
              <div className="space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-stone-400">OFFICIAL EMAIL</span>
                <p className="font-bold text-stone-900 text-sm break-all flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#9E0C25] shrink-0" />
                  <span>{email}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-stone-400">CONTACT PHONE</span>
                <p className="font-bold text-stone-900 text-xs flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#9E0C25] shrink-0" />
                  <span>{phone}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-stone-400">SYSTEM ROLE</span>
                <p className="font-extrabold text-[#9E0C25] text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{role === "ADMIN" ? "Super Administrator" : "Faculty Instructor"}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-stone-400">REGISTRATION DATE</span>
                <p className="font-semibold text-stone-700 text-xs flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>{joinedDate}</span>
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Tabbed Content (Specs vs Password Reset) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col">
            
            {/* Page Sub-Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50/70 px-6 text-xs font-extrabold">
              <button
                onClick={() => setActiveTab("SPECS")}
                className={`py-4 px-6 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "SPECS"
                    ? "border-[#9E0C25] text-[#9E0C25] bg-white"
                    : "border-transparent text-stone-500 hover:text-stone-900"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Account Privileges &amp; Cohorts</span>
              </button>

              <button
                onClick={() => setActiveTab("SECURITY")}
                className={`py-4 px-6 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "SECURITY"
                    ? "border-[#9E0C25] text-[#9E0C25] bg-white"
                    : "border-transparent text-stone-500 hover:text-stone-900"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Reset Account Password</span>
              </button>
            </div>

            {/* Tab 1: Specs & Privileges */}
            {activeTab === "SPECS" && (
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Assigned Batches (ONLY for Teacher Role) */}
                {role === "TEACHER" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#9E0C25]">
                      <BookOpen className="w-4 h-4" />
                      <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Assigned Academy Batches</h4>
                    </div>
                    <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                      {assignedBatches.map((b, idx) => (
                        <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-[#9E0C25] font-extrabold text-xs">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Privileges Matrix */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-[#9E0C25]">
                    <ShieldCheck className="w-4 h-4" />
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider">System Privileges &amp; Access Controls</h4>
                  </div>

                  {role === "ADMIN" ? (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                      <div className="flex items-center gap-2 font-extrabold text-sm">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Full System Administrator (Unrestricted Access)</span>
                      </div>
                      <p className="text-xs text-amber-800/90 font-medium leading-relaxed">
                        This account possesses full administrative authority over courses, batches, teacher profiles, student enrollments, financial ledgers, and system configurations.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {permissions.map((p, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2.5 text-xs font-bold text-stone-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Tab 2: Password Reset Form */}
            {activeTab === "SECURITY" && (
              <form onSubmit={handlePasswordReset} className="p-6 sm:p-8 space-y-6">
                
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-[#9E0C25] space-y-2">
                  <div className="flex items-center gap-2 font-extrabold text-sm">
                    <Lock className="w-4 h-4 text-[#9E0C25]" />
                    <span>Reset Account Login Password</span>
                  </div>
                  <p className="text-xs text-rose-800 font-medium leading-relaxed">
                    Update your account credentials. Minimum 6 characters required. Changes take effect immediately upon submission.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-semibold max-w-md">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">NEW PASSWORD *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
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

                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">CONFIRM NEW PASSWORD *</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer uppercase disabled:opacity-75 flex items-center justify-center gap-2 mt-4"
                  >
                    {isResetting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isResetting ? "Updating Password..." : "Confirm & Update Password"}</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
