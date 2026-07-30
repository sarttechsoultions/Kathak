"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  LayoutGrid,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Info,
  Film,
  Upload,
  Link2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Lightbulb
} from "lucide-react";

interface CourseRecord {
  id: string;
  code: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  teacherName: string;
  teacherAvatar: string;
  duration: string;
  studentsCount: string;
  studentPercent: string;
  status: "Active" | "Draft";
  thumbnail: string;
}

const initialCourses: CourseRecord[] = [
  {
    id: "crs-1",
    code: "CRS-101",
    title: "Kathak Foundations",
    category: "Classical Dance",
    level: "Beginner",
    teacherName: "Arun Sharma",
    teacherAvatar: "/Sunita.png",
    duration: "6 Months",
    studentsCount: "45/50",
    studentPercent: "90%",
    status: "Active",
    thumbnail: "/kathak_course_dancer_1785146082697.jpg"
  },
  {
    id: "crs-2",
    code: "CRS-104",
    title: "Vinyasa Flow Advanced",
    category: "Yoga",
    level: "Advanced",
    teacherName: "Elena Rodriguez",
    teacherAvatar: "/Ananya.png",
    duration: "3 Months",
    studentsCount: "12/20",
    studentPercent: "60%",
    status: "Draft",
    thumbnail: "/kathak_dancer_portrait_1785143850699.jpg"
  },
  {
    id: "crs-3",
    code: "CRS-110",
    title: "Masterclass: Piano",
    category: "Music Theory",
    level: "Intermediate",
    teacherName: "Sarah Chen",
    teacherAvatar: "/Meera.png",
    duration: "12 Months",
    studentsCount: "30/30",
    studentPercent: "FULL",
    status: "Active",
    thumbnail: "/gurukul-dancer.jpg"
  }
];

export default function CourseView() {
  const [coursesList, setCoursesList] = useState<CourseRecord[]>(initialCourses);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("All Categories");
  const [courseLevelFilter, setCourseLevelFilter] = useState("All Levels");
  const [courseTeacherFilter, setCourseTeacherFilter] = useState("All Teachers");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // Form State
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("Classical Dance");
  const [newCourseLevel, setNewCourseLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseVideoUrl, setNewCourseVideoUrl] = useState("");
  const [newCourseDurationNum, setNewCourseDurationNum] = useState("6");
  const [newCourseDurationUnit, setNewCourseDurationUnit] = useState("Months");
  const [newCourseCapacity, setNewCourseCapacity] = useState("40 Students");
  const [newCourseFee, setNewCourseFee] = useState("45,000");
  const [newCourseTeacher, setNewCourseTeacher] = useState("Arun Sharma");

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CourseRecord = {
      id: `crs-${Date.now()}`,
      code: `CRS-${Math.floor(100 + Math.random() * 900)}`,
      title: newCourseName || "New Kathak Course",
      category: newCourseCategory || "Classical Dance",
      level: newCourseLevel,
      teacherName: newCourseTeacher || "Arun Sharma",
      teacherAvatar: newCourseTeacher.includes("Sarah") ? "/Meera.png" : newCourseTeacher.includes("Elena") ? "/Ananya.png" : "/Sunita.png",
      duration: `${newCourseDurationNum} ${newCourseDurationUnit}`,
      studentsCount: `0/${newCourseCapacity.replace(/\D/g, "") || "40"}`,
      studentPercent: "0%",
      status: "Active",
      thumbnail: "/kathak_course_dancer_1785146082697.jpg"
    };

    setCoursesList([created, ...coursesList]);
    alert(`Course "${created.title}" published successfully!`);
    setIsCreatingCourse(false);
  };

  return (
    <div>
      {!isCreatingCourse ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Course Management
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-stone-500 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-stone-800">
                  <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                  142 Total Courses
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 text-sky-600">
                  <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                  12 New this month
                </span>
              </p>
            </div>

            <button
              onClick={() => setIsCreatingCourse(true)}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search courses, codes..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={courseCategoryFilter}
                    onChange={(e) => setCourseCategoryFilter(e.target.value)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>All Categories</option>
                    <option>Classical Dance</option>
                    <option>Yoga</option>
                    <option>Music Theory</option>
                    <option>Contemporary</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={courseLevelFilter}
                    onChange={(e) => setCourseLevelFilter(e.target.value)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>All Levels</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={courseTeacherFilter}
                    onChange={(e) => setCourseTeacherFilter(e.target.value)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>All Teachers</option>
                    <option>Arun Sharma</option>
                    <option>Elena Rodriguez</option>
                    <option>Sarah Chen</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button className="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50 text-stone-700 transition-colors">
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3 px-4">COURSE</th>
                    <th className="py-3 px-4">CATEGORY</th>
                    <th className="py-3 px-4">LEVEL</th>
                    <th className="py-3 px-4">TEACHER</th>
                    <th className="py-3 px-4">DURATION</th>
                    <th className="py-3 px-4">STUDENTS</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {coursesList.map((crs) => (
                    <tr key={crs.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={crs.thumbnail} alt={crs.title} className="w-12 h-10 rounded-lg object-cover border border-stone-200 shrink-0" />
                          <div>
                            <span className="block font-bold text-stone-900 text-sm">{crs.title}</span>
                            <span className="block text-[11px] text-stone-400 font-semibold uppercase">{crs.code}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-stone-700 font-semibold">{crs.category}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10.5px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                          {crs.level}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={crs.teacherAvatar} alt={crs.teacherName} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                          <span className="font-bold text-stone-900 leading-tight block">{crs.teacherName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-stone-700 font-medium">{crs.duration}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-stone-900 text-xs">{crs.studentsCount}</span>
                          <span className="font-extrabold text-[10px] text-sky-600">{crs.studentPercent}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold bg-emerald-100/80 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {crs.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-stone-400">
                          <button onClick={() => alert(`View ${crs.title}`)} className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => alert(`Edit ${crs.title}`)} className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => alert(`Delete ${crs.title}`)} className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <div>Showing 1-{coursesList.length} of 142 courses</div>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-400 hover:bg-stone-50 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
                <button className="w-8 h-8 rounded-lg border border-stone-200/80 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1200px] mx-auto">
          <div className="space-y-1">
            <button
              onClick={() => setIsCreatingCourse(false)}
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
            <p className="text-xs font-medium text-stone-500">Configure institutional curriculum details and faculty assignments.</p>
          </div>

          <form onSubmit={handlePublishCourse} className="flex flex-col lg:flex-row items-start gap-8">
            <div className="w-full lg:w-64 shrink-0 space-y-6">
              <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-1">
                {["Basic Info", "Curriculum", "Media", "Scheduling"].map((label, idx) => (
                  <div key={label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold ${idx === 0 ? "bg-rose-50 text-[#9E0C25]" : "text-stone-500"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${idx === 0 ? "bg-[#9E0C25] text-white" : "bg-stone-100"}`}>{idx + 1}</div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-[#9E0C25]" />
                  <span>Basic Information</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Course Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kathak Intermediate Footwork"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsCreatingCourse(false)} className="px-6 py-2.5 rounded-xl border border-stone-300 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-7 py-2.5 rounded-xl bg-[#9E0C25] text-white font-bold text-xs shadow-md">Publish Course</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
