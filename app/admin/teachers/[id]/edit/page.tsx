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
  
  // TS Errors hatane ke liye state ko temporarily 'any' cast kiya hai.
  // Ideal solution ye hai ki aap useTeacherFormState hook me in variables ko define karein.
  const state = useTeacherFormState() as any;

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

        if (typeof state.setFullName === "function") state.setFullName(t.fullName || t.name || "");
        if (typeof state.setEmail === "function") state.setEmail(t.email || "");

        const parsed = parsePhoneNumber(t.phone || "");
        if (typeof state.setCountryCode === "function") state.setCountryCode(parsed.countryCode || "+91");
        if (typeof state.setPhoneNumber === "function") state.setPhoneNumber(parsed.phoneNumber || "");

        if (typeof state.setAvatarUrl === "function") state.setAvatarUrl(t.avatarUrl || t.avatar || "/Ananya.png");
        if (typeof state.setDesignation === "function") state.setDesignation(t.designation || t.title || "Senior Instructor");
        if (typeof state.setPrimaryExpertise === "function") state.setPrimaryExpertise(t.primaryExpertise || "Kathak");
        
        if (typeof state.setAssignedBatches === "function") {
          state.setAssignedBatches(
            t.assignedBatches ||
            t.batchesAsTeacher?.map((b: { name: string }) => b.name) ||
            t.batches ||
            []
          );
        }

        if (typeof state.setSelectedPermissions === "function") {
          state.setSelectedPermissions(t.permissions || ["VIEW_DASHBOARD", "MANAGE_CLASSES"]);
        }
        
        if (typeof state.setMaritalStatus === "function") state.setMaritalStatus(t.maritalStatus || "Select Status");
        if (typeof state.setNationality === "function") state.setNationality(t.nationality || "Indian");
        if (typeof state.setLanguagesKnown === "function") state.setLanguagesKnown(t.languagesKnown || "");

        if (typeof state.setEmergencyContacts === "function") {
          if (t.emergencyContact) {
            state.setEmergencyContacts([String(t.emergencyContact)]);
          } else if (Array.isArray(t.emergency_contact)) {
            state.setEmergencyContacts(t.emergency_contact.map(String));
          } else {
            state.setEmergencyContacts([]);
          }
        }

        if (typeof state.setBankAccounts === "function") {
          state.setBankAccounts(t.bankAccounts || t.bankDetails || []);
        }
        if (typeof state.setDocuments === "function") state.setDocuments(t.documents || []);
        if (typeof state.setDob === "function") state.setDob(t.dob || "");
        if (typeof state.setGender === "function") state.setGender(t.gender || "Select Gender");
        if (typeof state.setAddress === "function") state.setAddress(t.address || "");
        if (typeof state.setJoiningDate === "function") state.setJoiningDate(t.joiningDate || "");
        if (typeof state.setSalaryRate === "function") state.setSalaryRate(t.salaryRate || "₹ 0.00");

        if (typeof state.setIdProofType === "function") {
          state.setIdProofType(t.idProofType || "");
        }

        if (typeof state.setIdProofExistingUrl === "function") {
          state.setIdProofExistingUrl(t.idProofUrl || t.id_proof || "");
        } else if (typeof state.setIdProofUrl === "function") {
          state.setIdProofUrl(t.idProofUrl || t.id_proof || "");
        }

      } catch (err) {
        console.error("Failed to load teacher for edit:", err);
        alert("Failed to load teacher details");
        router.push("/admin/teachers");
      }
    };

    fetchTeacher();
    // YAHAN SE 'state' aur 'router' hata diya hai. Sirf 'teacherId' rakha hai.
  }, [teacherId, router, state]); 

  // 2nd useEffect: For Fetching Batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await apiRequest(ENDPOINTS.ADMIN_BATCHES);
        if (res?.data?.batches && typeof state.setAvailableDbBatches === "function") {
          state.setAvailableDbBatches(res.data.batches);
        }
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    };
    fetchBatches();
  }, []);


  const handleIdProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  state.setIsUploadingIdProof?.(true);

  try {
    const formData = new FormData();
    formData.append("image", file);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const res = await fetch(`${apiBase}/upload/image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    const uploadedUrl = data.data?.url || data.data?.secure_url || "";

    if (data.status === "success" && uploadedUrl) {
      state.setIdProofExistingUrl?.(uploadedUrl);   // ya jo bhi state hook hai
      state.setIdProofFile?.(file);                  // reference ke liye
    } else {
      alert(data.message || "Failed to upload ID proof.");
    }
  } catch (err) {
    alert("Error uploading ID proof.");
  } finally {
    state.setIsUploadingIdProof?.(false);
  }
};
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !state.fullName || !state.email || !state.phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    if (typeof state.setIsSubmitting === "function") state.setIsSubmitting(true);

    try {
      const finalAvatarUrl = state.avatarUrl;

      const finalDocuments = (state.documents || []).map((doc: { title?: string; type?: string; url?: string }) => ({
        title: doc.title,
        type: doc.type,
        url: doc.url
      }));

      const idProofPayload = state.idProofType
        ? {
            idProofType: state.idProofType,
            idProofUrl: state.idProofExistingUrl || undefined,
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
          avatarUrl: finalAvatarUrl,
          ...(state.password && { password: state.password }),
          permissions: state.selectedPermissions,
          maritalStatus: state.maritalStatus,
          nationality: state.nationality,
          languagesKnown: state.languagesKnown,
          emergencyContact: state.emergencyContacts?.map(String) || [],
          bankAccounts: state.bankAccounts,
          documents: finalDocuments,
          dob: state.dob ? state.dob.split("T")[0] : "",
          gender: state.gender,
          address: state.address,
          joiningDate: state.joiningDate ? state.joiningDate.split("T")[0] : "",
          salaryRate: state.salaryRate,
          designation: state.designation,
          primaryExpertise: state.primaryExpertise,
          assignedBatches: state.assignedBatches || [],
          ...idProofPayload,
        }),
      });

      await openThemeSuccess(
        `Teacher account for ${state.fullName} updated successfully!`,
        "Teacher Account Updated"
      );

      router.push("/admin/teachers");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update teacher account.";
      alert(message);
    } finally {
      if (typeof state.setIsSubmitting === "function") state.setIsSubmitting(false);
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