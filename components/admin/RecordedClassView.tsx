"use client";

import React, { useState } from "react";
import {
  Upload,
  Film,
  Eye,
  HardDrive,
  BookOpen,
  ChevronDown,
  SlidersHorizontal,
  Pencil,
  Link2,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Music,
  ArrowLeft,
  Calendar,
  User,
  Play,
  Share2,
  Trash2,
  Plus,
  Check,
  Info,
  X,
  FileVideo
} from "lucide-react";

interface RecordedAsset {
  id: string;
  codeTag: string;
  title: string;
  dateView: string;
  resources: { name: string; icon: "pdf" | "music" }[];
  isPublic: boolean;
  isDownloadable: boolean;
  thumbnail: string;
  isArchived?: boolean;
}

const mockKathakRecordedAssets: RecordedAsset[] = [
  {
    id: "rec-1",
    codeTag: "KTH101 • BEGINNER",
    title: "Introduction to Kathak Tatkar & Rhythm",
    dateView: "Oct 12, 2023 • 1,204 Views",
    resources: [
      { name: "Tatkar_Notes_L1.pdf", icon: "pdf" },
      { name: "Rhythm_beat_sample.mp3", icon: "music" }
    ],
    isPublic: true,
    isDownloadable: true,
    thumbnail: "/kathak_course_dancer_1785146082697.jpg"
  },
  {
    id: "rec-2",
    codeTag: "KTH204 • INTERMEDIATE",
    title: "Advanced Chakkar Techniques & Footwork",
    dateView: "Oct 08, 2023 • 894 Views",
    resources: [
      { name: "Chakkar_Form_Guide.pdf", icon: "pdf" }
    ],
    isPublic: true,
    isDownloadable: true,
    thumbnail: "/kathak_dancer_portrait_1785143850699.jpg"
  },
  {
    id: "rec-3",
    codeTag: "KTH300 • ADVANCED",
    title: "Abhinaya & Expression Masterclass",
    dateView: "Oct 05, 2023 • 412 Views",
    resources: [
      { name: "Hast_Mudra_Catalog.pdf", icon: "pdf" }
    ],
    isPublic: true,
    isDownloadable: true,
    thumbnail: "/gurukul-dancer.jpg"
  },
  {
    id: "rec-4",
    codeTag: "KTH100 • ARCHIVED",
    title: "Foundations of Jaipur Gharana Tradition (2022)",
    dateView: "Sep 15, 2022 • 2.4K Views",
    resources: [],
    isPublic: false,
    isDownloadable: false,
    thumbnail: "/kathak_ghungroo_feet_1785143864334.jpg",
    isArchived: true
  }
];

export default function RecordedClassView() {
  const [assetsList, setAssetsList] = useState<RecordedAsset[]>(mockKathakRecordedAssets);
  const [categoryTab, setCategoryTab] = useState("All Classes");
  const [levelFilter, setLevelFilter] = useState("Filter by Level");
  const [selectedDate, setSelectedDate] = useState("");

  // Upload New Session View State
  const [isUploadingNewSession, setIsUploadingNewSession] = useState(false);

  // Upload Form State (Exact Figma Match)
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionCourse, setSessionCourse] = useState("Kathak Foundations");
  const [sessionLevel, setSessionLevel] = useState("Intermediate (L2)");
  const [topicTags, setTopicTags] = useState<string[]>(["Tatkar", "Footwork"]);
  const [tagInput, setTagInput] = useState("");
  
  // Toggles
  const [makePublic, setMakePublic] = useState(true);
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [notifyStudents, setNotifyStudents] = useState(true);

  // File Upload State Mock
  const [uploadedFileName, setUploadedFileName] = useState("intro_to_kathak_tatkar_session1.mp4");
  const [uploadProgress, setUploadProgress] = useState(74);

  const togglePublic = (id: string) => {
    setAssetsList(
      assetsList.map((a) => (a.id === id ? { ...a, isPublic: !a.isPublic } : a))
    );
  };

  const toggleDownloadable = (id: string) => {
    setAssetsList(
      assetsList.map((a) => (a.id === id ? { ...a, isDownloadable: !a.isDownloadable } : a))
    );
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !topicTags.includes(tagInput.trim())) {
      setTopicTags([...topicTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTopicTags(topicTags.filter((t) => t !== tag));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RecordedAsset = {
      id: `rec-${Date.now()}`,
      codeTag: `KTH-${Math.floor(100 + Math.random() * 900)} • ${sessionLevel.toUpperCase()}`,
      title: sessionTitle || "Intro to Kathak Tatkar & Rhythm Masterclass",
      dateView: `${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} • 1 View`,
      resources: [
        { name: "Tatkar_Notes_v1.pdf", icon: "pdf" },
        { name: "Rhythm_Beat_Track.mp3", icon: "music" }
      ],
      isPublic: makePublic,
      isDownloadable: allowDownloads,
      thumbnail: "/kathak_course_dancer_1785146082697.jpg"
    };

    setAssetsList([created, ...assetsList]);
    alert(`Session "${created.title}" uploaded successfully!`);
    setIsUploadingNewSession(false);
    setSessionTitle("");
    setSessionDescription("");
  };

  return (
    <div>
      {/* ================= VIEW 1: RECORDED CLASS ARCHIVES GRID ================= */}
      {!isUploadingNewSession ? (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
                <span>Live Classes</span>
                <span>&gt;</span>
                <span className="text-[#9E0C25] font-bold">Recorded Archives</span>
              </div>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Recorded Class Archives
              </h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500">
                Access and download all previously streamed educational sessions.
              </p>
            </div>

            <button
              onClick={() => setIsUploadingNewSession(true)}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Session</span>
            </button>
          </div>

          {/* 4 Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL RECORDINGS</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">1,284</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#9E0C25] flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL VIEWS</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">45.2K</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">STORAGE USED</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">2.4 TB <span className="text-xs font-semibold text-stone-400">/ 5 TB</span></h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">ACTIVE MODULES</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">86</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filter Tabs & Selectors */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {["All Classes", "Kathak Basics", "Chakkar & Footwork", "Abhinaya & Mudras"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCategoryTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoryTab === tab
                      ? "bg-[#9E0C25] text-white shadow-md"
                      : "bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="relative">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="h-10 pl-4 pr-9 rounded-xl bg-white border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:outline-none"
                >
                  <option>Filter by Level</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button className="px-4 py-2 rounded-xl border border-stone-200/80 bg-white text-stone-700 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-50 cursor-pointer">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          {/* Recorded Assets Video Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assetsList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Thumbnail Box */}
                <div className="relative aspect-video bg-stone-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-85"
                  />

                  {item.isArchived && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3 py-1 rounded bg-stone-800 text-stone-200 font-extrabold text-xs uppercase tracking-wider">
                        ARCHIVED
                      </span>
                    </div>
                  )}
                </div>

                {/* Content & Details */}
                <div className="p-6 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10.5px] font-extrabold text-[#9E0C25] uppercase tracking-wider block">
                      {item.codeTag}
                    </span>
                    <h3 className="font-sans font-bold text-base text-stone-900 leading-snug">
                      {item.title}
                    </h3>
                    <span className="text-xs text-stone-400 font-medium block">
                      {item.dateView}
                    </span>
                  </div>

                  {!item.isArchived ? (
                    <div className="space-y-4 pt-2 border-t border-stone-100">
                      
                      {/* Resources Pills */}
                      {item.resources.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Associated Resources:</span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.resources.map((res) => (
                              <span key={res.name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-[10.5px] font-semibold border border-stone-200/60">
                                {res.icon === "pdf" ? <FileText className="w-3 h-3 text-rose-600" /> : <Music className="w-3 h-3 text-purple-600" />}
                                {res.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Toggle Switches */}
                      <div className="flex items-center justify-between pt-1 text-xs font-semibold text-stone-700">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePublic(item.id)}
                            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                              item.isPublic ? "bg-emerald-500" : "bg-stone-300"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                              item.isPublic ? "right-0.5" : "left-0.5"
                            }`} />
                          </button>
                          <span>Public</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleDownloadable(item.id)}
                            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                              item.isDownloadable ? "bg-emerald-500" : "bg-stone-300"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                              item.isDownloadable ? "right-0.5" : "left-0.5"
                            }`} />
                          </button>
                          <span>Downloadable</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => alert(`Edit Metadata for ${item.title}`)}
                          className="py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit Metadata</span>
                        </button>
                        <button
                          onClick={() => alert(`Link Module for ${item.title}`)}
                          className="py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Link Module</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="pt-4 border-t border-stone-100">
                      <button
                        onClick={() => alert(`Restoring ${item.title}`)}
                        className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-[#9E0C25] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restore Content</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 text-xs text-stone-500 font-semibold">
            <div>Showing 1-12 of 1,284 recordings</div>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-lg border border-stone-200 text-stone-400 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
              <button className="w-8 h-8 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
              <button className="w-8 h-8 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">3</button>
              <button className="w-8 h-8 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

        </div>
      ) : (
        /* ================= VIEW 2: UPLOAD NEW SESSION (EXACT FIGMA MATCH) ================= */
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1250px] mx-auto">
          
          {/* Back Navigation Button */}
          <button
            onClick={() => setIsUploadingNewSession(false)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recorded Class Archives</span>
          </button>

          <form onSubmit={handleUploadSubmit} className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT COLUMN CARDS */}
            <div className="flex-1 w-full space-y-6">
              
              {/* CARD 1: Session Media */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <FileVideo className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Session Media</span>
                </h3>

                {/* Drag and Drop Box */}
                <div className="border-2 border-dashed border-stone-300 bg-stone-50/80 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#9E0C25] transition-colors">
                  <div className="w-14 h-14 rounded-full bg-rose-50 text-[#9E0C25] flex items-center justify-center shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">Drag and drop video files</h4>
                    <p className="text-xs text-stone-400 font-medium mt-0.5">MP4, MOV, or WEBM up to 2GB</p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => alert("Browse local files")}
                      className="px-5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      Browse Files
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Import from Cloud Drive")}
                      className="px-5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      Import
                    </button>
                  </div>
                </div>

                {/* Upload Progress Indicator */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span className="truncate">{uploadedFileName}</span>
                    <span className="text-[#9E0C25]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${uploadProgress}%` }} className="bg-[#9E0C25] h-full rounded-full transition-all duration-300" />
                  </div>
                  <p className="text-[10.5px] font-semibold text-stone-400">
                    22.4 MB of 42.8 MB • Approx 12s remaining
                  </p>
                </div>
              </div>

              {/* CARD 2: Session Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Session Details</span>
                </h3>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">SESSION TITLE</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kathak Tatkar & Rhythm Masterclass"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">DESCRIPTION</label>
                    <textarea
                      rows={4}
                      placeholder="Detailed instructional lesson for this session..."
                      value={sessionDescription}
                      onChange={(e) => setSessionDescription(e.target.value)}
                      className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">RECORDING DATE</label>
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3: Metadata & Mapping */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Metadata &amp; Mapping</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">COURSE</label>
                    <div className="relative">
                      <select
                        value={sessionCourse}
                        onChange={(e) => setSessionCourse(e.target.value)}
                        className="w-full h-11 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none focus:bg-white focus:border-[#9E0C25] focus:outline-none cursor-pointer"
                      >
                        <option>Kathak Foundations</option>
                        <option>Masterclass Series</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">DECISION LEVEL</label>
                    <div className="relative">
                      <select
                        value={sessionLevel}
                        onChange={(e) => setSessionLevel(e.target.value)}
                        className="w-full h-11 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none focus:bg-white focus:border-[#9E0C25] focus:outline-none cursor-pointer"
                      >
                        <option>Intermediate (L2)</option>
                        <option>Beginner (L1)</option>
                        <option>Advanced (L3)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">TOPIC TAGS</label>
                    <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/80 rounded-xl p-1.5">
                      <input
                        type="text"
                        placeholder="Add Tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                        className="w-full h-8 px-2 bg-transparent text-xs font-semibold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topicTags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-[#9E0C25] border border-rose-200 text-[10.5px] font-extrabold">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-stone-900"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 4: Learning Resources */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-[#9E0C25]" />
                    <span>Learning Resources</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => alert("Add Resource File")}
                    className="text-xs font-bold text-[#9E0C25] hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-stone-900">Tatkar_Notes_v1.pdf</h5>
                        <p className="text-[10px] text-stone-400 font-medium">3.2 MB • Optional Reference</p>
                      </div>
                    </div>
                    <button type="button" className="p-1.5 text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-stone-900">Rhythm_Beat_Track.mp3</h5>
                        <p className="text-[10px] text-stone-400 font-medium">7.8 MB • Audio Track Repository</p>
                      </div>
                    </div>
                    <button type="button" className="p-1.5 text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* Bottom Upload Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Upload Session
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN STICKY CARDS */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
              
              {/* LIVE PREVIEW CARD */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider">LIVE PREVIEW</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9.5px] font-extrabold uppercase">DRAFT PREVIEW</span>
                </div>

                <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/kathak_course_dancer_1785146082697.jpg"
                    alt="Preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-[#9E0C25] text-[9px] font-extrabold uppercase">RECORDING</span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[9px] font-extrabold uppercase">KATHAK</span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 leading-snug">
                    {sessionTitle || "Intro to Kathak Tatkar & Rhythm"}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    An introductory session covering the fundamental feet &amp; rhythmic variations.
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Sunita.png" alt="Instructor" className="w-7 h-7 rounded-full object-cover border border-stone-200" />
                  <div>
                    <span className="block font-bold text-xs text-stone-900">Dr. Anjali Sharma</span>
                    <span className="block text-[10px] text-stone-400 font-medium">Lead Instructor</span>
                  </div>
                </div>
              </div>

              {/* VISIBILITY CONTROLS CARD */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
                <h4 className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">VISIBILITY CONTROLS</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-stone-900">Make Public</span>
                      <span className="block text-[10.5px] text-stone-400 font-medium">Visible in the kathak catalog</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMakePublic(!makePublic)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        makePublic ? "bg-emerald-500" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        makePublic ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-stone-900">Allow Downloads</span>
                      <span className="block text-[10.5px] text-stone-400 font-medium">Enable offline student access</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowDownloads(!allowDownloads)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        allowDownloads ? "bg-emerald-500" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        allowDownloads ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-stone-900">Notify Students</span>
                      <span className="block text-[10.5px] text-stone-400 font-medium">Alert currently enrolled members</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifyStudents(!notifyStudents)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        notifyStudents ? "bg-emerald-500" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        notifyStudents ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                  >
                    Next Step: Review Details &rarr;
                  </button>
                </div>
              </div>

            </div>

          </form>

        </div>
      )}
    </div>
  );
}
