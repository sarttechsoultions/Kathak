"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, MapPin, Globe } from "lucide-react";
import { apiRequest, ENDPOINTS, API_BASE_URL } from "@/lib/api";
import { getFormatVideoUrl } from "@/lib/videoUtils";
import { openThemeSuccess, openThemeConfirm } from "@/components/ThemeDialogProvider";


export default function CourseViewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewingCourse, setViewingCourse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await apiRequest(`${ENDPOINTS.ADMIN_COURSES}/${courseId}`);
        if (res.data) setViewingCourse(res.data);
      } catch (err: unknown) {
        console.error("Failed to fetch course details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  const handleDelete = async () => {
    if (await openThemeConfirm(`Delete course "${viewingCourse.title}"?`, "Delete Course")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_COURSES}/${courseId}`, { method: "DELETE" });
        openThemeSuccess(`Course deleted successfully.`, "Deleted");
        router.push("/admin/courses");
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete course.";
        alert(errorMessage);
      }
    }
  };



  if (isLoading) return <div className="p-8 text-center text-stone-500">Loading course details...</div>;
  if (!viewingCourse) return <div className="p-8 text-center text-stone-500">Course not found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1280px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button onClick={() => router.push("/admin/courses")} className="inline-flex items-center gap-2 font-sans font-bold text-xl sm:text-2xl text-stone-900 hover:text-[#9E0C25] transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-700" />
          <span>Course Details</span>
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/admin/courses/${courseId}/edit`)} className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
            <Pencil className="w-4 h-4 text-white" /> Edit Course
          </button>
          <button onClick={handleDelete} className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="w-full lg:w-72 h-48 rounded-2xl overflow-hidden border border-stone-200 shadow-sm shrink-0 bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewingCourse.thumbnail || "/Ananya.png"} alt={viewingCourse.title} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-800 font-extrabold text-xs uppercase tracking-wider border border-stone-200">
                {viewingCourse.code || `CRS-${viewingCourse.id?.slice(-4).toUpperCase()}`}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                {viewingCourse.published !== false ? "Active" : "Draft"}
              </span>
            </div>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-[#0B1C30] tracking-tight">{viewingCourse.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="block text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">Category</span>
                <span className="font-bold text-xs text-[#0B1C30] block mt-0.5">{viewingCourse.category || "General"}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="block text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">Duration (Group)</span>
                <span className="font-bold text-xs text-[#0B1C30] block mt-0.5">{viewingCourse.groupClassesCount || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="font-sans font-semibold text-[16px] text-[#0B1C30] pb-2 border-b border-stone-100">Course Description</h3>
            <p className="font-sans font-normal text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
              {viewingCourse.description || "No course description provided."}
            </p>
          </div>

          {viewingCourse.videoUrl && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-sans font-semibold text-[16px] text-[#0B1C30] pb-2 border-b border-stone-100">Promotional Video</h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-stone-200 bg-black">
                {(() => {
                  const videoData = getFormatVideoUrl(viewingCourse.videoUrl);
                  if (videoData.isIframe) {
                    return <iframe src={videoData.finalUrl} className="w-full h-full border-0" allowFullScreen />;
                  }
                  return <video src={videoData.finalUrl} controls className="w-full h-full object-cover" />;
                })()}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <h4 className="font-sans font-bold text-sm text-[#0B1C30] pb-2 border-b border-stone-100">Fee Structure Breakdown</h4>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <span className="text-[11px] font-extrabold text-stone-600 uppercase flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Indian Students (INR)</span>
              <div className="flex justify-between text-xs border-b border-stone-200/60 pb-2">
                <span className="text-stone-500 font-semibold">Group Classes</span>
                <span className="font-bold text-[#9E0C25]">₹{viewingCourse.groupFeeINR?.toLocaleString("en-IN") || "0"}/mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 font-semibold">Personal (1-on-1)</span>
                <span className="font-bold text-[#0B1C30]">₹{viewingCourse.oneToOneFeeINR?.toLocaleString("en-IN") || "0"}/class</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
              <span className="text-[11px] font-extrabold text-sky-700 uppercase flex items-center gap-1.5"><Globe className="w-3.5 h-3.5"/> International (USD)</span>
              <div className="flex justify-between text-xs border-b border-sky-100 pb-2">
                <span className="text-stone-500 font-semibold">Group Classes</span>
                <span className="font-bold text-sky-700">${viewingCourse.groupFeeUSD || "0"}/mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 font-semibold">Personal (1-on-1)</span>
                <span className="font-bold text-[#0B1C30]">${viewingCourse.oneToOneFeeUSD || "0"}/class</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}