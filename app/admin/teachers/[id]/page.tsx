"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeConfirm, openThemeSuccess } from "@/components/ThemeDialogProvider";
import { TeacherDetailsView } from "@/components/admin/teachers/TeacherDetailsView";
import { TeacherRecord } from "@/components/admin/teachers/types";

export default function TeacherDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;

  const [teacher, setTeacher] = useState<TeacherRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeacher = useCallback(async () => {
    if (!teacherId) return;
    setIsLoading(true);
    try {
      const res = await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}`);
      // Find the teacher from the list (matching original logic)
      const teachersList: TeacherRecord[] = res?.data?.teachers || [];
      
      let match = teachersList.find((t: any) => t.id === teacherId) as any;
      
      if (!match) {
        // Try direct fetch if not found in list
        const directRes = await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${teacherId}`);
        match = directRes.data?.teacher || directRes.data;
      }

      if (match) {
        // Map to TeacherRecord format
        const mappedTeacher: TeacherRecord = {
          id: match.id,
          name: match.name || match.fullName,
          title: match.designation || "Kathak Instructor",
          email: match.email,
          phone: match.phone,
          emergency_contact: match.emergency_contact || match.emergencyContact || [],
          id_proof: match.id_proof || match.idProofUrl || "",
          qualifications: match.qualifications || [],
          bank_details: match.bank_details || match.bankDetails || [],
          avatar: match.avatar || match.avatarUrl || "/Ananya.png",
          batches: match.assignedBatches || match.batches || ["Beginners Morning Zen"],
          status: match.status === "Active" || match.isActive ? "Active" : "Disabled",
          actionType: "Edit Profile",
          category: "Kathak",
          expertise: match.designation || "Senior Instructor",
          permissions: match.permissions || ["VIEW_DASHBOARD", "MANAGE_CLASSES"],
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
  }, [teacherId, router]);

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

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
      await fetchTeacher();
    } catch (err: any) {
      alert(err.message || "Failed to update teacher status.");
    }
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (await openThemeConfirm(`Are you sure you want to delete teacher "${name}"?`, "Delete Teacher")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${id}`, { method: "DELETE" });
        await openThemeSuccess(`Teacher "${name}" deleted successfully from Database!`, "Teacher Deleted");
        router.push("/admin/teachers");
      } catch (err: any) {
        alert(err.message || "Failed to delete teacher account.");
      }
    }
  };

  if (isLoading || !teacher) {
    return <div className="p-8 text-stone-500">Loading...</div>;
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
