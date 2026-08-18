'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info, Calendar, Clock, Settings, Edit3, Trash2, Image as ImageIcon, Video, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  marks: string;
  type: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  options: Option[];
}

interface Batch {
  id: string;
  name: string;
  code: string;
  courseId: string;
  courseName: string;
}

export default function CreateNewExam() {
  const router = useRouter();

  // --- Form States ---
  const [examTitle, setExamTitle] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examDate, setExamDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('120');

  const [autoGrading, setAutoGrading] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [passingScore, setPassingScore] = useState(40);

  // --- Dynamic Data States ---
  const [teacherBatches, setTeacherBatches] = useState<Batch[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Media Upload States ---
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingState, setUploadingState] = useState<{ id: string; type: 'image' | 'video' } | null>(null);

  // --- Questions State Management ---
  const [questions, setQuestions] = useState<Question[]>(() => [
    {
      id: Date.now().toString(),
      text: '',
      marks: '5',
      type: 'Multiple Choice',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: true },
        { id: 3, text: '', isCorrect: false }
      ]
    }
  ]);
  const [activeQIndex, setActiveQIndex] = useState(0);

  const activeQ = questions[activeQIndex];
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  // --- Fetch Teacher's Batches ---
  useEffect(() => {
    let isMounted = true;
    const fetchBatches = async () => {
      try {
        const res = await apiRequest<{
          data?: {
            courses?: {
              id: string;
              title: string;
              batches: { id: string; name: string; code?: string; courseId?: string; courseName?: string }[]
            }[]
          }
        }>("/video/teacher/assigned-courses-batches");
        if (isMounted && res?.data?.courses) {
          const fetchedBatches: Batch[] = [];
          res.data.courses.forEach((c) => {
            if (Array.isArray(c.batches)) {
              c.batches.forEach((b) => {
                fetchedBatches.push({
                  id: String(b.id),
                  name: b.name,
                  code: b.code || "",
                  courseId: String(b.courseId || c.id),
                  courseName: b.courseName || c.title,
                });
              });
            }
          });
          setTeacherBatches(fetchedBatches);
        }
      } catch (err) {
        console.error("Failed to load batches:", err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };
    fetchBatches();
    return () => { isMounted = false; };
  }, []);



  // --- Question Helpers ---
  const updateActiveQuestion = (updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[activeQIndex] = { ...newQuestions[activeQIndex], ...updates };
    setQuestions(newQuestions);
  };

  const addOption = () => {
    const newOpts = [...activeQ.options, { id: Date.now(), text: '', isCorrect: false }];
    updateActiveQuestion({ options: newOpts });
  };

  const updateOptionText = (optId: number, text: string) => {
    const newOpts = activeQ.options.map(o => o.id === optId ? { ...o, text } : o);
    updateActiveQuestion({ options: newOpts });
  };

  const setCorrectOption = (optId: number) => {
    const newOpts = activeQ.options.map(o => ({ ...o, isCorrect: o.id === optId }));
    updateActiveQuestion({ options: newOpts });
  };

  const addNewQuestion = () => {
    const newQ: Question = {
      id: Date.now().toString(),
      text: '',
      marks: '5',
      type: 'Multiple Choice',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: true },
        { id: 3, text: '', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQ]);
    setActiveQIndex(questions.length);
  };

  const deleteActiveQuestion = () => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, i) => i !== activeQIndex);
    setQuestions(newQuestions);
    setActiveQIndex(Math.max(0, activeQIndex - 1));
  };

  // --- Upload Handler ---
  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("File must be under 50MB");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    setUploadingState({ id: activeQ.id, type: isVideo ? 'video' : 'image' });

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const endpoint = isVideo ? `${base}/upload/video` : `${base}/upload/image`;
    const fieldName = isVideo ? "video" : "image";

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const token = localStorage.getItem("kathak_admin_token") || localStorage.getItem("token") || "";
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", endpoint);
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      const uploadedUrl = await new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(json?.data?.url || json?.data?.secure_url || json?.data?.directUrl || "");
            } else reject(new Error(json.message));
          } catch { reject(new Error("Upload failed")); }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });

      if (uploadedUrl) {
        updateActiveQuestion({ mediaUrl: uploadedUrl, mediaType: isVideo ? 'video' : 'image' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(msg);
    } finally {
      setUploadingState(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- Submit Handler ---
  const handlePublish = async (isDraft = false) => {
    if (!examTitle || !examDate || !startTime || !selectedBatch) {
      alert("Please fill in Exam Title, Batch, Date, and Time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: examTitle,
        batchId: selectedBatch,
        courseId: selectedCourse,
        date: `${examDate}T${startTime}:00`,
        durationMins: Number(duration) || 120,
        totalMarks: totalMarks,
        passingMarks: passingScore,
        type: "THEORY",
        status: isDraft ? "DRAFT" : "SCHEDULED",
        questions: questions.map((q) => ({
          questionText: q.text,
          marks: Number(q.marks),
          questionType: q.type,
          mediaUrl: q.mediaType === 'video' ? q.mediaUrl : null,
          imageUrl: q.mediaType === 'image' ? q.mediaUrl : null,
          options: q.options.map(o => ({ text: o.text, isCorrect: o.isCorrect }))
        }))
      };

      await apiRequest("/teacher/exams", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      alert(isDraft ? "Exam saved as draft!" : "Exam successfully scheduled!");
      router.push("/teacher/exam");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save exam.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-8 pb-24" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-[1200px] mx-auto">

        {/* Top Navigation */}
        <div className="mb-6 ">
          <Link href="/teacher/exam" className="inline-flex items-center border border-[#c8c8c8] text-[#0B1C30] hover:text-white hover:bg-[#A42E30] transition-colors rounded">
            <span className="px-4 py-2.5 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </span>
          </Link>
        </div>

        {/* Top Section: Basic Info & Scheduling */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">

          {/* Basic Information */}
          <div className="flex-1 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-[#A42E30]" />
              <h2 className="text-[20px] font-bold text-[#0B1C30]">Basic Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Exam Title</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Mid-term Assessment: Advanced Quantum Mechanics"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all text-sm placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Batch Selection</label>
                  <div className="relative">
                    <select
                      value={selectedBatch}
                      onChange={(e) => {
                        const newBatchId = e.target.value;
                        setSelectedBatch(newBatchId);

                        const batchObj = teacherBatches.find(b => b.id === newBatchId);
                        if (batchObj) {
                          setSelectedCourse(batchObj.courseId);
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl appearance-none outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all text-sm text-gray-600"
                    >
                      <option value="" disabled>{loadingData ? "Loading..." : "Select Batch"}</option>
                      {teacherBatches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Course Mapping</label>
                  <div className="relative">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl appearance-none outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all text-sm text-gray-600"
                    >
                      <option value="" disabled>Select Course</option>
                      {Array.from(new Set(teacherBatches.map(b => JSON.stringify({ id: b.courseId, name: b.courseName }))))
                        .map(str => JSON.parse(str))
                        .map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="w-full lg:w-[320px] bg-[#9F3031] p-8 rounded-2xl text-white relative overflow-hidden shadow-lg shrink-0">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="flex items-center gap-2 mb-8 relative z-10">
              <Clock className="w-5 h-5 text-white/80" />
              <h2 className="text-[20px] font-bold text-white">Scheduling</h2>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wide">Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-sm text-white placeholder-white/50 focus:bg-white/20 transition-all [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wide">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-sm text-white placeholder-white/50 focus:bg-white/20 transition-all [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-2 uppercase tracking-wide">Duration (Minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-sm text-white focus:bg-white/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exam Settings */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-[#A42E30]" />
            <h2 className="text-[20px] font-bold text-[#0B1C30]">Exam Settings</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-6">

            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => setAutoGrading(!autoGrading)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full mt-1 transition-colors ${autoGrading ? 'bg-[#A42E30]' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoGrading ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <div>
                <div className="font-bold text-[#0B1C30]">Auto-grading</div>
                <div className="text-xs text-gray-500 mt-1">Enable instant feedback for<br />objective questions.</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => setRandomizeQuestions(!randomizeQuestions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full mt-1 transition-colors ${randomizeQuestions ? 'bg-[#A42E30]' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${randomizeQuestions ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <div>
                <div className="font-bold text-[#0B1C30]">Randomize Questions</div>
                <div className="text-xs text-gray-500 mt-1">Shuffle question order for each<br />individual student.</div>
              </div>
            </div>

            <div className="w-full lg:w-[300px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#0B1C30]">Passing Score (%)</span>
                <span className="text-sm font-bold text-[#A42E30]">{passingScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A42E30]"
              />
            </div>

          </div>
        </div>

        {/* Question Builder */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#A42E30]" />
              <h2 className="text-[20px] font-bold text-[#0B1C30]">Question Builder</h2>
            </div>
            <div className="bg-[#FFF1F1] text-[#A42E30] px-4 py-1.5 rounded-full text-sm font-bold">
              Total Marks: {totalMarks}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#A42E30] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {activeQIndex + 1}
                </div>
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase">ACTIVE QUESTION</div>

                <div className="flex gap-1.5 ml-4">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveQIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${idx === activeQIndex ? 'w-8 bg-[#A42E30]' : 'w-4 bg-[#E5E7EB] hover:bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              <button type="button" onClick={deleteActiveQuestion} className="text-gray-400 hover:text-[#A42E30] transition-colors p-2">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">

                <div>
                  <label className="block text-xs font-bold text-[#0B1C30] mb-2">Question Text</label>
                  <textarea
                    rows={4}
                    value={activeQ.text}
                    onChange={(e) => updateActiveQuestion({ text: e.target.value })}
                    placeholder="Enter the question prompt here..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#A42E30] focus:ring-1 focus:ring-[#A42E30] transition-all text-sm resize-none"
                  ></textarea>
                </div>

                {/* Media Attachments Fix Applied */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="block text-xs font-bold text-[#0B1C30]">Media Attachment</label>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                  />

                  {activeQ.mediaUrl ? (
                    <div className="mb-3 p-4 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-800">
                          {activeQ.mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully!
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateActiveQuestion({ mediaUrl: undefined, mediaType: undefined })}
                        className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={!!uploadingState}
                          className="flex items-center justify-center gap-2 py-3 border border-gray-200 border-dashed rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {uploadingState?.id === activeQ.id && uploadingState?.type === 'image' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                          Upload Image
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={!!uploadingState}
                          className="flex items-center justify-center gap-2 py-3 border border-gray-200 border-dashed rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {uploadingState?.id === activeQ.id && uploadingState?.type === 'video' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                          Upload Video
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg py-3 text-center text-xs font-medium text-gray-500">
                        No media attached. Supports JPG, PNG, MP4 up to 50MB
                      </div>
                    </>
                  )}
                </div>

                {activeQ.type === 'Multiple Choice' && (
                  <div>
                    <label className="block text-xs font-bold text-[#0B1C30] mb-3">Answer Choices</label>
                    <div className="space-y-3">
                      {activeQ.options.map((opt, idx) => (
                        <div key={opt.id} className={`flex items-center gap-4 ${!opt.isCorrect ? 'group' : ''}`}>
                          {opt.isCorrect ? (
                            <div className="w-5 h-5 rounded-full border-[6px] border-[#A42E30] bg-white flex-shrink-0 shadow-[0_0_0_1px_rgba(164,46,48,0.2)]"></div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setCorrectOption(opt.id)}
                              className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 group-hover:border-[#A42E30] transition-colors cursor-pointer"
                            ></button>
                          )}
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => updateOptionText(opt.id, e.target.value)}
                            placeholder={`Option ${idx + 1}${opt.isCorrect ? ' (Correct Answer)' : ''}`}
                            className={opt.isCorrect
                              ? "flex-1 px-4 py-2.5 bg-[#FFF8F8] border border-[#FCA5A5] rounded-lg outline-none text-sm text-[#A42E30]"
                              : "flex-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg outline-none focus:border-gray-300 focus:bg-white transition-all text-sm"
                            }
                          />
                        </div>
                      ))}

                      <button type="button" onClick={addOption} className="flex items-center gap-1.5 text-[#A42E30] text-xs font-bold mt-4 hover:underline">
                        <Plus className="w-3.5 h-3.5" />
                        Add Option
                      </button>
                    </div>
                  </div>
                )}

              </div>

              <div className="w-full lg:w-[200px] space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#0B1C30] mb-3">Question Type</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => updateActiveQuestion({ type: 'Multiple Choice' })}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${activeQ.type === 'Multiple Choice'
                          ? 'bg-[#A42E30] border-[#A42E30] text-white'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 ${activeQ.type === 'Multiple Choice' ? 'border-white bg-white/20' : 'border-gray-400'}`}>
                        {activeQ.type === 'Multiple Choice' && <div className="w-full h-full rounded-full bg-white border-[2px] border-[#A42E30]"></div>}
                      </div>
                      Multiple Choice
                    </button>

                    <button
                      type="button"
                      onClick={() => updateActiveQuestion({ type: 'Long Text' })}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${activeQ.type === 'Long Text'
                          ? 'bg-[#A42E30] border-[#A42E30] text-white'
                          : 'bg-[#F8F9FB] border-transparent text-[#0B1C30] hover:bg-gray-100'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Long Text
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C30] mb-2">Marks per Question</label>
                  <input
                    type="number"
                    value={activeQ.marks}
                    onChange={(e) => updateActiveQuestion({ marks: e.target.value })}
                    className="w-24 px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#A42E30] transition-all text-sm"
                  />
                </div>

              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={addNewQuestion}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#A42E30] hover:border-[#A42E30] hover:bg-[#FFF1F1] transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">Add New Question</span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-8 z-50 flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => handlePublish(true)}
          disabled={isSubmitting}
          className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-[#0B1C30] hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handlePublish(false)}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#A42E30] rounded-xl text-sm font-bold text-white hover:bg-[#8B2627] shadow-md shadow-[#A42E30]/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:-translate-y-0 flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Publish Exam
        </button>
      </div>
    </div>
  );
}