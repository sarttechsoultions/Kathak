"use client";

import React from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ShieldCheck,
  Award,
  PhoneCall,
  FileText,
  Clock,
  Layers,
  Pencil,
  Trash2,
} from "lucide-react";
import { TeacherRecord, renderTeacherAvatar } from "./types";

interface TeacherDetailsViewProps {
  teacher: TeacherRecord;
  onBack: () => void;
  onEdit: (teacher: TeacherRecord) => void;
  onDelete: (id: string, name: string) => Promise<void>;
  onToggleStatus: (id: string, name: string, currentStatus: string) => Promise<void>;
}

export const TeacherDetailsView: React.FC<TeacherDetailsViewProps> = ({
  teacher,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-stone-700" />
          <span>Teacher Management</span>
          <span className="text-stone-400">&gt;</span>
          <span className="text-stone-900 font-extrabold">Teacher Details</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(teacher)}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => onDelete(teacher.id, teacher.name)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Teacher Profile Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            {renderTeacherAvatar(teacher.name, teacher.avatar)}
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                teacher.status === "Active" ? "bg-emerald-500" : "bg-stone-400"
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {teacher.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-rose-100 text-rose-800">
                {teacher.expertise || "Senior Faculty"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-500 mt-1.5">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                {teacher.email}
              </span>
              {teacher.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {teacher.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Joined: {teacher.joiningDate || (teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "Active")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <span className="text-xs font-bold text-stone-500">Status:</span>
          <button
            onClick={() => onToggleStatus(teacher.id, teacher.name, teacher.status)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              teacher.status === "Active"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-stone-100 text-stone-600 border border-stone-200"
            }`}
          >
            • {teacher.status}
          </button>
        </div>
      </div>

      {/* 3 Metric Cards for this Teacher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
              ASSIGNED BATCHES
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-sans font-extrabold text-3xl text-[#9E0C25]">
                {teacher.batches?.length || 0}
              </h3>
              <span className="text-xs font-bold text-stone-500">Active Batches</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#9E0C25] flex items-center justify-center font-bold shrink-0">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
              EXPERTISE &amp; CATEGORY
            </p>
            <h3 className="font-sans font-extrabold text-2xl text-stone-900">
              {teacher.expertise || "Kathak"}
            </h3>
            <p className="text-[11px] font-semibold text-stone-400">Classical Dance Department</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
              ACTIVE PERMISSIONS
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-sans font-extrabold text-3xl text-emerald-600">
                {teacher.permissions?.length || 0}
              </h3>
              <span className="text-xs font-bold text-stone-500">Allowed Actions</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Personal & Contact Information */}
        <div className="lg:col-span-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-[#9E0C25] pb-3 border-b border-stone-100">
              <User className="w-4 h-4" />
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                  FULL NAME
                </span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">
                  {teacher.name}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                  NATIONALITY
                </span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">
                  {teacher.nationality || "Indian"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                  MARITAL STATUS
                </span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">
                  {teacher.maritalStatus || "—"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                  LANGUAGES KNOWN
                </span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">
                  {teacher.languagesKnown || "Hindi, English"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-[#9E0C25] pb-3 border-b border-stone-100">
              <Mail className="w-4 h-4" />
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider">
                Contact &amp; Identification Details
              </h3>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                    EMAIL ADDRESS
                  </span>
                  <span className="font-bold text-stone-900 break-all mt-0.5 block">
                    {teacher.email}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                    PHONE NUMBER
                  </span>
                  <span className="font-bold text-stone-900 mt-0.5 block">
                    {teacher.phone || "—"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">
                  RESIDENTIAL ADDRESS
                </span>
                <span className="font-bold text-stone-900 mt-0.5 block">
                  {teacher.address || "Academy Faculty Quarters / Jaipur"}
                </span>
              </div>

              {/* Emergency Contacts */}
              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block mb-1.5">
                  EMERGENCY CONTACTS
                </span>
                <div className="flex flex-wrap gap-2">
                  {teacher.emergency_contact && teacher.emergency_contact.length > 0 ? (
                    teacher.emergency_contact.map((num, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[#9E0C25] font-extrabold text-xs flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{num}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-400 font-normal">None provided</span>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block mb-1.5">
                  BANK DETAILS
                </span>
                <div className="space-y-1">
                  {teacher.bank_details && teacher.bank_details.length > 0 ? (
                    teacher.bank_details.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold"
                      >
                        {b}
                      </div>
                    ))
                  ) : (
                    <span className="text-stone-400 font-normal">No bank records saved</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Batches & Granular Permissions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Assigned Batches */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-[#9E0C25] pb-3 border-b border-stone-100">
              <Briefcase className="w-4 h-4" />
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider">
                Assigned Academy Batches
              </h3>
            </div>

            <div className="space-y-3">
              {teacher.batches && teacher.batches.length > 0 ? (
                teacher.batches.map((batchName, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{batchName}</h4>
                      <p className="text-[11px] text-stone-400 font-semibold">Active Class Schedule</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[10px] uppercase">
                      Assigned
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-stone-400 text-xs font-semibold">
                  No active batches currently assigned to this faculty member.
                </div>
              )}
            </div>
          </div>

          {/* Granular Permissions Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-[#9E0C25] pb-3 border-b border-stone-100">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider">
                Granular Permissions &amp; Access Controls
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {teacher.permissions && teacher.permissions.length > 0 ? (
                teacher.permissions.map((perm, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 font-bold text-xs"
                  >
                    ✓ {perm}
                  </span>
                ))
              ) : (
                <span className="text-stone-400 text-xs font-normal">Standard Faculty Permissions</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
