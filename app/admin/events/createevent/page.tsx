"use client";

import React, { useState, useEffect } from "react";
import { Info, Calendar, User, MapPin, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { apiRequest, ENDPOINTS } from "@/lib/api";
export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<{ id: string; fullName: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState<{ bannerImage: boolean; thumbnailImage: boolean }>({ bannerImage: false, thumbnailImage: false });
  const [isFree, setIsFree] = useState(true);

  // 1. Form State matching Prisma Schema exactly
  const [formData, setFormData] = useState({
    title: "",
    category: "Workshop",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    durationMins: 60,
    leadInstructorId: "",
    capacity: 50,
    level: "Beginner",
    registrationFee: 0,
    locationOrLink: "",
    isFeatured: false,
    badgeTag: "",
    bannerImage: "",
    thumbnailImage: "",
  });

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "bannerImage" | "thumbnailImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const form = new FormData();
      form.append("file", file);

      const response = await apiRequest<{ status: string; data: { url: string } }>(ENDPOINTS.UPLOAD_IMAGE, {
        method: "POST",
        body: form ,
      });

      if (response.status === "success" && response.data?.url) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: response.data.url,
        }));
      }
    } catch (error) {
      console.error(`Failed to upload ${fieldName}:`, error);
      alert(`Failed to upload image. Please try again.`);
    } finally {
      setUploadingImage((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

// 2. Fetch Teachers for Dropdown (100% Backend Driven)
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Aapke naye backend response ke hisaab se interface update kiya
        const response = await apiRequest<{ 
          status: string; 
          data: { teachers: { id: string; fullName: string }[] } 
        }>(ENDPOINTS.ADMIN_TEACHERS);
        
        // 'status === "success"' check kiya aur 'data.teachers' array nikala
        if (response.status === "success" && response.data?.teachers) {
          setTeachers(response.data.teachers);
        } else {
          setTeachers([]);
        }
      } catch (error) {
        console.error("Failed to fetch teachers from backend:", error);
        setTeachers([]); 
      }
    };
    
    fetchTeachers();
  }, []);

  // 3. API Submit Handler
const handleSubmit = async (e: React.FormEvent, status: "DRAFT" | "SCHEDULED") => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Data format ensure karne ke liye (convert string to numbers)
      const payload = {
        ...formData,
        durationMins: Number(formData.durationMins),
        capacity: Number(formData.capacity),
        registrationFee: Number(formData.registrationFee),
        leadInstructorId: formData.leadInstructorId || null,
        badgeTag: formData.badgeTag || null,
        bannerImage: formData.bannerImage || null,
        thumbnailImage: formData.thumbnailImage || null,
        status,
      };

      // YAHAN CHANGE HUA HAI: Purane fetch() ki jagah apiRequest use kiya hai
      const data = await apiRequest<{ success: boolean; message?: string }>(ENDPOINTS.ADMIN_EVENTS, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Backend ka response check karke alert aur redirect 
      if (data && data.success !== false) {
        alert(`Event saved as ${status} successfully!`);
        router.push("/admin/events"); 
      }
    } catch (error: unknown) {
      console.error("Submission error:", error);
      alert((error as { message?: string }).message || "Something went wrong while saving the event.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Header */}
      <div className="max-w-[896px] mx-auto mb-8">
        
        <button 
          onClick={() => router.push('/admin/events')}
          className="flex items-center gap-2 border border-gray-300 p-2 cursor-pointer text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-[14px] font-medium">Back to Events</span>
        </button>
        <h1 className="text-[32px] font-bold text-[#0B1C30] leading-[38.4px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Event Orchestrator
        </h1>
        <p className="text-[#464555] text-[16px] mt-1">
          Configure the parameters for your next institutional engagement.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-[896px] mx-auto space-y-6">
        
        {/* SECTION 1: General Information */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <div className="w-6 h-6 rounded-full bg-[#9B3434] text-white flex items-center justify-center">
              <Info size={14} />
            </div>
            <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              General Information
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Event Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Advanced Quantum Computing Symposium"
                className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434] focus:ring-1 focus:ring-[#9B3434] transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full md:w-1/2 h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] bg-white focus:outline-none focus:border-[#9B3434] focus:ring-1 focus:ring-[#9B3434]"
              >
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed overview of the event's goals and curriculum..."
                className="w-full h-[120px] p-4 border border-[#C7C4D8] rounded-[8px] text-[15px] resize-none focus:outline-none focus:border-[#9B3434] focus:ring-1 focus:ring-[#9B3434]"
              />
            </div>
          </div>
        </div>

        {/* 2-Column Layout for Schedule & Instructor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SECTION 2: Schedule Details */}
          <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Calendar size={20} className="text-[#9B3434]" />
              <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Schedule Details
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Duration (Mins)</label>
                <input
                  type="number"
                  name="durationMins"
                  required
                  min="15"
                  value={formData.durationMins}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Instructor & Capacity */}
          <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <User size={20} className="text-[#9B3434]" />
              <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Instructor & Capacity
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Lead Instructor</label>
                <select
                  name="leadInstructorId"
                  required
                  value={formData.leadInstructorId}
                  onChange={handleChange}
                  className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] bg-white focus:outline-none focus:border-[#9B3434]"
                >
                  <option value="" disabled>Select Instructor</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] bg-white focus:outline-none focus:border-[#9B3434]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All_Levels">All Levels</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Pricing & Venue */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <MapPin size={20} className="text-[#9B3434]" />
            <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Pricing & Venue
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Is this event free?</label>
                <div className="flex items-center gap-6 h-[48px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="isFreeEvent" checked={isFree} onChange={() => { setIsFree(true); setFormData(prev => ({ ...prev, registrationFee: 0 })); }} className="w-4 h-4 accent-[#9B3434]" />
                    <span className="text-[14px] text-[#464555] font-medium">Yes, it&apos;s free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="isFreeEvent" checked={!isFree} onChange={() => setIsFree(false)} className="w-4 h-4 accent-[#9B3434]" />
                    <span className="text-[14px] text-[#464555] font-medium">No, it&apos;s paid</span>
                  </label>
                </div>
              </div>
              
              {!isFree && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Registration Fee (₹)</label>
                  <input
                    type="number"
                    name="registrationFee"
                    min="0"
                    value={formData.registrationFee}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434]"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Location / Virtual Link</label>
              <input
                type="text"
                name="locationOrLink"
                required
                value={formData.locationOrLink}
                onChange={handleChange}
                placeholder="Room 402, North Wing or https://zoom.us/j/..."
                className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Display & Featured Settings */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Display & Featured Settings
            </h2>
          </div>

          <div className="space-y-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-[#9B3434]"
              />
              <span className="text-[14px] text-[#464555]">Show as featured hero banner on student dashboard</span>
            </label>

            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Badge Tag (optional)</label>
              <input
                type="text"
                name="badgeTag"
                value={formData.badgeTag}
                onChange={handleChange}
                placeholder="e.g. MOST ANTICIPATED"
                className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Banner Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  name="bannerImage"
                  onChange={(e) => handleImageUpload(e, "bannerImage")}
                  className="w-full h-[48px] px-4 py-2 border border-[#C7C4D8] bg-white rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[13px] file:font-semibold file:bg-[#9B3434] file:text-white hover:file:bg-[#7A2A2A] cursor-pointer"
                />
                {uploadingImage.bannerImage ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="text-[12px] text-[#9B3434] font-semibold animate-pulse">Uploading...</div>
                    <div className="w-full h-1.5 bg-[#F0EBEB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#9B3434] rounded-full w-full animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  formData.bannerImage && !formData.bannerImage.startsWith("C:\\fakepath") && (
                    <div className="mt-4">
                      <img src={formData.bannerImage} alt="Banner Preview" className="h-24 w-auto object-cover rounded-md border border-[#E0DCE8]" />
                    </div>
                  )
                )}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase tracking-wide mb-2">Thumbnail Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  name="thumbnailImage"
                  onChange={(e) => handleImageUpload(e, "thumbnailImage")}
                  className="w-full h-[48px] px-4 py-2 border border-[#C7C4D8] bg-white rounded-[8px] text-[15px] focus:outline-none focus:border-[#9B3434] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[13px] file:font-semibold file:bg-[#9B3434] file:text-white hover:file:bg-[#7A2A2A] cursor-pointer"
                />
                {uploadingImage.thumbnailImage ? (
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="text-[12px] text-[#9B3434] font-semibold animate-pulse">Uploading...</div>
                    <div className="w-full h-1.5 bg-[#F0EBEB] rounded-full overflow-hidden">
                      <div className="h-full bg-[#9B3434] rounded-full w-full animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  formData.thumbnailImage && !formData.thumbnailImage.startsWith("C:\\fakepath") && (
                    <div className="mt-4">
                      <img src={formData.thumbnailImage} alt="Thumbnail Preview" className="h-24 w-auto object-cover rounded-md border border-[#E0DCE8]" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-4 pt-4 pb-12">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-3 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="button"
            onClick={(e) => handleSubmit(e, "DRAFT")}
            disabled={isLoading || uploadingImage.bannerImage || uploadingImage.thumbnailImage}
            className="px-6 py-3 text-[15px] font-medium text-[#9B3434] bg-white border border-[#9B3434] rounded-[8px] hover:bg-[#9B3434]/5 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save as Draft"}
          </button>

          <button 
            type="button"
            onClick={(e) => handleSubmit(e, "SCHEDULED")}
            disabled={isLoading || uploadingImage.bannerImage || uploadingImage.thumbnailImage}
            className="px-6 py-3 text-[15px] font-medium text-white bg-[#9B3434] rounded-[8px] hover:bg-[#832c2c] transition-colors disabled:opacity-50 shadow-md shadow-[#9B3434]/20"
          >
            {isLoading ? "Saving..." : "Save & Publish"}
          </button>
        </div>

      </div>
    </div>
  );
}