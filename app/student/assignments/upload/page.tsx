"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  ChevronLeft,
  Calendar,
  Award,
  Sparkles,
  Play,
  HelpCircle,
  CheckCircle2,
  FileVideo,
  X
} from "lucide-react";

export default function StudentAssignmentUploadPage() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/student/assignments");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* BREADCRUMB HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
          <Link href="/student/assignments" className="hover:text-[#900C27] transition-colors">
            My Assignments
          </Link>
          <span>›</span>
          <span className="text-stone-700">Upload Submission</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="bg-[#FDF2F4] text-[#900C27] border border-rose-200 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            KATHAK
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1B24]">
          Rhythmic Footwork Week 3
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
          Demonstrate proficiency in &apos;Tatkar&apos; variations at three distinct speeds (Laya).
        </p>

        {/* Due Date & Max Marks Badges */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
          <div className="bg-stone-50 border border-stone-200/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-stone-700 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Due Date:</span>
            <span className="font-bold text-[#1B1B24]">Oct 24, 2024</span>
          </div>

          <div className="bg-sky-50 border border-sky-100 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-sky-800 font-semibold">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>Max Marks:</span>
            <span className="font-bold text-sky-900">100 pts</span>
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN GRID (Left Dropzone & Notes | Right Guidelines & Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Video Dropzone & Submission Notes Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* VIDEO SUBMISSION DROPZONE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-[#900C27]" />
                <span>Video Submission</span>
              </label>

              <div className="border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/40 rounded-2xl p-8 text-center transition-all relative group cursor-pointer">
                <input
                  type="file"
                  accept="video/mp4,video/mov"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />

                <div className="w-14 h-14 rounded-2xl bg-white border border-sky-100 text-[#900C27] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div className="space-y-1 pt-4">
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Selected: {selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-bold text-[#1B1B24]">
                        Drag and drop your video file here
                      </h3>
                      <p className="text-xs text-stone-500">
                        or click to browse your local storage
                      </p>
                    </>
                  )}

                  <div className="text-[10px] text-stone-400 font-medium pt-2 flex items-center justify-center gap-4">
                    <span>Supported: MP4, MOV</span>
                    <span>•</span>
                    <span>Max Size: 500MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMISSION NOTES */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider block">
                SUBMISSION NOTES (OPTIONAL)
              </label>
              <textarea
                rows={4}
                placeholder="Add any specific details you want your teacher to know about your practice session..."
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-[#900C27] rounded-xl p-3.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-colors"
              />
            </div>

            {/* BOTTOM BUTTONS */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <Link
                href="/student/assignments"
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#900C27] hover:bg-[#780A20] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Assignment</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* RIGHT COLUMN: Submission Guidelines & Reference Video (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CARD 1: SUBMISSION GUIDELINES */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-[#1B1B24]">
                Submission Guidelines
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold">❖</span>
                <div>
                  <span className="font-bold text-[#1B1B24] block">Optimal Lighting</span>
                  <span className="text-stone-500">Ensure the room is well-lit. Avoid recording against a bright window or backlight.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold">❖</span>
                <div>
                  <span className="font-bold text-[#1B1B24] block">Full Body View</span>
                  <span className="text-stone-500">Position the camera to capture your entire form, from head to toes, to allow for posture evaluation.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-sky-600 font-bold">❖</span>
                <div>
                  <span className="font-bold text-[#1B1B24] block">Clear Audio</span>
                  <span className="text-stone-500">Ensure your footwork sounds (Ghungroo) are clearly audible over any background music.</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: REFERENCE VIDEO */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
            <div className="h-32 rounded-xl bg-stone-900 overflow-hidden relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gurukul-dancer.jpg"
                alt="Reference Video"
                className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/classesbg.png";
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white" />
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">REFERENCE VIDEO</span>
              <h4 className="text-sm font-bold text-[#1B1B24]">Laya Variations Guide</h4>
            </div>

            <button className="w-full border border-stone-200 hover:border-stone-300 text-[#900C27] font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-[#900C27]" />
              <span>Watch Tutorial</span>
            </button>
          </div>

          {/* CARD 3: NEED HELP BANNER */}
          <div className="bg-sky-50/80 border border-sky-100 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-700" />
              <h4 className="text-xs font-bold text-sky-950">Need help with uploading?</h4>
            </div>
            <a href="#support" className="text-xs font-semibold text-[#900C27] hover:underline block">
              Contact IT Support
            </a>
          </div>

        </div>

      </div>

      {isSubmitted && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Assignment Submitted Successfully! Redirecting...</span>
        </div>
      )}

    </div>
  );
}
