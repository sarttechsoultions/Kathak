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
      const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        const token = localStorage.getItem("kathak_admin_token") || localStorage.getItem("kathak_token");
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${apiBase}/upload/image`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        const data = await res.json();
        return data.data?.url || data.data?.secure_url || data.data?.directUrl || "";
      };

      let finalAvatarUrl = state.avatarUrl;
      if (state.avatarFile) {
        const uploadedUrl = await uploadToCloudinary(state.avatarFile);
        if (uploadedUrl) finalAvatarUrl = uploadedUrl;
      }

      const finalDocuments = await Promise.all(
        state.documents.map(async (doc) => {
          if (doc.file) {
            const uploadedUrl = await uploadToCloudinary(doc.file);
            return { title: doc.title, type: doc.type, url: uploadedUrl || doc.url };
          }
          return { title: doc.title, type: doc.type, url: doc.url };
        })
      );

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
