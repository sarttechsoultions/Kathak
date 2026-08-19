"use client";

import React, { useState, useEffect } from "react";
import { Loader2, UploadCloud, ArrowLeft } from "lucide-react";
import { apiRequest, ENDPOINTS, API_BASE_URL } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Batch {
  id: string;
  name: string;
}

export default function CreateResourcePage() {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [resourceType, setResourceType] = useState("DOCUMENT");
  const [isGlobal, setIsGlobal] = useState(true);
  const [batchId, setBatchId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

useEffect(() => {
    let isMounted = true;

    const loadBatches = async () => {
      try {
        // TypeScript ko API response ka exact structure batayein
        const res = await apiRequest<{ data: { batches: Batch[] } }>(ENDPOINTS.BATCHES);
        if (isMounted) {
          // Correctly extract the array using res.data.batches
          setBatches(res?.data?.batches || []);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : "Failed to load batches";
          toast.error(message);
        }
      }
    };

    void loadBatches();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedFile) {
      return toast.error("Title and File are required");
    }

    setIsUploading(true);
    try {
      // 1. Upload file
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      // ✅ LOGICAL FIX: Default endpoint UPLOAD_IMAGE rakhein
      // Kyunki aapka backend (uploadImage controller) hi Cloudinary par Images aur PDF dono handle karta hai (raw format me).
      let uploadEndpoint = ENDPOINTS.UPLOAD_IMAGE; 
      
      // Sirf Videos ke liye UPLOAD_VIDEO par bhejein
      if (selectedFile.type.startsWith("video/")) {
        uploadEndpoint = ENDPOINTS.UPLOAD_VIDEO;
      }

      // Automatically handles tokens and multipart/form-data
      const uploadData = await apiRequest(uploadEndpoint, {
        method: "POST",
        body: formData 
      });

      // Cloudinary se jo URL backend return karega
      const fileUrl = uploadData?.data?.url || uploadData?.data?.fileUrl || uploadData?.url;

      if (!fileUrl) {
        throw new Error("File uploaded to Cloudinary, but no valid URL received.");
      }

      // 2. Create resource in DB
      await apiRequest(ENDPOINTS.CONTENT_UPLOAD, {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          type: resourceType,
          category,
          isGlobal,
          batchId: isGlobal ? null : batchId, 
          fileUrl
        })
      });

      toast.success("Resource saved to Cloudinary successfully!");
      router.push("/admin/content-library");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed. Please check file limits and network.";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/content-library"
          className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1B24] tracking-tight">Upload New Resource</h1>
          <p className="text-sm font-semibold text-stone-500">Fill in the details below to add a new file to the library.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <form onSubmit={handleUpload} className="p-6 sm:p-8 space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1.5">Resource Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Teental Basic Layout"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#900C27]/20 focus:border-[#900C27] outline-none transition-all text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">File Type *</label>
              <select
                value={resourceType}
                onChange={e => setResourceType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none font-semibold text-sm"
              >
                <option value="DOCUMENT">Document</option>
                <option value="PDF">PDF</option>
                <option value="AUDIO">Audio</option>
                <option value="VIDEO">Video</option>
                <option value="IMAGE">Image</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">Category *</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. Theory, Audio"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none font-semibold text-sm"
              />
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <label className="block text-xs font-bold text-stone-600 mb-3">Visibility Settings</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={isGlobal} onChange={() => setIsGlobal(true)} className="accent-[#900C27] w-4 h-4" />
                <span className="text-sm font-bold text-stone-700">Global (All Students)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!isGlobal} onChange={() => setIsGlobal(false)} className="accent-[#900C27] w-4 h-4" />
                <span className="text-sm font-bold text-stone-700">Specific Batch Only</span>
              </label>
            </div>

            {!isGlobal && (
              <div className="mt-4 pt-4 border-t border-stone-200/60">
                <label className="block text-xs font-bold text-stone-600 mb-1.5">Select Batch *</label>
                <select
                  required={!isGlobal}
                  value={batchId}
                  onChange={e => setBatchId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-[#900C27]/20 focus:border-[#900C27] outline-none font-semibold text-sm"
                >
                  <option value="">-- Choose Batch --</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1.5">Description (Optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Add some details about this resource..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#900C27]/20 focus:border-[#900C27] outline-none font-semibold text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1.5">Attach File *</label>
            <div className="relative border-2 border-dashed border-stone-300 bg-stone-50 rounded-2xl p-8 text-center hover:bg-stone-100 transition-colors group cursor-pointer">
              <input
                type="file"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center border border-stone-100 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-6 h-6 text-[#900C27]" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-[#1B1B24]">
                    {selectedFile ? selectedFile.name : "Click or drag file to upload"}
                  </span>
                  <span className="block text-xs font-semibold text-stone-500 mt-1">
                    Supports PDF, MP3, MP4, JPG, PNG up to 50MB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/content-library"
              className="px-6 py-3 rounded-xl text-stone-500 font-bold text-sm hover:bg-stone-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isUploading}
              className="px-8 py-3 rounded-xl bg-[#900C27] hover:bg-[#780A20] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-70 min-w-[160px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save Resource"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
