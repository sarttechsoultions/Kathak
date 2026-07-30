"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  SlidersHorizontal,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Calendar,
  Clock,
  Send,
  X,
  FileText,
  Upload,
  Link2,
  ChevronDown,
  Bold,
  Italic,
  List,
  Video,
  Sliders
} from "lucide-react";

interface StudentPracticeSubmission {
  id: string;
  studentName: string;
  studentAvatar: string;
  submissionDate: string;
  courseBatch: string;
  videoTitle: string;
  status: "PENDING" | "REVIEWED" | "NEEDS IMPROVEMENT";
}

const mockPracticeSubmissions: StudentPracticeSubmission[] = [
  {
    id: "prac-1",
    studentName: "Ishita Sharma",
    studentAvatar: "/Ananya.png",
    submissionDate: "Oct 24, 2023",
    courseBatch: "Kathak Foundations • #402",
    videoTitle: "Tatkar Footwork Speed Test",
    status: "PENDING"
  },
  {
    id: "prac-2",
    studentName: "Arjun Kapoor",
    studentAvatar: "/Sunita.png",
    submissionDate: "Oct 23, 2023",
    courseBatch: "Mudra Basics • #398",
    videoTitle: "Asamyuta Hastas Practice",
    status: "REVIEWED"
  },
  {
    id: "prac-3",
    studentName: "Sanya Verma",
    studentAvatar: "/Meera.png",
    submissionDate: "Oct 22, 2023",
    courseBatch: "Abhinaya Intro • #401",
    videoTitle: "Facial Expressions Drill",
    status: "NEEDS IMPROVEMENT"
  }
];

interface StudentSubmissionHistoryItem {
  id: string;
  videoTitle: string;
  thumbnail: string;
  submissionDate: string;
  courseBatch: string;
  status: "Reviewed" | "Needs Improvement" | "Pending";
  marks: string;
}

const mockStudentHistory: StudentSubmissionHistoryItem[] = [
  {
    id: "hist-1",
    videoTitle: "Kathak Tatkar: Footwork Transitions Practice",
    thumbnail: "/kathak_course_dancer_1785146082697.jpg",
    submissionDate: "Oct 24, 2024",
    courseBatch: "Kathak Advanced / Alpha",
    status: "Reviewed",
    marks: "92/100"
  },
  {
    id: "hist-2",
    videoTitle: "Asamyuta & Samyuta Mudra Formations",
    thumbnail: "/kathak_dancer_portrait_1785143850699.jpg",
    submissionDate: "Oct 19, 2024",
    courseBatch: "Kathak Basics / Beta",
    status: "Needs Improvement",
    marks: "65/100"
  },
  {
    id: "hist-3",
    videoTitle: "Abhinaya Expression & Navarasa Drill",
    thumbnail: "/gurukul-dancer.jpg",
    submissionDate: "Oct 15, 2024",
    courseBatch: "Kathak Ethics / Alpha",
    status: "Pending",
    marks: "— N/A —"
  },
  {
    id: "hist-4",
    videoTitle: "Kathak Taal & Rhythm Footwork Walkthrough",
    thumbnail: "/kathak_ghungroo_feet_1785143864334.jpg",
    submissionDate: "Oct 08, 2024",
    courseBatch: "Kathak Dev / Gamma",
    status: "Reviewed",
    marks: "88/100"
  }
];

export default function VideoReviewView() {
  const [submissionsList, setSubmissionsList] = useState<StudentPracticeSubmission[]>(mockPracticeSubmissions);
  
  // Navigation View State: 'DIRECTORY' | 'HISTORY' | 'EVALUATION' | 'ASSIGN_TASK'
  const [viewMode, setViewMode] = useState<"DIRECTORY" | "HISTORY" | "EVALUATION" | "ASSIGN_TASK">("DIRECTORY");
  const [selectedStudent, setSelectedStudent] = useState<StudentPracticeSubmission | null>(null);
  const [selectedVideoItem, setSelectedVideoItem] = useState<StudentSubmissionHistoryItem | null>(null);

  // Assign Task Form State (100% Figma Match)
  const [taskTitle, setTaskTitle] = useState("Tatkar Footwork Speed Test - 140 BPM");
  const [taskCategory, setTaskCategory] = useState("Kathak");
  const [taskCourse, setTaskCourse] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [taskBatch, setTaskBatch] = useState("");
  const [taskInstructions, setTaskInstructions] = useState(
    "Break down the footwork sequences and specify the Teental cycles to be maintained..."
  );
  const [submissionDate, setSubmissionDate] = useState("11/20/2024");
  const [cutoffTime, setCutoffTime] = useState("06:00 PM");
  const [strictDeadline, setStrictDeadline] = useState(false);

  // Video Evaluation Form State
  const [isPlaying, setIsPlaying] = useState(false);
  const [scoreVal, setScoreVal] = useState("8");
  const [correctionNotes, setCorrectionNotes] = useState<string[]>([
    "Heel impact needs more weight",
    "Maintain upright posture during Chakkars"
  ]);
  const [newNoteInput, setNewNoteInput] = useState("");
  const [comprehensiveReview, setComprehensiveReview] = useState(
    "Provide detailed feedback on rhythm accuracy, facial expressions, and overall poise..."
  );

  const handleOpenStudentHistory = (student: StudentPracticeSubmission) => {
    setSelectedStudent(student);
    setViewMode("HISTORY");
  };

  const handleOpenVideoEvaluation = (videoItem: StudentSubmissionHistoryItem) => {
    setSelectedVideoItem(videoItem);
    setViewMode("EVALUATION");
  };

  const handleAddNote = () => {
    if (newNoteInput.trim()) {
      setCorrectionNotes([...correctionNotes, newNoteInput.trim()]);
      setNewNoteInput("");
    }
  };

  const handleRemoveNote = (index: number) => {
    setCorrectionNotes(correctionNotes.filter((_, i) => i !== index));
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Review for "${selectedVideoItem?.videoTitle || "Video"}" submitted successfully! Score: ${scoreVal}/10`);
    setViewMode("HISTORY");
  };

  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: StudentPracticeSubmission = {
      id: `prac-${Date.now()}`,
      studentName: "All Batch Students",
      studentAvatar: "/Ananya.png",
      submissionDate: submissionDate || "Nov 20, 2024",
      courseBatch: `${taskCourse || "Kathak Advanced"} • #${taskBatch || "Alpha-2024"}`,
      videoTitle: taskTitle || "New Practice Task",
      status: "PENDING"
    };

    setSubmissionsList([newTask, ...submissionsList]);
    alert(`Task "${newTask.videoTitle}" assigned successfully!`);
    setViewMode("DIRECTORY");
  };

  return (
    <div>
      {/* ================= TIER 1: STUDENT PRACTICE SUBMISSIONS MAIN DIRECTORY ================= */}
      {viewMode === "DIRECTORY" && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Header & Top Action Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Student Practice Submissions
              </h1>
            </div>

            <button
              onClick={() => setViewMode("ASSIGN_TASK")}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Task</span>
            </button>
          </div>

          {/* 3 Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL VIDEOS</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">1,284</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">PENDING REVIEW</p>
              <h3 className="font-sans font-extrabold text-3xl text-rose-600 mt-1">42</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">REVIEWED</p>
              <h3 className="font-sans font-extrabold text-3xl text-emerald-600 mt-1">1,150</h3>
            </div>
          </div>

          {/* Submission Directory Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg text-stone-900">Submission Directory</h3>
              
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
                <button className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Sort</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">STUDENT</th>
                    <th className="py-3.5 px-4">SUBMISSION DATE</th>
                    <th className="py-3.5 px-4">COURSE &amp; BATCH</th>
                    <th className="py-3.5 px-4">VIDEO TITLE</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {submissionsList.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* Student */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.studentAvatar} alt={row.studentName} className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0" />
                          <button
                            onClick={() => handleOpenStudentHistory(row)}
                            className="font-bold text-stone-900 text-sm hover:text-[#9E0C25] transition-colors cursor-pointer text-left"
                          >
                            {row.studentName}
                          </button>
                        </div>
                      </td>

                      {/* Submission Date */}
                      <td className="py-4 px-4 text-stone-600 font-semibold">{row.submissionDate}</td>

                      {/* Course & Batch */}
                      <td className="py-4 px-4 text-stone-700 font-bold">{row.courseBatch}</td>

                      {/* Video Title */}
                      <td className="py-4 px-4 font-bold text-stone-900 text-sm">{row.videoTitle}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold ${
                          row.status === "PENDING"
                            ? "bg-purple-100/80 text-purple-700 border border-purple-200/60"
                            : row.status === "REVIEWED"
                            ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200/60"
                            : "bg-rose-100/80 text-rose-700 border border-rose-200/60"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "PENDING" ? "bg-purple-600" : row.status === "REVIEWED" ? "bg-emerald-500" : "bg-rose-500"
                          }`} />
                          {row.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenStudentHistory(row)}
                          title="View Student History"
                          className="p-2 hover:text-[#9E0C25] hover:bg-rose-50 rounded-xl text-stone-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4.5 h-4.5 text-indigo-600" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ================= TIER 2: STUDENT SUBMISSION HISTORY VIEW ================= */}
      {viewMode === "HISTORY" && selectedStudent && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Back Navigation Header */}
          <button
            onClick={() => setViewMode("DIRECTORY")}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Video Review Hub &gt; <strong className="text-[#9E0C25]">{selectedStudent.studentName}</strong></span>
          </button>

          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedStudent.studentAvatar}
                alt={selectedStudent.studentName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md bg-stone-100 shrink-0"
              />
              <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center absolute bottom-1 right-1 shadow-xs border-2 border-white">
                <CheckCircle2 className="w-4 h-4 fill-white text-sky-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900">
                  {selectedStudent.studentName}
                </h2>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-[#9E0C25] text-xs font-extrabold border border-rose-200/80">
                  Batch: Alpha-2024
                </span>
              </div>

              <div className="space-y-1 text-xs font-semibold text-stone-500">
                <p className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#9E0C25]" />
                  <span>Senior Diploma in Kathak</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-stone-400" />
                  <span>Campus East</span>
                </p>
              </div>
            </div>
          </div>

          {/* Submission History Section */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-sans font-bold text-lg text-stone-900">Submission History</h3>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <button className="px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-100 cursor-pointer shrink-0">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Submission History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">VIDEO TITLE</th>
                    <th className="py-3.5 px-4">SUBMISSION DATE</th>
                    <th className="py-3.5 px-4">COURSE/BATCH</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4">MARKS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {mockStudentHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* Video Title & Thumbnail Preview */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-lg bg-stone-900 overflow-hidden shrink-0 border border-stone-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.thumbnail} alt={item.videoTitle} className="w-full h-full object-cover opacity-85" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                            </div>
                          </div>
                          <span className="font-bold text-stone-900 text-sm">{item.videoTitle}</span>
                        </div>
                      </td>

                      {/* Submission Date */}
                      <td className="py-4 px-4 text-stone-600 font-semibold">{item.submissionDate}</td>

                      {/* Course/Batch */}
                      <td className="py-4 px-4 text-stone-700 font-bold">{item.courseBatch}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold ${
                          item.status === "Reviewed"
                            ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200/60"
                            : item.status === "Needs Improvement"
                            ? "bg-amber-100/80 text-amber-700 border border-amber-200/60"
                            : "bg-purple-100/80 text-purple-700 border border-purple-200/60"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Reviewed" ? "bg-emerald-500" : item.status === "Needs Improvement" ? "bg-amber-500" : "bg-purple-600"
                          }`} />
                          {item.status}
                        </span>
                      </td>

                      {/* Marks */}
                      <td className="py-4 px-4 font-extrabold text-stone-900 text-sm">{item.marks}</td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenVideoEvaluation(item)}
                          title="Open Video Evaluation Workspace"
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-rose-700 font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-4.5 h-4.5 text-rose-700" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ================= TIER 3: DETAILED VIDEO EVALUATION & FEEDBACK VIEW ================= */}
      {viewMode === "EVALUATION" && selectedStudent && selectedVideoItem && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1350px] mx-auto">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
            <button onClick={() => setViewMode("DIRECTORY")} className="hover:text-stone-900 cursor-pointer">VIDEO MANAGEMENT</button>
            <span>&gt;</span>
            <button onClick={() => setViewMode("HISTORY")} className="hover:text-stone-900 cursor-pointer">KATHAK SUBMISSIONS</button>
            <span>&gt;</span>
            <span className="text-[#9E0C25] font-bold uppercase">{selectedStudent.studentName}</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT / CENTER VIDEO PLAYER & STUDENT DETAILS COLUMN */}
            <div className="flex-1 w-full space-y-6">
              
              {/* Large Video Title */}
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900">
                {selectedVideoItem.videoTitle || "Tatkar Footwork Practice"}
              </h1>

              {/* Custom Video Player Box */}
              <div className="relative aspect-video rounded-3xl bg-stone-950 overflow-hidden shadow-2xl border border-stone-800 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedVideoItem.thumbnail}
                  alt={selectedVideoItem.videoTitle}
                  className="w-full h-full object-cover opacity-90"
                />

                {/* Overlay Play Center Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-[#9E0C25]/90 backdrop-blur-md text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
                  </div>
                </button>

                {/* Bottom Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-white text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-rose-400">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px]">01:14 / 03:45</span>
                  </div>

                  {/* Scrubber Bar */}
                  <div className="flex-1 mx-4 bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="w-1/3 bg-[#9E0C25] h-full rounded-full" />
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="hover:text-rose-400"><Volume2 className="w-4 h-4" /></button>
                    <button className="hover:text-rose-400"><Maximize2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* Student Details Banner Box */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedStudent.studentAvatar}
                    alt={selectedStudent.studentName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-stone-200 shadow-sm shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-stone-900">{selectedStudent.studentName}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9E0C25] text-[10px] font-extrabold border border-rose-200">
                        BATCH ALPHA-2024
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-stone-400 block mt-0.5">
                      ADVANCED LEVEL
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs font-semibold text-stone-500">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">SUBMISSION DATE</span>
                  <span className="text-stone-900 font-bold">{selectedVideoItem.submissionDate} • 08:15 PM IST</span>
                </div>
              </div>

              {/* Session Metadata Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-stone-400 block">ASSIGNMENT TYPE</span>
                  <span className="font-bold text-stone-900 text-xs mt-0.5 block">Kathak Performance</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-stone-400 block">TECHNICAL FOCUS</span>
                  <span className="font-bold text-stone-900 text-xs mt-0.5 block">Tatkar / Speedwork / Chakkars</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase text-stone-400 block">TARGET BPM</span>
                  <span className="font-bold text-stone-900 text-xs mt-0.5 block">120 BPM - Drit Teental</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: EVALUATION PANEL */}
            <div className="w-full lg:w-96 shrink-0 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 lg:sticky lg:top-[88px]">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-sans font-bold text-lg text-stone-900">Evaluation Panel</h3>
              </div>

              <form onSubmit={handleSubmitEvaluation} className="space-y-6">
                
                {/* PERFORMANCE SCORE */}
                <div className="space-y-2">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 block">
                    PERFORMANCE SCORE
                  </span>

                  <div className="flex items-center justify-between bg-stone-50 border border-stone-200/80 rounded-2xl p-4">
                    <input
                      type="number"
                      max={10}
                      min={0}
                      value={scoreVal}
                      onChange={(e) => setScoreVal(e.target.value)}
                      className="w-16 h-12 text-3xl font-extrabold text-stone-900 bg-transparent text-center focus:outline-none"
                    />
                    <span className="text-stone-400 font-bold text-lg">/ 10</span>
                  </div>
                </div>

                {/* CORRECTION NOTES */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      CORRECTION NOTES
                    </span>
                    <span className="text-[10px] font-bold text-[#9E0C25] uppercase cursor-pointer hover:underline">Add Note +</span>
                  </div>

                  {/* Notes Bullet List */}
                  <div className="space-y-2">
                    {correctionNotes.map((note, index) => (
                      <div key={index} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs font-semibold text-rose-950 flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9E0C25] mt-1.5 shrink-0" />
                          <span>{note}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveNote(index)} className="text-stone-400 hover:text-rose-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Note Input */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="+ Add a new correction note..."
                      value={newNoteInput}
                      onChange={(e) => setNewNoteInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNote(); } }}
                      className="flex-1 h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddNote}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* OVERALL COMPREHENSIVE REVIEW */}
                <div className="space-y-2">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400 block">
                    OVERALL COMPREHENSIVE REVIEW
                  </span>
                  <textarea
                    rows={4}
                    value={comprehensiveReview}
                    onChange={(e) => setComprehensiveReview(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all leading-relaxed"
                  />
                </div>

                {/* SUBMIT REVIEW BUTTON */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer text-center"
                >
                  Submit Review
                </button>

              </form>

            </div>

          </div>

          {/* BOTTOM SECTION: STUDENT SUBMISSION HISTORY GRID */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg text-stone-900">Student Submission History</h3>
              <button onClick={() => setViewMode("HISTORY")} className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">
                View All Recent
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "FOUNDATION STEP PATTERN", score: "9.2/10", time: "1 month ago", img: "/kathak_course_dancer_1785146082697.jpg" },
                { title: "FOOTWORK PATTERN - 1", score: "7.5/10", time: "1 month ago", img: "/kathak_dancer_portrait_1785143850699.jpg" },
                { title: "NAVARASA DRILL", score: "8.8/10", time: "2 months ago", img: "/gurukul-dancer.jpg" },
                { title: "ABHINAYA SPEED TEST", score: "9.0/10", time: "3 months ago", img: "/kathak_ghungroo_feet_1785143864334.jpg" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow group">
                  <div className="relative aspect-video rounded-xl bg-stone-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover opacity-85" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900 truncate">{card.title}</h5>
                    <div className="flex items-center justify-between text-[10.5px] font-semibold text-stone-400 mt-1">
                      <span className="text-emerald-600 font-extrabold">SCORE: {card.score}</span>
                      <span>{card.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= TIER 4: ASSIGN NEW TASK VIEW (100% EXACT FIGMA MATCH) ================= */}
      {viewMode === "ASSIGN_TASK" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1250px] mx-auto">
          
          {/* Top Breadcrumb & Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
                <button onClick={() => setViewMode("DIRECTORY")} className="hover:text-stone-900 cursor-pointer flex items-center gap-1 text-stone-500 font-medium">
                  <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
                  <span>Workload</span>
                </button>
                <span>&gt;</span>
                <span className="text-stone-500 font-medium">Student Profile</span>
                <span>&gt;</span>
                <span className="text-stone-900 font-bold">Assign Task</span>
              </div>
              <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Assign New Task
              </h1>
            </div>

            <button
              onClick={handleAssignTaskSubmit}
              className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Assign Task</span>
            </button>
          </div>

          <form onSubmit={handleAssignTaskSubmit} className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT COLUMN CARDS */}
            <div className="flex-1 w-full space-y-6">
              
              {/* CARD 1: Task Definition */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                    <Sliders className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-stone-900">Task Definition</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Task Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Tatkar Footwork Speed Test - 140 BPM"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Category</label>
                      <div className="relative">
                        <select
                          value={taskCategory}
                          onChange={(e) => setTaskCategory(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option>Kathak</option>
                          <option>Music Theory</option>
                          <option>Vocal Practice</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Course</label>
                      <div className="relative">
                        <select
                          value={taskCourse}
                          onChange={(e) => setTaskCourse(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option value="">Select Course (e.g. Kathak Advanced)</option>
                          <option value="Kathak Advanced">Kathak Advanced</option>
                          <option value="Kathak Foundations">Kathak Foundations</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Priority Level</label>
                      <div className="flex items-center gap-1.5 p-1.5 bg-indigo-50/60 border border-indigo-100/60 rounded-xl">
                        {(["Low", "Medium", "High"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setTaskPriority(p)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              taskPriority === p
                                ? "bg-white text-stone-900 shadow-xs border border-stone-200/60"
                                : "text-stone-500 hover:text-stone-900"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Batch</label>
                      <div className="relative">
                        <select
                          value={taskBatch}
                          onChange={(e) => setTaskBatch(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option value="">Select Batch (e.g. Alpha-2024)</option>
                          <option value="Alpha-2024">Alpha-2024</option>
                          <option value="Beta-2024">Beta-2024</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Detailed Instructions WYSIWYG Box */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Detailed Instructions</label>
                    <div className="rounded-2xl border-2 border-dashed border-sky-400 bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-sky-200">
                      {/* Editor Toolbar */}
                      <div className="flex items-center gap-3 px-4 py-2 bg-stone-50 border-b border-stone-200 text-stone-500">
                        <button type="button" className="p-1 hover:text-stone-900 font-bold"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:text-stone-900 italic"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:text-stone-900"><List className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:text-stone-900"><Link2 className="w-3.5 h-3.5" /></button>
                      </div>

                      <textarea
                        rows={5}
                        value={taskInstructions}
                        onChange={(e) => setTaskInstructions(e.target.value)}
                        placeholder="Break down the footwork sequences and specify the Teental cycles to be maintained..."
                        className="w-full p-4 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Reference Media */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-sans font-bold text-base text-stone-900">Reference Media</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert("Add Link Modal")}
                    className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer"
                  >
                    + Add Link
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Uploaded Video Thumbnail Reference */}
                  <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden border border-stone-200 shadow-xs group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/gurukul-dancer.jpg" alt="Demo" className="w-full h-full object-cover opacity-85" />
                    <button type="button" className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black">
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 flex flex-col justify-end text-white bg-black/75 p-2 rounded-lg backdrop-blur-xs">
                      <span className="font-bold text-xs truncate">Tatkar_Basics_Demo.mp4</span>
                      <span className="text-stone-300 text-[9px] font-medium uppercase">MASTER VIDEO REFERENCE</span>
                    </div>
                  </div>

                  {/* Upload Dropzone */}
                  <div className="border-2 border-dashed border-stone-300 bg-stone-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#9E0C25] transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-stone-400" />
                    <h5 className="font-bold text-xs text-stone-800">Click to upload or drag &amp; drop</h5>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">MAX SIZE: 50MB (MP4, MOV)</p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN CARD: DEADLINE */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-stone-900">Deadline</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Submission Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={submissionDate}
                        onChange={(e) => setSubmissionDate(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-900 focus:outline-none focus:border-stone-400"
                      />
                      <Calendar className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Cut-off Time</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cutoffTime}
                        onChange={(e) => setCutoffTime(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-900 focus:outline-none focus:border-stone-400"
                      />
                      <Clock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStrictDeadline(!strictDeadline)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        strictDeadline ? "bg-[#9E0C25]" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        strictDeadline ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                    <span className="text-xs font-bold text-stone-700">Strict Deadline (No late subs)</span>
                  </div>
                </div>
              </div>
            </div>

          </form>

        </div>
      )}
    </div>
  );
}
