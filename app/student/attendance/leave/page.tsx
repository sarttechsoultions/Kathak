"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Loader2, UploadCloud, File as FileIcon, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function LeaveApplicationPage() {
  const router = useRouter();
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [totalDays, setTotalDays] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        setTotalDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
      } else {
        setTotalDays(0);
      }
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setAttachmentUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiRequest(ENDPOINTS.UPLOAD_IMAGE, {
        method: "POST",
        body: formData,
      });
      
      if (response?.data?.fileUrl || response?.data?.url) {
        setAttachmentUrl(response.data.fileUrl || response.data.url);
        toast.success("Attachment uploaded successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload attachment");
      setFileName("");
      setAttachmentUrl("");
    } finally {
      setAttachmentUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalDays <= 0) {
      toast.error("End date must be after start date.");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for your leave.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest(ENDPOINTS.STUDENT_LEAVE, {
        method: "POST",
        body: JSON.stringify({
          leaveType,
          startDate,
          endDate,
          totalDays,
          reason,
          attachment: attachmentUrl
        })
      });
      toast.success("Leave application submitted successfully!");
      setTimeout(() => {
        router.push("/student/attendance");
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit leave application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-[800px] mx-auto pb-12 mt-6">
      <div className="flex items-center gap-4">
        <Link href="/student/attendance" className="p-2 bg-white rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </Link>
        <div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-stone-900">Apply for Leave</h1>
          <p className="text-sm text-stone-500 mt-1">Submit a new leave application to your teachers.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[#0B1C30] font-semibold focus:ring-2 focus:ring-[#9E0C25]/20 focus:border-[#9E0C25] transition-all outline-none"
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Family Emergency">Family Emergency</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[#0B1C30] font-semibold focus:ring-2 focus:ring-[#9E0C25]/20 focus:border-[#9E0C25] transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[#0B1C30] font-semibold focus:ring-2 focus:ring-[#9E0C25]/20 focus:border-[#9E0C25] transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">Total Days</label>
            <div className="w-full h-12 px-4 rounded-xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-between text-[#464555]">
              <span className="text-[14px]">Calculated Duration</span>
              <span className="font-bold text-[#9E0C25]">{totalDays > 0 ? `${totalDays} Day${totalDays > 1 ? 's' : ''}` : "Invalid"}</span>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">Reason for Leave</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              placeholder="Please provide a valid reason for your leave application..."
              className="w-full p-4 rounded-xl border border-gray-200 text-[#0B1C30] font-medium placeholder-gray-400 focus:ring-2 focus:ring-[#9E0C25]/20 focus:border-[#9E0C25] transition-all outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[14px] font-normal uppercase text-[#464555] tracking-[0.7px] mb-2">
              ATTACHMENT <span className="normal-case text-gray-400 ml-1 tracking-normal">(Optional)</span>
            </label>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileChange} 
            />
            {attachmentUrl ? (
              <div className="w-full border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-bold text-stone-900 truncate">{fileName}</div>
                    <a href={attachmentUrl} target="_blank" rel="noreferrer" className="text-xs text-[#9E0C25] hover:underline">View uploaded file</a>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setAttachmentUrl(""); setFileName(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="p-2 text-gray-400 hover:bg-white hover:text-rose-500 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => !attachmentUploading && fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed ${attachmentUploading ? 'border-gray-200 bg-gray-50' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'} rounded-xl flex flex-col items-center justify-center py-10 transition-all`}
              >
                {attachmentUploading ? (
                  <>
                    <Loader2 className="w-7 h-7 text-[#9E0C25] mb-3 animate-spin" />
                    <div className="text-[14px] font-semibold text-[#0B1C30] mb-1">Uploading attachment...</div>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-7 h-7 text-gray-500 mb-3" />
                    <div className="text-[14px] font-semibold text-[#0B1C30] mb-1">Click to upload medical certificates or documents</div>
                    <div className="text-[12px] text-[#464555]">PDF, JPG, PNG (Max 5MB)</div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-gray-100">
            <Link href="/student/attendance" className="px-6 py-3 rounded-xl text-sm font-bold text-[#464555] hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || attachmentUploading}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-[#9E0C25] text-white hover:bg-rose-800 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
