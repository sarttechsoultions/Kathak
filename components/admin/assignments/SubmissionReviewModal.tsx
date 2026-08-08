"use client";

import React from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { VideoSubmissionCard, CriteriaPart, formatVideoUrl } from "./types";

interface SubmissionReviewModalProps {
  selectedVideoReview: VideoSubmissionCard;
  reviewRhythmScore: string;
  setReviewRhythmScore: (val: string) => void;
  criteriaParts: CriteriaPart[];
  setCriteriaParts: React.Dispatch<React.SetStateAction<CriteriaPart[]>>;
  newCriteriaName: string;
  setNewCriteriaName: (val: string) => void;
  reviewPointers: string[];
  setReviewPointers: React.Dispatch<React.SetStateAction<string[]>>;
  newPointerInput: string;
  setNewPointerInput: (val: string) => void;
  reviewFeedbackText: string;
  setReviewFeedbackText: (val: string) => void;
  recalculateOverallGrade: (parts: CriteriaPart[]) => void;
  handleReviewSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  selectedVideoReview,
  reviewRhythmScore,
  setReviewRhythmScore,
  criteriaParts,
  setCriteriaParts,
  newCriteriaName,
  setNewCriteriaName,
  reviewPointers,
  setReviewPointers,
  newPointerInput,
  setNewPointerInput,
  reviewFeedbackText,
  setReviewFeedbackText,
  recalculateOverallGrade,
  handleReviewSubmit,
  onBack,
}) => {
  return (
    <div className="space-y-6 max-w-[1300px] mx-auto animate-in fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 cursor-pointer shadow-2xs text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedVideoReview.studentAvatar}
          alt=""
          className="w-11 h-11 rounded-full object-cover border border-slate-200"
        />
        <div>
          <h2 className="font-bold text-xl text-slate-900">{selectedVideoReview.studentName}</h2>
          <p className="text-xs text-slate-400">{selectedVideoReview.submittedTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10.5px] font-black uppercase text-slate-400 tracking-wider">
                STUDENT SUBMISSION MESSAGE
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Scrollable</span>
            </div>
            <div className="max-h-[160px] overflow-y-auto pr-2 text-xs italic text-slate-700 font-medium leading-relaxed space-y-2 font-sans">
              {selectedVideoReview.message ? (
                selectedVideoReview.message.split("\n\n").map((para, i, arr) => (
                  <p key={i} className="whitespace-pre-line leading-relaxed">
                    {i === 0 ? `“${para}` : para}
                    {i === arr.length - 1 ? `”` : ""}
                  </p>
                ))
              ) : (
                <p className="text-slate-400 font-normal">No submission message attached.</p>
              )}
            </div>
          </div>

          {/* DYNAMIC VIDEO PLAYER WITH IFRAME & DIRECT VIDEO SUPPORT */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video flex items-center justify-center shadow-lg relative min-h-[320px]">
            {(() => {
              const { isIframe, url } = formatVideoUrl(selectedVideoReview.fileUrl);

              if (isIframe) {
                return (
                  <iframe
                    src={url}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }

              return (
                <video
                  key={url}
                  controls
                  autoPlay={false}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallbackApplied) {
                      target.dataset.fallbackApplied = "true";
                      target.src = "https://vjs.zencdn.net/v/oceans.mp4";
                      target.load();
                    }
                  }}
                >
                  <source src={url} type="video/mp4" />
                  <source src={url} type="video/webm" />
                  <source src={url} type="video/ogg" />
                  Your browser does not support video playback.
                </video>
              );
            })()}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xl text-slate-900">Evaluation</h3>
            {(() => {
              const score = parseInt(reviewRhythmScore, 10) || 0;
              if (score >= 85) return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Distinction</span>;
              if (score >= 65) return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">Merit</span>;
              if (score >= 40) return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Pass</span>;
              return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">Review Needed</span>;
            })()}
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-5">
            {/* 1. OVERALL GRADE SCORE */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800">Overall Grade Score (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={reviewRhythmScore}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setReviewRhythmScore("0");
                      return;
                    }
                    const num = parseInt(val, 10);
                    if (isNaN(num)) setReviewRhythmScore("0");
                    else if (num < 0) setReviewRhythmScore("0");
                    else if (num > 100) setReviewRhythmScore("100");
                    else setReviewRhythmScore(num.toString());
                  }}
                  className="w-20 h-10 rounded-xl bg-white border border-slate-200 text-center font-extrabold text-sm text-slate-900 focus:border-[#8C2329] focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            {/* 2. EVALUATION PARTS */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  EVALUATION CRITERIA PARTS
                </span>
                <span className="text-[10px] text-slate-400 font-bold">Auto-Calculates Grade</span>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
                {criteriaParts.map((part, index) => (
                  <div key={part.id || index} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={part.name}
                        onChange={(e) => {
                          const updated = [...criteriaParts];
                          updated[index].name = e.target.value;
                          setCriteriaParts(updated);
                        }}
                        className="flex-1 h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:border-[#8C2329] focus:outline-none"
                      />

                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={part.score}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          const num = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                          const updated = [...criteriaParts];
                          updated[index].score = num;
                          setCriteriaParts(updated);
                          recalculateOverallGrade(updated);
                        }}
                        className="w-16 h-8 rounded-lg bg-white border border-slate-200 text-center font-extrabold text-xs text-[#8C2329] focus:outline-none shadow-2xs"
                      />

                      {criteriaParts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = criteriaParts.filter((_, i) => i !== index);
                            setCriteriaParts(updated);
                            recalculateOverallGrade(updated);
                          }}
                          className="text-slate-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
                          title="Remove Criterion"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8C2329] h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, part.score))}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <input
                    type="text"
                    placeholder="Add criterion name (e.g. Abhinaya)..."
                    value={newCriteriaName}
                    onChange={(e) => setNewCriteriaName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newCriteriaName.trim()) {
                          const updated = [
                            ...criteriaParts,
                            { id: `part-${Date.now()}`, name: newCriteriaName.trim(), score: 50 },
                          ];
                          setCriteriaParts(updated);
                          recalculateOverallGrade(updated);
                          setNewCriteriaName("");
                        }
                      }
                    }}
                    className="flex-1 h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-xs font-medium placeholder-slate-400 focus:border-[#8C2329] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCriteriaName.trim()) {
                        const updated = [
                          ...criteriaParts,
                          { id: `part-${Date.now()}`, name: newCriteriaName.trim(), score: 50 },
                        ];
                        setCriteriaParts(updated);
                        recalculateOverallGrade(updated);
                        setNewCriteriaName("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-2xs cursor-pointer shrink-0"
                  >
                    + Add Part
                  </button>
                </div>
              </div>
            </div>

            {/* 3. KEY EVALUATION POINTERS */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                  KEY EVALUATION POINTERS
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{reviewPointers.length} Added</span>
              </div>

              <div className="space-y-2 text-xs">
                {reviewPointers.map((pointerText, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-rose-100 text-[#8C2329] font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      0{index + 1}
                    </span>
                    <input
                      type="text"
                      value={pointerText}
                      onChange={(e) => {
                        const updated = [...reviewPointers];
                        updated[index] = e.target.value;
                        setReviewPointers(updated);
                      }}
                      className="flex-1 h-8 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:border-[#8C2329] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setReviewPointers(reviewPointers.filter((_, i) => i !== index));
                      }}
                      className="text-slate-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
                      title="Remove Pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom evaluation pointer..."
                    value={newPointerInput}
                    onChange={(e) => setNewPointerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newPointerInput.trim()) {
                          setReviewPointers([...reviewPointers, newPointerInput.trim()]);
                          setNewPointerInput("");
                        }
                      }
                    }}
                    className="flex-1 h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-medium placeholder-slate-400 focus:border-[#8C2329] focus:outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPointerInput.trim()) {
                        setReviewPointers([...reviewPointers, newPointerInput.trim()]);
                        setNewPointerInput("");
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-2xs cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* 4. FEEDBACK COMMENTS */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-extrabold text-slate-700">Feedback Comments</label>
              <textarea
                rows={3}
                placeholder="Provide constructive feedback for the student..."
                value={reviewFeedbackText}
                onChange={(e) => setReviewFeedbackText(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#8C2329] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#8C2329] hover:bg-[#721c21] text-white font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              Submit Grade
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Lock className="w-3.5 h-3.5" /> Grades private until published
          </div>
        </div>
      </div>
    </div>
  );
};
