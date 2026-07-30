"use client";

import React, { useState } from "react";
import {
  Plus,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2,
  SlidersHorizontal,
  MoreVertical,
  Send,
  ArrowLeft,
  Users,
  Clock,
  Play,
  CheckSquare,
  Sparkles,
  FileText,
  Calendar,
  Search,
  Upload,
  Link2,
  ChevronDown,
  Info,
  Download,
  RotateCcw,
  RefreshCw,
  User,
  Filter
} from "lucide-react";

interface ClassScheduleItem {
  id: string;
  time: string;
  subTime: string;
  batchName: string;
  levelDesc: string;
  teacherName: string;
  teacherAvatar: string;
  studentsCount: string;
  status: "LIVE" | "UPCOMING";
  actionBtn: "Join" | "Start" | "View";
}

const mockClasses: ClassScheduleItem[] = [
  {
    id: "cls-1",
    time: "10:00 AM",
    subTime: "DURATION 60M",
    batchName: "Beginner A",
    levelDesc: "Music Theory & Practice",
    teacherName: "Guru Meenakshi",
    teacherAvatar: "/Sunita.png",
    studentsCount: "28 Students",
    status: "LIVE",
    actionBtn: "Join"
  },
  {
    id: "cls-2",
    time: "11:30 AM",
    subTime: "DURATION 90M",
    batchName: "Intermediate B",
    levelDesc: "Advanced Composition",
    teacherName: "Guru Rahul",
    teacherAvatar: "/Ananya.png",
    studentsCount: "32 Students",
    status: "UPCOMING",
    actionBtn: "Start"
  },
  {
    id: "cls-3",
    time: "02:00 PM",
    subTime: "DURATION 60M",
    batchName: "Advanced C",
    levelDesc: "Performance Masterclass",
    teacherName: "Guru Harshita",
    teacherAvatar: "/Meera.png",
    studentsCount: "18 Students",
    status: "UPCOMING",
    actionBtn: "View"
  }
];

interface ChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  time: string;
  text: string;
  isInstructor?: boolean;
  isSelf?: boolean;
}

const initialChatMessages: ChatMessage[] = [
  {
    id: "c1",
    sender: "Elena R.",
    avatar: "/Sunita.png",
    time: "10:42 AM",
    text: "Can you explain the difference between Tatkar speed variations and Chakkars in this specific performance?"
  },
  {
    id: "c2",
    sender: "Instructor (JV)",
    time: "10:44 AM",
    text: "Great question Elena. We'll be covering that in the next slide. Keep an eye on the 'Consensus' diagram.",
    isInstructor: true
  },
  {
    id: "c3",
    sender: "You",
    avatar: "/Ananya.png",
    time: "10:45 AM",
    text: "I've shared the supplementary PDF in the class portal for everyone.",
    isSelf: true
  },
  {
    id: "c4",
    sender: "Marcus V.",
    avatar: "/Meera.png",
    time: "10:46 AM",
    text: "👍 Thanks for the PDF!"
  }
];

interface RecordedArchiveCard {
  id: string;
  thumbnail: string;
  duration: string;
  title: string;
  batchTag: string;
  instructor: string;
  date: string;
  timeRange: string;
}

const mockArchives: RecordedArchiveCard[] = [
  {
    id: "arch-1",
    thumbnail: "/kathak_course_dancer_1785146082697.jpg",
    duration: "01:45:00",
    title: "Kathak Intermediate: Mudra Essentials",
    batchTag: "BATCH B1",
    instructor: "Dr. Anjali Sharma",
    date: "Oct 24, 2024",
    timeRange: "10:00 AM - 11:45 AM"
  },
  {
    id: "arch-2",
    thumbnail: "/kathak_dancer_portrait_1785143850699.jpg",
    duration: "02:00:15",
    title: "Piano Grade 3: Theory of Chords",
    batchTag: "BATCH B2",
    instructor: "Prof. James Miller",
    date: "Oct 22, 2024",
    timeRange: "04:30 PM - 06:30 PM"
  },
  {
    id: "arch-3",
    thumbnail: "/gurukul-dancer.jpg",
    duration: "02:10:45",
    title: "Advanced Kathak Rhythm Techniques",
    batchTag: "BATCH B3",
    instructor: "Elena Rodriguez",
    date: "Oct 22, 2024",
    timeRange: "11:00 AM - 01:15 PM"
  },
  {
    id: "arch-4",
    thumbnail: "/kathak_ghungroo_feet_1785143864334.jpg",
    duration: "00:45:00",
    title: "Vocal Arts: Breath Control",
    batchTag: "BATCH B1",
    instructor: "David Sterling",
    date: "Oct 21, 2024",
    timeRange: "05:00 PM - 05:45 PM"
  }
];

export default function ClassManagementView() {
  const [classesList, setClassesList] = useState<ClassScheduleItem[]>(mockClasses);
  const [activeTab, setActiveTab] = useState<"Today" | "All Depts">("Today");
  
  // Navigation Sub-View State: 'SCHEDULE' | 'LIVE_ROOM' | 'CREATE_CLASS' | 'RECORDED_ARCHIVES'
  const [subView, setSubView] = useState<"SCHEDULE" | "LIVE_ROOM" | "CREATE_CLASS" | "RECORDED_ARCHIVES">("SCHEDULE");
  const [selectedClass, setSelectedClass] = useState<ClassScheduleItem | null>(null);

  // Create New Class Form State
  const [classNameInput, setClassNameInput] = useState("");
  const [courseSelect, setCourseSelect] = useState("");
  const [courseLevel, setCourseLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [assignedInstructor, setAssignedInstructor] = useState("");
  const [classType, setClassType] = useState<"Live Session" | "Pre-recorded">("Live Session");
  const [classDate, setClassDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationMins, setDurationMins] = useState("60");
  const [frequency, setFrequency] = useState("Weekly");
  const [meetingLink, setMeetingLink] = useState("https://zoom.us/j/...");
  const [resourceLink, setResourceLink] = useState("https://classroom.google.com/...");
  const [sessionOverview, setSessionOverview] = useState("");
  
  // Live Room Controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputMessage, setInputMessage] = useState("");

  const handleJoinClass = (cls: ClassScheduleItem) => {
    setSelectedClass(cls);
    setSubView("LIVE_ROOM");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: `c-${Date.now()}`,
      sender: "You",
      avatar: "/Ananya.png",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputMessage,
      isSelf: true
    };
    setChatMessages([...chatMessages, newMsg]);
    setInputMessage("");
  };

  const handleEndSession = () => {
    // When session ends, navigate directly to RECORDED ARCHIVES view within Class Management!
    setSubView("RECORDED_ARCHIVES");
  };

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ClassScheduleItem = {
      id: `cls-${Date.now()}`,
      time: startTime || "03:00 PM",
      subTime: `DURATION ${durationMins}M`,
      batchName: classNameInput || "New Kathak Batch",
      levelDesc: courseSelect || "Kathak Foundations",
      teacherName: assignedInstructor || "Guru Ananya",
      teacherAvatar: "/Ananya.png",
      studentsCount: "25 Students",
      status: "UPCOMING",
      actionBtn: "Start"
    };

    setClassesList([...classesList, created]);
    alert(`Class "${created.batchName}" created successfully!`);
    setSubView("SCHEDULE");
    setClassNameInput("");
    setSessionOverview("");
  };

  return (
    <div>
      {/* ================= VIEW 1: CLASS MANAGEMENT MAIN TABLE ================= */}
      {subView === "SCHEDULE" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Class Management
              </h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500">
                Oversee real-time academic operations and live schedules.
              </p>
            </div>

            <button
              onClick={() => setSubView("CREATE_CLASS")}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Class</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            {/* Header & Filter Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-sans font-bold text-lg text-stone-900">Class</h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("All Depts")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "All Depts"
                      ? "bg-[#9E0C25] text-white shadow-md"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  All Depts
                </button>
                <button
                  onClick={() => setActiveTab("Today")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "Today"
                      ? "bg-sky-100 text-sky-700 border border-sky-200"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Today
                </button>
              </div>
            </div>

            {/* Class Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">TIME</th>
                    <th className="py-3.5 px-4">BATCH &amp; LEVEL</th>
                    <th className="py-3.5 px-4">TEACHER</th>
                    <th className="py-3.5 px-4">STUDENTS</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {classesList.map((cls) => (
                    <tr key={cls.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* Time */}
                      <td className="py-4 px-4">
                        <div>
                          <span className="block font-bold text-rose-700 text-xs sm:text-sm">{cls.time}</span>
                          <span className="block text-[10px] text-stone-400 font-extrabold uppercase">{cls.subTime}</span>
                        </div>
                      </td>

                      {/* Batch & Level */}
                      <td className="py-4 px-4">
                        <div>
                          <span className="block font-extrabold text-stone-900 text-sm">{cls.batchName}</span>
                          <span className="block text-[11px] text-stone-400 font-medium">{cls.levelDesc}</span>
                        </div>
                      </td>

                      {/* Teacher */}
                      <td className="py-4 px-4 font-bold text-stone-800 text-xs sm:text-sm">{cls.teacherName}</td>

                      {/* Students */}
                      <td className="py-4 px-4 font-bold text-stone-900 text-xs sm:text-sm">{cls.studentsCount}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10.5px] font-bold ${
                          cls.status === "LIVE"
                            ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200/60"
                            : "bg-sky-100/80 text-sky-700 border border-sky-200/60"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            cls.status === "LIVE" ? "bg-emerald-500 animate-pulse" : "bg-sky-500"
                          }`} />
                          {cls.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        {cls.actionBtn === "Join" ? (
                          <button
                            onClick={() => handleJoinClass(cls)}
                            className="px-6 py-2 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                          >
                            Join
                          </button>
                        ) : cls.actionBtn === "Start" ? (
                          <button
                            onClick={() => handleJoinClass(cls)}
                            className="px-6 py-2 rounded-xl bg-white border border-[#9E0C25] text-[#9E0C25] hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Start
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`View schedule for ${cls.batchName}`)}
                            className="px-4 py-2 rounded-xl text-rose-700 font-bold text-xs hover:underline cursor-pointer"
                          >
                            View
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ================= VIEW 2: CREATE NEW CLASS FORM ================= */}
      {subView === "CREATE_CLASS" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1250px] mx-auto">
          
          {/* Back Navigation Link */}
          <button
            onClick={() => setSubView("SCHEDULE")}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Create New Class</span>
          </button>

          <form onSubmit={handleCreateClassSubmit} className="space-y-8 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs">
            
            {/* SECTION 1: General Information */}
            <div className="space-y-6 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                  <Info className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-base text-stone-900">General Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Class Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Class Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kathak Basics - Batch 01"
                    value={classNameInput}
                    onChange={(e) => setClassNameInput(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                  />
                </div>

                {/* Course Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Course Selection</label>
                  <div className="relative">
                    <select
                      value={courseSelect}
                      onChange={(e) => setCourseSelect(e.target.value)}
                      className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                    >
                      <option value="">Select A Course</option>
                      <option value="Music Theory & Practice">Music Theory &amp; Practice</option>
                      <option value="Advanced Composition">Advanced Composition</option>
                      <option value="Performance Masterclass">Performance Masterclass</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Course Level */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Course Level</label>
                  <div className="flex items-center gap-2">
                    {(["Beginner", "Intermediate", "Advanced"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCourseLevel(level)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          courseLevel === level
                            ? "bg-[#9E0C25] text-white shadow-xs"
                            : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assigned Instructor */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Assigned Instructor</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Instructor..."
                      value={assignedInstructor}
                      onChange={(e) => setAssignedInstructor(e.target.value)}
                      className="w-full h-11 pl-9 pr-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Scheduling Details */}
            <div className="space-y-6 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-base text-stone-900">Scheduling Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Class Type Radio Options */}
                <div className="space-y-1.5 lg:col-span-4">
                  <label className="block text-xs font-bold text-stone-700">Class Type</label>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                      <input
                        type="radio"
                        name="classType"
                        checked={classType === "Live Session"}
                        onChange={() => setClassType("Live Session")}
                        className="accent-[#9E0C25] w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-600" />
                        Live Session
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                      <input
                        type="radio"
                        name="classType"
                        checked={classType === "Pre-recorded"}
                        onChange={() => setClassType("Pre-recorded")}
                        className="accent-[#9E0C25] w-4 h-4 cursor-pointer"
                      />
                      <span>Pre-recorded</span>
                    </label>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={classDate}
                      onChange={(e) => setClassDate(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                    />
                    <Calendar className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Start Time */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Start Time</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="--:-- --"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                    />
                    <Clock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Duration (minutes)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 focus:outline-none focus:border-stone-400"
                  />
                </div>

                {/* Frequency */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Frequency</label>
                  <div className="relative">
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                    >
                      <option>Weekly</option>
                      <option>Daily</option>
                      <option>One-time</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Connectivity & Resources */}
            <div className="space-y-6 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                  <Link2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-base text-stone-900">Connectivity &amp; Resources</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Meeting Link */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Meeting Link (Zoom/Google Meet)</label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 focus:outline-none focus:border-stone-400"
                  />
                </div>

                {/* Resource Link */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Resource Link</label>
                  <input
                    type="text"
                    value={resourceLink}
                    onChange={(e) => setResourceLink(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 focus:outline-none focus:border-stone-400"
                  />
                </div>

                {/* Materials Upload */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700">Materials Upload (Notes/Resources)</label>
                  <div className="border-2 border-dashed border-stone-300 bg-stone-50/70 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#9E0C25] transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-stone-400" />
                    <h5 className="font-bold text-xs text-stone-800">Click to upload or drag and drop</h5>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">PDF, DOCX, WEBM UP TO 50MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Description */}
            <div className="space-y-6 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <h3 className="font-sans font-bold text-base text-stone-900">Description</h3>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">Session Overview &amp; Student Instructions</label>
                <textarea
                  rows={4}
                  value={sessionOverview}
                  onChange={(e) => setSessionOverview(e.target.value)}
                  placeholder="Provide a detailed overview of what students will learn in this class session..."
                  className="w-full p-4 rounded-2xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 leading-relaxed"
                />
              </div>
            </div>

            {/* Form Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSubView("SCHEDULE")}
                className="px-6 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Create Class
              </button>
            </div>

          </form>

        </div>
      )}

      {/* ================= VIEW 3: LIVE SESSION WORKSPACE ================= */}
      {subView === "LIVE_ROOM" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1350px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT / CENTER VIDEO STREAM STAGE */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Video Stage Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gurukul-dancer.jpg"
                  alt="Kathak Live Instructor Stage"
                  className="w-full h-full object-cover"
                />

                {/* Top REC Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>REC 01:24:05</span>
                </div>

                {/* Right Side Participant Video Grid */}
                <div className="absolute top-4 right-4 w-36 sm:w-44 space-y-2.5">
                  {[
                    { name: "Rohan V.", img: "/Ananya.png" },
                    { name: "Sia Gupta", img: "/Sunita.png" },
                    { name: "Arjun K.", img: "/Meera.png" },
                    { name: "Meera S.", img: "/Grace1.png" }
                  ].map((p) => (
                    <div key={p.name} className="relative aspect-video rounded-xl bg-stone-900 border border-white/20 overflow-hidden shadow-md group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-semibold text-white">
                        {p.name}
                      </span>
                    </div>
                  ))}
                  
                  <div className="relative aspect-video rounded-xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    +20 More
                  </div>
                </div>

                {/* Bottom Instructor Banner */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 pr-4 rounded-2xl border border-white/10 text-white">
                  <div className="w-9 h-9 rounded-full bg-rose-700 text-white flex items-center justify-center font-bold text-xs border border-white/20">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Ms. Ananya Sharma</h4>
                    <p className="text-[10px] text-stone-300 font-medium">Main Instructor (Lead Stage)</p>
                  </div>
                </div>
              </div>

              {/* Floating Bottom Media Toolbar */}
              <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-md flex items-center justify-between px-6 max-w-xl mx-auto">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-3 rounded-full transition-colors cursor-pointer ${
                      isMicOn ? "bg-stone-100 text-stone-700 hover:bg-stone-200" : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsCamOn(!isCamOn)}
                    className={`p-3 rounded-full transition-colors cursor-pointer ${
                      isCamOn ? "bg-stone-100 text-stone-700 hover:bg-stone-200" : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {isCamOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                  </button>

                  <button className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer">
                    <Share2 className="w-5 h-5" />
                  </button>

                  <button className="p-3 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer">
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>

                  <button className="p-3 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* END SESSION BUTTON */}
                <button
                  onClick={handleEndSession}
                  className="px-6 py-2.5 rounded-full bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  End Session
                </button>
              </div>

            </div>

            {/* RIGHT SIDE: LIVE CHAT PANEL */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between min-h-[580px] lg:sticky lg:top-[88px]">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-playfair font-bold text-lg text-stone-900">Live Chat</h3>
                  <button className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Messages Stream */}
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[10.5px] font-semibold text-stone-400">
                        <span className="font-bold text-stone-800">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>

                      <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                        msg.isInstructor
                          ? "bg-[#9E0C25] text-white rounded-tl-none"
                          : msg.isSelf
                          ? "bg-sky-100 text-sky-900 rounded-tr-none"
                          : "bg-stone-100 text-stone-800 rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendMessage} className="pt-4 border-t border-stone-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 h-11 px-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* ================= VIEW 4: RECORDED CLASS ARCHIVES (EXACT FIGMA SCREENSHOT MATCH INSIDE CLASS MANAGEMENT) ================= */}
      {subView === "RECORDED_ARCHIVES" && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
                <button onClick={() => setSubView("SCHEDULE")} className="hover:text-stone-900 cursor-pointer">Live Classes</button>
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
              onClick={() => alert("Sync Library Action")}
              className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4 text-stone-500" />
              <span>Sync Library</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-stone-400 block">COURSE CATEGORY</span>
                <div className="relative min-w-[160px]">
                  <select className="w-full h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none">
                    <option>All Categories</option>
                    <option>Kathak Intermediate</option>
                    <option>Music Theory</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-stone-400 block">BATCH SELECTION</span>
                <div className="relative min-w-[160px]">
                  <select className="w-full h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none">
                    <option>All Batches</option>
                    <option>BATCH B1</option>
                    <option>BATCH B2</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-stone-400 block">DATE RANGE</span>
                <div className="relative min-w-[160px]">
                  <input
                    type="text"
                    placeholder="Select dates..."
                    className="w-full h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 placeholder:text-stone-400 focus:bg-white focus:outline-none"
                  />
                  <Calendar className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Filters Applied")}
              className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 self-end sm:self-center"
            >
              Apply Filters
            </button>
          </div>

          {/* Recorded Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockArchives.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
              >
                {/* Thumbnail Box */}
                <div className="relative aspect-video bg-stone-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />

                  {/* Top HD Badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[9px] font-bold">
                    HD 1080P
                  </span>

                  {/* Center Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Duration Badge */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 text-white font-semibold text-[10.5px]">
                    {item.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans font-extrabold text-base text-stone-900 leading-snug group-hover:text-[#9E0C25] transition-colors">
                        {item.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[9.5px] font-extrabold shrink-0">
                        {item.batchTag}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#9E0C25]" />
                      <span>Instructor: {item.instructor}</span>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-semibold text-stone-400 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.timeRange}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => alert(`Downloading ${item.title}`)}
                      className="flex-1 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={() => alert(`Share link for ${item.title}`)}
                      className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col items-center justify-center space-y-3 pt-6 border-t border-stone-200">
            <button
              onClick={() => alert("Loading More Sessions...")}
              className="px-6 py-2.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-[#9E0C25] font-bold text-xs transition-colors cursor-pointer"
            >
              Load More Sessions
            </button>
            <span className="text-xs font-semibold text-stone-400">
              Showing 4 of 120 recorded sessions
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
