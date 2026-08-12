import React from "react";
import { SidebarPermission } from "@/lib/permissions";

export interface BankDetail {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolderName: string;
}

export interface DocumentItem {
  title: string;
  type: string;
  url: string;
  file?: File;
  isUploading?: boolean;
}

export interface TeacherRecord {
  id: string;
  name: string;
  fullName?: string;
  title: string;
  email: string;
  avatar: string;
  avatarUrl?: string;
  batches: string[];
  id_proof: string;
  qualifications: string[];
  bank_details: string[]; // Legacy
  bankAccounts?: BankDetail[]; // New
  documents?: DocumentItem[]; // New
  emergency_contact: number[];
  status: "Active" | "Disabled";
  disabledMessage?: string;
  actionType: "Edit Profile" | "Manage Access";
  category: "Kathak" | "Bharatanatyam" | "Contemporary" | "Folk";
  expertise: string;
  phone?: string;
  countryCode?: string;
  permissions?: SidebarPermission[];
  maritalStatus?: string;
  nationality?: string;
  languagesKnown?: string;
  idProofType?: string;
  address?: string;
  salaryRate?: string;
  joiningDate?: string;
  createdAt?: string;
}

export interface DirectoryRecord {
  id: string;
  name: string;
  initials: string;
  expertise: string;
  assignedBatches: string[];
  status: "Active" | "Inactive";
  category: "Classical" | "Folk" | "Contemporary";
  email?: string;
}

export interface DbBatchItem {
  id: string;
  name: string;
  code: string;
  schedule: string;
}

export const ID_PROOF_TYPES = [
  { value: "AADHAR_CARD", label: "Aadhar Card" },
  { value: "PAN_CARD", label: "PAN Card" },
  { value: "DRIVING_LICENCE", label: "Driving Licence" },
  { value: "VOTER_ID", label: "Voter ID" },
  { value: "PASSPORT", label: "Passport" },
  { value: "OTHER", label: "Other" },
] as const;

export const renderTeacherAvatar = (name: string, avatarUrl?: string) => {
  const hasAvatar = avatarUrl && avatarUrl.trim() !== "" && avatarUrl !== "/Ananya.png";
  if (hasAvatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover border-2 border-stone-200 shrink-0"
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = "none";
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
          }
        }}
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-rose-100 text-[#9E0C25] font-extrabold text-sm flex items-center justify-center shrink-0 border-2 border-stone-200">
      {(name || "T")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </div>
  );
};

export const COUNTRY_CODES = [
  { code: "+91", country: "IN", name: "India (+91)" },
  { code: "+1", country: "US", name: "USA / Canada (+1)" },
  { code: "+44", country: "GB", name: "UK (+44)" },
  { code: "+971", country: "AE", name: "UAE (+971)" },
  { code: "+61", country: "AU", name: "Australia (+61)" },
  { code: "+65", country: "SG", name: "Singapore (+65)" },
  { code: "+49", country: "DE", name: "Germany (+49)" },
  { code: "+33", country: "FR", name: "France (+33)" },
  { code: "+81", country: "JP", name: "Japan (+81)" },
  { code: "+974", country: "QA", name: "Qatar (+974)" },
  { code: "+966", country: "SA", name: "Saudi Arabia (+966)" },
  { code: "+968", country: "OM", name: "Oman (+968)" },
  { code: "+965", country: "KW", name: "Kuwait (+965)" },
  { code: "+60", country: "MY", name: "Malaysia (+60)" },
  { code: "+64", country: "NZ", name: "New Zealand (+64)" },
  { code: "+27", country: "ZA", name: "South Africa (+27)" },
] as const;

export const parsePhoneNumber = (rawPhone?: string): { countryCode: string; phoneNumber: string } => {
  if (!rawPhone || rawPhone.trim() === "") {
    return { countryCode: "+91", phoneNumber: "" };
  }
  const clean = rawPhone.trim();
  const matched = COUNTRY_CODES.find((c) => clean.startsWith(c.code));
  if (matched) {
    return {
      countryCode: matched.code,
      phoneNumber: clean.substring(matched.code.length).trim(),
    };
  }
  if (clean.startsWith("+")) {
    const matchPlus = clean.match(/^(\+\d{1,4})\s*(.*)$/);
    if (matchPlus) {
      return { countryCode: matchPlus[1], phoneNumber: matchPlus[2].trim() };
    }
  }
  return { countryCode: "+91", phoneNumber: clean };
};

