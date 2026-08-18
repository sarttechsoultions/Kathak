"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Video, Calendar, Clock, Users, UserCheck, 
  AlignLeft, ChevronDown, CheckCircle2, Loader2 
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

export default function ScheduleClassForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Data from backend
  const [batches, setBatches] = useState<{id: string; name: string; teacherName?: string}[]>([]);
  const [teachers, setTeachers] = useState<{id: string, fullName: string}[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    batchId: "",
    teacherName: "",
    date: "",
    startTime: "",
    duration: "60", 
  });

  // Fetch Dropdown Data (Batches & Teachers)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Batches
       const resBatches = await apiRequest<{data: {batches: { id: string; name: string; status: string; teacherName?: string }[]}}>(ENDPOINTS.BATCHES || "/batches");
        if (resBatches?.data?.batches) {
          // NAYA LOGIC: Sirf "Active" batches ko filter karke dropdown mein daalo
          const activeBatchesOnly = resBatches.data.batches.filter(b => b.status === "Active");
          setBatches(activeBatchesOnly);
        }
        // Fetch Teachers
        const resTeachers = await apiRequest<{data: {teachers: {id: string, fullName: string}[]}}>(ENDPOINTS.TEACHERS || "/teachers");
        if (resTeachers?.data?.teachers) setTeachers(resTeachers.data.teachers);
      } catch (err) {
        console.error("Dropdown data load failed", err);
      }
    };
    fetchData();
  }, []);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    
    if (name === "batchId") {
      // Find the selected batch from our loaded batches array
      const selectedBatch = batches.find(b => b.id === value);
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        
        teacherName: selectedBatch?.teacherName || prev.teacherName 
      }));
    } else {
      // Normal input change
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(formData.duration) * 60000);

      const payload = {
        batchId: formData.batchId,
        title: formData.title,
        teacherName: formData.teacherName,
        scheduledStart: startDateTime.toISOString(),
        scheduledEnd: endDateTime.toISOString(),
      };

      // POST TO BACKEND API
      const res = await apiRequest(ENDPOINTS.ADMIN_CLASSES, { 
        method: "POST", 
        body: JSON.stringify(payload) 
      });

      if(res.status === "success") {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin/class-management");
        }, 2000);
      } else {
        alert(res.message || "Failed to schedule class.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 font-sans flex justify-center">
      <div className="w-full max-w-[800px]">
        
        <Link href="/admin/class-management" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#9B3434] transition-colors mb-6 text-[14px] font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Live Classes
        </Link>

        <div className="mb-8">
          <h1 className="text-[#0B1C30] text-[32px] font-bold leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Schedule a Live Class
          </h1>
          <p className="text-[#464555] text-[15px] mt-1">
            Create a new virtual session. The system will automatically generate a secure joining link.
          </p>
        </div>

        <div className="bg-white rounded-[24px] border border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden relative">
          
          {isSuccess && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-[24px] font-bold text-[#0B1C30]">Class Scheduled!</h3>
              <p className="text-stone-500 text-[14px] mt-2">The room has been created successfully.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Video className="w-5 h-5 text-[#9B3434]" />
                <h2 className="text-[16px] font-bold text-[#0B1C30]">Class Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-[#464555] mb-2 flex items-center gap-1.5">
                    <AlignLeft className="w-4 h-4 text-stone-400" /> Class Title
                  </label>
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full bg-stone-50 border border-stone-200 focus:border-[#9B3434] rounded-xl px-4 py-3 text-[14px] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#464555] mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-stone-400" /> Target Batch
                  </label>
                  <div className="relative">
                    <select name="batchId" required value={formData.batchId} onChange={handleInputChange} className="w-full bg-stone-50 border border-stone-200 focus:border-[#9B3434] rounded-xl px-4 py-3 text-[14px] appearance-none focus:outline-none">
                      <option value="" disabled>Select a batch...</option>
                      {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#464555] mb-2 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-stone-400" /> Assign Teacher
                  </label>
                  <div className="relative">
                    <select name="teacherName" required value={formData.teacherName} onChange={handleInputChange} className="w-full bg-stone-50 border border-stone-200 focus:border-[#9B3434] rounded-xl px-4 py-3 text-[14px] appearance-none focus:outline-none">
                      <option value="" disabled>Select instructor...</option>
                      {teachers.map(t => <option key={t.id} value={t.fullName}>{t.fullName}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Clock className="w-5 h-5 text-[#9B3434]" />
                <h2 className="text-[16px] font-bold text-[#0B1C30]">Schedule & Timing</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#464555] mb-2"><Calendar className="w-4 h-4 inline mr-1" /> Date</label>
                  <input type="date" name="date" required min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={handleInputChange} className="w-full bg-stone-50 border border-stone-200 focus:border-[#9B3434] rounded-xl px-4 py-3 text-[14px] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#464555] mb-2"><Clock className="w-4 h-4 inline mr-1" /> Start Time</label>
                  <input type="time" name="startTime" required value={formData.startTime} onChange={handleInputChange} className="w-full bg-stone-50 border border-stone-200 focus:border-[#9B3434] rounded-xl px-4 py-3 text-[14px] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#464555] mb-2">Duration</label>
                  <div className="relative">
                    <select name="duration" value={formData.duration} onChange={handleInputChange} className="w-full bg-stone-50 border border-stone-200 focus:border-[#9B3434] rounded-xl px-4 py-3 text-[14px] appearance-none focus:outline-none">
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="90">1.5 Hours</option>
                      <option value="120">2 Hours</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex justify-end gap-4">
              <button type="submit" disabled={isSubmitting} className="bg-[#9B3434] hover:bg-[#832c2c] disabled:opacity-70 text-white px-8 py-3 rounded-xl font-bold text-[14px] flex items-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />} Schedule Class
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}