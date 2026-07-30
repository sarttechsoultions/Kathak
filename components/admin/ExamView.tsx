"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowLeft,
  SlidersHorizontal,
  Calendar,
  Clock,
  MoreVertical,
  ChevronDown,
  Info,
  Sliders,
  HelpCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  CheckCircle2,
  FileText,
  Zap,
  Award
} from "lucide-react";

interface ExamItem {
  id: string;
  examCode: string;
  title: string;
  batchCourse: string;
  dateTime: string;
  duration: string;
  status: "LIVE" | "SCHEDULED" | "DRAFT";
}

const mockExams: ExamItem[] = [
  {
    id: "ex-1",
    examCode: "EX-2024-001",
    title: "Kathak Practical Teental - Final",
    batchCourse: "KTH-DANCE 2024",
    dateTime: "Oct 24, 2023 • 09:00 AM - 12:00 PM",
    duration: "180 Mins",
    status: "LIVE"
  },
  {
    id: "ex-2",
    examCode: "EX-2024-048",
    title: "Mudra & Abhinaya Theory",
    batchCourse: "UG YEAR 2",
    dateTime: "Oct 26, 2023 • 10:30 AM - 12:30 PM",
    duration: "120 Mins",
    status: "SCHEDULED"
  },
  {
    id: "ex-3",
    examCode: "EX-2024-009",
    title: "Jaipur Gharana History Mid-Term",
    batchCourse: "KTH-D3",
    dateTime: "Nov 02, 2023 • TBD",
    duration: "90 Mins",
    status: "DRAFT"
  },
  {
    id: "ex-4",
    examCode: "EX-2024-082",
    title: "Organic Kathak Rhythm & Tabla Theory",
    batchCourse: "BIO-CHEM",
    dateTime: "Oct 28, 2023 • 03:30 PM - 04:30 PM",
    duration: "60 Mins",
    status: "SCHEDULED"
  }
];

interface QuestionItem {
  id: string;
  questionText: string;
  questionType: "Multiple Choice" | "Long Text";
  marks: number;
  options: { id: string; text: string; isCorrect: boolean }[];
}

export default function ExamView() {
  const [examsList, setExamsList] = useState<ExamItem[]>(mockExams);
  const [activeFilterTab, setActiveFilterTab] = useState<"All" | "Live" | "Scheduled" | "Draft">("All");

  // View Navigation State: 'SCHEDULE' | 'CREATE_EXAM'
  const [isCreatingExam, setIsCreatingExam] = useState(false);

  // Form State
  const [examTitle, setExamTitle] = useState("");
  const [batchSelection, setBatchSelection] = useState("");
  const [courseMapping, setCourseMapping] = useState("");
  const [autoGrading, setAutoGrading] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [passingMark, setPassingMark] = useState("60");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationMins, setDurationMins] = useState("120");

  // Question Builder State
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: "q-1",
      questionText: "",
      questionType: "Multiple Choice",
      marks: 5,
      options: [
        { id: "opt-1", text: "Option 1", isCorrect: false },
        { id: "opt-2", text: "Option 2 (Correct Answer)", isCorrect: true },
        { id: "opt-3", text: "Option 3", isCorrect: false }
      ]
    }
  ]);

  const handleAddQuestion = () => {
    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      questionText: "",
      questionType: "Multiple Choice",
      marks: 5,
      options: [
        { id: `opt-${Date.now()}-1`, text: "Option 1", isCorrect: false },
        { id: `opt-${Date.now()}-2`, text: "Option 2", isCorrect: true }
      ]
    };
    setQuestions([...questions, newQ]);
  };

  const handlePublishExam = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ExamItem = {
      id: `ex-${Date.now()}`,
      examCode: `EX-2024-${Math.floor(100 + Math.random() * 900)}`,
      title: examTitle || "Mid-Term Assessment: Advanced Kathak Practice",
      batchCourse: batchSelection || "KTH-DANCE 2024",
      dateTime: `${examDate || "Nov 15, 2024"} • ${startTime || "10:00 AM"}`,
      duration: `${durationMins} Mins`,
      status: "SCHEDULED"
    };

    setExamsList([created, ...examsList]);
    alert(`Exam "${created.title}" published successfully!`);
    setIsCreatingExam(false);
    setExamTitle("");
  };

  return (
    <div>
      {/* ================= VIEW 1: EXAM COMMAND CENTER TABLE ================= */}
      {!isCreatingExam ? (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Header & Create Exam Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Exam Command Center
              </h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500">
                Orchestrate and monitor all digital assessments across your departments.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingExam(true)}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Exam</span>
            </button>
          </div>

          {/* 3 Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL EXAMS</p>
                <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">124</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#9E0C25] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">ACTIVE TODAY</p>
                <h3 className="font-sans font-extrabold text-3xl text-sky-600 mt-1">08</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">PENDING RESULTS</p>
                <h3 className="font-sans font-extrabold text-3xl text-amber-600 mt-1">15</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Exam Schedule Table Box */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-stone-100">
              <div>
                <h3 className="font-sans font-bold text-lg text-stone-900">Exam Schedule</h3>
                <p className="text-xs text-stone-400 font-medium">View and manage upcoming and historical examination sessions.</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
                {(["All", "Live", "Scheduled", "Draft"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilterTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeFilterTab === tab
                        ? "bg-[#9E0C25] text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">EXAM TITLE</th>
                    <th className="py-3.5 px-4">BATCH/COURSE</th>
                    <th className="py-3.5 px-4">DATE &amp; TIME</th>
                    <th className="py-3.5 px-4">DURATION</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {examsList.map((exam) => (
                    <tr key={exam.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* Exam Title */}
                      <td className="py-4 px-4">
                        <div>
                          <span className="block font-extrabold text-stone-900 text-sm">{exam.title}</span>
                          <span className="block text-[10.5px] text-stone-400 font-semibold uppercase">{`ID: ${exam.examCode}`}</span>
                        </div>
                      </td>

                      {/* Batch/Course */}
                      <td className="py-4 px-4 font-bold text-sky-700">{exam.batchCourse}</td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 font-semibold text-stone-600">{exam.dateTime}</td>

                      {/* Duration */}
                      <td className="py-4 px-4 font-bold text-stone-900">{exam.duration}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold ${
                          exam.status === "LIVE"
                            ? "bg-rose-100/80 text-rose-700 border border-rose-200/60"
                            : exam.status === "SCHEDULED"
                            ? "bg-sky-100/80 text-sky-700 border border-sky-200/60"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            exam.status === "LIVE" ? "bg-rose-600 animate-ping" : exam.status === "SCHEDULED" ? "bg-sky-500" : "bg-stone-400"
                          }`} />
                          {exam.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => alert(`Exam Options for ${exam.title}`)}
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      ) : (
        /* ================= VIEW 2: CREATE NEW EXAM FORM (EXACT FIGMA MATCH) ================= */
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1250px] mx-auto">
          
          {/* Back Link */}
          <button
            onClick={() => setIsCreatingExam(false)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Create New Exam</span>
          </button>

          <form onSubmit={handlePublishExam} className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* LEFT COLUMN FORM CARDS */}
            <div className="flex-1 w-full space-y-6">
              
              {/* CARD 1: Basic Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                    <Info className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-stone-900">Basic Information</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">Exam Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mid-Term Assessment: Advanced Quantum Mechanics"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Batch Selection</label>
                      <div className="relative">
                        <select
                          value={batchSelection}
                          onChange={(e) => setBatchSelection(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option value="">Select Batch</option>
                          <option value="KTH-DANCE 2024">KTH-DANCE 2024</option>
                          <option value="UG YEAR 2">UG YEAR 2</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Course Mapping</label>
                      <div className="relative">
                        <select
                          value={courseMapping}
                          onChange={(e) => setCourseMapping(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option value="">Select Course</option>
                          <option value="Kathak Foundations">Kathak Foundations</option>
                          <option value="Mudra & Abhinaya">Mudra &amp; Abhinaya</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: Exam Settings */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                    <Sliders className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-stone-900">Exam Settings</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-stone-900">Auto-grading</span>
                      <span className="block text-[10px] text-stone-400 font-medium">Enable instant feedback for objective questions</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoGrading(!autoGrading)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ml-2 ${
                        autoGrading ? "bg-[#9E0C25]" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        autoGrading ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-stone-900">Randomize Questions</span>
                      <span className="block text-[10px] text-stone-400 font-medium">Shuffle question order for each individual student</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRandomizeQuestions(!randomizeQuestions)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ml-2 ${
                        randomizeQuestions ? "bg-[#9E0C25]" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        randomizeQuestions ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">PASSING MARK (%)</label>
                    <input
                      type="number"
                      value={passingMark}
                      onChange={(e) => setPassingMark(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3: Question Builder */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#9E0C25] flex items-center justify-center font-bold">
                      <HelpCircle className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-sans font-bold text-base text-stone-900">Question Builder</h3>
                  </div>
                  <span className="text-xs font-bold text-stone-400">Total Marks: 5</span>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={q.id} className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-md bg-rose-100/80 text-[#9E0C25] text-[10.5px] font-extrabold uppercase">
                        {qIndex + 1}. MCQ QUESTION
                      </span>
                      <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))} className="text-stone-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="lg:col-span-8 space-y-1.5">
                        <label className="block text-xs font-bold text-stone-700">Question Text</label>
                        <textarea
                          rows={3}
                          placeholder="Enter the question prompt here..."
                          className="w-full p-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                        />
                      </div>

                      <div className="lg:col-span-4 space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-stone-700">Question Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" className="py-2.5 rounded-xl bg-[#9E0C25] text-white font-bold text-xs">
                              Multiple Choice
                            </button>
                            <button type="button" className="py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 font-bold text-xs">
                              Long Text
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-stone-700">Marks per Question</label>
                          <input
                            type="number"
                            defaultValue={5}
                            className="w-full h-10 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Media Attachments */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Media Attachment</label>
                      <div className="flex items-center gap-3">
                        <button type="button" className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-50">
                          <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                          <span>Upload Image</span>
                        </button>
                        <button type="button" className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-50">
                          <VideoIcon className="w-3.5 h-3.5 text-stone-500" />
                          <span>Upload Video</span>
                        </button>
                      </div>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-stone-700">Answer Options</label>
                      <div className="space-y-2">
                        {q.options.map((opt) => (
                          <div key={opt.id} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-opt-${q.id}`}
                              defaultChecked={opt.isCorrect}
                              className="accent-[#9E0C25] w-4 h-4"
                            />
                            <input
                              type="text"
                              defaultValue={opt.text}
                              className={`flex-1 h-10 px-4 rounded-xl text-xs font-semibold focus:outline-none ${
                                opt.isCorrect ? "bg-white border-2 border-rose-300 text-stone-900" : "bg-white border border-stone-200 text-stone-700"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-stone-300 text-stone-600 font-bold text-xs hover:border-[#9E0C25] hover:text-[#9E0C25] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Question</span>
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN CARD: SCHEDULING */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-[88px]">
              
              {/* DARK CRIMSON SCHEDULING CARD */}
              <div className="bg-[#9E0C25] text-white rounded-3xl p-6 shadow-md space-y-5">
                <div className="flex items-center gap-2.5 border-b border-white/20 pb-3">
                  <Clock className="w-5 h-5 text-white" />
                  <h3 className="font-sans font-bold text-base text-white">Scheduling</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white/90">EXAM DATE</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="mm/dd/yyyy"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white placeholder:text-white/60 focus:bg-white/20 focus:outline-none"
                      />
                      <Calendar className="w-4 h-4 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white/90">START TIME</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="--:-- --"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white placeholder:text-white/60 focus:bg-white/20 focus:outline-none"
                      />
                      <Clock className="w-4 h-4 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white/90">DURATION (MINUTES)</label>
                    <input
                      type="number"
                      value={durationMins}
                      onChange={(e) => setDurationMins(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white focus:bg-white/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions Box */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingExam(false)}
                  className="w-full py-3 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer text-center"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                >
                  Publish Exam
                </button>
              </div>

            </div>

          </form>

        </div>
      )}
    </div>
  );
}
