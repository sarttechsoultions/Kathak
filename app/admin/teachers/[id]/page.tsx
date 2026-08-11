"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeConfirm, openThemeSuccess } from "@/components/ThemeDialogProvider";

// Make sure ye paths aapke project structure se exactly match karein
import { TeacherDetailsView } from "@/components/admin/teachers/TeacherDetailsView";
import { TeacherRecord } from "@/components/admin/teachers/types";

export default function TeacherDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;

  const [teacher, setTeacher] = useState<TeacherRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  if (!teacherId) return;

  const fetchTeacher = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${teacherId}`);
      const match = res.data?.teacher || res.data;

      if (match) {
  const rawEmergencyContact = match.emergency_contact || match.emergencyContact;
  const emergencyContactArray = !rawEmergencyContact
    ? []
    : Array.isArray(rawEmergencyContact)
    ? rawEmergencyContact
    : [rawEmergencyContact];

  const mappedTeacher: TeacherRecord = {
    id: match.id,
    name: match.name || match.fullName,
    title: match.designation || "Kathak Instructor",
    email: match.email,
    phone: match.phone,
    emergency_contact: emergencyContactArray,
    id_proof: match.id_proof || match.idProofUrl || "",
    qualifications: match.qualifications || [],
    bank_details: match.bank_details || match.bankDetails || [],
    avatar: match.avatar || match.avatarUrl || "/Ananya.png",
    batches: match.assignedBatches || match.batches || [],
    status: match.status === "Active" || match.isActive ? "Active" : "Disabled",
    actionType: "Edit Profile",
    category: "Kathak",
    expertise: match.designation || "Senior Instructor",
    permissions: [],
    maritalStatus: match.maritalStatus || "",
    nationality: match.nationality || "Indian",
    languagesKnown: match.languagesKnown || "",
    idProofType: match.idProofType || "",
    address: match.address || "",
    salaryRate: match.salaryRate || "₹ 0.00",
    joiningDate: match.joiningDate || "",
    createdAt: match.createdAt || "",
  };
  setTeacher(mappedTeacher);
} else {
        alert("Teacher not found.");
        router.push("/admin/teachers");
      }
    } catch (err) {
      console.error("Failed to fetch teacher details:", err);
      alert("Failed to fetch teacher details.");
      router.push("/admin/teachers");
    } finally {
      setIsLoading(false);
    }
  };

  fetchTeacher();
}, [teacherId, router]);

  const handleToggleStatus = async (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Disabled" : "Active";
    try {
      await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: newStatus === "Active" }),
      });
      
      await openThemeSuccess(
        `Teacher ${name} status updated to ${newStatus}!`,
        "Faculty Status Updated"
      );
      
      // Optimistic Update: Refresh UI immediately without another API call
      setTeacher((prev) => (prev ? { ...prev, status: newStatus as "Active" | "Disabled" } : null));

    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update teacher status.";
      alert(errorMsg);
    }
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (await openThemeConfirm(`Are you sure you want to delete teacher "${name}"?`, "Delete Teacher")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${id}`, { method: "DELETE" });
        await openThemeSuccess(`Teacher "${name}" deleted successfully from Database!`, "Teacher Deleted");
        router.push("/admin/teachers");
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to delete teacher account.";
        alert(errorMsg);
      }
    }
  };

  if (isLoading || !teacher) {
    return <div className="p-8 text-stone-500 font-bold text-sm animate-pulse">Loading Details...</div>;
  }

  return (
    <TeacherDetailsView
      teacher={teacher}
      onBack={() => router.push("/admin/teachers")}
      onEdit={() => router.push(`/admin/teachers/${teacher.id}/edit`)}
      onDelete={handleDeleteTeacher}
      onToggleStatus={handleToggleStatus}
    />
  );
}