"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Lightbulb, Film, Upload } from "lucide-react";
import { apiRequest, ENDPOINTS, API_BASE_URL } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

export default function CreateCoursePage() {
  const router = useRouter();
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("Classical Dance");
  const [newCourseLevel, setNewCourseLevel] = useState("Beginner");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseVideoUrl, setNewCourseVideoUrl] = useState("");
  const [newGroupFeeINR, setNewGroupFeeINR] = useState("2200");
  const [newGroupFeeUSD, setNewGroupFeeUSD] = useState("50");
  const [newGroupClassesCount, setNewGroupClassesCount] = useState("10 classes per month");
  const [newOneToOneFeeINR, setNewOneToOneFeeINR] = useState("600");
  const [newOneToOneFeeUSD, setNewOneToOneFeeUSD] = useState("15");
  const [newOneToOneClassesCount, setNewOneToOneClassesCount] = useState("Minimum 4 classes per month (compulsory)");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Real-time Video Upload State
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiBase}/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.data?.url || data.data?.secure_url || "";
      if (data.status === "success" && imageUrl) {
        setCoverImageUrl(imageUrl);
        openThemeSuccess("Cover image uploaded successfully!", "Upload Success");
      } else alert(data.message || "Failed to upload image.");
    } catch (err: unknown) {
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setVideoProgress(0);

    const formData = new FormData();
    formData.append("video", file);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${apiBase}/upload/video`, true);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setVideoProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        const data = JSON.parse(xhr.responseText);
        const videoUrl = data.data?.url || data.data?.secure_url || "";
        if (data.status === "success" && videoUrl) {
          setNewCourseVideoUrl(videoUrl);
          openThemeSuccess("Video uploaded successfully!", "Upload Success");
        } else {
          alert(data.message || "Failed to upload video.");
        }
      } else {
        alert("Failed to upload video.");
      }
      setIsUploadingVideo(false);
    };

    xhr.onerror = () => {
      alert("Network error occurred during video upload.");
      setIsUploadingVideo(false);
    };

    xhr.send(formData);
  };

  const handlePublishCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return alert("Please enter course title.");

    const payload = {
      title: newCourseName,
      description: newCourseDescription,
      category: newCourseCategory,
      level: newCourseLevel,
      groupFeeINR: Number(newGroupFeeINR.replace(/\D/g, "")) || 0,
      groupFeeUSD: Number(newGroupFeeUSD.replace(/\D/g, "")) || 0,
      groupClassesCount: newGroupClassesCount,
      oneToOneFeeINR: Number(newOneToOneFeeINR.replace(/\D/g, "")) || 0,
      oneToOneFeeUSD: Number(newOneToOneFeeUSD.replace(/\D/g, "")) || 0,
      oneToOneClassesCount: newOneToOneClassesCount,
      thumbnail: coverImageUrl || undefined,
      videoUrl: newCourseVideoUrl || undefined
    };

    try {
      await apiRequest(ENDPOINTS.ADMIN_COURSES, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      openThemeSuccess(`Course published successfully!`, "Course Published");
      router.push("/admin/courses");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save course.";
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[1000px] mx-auto bg-stone-50/30 p-4 sm:p-8 rounded-3xl border border-stone-200/50">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <button onClick={() => router.push("/admin/courses")} className="inline-flex items-center gap-2 font-sans font-bold text-2xl text-stone-900 hover:text-[#9E0C25] transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span>Create a New Course</span>
          </button>
          <p className="text-sm font-medium text-stone-500 mt-1">Configure curriculum details and fee structure.</p>
        </div>
      </div>

      <form onSubmit={handlePublishCourse} className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
          <h3 className="font-bold text-lg text-stone-800 mb-6 flex items-center gap-2"><Info className="w-5 h-5 text-[#9E0C25]" /> General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase">Course Title</label>
              <input type="text" required value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="e.g. Intermediate Kathak" className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:border-[#9E0C25] focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase">Category</label>
              <select value={newCourseCategory} onChange={(e) => setNewCourseCategory(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:border-[#9E0C25] focus:outline-none">
                <option>Classical Dance</option>
                <option>Yoga</option>
                <option>Music Theory</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase">Description / Syllabus</label>
              <textarea rows={4} value={newCourseDescription} onChange={(e) => setNewCourseDescription(e.target.value)} className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:border-[#9E0C25] focus:outline-none resize-none" />
            </div>
          </div>
        </div>

        {/* Fees Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
          <h3 className="font-bold text-lg text-stone-800 mb-6 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" /> Fees & Class Structure</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/80 space-y-5">
              <h4 className="font-bold text-[#9E0C25] border-b border-stone-200 pb-2">Group Classes</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[11px] font-bold text-stone-600">Fee (INR ₹)</label><input type="number" value={newGroupFeeINR} onChange={(e) => setNewGroupFeeINR(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-[#9E0C25]" /></div>
                <div className="space-y-1.5"><label className="text-[11px] font-bold text-stone-600">Fee (USD $)</label><input type="number" value={newGroupFeeUSD} onChange={(e) => setNewGroupFeeUSD(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-[#9E0C25]" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-stone-600">Classes Frequency</label><input type="text" value={newGroupClassesCount} onChange={(e) => setNewGroupClassesCount(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-[#9E0C25]" /></div>
            </div>
            <div className="bg-sky-50/30 rounded-xl p-5 border border-sky-100 space-y-5">
              <h4 className="font-bold text-sky-700 border-b border-sky-100 pb-2">Personal (1-on-1)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[11px] font-bold text-stone-600">Fee (INR ₹)</label><input type="number" value={newOneToOneFeeINR} onChange={(e) => setNewOneToOneFeeINR(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-sky-600" /></div>
                <div className="space-y-1.5"><label className="text-[11px] font-bold text-stone-600">Fee (USD $)</label><input type="number" value={newOneToOneFeeUSD} onChange={(e) => setNewOneToOneFeeUSD(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-sky-600" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[11px] font-bold text-stone-600">Min Requirement</label><input type="text" value={newOneToOneClassesCount} onChange={(e) => setNewOneToOneClassesCount(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-sky-600" /></div>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200">
          <h3 className="font-bold text-lg text-stone-800 mb-6 flex items-center gap-2"><Film className="w-5 h-5 text-indigo-500" /> Media & Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase">Cover Thumbnail</label>
              <label htmlFor="coverImage" className="border-2 border-dashed border-stone-300 rounded-xl h-32 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 cursor-pointer overflow-hidden relative">
                {coverImageUrl ? ( <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" /> ) : isUploading ? ( <span className="text-sm font-semibold text-stone-500 animate-pulse">Uploading...</span> ) : ( <><Upload className="w-5 h-5 text-stone-400 mb-1" /><span className="text-xs font-semibold text-stone-500">Click to upload JPG/PNG</span></> )}
                <input type="file" id="coverImage" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase">Promo Video</label>
              <label htmlFor="promoVideo" className="border-2 border-dashed border-stone-300 rounded-xl h-32 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 cursor-pointer overflow-hidden relative p-4">
                {newCourseVideoUrl ? (
                   <div className="text-center"><Film className="w-6 h-6 text-emerald-500 mx-auto mb-1" /><span className="text-xs font-bold text-emerald-600 block">Video Ready</span></div>
                ) : isUploadingVideo ? (
                  <div className="w-full text-center space-y-2">
                    <div className="w-full bg-stone-200 rounded-full h-2.5">
                      <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${videoProgress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 block">{videoProgress}% Uploaded</span>
                  </div>
                ) : (
                  <><Upload className="w-5 h-5 text-stone-400 mb-1" /><span className="text-xs font-semibold text-stone-500">Click to upload MP4</span></>
                )}
                <input type="file" id="promoVideo" className="hidden" accept="video/*" onChange={handleVideoUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4 border-t border-stone-200">
          <button type="button" onClick={() => router.push("/admin/courses")} className="px-6 py-3 rounded-xl font-bold text-sm text-stone-600 hover:bg-stone-100 transition-colors">Cancel</button>
          <button type="submit" className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#9E0C25] hover:bg-[#800A1E] shadow-md transition-colors">Publish Course</button>
        </div>
      </form>
    </div>
  );
}