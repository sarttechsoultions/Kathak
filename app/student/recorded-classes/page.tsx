"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, FileText, Clock, Loader2, Search, Video, Sparkles } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

interface RecordedClassItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  createdAt: string;
  resources?: string[];
  course?: { title: string };
  batch?: { name: string };
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

export default function StudentRecordedClassesPage() {
  const router = useRouter();
  const [classesList, setClassesList] = useState<RecordedClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  // Clean useEffect implementation
  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ data?: { classes?: RecordedClassItem[] } }>(
          ENDPOINTS.STUDENT_RECORDED_CLASSES || "/student/recorded-classes"
        );
        if (res.data?.classes) {
          setClassesList(res.data.classes);
        }
      } catch (err) {
        console.error("Failed to load recorded classes", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const danceTopics = [
    "All Topics",
    ...Array.from(new Set(classesList.map((c) => c.course?.title).filter(Boolean))) as string[],
  ];

  const filteredClasses = classesList.filter((c) => {
    const matchesTopic = selectedTopic === "All Topics" || c.course?.title === selectedTopic;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans pb-20 max-w-[1300px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CLEAN & PROFESSIONAL HEADER (Font Fixed) */}
      <div className="space-y-3 pb-6 border-b border-stone-200/60">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#900C27] text-xs font-extrabold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Premium Library</span>
        </div>
        
        {/* Changed from font-playfair font-black to font-sans font-bold for a cleaner, modern look */}
        <h1 className="text-3xl sm:text-4xl font-sans font-bold text-stone-900 tracking-tight leading-tight">
          Advance Your Craft
        </h1>
        
        <p className="text-sm font-medium text-stone-500 max-w-2xl leading-relaxed">
          Access our comprehensive archive of dance tutorials. Master every movement, rhythm, and expression at your own pace from our curated collection.
        </p>
      </div>

      {/* INTERACTIVE CONTROLS (Filters & Search) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
        
        {/* Scrollable Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide px-2">
          {danceTopics.map((tpc) => (
            <button
              key={tpc}
              onClick={() => setSelectedTopic(tpc)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                selectedTopic === tpc
                  ? "bg-[#900C27] text-white shadow-md scale-[1.02]"
                  : "bg-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {tpc}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-[320px] shrink-0 px-2 md:px-0 pr-2">
          <Search className="w-4 h-4 text-stone-400 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tutorials, styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-bold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#900C27] focus:ring-4 focus:ring-rose-500/10 transition-all"
          />
        </div>
      </div>

      {/* CARD GRID */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#900C27]" />
          <span className="text-sm font-bold tracking-wide">Loading your library...</span>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-stone-50/50 rounded-3xl border border-stone-200/80 border-dashed">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-stone-100">
            <Video className="w-8 h-8 text-stone-300" />
          </div>
          <div>
            <h3 className="font-bold text-stone-800">No classes found</h3>
            <p className="text-xs text-stone-500 mt-1">Try adjusting your search or selecting a different topic.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredClasses.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[1.5rem] border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Thumbnail Area */}
              <div
                onClick={() => router.push(`/student/recorded-classes/${item.id}`)}
                className="h-48 bg-stone-900 relative overflow-hidden cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail || ""}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/classesbg.png";
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#900C27]/90 backdrop-blur-sm text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/10 shadow-sm">
                  {item.duration || "1 hr"}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-rose-50 text-[#900C27] border border-rose-100 px-3 py-1 rounded-lg font-extrabold text-[10px] uppercase tracking-wider">
                      {item.course?.title || "Masterclass"}
                    </span>
                    <span className="text-[11px] text-stone-400 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-300" />
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>

                  {/* Class Title: Made slightly lighter but still prominent */}
                  <h3
                    onClick={() => router.push(`/student/recorded-classes/${item.id}`)}
                    className="font-sans font-bold text-lg text-stone-900 group-hover:text-[#900C27] transition-colors leading-tight cursor-pointer line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-medium">
                    {item.description || "Join this comprehensive tutorial to refine your techniques and understand the core rhythms of this sequence."}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-5 border-t border-stone-100 flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/student/recorded-classes/${item.id}`)}
                    className="flex-1 bg-[#900C27] hover:bg-[#780A20] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Class</span>
                  </button>

                  <button
                    onClick={() => router.push(`/student/recorded-classes/${item.id}`)}
                    className="flex-1 border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer bg-white active:scale-95"
                  >
                    <FileText className="w-4 h-4 text-stone-400" />
                    <span>{item.resources && item.resources.length > 0 ? `${item.resources.length} Resources` : "Details"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}