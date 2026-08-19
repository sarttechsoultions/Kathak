"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FolderKanban,
  FileText,
  Video,
  Music,
  Image as ImageIcon,
  File,
  Plus,
  Trash2,
  Download,
  Loader2,
  Globe,
  Users,
  Search,
  Eye
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Batch {
  id: string;
  name: string;
}

interface User {
  id: string;
  fullName: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  category: string;
  isGlobal: boolean;
  batch?: Batch;
  uploadedBy?: User;
  createdAt?: string;
}

export default function ContentLibraryViewpage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resData = await apiRequest(ENDPOINTS.CONTENT_LIBRARY_ADMIN);
      setResources(resData.data || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load library data";
      toast.error(message || "Failed to load library data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) return;

    try {
      await apiRequest(`${ENDPOINTS.CONTENT_UPLOAD}/${id}`, { method: "DELETE" });
      toast.success("Resource deleted successfully");
      await fetchData();
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to delete resource");
    }
  };

  // ✅ SUPER SMART DOWNLOADER (Fixed Extension Issue)
  const handleDownload = async (url: string, title: string, type: string, id: string) => {
    setDownloadingId(id);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const rawBlob = await response.blob();

      // Ensure proper extension and MIME type
      let ext = "";
      let mimeType = "application/octet-stream";
      
      const upperType = type.toUpperCase();
      if (upperType === "PDF" || upperType === "DOCUMENT") { ext = ".pdf"; mimeType = "application/pdf"; }
      else if (upperType === "VIDEO") { ext = ".mp4"; mimeType = "video/mp4"; }
      else if (upperType === "AUDIO") { ext = ".mp3"; mimeType = "audio/mpeg"; }
      else if (upperType === "IMAGE") { ext = ".jpg"; mimeType = "image/jpeg"; }
      else { ext = ".pdf"; mimeType = "application/pdf"; } // Fallback

      const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "_") || "Kathak_Resource";
      const filename = `${cleanTitle}${ext}`;

      // Re-create blob with explicit MIME type so Windows understands it
      const properBlob = new Blob([rawBlob], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(properBlob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      toast.success("Download complete!");

    } catch (error) {
      console.error("Custom download failed:", error);
      window.open(url, "_blank"); // Fallback in case of CORS errors
    } finally {
      setDownloadingId(null);
    }
  };

  // ✅ VIEW HANDLER
  const handleView = (url: string) => {
    window.open(url, "_blank");
  };

  const getIconConfig = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
      case "DOCUMENT":
        return { icon: <FileText className="w-5 h-5 text-red-500" />, bg: "bg-red-50 border-red-100" };
      case "VIDEO":
        return { icon: <Video className="w-5 h-5 text-purple-500" />, bg: "bg-purple-50 border-purple-100" };
      case "AUDIO":
        return { icon: <Music className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50 border-amber-100" };
      case "IMAGE":
        return { icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-50 border-emerald-100" };
      default:
        return { icon: <File className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50 border-blue-100" };
    }
  };

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#900C27]" />
        <p className="text-stone-500 font-bold text-sm animate-pulse">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-[1400px] mx-auto">
      
      {/* 🌟 Header Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B24] tracking-tight">Content Library</h1>
          <p className="text-sm font-semibold text-stone-500 mt-1">Manage, organize, and share educational resources with your students.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#900C27]/20 focus:border-[#900C27] transition-all"
            />
          </div>

          <Link
            href="/admin/content-library/create-resource"
            className="w-full sm:w-auto bg-[#900C27] hover:bg-[#780A20] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#900C27]/20 hover:shadow-[#900C27]/40 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Resource</span>
          </Link>
        </div>
      </div>

      {/* 🌟 Table Section */}
      {resources.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-[#FCEEED] rounded-full flex items-center justify-center text-[#900C27] mb-5 shadow-inner">
            <FolderKanban className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-extrabold text-[#1B1B24]">Your Library is Empty</h3>
          <p className="text-sm text-stone-500 font-medium max-w-md mt-2 leading-relaxed">
            Upload PDFs, Audio tracks, Videos, and Documents to share them with your students globally or per batch.
          </p>
          <Link
            href="/admin/content-library/create-resource"
            className="mt-8 bg-white border-2 border-[#900C27] text-[#900C27] hover:bg-[#900C27] hover:text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            Upload First Resource
          </Link>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/60 shadow-sm">
          <p className="text-stone-400 font-bold text-lg">No resources found matching &quot;{searchTerm}&quot;</p>
          <button onClick={() => setSearchTerm("")} className="text-[#900C27] font-semibold text-sm mt-2 hover:underline">Clear search</button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-200">
                  <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">File Details</th>
                  <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">Visibility</th>
                  <th className="py-4 px-6 text-xs font-bold text-stone-500 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredResources.map((res) => {
                  const config = getIconConfig(res.type);
                  const isDownloading = downloadingId === res.id;

                  return (
                    <tr key={res.id} className="hover:bg-stone-50/80 transition-colors group">
                      
                      {/* Column 1: Icon & Name */}
                      <td className="py-4 px-6 align-middle min-w-[300px]">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center border ${config.bg} shadow-inner`}>
                            {config.icon}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#1B1B24] text-[15px] group-hover:text-[#900C27] transition-colors line-clamp-1">
                              {res.title}
                            </h4>
                            <p className="text-xs font-semibold text-stone-400 mt-0.5 line-clamp-1 max-w-sm">
                              {res.description || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Category */}
                      <td className="py-4 px-6 align-middle whitespace-nowrap">
                        <span className="bg-stone-100 text-stone-600 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider inline-block">
                          {res.category}
                        </span>
                      </td>

                      {/* Column 3: Visibility */}
                      <td className="py-4 px-6 align-middle whitespace-nowrap">
                        {res.isGlobal ? (
                          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider w-fit">
                            <Globe className="w-3.5 h-3.5" /> Global (All)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider w-fit">
                            <Users className="w-3.5 h-3.5 shrink-0" /> {res.batch?.name || "Specific Batch"}
                          </span>
                        )}
                      </td>

                      {/* Column 4: Actions (View, Download, Delete) */}
                      <td className="py-4 px-6 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* View Button */}
                          <button
                            onClick={() => handleView(res.fileUrl)}
                            className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="View File"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {/* Download Button */}
                          <button
                            onClick={() => handleDownload(res.fileUrl, res.title, res.type, res.id)}
                            disabled={isDownloading}
                            className="p-2 text-stone-400 hover:text-[#900C27] hover:bg-[#FCEEED] rounded-xl transition-colors disabled:opacity-50"
                            title="Download File"
                          >
                            {isDownloading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Download className="w-5 h-5" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-1"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}