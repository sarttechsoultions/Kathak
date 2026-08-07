"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  MoreHorizontal,
  BookOpen,
  Users,
  TrendingUp,
  GraduationCap,
  Save,
  Lock,
  Loader2,
  AlertCircle,
  Award,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string | null;
  country: string;
  isActive: boolean;
  createdAt: string;
  dob?: string;
  gender?: string;
  batch?: string;
  address?: string;
  level?: string;
  guru?: string;
  father?: string;
  mother?: string;
  emergencyContact?: string;
}

interface FinanceTransaction {
  [key: string]: unknown;
}

interface FinanceData {
  courseTitle: string;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  nextDueDate: string;
  transactions: FinanceTransaction[];
}

interface Assignment {
  id: string;
  name: string;
  typeTag: string;
  course: string;
  dueDate: string;
  status: string;
  grade: string;
  feedback: string | null;
}

interface Exam {
  id: string;
  name: string;
  date: string;
  score: string;
  status: string;
  isRedScore: boolean;
}

interface DashboardData {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage: string | null;
  };
  currentCourse: {
    title: string;
    subtitle: string;
    completedLessons: number;
    totalLessons: number;
    progressPercent: number;
  } | null;
  metrics: {
    completedLessons: number;
    practiceHours: string;
    assignmentsPending: number;
  };
}


const formatDob = (dob: string | Date | null | undefined) => {
  if (!dob) return null;
  return new Date(dob).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [finance, setFinance] = useState<FinanceData | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bgSrc, setBgSrc] = useState("/student/background.png");
  const [avatarSrc, setAvatarSrc] = useState<string>("/Ananya.png");

  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    country: "",
    avatarUrl: "",
    gender: "",
  });

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // ─────────────────────────────────────────────
  // Fetch data
  // ─────────────────────────────────────────────
const fetchAll = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const [profileRes, financeRes, assignmentRes, examRes, dashboardRes] =
      await Promise.all([
        apiRequest("/student/profile"),
        apiRequest("/student/finance").catch(() => null),
        apiRequest("/student/assignments").catch(() => ({ assignments: [] })),
        apiRequest("/student/exams").catch(() => ({ exams: [] })),
        apiRequest("/student/dashboard").catch(() => null),
      ]);

    // DOB format karo
    const data = profileRes?.data ?? null;
    if (data) {
      data.dob = formatDob(data.dob);
    }

    setProfile(data);
    setFinance(financeRes?.data ?? null);
    setAssignments(assignmentRes?.data?.assignments || []);
    setExams(examRes?.data?.exams || []);
    setDashboard(dashboardRes?.data ?? null);

    if (data?.avatarUrl) {
      setAvatarSrc(data.avatarUrl);
    } else {
      setAvatarSrc("/Ananya.png");
    }

    setEditForm({
      fullName: data?.fullName || "",
      phone: data?.phone || "",
      country: data?.country || "",
      avatarUrl: data?.avatarUrl || "",
      gender: data?.gender || "",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to load profile";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    const initialize = async () => {
      await fetchAll();
    };

    void initialize();
  }, [fetchAll]);

  // ─────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────
const handleSaveProfile = async () => {
  if (!profile) return;
  setSaving(true);
  try {
    const updated = await apiRequest("/student/profile", {
      method: "PUT",
      body: JSON.stringify({
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
        country: editForm.country.trim(),
        avatarUrl: editForm.avatarUrl || null,
        gender: editForm.gender || null,
      }),
    });

    setProfile((prev) => {
      if (!prev) return updated.data;

      return {
        ...prev,
        ...updated.data,
        // Format dob
        dob: formatDob(updated.data?.dob) || prev.dob,
        batch: updated.data?.batch ?? prev.batch,
        guru: updated.data?.guru ?? prev.guru,
        level: updated.data?.level ?? updated.data?.skillLevel ?? prev.level,
        father: updated.data?.father ?? prev.father,
        mother: updated.data?.mother ?? prev.mother,
        emergencyContact:
          updated.data?.emergencyContact ?? prev.emergencyContact,
        gender: updated.data?.gender ?? editForm.gender ?? prev.gender,
      };
    });

    if (updated.data?.avatarUrl) {
      setAvatarSrc(updated.data.avatarUrl);
    }

    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    alert(message || "Failed to update profile");
  } finally {
    setSaving(false);
  }
};

  const handleChangePassword = async () => {
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      await apiRequest("/student/profile/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setPasswordError(message || "Failed to change password");
    }
  };


const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be less than 5MB");
    return;
  }

  setUploadingAvatar(true);

  try {
    const formData = new FormData();
    formData.append("image", file); // backend expects "image"

    // Direct fetch – Content-Type mat set karo
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/upload/image`,
      {
        method: "POST",
        body: formData,
        credentials: "include", // cookie auth ke liye
        // Authorization header agar Bearer token use karte ho to yahan add karo
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Upload failed");
    }

    // Response structure ke hisaab se URL nikaalo
    const imageUrl =
      data?.data?.url ||
      data?.data?.secure_url ||
      data?.url ||
      data?.data;

    if (imageUrl && typeof imageUrl === "string") {
      setAvatarSrc(imageUrl);
      setEditForm((prev) => ({
        ...prev,
        avatarUrl: imageUrl,
      }));
    } else {
      throw new Error("No image URL returned from server");
    }
  } catch (err) {
    console.error("Avatar upload failed:", err);
    alert(err instanceof Error ? err.message : "Failed to upload image");
  } finally {
    setUploadingAvatar(false);
  }
};

  // ─────────────────────────────────────────────
  // Derived values
  // ─────────────────────────────────────────────
  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const assignmentStats = {
    completed: assignments.filter(
      (a) => a.status === "EVALUATED" || a.status === "SUBMITTED"
    ).length,
    total: assignments.length,
  };
  const completionRate =
    assignmentStats.total > 0
      ? Math.round((assignmentStats.completed / assignmentStats.total) * 100)
      : 0;

  const recentAssignments = assignments.slice(0, 3);
  const recentExams = exams.slice(0, 2);

  // ─────────────────────────────────────────────
  // Loading / Error
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#900C27]" />
          <span className="text-sm font-medium">Loading your profile…</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-rose-500" />
          <p className="text-sm font-medium text-stone-700">
            {error || "Profile not found"}
          </p>
          <button
            onClick={fetchAll}
            className="mt-2 px-4 py-2 bg-[#900C27] text-white text-xs font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-6 font-sans pb-16">
      {/* 1. TOP PROFILE BANNER */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="h-32 sm:h-40 w-full relative overflow-hidden bg-[#800020]">
          <Image
            src={bgSrc}
            alt="Profile Banner"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            onError={() => {
              if (bgSrc.includes("Background.png")) setBgSrc("/student/background.png");
            }}
          />
        </div>

        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 sm:-mt-14 relative z-10 text-center sm:text-left">
           <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-stone-100 shadow-md overflow-hidden shrink-0 relative group">
  {avatarSrc ? (
    <Image
      src={avatarSrc}
      alt={profile.fullName}
      width={112}
      height={112}
      style={{ objectFit: "cover" }}
      className="w-full h-full"
      onError={() => {
        if (avatarSrc !== "/Ananya.png") setAvatarSrc("/Ananya.png");
        else setAvatarSrc("");
      }}
    />
  ) : null}

  {/* Edit mode mein camera overlay dikhao */}
  {isEditing && (
    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
      {uploadingAvatar ? (
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      ) : (
        <div className="text-white text-center">
          <Edit className="w-5 h-5 mx-auto mb-0.5" />
          <span className="text-[10px] font-semibold">Change</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
        disabled={uploadingAvatar}
      />
    </label>
  )}
</div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1B24]">
                {profile.fullName}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-stone-500 font-medium">
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-md">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {dashboard?.currentCourse?.title || "Student"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {joinedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{isEditing ? "Cancel Edit" : "Update Profile"}</span>
            </button>
            <button className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <User className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                  FULL NAME
                </span>
                {isEditing ? (
                  <input
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fullName: e.target.value })
                    }
                    className="mt-1 w-full border border-stone-200 rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#900C27]/30"
                  />
                ) : (
                  <span className="font-semibold text-[#1B1B24] text-[14px]">
                    {profile.fullName}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                  DATE OF BIRTH
                </span>
                <span className="font-semibold text-[#1B1B24] text-[14px]">
                  {profile.dob ?? "—"}
                </span>
              </div>

              <div>
  <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
    GENDER
  </span>
  {isEditing ? (
    <select
      value={editForm.gender}
      onChange={(e) =>
        setEditForm({ ...editForm, gender: e.target.value })
      }
      className="mt-1 w-full border border-stone-200 rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#900C27]/30 bg-white"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  ) : (
    <span className="font-semibold text-[#1B1B24] text-[14px]">
      {profile.gender ?? "—"}
    </span>
  )}
</div>

              <div>
                <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                  BATCH
                </span>
                <span className="font-semibold text-[#1B1B24] text-[14px]">
                  {profile.batch ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Mail className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
                Contact Details
              </h3>
            </div>

            <div className="space-y-3 ">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                    PHONE NUMBER
                  </span>
                  {isEditing ? (
                    <input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="mt-1 w-full border border-stone-200 rounded-lg px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#900C27]/30"
                    />
                  ) : (
                    <span className="font-semibold text-[#1B1B24] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400 text-[13px]" />
                      {profile.phone}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                    EMAIL ADDRESS
                  </span>
                  <span className="font-semibold text-[#1B1B24] break-all text-[14px]">
                    {profile.email}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                  RESIDENTIAL ADDRESS
                </span>
                <span className="font-semibold text-[#1B1B24] leading-relaxed block text-[14px]">
                  {profile.address ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-6 space-y-6">
          {/* Academic Profile */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <BookOpen className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
                Academic Profile
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                    COURSE NAME
                  </span>
                  <span className="font-semibold text-[#1B1B24] text-[14px]">
                    {dashboard?.currentCourse?.title ?? finance?.courseTitle ?? "—"}
                  </span>
                </div>

                <div>
                  <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                    CURRENT LEVEL
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full bg-rose-50 text-[#900C27] px-3 py-1 text-[12px] font-bold">
                    {profile.level ?? "—"}
                  </span>
                </div>

                <div>
                  <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                    BATCH 
                  </span>
                  <span className="font-semibold text-[#1B1B24] text-[14px]">
                    {profile.batch ?? "—"}
                  </span>
                </div>

                <div>
                  <span className="text-[12px] text-stone-400 font-bold uppercase tracking-wider block">
                    ASSIGNED GURU
                  </span>
                  <span className="font-semibold text-[#1B1B24] text-[14px] flex items-center gap-2">
                    {profile.guru ?? "—"}
                    {/* <span className="w-6 h-6 rounded-full border border-stone-200 overflow-hidden">
                      <Image
                        // src={profile.avatarUrl || "/Sunita.png"}/
                        alt={profile.guru ?? "Guru"}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </span> */}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guardians */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Users className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
                Guardians
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  FATHER
                </span>
                <span className="font-bold text-sm text-[#1B1B24] block mt-1">
                  {profile.father ?? "—"}
                </span>
              </div>

              {/* <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  MOTHER
                </span>
                <span className="font-bold text-sm text-[#1B1B24] block mt-1">
                  {profile.mother ?? "—"}
                </span>
              </div> */}

              <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-100">
                <span className="block text-[10px] text-[#900C27] font-bold uppercase tracking-wider">
                  EMERGENCY CONTACT
                </span>
                <span className="font-extrabold text-sm text-[#900C27] block mt-1">
                  {profile.emergencyContact ?? "—"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. PERFORMANCE & FINANCIAL SUMMARY */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <TrendingUp className="w-4 h-4 text-[#900C27]" />
          <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
            Performance & Financial Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1 text-xs">
          {/* Assignments */}
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              ASSIGNMENTS
            </span>
            <span className="text-2xl font-extrabold text-[#1B1B24]">
              {assignmentStats.completed} / {assignmentStats.total}
            </span>
            <span className="text-[11px] text-stone-500 block font-medium">
              {completionRate}% Completion Rate
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              COURSE PROGRESS
            </span>
            <span className="text-2xl font-extrabold text-[#1B1B24]">
              {dashboard?.currentCourse?.progressPercent ?? 0}%
            </span>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#900C27] h-full rounded-full transition-all"
                style={{
                  width: `${dashboard?.currentCourse?.progressPercent ?? 0}%`,
                }}
              />
            </div>
          </div>

          {/* Financial Summary */}
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              FINANCIAL SUMMARY
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block">Total Fee</span>
                <span className="text-lg font-bold text-[#1B1B24]">
                  ₹{(finance?.totalFee || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold block ${
                    (finance?.pendingAmount || 0) > 0
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {(finance?.pendingAmount || 0) > 0 ? "Pending" : "Cleared"}
                </span>
                <span className="text-lg font-bold text-[#900C27]">
                  ₹{(finance?.pendingAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACADEMIC PERFORMANCE */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <GraduationCap className="w-4 h-4 text-[#900C27]" />
          <h3 className="text-xs font-bold text-[#900C27] uppercase tracking-wider">
            Academic Performance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          {/* Assignments */}
          <div className="space-y-3">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              RECENT ASSIGNMENTS
            </span>

            {recentAssignments.length === 0 ? (
              <p className="text-stone-400 text-xs py-4">No assignments yet</p>
            ) : (
              <div className="space-y-2">
                {recentAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center p-2 rounded-lg bg-stone-50"
                  >
                    <div>
                      <span className="font-semibold text-stone-800 block">
                        {a.name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {a.dueDate} · {a.status}
                      </span>
                    </div>
                    <span className="font-bold text-[#1B1B24]">{a.grade}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exams / Assessments */}
          <div className="space-y-3">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              ASSESSMENT / TEST RESULTS
            </span>

            {recentExams.length === 0 ? (
              <p className="text-stone-400 text-xs py-4">No exams yet</p>
            ) : (
              <div className="space-y-2">
                {recentExams.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex justify-between items-center p-2 rounded-lg bg-stone-50"
                  >
                    <div>
                      <span className="font-semibold text-stone-800 block">
                        {ex.name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {ex.date}
                      </span>
                    </div>
                    <span
                      className={`font-bold ${
                        ex.isRedScore ? "text-rose-600" : "text-[#1B1B24]"
                      }`}
                    >
                      {ex.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. ACCOUNT PREFERENCES */}
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
              <span className="font-bold text-stone-800 block">
                Email Notifications
              </span>
              <span className="text-[10px] text-stone-400">
                Announcements & Assignments
              </span>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                emailNotifs ? "bg-[#900C27]" : "bg-stone-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  emailNotifs ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-800 block">SMS Alerts</span>
              <span className="text-[10px] text-stone-400">
                Class timings & cancellations
              </span>
            </div>
            <button
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                smsAlerts ? "bg-[#900C27]" : "bg-stone-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  smsAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-800 block">
                Profile Visibility
              </span>
              <span className="text-[10px] text-stone-400">
                Visible to other students
              </span>
            </div>
            <button
              onClick={() => setProfileVisibility(!profileVisibility)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                profileVisibility ? "bg-[#900C27]" : "bg-stone-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  profileVisibility ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-[#900C27] hover:bg-[#780A20] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Changes
            </button>
          )}

          <button
            onClick={() => setShowPasswordModal(true)}
            className="border border-[#900C27] text-[#900C27] hover:bg-rose-50 px-6 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            Change Password
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {savedMsg && (
        <div className="fixed bottom-6 right-6 bg-[#900C27] text-white px-5 py-3 rounded-xl text-xs font-bold shadow-2xl z-50 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Profile Changes Saved Successfully!
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Lock className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-sm font-bold text-[#1B1B24]">Change Password</h3>
            </div>

            {passwordSuccess ? (
              <div className="py-8 text-center text-sm font-medium text-emerald-600">
                Password changed successfully!
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#900C27]/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#900C27]/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#900C27]/30"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-xs text-rose-600 font-medium">{passwordError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError("");
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 bg-[#900C27] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#780A20]"
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}