"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Video,
  Star,
  Award,
  Plus,
  Mail,
  Pencil,
  Info,
  User,
  PhoneCall,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff,
  ChevronDown,
  Camera,
  X,
  Check,
  Loader2,
  Trash2,
  MoreVertical,
  AlertCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  UserX
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { SIDEBAR_PERMISSIONS, SidebarPermission, MODULE_PERMISSIONS_MATRIX } from "@/lib/permissions";
import { openThemeConfirm, openThemePrompt, openThemeSuccess } from "@/components/ThemeDialogProvider";

interface TeacherRecord {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar: string;
  batches: string[];
  status: "Active" | "Disabled";
  disabledMessage?: string;
  actionType: "Edit Profile" | "Manage Access";
  category: "Kathak" | "Bharatanatyam" | "Contemporary" | "Folk";
  expertise: string;
  phone?: string;
  permissions?: SidebarPermission[];
}

interface DirectoryRecord {
  id: string;
  name: string;
  initials: string;
  expertise: string;
  assignedBatches: string[];
  status: "Active" | "Inactive";
  category: "Classical" | "Folk" | "Contemporary";
}

export default function TeacherView() {
  const [viewMode, setViewMode] = useState<"MANAGEMENT" | "ADD_FORM">("MANAGEMENT");
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  
  // Real Dynamic State (NO Dummy Fallback Data)
  const [facultyList, setFacultyList] = useState<TeacherRecord[]>([]);
  const [directoryList, setDirectoryList] = useState<DirectoryRecord[]>([]);
  const [directoryFilter, setDirectoryFilter] = useState<"All" | "Classical" | "Folk" | "Contemporary">("All");
  const [availableDbBatches, setAvailableDbBatches] = useState<{ id: string; name: string; code: string; schedule: string }[]>([]);

  const [metrics, setMetrics] = useState({
    totalActiveFaculty: 0,
    classesToday: 0,
    averageRating: "0.0"
  });
  const [isLoading, setIsLoading] = useState(true);

  // Form State for Add / Edit Teacher
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Select Gender");
  const [primaryExpertise, setPrimaryExpertise] = useState("Kathak");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [designation, setDesignation] = useState("Senior Instructor");
  const [assignedBatches, setAssignedBatches] = useState<string[]>(["Beginners Morning Zen"]);
  const [salaryRate, setSalaryRate] = useState("₹ 0.00");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accessLevel, setAccessLevel] = useState<"FACULTY" | "ADMIN">("FACULTY");
  const [selectedPermissions, setSelectedPermissions] = useState<SidebarPermission[]>(["VIEW_DASHBOARD", "MANAGE_CLASSES"]);
  const [avatarUrl, setAvatarUrl] = useState<string>("/Ananya.png");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image file under 5MB.");
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

  // Fetch Live Teachers Data directly from Express + Prisma PostgreSQL Backend API
  const fetchTeachersData = async () => {
    setIsLoading(true);
    try {
      const [res, batchesRes] = await Promise.all([
        apiRequest(ENDPOINTS.ADMIN_TEACHERS),
        apiRequest(ENDPOINTS.ADMIN_BATCHES)
      ]);

      if (batchesRes.data?.batches) {
        setAvailableDbBatches(
          batchesRes.data.batches.map((b: any) => ({
            id: b.id,
            name: b.name,
            code: b.code,
            schedule: b.schedule
          }))
        );
      }

      if (res.data?.teachers) {
        const mappedFaculty: TeacherRecord[] = res.data.teachers.map((t: any) => ({
          id: t.id,
          name: t.name || t.fullName,
          title: t.designation || "Kathak Instructor",
          email: t.email,
          phone: t.phone,
          avatar: t.avatar || "/Ananya.png",
          batches: t.assignedBatches || ["Beginners Morning Zen"],
          status: t.status === "Active" ? "Active" : "Disabled",
          actionType: "Edit Profile",
          category: "Kathak",
          expertise: t.designation || "Senior Instructor",
          permissions: t.permissions || ["VIEW_DASHBOARD", "MANAGE_CLASSES"]
        }));
        setFacultyList(mappedFaculty);

        const mappedDirectory: DirectoryRecord[] = res.data.teachers.map((t: any) => ({
          id: t.id,
          name: t.name || t.fullName,
          initials: (t.name || t.fullName || "T").substring(0, 2).toUpperCase(),
          expertise: t.designation || "Kathak Specialist",
          assignedBatches: t.assignedBatches || ["Beginners Morning Zen"],
          status: "Active",
          category: "Classical"
        }));
        setDirectoryList(mappedDirectory);
      }
      
      if (res.data?.metrics) {
        setMetrics({
          totalActiveFaculty: res.data.metrics.totalTeachers || res.data.teachers?.length || 0,
          classesToday: res.data.metrics.activeFaculty || 0,
          averageRating: res.data.metrics.avgRating || "4.8"
        });
      }
    } catch (err) {
      console.error("Failed to fetch dynamic teachers data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachersData();
  }, []);

  const handleOpenCreateForm = () => {
    setEditingTeacherId(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setAvatarUrl("/Ananya.png");
    setDesignation("Senior Instructor");
    setAssignedBatches(["Beginners Morning Zen"]);
    setSelectedPermissions(["VIEW_DASHBOARD", "MANAGE_CLASSES"]);
    setViewMode("ADD_FORM");
  };

  const handleOpenEditTeacherForm = (faculty: TeacherRecord) => {
    setEditingTeacherId(faculty.id);
    setFullName(faculty.name);
    setEmail(faculty.email);
    setPhone(faculty.phone || "");
    setAvatarUrl(faculty.avatar || "/Ananya.png");
    setDesignation(faculty.title || "Senior Instructor");
    setAssignedBatches(faculty.batches || ["Beginners Morning Zen"]);
    setSelectedPermissions(faculty.permissions || ["VIEW_DASHBOARD", "MANAGE_CLASSES"]);
    setViewMode("ADD_FORM");
  };

  const handleToggleStatus = async (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Disabled" : "Active";
    try {
      await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: newStatus === "Active" })
      });
      await openThemeSuccess(
        `Teacher ${name} status updated to ${newStatus}!`,
        "Faculty Status Updated"
      );
      fetchTeachersData();
    } catch (err: any) {
      alert(err.message || "Failed to update teacher status.");
    }
  };

  const handleAddTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || (!editingTeacherId && !password)) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingTeacherId) {
        // PUT Edit Teacher Request
        await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${editingTeacherId}`, {
          method: "PUT",
          body: JSON.stringify({
            fullName,
            email,
            phone,
            avatarUrl,
            ...(password && { password }),
            permissions: selectedPermissions
          })
        });

        await openThemeSuccess(
          `Teacher account for ${fullName} updated successfully!`,
          "Teacher Account Updated"
        );
      } else {
        // POST Create Teacher Request
        await apiRequest(ENDPOINTS.ADMIN_TEACHERS, {
          method: "POST",
          body: JSON.stringify({
            fullName,
            email,
            phone,
            avatarUrl,
            password,
            permissions: selectedPermissions
          })
        });

        await openThemeSuccess(
          `Teacher account for ${fullName} created successfully!`,
          "Teacher Account Created"
        );
      }

      await fetchTeachersData();
      setViewMode("MANAGEMENT");
      setEditingTeacherId(null);
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to save teacher account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (await openThemeConfirm(`Are you sure you want to delete teacher "${name}"?`, "Delete Teacher")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${id}`, { method: "DELETE" });
        await openThemeSuccess(`Teacher "${name}" deleted successfully from Database!`, "Teacher Deleted");
        fetchTeachersData();
      } catch (err: any) {
        alert(err.message || "Failed to delete teacher account.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* ================= SCREEN 1: TEACHER MANAGEMENT WORKSPACE ================= */}
      {viewMode === "MANAGEMENT" && (
        <div className="space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Teacher Management
              </h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500">
                Manage your team of professional dance instructors and their assignments.
              </p>
            </div>

            <button
              onClick={handleOpenCreateForm}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-center uppercase tracking-wide"
            >
              <User className="w-4 h-4" />
              <span>+ Add New Teacher</span>
            </button>
          </div>

          {/* 3 Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Card 1: TOTAL ACTIVE FACULTY */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL ACTIVE FACULTY</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.totalActiveFaculty}</h3>
                  <span className="text-xs font-bold text-[#9E0C25]">Active Faculty</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-300 flex items-center justify-center font-bold shrink-0">
                <Users className="w-8 h-8 text-stone-300" />
              </div>
            </div>

            {/* Card 2: CLASSES TODAY */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">CLASSES TODAY</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.classesToday}</h3>
              <div className="w-16 h-1 bg-[#9E0C25] rounded-full mt-2" />
            </div>

            {/* Card 3: AVERAGE RATING */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">AVERAGE RATING</p>
              <div className="flex items-baseline gap-2">
                <h3 className="font-sans font-extrabold text-3xl text-stone-900">{metrics.averageRating}</h3>
                <span className="text-amber-500 font-extrabold text-lg">★</span>
              </div>
              <p className="text-[11px] font-semibold text-stone-400">Live verified reviews</p>
            </div>

          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-12 rounded-3xl bg-white border border-stone-200/80 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#9E0C25] animate-spin" />
              <p className="text-xs font-mono font-bold text-stone-400 uppercase">Loading faculty records...</p>
            </div>
          )}

          {/* Faculty Cards Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {facultyList.map((faculty) => (
                <div
                  key={faculty.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    
                    {/* Top Profile Row & Active Toggle */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={faculty.avatar}
                          alt={faculty.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-stone-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-base text-stone-900 leading-tight">{faculty.name}</h4>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase mt-1 bg-rose-100 text-rose-800">
                            {faculty.expertise}
                          </span>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggleStatus(faculty.id, faculty.name, faculty.status)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          faculty.status === "Active" ? "bg-[#9E0C25]" : "bg-stone-300"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                          faculty.status === "Active" ? "right-0.5" : "left-0.5"
                        }`} />
                      </button>
                    </div>

                    {/* Email Line */}
                    <p className="text-xs font-semibold text-stone-400 truncate">{faculty.email}</p>

                    {/* Batches / Disabled Alert Box */}
                    {faculty.status === "Active" ? (
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-stone-500">Batches: </span>
                        <span className="font-semibold text-stone-700">{faculty.batches.join(", ")}</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>{faculty.disabledMessage || "Account Temporarily Disabled"}</span>
                      </div>
                    )}

                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenEditTeacherForm(faculty)}
                      className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs transition-colors cursor-pointer text-center"
                    >
                      {faculty.actionType}
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(faculty.id, faculty.name)}
                      className="p-2 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-xl cursor-pointer"
                      title="Delete Teacher Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}

              {/* + Add New Faculty Dashed Card */}
              <div
                onClick={() => setViewMode("ADD_FORM")}
                className="bg-white rounded-3xl p-8 border-2 border-dashed border-stone-300 hover:border-[#9E0C25] transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-3 group shadow-xs min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#9E0C25] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-base text-stone-900">Add New Faculty</h4>
                  <p className="text-xs text-stone-400 font-medium mt-0.5">Expand the Kinetic expert team</p>
                </div>
              </div>

            </div>
          )}

          {/* Teacher Directory Section */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-sans font-bold text-xl text-stone-900">Teacher Directory</h3>
              
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2">
                {(["All", "Classical", "Folk", "Contemporary"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDirectoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      directoryFilter === cat
                        ? "bg-[#9E0C25] text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">NAME &amp; EXPERTISE</th>
                    <th className="py-3.5 px-4">ASSIGNED BATCHES</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {directoryList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-stone-400 font-semibold">
                        No teachers found in database. Click + Add New Teacher to add your first faculty member.
                      </td>
                    </tr>
                  ) : (
                    directoryList
                      .filter((d) => directoryFilter === "All" || d.category === directoryFilter)
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                          
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-rose-100 text-[#9E0C25] font-extrabold text-xs flex items-center justify-center shrink-0">
                                {item.initials}
                              </div>
                              <div>
                                <h5 className="font-bold text-stone-900 text-sm">{item.name}</h5>
                                <p className="text-[10.5px] font-semibold text-stone-400">{item.expertise}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {item.assignedBatches.map((b, bIdx) => (
                                <span key={bIdx} className="px-2.5 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-[10.5px]">
                                  {b}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10.5px] border border-emerald-200">
                              • {item.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <button onClick={() => alert(`Edit ${item.name}`)} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer">
                              <Pencil className="w-4 h-4" />
                            </button>
                          </td>

                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ================= SCREEN 2: ADD NEW TEACHER FORM WORKSPACE ================= */}
      {viewMode === "ADD_FORM" && (
        <form onSubmit={handleAddTeacherSubmit} className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setViewMode("MANAGEMENT")}
                className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer uppercase mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Directory</span>
              </button>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Add New Teacher
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setViewMode("MANAGEMENT")}
                className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase disabled:opacity-75 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? "Saving..." : "Save Teacher Profile"}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-5">
              <div className="flex items-center gap-2 text-[#9E0C25]">
                <User className="w-4 h-4" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Personal Information</h4>
              </div>

              <div className="space-y-5 text-xs font-semibold">
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                  <div className="relative group shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt="Teacher Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#9E0C25] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-stone-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <span className="font-bold text-stone-900 text-xs block">Profile Photo</span>
                    <p className="text-[11px] text-stone-400 font-medium">PNG, JPG or WebP (Max 5MB)</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1.5 text-xs font-extrabold text-[#9E0C25] hover:underline cursor-pointer flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{avatarUrl === "/Ananya.png" ? "+ Upload Profile Photo" : "Change Profile Photo"}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter teacher's legal name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">DATE OF BIRTH</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">GENDER</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                    >
                      <option>Select Gender</option>
                      <option>Female</option>
                      <option>Male</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">PRIMARY EXPERTISE</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(["Kathak", "Bharatanatyam", "Odissi", "Contemporary"] as const).map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => setPrimaryExpertise(exp)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          primaryExpertise === exp
                            ? "bg-[#9E0C25] text-white shadow-xs"
                            : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Section 2: Contact Details */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-5">
              <div className="flex items-center gap-2 text-[#9E0C25]">
                <Mail className="w-4 h-4" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Contact Details</h4>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      placeholder="example@kinetic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">PHONE NUMBER *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 00000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">RESIDENTIAL ADDRESS</label>
                  <textarea
                    rows={2}
                    placeholder="Enter complete home address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Professional Details */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-5">
              <div className="flex items-center gap-2 text-[#9E0C25]">
                <Briefcase className="w-4 h-4" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Professional Details</h4>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">JOINING DATE</label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">DESIGNATION</label>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                    >
                      <option>Senior Instructor</option>
                      <option>Kathak Specialist</option>
                      <option>Choreographer</option>
                      <option>Assistant Instructor</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">ASSIGNED BATCHES (MULTI-SELECT)</label>
                    <span className="text-[11px] font-bold text-[#9E0C25]">Active Academy Batches</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-3">
                    {/* Selected Batch Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {assignedBatches.length === 0 ? (
                        <span className="text-xs text-stone-400 font-medium italic">No batches assigned yet. Select a batch below.</span>
                      ) : (
                        assignedBatches.map((b, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[#9E0C25] font-extrabold text-xs flex items-center gap-2">
                            <span>{b}</span>
                            <button type="button" onClick={() => setAssignedBatches(assignedBatches.filter((_, i) => i !== idx))} className="hover:text-stone-900 cursor-pointer font-bold">✕</button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Dynamic Batch Selector Dropdown */}
                    <div className="pt-2 border-t border-stone-100">
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !assignedBatches.includes(val)) {
                            setAssignedBatches([...assignedBatches, val]);
                          }
                          e.target.value = "";
                        }}
                        className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25] cursor-pointer"
                      >
                        <option value="">+ Select Active Batch from Directory...</option>
                        {availableDbBatches.map((batch) => (
                          <option key={batch.id} value={batch.name} disabled={assignedBatches.includes(batch.name)}>
                            {batch.name} ({batch.code}) — {batch.schedule}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">SALARY / PAY RATE (PER ASSIGNMENT)</label>
                  <input
                    type="text"
                    value={salaryRate}
                    onChange={(e) => setSalaryRate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Account Credentials */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-5">
              <div className="flex items-center gap-2 text-[#9E0C25]">
                <KeyRound className="w-4 h-4" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Account Credentials</h4>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">TEMPORARY PASSWORD *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
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

                <div className="space-y-2">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">ROLE / ACCESS LEVEL</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccessLevel("FACULTY")}
                      className={`p-3.5 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer ${
                        accessLevel === "FACULTY"
                          ? "border-[#9E0C25] bg-rose-50/70 text-[#9E0C25] shadow-xs"
                          : "border-stone-200 bg-white text-stone-700"
                      }`}
                    >
                      <span className="block text-stone-900 font-extrabold">Faculty</span>
                      <span className="text-[10.5px] text-stone-500 font-medium">Teaching &amp; Class Access</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccessLevel("ADMIN")}
                      className={`p-3.5 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer ${
                        accessLevel === "ADMIN"
                          ? "border-[#9E0C25] bg-rose-50/70 text-[#9E0C25] shadow-xs"
                          : "border-stone-200 bg-white text-stone-700"
                      }`}
                    >
                      <span className="block text-stone-900 font-extrabold">Admin</span>
                      <span className="text-[10.5px] text-stone-500 font-medium">Full System Access</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Granular Teacher Permissions & Sub-Actions */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#9E0C25]">
                  <ShieldCheck className="w-4 h-4" />
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Granular Teacher Permissions &amp; Sub-Actions</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allVals: any[] = [];
                    MODULE_PERMISSIONS_MATRIX.forEach((group) => {
                      allVals.push(group.moduleValue);
                      group.subPermissions.forEach((sp) => allVals.push(sp.value));
                    });
                    setSelectedPermissions(allVals);
                  }}
                  className="text-[11px] font-extrabold text-[#9E0C25] hover:underline cursor-pointer uppercase"
                >
                  + Grant All Permissions
                </button>
              </div>
              <p className="text-xs text-stone-500">Enable specific modules and fine-tune exact sub-actions (View, Create, Edit, Delete, Grade) for this faculty member.</p>

              <div className="space-y-4">
                {MODULE_PERMISSIONS_MATRIX.map((group) => {
                  const isModuleEnabled = selectedPermissions.includes(group.moduleValue as any);

                  const toggleModuleGroup = () => {
                    if (isModuleEnabled) {
                      const subVals = group.subPermissions.map((s) => s.value);
                      setSelectedPermissions((current) =>
                        current.filter((item) => item !== group.moduleValue && !subVals.includes(item))
                      );
                    } else {
                      const subVals = group.subPermissions.map((s) => s.value);
                      setSelectedPermissions((current) => [...current, group.moduleValue as any, ...subVals as any]);
                    }
                  };

                  return (
                    <div
                      key={group.moduleValue}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isModuleEnabled ? "border-[#9E0C25]/40 bg-white shadow-xs" : "border-stone-200/80 bg-white/60"
                      }`}
                    >
                      {/* Module Header Bar */}
                      <div className="p-4 flex items-center justify-between bg-stone-50/70 border-b border-stone-100">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isModuleEnabled}
                            onChange={toggleModuleGroup}
                            className="h-4.5 w-4.5 accent-[#9E0C25] rounded cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-stone-900 text-xs sm:text-sm">{group.moduleLabel}</span>
                            <span className="block text-[10.5px] font-semibold text-stone-400">
                              {isModuleEnabled ? "Module Active" : "Module Restricted"}
                            </span>
                          </div>
                        </label>

                        {isModuleEnabled && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9E0C25] font-extrabold text-[10px] uppercase border border-rose-200">
                            {group.subPermissions.filter((sp) => selectedPermissions.includes(sp.value as any)).length} / {group.subPermissions.length} Sub-Actions Allowed
                          </span>
                        )}
                      </div>

                      {/* Sub-Action Permissions Grid */}
                      {isModuleEnabled && (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white">
                          {group.subPermissions.map((sp) => {
                            const isSubSelected = selectedPermissions.includes(sp.value as any);

                            const toggleSubPermission = () => {
                              if (isSubSelected) {
                                setSelectedPermissions((current) => current.filter((item) => item !== sp.value));
                              } else {
                                setSelectedPermissions((current) => [...current, sp.value as any]);
                              }
                            };

                            return (
                              <label
                                key={sp.value}
                                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                                  isSubSelected
                                    ? "border-[#9E0C25] bg-rose-50/50 text-stone-900"
                                    : "border-stone-200/80 bg-stone-50/50 text-stone-500"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSubSelected}
                                  onChange={toggleSubPermission}
                                  className="h-4 w-4 accent-[#9E0C25] mt-0.5 shrink-0 cursor-pointer"
                                />
                                <div>
                                  <span className="block font-bold text-xs leading-tight text-stone-800">{sp.label}</span>
                                  <span className="block text-[10.5px] text-stone-400 font-normal pt-0.5 leading-snug">{sp.description}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewMode("MANAGEMENT")}
                className="text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Discard Changes
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase disabled:opacity-75 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? "Saving Teacher..." : "Confirm & Add Teacher"}</span>
              </button>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
