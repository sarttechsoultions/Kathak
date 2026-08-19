"use client";

import React, { useState } from "react";
import {
  Users,
  User,
  Plus,
  Trash2,
  Pencil,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { TeacherRecord, DirectoryRecord, renderTeacherAvatar } from "./types";

interface MainTeacherListProps {
  facultyList: TeacherRecord[];
  directoryList: DirectoryRecord[];
  metrics: {
    totalActiveFaculty: number;
    classesToday: number;
    averageRating: string;
  };
  isLoading: boolean;
  onOpenCreateForm: () => void;
  onOpenEditForm: (faculty: TeacherRecord) => void;
  onViewTeacherDetails: (faculty: TeacherRecord) => void;
  onToggleStatus: (id: string, name: string, currentStatus: string) => Promise<void>;
  onDeleteTeacher: (id: string, name: string) => Promise<void>;
}

export const MainTeacherList: React.FC<MainTeacherListProps> = ({
  facultyList,
  directoryList,
  metrics,
  isLoading,
  onOpenCreateForm,
  onOpenEditForm,
  onViewTeacherDetails,
  onToggleStatus,
  onDeleteTeacher,
}) => {
  const [directoryFilter, setDirectoryFilter] = useState<"All" | "Classical" | "Folk" | "Contemporary">("All");

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Teacher Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-500">
            Manage your team of professional dance instructors and their assignments.
          </p>
        </div>

        <button
          onClick={onOpenCreateForm}
          className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-center uppercase tracking-wide"
        >
          <User className="w-4 h-4" />
          <span>+ Add New Teacher</span>
        </button>
      </div>

      {/* 3 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
              TOTAL ACTIVE FACULTY
            </p>
            <div className="flex items-baseline gap-3">
              <h3 className="font-sans font-extrabold text-3xl text-stone-900">
                {metrics.totalActiveFaculty}
              </h3>
              <span className="text-xs font-bold text-[#9E0C25]">Active Faculty</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-stone-50 text-stone-300 flex items-center justify-center font-bold shrink-0">
            <Users className="w-8 h-8 text-stone-300" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1">
          <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
            CLASSES TODAY
          </p>
          <h3 className="font-sans font-extrabold text-3xl text-stone-900">
            {metrics.classesToday}
          </h3>
          <div className="w-16 h-1 bg-[#9E0C25] rounded-full mt-2" />
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-1">
          <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
            AVERAGE RATING
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="font-sans font-extrabold text-3xl text-stone-900">
              {metrics.averageRating}
            </h3>
            <span className="text-amber-500 font-extrabold text-lg">★</span>
          </div>
          <p className="text-[11px] font-semibold text-stone-400">Live verified reviews</p>
        </div>
      </div>

      {isLoading && (
        <div className="p-12 rounded-3xl bg-white border border-stone-200/80 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#9E0C25] animate-spin" />
          <p className="text-xs font-mono font-bold text-stone-400 uppercase">
            Loading faculty records...
          </p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyList.map((faculty) => (
            <div
              key={faculty.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => onViewTeacherDetails(faculty)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    {renderTeacherAvatar(faculty.name, faculty.avatar)}
                    <div>
                      <h4 className="font-bold text-base text-stone-900 group-hover:text-[#9E0C25] transition-colors leading-tight">
                        {faculty.name}
                      </h4>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase mt-1 bg-rose-100 text-rose-800">
                        {faculty.expertise}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleStatus(faculty.id, faculty.name, faculty.status)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      faculty.status === "Active" ? "bg-[#9E0C25]" : "bg-stone-300"
                    }`}
                    title={faculty.status === "Active" ? "Click to Disable" : "Click to Activate"}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        faculty.status === "Active" ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs font-semibold text-stone-400 truncate">{faculty.email}</p>

                {faculty.status === "Active" ? (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-stone-500">Batches: </span>
                    <span className="font-semibold text-stone-700">
                      {faculty.batches && faculty.batches.length > 0
                        ? faculty.batches.join(", ")
                        : "No Batches Assigned"}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{faculty.disabledMessage || "Account Temporarily Disabled"}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewTeacherDetails(faculty)}
                  className="px-3.5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  title="View Full Profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => onOpenEditForm(faculty)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs transition-colors cursor-pointer text-center"
                >
                  {faculty.actionType || "Edit Profile"}
                </button>

                <button
                  onClick={() => onDeleteTeacher(faculty.id, faculty.name)}
                  className="p-2 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-xl cursor-pointer"
                  title="Delete Teacher Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div
            onClick={onOpenCreateForm}
            className="bg-white rounded-3xl p-8 border-2 border-dashed border-stone-300 hover:border-[#9E0C25] transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-3 group shadow-xs min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#9E0C25] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-base text-stone-900">Add New Faculty</h4>
              <p className="text-xs text-stone-400 font-medium mt-0.5">Expand the Kinetic expert team</p>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Directory Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-sans font-bold text-xl text-stone-900">Teacher Directory</h3>

          <div className="flex items-center gap-2">
            {(["All", "Classical", "Folk", "Contemporary"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setDirectoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  directoryFilter === cat
                    ? "bg-[#9E0C25] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                <th className="py-3.5 px-4">NAME &amp; EXPERTISE</th>
                <th className="py-3.5 px-4">ASSIGNED BATCHES</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
              {directoryList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-stone-400 font-semibold">
                    No teachers found in database. Click + Add New Teacher to add your first faculty member.
                  </td>
                </tr>
              ) : (
                directoryList
                  .filter((d) => directoryFilter === "All" || d.category === directoryFilter)
                  .map((item) => {
                    const matchedFaculty = facultyList.find((f) => f.id === item.id);
                    return (
                      <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <div
                            onClick={() => {
                              if (matchedFaculty) onViewTeacherDetails(matchedFaculty);
                            }}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="w-8 h-8 rounded-full bg-rose-100 text-[#9E0C25] font-extrabold text-xs flex items-center justify-center shrink-0">
                              {item.initials}
                            </div>
                            <div>
                              <h5 className="font-bold text-stone-900 text-sm group-hover:text-[#9E0C25] transition-colors">
                                {item.name}
                              </h5>
                              <p className="text-[10.5px] font-semibold text-stone-400">{item.expertise}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.assignedBatches.map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className="px-2.5 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-[10.5px]"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10.5px] border border-emerald-200">
                            • {item.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {matchedFaculty && (
                              <button
                                onClick={() => onViewTeacherDetails(matchedFaculty)}
                                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-900 cursor-pointer"
                                title="View Teacher Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (matchedFaculty) {
                                  onOpenEditForm(matchedFaculty);
                                }
                              }}
                              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-900 cursor-pointer"
                              title="Edit Teacher Profile"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
