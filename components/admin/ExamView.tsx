"use client";

import React, { useState, useEffect } from "react";
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
import { apiRequest } from "@/lib/api";

interface ExamItem {
  id: string;
  examCode: string;
  title: string;
  batchCourse: string;
  dateTime: string;
  duration: string;
  status: "LIVE" | "SCHEDULED" | "DRAFT";
}

interface BatchItem {
  id: string;
  name: string;
  courseId?: string;
  courseTitle?: string;
}

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionItem {
  id: string;
  questionText: string;
  questionType: "Multiple Choice" | "Long Text";
  marks: number;
  options: QuestionOption[];
  mediaType?: "image" | "video" | null;
  mediaUrl?: string | null;
}

export default function ExamView() {
  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/admin/exams");
      if (res?.data?.exams) {
        setExamsList(res.data.exams);
      }
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await apiRequest("/admin/batches");
      if (res?.data?.batches) {
        setBatches(
          res.data.batches.map((b: any) => ({
            id: b.id,
            name: b.name || b.code,
            courseId: b.courseId || b.course?.id,
            courseTitle: b.course?.title || b.courseName
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      let res;
      try {
        res = await apiRequest("/admin/courses");
      } catch {
        res = await apiRequest("/courses");
      }
      const list = res.data?.courses || res.data || [];
      if (Array.isArray(list)) {
        setCourses(list.map((c: any) => ({ id: c.id, title: c.title || c.name || "Untitled Course" })));
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchBatches();
    fetchCourses();
  }, []);

  const availableBatchesForSelectedCourse = React.useMemo(() => {
    if (!courseMapping) return batches;
    const selectedCourseObj = courses.find(
      (c) => c.title === courseMapping || c.id === courseMapping
    );
    if (!selectedCourseObj) return batches;

    const filtered = batches.filter((b) => {
      if (!b.courseId && !b.courseTitle) return true;
      if (b.courseId && b.courseId === selectedCourseObj.id) return true;
      if (b.courseTitle && b.courseTitle.toLowerCase() === selectedCourseObj.title.toLowerCase()) return true;
      return false;
    });

    return filtered.length > 0 ? filtered : batches;
  }, [batches, courses, courseMapping]);

  const handleCourseChange = (selectedCourseTitle: string) => {
    setCourseMapping(selectedCourseTitle);
    if (selectedCourseTitle) {
      const selectedCourseObj = courses.find((c) => c.title === selectedCourseTitle || c.id === selectedCourseTitle);
      if (selectedCourseObj) {
        const validBatches = batches.filter((b) =>
          b.courseId === selectedCourseObj.id || (b.courseTitle && b.courseTitle.toLowerCase() === selectedCourseObj.title.toLowerCase())
        );
        if (validBatches.length > 0 && !validBatches.some((b) => b.name === batchSelection)) {
          setBatchSelection(validBatches[0].name);
        }
      }
    }
  };

  const handleBatchChange = (selectedBatchName: string) => {
    setBatchSelection(selectedBatchName);
    if (selectedBatchName) {
      const matchedBatch = batches.find((b) => b.name === selectedBatchName);
      if (matchedBatch?.courseTitle) {
        setCourseMapping(matchedBatch.courseTitle);
      } else if (matchedBatch?.courseId) {
        const matchedCourse = courses.find((c) => c.id === matchedBatch.courseId);
        if (matchedCourse) setCourseMapping(matchedCourse.title);
      }
    }
  };

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

  const totalMarks = questions.reduce((acc, q) => acc + (q.marks || 0), 0);

  // Question builder helpers
  const handleAddQuestion = () => {
    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      questionText: "",
      questionType: "Multiple Choice",
      marks: 5,
      options: [
        { id: `opt-${Date.now()}-1`, text: "Option 1", isCorrect: false },
        { id: `opt-${Date.now()}-2`, text: "Option 2 (Correct Answer)", isCorrect: true }
      ]
    };
    setQuestions([...questions, newQ]);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].questionText = text;
    setQuestions(updated);
  };

  const updateQuestionType = (index: number, type: "Multiple Choice" | "Long Text") => {
    const updated = [...questions];
    updated[index].questionType = type;
    setQuestions(updated);
  };

  const updateQuestionMarks = (index: number, marksVal: string) => {
    const val = parseInt(marksVal, 10);
    const updated = [...questions];
    updated[index].marks = isNaN(val) ? 1 : Math.max(1, Math.min(100, val));
    setQuestions(updated);
  };

  const updateOptionText = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = text;
    setQuestions(updated);
  };

  const setCorrectOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.forEach((opt, i) => {
      opt.isCorrect = i === optIndex;
    });
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    const count = updated[qIndex].options.length + 1;
    updated[qIndex].options.push({
      id: `opt-${Date.now()}-${count}`,
      text: `Option ${count}`,
      isCorrect: false
    });
    setQuestions(updated);
  };

  const handleDeleteOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) {
      alert("Multiple Choice questions require at least 2 options.");
      return;
    }
    const wasCorrect = updated[qIndex].options[optIndex].isCorrect;
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);
    if (wasCorrect && updated[qIndex].options.length > 0) {
      updated[qIndex].options[0].isCorrect = true;
    }
    setQuestions(updated);
  };

  const handleUploadMedia = (qIndex: number, type: "image" | "video") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          const updated = [...questions];
          updated[qIndex].mediaType = type;
          updated[qIndex].mediaUrl = result;
          setQuestions(updated);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoveMedia = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].mediaType = null;
    updated[qIndex].mediaUrl = null;
    setQuestions(updated);
  };

  const handleDeleteQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      alert("An exam must contain at least 1 question.");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const resetForm = () => {
    setExamTitle("");
    setBatchSelection("");
    setCourseMapping("");
    setExamDate("");
    setStartTime("");
    setDurationMins("120");
    setPassingMark("60");
    setQuestions([
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
  };

  // Validation function
  const validateExamForm = (): string | null => {
    if (!examTitle.trim()) return "Exam Title is required.";
    if (!examDate.trim()) return "Exam Date is required in Scheduling.";
    if (!startTime.trim()) return "Start Time is required in Scheduling.";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        return `Please enter Question Text for Question ${i + 1}.`;
      }
      if (q.questionType === "Multiple Choice") {
        if (q.options.length < 2) {
          return `Question ${i + 1} must have at least 2 options.`;
        }
        const hasCorrect = q.options.some((opt) => opt.isCorrect);
        if (!hasCorrect) {
          return `Please select a correct answer for Question ${i + 1}.`;
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].text.trim()) {
            return `Option ${j + 1} text for Question ${i + 1} cannot be empty.`;
          }
        }
      }
    }

    return null;
  };

  const saveExamData = async (targetStatus: "SCHEDULED" | "DRAFT") => {
    const err = validateExamForm();
    if (err) {
      alert(err);
      return;
    }

    try {
      await apiRequest("/admin/exams", {
        method: "POST",
        body: JSON.stringify({
          title: examTitle.trim(),
          examCode: `EX-2024-${Math.floor(100 + Math.random() * 900)}`,
          batchCourse: batchSelection || courseMapping || "All Batches",
          examDate,
          startTime,
          durationMins,
          passingMark: parseInt(passingMark, 10) || 60,
          autoGrading,
          randomizeQuestions,
          questions,
          status: targetStatus
        }),
      });

      alert(`Exam "${examTitle}" ${targetStatus === "DRAFT" ? "saved as Draft" : "published"} successfully!`);
      setIsCreatingExam(false);
      resetForm();
      fetchExams();
    } catch (err: any) {
      alert(err?.message || "Failed to save exam.");
    }
  };

  const filteredExams = examsList.filter((exam) => {
    if (activeFilterTab === "All") return true;
    return exam.status.toUpperCase() === activeFilterTab.toUpperCase();
  });

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
                <h3 className="font-sans font-extrabold text-3xl text-stone-900 mt-1">{examsList.length}</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#9E0C25] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">ACTIVE TODAY</p>
                <h3 className="font-sans font-extrabold text-3xl text-sky-600 mt-1">
                  {examsList.filter((e) => e.status === "LIVE").length}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SCHEDULED</p>
                <h3 className="font-sans font-extrabold text-3xl text-amber-600 mt-1">
                  {examsList.filter((e) => e.status === "SCHEDULED").length}
                </h3>
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 text-xs font-semibold">
                        Loading exams...
                      </td>
                    </tr>
                  ) : filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
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
                            onClick={() => alert(`Exam Options for "${exam.title}"`)}
                            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 text-xs font-semibold">
                        No exams found. Click &quot;Create New Exam&quot; to schedule one.
                      </td>
                    </tr>
                  )}
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveExamData("SCHEDULED");
            }}
            className="flex flex-col lg:flex-row items-start gap-8"
          >
            
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
                      <label className="block text-xs font-bold text-stone-700">Course Mapping</label>
                      <div className="relative">
                        <select
                          value={courseMapping}
                          onChange={(e) => handleCourseChange(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option value="">Select Course</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">Batch Selection</label>
                      <div className="relative">
                        <select
                          value={batchSelection}
                          onChange={(e) => handleBatchChange(e.target.value)}
                          className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                        >
                          <option value="">Select Batch</option>
                          {availableBatchesForSelectedCourse.map((b) => (
                            <option key={b.id} value={b.name}>
                              {b.name} {b.courseTitle ? `(${b.courseTitle})` : ""}
                            </option>
                          ))}
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
                      min={0}
                      max={100}
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
                  <span className="text-xs font-bold text-stone-400">Total Marks: {totalMarks}</span>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={q.id} className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-md bg-rose-100/80 text-[#9E0C25] text-[10.5px] font-extrabold uppercase">
                        {qIndex + 1}. {q.questionType === "Multiple Choice" ? "MCQ QUESTION" : "LONG TEXT QUESTION"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(qIndex)}
                        className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="lg:col-span-8 space-y-1.5">
                        <label className="block text-xs font-bold text-stone-700">Question Text</label>
                        <textarea
                          rows={3}
                          placeholder="Enter the question prompt here..."
                          value={q.questionText}
                          onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                          className="w-full p-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                        />
                      </div>

                      <div className="lg:col-span-4 space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-stone-700">Question Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuestionType(qIndex, "Multiple Choice")}
                              className={`py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                                q.questionType === "Multiple Choice"
                                  ? "bg-[#9E0C25] text-white"
                                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                              }`}
                            >
                              Multiple Choice
                            </button>
                            <button
                              type="button"
                              onClick={() => updateQuestionType(qIndex, "Long Text")}
                              className={`py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                                q.questionType === "Long Text"
                                  ? "bg-[#9E0C25] text-white"
                                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                              }`}
                            >
                              Long Text
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-stone-700">Marks per Question</label>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={q.marks}
                            onChange={(e) => updateQuestionMarks(qIndex, e.target.value)}
                            className="w-full h-10 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Media Attachments */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-stone-700">Media Attachment</label>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleUploadMedia(qIndex, "image")}
                          className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            q.mediaType === "image"
                              ? "bg-rose-50 border-[#9E0C25] text-[#9E0C25]"
                              : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{q.mediaType === "image" ? "Change Image" : "Upload Image"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUploadMedia(qIndex, "video")}
                          className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            q.mediaType === "video"
                              ? "bg-rose-50 border-[#9E0C25] text-[#9E0C25]"
                              : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          <VideoIcon className="w-3.5 h-3.5" />
                          <span>{q.mediaType === "video" ? "Change Video" : "Upload Video"}</span>
                        </button>

                        {q.mediaUrl && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(qIndex)}
                            className="px-3 py-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 hover:bg-rose-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Media</span>
                          </button>
                        )}
                      </div>

                      {/* Media Preview Box */}
                      {q.mediaUrl && (
                        <div className="mt-3 p-3 bg-stone-100 border border-stone-200 rounded-2xl max-w-md">
                          {q.mediaType === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={q.mediaUrl}
                              alt="Question Media Preview"
                              className="max-h-48 rounded-xl object-contain mx-auto shadow-2xs"
                            />
                          ) : (
                            <video
                              src={q.mediaUrl}
                              controls
                              className="max-h-48 w-full rounded-xl object-contain bg-black shadow-2xs"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Answer Options (for Multiple Choice) */}
                    {q.questionType === "Multiple Choice" && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-stone-700">Answer Options (Select Radio for Correct Option)</label>
                          <button
                            type="button"
                            onClick={() => handleAddOption(qIndex)}
                            className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer"
                          >
                            + Add Option
                          </button>
                        </div>
                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => (
                            <div key={opt.id || optIndex} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`correct-opt-${q.id}`}
                                checked={opt.isCorrect}
                                onChange={() => setCorrectOption(qIndex, optIndex)}
                                className="accent-[#9E0C25] w-4 h-4 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className={`flex-1 h-10 px-4 rounded-xl text-xs font-semibold focus:outline-none ${
                                  opt.isCorrect ? "bg-white border-2 border-rose-300 text-stone-900 font-bold" : "bg-white border border-stone-200 text-stone-700"
                                }`}
                              />
                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOption(qIndex, optIndex)}
                                  className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer font-bold"
                                  title="Delete Option"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                        type="date"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white focus:bg-white/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white/90">START TIME</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-white focus:bg-white/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-white/90">DURATION (MINUTES)</label>
                    <input
                      type="number"
                      min={5}
                      max={600}
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
                  onClick={() => saveExamData("DRAFT")}
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
