"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Film,
  Eye,
  HardDrive,
  BookOpen,
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Play,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess, openThemeConfirm } from "@/components/ThemeDialogProvider";

interface RecordedAsset {
  id: string;
  codeTag: string;
  title: string;
  dateView: string;
  thumbnail: string;
  videoUrl: string;
}

interface RecordedClass {
  id: string;
  title: string;
  createdAt: string;
  thumbnail?: string;
  videoUrl: string;
  course?: { title: string };
  batch?: { name: string };
}

export default function AdminRecordedClassesPage() {
  const router = useRouter();
  const [assetsList, setAssetsList] = useState<RecordedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTab, setCategoryTab] = useState("All Classes");
  const [levelFilter, setLevelFilter] = useState("Filter by Level");
  
  // Dynamic metrics state
  const [totalViews, setTotalViews] = useState(0);

  // Clean useEffect implementation without useCallback
  useEffect(() => {
    const fetchRecordedClasses = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ data?: { classes?: RecordedClass[], totalPlatformViews?: number } }>(
          ENDPOINTS.ADMIN_RECORDED_CLASSES || "/admin/recorded-classes"
        );
        
        if (res.data) {
          if (res.data.classes) {
            const mapped = res.data.classes.map((item) => ({
              id: item.id,
              codeTag: `${item.course?.title || "KTH"} • ${item.batch?.name || "GENERAL"}`,
              title: item.title,
              dateView: `${new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} • Active`,
              thumbnail: item.thumbnail || "",
              videoUrl: item.videoUrl,
            }));
            setAssetsList(mapped);
          }
          // Set real total views from backend if available
          setTotalViews(res.data.totalPlatformViews || 0);
        }
      } catch (err) {
        console.error("Failed to load recorded classes", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordedClasses();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (await openThemeConfirm(`Delete recorded class "${title}"?`, "Delete Recording")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_RECORDED_CLASSES || "/admin/recorded-classes"}/${id}`, { method: "DELETE" });
        openThemeSuccess("Recorded class deleted successfully.", "Deleted");
        // Reload page data after deletion
        window.location.reload(); 
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to delete";
        alert(errorMsg);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1300px] mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#9E0C25] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Classes &gt; Recorded Archives</span>
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
            Recorded Class Archives
          </h1>
          <p className="text-sm font-medium text-stone-500 max-w-xl">
            Access and manage all previously streamed educational sessions, track views, and update metadata.
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/recorded-class/upload")}
          className="px-6 py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Session</span>
        </button>
      </div>

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 group-hover:text-stone-500 transition-colors">Total Recordings</p>
            <h3 className="font-sans font-black text-3xl text-stone-900 mt-1.5">
              {isLoading ? "—" : assetsList.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#9E0C25] flex items-center justify-center shadow-inner">
            <Film className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 group-hover:text-stone-500 transition-colors">Total Views</p>
            <h3 className="font-sans font-black text-3xl text-stone-900 mt-1.5">
              {isLoading ? "—" : totalViews.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 group-hover:text-stone-500 transition-colors">Storage Used</p>
            <h3 className="font-sans font-black text-3xl text-stone-900 mt-1.5">
              {isLoading ? "—" : `${(assetsList.length * 0.45).toFixed(1)} GB`}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 group-hover:text-stone-500 transition-colors">Active Modules</p>
            <h3 className="font-sans font-black text-3xl text-stone-900 mt-1.5">
              {isLoading ? "—" : assetsList.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide px-2">
          {["All Classes", "Kathak Basics", "Chakkar & Footwork", "Abhinaya & Mudras"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCategoryTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                categoryTab === tab
                  ? "bg-[#9E0C25] text-white shadow-md scale-[1.02]"
                  : "bg-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pr-2">
          <div className="relative">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-bold text-stone-700 appearance-none cursor-pointer focus:outline-none focus:border-[#9E0C25] focus:ring-2 focus:ring-rose-500/10 transition-all"
            >
              <option>Filter by Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button className="h-11 px-4 rounded-xl border border-stone-200/80 bg-white text-stone-700 text-xs font-bold flex items-center gap-2 hover:bg-stone-50 transition-colors cursor-pointer">
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* RECORDED ASSETS GRID */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#9E0C25]" />
          <span className="text-sm font-bold tracking-wide">Loading archives...</span>
        </div>
      ) : assetsList.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-stone-50/50 rounded-3xl border border-stone-200/80 border-dashed">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-stone-100">
            <Film className="w-8 h-8 text-stone-300" />
          </div>
          <div>
            <h3 className="font-bold text-stone-800">No recordings found</h3>
            <p className="text-xs text-stone-500 mt-1">Click &quot;Upload New Session&quot; to add your first masterclass.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {assetsList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[1.5rem] border border-stone-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Card Thumbnail */}
              <div
                onClick={() => router.push(`/admin/recorded-class/${item.id}`)}
                className="h-48 bg-stone-900 relative overflow-hidden cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail || "/classesbg.png"}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/classesbg.png";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#9E0C25]/90 backdrop-blur-sm text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-rose-50 text-[#9E0C25] text-[10px] font-black uppercase tracking-wider border border-rose-100">
                    {item.codeTag}
                  </span>
                  
                  <h3
                    onClick={() => router.push(`/admin/recorded-class/${item.id}`)}
                    className="font-sans font-bold text-lg text-stone-900 leading-snug cursor-pointer group-hover:text-[#9E0C25] transition-colors line-clamp-1"
                  >
                    {item.title}
                  </h3>
                  
                  <span className="text-[11px] font-semibold text-stone-400 block">
                    Uploaded: {item.dateView}
                  </span>
                </div>

                <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push(`/admin/recorded-class/${item.id}`)}
                    className="py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-stone-400" />
                    <span>View Detail</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="py-2.5 rounded-xl bg-rose-50 hover:bg-[#9E0C25] hover:text-white border border-rose-100 text-[#9E0C25] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group/btn"
                  >
                    <Trash2 className="w-4 h-4 text-[#9E0C25] group-hover/btn:text-white transition-colors" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200/80 text-xs text-stone-500 font-bold">
        <div>Showing all recordings</div>
        <div className="flex items-center gap-1.5">
          <button className="w-9 h-9 rounded-xl border border-stone-200 text-stone-400 flex items-center justify-center cursor-not-allowed bg-stone-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-[#9E0C25] text-white font-bold flex items-center justify-center shadow-md">
            1
          </button>
          <button className="w-9 h-9 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}