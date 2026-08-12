"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";
import { CreateTeacherView } from "@/components/admin/teachers/CreateTeacherView";
import { useTeacherFormState } from "@/components/admin/teachers/useTeacherFormState";

export default function CreateTeacherPage() {
  const router = useRouter();
  const state = useTeacherFormState();

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
  }, [state.setAvailableDbBatches]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.fullName || !state.email || !state.phoneNumber || !state.password) {
      alert("Please fill in all required fields (Full Name, Email, Phone Number, Temporary Password).");
      return;
    }

    state.setIsSubmitting(true);

    try {
      const finalAvatarUrl = state.avatarUrl;

      const finalDocuments = state.documents.map((doc) => ({
        title: doc.title,
        type: doc.type,
        url: doc.url
      }));

      const fullPhone = `${state.countryCode} ${state.phoneNumber}`.trim();

      await apiRequest(ENDPOINTS.ADMIN_TEACHERS, {
        method: "POST",
        body: JSON.stringify({
          fullName: state.fullName,
          email: state.email,
          phone: fullPhone,
          countryCode: state.countryCode,
          phoneNumber: state.phoneNumber,
          password: state.password,
          role: "FACULTY",
          accessLevel: state.accessLevel,
          permissions: state.selectedPermissions,
          avatarUrl: finalAvatarUrl,
          maritalStatus: state.maritalStatus,
          nationality: state.nationality,
          languagesKnown: state.languagesKnown,
          emergencyContact: state.emergencyContacts.map(String),
          bankAccounts: state.bankAccounts,
          assignedBatches: state.assignedBatches,
          documents: finalDocuments,
          dob: state.dob,
          gender: state.gender,
          address: state.address,
          joiningDate: state.joiningDate,
          salaryRate: state.salaryRate,
          designation: state.designation,
          primaryExpertise: state.primaryExpertise,
        }),
      });

      await openThemeSuccess(
        `Teacher account for ${state.fullName} created successfully!`,
        "Teacher Account Created"
      );

      router.push("/admin/teachers");
    } catch (err: any) {
      alert(err.message || "Failed to create teacher account.");
    } finally {
      state.setIsSubmitting(false);
    }
  };

  return (
    <CreateTeacherView
      {...state}
      onSubmit={handleCreateSubmit}
      onCancel={() => router.push("/admin/teachers")}
    />
  );
}
