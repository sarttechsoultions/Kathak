"use client";

import React, { useState, useEffect } from "react";
import { Info, Calendar, User, MapPin, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation"; 
import { apiRequest, ENDPOINTS } from "@/lib/api"; // Aapka api helper
import { openThemeSuccess, openThemeError } from "@/components/ThemeDialogProvider"; // Naye custom toast

interface EventData {
  title?: string;
  category?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  durationMins?: number;
  leadInstructorId?: string;
  capacity?: number;
  level?: string;
  registrationFee?: number;
  locationOrLink?: string;
  status?: string;
  isFeatured?: boolean;
  badgeTag?: string;
  bannerImage?: string;
  thumbnailImage?: string;
}
export default function EditEventPage() {
  const router = useRouter();
  const params = useParams(); // URL se dynamic ID lene ke liye
  const eventId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [teachers, setTeachers] = useState<{ id: string; fullName: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState<{ bannerImage: boolean; thumbnailImage: boolean }>({ bannerImage: false, thumbnailImage: false });
  const [isFree, setIsFree] = useState(true);

  // Form State
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
    status: "DRAFT",
    isFeatured: false,
    badgeTag: "",
    bannerImage: "",
    thumbnailImage: "",
  });

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
        body: form,
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

  // Fetch Existing Event Data & Teachers
  useEffect(() => {
    const loadPageData = async () => {
      setIsFetching(true);
      try {
        // 1. Fetch Teachers List
        const teacherRes = await apiRequest<{ status: string; data: { teachers: { id: string; fullName: string }[] } }>(ENDPOINTS.ADMIN_TEACHERS);
        if (teacherRes.status === "success" && teacherRes.data?.teachers) {
          setTeachers(teacherRes.data.teachers);
        }

        // 2. Fetch Existing Event Details
        if (eventId) {
const eventRes = await apiRequest<{ success: boolean; data: EventData }>(`${ENDPOINTS.ADMIN_EVENTS}/${eventId}`);
          if (eventRes.success && eventRes.data) {
            const event = eventRes.data;
            
            // Format dates (Backend bhejta hai '2026-08-17T00:00:00.000Z', input ko chahiye '2026-08-17')
            const formattedStartDate = event.startDate ? event.startDate.split('T')[0] : "";
            const formattedEndDate = event.endDate ? event.endDate.split('T')[0] : "";

            setFormData({
              title: event.title || "",
              category: event.category || "Workshop",
              description: event.description || "",
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              startTime: event.startTime || "",
              durationMins: event.durationMins || 60,
              leadInstructorId: event.leadInstructorId || "",
              capacity: event.capacity || 50,
              level: event.level || "Beginner",
              registrationFee: event.registrationFee || 0,
              locationOrLink: event.locationOrLink || "",
              status: event.status || "DRAFT",
              isFeatured: event.isFeatured || false,
              badgeTag: event.badgeTag || "",
              bannerImage: event.bannerImage || "",
              thumbnailImage: event.thumbnailImage || "",
            });
            setIsFree(!event.registrationFee || event.registrationFee === 0);
          }
        }
      } catch (error: unknown) {
        console.error("Error loading event data:", error);
        openThemeError("Failed to load event details. It might have been deleted.");
        router.push("/admin/events");
      } finally {
        setIsFetching(false);
      }
    };

    loadPageData();
  }, [eventId, router]);

  // Submit Handler (Ab POST ki jagah PUT use hoga)
  const handleSubmit = async (e: React.FormEvent, submitStatus?: "DRAFT" | "SCHEDULED" | "LIVE") => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        durationMins: Number(formData.durationMins),
        capacity: Number(formData.capacity),
        registrationFee: Number(formData.registrationFee),
        leadInstructorId: formData.leadInstructorId || null,
        badgeTag: formData.badgeTag || null,
        bannerImage: formData.bannerImage || null,
        thumbnailImage: formData.thumbnailImage || null,
        status: submitStatus || formData.status,
      };

      // Yahan apiRequest mein method 'PUT' use hoga kyunki hum update kar rahe hain
      const data = await apiRequest<{ success: boolean; message?: string }>(`${ENDPOINTS.ADMIN_EVENTS}/${eventId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (data && data.success !== false) {
        openThemeSuccess("Event updated successfully!");
        router.push("/admin/events"); 
      }
    } catch (error: unknown) {
      console.error("Update error:", error);
      openThemeError((error as { message?: string }).message || "Something went wrong while updating the event.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <p className="text-gray-500 font-medium animate-pulse">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Header */}
      <div className="max-w-[896px] mx-auto mb-8">
        <button onClick={() => router.push("/admin/events")} className="flex items-center gap-2 border border-gray-300 p-2 cursor-pointer text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-[14px] font-medium">Back to Events</span>
        </button>
        <h1 className="text-[32px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Edit Event Orchestrator
        </h1>
        <p className="text-[#464555] text-[16px] mt-1">
          Modify the parameters for your existing institutional engagement.
        </p>
      </div>

      <div className="max-w-[896px] mx-auto space-y-6">
        
        {/* SECTION 1: General */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <div className="w-6 h-6 rounded-full bg-[#9B3434] text-white flex items-center justify-center"><Info size={14} /></div>
            <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>General Information</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Event Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full md:w-1/2 h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] bg-white focus:border-[#9B3434] focus:outline-none">
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Description</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} className="w-full h-[120px] p-4 border border-[#C7C4D8] rounded-[8px] resize-none focus:border-[#9B3434] focus:outline-none" />
            </div>
          </div>
        </div>

        {/* SECTION 2 & 3: Schedule and Instructor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Calendar size={20} className="text-[#9B3434]" />
              <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Schedule Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Start Date</label>
                <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">End Date</label>
                <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Start Time</label>
                <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Duration (Mins)</label>
                <input type="number" name="durationMins" required min="15" value={formData.durationMins} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <User size={20} className="text-[#9B3434]" />
              <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Instructor & Capacity</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Lead Instructor</label>
                <select name="leadInstructorId" value={formData.leadInstructorId} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] bg-white focus:border-[#9B3434] focus:outline-none">
                  <option value="">No instructor assigned</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Capacity</label>
                  <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Level</label>
                  <select name="level" value={formData.level} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] bg-white focus:border-[#9B3434] focus:outline-none">
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

        {/* SECTION 4: Pricing */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <MapPin size={20} className="text-[#9B3434]" />
            <h2 className="text-[18px] font-semibold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pricing & Venue</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Is this event free?</label>
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
                  <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Registration Fee (₹)</label>
                  <input type="number" name="registrationFee" min="0" value={formData.registrationFee} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Location / Virtual Link</label>
              <input type="text" name="locationOrLink" required value={formData.locationOrLink} onChange={handleChange} className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
            </div>
          </div>
        </div>

        {/* SECTION 5: Display & Featured */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-sm">
          <h2 className="text-[18px] font-semibold text-[#0B1C30] mb-6 pb-4 border-b border-gray-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Display & Featured Settings
          </h2>
          <div className="space-y-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 accent-[#9B3434]" />
              <span className="text-[14px] text-[#464555]">Show as featured hero banner on student dashboard</span>
            </label>
            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Badge Tag</label>
              <input type="text" name="badgeTag" value={formData.badgeTag} onChange={handleChange} placeholder="e.g. MOST ANTICIPATED" className="w-full h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] focus:border-[#9B3434] focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Banner Image Upload</label>
                <input type="file" accept="image/*" name="bannerImage" onChange={(e) => handleImageUpload(e, "bannerImage")} className="w-full h-[48px] px-4 py-2 border border-[#C7C4D8] bg-white rounded-[8px] focus:border-[#9B3434] focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[13px] file:font-semibold file:bg-[#9B3434] file:text-white hover:file:bg-[#7A2A2A] cursor-pointer" />
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
                <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Thumbnail Image Upload</label>
                <input type="file" accept="image/*" name="thumbnailImage" onChange={(e) => handleImageUpload(e, "thumbnailImage")} className="w-full h-[48px] px-4 py-2 border border-[#C7C4D8] bg-white rounded-[8px] focus:border-[#9B3434] focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[13px] file:font-semibold file:bg-[#9B3434] file:text-white hover:file:bg-[#7A2A2A] cursor-pointer" />
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
            <div>
              <label className="block text-[12px] font-semibold text-[#464555] uppercase mb-2">Event Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full md:w-1/2 h-[48px] px-4 border border-[#C7C4D8] rounded-[8px] bg-white focus:border-[#9B3434] focus:outline-none">
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="LIVE">Live</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-4 pt-4 pb-12">
          <button type="button" onClick={() => router.push("/admin/events")} className="px-6 py-3 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Cancel
          </button>
          
          {formData.status === "DRAFT" && (
            <button type="button" onClick={(e) => handleSubmit(e, "DRAFT")} disabled={isLoading || uploadingImage.bannerImage || uploadingImage.thumbnailImage} className="px-6 py-3 text-[15px] font-medium text-[#9B3434] bg-white border border-[#9B3434] rounded-[8px] hover:bg-[#9B3434]/5 transition-colors disabled:opacity-50">
              {isLoading ? "Saving..." : "Update Draft"}
            </button>
          )}

          <button type="button" onClick={(e) => handleSubmit(e, formData.status === "DRAFT" ? "SCHEDULED" : undefined)} disabled={isLoading || uploadingImage.bannerImage || uploadingImage.thumbnailImage} className="px-6 py-3 text-[15px] font-medium text-white bg-[#9B3434] rounded-[8px] hover:bg-[#832c2c] transition-colors disabled:opacity-50 shadow-md shadow-[#9B3434]/20">
            {isLoading ? "Saving..." : (formData.status === "DRAFT" ? "Publish Event" : "Update Event")}
          </button>
        </div>

      </div>
    </div>
  );
}