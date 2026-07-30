"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Tv,
  Image as ImageIcon,
  Layout,
  Newspaper,
  Upload,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Save,
  Video,
  FileText,
  MessageSquare,
  Star,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Edit2,
  Filter,
  FileCheck,
  X,
  Tag,
  Settings2,
  FileUp,
  FolderPlus,
  Calendar,
  GripVertical,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Radio,
  SlidersHorizontal,
  Palette,
  Search,
  ChevronDown,
  ChevronLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Quote,
  Link2,
  Heading1,
  Heading2
} from "lucide-react";

interface WebsiteViewProps {
  initialTab?: "overview" | "hero-video" | "gallery" | "banner" | "blog";
}

export default function WebsiteView({ initialTab = "overview" }: WebsiteViewProps) {
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "hero-video" | "gallery" | "banner" | "blog">(initialTab);

  // Inner View States
  const [heroViewMode, setHeroViewMode] = useState<"LIBRARY" | "UPLOAD_FORM">("LIBRARY");
  const [galleryViewMode, setGalleryViewMode] = useState<"GRID" | "UPLOAD_FORM">("GRID");
  const [bannerViewMode, setBannerViewMode] = useState<"LIST" | "CREATE_DRAWER">("LIST");
  const [blogViewMode, setBlogViewMode] = useState<"LIST" | "EDITOR">("LIST");

  // Gallery Filters & Metadata Editor State
  const [galleryCategory, setGalleryCategory] = useState<"All Media" | "Workshops" | "Performances" | "Campus">("All Media");
  const [autoArchive, setAutoArchive] = useState(true);
  const [assetTitle, setAssetTitle] = useState("Campus West Wing at Sunset");
  const [altText, setAltText] = useState("Photograph showing the modern glass architecture of the university's west wing during the golden hour sunset.");
  const [selectedCategory, setSelectedCategory] = useState("Campus");
  const [autoGenAltText, setAutoGenAltText] = useState(true);
  const [makePublic, setMakePublic] = useState(true);

  // Banner Form State
  const [bannerHeadline, setBannerHeadline] = useState("Elevate Your Performance Journey");
  const [bannerSubtext, setBannerSubtext] = useState("Join the elite academy for performing arts. Registration now open for the Autumn 2024 Semester.");
  const [bannerCtaLabel, setBannerCtaLabel] = useState("Enroll Today");
  const [bannerCtaLink, setBannerCtaLink] = useState("/registration");
  const [selectedMediaThumb, setSelectedMediaThumb] = useState("/kathak_course_dancer_1785146082697.jpg");
  const [overlayOpacity, setOverlayOpacity] = useState(40);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [bannerTheme, setBannerTheme] = useState("Dark / Cinematic");
  const [bannerStartDate, setBannerStartDate] = useState("2024-08-01");
  const [bannerEndDate, setBannerEndDate] = useState("2024-09-30");
  const [bannerPriorityLevel, setBannerPriorityLevel] = useState<"Low" | "Normal" | "High">("Normal");

  // Blog Editor State
  const [blogHeadline, setBlogHeadline] = useState("Rhythmic Grace: Capturing the Soul of Indian Classical Dance");
  const [blogContent, setBlogContent] = useState("Traditional Indian dance is more than just movement; it's a profound language of expression that has evolved over thousands of years. At Kathak Academy, we believe in bridging the gap between classical rigor and contemporary pedagogy...");
  const [blogAuthor, setBlogAuthor] = useState("Guru Harshita");
  const [blogCategory, setBlogCategory] = useState("Academy News");
  const [blogSearchQuery, setBlogSearchQuery] = useState("");

  // Upload Progress States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(64);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // Video Library
  const [videoLibrary, setVideoLibrary] = useState([
    { id: "v-1", title: "Kathak Classical Entrance 2024", date: "12/2023", duration: "0:45", status: "PUBLISHED", isActive: true, thumbnail: "/gurukul-dancer.jpg" },
    { id: "v-2", title: "Autumn Performance Reel", date: "10/2023", duration: "0:60", status: "DRAFT", isActive: false, thumbnail: "/kathak_course_dancer_1785146082697.jpg" },
    { id: "v-3", title: "Tatkar Basics Demo", date: "09/2023", duration: "0:30", status: "DRAFT", isActive: false, thumbnail: "/kathak_dancer_portrait_1785143850699.jpg" },
    { id: "v-4", title: "Ghungroo Footwork Showcase", date: "08/2023", duration: "0:50", status: "DRAFT", isActive: false, thumbnail: "/kathak_ghungroo_feet_1785143864334.jpg" }
  ]);

  // Gallery Media Items
  const [galleryMediaItems, setGalleryMediaItems] = useState([
    { id: "gm-1", fileName: "dance_workshop_01.jpg", size: "2.4MB", url: "/kathak_course_dancer_1785146082697.jpg", category: "Workshops" },
    { id: "gm-2", fileName: "stage_recital_night.png", size: "4.1MB", url: "/kathak_dancer_portrait_1785143850699.jpg", category: "Performances" },
    { id: "gm-3", fileName: "kathak_solo_03.jpg", size: "1.8MB", url: "/gurukul-dancer.jpg", category: "Performances" },
    { id: "gm-4", fileName: "abhinaya_basics_dvd.png", size: "3.2MB", url: "/kathak_ghungroo_feet_1785143864334.jpg", category: "Workshops" },
    { id: "gm-5", fileName: "campus_east_event.jpg", size: "2.9MB", url: "/Sunita.png", category: "Campus" },
    { id: "gm-6", fileName: "post_dance_delivery.png", size: "1.5MB", url: "/Ananya.png", category: "Workshops" },
    { id: "gm-7", fileName: "auditorium_shot_04.jpg", size: "2.8MB", url: "/Meera.png", category: "Campus" },
    { id: "gm-8", fileName: "digital_design_final.jpg", size: "3.6MB", url: "/Grace1.png", category: "Performances" }
  ]);

  // Banner Items List
  const [bannersList, setBannersList] = useState([
    {
      id: "b-1",
      title: "Violin Masterclass 2024",
      dateRange: "Oct 12 - Dec 20, 2024",
      priority: "01",
      status: "Active",
      thumbnail: "/kathak_course_dancer_1785146082697.jpg"
    },
    {
      id: "b-2",
      title: "New Registration Spring",
      dateRange: "Jan 01 - Mar 15, 2025",
      priority: "02",
      status: "Scheduled",
      thumbnail: "/gurukul-dancer.jpg"
    }
  ]);

  // Blog Posts List
  const [blogPostsList, setBlogPostsList] = useState([
    {
      id: "bp-1",
      title: "Future of Generative Art in Curriculum",
      author: "Alex Rivera",
      avatar: "/Ananya.png",
      category: "Academy News",
      date: "Oct 24, 2023",
      thumbnail: "/kathak_course_dancer_1785146082697.jpg"
    },
    {
      id: "bp-2",
      title: "Spring Exhibition: Call for Entries",
      author: "Sarah Jenkins",
      avatar: "/Sunita.png",
      category: "Events",
      date: "Oct 21, 2023",
      thumbnail: "/gurukul-dancer.jpg"
    },
    {
      id: "bp-3",
      title: "New Sculpture Lab Opening 2025",
      author: "Elena Rossi",
      avatar: "/Meera.png",
      category: "Academy News",
      date: "Oct 19, 2023",
      thumbnail: "/kathak_dancer_portrait_1785143850699.jpg"
    },
    {
      id: "bp-4",
      title: "Spotlight: Marcus Chen's Digital Fusion",
      author: "David Park",
      avatar: "/Grace1.png",
      category: "Student Spotlights",
      date: "Oct 18, 2023",
      thumbnail: "/kathak_ghungroo_feet_1785143864334.jpg"
    }
  ]);

  const handleStartUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          alert("Hero Video Asset uploaded successfully!");
          setHeroViewMode("LIBRARY");
          setUploadProgress(0);
        }, 400);
      }
    }, 300);
  };

  const handleStartGalleryUpload = () => {
    setIsGalleryUploading(true);
    let progress = 64;
    const interval = setInterval(() => {
      progress += 10;
      setGalleryProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGalleryUploading(false);
          alert("New Media assets uploaded successfully!");
          setGalleryViewMode("GRID");
          setGalleryProgress(64);
        }, 400);
      }
    }, 300);
  };

  const handlePublishBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner = {
      id: `b-${bannersList.length + 1}`,
      title: bannerHeadline || "Elevate Your Performance Journey",
      dateRange: `${bannerStartDate} - ${bannerEndDate}`,
      priority: bannerPriorityLevel === "High" ? "01" : bannerPriorityLevel === "Normal" ? "02" : "03",
      status: "Active",
      thumbnail: selectedMediaThumb
    };
    setBannersList([newBanner, ...bannersList]);
    alert("Banner changes published successfully!");
    setBannerViewMode("LIST");
  };

  const handlePublishBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      id: `bp-${blogPostsList.length + 1}`,
      title: blogHeadline || "Untitled Dance Post",
      author: blogAuthor,
      avatar: "/Ananya.png",
      category: blogCategory,
      date: "Oct 29, 2024",
      thumbnail: "/gurukul-dancer.jpg"
    };
    setBlogPostsList([newPost, ...blogPostsList]);
    alert("Blog post published successfully!");
    setBlogViewMode("LIST");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* ================= SECTION 1: OVERVIEW DASHBOARD ================= */}
      {activeSubTab === "overview" && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-1">
            <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">Website Management</h1>
            <p className="text-xs sm:text-sm font-medium text-stone-500 max-w-3xl">Control your digital presence, update content modules, and monitor site-wide analytics for the public-facing academy portal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-1">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL PAGES</p>
              <div className="flex items-baseline justify-between"><h3 className="font-sans font-extrabold text-3xl text-stone-900">42</h3><span className="text-[11px] font-bold text-emerald-600">+2 this week</span></div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-1">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">ACTIVE BANNERS</p>
              <div className="flex items-baseline justify-between"><h3 className="font-sans font-extrabold text-3xl text-sky-600">12</h3><span className="text-[11px] font-bold text-amber-600">1 expiring soon</span></div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-1">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">BLOG POSTS</p>
              <div className="flex items-baseline justify-between"><h3 className="font-sans font-extrabold text-3xl text-purple-600">158</h3><span className="text-[11px] font-bold text-purple-600">3 scheduled</span></div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-1">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">GALLERY IMAGES</p>
              <div className="flex items-baseline justify-between"><h3 className="font-sans font-extrabold text-3xl text-emerald-600">2.4k</h3><span className="text-[11px] font-bold text-stone-400">24 GB stored</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold"><Tv className="w-6 h-6" /></div>
                <div className="space-y-1"><h3 className="font-sans font-bold text-xl text-stone-900">Manage Homepage &amp; Hero</h3><p className="text-xs text-stone-500 font-medium leading-relaxed">Control the first impression. Update the hero video, primary headline, and seasonal messaging for prospective students.</p></div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button onClick={() => setActiveSubTab("hero-video")} className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer">Edit Content</button>
                <button onClick={() => { setActiveSubTab("hero-video"); setHeroViewMode("LIBRARY"); }} className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md cursor-pointer">Configure Video</button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold"><ImageIcon className="w-6 h-6" /></div>
                <div className="space-y-1"><h3 className="font-sans font-bold text-lg text-stone-900">Gallery &amp; Media</h3><p className="text-xs text-stone-500 font-medium leading-relaxed">Update the visual archive. Add high-res photos and academy performance videos.</p></div>
              </div>
              <button onClick={() => setActiveSubTab("gallery")} className="text-xs font-bold text-sky-600 hover:underline cursor-pointer inline-flex items-center gap-1 self-start"><span>Open Library</span><ChevronRight className="w-4 h-4" /></button>
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3"><div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold"><Newspaper className="w-5 h-5" /></div><div><h4 className="font-bold text-base text-stone-900">Blogs &amp; News</h4><p className="text-xs text-stone-500 font-medium mt-1">Engage the community. Manage articles, news updates, and insights.</p></div></div>
              <button onClick={() => setActiveSubTab("blog")} className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer inline-flex items-center gap-1"><span>Writer's Desk</span><ChevronRight className="w-4 h-4" /></button>
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3"><div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold"><Layout className="w-5 h-5" /></div><div><h4 className="font-bold text-base text-stone-900">Banner Management</h4><p className="text-xs text-stone-500 font-medium mt-1">Promote events. Schedule notification bars and modal banners.</p></div></div>
              <button onClick={() => setActiveSubTab("banner")} className="text-xs font-bold text-sky-600 hover:underline cursor-pointer inline-flex items-center gap-1"><span>Manage Schedules</span><ChevronRight className="w-4 h-4" /></button>
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3"><div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold"><Star className="w-5 h-5" /></div><div><h4 className="font-bold text-base text-stone-900">Testimonials</h4><p className="text-xs text-stone-500 font-medium mt-1">Curate and display verified student and parent reviews.</p></div></div>
              <button onClick={() => alert("Moderate Testimonials")} className="text-xs font-bold text-rose-600 hover:underline cursor-pointer inline-flex items-center gap-1"><span>Moderate Reviews</span><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 2: HERO VIDEO ================= */}
      {activeSubTab === "hero-video" && heroViewMode === "LIBRARY" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1"><h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">Hero Video</h1><p className="text-xs sm:text-sm font-medium text-stone-500">Manage your website's main entrance visual and messaging.</p></div>
            <button onClick={() => setHeroViewMode("UPLOAD_FORM")} className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md cursor-pointer flex items-center gap-2"><Upload className="w-4 h-4" /><span>Upload New Video</span></button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="relative aspect-[16/8] rounded-2xl bg-stone-950 overflow-hidden shadow-2xl border border-stone-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/gurukul-dancer.jpg" alt="Hero Stage" className="w-full h-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-8 flex flex-col justify-end text-white space-y-3">
                <p className="text-xs font-bold text-[#9E0C25] uppercase tracking-wider bg-white/90 px-3 py-1 rounded-full self-start">Active Homepage Hero Asset</p>
                <h2 className="font-playfair font-bold text-2xl sm:text-3xl max-w-xl">Educating the leaders of Global Innovation and Excellence...</h2>
                <button className="px-5 py-2 rounded-xl bg-[#9E0C25] text-white font-bold text-xs self-start">Get Started</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO VIDEO UPLOAD FORM */}
      {activeSubTab === "hero-video" && heroViewMode === "UPLOAD_FORM" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
            <button onClick={() => setHeroViewMode("LIBRARY")} className="hover:text-stone-900 cursor-pointer">CMS</button><span>&gt;</span><span>Homepage Assets</span><span>&gt;</span><span className="text-[#9E0C25] font-bold">Hero Video Upload</span>
          </div>
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-8">
            <div className="w-full max-w-2xl rounded-3xl border-2 border-rose-300 bg-rose-50/40 p-8 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-rose-100 text-[#9E0C25] flex items-center justify-center font-bold">{isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}</div><div><h4 className="font-bold text-sm text-stone-900">Upload Queue</h4><p className="text-xs text-stone-400 font-medium">{isUploading ? "Uploading video asset to CDN..." : "Waiting for file..."}</p></div></div>
                <span className="font-mono font-extrabold text-sm text-[#9E0C25]">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden"><div className="bg-[#9E0C25] h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} /></div>
            </div>
            <button onClick={handleStartUpload} disabled={isUploading} className="px-8 py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer"><span>{isUploading ? "Uploading..." : "Start Upload Asset"}</span><ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* ================= SECTION 3: GALLERY MANAGEMENT ================= */}
      {activeSubTab === "gallery" && galleryViewMode === "GRID" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">Gallery Management</h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500">Organize and display visual assets across the Kathak budget ecosystem.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => alert("Exporting Assets...")} className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 flex items-center gap-2 cursor-pointer"><Download className="w-4 h-4" /><span>Export Assets</span></button>
              <button onClick={() => setGalleryViewMode("UPLOAD_FORM")} className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" /><span>Upload New Media</span></button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {(["All Media", "Workshops", "Performances", "Campus"] as const).map((cat) => (
                <button key={cat} onClick={() => setGalleryCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${galleryCategory === cat ? "bg-[#9E0C25] text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>{cat}</button>
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-stone-700">Auto Archive</span>
              <button type="button" onClick={() => setAutoArchive(!autoArchive)} className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${autoArchive ? "bg-[#9E0C25]" : "bg-stone-300"}`}><span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${autoArchive ? "right-0.5" : "left-0.5"}`} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryMediaItems.filter((item) => galleryCategory === "All Media" || item.category === galleryCategory).map((media) => (
              <div key={media.id} className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs space-y-3 flex flex-col justify-between group hover:shadow-md transition-all">
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-xl bg-stone-950 overflow-hidden border border-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={media.url} alt={media.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px] font-bold">{media.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-stone-900 truncate max-w-[170px]">{media.fileName}</h5>
                    <span className="text-[9.5px] font-bold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{media.category}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-stone-400">
                  <button onClick={() => alert(`Viewing ${media.fileName}`)} className="p-1.5 hover:bg-stone-100 hover:text-stone-900 rounded-lg cursor-pointer"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => alert(`Editing ${media.fileName}`)} className="p-1.5 hover:bg-stone-100 hover:text-stone-900 rounded-lg cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setGalleryMediaItems(galleryMediaItems.filter((g) => g.id !== media.id))} className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY UPLOAD NEW MEDIA WITH METADATA EDITOR PANEL */}
      {activeSubTab === "gallery" && galleryViewMode === "UPLOAD_FORM" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1250px] mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
            <button onClick={() => setGalleryViewMode("GRID")} className="hover:text-stone-900 cursor-pointer">CMS</button><span>&gt;</span><span>Gallery</span><span>&gt;</span><span className="text-[#9E0C25] font-bold">Upload New Media</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">Upload New Media</h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500">Organize and publish high-quality visual assets for workshops, performances, and campus updates.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => setGalleryViewMode("GRID")} className="px-5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer">Cancel</button>
              <button onClick={handleStartGalleryUpload} disabled={isGalleryUploading} className="px-6 py-2 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4" /><span>{isGalleryUploading ? "Uploading..." : "Upload"}</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#9E0C25] transition-colors cursor-pointer shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#9E0C25] flex items-center justify-center font-bold"><Upload className="w-6 h-6" /></div>
                <div><h4 className="font-sans font-bold text-base text-stone-900">Drag and drop assets here</h4><p className="text-xs text-stone-400 font-medium mt-1">Support for high resolution photography and vector graphics.</p></div>
                <button className="px-5 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer">Or Browse Files</button>
                <div className="flex items-center gap-3 pt-2 text-[10px] font-bold text-stone-400 uppercase"><span>FORMATS: JPG, PNG, SVG</span><span>•</span><span>MAX SIZE: 50MB / FILE</span></div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2"><h4 className="font-sans font-bold text-base text-stone-900">Pending Uploads</h4><span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-bold text-[10px]">3 FILES</span></div>
                  <span className="text-xs font-semibold text-stone-500">Uploading: {galleryProgress}%</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3"><img src="/gurukul-dancer.jpg" alt="campus_west" className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0" /><div><span className="font-bold text-xs text-stone-900 block">campus_west_wing_sunset.jpg</span><span className="text-[10px] text-stone-400 font-semibold">4.2 MB • PROCESSING</span></div></div>
                    <button className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3"><img src="/Sunita.png" alt="staff" className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0" /><div><span className="font-bold text-xs text-stone-900 block">staff_portrait_2024_01.png</span><span className="text-[10px] text-emerald-600 font-bold">2.8 MB • READY</span></div></div>
                    <button className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3 text-stone-900"><Settings2 className="w-4.5 h-4.5 text-rose-600" /><h4 className="font-sans font-bold text-base">Metadata Editor</h4></div>
              <div className="p-2.5 rounded-xl bg-stone-100 text-[10px] font-bold text-stone-500 uppercase">SELECTED FILE: CAMPUS_WEST_WING_SUNSET.JPG</div>
              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5"><label className="block text-stone-700 font-bold">Asset Title</label><input type="text" value={assetTitle} onChange={(e) => setAssetTitle(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:outline-none focus:bg-white focus:border-[#9E0C25]" /></div>
                <div className="space-y-1.5"><label className="block text-stone-700 font-bold">Alt Text</label><textarea rows={3} value={altText} onChange={(e) => setAltText(e.target.value)} className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-[#9E0C25]" /></div>
                <div className="space-y-1.5"><label className="block text-stone-700 font-bold">Category</label><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:outline-none focus:bg-white"><option>Campus</option><option>Workshops</option><option>Performances</option></select></div>
                <button onClick={() => alert("Metadata applied!")} className="w-full py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md cursor-pointer uppercase">Apply to 1 Pending</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 4: BANNER MANAGEMENT ================= */}
      {activeSubTab === "banner" && bannerViewMode === "LIST" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1"><h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">Banner Management</h1><p className="text-xs sm:text-sm font-medium text-stone-500">Curate the visual first impression of your academy website.</p></div>
            <button onClick={() => setBannerViewMode("CREATE_DRAWER")} className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /><span>Create New Banner</span></button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" /><span className="text-xs font-bold text-stone-800">Live Hero Preview</span></div><span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold border border-emerald-200">LIVE ON SITE</span></div>
            <div className="relative aspect-[16/7] rounded-2xl bg-stone-950 overflow-hidden border border-stone-800 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedMediaThumb} alt="Live Banner" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent p-8 sm:p-12 flex flex-col justify-center text-white space-y-3">
                <span className="text-[10px] font-extrabold text-stone-300 uppercase tracking-widest">SEASONAL ADMISSIONS ARE NOW OPEN</span>
                <h2 className="font-playfair font-bold text-2xl sm:text-4xl max-w-lg leading-tight">{bannerHeadline}</h2>
                <p className="text-xs font-medium text-stone-300 max-w-md leading-relaxed">{bannerSubtext}</p>
                <button className="px-6 py-2.5 rounded-full bg-white text-stone-900 font-extrabold text-xs self-start shadow-md">{bannerCtaLabel}</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <h3 className="font-sans font-bold text-lg text-stone-900">Active &amp; Scheduled Banners</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {bannersList.map((b) => (
                <div key={b.id} className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl bg-stone-900 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.thumbnail} alt={b.title} className="w-full h-full object-cover opacity-90" />
                      <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${b.status === "Active" ? "bg-rose-600 text-white" : "bg-sky-600 text-white"}`}>{b.status}</span>
                    </div>
                    <div className="space-y-1"><h4 className="font-bold text-sm text-stone-900">{b.title}</h4><p className="text-xs font-semibold text-stone-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-stone-400" /><span>{b.dateRange}</span></p></div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 text-xs font-bold text-stone-500">
                    <span>Priority: {b.priority}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setBannerViewMode("CREATE_DRAWER")} className="p-1.5 hover:bg-stone-200 rounded-lg text-stone-600 cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setBannersList(bannersList.filter((item) => item.id !== b.id))} className="p-1.5 hover:bg-rose-100 hover:text-rose-600 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BANNER CREATIVE FORM */}
      {activeSubTab === "banner" && bannerViewMode === "CREATE_DRAWER" && (
        <form onSubmit={handlePublishBanner} className="space-y-8 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setBannerViewMode("LIST")} className="text-xs font-extrabold text-stone-700 hover:text-stone-900 flex items-center gap-2 cursor-pointer uppercase"><ArrowLeft className="w-4 h-4" /><span>← BANNER CREATIVE</span></button>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 text-stone-900 border-b border-stone-100 pb-3"><Palette className="w-4.5 h-4.5 text-rose-600" /><h3 className="font-sans font-bold text-base">Banner Content</h3></div>
              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5"><label className="block text-stone-700 font-bold uppercase text-[10.5px]">HEADLINE</label><input type="text" value={bannerHeadline} onChange={(e) => setBannerHeadline(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]" /></div>
                <div className="space-y-1.5"><label className="block text-stone-700 font-bold uppercase text-[10.5px]">SUBTEXT</label><textarea rows={3} value={bannerSubtext} onChange={(e) => setBannerSubtext(e.target.value)} className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold text-xs focus:bg-white focus:outline-none focus:border-[#9E0C25]" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="block text-stone-700 font-bold uppercase text-[10.5px]">CTA LABEL</label><input type="text" value={bannerCtaLabel} onChange={(e) => setBannerCtaLabel(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]" /></div>
                  <div className="space-y-1.5"><label className="block text-stone-700 font-bold uppercase text-[10.5px]">CTA LINK</label><input type="text" value={bannerCtaLink} onChange={(e) => setBannerCtaLink(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]" /></div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3"><div className="flex items-center gap-2 text-stone-900"><ImageIcon className="w-4.5 h-4.5 text-rose-600" /><h3 className="font-sans font-bold text-base">Media Selection</h3></div><button type="button" onClick={() => alert("Opening Gallery Asset Browser...")} className="text-xs font-bold text-rose-600 hover:underline cursor-pointer">Browse Gallery</button></div>
              <div className="border-2 border-dashed border-stone-300 bg-stone-50/70 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 hover:border-[#9E0C25] transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-[#9E0C25] flex items-center justify-center font-bold"><Upload className="w-5 h-5" /></div>
                <h4 className="font-bold text-xs text-stone-900">Click to upload or drag and drop</h4>
                <p className="text-[10px] text-stone-400 font-semibold uppercase">PNG, JPG OR WEBP (MAX 5MB, RECOMMENDED 2000x800PX)</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button type="submit" className="px-8 py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md cursor-pointer uppercase">PUBLISH CHANGES</button>
            </div>
          </div>
        </form>
      )}

      {/* ================= SECTION 5: BLOG MANAGEMENT ================= */}
      {activeSubTab === "blog" && blogViewMode === "LIST" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">Blog Management</h1>
              <div className="flex items-center gap-3 pt-1">
                <span className="px-3 py-1 rounded-full bg-rose-50 text-[#9E0C25] text-xs font-extrabold border border-rose-200">• TOTAL POSTS 42</span>
                <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-extrabold border border-sky-200">• PUBLISHED 38</span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold border border-amber-200">• DRAFTS 4</span>
              </div>
            </div>
            <button onClick={() => setBlogViewMode("EDITOR")} className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /><span>Create New Post</span></button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">POST TITLE</th><th className="py-3.5 px-4">AUTHOR</th><th className="py-3.5 px-4">CATEGORY</th><th className="py-3.5 px-4 text-right">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {blogPostsList.map((post) => (
                    <tr key={post.id} className="hover:bg-stone-50/80 transition-colors cursor-pointer" onClick={() => setBlogViewMode("EDITOR")}>
                      <td className="py-4 px-4"><div className="flex items-center gap-3"><img src={post.thumbnail} alt={post.title} className="w-10 h-10 rounded-xl object-cover shrink-0" /><span className="font-bold text-stone-900 text-sm">{post.title}</span></div></td>
                      <td className="py-4 px-4"><div className="flex items-center gap-2"><img src={post.avatar} alt={post.author} className="w-6 h-6 rounded-full object-cover shrink-0" /><span className="font-semibold text-stone-700">{post.author}</span></div></td>
                      <td className="py-4 px-4"><span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 font-extrabold text-[10.5px] border border-sky-100">{post.category}</span></td>
                      <td className="py-4 px-4 text-right font-semibold text-stone-500">{post.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BLOG EDITOR */}
      {activeSubTab === "blog" && blogViewMode === "EDITOR" && (
        <form onSubmit={handlePublishBlogPost} className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1"><h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">Blog Post Editor</h1><p className="text-xs text-stone-400 font-semibold">Draft saved 2 mins ago • Author: <strong className="text-stone-700">{blogAuthor}</strong></p></div>
            <button type="button" onClick={() => setBlogViewMode("LIST")} className="text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer">Cancel</button>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-6">
            <div className="space-y-2"><input type="text" placeholder="Enter your headline..." value={blogHeadline} onChange={(e) => setBlogHeadline(e.target.value)} className="w-full text-xl sm:text-2xl font-playfair font-bold text-stone-900 border-none outline-none focus:ring-0 px-0" /></div>
            <div className="relative aspect-[16/6] rounded-3xl bg-stone-950 overflow-hidden shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/gurukul-dancer.jpg" alt="Featured Cover" className="w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 space-y-3"><button type="button" className="px-5 py-2 rounded-xl bg-white text-stone-900 font-extrabold text-xs shadow-md">Select Image</button></div>
            </div>
            <textarea rows={8} value={blogContent} onChange={(e) => setBlogContent(e.target.value)} className="w-full text-xs font-medium text-stone-800 leading-relaxed border-none outline-none focus:ring-0 px-0" />
            <div className="pt-4 border-t border-stone-100 flex justify-end"><button type="submit" className="px-8 py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md cursor-pointer">Publish Post</button></div>
          </div>
        </form>
      )}

    </div>
  );
}
