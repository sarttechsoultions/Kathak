"use client";

import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  PhoneCall,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff,
  Camera,
  Upload,
  FileText,
  ShieldCheck,
  Loader2,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { SidebarPermission, MODULE_PERMISSIONS_MATRIX } from "@/lib/permissions";
import { DbBatchItem, BankDetail, DocumentItem, ID_PROOF_TYPES, COUNTRY_CODES } from "./types";

interface EditTeacherViewProps {
  teacherId: string;
  fullName: string;
  setFullName: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  primaryExpertise: string;
  setPrimaryExpertise: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  countryCode: string;
  setCountryCode: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  joiningDate: string;
  setJoiningDate: (val: string) => void;
  designation: string;
  setDesignation: (val: string) => void;
  assignedBatches: string[];
  setAssignedBatches: React.Dispatch<React.SetStateAction<string[]>>;
  availableDbBatches: DbBatchItem[];
  salaryRate: string;
  setSalaryRate: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  accessLevel: "FACULTY" | "ADMIN";
  setAccessLevel: (val: "FACULTY" | "ADMIN") => void;
  selectedPermissions: SidebarPermission[];
  setSelectedPermissions: React.Dispatch<React.SetStateAction<SidebarPermission[]>>;
  avatarUrl: string;
  setAvatarUrl: (val: string) => void;
  maritalStatus: string;
  setMaritalStatus: (val: string) => void;
  nationality: string;
  setNationality: (val: string) => void;
  languagesKnown: string;
  setLanguagesKnown: (val: string) => void;
  emergencyContacts: string[];
  setEmergencyContacts: React.Dispatch<React.SetStateAction<string[]>>;
  emergencyContactInput: string;
  setEmergencyContactInput: (val: string) => void;
  addEmergencyContact: () => void;
  bankAccounts: BankDetail[];
  setBankAccounts: React.Dispatch<React.SetStateAction<BankDetail[]>>;
  bankAccountInput: BankDetail;
  setBankAccountInput: React.Dispatch<React.SetStateAction<BankDetail>>;
  addBankAccount: () => void;
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

export const EditTeacherView: React.FC<EditTeacherViewProps> = ({
  teacherId,
  fullName,
  setFullName,
  dob,
  setDob,
  gender,
  setGender,
  primaryExpertise,
  setPrimaryExpertise,
  email,
  setEmail,
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  joiningDate,
  setJoiningDate,
  designation,
  setDesignation,
  assignedBatches,
  setAssignedBatches,
  availableDbBatches,
  salaryRate,
  setSalaryRate,
  password,
  setPassword,
  accessLevel,
  setAccessLevel,
  selectedPermissions,
  setSelectedPermissions,
  avatarUrl,
  maritalStatus,
  setMaritalStatus,
  nationality,
  setNationality,
  languagesKnown,
  setLanguagesKnown,
  emergencyContacts,
  setEmergencyContacts,
  emergencyContactInput,
  setEmergencyContactInput,
  addEmergencyContact,
  bankAccounts,
  setBankAccounts,
  bankAccountInput,
  setBankAccountInput,
  addBankAccount,
  documents,
  setDocuments,
  handlePhotoUpload,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);

  // Dedicated Password Update Toggle & Input States
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer uppercase mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Directory</span>
          </button>
          <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Edit Teacher Profile
          </h1>
          <p className="text-xs font-semibold text-stone-400">
            Editing faculty ID: <span className="text-[#9E0C25] font-bold">{teacherId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onCancel}
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
            <span>{isSubmitting ? "Updating..." : "Update Teacher Profile"}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
        {/* Personal Information */}
        <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-5">
          <div className="flex items-center gap-2 text-[#9E0C25]">
            <User className="w-4 h-4" />
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Personal Information</h4>
          </div>

          <div className="space-y-5 text-xs font-semibold">
            {/* Profile Photo */}
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
                  <span>Change Profile Photo</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">MARITAL STATUS</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                >
                  <option>Select Status</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">NATIONALITY</label>
                <input
                  type="text"
                  placeholder="e.g. Indian"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-stone-700 font-bold uppercase text-[10.5px]">LANGUAGES KNOWN</label>
              <input
                type="text"
                placeholder="e.g. Hindi, English, Rajasthani"
                value={languagesKnown}
                onChange={(e) => setLanguagesKnown(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
              />
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-2">
              <label className="block text-stone-700 font-bold uppercase text-[10.5px]">EMERGENCY CONTACT</label>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {emergencyContacts.length === 0 ? (
                    <span className="text-xs text-stone-400 font-medium italic">No emergency contact numbers added yet.</span>
                  ) : (
                    emergencyContacts.map((num, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[#9E0C25] font-extrabold text-xs flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{num}</span>
                        <button
                          type="button"
                          onClick={() => setEmergencyContacts(emergencyContacts.filter((_, i) => i !== idx))}
                          className="hover:text-stone-900 cursor-pointer font-bold"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <input
                    type="text"
                    placeholder="Enter emergency contact number"
                    value={emergencyContactInput}
                    onChange={(e) => setEmergencyContactInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addEmergencyContact();
                      }
                    }}
                    className="flex-1 h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                  />
                  <button
                    type="button"
                    onClick={addEmergencyContact}
                    className="h-10 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-2">
              <label className="block text-stone-700 font-bold uppercase text-[10.5px]">BANK DETAILS</label>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-3">
                <div className="flex flex-col gap-2">
                  {bankAccounts.length === 0 ? (
                    <span className="text-xs text-stone-400 font-medium italic">No bank details added yet.</span>
                  ) : (
                    bankAccounts.map((detail, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-stone-900 text-xs flex flex-col gap-1 relative">
                        <button
                          type="button"
                          onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 hover:text-rose-700 cursor-pointer text-stone-400 font-bold"
                        >
                          ✕
                        </button>
                        <span className="font-extrabold text-[#9E0C25] text-sm">{detail.bankName}</span>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-semibold text-stone-700">
                          <span>A/C: <span className="font-bold">{detail.accountNumber}</span></span>
                          <span>IFSC: <span className="font-bold">{detail.ifsc}</span></span>
                          <span className="col-span-2">Holder: <span className="font-bold">{detail.accountHolderName || "N/A"}</span></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                  <input
                    type="text"
                    placeholder="Bank Name *"
                    value={bankAccountInput.bankName}
                    onChange={(e) => setBankAccountInput({ ...bankAccountInput, bankName: e.target.value })}
                    className="h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                  />
                  <input
                    type="text"
                    placeholder="Account Number *"
                    value={bankAccountInput.accountNumber}
                    onChange={(e) => setBankAccountInput({ ...bankAccountInput, accountNumber: e.target.value })}
                    className="h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                  />
                  <input
                    type="text"
                    placeholder="IFSC Code *"
                    value={bankAccountInput.ifsc}
                    onChange={(e) => setBankAccountInput({ ...bankAccountInput, ifsc: e.target.value })}
                    className="h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                  />
                  <input
                    type="text"
                    placeholder="Account Holder Name"
                    value={bankAccountInput.accountHolderName}
                    onChange={(e) => setBankAccountInput({ ...bankAccountInput, accountHolderName: e.target.value })}
                    className="h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                  />
                  <button
                    type="button"
                    onClick={addBankAccount}
                    className="sm:col-span-2 h-10 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs cursor-pointer"
                  >
                    + Add Bank Account
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Expertise */}
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

        {/* Contact Details */}
        <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-5">
          <div className="flex items-center gap-2 text-[#9E0C25]">
            <Mail className="w-4 h-4" />
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Contact &amp; Identification</h4>
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

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">DOCUMENTS (ID PROOF, CERTIFICATES, ETC.)</label>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs group hover:border-rose-200 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 text-stone-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="font-bold text-stone-900 truncate">
                              {doc.url ? (
                                <a href={doc.url} target="_blank" rel="noreferrer" className="hover:underline hover:text-[#9E0C25]">{doc.title}</a>
                              ) : (
                                doc.title
                              )}
                            </span>
                            <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">{doc.type}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                          className="w-8 h-8 rounded-lg hover:bg-rose-100 text-stone-400 hover:text-rose-600 font-bold flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-stone-100">
                    <select
                      id="doc-type-select"
                      className="w-full sm:w-auto h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                    >
                      <option value="AADHAR_CARD">Aadhar Card</option>
                      <option value="PAN_CARD">PAN Card</option>
                      <option value="RESUME">Resume / CV</option>
                      <option value="CERTIFICATE">Certificate</option>
                      <option value="OTHER">Other</option>
                    </select>
                    
                    <input
                      type="file"
                      id="doc-upload"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        const selectEl = document.getElementById("doc-type-select") as HTMLSelectElement;
                        const typeVal = selectEl?.options[selectEl.selectedIndex].text || "Document";
                        
                        if (file) {
                          setDocuments([...documents, {
                            title: file.name,
                            type: typeVal,
                            url: "",
                            file: file
                          }]);
                          e.target.value = '';
                        }
                      }}
                    />
                    <label
                      htmlFor="doc-upload"
                      className="flex-1 w-full h-10 px-4 rounded-xl border border-dashed border-stone-300 hover:border-[#9E0C25] hover:bg-rose-50 text-stone-600 hover:text-[#9E0C25] font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Browse File
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">PHONE NUMBER *</label>
                <div className="flex items-center gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-36 h-11 px-3 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-bold text-xs focus:outline-none focus:border-[#9E0C25] shrink-0 cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
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

        {/* Professional Details */}
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

        {/* Account Credentials & Password Update (Interactive Toggle as requested!) */}
        <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-5">
          <div className="flex items-center gap-2 text-[#9E0C25]">
            <KeyRound className="w-4 h-4" />
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Account Credentials &amp; Security</h4>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Password Update Card */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-500" />
                    Teacher Password
                  </span>
                  <p className="text-[11px] text-stone-400 font-medium">
                    {isUpdatingPassword
                      ? "Enter new credentials below to change faculty password."
                      : "Password is securely stored. Click update to reset or set a new password."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsUpdatingPassword(!isUpdatingPassword);
                    if (isUpdatingPassword) {
                      setPassword("");
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isUpdatingPassword
                      ? "bg-stone-200 text-stone-800"
                      : "bg-[#9E0C25] text-white hover:bg-[#800A1E] shadow-2xs"
                  }`}
                >
                  {isUpdatingPassword ? "Cancel Password Change" : "Update Password"}
                </button>
              </div>

              {/* Dynamic Input Field: Only shown when "Update Password" is clicked! */}
              {isUpdatingPassword && (
                <div className="pt-3 border-t border-stone-100 space-y-2 animate-in fade-in duration-200">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">
                    NEW PASSWORD *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && password.length < 6 && (
                    <p className="text-[11px] text-rose-600 font-semibold">
                      Password must be at least 6 characters.
                    </p>
                  )}
                  {password && password.length >= 6 && (
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready to update on form save.
                    </p>
                  )}
                </div>
              )}
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

        {/* Granular Teacher Permissions & Sub-Actions Matrix */}
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

        {/* Submit Bottom Bar */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
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
            <span>{isSubmitting ? "Updating..." : "Save Teacher Profile"}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
