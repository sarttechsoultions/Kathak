"use client";

import React, { useRef } from "react";
import {
  ArrowLeft,
  Info,
  ChevronDown,
  FileText,
  Upload,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { CourseOption, BatchOption } from "./types";

interface CreateAssignmentModalProps {
  newAssignmentTitle: string;
  setNewAssignmentTitle: (val: string) => void;
  newAssignmentCategory: string;
  setNewAssignmentCategory: (val: string) => void;
  newAssignmentCourseId: string;
  setNewAssignmentCourseId: (val: string) => void;
  newAssignmentCourseTitle: string;
  setNewAssignmentCourseTitle: (val: string) => void;
  newAssignmentInstructions: string;
  setNewAssignmentInstructions: (val: string) => void;
  newAssignmentDeadlineDate: string;
  setNewAssignmentDeadlineDate: (val: string) => void;
  newAssignmentDeadlineTime: string;
  setNewAssignmentDeadlineTime: (val: string) => void;
  allowLateSubmissions: boolean;
  setAllowLateSubmissions: (val: boolean) => void;
  selectedTargetBatches: string[];
  toggleBatchSelection: (batchName: string) => void;
  setSelectedTargetBatches: React.Dispatch<React.SetStateAction<string[]>>;
  courses: CourseOption[];
  batches: BatchOption[];
  availableBatchesForSelectedCourse: BatchOption[];
  isPublishing: boolean;
  handlePublishAssignment: (e?: React.FormEvent) => Promise<void>;
  resetCreateForm: () => void;
  onCancel: () => void;
  // Upload props
  uploadedFileUrl: string;
  setUploadedFileUrl: (val: string) => void;
  uploadedFileName: string;
  setUploadedFileName: (val: string) => void;
  uploadingFile: boolean;
  uploadProgress: number;
  setUploadProgress: (val: number) => void;
  uploadedFileType: "image" | "video" | "other";
  setUploadedFileType: (val: "image" | "video" | "other") => void;
  handleAssignmentFileUpload: (file: File) => Promise<void>;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  newAssignmentTitle,
  setNewAssignmentTitle,
  newAssignmentCategory,
  setNewAssignmentCategory,
  newAssignmentCourseId,
  setNewAssignmentCourseId,
  setNewAssignmentCourseTitle,
  newAssignmentInstructions,
  setNewAssignmentInstructions,
  newAssignmentDeadlineDate,
  setNewAssignmentDeadlineDate,
  newAssignmentDeadlineTime,
  setNewAssignmentDeadlineTime,
  allowLateSubmissions,
  setAllowLateSubmissions,
  selectedTargetBatches,
  toggleBatchSelection,
  setSelectedTargetBatches,
  courses,
  batches,
  availableBatchesForSelectedCourse,
  isPublishing,
  handlePublishAssignment,
  resetCreateForm,
  onCancel,
  uploadedFileUrl,
  setUploadedFileUrl,
  uploadedFileName,
  setUploadedFileName,
  uploadingFile,
  uploadProgress,
  setUploadProgress,
  uploadedFileType,
  setUploadedFileType,
  handleAssignmentFileUpload,
}) => {
  const adminInstructionsTextareaRef = useRef<HTMLTextAreaElement>(null);

  const applyAdminInstructionsFormat = (type: "bold" | "italic" | "list" | "link") => {
    const textarea = adminInstructionsTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newAssignmentInstructions.substring(start, end);

    let replacement = "";
    if (type === "bold") {
      replacement = `**${selectedText || "bold text"}**`;
    } else if (type === "italic") {
      replacement = `_${selectedText || "italic text"}_`;
    } else if (type === "list") {
      replacement = selectedText
        ? selectedText.split("\n").map((line) => `• ${line}`).join("\n")
        : "• Step 1\n• Step 2\n• Step 3";
    } else if (type === "link") {
      const url = prompt("Enter URL:", "https://");
      if (url) {
        replacement = `[${selectedText || "Link Title"}](${url})`;
      } else {
        return;
      }
    }

    const newInstructions =
      newAssignmentInstructions.substring(0, start) +
      replacement +
      newAssignmentInstructions.substring(end);
    setNewAssignmentInstructions(newInstructions);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => {
              onCancel();
              resetCreateForm();
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#8C2329] cursor-pointer mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Assignments &gt; Create New
          </button>
          <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Create New Assignment
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onCancel();
              resetCreateForm();
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPublishing}
            onClick={() => handlePublishAssignment()}
            className="px-6 py-2.5 rounded-xl bg-[#8C2329] hover:bg-[#721c21] text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-60 transition-all"
          >
            {isPublishing ? "Publishing..." : "Publish Assignment"}
          </button>
        </div>
      </div>

      <form onSubmit={handlePublishAssignment} className="flex flex-col lg:flex-row items-start gap-8">
        <div className="flex-1 w-full space-y-6">
          {/* Basics */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6 shadow-2xs">
            <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
              <Info className="w-4.5 h-4.5 text-[#8C2329]" /> Assignment Basics
            </h3>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mudras & Expressions Vol. 1"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#8C2329] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Category</label>
                  <div className="relative">
                    <select
                      value={newAssignmentCategory}
                      onChange={(e) => setNewAssignmentCategory(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold appearance-none cursor-pointer focus:border-[#8C2329] focus:outline-none"
                    >
                      <option>Practical Assessment</option>
                      <option>Video Submission</option>
                      <option>Audio Recording</option>
                      <option>Research Paper</option>
                      <option>Mid-term Quiz</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Course</label>
                  <div className="relative">
                    <select
                      value={newAssignmentCourseId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setNewAssignmentCourseId(id);
                        const found = courses.find((c) => c.id === id);
                        const title = found?.title || "";
                        setNewAssignmentCourseTitle(title);

                        const matching = batches.filter((b) => {
                          if (b.courseId && id && b.courseId === id) return true;
                          if (b.courseName && title) {
                            const bCourse = b.courseName.toLowerCase().trim();
                            const selCourse = title.toLowerCase().trim();
                            return bCourse.includes(selCourse) || selCourse.includes(bCourse);
                          }
                          return false;
                        });
                        if (matching.length > 0) {
                          setSelectedTargetBatches([matching[0].name]);
                        } else {
                          setSelectedTargetBatches([]);
                        }
                      }}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold appearance-none cursor-pointer focus:border-[#8C2329] focus:outline-none"
                    >
                      {courses.length === 0 ? (
                        <option value="">No courses found</option>
                      ) : (
                        courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions + File/Video upload */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6 shadow-2xs">
            <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
              <FileText className="w-4.5 h-4.5 text-[#8C2329]" /> Instructions &amp; Resources
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Assignment Instructions
                </label>
                <div className="rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-stone-200 px-4 py-2 flex items-center gap-3 text-xs font-bold text-stone-600 select-none">
                    <button
                      type="button"
                      onClick={() => applyAdminInstructionsFormat("bold")}
                      className="px-2.5 py-1 rounded hover:bg-stone-200 text-stone-800 font-black cursor-pointer transition-colors"
                      title="Bold text (**text**)"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => applyAdminInstructionsFormat("italic")}
                      className="px-2.5 py-1 rounded hover:bg-stone-200 text-stone-800 italic font-black cursor-pointer transition-colors"
                      title="Italic text (_text_)"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => applyAdminInstructionsFormat("list")}
                      className="px-2.5 py-1 rounded hover:bg-stone-200 text-stone-800 font-extrabold cursor-pointer transition-colors"
                      title="Bullet List (• item)"
                    >
                      ≡
                    </button>
                    <button
                      type="button"
                      onClick={() => applyAdminInstructionsFormat("link")}
                      className="px-2.5 py-1 rounded hover:bg-stone-200 text-stone-800 font-extrabold cursor-pointer transition-colors"
                      title="Insert Link ([title](url))"
                    >
                      🔗
                    </button>
                  </div>
                  <textarea
                    ref={adminInstructionsTextareaRef}
                    rows={5}
                    placeholder="Provide detailed steps for the students..."
                    value={newAssignmentInstructions}
                    onChange={(e) => setNewAssignmentInstructions(e.target.value)}
                    className="w-full p-4 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Reference Materials */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Reference Materials (PDF / Video / Audio)
                </label>

                <div
                  onClick={() => {
                    if (!uploadingFile) {
                      document.getElementById("assignment-file-input")?.click();
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    if (uploadingFile) return;
                    const f = e.dataTransfer.files?.[0];
                    if (f) await handleAssignmentFileUpload(f);
                  }}
                  className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-[#8C2329] transition-colors cursor-pointer min-h-[160px]"
                >
                  {uploadingFile && (
                    <div className="w-full max-w-xs space-y-2">
                      <p className="text-xs font-bold text-slate-700">
                        {uploadProgress < 85
                          ? `Uploading file (${uploadProgress}%)...`
                          : uploadProgress < 100
                          ? `Processing & saving to Cloud storage (${uploadProgress}%)...`
                          : `Upload Complete (100%)`}
                      </p>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-[#8C2329] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!uploadingFile && uploadedFileUrl && (
                    <div className="w-full space-y-3">
                      {uploadedFileType === "image" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={uploadedFileUrl}
                          alt="Preview"
                          className="max-h-40 mx-auto rounded-xl object-contain border border-slate-200"
                        />
                      )}

                      {uploadedFileType === "video" && (
                        <video
                          src={uploadedFileUrl}
                          controls
                          className="max-h-48 w-full mx-auto rounded-xl bg-black"
                        />
                      )}

                      {uploadedFileType === "other" && (
                        <div className="text-xs font-semibold text-slate-600 break-all px-2">
                          📎 {uploadedFileName || "File uploaded"}
                        </div>
                      )}

                      <p className="text-[11px] text-emerald-600 font-semibold">
                        ✓ {uploadedFileName}
                      </p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFileUrl("");
                          setUploadedFileName("");
                          setUploadProgress(0);
                          setUploadedFileType("other");
                        }}
                        className="text-[11px] font-bold text-[#8C2329] hover:underline"
                      >
                        Remove &amp; upload another
                      </button>
                    </div>
                  )}

                  {!uploadingFile && !uploadedFileUrl && (
                    <>
                      <div className="w-12 h-12 rounded-full bg-rose-50 text-[#8C2329] flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        Click or drag files to upload
                      </span>
                      <span className="text-[10.5px] text-slate-400 font-medium">
                        PDF, Video (mp4/mov/webm), Audio — Max 50MB
                      </span>
                    </>
                  )}
                </div>

                <input
                  id="assignment-file-input"
                  type="file"
                  accept=".pdf,.doc,.docx,image/*,video/*,audio/*,.mp4,.mov,.webm,.mp3,.wav"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) await handleAssignmentFileUpload(f);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-5 shadow-2xs">
            <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
              <Calendar className="w-4.5 h-4.5 text-[#8C2329]" /> Submission Schedule
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Deadline Date</label>
                <input
                  type="date"
                  value={newAssignmentDeadlineDate}
                  onChange={(e) => setNewAssignmentDeadlineDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-[#8C2329] focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Deadline Time</label>
                <input
                  type="time"
                  value={newAssignmentDeadlineTime}
                  onChange={(e) => setNewAssignmentDeadlineTime(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:border-[#8C2329] focus:outline-none"
                />
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="allowLate"
                  checked={allowLateSubmissions}
                  onChange={(e) => setAllowLateSubmissions(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded cursor-pointer text-[#8C2329]"
                />
                <label htmlFor="allowLate" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Allow late submissions
                </label>
              </div>
            </div>
          </div>

          {/* Target Batches */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4 shadow-2xs">
            <h3 className="font-bold text-base flex items-center gap-2 text-slate-900">
              <CheckSquare className="w-4.5 h-4.5 text-[#8C2329]" /> Target Batches
            </h3>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {availableBatchesForSelectedCourse.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium">No batches available for this course.</p>
              ) : (
                availableBatchesForSelectedCourse.map((batch) => {
                  const isChecked = selectedTargetBatches.includes(batch.name);
                  return (
                    <div
                      key={batch.id}
                      onClick={() => toggleBatchSelection(batch.name)}
                      className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer border transition-all ${
                        isChecked
                          ? "bg-rose-50/50 border-[#8C2329]/40"
                          : "border-slate-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded cursor-pointer text-[#8C2329]"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">{batch.name}</span>
                        {batch.courseName && (
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {batch.courseName}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
