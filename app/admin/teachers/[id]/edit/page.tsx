"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
import { EditTeacherView } from "@/components/admin/teachers/EditTeacherView";
import { useTeacherFormState } from "@/components/admin/teachers/useTeacherFormState";
import { parsePhoneNumber } from "@/components/admin/teachers/types";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  const state = useTeacherFormState();

  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacher = async () => {
      try {
        const res = await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${teacherId}`);
        const t = res.data?.teacher || res.data;

        if (!t) {
          alert("Teacher data not found");
          router.push("/admin/teachers");
          return;
        }

        state.setFullName(t.fullName || t.name || "");
        state.setEmail(t.email || "");

        const parsed = parsePhoneNumber(t.phone || "");
        state.setCountryCode(parsed.countryCode || "+91");
        state.setPhoneNumber(parsed.phoneNumber || "");

        state.setAvatarUrl(t.avatarUrl || t.avatar || "/Ananya.png");
        state.setDesignation(t.designation || t.title || "Senior Instructor");
        state.setPrimaryExpertise(t.primaryExpertise || "Kathak");
        state.setAssignedBatches(
          t.assignedBatches ||
          t.batchesAsTeacher?.map((b: any) => b.name) ||
          t.batches ||
          []
        );
        state.setSelectedPermissions(t.permissions || ["VIEW_DASHBOARD", "MANAGE_CLASSES"]);
        state.setMaritalStatus(t.maritalStatus || "Select Status");
        state.setNationality(t.nationality || "Indian");
        state.setLanguagesKnown(t.languagesKnown || "");

        if (t.emergencyContact) {
          state.setEmergencyContacts([String(t.emergencyContact)]);
        } else if (Array.isArray(t.emergency_contact)) {
          state.setEmergencyContacts(t.emergency_contact.map(String));
        } else {
          state.setEmergencyContacts([]);
        }

        state.setBankDetailsList(t.bankDetails || t.bank_details || []);
        state.setIdProofType(t.idProofType || "");
        state.setIdProofExistingUrl(t.idProofUrl || t.id_proof || "");
      } catch (err) {
        console.error("Failed to load teacher for edit:", err);
        alert("Failed to load teacher details");
        router.push("/admin/teachers");
      }
    };

    fetchTeacher();
  }, [teacherId]);

  useEffect(() => {
    // Fetch batches for assignment
    const fetchBatches = async () => {
      try {
        const res = await apiRequest(ENDPOINTS.ADMIN_BATCHES);
        if (res?.data?.batches) {
          state.setAvailableDbBatches(res.data.batches);
        }
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    };
    fetchBatches();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !state.fullName || !state.email || !state.phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    state.setIsSubmitting(true);

    try {
      const idProofPayload = state.idProofType
        ? {
            idProofType: state.idProofType,
            idProofFileName: state.idProofFile?.name || undefined,
          }
        : {};

      const fullPhone = `${state.countryCode} ${state.phoneNumber}`.trim();

      await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${teacherId}`, {
        method: "PUT",
        body: JSON.stringify({
          fullName: state.fullName,
          email: state.email,
          phone: fullPhone,
          countryCode: state.countryCode,
          phoneNumber: state.phoneNumber,
          avatarUrl: state.avatarUrl,
          ...(state.password && { password: state.password }),
          permissions: state.selectedPermissions,
          maritalStatus: state.maritalStatus,
          nationality: state.nationality,
          languagesKnown: state.languagesKnown,
          emergencyContact: state.emergencyContacts.map(Number),
          bankDetails: state.bankDetailsList,
          assignedBatches: state.assignedBatches,
          ...idProofPayload,
        }),
      });

      await openThemeSuccess(
        `Teacher account for ${state.fullName} updated successfully!`,
        "Teacher Account Updated"
      );

      router.push("/admin/teachers");
    } catch (err: any) {
      alert(err.message || "Failed to update teacher account.");
    } finally {
      state.setIsSubmitting(false);
    }
  };

  return (
    <EditTeacherView
      {...state}
      teacherId={teacherId}
      onSubmit={handleEditSubmit}
      onCancel={() => router.push("/admin/teachers")}
    />
  );
}
