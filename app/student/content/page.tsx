"use client";

import React, { useState, useEffect } from "react";
import {
  FolderKanban,
  FileText,
  Video,
  Music,
  Image as ImageIcon,
  File,
  Download,
  Loader2,
  Globe,
  Users
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function StudentContentLibraryPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resData = await apiRequest(ENDPOINTS.CONTENT_LIBRARY_STUDENT);
      setResources(resData.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load library data");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="w-5 h-5 text-red-500" />;
      case "VIDEO": return <Video className="w-5 h-5 text-purple-500" />;
      case "AUDIO": return <Music className="w-5 h-5 text-amber-500" />;
      case "IMAGE": return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      default: return <File className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#900C27]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1B24] tracking-tight">Content Library</h1>
          <p className="text-sm font-semibold text-stone-500">Access your study materials, audio tracks, and videos here.</p>
        </div>
      </div>

      {/* Grid */}
      {resources.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 mb-4">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1B24]">Library is Empty</h3>
          <p className="text-sm text-stone-500 font-medium max-w-md mt-1">
            No study materials have been shared with you yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res) => (
            <div key={res.id} className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm hover:shadow-md transition-all group relative flex flex-col">
              
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center border border-stone-100">
                  {getIcon(res.type)}
                </div>
              </div>

              <h4 className="font-bold text-[#1B1B24] text-base line-clamp-1">{res.title}</h4>
              <p className="text-xs font-semibold text-stone-400 mt-1 mb-4 line-clamp-2 min-h-[32px]">
                {res.description || "No description provided."}
              </p>

              <div className="mt-auto space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-stone-400 uppercase tracking-wider">{res.category}</span>
                  <span className="text-stone-400">
                     By {res.uploadedBy?.fullName || "Admin"}
                  </span>
                </div>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
