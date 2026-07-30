"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Calendar,
  FileText,
  Clock,
  CheckSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Download,
  Eye,
  Info,
  Upload,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Check,
  HelpCircle,
  GraduationCap,
  Award,
  SlidersHorizontal,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Star,
  Lock,
  MessageSquare,
  LayoutGrid,
  ListFilter,
  FileEdit
} from "lucide-react";

interface AssignmentItem {
  id: string;
  teacherName: string;
  teacherDept: string;
  teacherAvatar: string;
  title: string;
  typeTag: string;
  targetBatch: string;
  dueDate: string;
  totalStudents: string;
}

const mockAssignments: AssignmentItem[] = [
  {
    id: "asg-1",
    teacherName: "Dr. Ramesh Kumar",
    teacherDept: "Classical Dance Dept.",
    teacherAvatar: "/Sunita.png",
    title: "Mudras & Expressions Vol. 1",
    typeTag: "Practical Assessment",
    targetBatch: "Kathak Basics - B1",
    dueDate: "Oct 25, 2024",
    totalStudents: "150 Students"
  },
  {
    id: "asg-2",
    teacherName: "Prof. Sarah Jenkins",
    teacherDept: "Vocal Arts Dept.",
    teacherAvatar: "/Ananya.png",
    title: "Symphonic Structure Analysis",
    typeTag: "Research Paper",
    targetBatch: "Western Classical - V2",
    dueDate: "Oct 28, 2024",
    totalStudents: "120 Students"
  },
  {
    id: "asg-3",
    teacherName: "Dr. Alan Turing",
    teacherDept: "Instrumental & Rhythm Dept.",
    teacherAvatar: "/Meera.png",
    title: "Origins of Raga Classification",
    typeTag: "Mid-term Quiz",
    targetBatch: "Indology Advanced - B3",
    dueDate: "Nov 02, 2024",
    totalStudents: "95 Students"
  }
];

interface SubmittedAssignmentRecord {
  id: string;
  studentName: string;
  studentId: string;
  studentAvatar: string;
  assignmentTitle: string;
  batch: string;
  submittedDate: string;
  status: "Submitted" | "Overdue" | "Pending";
}

const mockSubmittedAssignments: SubmittedAssignmentRecord[] = [
  {
    id: "sub-1",
    studentName: "Arjan Malhotra",
    studentId: "#STU-2023-0101",
    studentAvatar: "/Ananya.png",
    assignmentTitle: "Advanced Tala Rhythms",
    batch: "Kathak Basics - B1",
    submittedDate: "Oct 24, 2023 14:32 PM",
    status: "Submitted"
  },
  {
    id: "sub-2",
    studentName: "Sanya Mukherjee",
    studentId: "#STU-2023-0102",
    studentAvatar: "/Sunita.png",
    assignmentTitle: "Mudras & Expressions",
    batch: "Kathak Basics - B1",
    submittedDate: "---",
    status: "Overdue"
  },
  {
    id: "sub-3",
    studentName: "Riya Kapoor",
    studentId: "#STU-2023-0803",
    studentAvatar: "/Meera.png",
    assignmentTitle: "Folk Dance Project",
    batch: "Contemporary Fusion",
    submittedDate: "---",
    status: "Pending"
  },
  {
    id: "sub-4",
    studentName: "Vikram Singh",
    studentId: "#STU-2023-0404",
    studentAvatar: "/Grace1.png",
    assignmentTitle: "Percussion Dynamics",
    batch: "Advanced Rhythm - A2",
    submittedDate: "Oct 23, 2023 09:15 AM",
    status: "Submitted"
  },
  {
    id: "sub-5",
    studentName: "Ishaan Verma",
    studentId: "#STU-2023-0412",
    studentAvatar: "/Grace2.png",
    assignmentTitle: "Stage Management basics",
    batch: "Advanced Rhythm - A2",
    submittedDate: "Oct 22, 2023 18:00 PM",
    status: "Submitted"
  }
];

interface TeacherDetailAssignment {
  id: string;
  title: string;
  code: string;
  startDate: string;
  endDate: string;
  targetBatch: string;
  submissions: string;
  status: "Active" | "Completed" | "Overdue";
}

const mockTeacherDetailAssignments: TeacherDetailAssignment[] = [
  {
    id: "t-asg-1",
    title: "Neural Networks Fundamentals",
    code: "CODE: CS-NN-04",
    startDate: "Oct 12, 2023",
    endDate: "Oct 28, 2023",
    targetBatch: "CS-2024-Alpha",
    submissions: "45/50 Students",
    status: "Active"
  },
  {
    id: "t-asg-2",
    title: "Cloud Infrastructure Project",
    code: "CODE: CLD-ARC-01",
    startDate: "Sep 05, 2023",
    endDate: "Sep 23, 2023",
    targetBatch: "CS-2024-Beta",
    submissions: "48/48 Students",
    status: "Completed"
  },
  {
    id: "t-asg-3",
    title: "Ethics in Artificial Intelligence",
    code: "CODE: AI-ETH-22",
    startDate: "Oct 01, 2023",
    endDate: "Oct 15, 2023",
    targetBatch: "AI-2025-Alpha",
    submissions: "12/55 Students",
    status: "Overdue"
  }
];

interface VideoSubmissionCard {
  id: string;
  studentName: string;
  studentAvatar: string;
  submittedTime: string;
  thumbnail: string;
  duration: string;
  status: "Pending Review" | "Reviewed";
  score?: string;
  codePill: string;
  message?: string;
}

const mockVideoSubmissions: VideoSubmissionCard[] = [
  {
    id: "vid-1",
    studentName: "Aryan Sharma",
    studentAvatar: "/Ananya.png",
    submittedTime: "Submitted Oct 23, 11:42 AM",
    thumbnail: "/kathak_course_dancer_1785146082697.jpg",
    duration: "02:35",
    status: "Pending Review",
    codePill: "#2024-069",
    message: "Here is my performance for the Kathak Pro module. I've focused specifically on the footwork transitions we discussed in the last session. Looking forward to your feedback!"
  },
  {
    id: "vid-2",
    studentName: "Priya Iyer",
    studentAvatar: "/Sunita.png",
    submittedTime: "Submitted Oct 19, 01:15 PM",
    thumbnail: "/kathak_dancer_portrait_1785143850699.jpg",
    duration: "03:10",
    status: "Reviewed",
    score: "9.2",
    codePill: "#2024-112",
    message: "Completed the footwork variations and mudras for Week 3. Please let me know your thoughts."
  },
  {
    id: "vid-3",
    studentName: "Rohan Gupta",
    studentAvatar: "/Meera.png",
    submittedTime: "Submitted Oct 14, 09:30 PM",
    thumbnail: "/gurukul-dancer.jpg",
    duration: "01:58",
    status: "Reviewed",
    score: "7.8",
    codePill: "#2024-045",
    message: "Focused on speed and rhythm precision in this submission."
  },
  {
    id: "vid-4",
    studentName: "Sana Malik",
    studentAvatar: "/Grace1.png",
    submittedTime: "Submitted Oct 21, 08:22 AM",
    thumbnail: "/kathak_ghungroo_feet_1785143864334.jpg",
    duration: "03:12",
    status: "Pending Review",
    codePill: "#2024-201",
    message: "Practiced the Tatkar speed accelerations as requested."
  }
];

export default function AssignmentView() {
  const [assignmentsList, setAssignmentsList] = useState<AssignmentItem[]>(mockAssignments);
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState("");
  const [assignmentBatchFilter, setAssignmentBatchFilter] = useState("Kathak Pro 2024-B");
  const [assignmentCourseFilter, setAssignmentCourseFilter] = useState("All Courses");
  const [assignmentStatusTab, setAssignmentStatusTab] = useState("Active");
  
  // Views navigation
  const [isViewingSubmittedAssignments, setIsViewingSubmittedAssignments] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [selectedTeacherDetail, setSelectedTeacherDetail] = useState<AssignmentItem | null>(null);
  
  // Screen 2 & 3 navigation states
  const [selectedSubmissionGallery, setSelectedSubmissionGallery] = useState(false);
  const [selectedVideoReview, setSelectedVideoReview] = useState<VideoSubmissionCard | null>(null);

  // Gallery view filters
  const [galleryTab, setGalleryTab] = useState<"All Submissions" | "Pending">("All Submissions");
  
  // Evaluation form state
  const [reviewRhythmScore, setReviewRhythmScore] = useState("85");
  const [reviewPostureScore, setReviewPostureScore] = useState("8.5");
  const [reviewExpressionScore, setReviewExpressionScore] = useState("9.0");
  const [reviewFeedbackText, setReviewFeedbackText] = useState("");

  // Create Assignment Form State
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [newAssignmentCategory, setNewAssignmentCategory] = useState("Video Submission");
  const [newAssignmentCourse, setNewAssignmentCourse] = useState("Classical Dance Foundation");
  const [newAssignmentInstructions, setNewAssignmentInstructions] = useState("");
  const [newAssignmentDeadlineDate, setNewAssignmentDeadlineDate] = useState("");
  const [newAssignmentDeadlineTime, setNewAssignmentDeadlineTime] = useState("");
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);
  const [selectedTargetBatches, setSelectedTargetBatches] = useState<string[]>(["Kathak Pro 2024 D"]);

  const toggleBatchSelection = (batchName: string) => {
    if (selectedTargetBatches.includes(batchName)) {
      setSelectedTargetBatches(selectedTargetBatches.filter((b) => b !== batchName));
    } else {
      setSelectedTargetBatches([...selectedTargetBatches, batchName]);
    }
  };

  const handlePublishAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsg: AssignmentItem = {
      id: `asg-${Date.now()}`,
      teacherName: "Admin User",
      teacherDept: "Faculty Lead",
      teacherAvatar: "/Ananya.png",
      title: newAssignmentTitle || "New Kathak Practice Assignment",
      typeTag: newAssignmentCategory || "Practical Assessment",
      targetBatch: selectedTargetBatches[0] || "Kathak Pro 2024 D",
      dueDate: newAssignmentDeadlineDate || "Nov 15, 2024",
      totalStudents: "120 Students"
    };

    setAssignmentsList([newAsg, ...assignmentsList]);
    alert(`Assignment "${newAsg.title}" published successfully!`);
    setIsCreatingAssignment(false);
    setNewAssignmentTitle("");
    setNewAssignmentInstructions("");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Evaluation submitted for ${selectedVideoReview?.studentName || "Student"}!`);
    setSelectedVideoReview(null);
  };

  return (
    <div>
      {/* ================= VIEW A: MAIN ASSIGNMENT TABLE ================= */}
      {!isViewingSubmittedAssignments && !isCreatingAssignment && !selectedTeacherDetail && !selectedSubmissionGallery && !selectedVideoReview && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Assignment Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsViewingSubmittedAssignments(true)}
                className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                Submitted Assignment
              </button>
              <button
                onClick={() => setIsCreatingAssignment(true)}
                className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Assignment</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL ACTIVE</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">48</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#9E0C25] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">PENDING REVIEWS</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">156</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SUBMISSIONS THIS WEEK</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">842</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">AVG COMPLETION RATE</p>
                <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">92.4%</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by assignment name..."
                    value={assignmentSearchTerm}
                    onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="relative flex items-center">
                  <span className="text-[11px] font-semibold text-stone-400 mr-1">Batch:</span>
                  <div className="relative">
                    <select
                      value={assignmentBatchFilter}
                      onChange={(e) => setAssignmentBatchFilter(e.target.value)}
                      className="h-10 pl-3 pr-8 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option>Kathak Pro 2024-B</option>
                      <option>Kathak Pro 2024-A</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="relative flex items-center">
                  <span className="text-[11px] font-semibold text-stone-400 mr-1">Course:</span>
                  <div className="relative">
                    <select
                      value={assignmentCourseFilter}
                      onChange={(e) => setAssignmentCourseFilter(e.target.value)}
                      className="h-10 pl-3 pr-8 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option>All Courses</option>
                      <option>Kathak Foundations</option>
                      <option>Classical Masterclass</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                  {["Active", "Draft"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAssignmentStatusTab(tab)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        assignmentStatusTab === tab
                          ? "bg-white text-stone-900 shadow-2xs font-bold"
                          : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button className="px-3.5 py-2 rounded-xl border border-stone-200/80 bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-100 cursor-pointer">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Date Range</span>
                </button>
              </div>
            </div>

            {/* MAIN ASSIGNMENTS DATA TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">ASSIGNMENT TITLE</th>
                    <th className="py-3.5 px-4">TARGET BATCH</th>
                    <th className="py-3.5 px-4">DUE DATE</th>
                    <th className="py-3.5 px-4">TOTAL STUDENTS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {assignmentsList.map((asg) => (
                    <tr key={asg.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <span className="block font-extrabold text-stone-900 text-sm sm:text-base">{asg.title}</span>
                          <span className="block text-[11px] text-sky-600 font-semibold mt-0.5">{asg.typeTag}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-extrabold">
                          {asg.targetBatch}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-stone-800 font-bold text-xs sm:text-sm">{asg.dueDate}</td>
                      <td className="py-4 px-4 text-stone-700 font-bold text-xs sm:text-sm">{asg.totalStudents}</td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedTeacherDetail(asg)}
                          className="px-5 py-1.5 rounded-lg border border-purple-200/80 bg-purple-50/60 hover:bg-purple-100 text-purple-700 font-extrabold text-xs transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <div>Showing 1-{assignmentsList.length} of 124 results</div>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-400 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 flex items-center justify-center">2</button>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW B: SUBMITTED ASSIGNMENTS STATUS (SCREEN 1) ================= */}
      {isViewingSubmittedAssignments && !isCreatingAssignment && !selectedTeacherDetail && !selectedSubmissionGallery && !selectedVideoReview && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setIsViewingSubmittedAssignments(false)}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Student Assignment Status</span>
              </button>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Student Assignment Status
              </h1>
              <p className="text-xs font-medium text-stone-500">
                Real-time overview of current student submission and review pipeline.
              </p>
            </div>

            <button
              onClick={() => alert("Exporting CSV...")}
              className="px-5 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-500" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL ASSIGNMENTS</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">1,284</h3>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">SUBMITTED</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">942</h3>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400">PENDING</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">158</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">STUDENT</th>
                    <th className="py-3.5 px-4">ASSIGNMENT</th>
                    <th className="py-3.5 px-4">BATCH</th>
                    <th className="py-3.5 px-4">SUBMITTED DATE</th>
                    <th className="py-3.5 px-4">STATUS BADGE</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {mockSubmittedAssignments.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.studentAvatar} alt={row.studentName} className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0" />
                          <div>
                            <span className="block font-bold text-stone-900 text-sm">{row.studentName}</span>
                            <span className="block text-[10.5px] text-stone-400 font-semibold">{row.studentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-stone-800 text-xs sm:text-sm">{row.assignmentTitle}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 text-[10.5px] font-extrabold">
                          {row.batch}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-stone-500 font-medium">{row.submittedDate}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10.5px] font-bold ${
                          row.status === "Submitted"
                            ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200/60"
                            : row.status === "Overdue"
                            ? "bg-rose-100/80 text-rose-700 border border-rose-200/60"
                            : "bg-amber-100/80 text-amber-700 border border-amber-200/60"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "Submitted" ? "bg-emerald-500" : row.status === "Overdue" ? "bg-rose-500" : "bg-amber-500"
                          }`} />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {/* Eye button opens Screen 2: Assignment Submissions Gallery */}
                        <button
                          onClick={() => setSelectedSubmissionGallery(true)}
                          title="View Submission Details"
                          className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-stone-400 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <button className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50">Previous</button>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 hover:bg-stone-50 flex items-center justify-center">3</button>
                <span className="px-1 text-stone-400">...</span>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 hover:bg-stone-50 flex items-center justify-center">12</button>
              </div>
              <button className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW E: SCREEN 2 - ASSIGNMENT SUBMISSIONS GALLERY (EXACT FIGMA MATCH) ================= */}
      {selectedSubmissionGallery && !selectedVideoReview && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
          
          {/* Header & Sub-header */}
          <div className="space-y-2">
            <button
              onClick={() => setSelectedSubmissionGallery(false)}
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KATHAK PRO 2024-B • 45 Students Enrolled</span>
            </button>
            <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Rhythmic Footwork Week 3
            </h1>
            <p className="text-xs sm:text-sm font-medium text-stone-500 max-w-3xl">
              Review and evaluate technical proficiency in Tatkar patterns and rhythmic variations. Deadline: Oct 24th, 2024.
            </p>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL SUBMISSIONS</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">38</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">PENDING</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">12</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-center">
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SUBMITTED</p>
              <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">8</h3>
            </div>
          </div>

          {/* Filter & View Layout Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGalleryTab("All Submissions")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  galleryTab === "All Submissions"
                    ? "bg-[#9E0C25] text-white shadow-md"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                All Submissions
              </button>
              <button
                onClick={() => setGalleryTab("Pending")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  galleryTab === "Pending"
                    ? "bg-[#9E0C25] text-white shadow-md"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                Pending (12)
              </button>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500">
                <span>Sort by:</span>
                <div className="relative">
                  <select className="h-9 pl-3 pr-8 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-800 appearance-none cursor-pointer focus:outline-none">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Highest Score</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button className="p-1.5 rounded-lg bg-white shadow-2xs text-[#9E0C25]"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800"><ListFilter className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Video Submissions Grid Cards (Clicking any card opens Screen 3!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVideoSubmissions.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedVideoReview(item)}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden group hover:shadow-md transition-all cursor-pointer space-y-4"
              >
                {/* Video Thumbnail Frame */}
                <div className="relative aspect-video bg-stone-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt={item.studentName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  
                  {/* Overlay Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  {item.status === "Pending Review" ? (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-xs text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                      PENDING REVIEW
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 font-extrabold text-xs shadow-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {item.score}
                    </span>
                  )}

                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white font-semibold text-[10px]">
                    {item.duration}
                  </span>
                </div>

                {/* Card Content & Student Info */}
                <div className="p-5 pt-0 space-y-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.studentAvatar} alt={item.studentName} className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm group-hover:text-[#9E0C25] transition-colors">{item.studentName}</h4>
                      <span className="text-[11px] text-stone-400 font-medium block">{item.submittedTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    {item.status === "Reviewed" ? (
                      <button className="px-3.5 py-1.5 rounded-lg bg-rose-50 text-[#9E0C25] font-extrabold text-xs hover:bg-rose-100 transition-colors">
                        View Feedback
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-rose-50 text-[#9E0C25] hover:bg-rose-100 transition-colors">
                          <Play className="w-4 h-4 fill-[#9E0C25]" />
                        </button>
                        <button className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
                          <FileEdit className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-500 font-bold text-[10.5px]">
                      {item.codePill}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ================= VIEW F: SCREEN 3 - DETAILED VIDEO REVIEW & EVALUATION PAGE (EXACT FIGMA MATCH) ================= */}
      {selectedVideoReview && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Top Bar Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedVideoReview(null)}
                className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedVideoReview.studentAvatar}
                  alt={selectedVideoReview.studentName}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <h2 className="font-playfair font-bold text-xl text-stone-900">{selectedVideoReview.studentName}</h2>
                  <p className="text-xs font-semibold text-stone-400">
                    Kathak Pro 2024-B • {selectedVideoReview.submittedTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-extrabold border border-amber-200">
                PENDING REVIEW
              </span>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* 2-Column Main Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Student Message & Custom Video Player */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Student's Message Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-2">
                <h4 className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">STUDENT&apos;S MESSAGE</h4>
                <p className="text-xs sm:text-sm font-medium text-stone-700 italic leading-relaxed">
                  &ldquo;{selectedVideoReview.message || "Here is my performance for the Kathak Pro module. I've focused specifically on the footwork transitions we discussed in the last session. Looking forward to your feedback!"}&rdquo;
                </p>
              </div>

              {/* Video Player Container */}
              <div className="bg-stone-950 rounded-3xl overflow-hidden shadow-xl border border-stone-800 space-y-0 relative group">
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedVideoReview.thumbnail}
                    alt="Kathak Video Submission"
                    className="w-full h-full object-cover opacity-90"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-2xl">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </button>
                  </div>

                  {/* Video Control Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2">
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden relative cursor-pointer group/bar">
                      <div className="bg-[#9E0C25] h-full w-[25%] relative">
                        <div className="w-3 h-3 rounded-full bg-white absolute right-0 top-1/2 -translate-y-1/2 shadow-md" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-white text-xs font-semibold pt-1">
                      <div className="flex items-center gap-3">
                        <button className="hover:text-rose-400 transition-colors"><Pause className="w-4 h-4 fill-white" /></button>
                        <button className="hover:text-rose-400 transition-colors"><Volume2 className="w-4 h-4" /></button>
                        <span className="text-[11px] text-stone-300 font-mono">00:42 / {selectedVideoReview.duration}</span>
                      </div>
                      <button className="hover:text-rose-400 transition-colors"><Maximize2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Evaluation & Grading Panel */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-6 lg:sticky lg:top-[88px]">
              <h3 className="font-playfair font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
                Evaluation
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                
                {/* Score Input Fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">Rhythm &amp; Tempo</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={reviewRhythmScore}
                        onChange={(e) => setReviewRhythmScore(e.target.value)}
                        className="w-16 h-10 rounded-xl bg-stone-50 border border-stone-200 text-center font-bold text-stone-900 text-xs focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                      />
                      <span className="text-xs font-semibold text-stone-400">/100</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">Posture &amp; Alignment</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={reviewPostureScore}
                        onChange={(e) => setReviewPostureScore(e.target.value)}
                        className="w-16 h-10 rounded-xl bg-stone-50 border border-stone-200 text-center font-bold text-stone-900 text-xs focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                      />
                      <span className="text-xs font-semibold text-stone-400">/10</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">Expression &amp; Flow</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={reviewExpressionScore}
                        onChange={(e) => setReviewExpressionScore(e.target.value)}
                        className="w-16 h-10 rounded-xl bg-stone-50 border border-stone-200 text-center font-bold text-stone-900 text-xs focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                      />
                      <span className="text-xs font-semibold text-stone-400">/10</span>
                    </div>
                  </div>
                </div>

                {/* Reviewed Assignments Feedback Box */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <label className="block text-xs font-bold text-stone-700">Reviewed Assignments</label>
                  <textarea
                    rows={4}
                    placeholder="Type your comprehensive review here..."
                    value={reviewFeedbackText}
                    onChange={(e) => setReviewFeedbackText(e.target.value)}
                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`Requested re-submission from ${selectedVideoReview.studentName}`);
                      setSelectedVideoReview(null);
                    }}
                    className="w-full py-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-[#9E0C25] font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Request Re-submission
                  </button>
                </div>

                {/* Privacy Footer Note */}
                <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-stone-400 pt-1">
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span>Grades are private until published.</span>
                </div>

              </form>

            </div>

          </div>

        </div>
      )}

      {/* ================= VIEW C: CREATE NEW ASSIGNMENT (EXACT FIGMA MATCH) ================= */}
      {isCreatingAssignment && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
          
          {/* Back Navigation & Top Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setIsCreatingAssignment(false)}
                className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Assignments &gt; Create New</span>
              </button>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Create New Assignment
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreatingAssignment(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Draft Saved!");
                  setIsCreatingAssignment(false);
                }}
                className="px-5 py-2.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-[#9E0C25] font-bold text-xs transition-colors cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handlePublishAssignment}
                className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Publish Assignment
              </button>
            </div>
          </div>

          {/* Main 2-Column Form Layout */}
          <form onSubmit={handlePublishAssignment} className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT COLUMN FORM CARDS */}
            <div className="flex-1 w-full space-y-6">
              
              {/* CARD 1: Assignment Basics */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Assignment Basics</span>
                </h3>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Assignment Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Kathak Mudras Practical Exam"
                      value={newAssignmentTitle}
                      onChange={(e) => setNewAssignmentTitle(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Category</label>
                      <div className="relative">
                        <select
                          value={newAssignmentCategory}
                          onChange={(e) => setNewAssignmentCategory(e.target.value)}
                          className="w-full h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                        >
                          <option>Video Submission</option>
                          <option>Audio Recording</option>
                          <option>Practical Assessment</option>
                          <option>Research Paper</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Course</label>
                      <div className="relative">
                        <select
                          value={newAssignmentCourse}
                          onChange={(e) => setNewAssignmentCourse(e.target.value)}
                          className="w-full h-11 pl-4 pr-10 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                        >
                          <option>Classical Dance Foundation</option>
                          <option>Kathak Foundations</option>
                          <option>Contemporary Fusion</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Instructions & Resources */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Instructions &amp; Resources</span>
                </h3>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700">Assignment Instructions</label>
                    <div className="rounded-xl border border-stone-200/80 bg-stone-50 overflow-hidden focus-within:bg-white focus-within:border-[#9E0C25] transition-all">
                      <div className="flex items-center gap-1 px-3 py-2 border-b border-stone-200/80 bg-stone-100/60 text-stone-600">
                        <button type="button" className="p-1 hover:bg-stone-200 rounded cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-stone-200 rounded cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-stone-200 rounded cursor-pointer"><Underline className="w-3.5 h-3.5" /></button>
                        <span className="h-3 w-px bg-stone-300 mx-1" />
                        <button type="button" className="p-1 hover:bg-stone-200 rounded cursor-pointer"><List className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-stone-200 rounded cursor-pointer"><ListOrdered className="w-3.5 h-3.5" /></button>
                        <button type="button" className="p-1 hover:bg-stone-200 rounded cursor-pointer"><Link2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Provide detailed steps for the students..."
                        value={newAssignmentInstructions}
                        onChange={(e) => setNewAssignmentInstructions(e.target.value)}
                        className="w-full p-4 bg-transparent text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-700">Reference Materials</label>
                    <div className="border-2 border-dashed border-stone-300 bg-stone-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#9E0C25] transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-rose-50 text-[#9E0C25] flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-stone-900">Click or drag files to upload</span>
                      <span className="text-[10.5px] text-stone-400 font-medium">Upload PDFs, Performance Videos, or Audio clips (Max 50MB)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: Evaluation Criteria */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Evaluation Criteria</span>
                </h3>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200">
                  Total Marks: 100
                </span>
              </div>

            </div>

            {/* RIGHT COLUMN STICKY CARDS */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
              
              {/* Submission Schedule */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Submission Schedule</span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Deadline Date</label>
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={newAssignmentDeadlineDate}
                      onChange={(e) => setNewAssignmentDeadlineDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Deadline Time</label>
                    <input
                      type="text"
                      placeholder="--:-- --"
                      value={newAssignmentDeadlineTime}
                      onChange={(e) => setNewAssignmentDeadlineTime(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#9E0C25] focus:outline-none transition-all"
                    />
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="allowLate"
                      checked={allowLateSubmissions}
                      onChange={(e) => setAllowLateSubmissions(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#9E0C25] focus:ring-[#9E0C25] cursor-pointer"
                    />
                    <label htmlFor="allowLate" className="text-xs font-bold text-stone-800 cursor-pointer">
                      Allow late submissions
                      <span className="block text-[10.5px] text-stone-400 font-medium">Submissions locked 1hr after deadline</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Target Batches */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <CheckSquare className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Target Batches</span>
                </h3>

                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-stone-700">Select Eligible Batches</label>
                  {[
                    "Kathak Pro 2024 D",
                    "Kathak Foundations B1",
                    "Advanced Taal Workshop",
                    "Senior Classical Masterclass"
                  ].map((batchName) => {
                    const isChecked = selectedTargetBatches.includes(batchName);
                    return (
                      <div
                        key={batchName}
                        onClick={() => toggleBatchSelection(batchName)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer border border-stone-100"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#9E0C25] focus:ring-[#9E0C25] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-stone-800">{batchName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Need Help? Banner */}
              <div className="bg-gradient-to-br from-[#701623] to-[#9E0C25] rounded-3xl p-6 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <HelpCircle className="w-5 h-5 text-rose-200" />
                  <span>Need Help?</span>
                </div>
                <p className="text-xs text-rose-100 leading-relaxed font-medium">
                  Need inspiration for your rubric? Check our institution&apos;s standard grading templates to ensure consistency across batches.
                </p>
                <button
                  type="button"
                  onClick={() => alert("Grading Templates Modal")}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
                >
                  View Templates
                </button>
              </div>

            </div>

          </form>

        </div>
      )}
    </div>
  );
}
