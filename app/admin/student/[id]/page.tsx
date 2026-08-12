"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  GraduationCap,
  Calendar,
  User,
  PhoneCall,
  BarChart3,
  BookOpen,
  Users,
  FileText,
  Pencil,
  Loader2
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    const fetchStudentDetail = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest(`${ENDPOINTS.ADMIN_STUDENTS}/${studentId}`);
        setStudent(res.data?.student || res.data);
      } catch (error) {
        console.error("Failed to load student details", error);
        alert("Student details not found.");
        router.push("/admin/student");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentDetail();
  }, [studentId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#9E0C25]" />
        <p className="text-sm font-bold text-stone-500">Loading student profile...</p>
      </div>
    );
  }

  if (!student) return null;

  const activeEnrollment = student.enrollments?.[0];
  const activeBatchMembership = student.batchMemberships?.[0];
  const courseTitle = activeEnrollment?.course?.title || "—";
  const batchName = activeBatchMembership?.batch?.name || "—";
  const batchTiming = activeBatchMembership?.batch?.schedule || "—";
  const assignedGuru = activeBatchMembership?.batch?.teacherName || "—";
  const courseLevel = activeBatchMembership?.batch?.level || student.skillLevel || "—";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-[1300px] mx-auto pb-16">
      <button
        onClick={() => router.push("/admin/student")}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-stone-200/80 shadow-sm text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-all cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Directory</span>
      </button>

      {/* HERO BANNER CARD */}
      <div className="bg-white rounded-[2rem] border border-stone-200/80 shadow-lg shadow-stone-200/40 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-stone-900 to-[#9E0C25] relative p-6 flex items-end">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="p-6 sm:p-10 pt-0 flex flex-col sm:flex-row items-start justify-between gap-6 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 w-full">
            <div className="relative group shrink-0">
              <Image
                src={student.avatarUrl || "/Ananya.png"}
                alt={student.fullName || "Student Avatar"}
                width={128}
                height={128}
                unoptimized
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <button className="w-9 h-9 rounded-full bg-[#9E0C25] text-white flex items-center justify-center absolute -bottom-2 -right-2 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 flex-1 sm:pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-sans font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
                        {student.fullName || "—"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-stone-500 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
                            <GraduationCap className="w-4 h-4 text-[#9E0C25]" />
                            {courseLevel}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200">
                            <Calendar className="w-4 h-4 text-stone-400" />
                            Joined: {student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : "—"}
                        </span>
                    </div>
                  </div>
                  
                  <button 
                     onClick={() => router.push(`/admin/student/${student.id}/edit`)}
                     className="px-6 py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0">
                    <Pencil className="w-4 h-4" />
                    Edit Profile
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
              <User className="w-4 h-4 text-[#9E0C25]" />
              <span>Personal Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-5 text-xs">
              <div>
                <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">FULL NAME</span>
                <span className="font-bold text-sm text-stone-900 mt-0.5 block">{student.fullName || "—"}</span>
              </div>
              <div>
                <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">DATE OF BIRTH</span>
                <span className="font-bold text-sm text-stone-900 mt-0.5 block">
                  {student.dob ? new Date(student.dob).toLocaleDateString() : "—"}
                </span>
              </div>
              <div>
                <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">GENDER</span>
                <span className="font-bold text-sm text-stone-900 mt-0.5 block">{student.gender || "—"}</span>
              </div>
              <div>
                <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">BATCH</span>
                <span className="font-bold text-sm text-stone-900 mt-0.5 block">{batchName}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
              <PhoneCall className="w-4 h-4 text-[#9E0C25]" />
              <span>Contact Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">PHONE NUMBER</span>
                <span className="font-bold text-sm text-stone-900 mt-0.5 block">{student.phone || "—"}</span>
              </div>
              <div>
                <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">EMAIL ADDRESS</span>
                <span className="font-bold text-sm text-stone-900 mt-0.5 block">{student.email || "—"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">RESIDENTIAL ADDRESS</span>
                <span className="font-bold text-sm text-stone-800 leading-relaxed mt-0.5 block">
                  {[student.address, student.city, student.region, student.country].filter(Boolean).join(", ") || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
              <BarChart3 className="w-4 h-4 text-[#9E0C25]" />
              <span>Performance & Financial Summary</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 text-center flex flex-col justify-center">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">ATTENDANCE</span>
                <span className="font-black text-3xl text-stone-900 mt-1.5 block">{student.attendanceRate || "0%"}</span>
              </div>
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/60 text-center flex flex-col justify-center">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">ASSIGNMENTS</span>
                <span className="font-black text-2xl text-stone-900 mt-1.5 block">{student.assignmentsScore || "0 / 10"}</span>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center flex flex-col justify-center">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">FEE STATUS</span>
                <div className="mt-2 text-xs">
                  <span className="block font-bold text-stone-600 mb-1">Paid via {student.paymentMethod?.toUpperCase() || "Online"}</span>
                  <span className="inline-block px-2.5 py-0.5 rounded border border-emerald-200 bg-white font-black text-emerald-600">SUCCESS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
              <FileText className="w-4 h-4 text-[#9E0C25]" />
              <span>Academic Performance & Tests</span>
            </h3>
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 border-dashed">
                 <p className="text-sm font-bold text-stone-400">No recent exam records available for this student.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
              <BookOpen className="w-4 h-4 text-[#9E0C25]" />
              <span>Academic Profile</span>
            </h3>
            <div className="space-y-4 text-xs font-semibold text-stone-600">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span>Course Name</span>
                <span className="font-bold text-stone-900">{courseTitle}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span>Current Level</span>
                <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 border border-rose-100 text-[#9E0C25]">
                  {courseLevel}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span>Batch Timing</span>
                <span className="font-bold text-stone-900">{batchTiming}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span>Assigned Guru</span>
                <span className="font-bold text-stone-900">{assignedGuru}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
              <Users className="w-4 h-4 text-[#9E0C25]" />
              <span>Guardians & Emergency</span>
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">GUARDIAN NAME</span>
                <span className="font-bold text-sm text-stone-900 mt-1 block">{student.guardianName || "—"}</span>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">RELATIONSHIP</span>
                <span className="font-bold text-sm text-stone-900 mt-1 block">{student.relationship || "—"}</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#9E0C25]">EMERGENCY CONTACT</span>
                <span className="font-black text-sm text-[#9E0C25] mt-1 block tracking-wide">{student.emergencyContact || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}