"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, User, PhoneCall, Camera,  } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

export default function StudentEditPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [student, setStudent] = useState<any>(null); // For avatar & header info
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    guardianName: "",
    relationship: "",
    emergencyContact: "",
    isActive: true
  });

  useEffect(() => {
    if (!studentId) return;
    const fetchStudent = async () => {
      try {
        const res = await apiRequest(`${ENDPOINTS.ADMIN_STUDENTS}/${studentId}`);
        const s = res.data?.student || res.data;
        if (s) {
          setStudent(s);
          setFormData({
            fullName: s.fullName || "",
            email: s.email || "",
            phone: s.phone || "",
            dob: s.dob ? s.dob.split("T")[0] : "",
            gender: s.gender || "Male",
            address: s.address || "",
            city: s.city || "",
            region: s.region || "",
            postalCode: s.postalCode || "",
            guardianName: s.guardianName || "",
            relationship: s.relationship || "",
            emergencyContact: s.emergencyContact || "",
            isActive: s.isActive ?? true
          });
        }
      } catch (error) {
        console.error("Fetch failed", error);
        alert("Could not load student for editing.");
        router.push("/admin/student");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [studentId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest(`${ENDPOINTS.ADMIN_STUDENTS}/${studentId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      await openThemeSuccess("Student profile updated successfully!", "Update Successful");
      router.push(`/admin/student/${studentId}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(msg || "Failed to update student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#9E0C25]" />
        <p className="text-sm font-bold text-stone-500">Loading editor...</p>
      </div>
    );
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newPassword || newPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }
  try {
    await apiRequest(`${ENDPOINTS.ADMIN_STUDENTS}/${studentId}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    });
    await openThemeSuccess("Student password updated successfully!", "Password Changed");
    setNewPassword("");
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    alert(msg || "Failed to update password.");
  }
};


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-[1300px] mx-auto pb-20">
      {/* Top Back Button */}
      <button
        onClick={() => router.push(`/admin/student/${studentId}`)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-stone-200/85 shadow-sm text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-all cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Profile</span>
      </button>

      {/* HERO BANNER CARD (Same as Detail Page) */}
      <div className="bg-white rounded-[2rem] border border-stone-200/85 shadow-lg shadow-stone-200/40 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-stone-900 to-[#9E0C25] relative p-6 flex items-end">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="p-6 sm:p-10 pt-0 flex flex-col sm:flex-row items-start justify-between gap-6 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 w-full">
            <div className="relative group shrink-0">
              <Image
                src={student?.avatarUrl || "/Ananya.png"}
                alt={formData.fullName || "Student Avatar"}
                width={128}
                height={128}
                unoptimized
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <div className="w-9 h-9 rounded-full bg-[#9E0C25] text-white flex items-center justify-center absolute -bottom-2 -right-2 shadow-lg">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2 flex-1 sm:pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
                    Edit: {formData.fullName || "Student Profile"}
                  </h2>
                  <p className="text-xs font-bold text-stone-500 mt-1">
                    Update personal, contact, and guardian details securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT FORM CONTAINER */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Personal Info & Contact */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/85 shadow-sm space-y-5">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                <User className="w-4 h-4 text-[#9E0C25]" />
                <span>Personal Information</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">FULL NAME</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">ACCOUNT STATUS</label>
                  <select name="isActive" value={formData.isActive ? "true" : "false"} onChange={(e) => setFormData({...formData, isActive: e.target.value === "true"})} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]">
                    <option value="true">Active</option>
                    <option value="false">Inactive / Blocked</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">DATE OF BIRTH</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">GENDER</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/85 shadow-sm space-y-5">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                <PhoneCall className="w-4 h-4 text-[#9E0C25]" />
                <span>Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">PHONE NUMBER</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">EMAIL ADDRESS</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">STREET ADDRESS</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">CITY</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">REGION / STATE</label>
                  <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Guardians & Save Action */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Guardians & Emergency */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/85 shadow-sm space-y-5">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
                <User className="w-4 h-4 text-[#9E0C25]" />
                <span>Guardians & Emergency</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">GUARDIAN NAME</label>
                  <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">RELATIONSHIP</label>
                  <input type="text" name="relationship" value={formData.relationship} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-extrabold text-[#9E0C25] uppercase tracking-wider">EMERGENCY CONTACT</label>
                  <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-bold text-[#9E0C25] focus:bg-white focus:outline-none focus:border-[#9E0C25]" />
                </div>
              </div>
            </div>

            {/* Save Button Card */}
            <div className="bg-white rounded-[2rem] p-6 border border-stone-200/85 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Ready to save?</h4>
                <p className="text-[11px] text-stone-500 font-medium">Changes will take effect instantly.</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-70 shrink-0"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
{/* PASSWORD UPDATE SECTION */}
<div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/85 shadow-sm space-y-5">
  <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
    <span>Security & Password Reset</span>
  </h3>
  <div className="space-y-4 text-xs">
    <div className="space-y-1.5">
      <label className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">NEW PASSWORD</label>
      <input 
        type="password" 
        value={newPassword} 
        onChange={(e) => setNewPassword(e.target.value)} 
        placeholder="Enter new password (min 6 chars)" 
        className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/85 text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25]" 
      />
    </div>
    <button
      type="button"
      onClick={handleUpdatePassword}
      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
    >
      Update Password Only
    </button>
  </div>
</div>
          </div>

        </div>
      </form>
    </div>
  );
}