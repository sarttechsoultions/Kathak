"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import {
  FileText,
  AlertCircle,
  MessageSquare,
  Upload,
  Eye,
  Filter,
  ArrowUpDown,
  Loader2
} from "lucide-react";

interface StudentTaskUIItem {
  id: string;
  submissionId?: string;
  name: string;
  category: string;
  assignedBy: string;
  assignedByRole: string;
  dateAssigned: string;
  deadline: string;
  deadlineNote: string;
  status: string;
  statusColor: string;
  isOverdue: boolean;
  action: "upload" | "view" | "overdue_alert" | "evaluation_feedback";
}

interface StudentSubmissionRawRecord {
  id: string;
  taskId?: string;
  studentId: string;
  studentName?: string;
  studentAvatar?: string;
  studentBatch?: string;
  submissionDate?: string;
  courseAndBatch?: string;
  videoTitle?: string;
  fileUrl?: string;
  status: string;
  marks?: number | string | null;
  feedbackNotes?: string;
  correctionNotes?: string[];
}

export default function StudentVideoSubmissionPage() {
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [tasksList, setTasksList] = useState<StudentTaskUIItem[]>([]);
  const [avgScore, setAvgScore] = useState<number>(85);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDynamicData = async () => {
      try {
        setLoading(true);

        const savedUserStr = localStorage.getItem("kathak_student_user") || localStorage.getItem("kathak_token");
        let studentId = "student-me";
        if (savedUserStr) {
          try {
            const u = JSON.parse(savedUserStr);
            if (u.id) studentId = u.id;
          } catch {}
        }

        // Fetch both tasks AND student's video submission history
        const [tasksRes, subRes] = await Promise.all([
          apiRequest<{ data?: any[] }>("/video/tasks"),
          apiRequest<{ data?: any[] }>(`/video/student/${studentId}/history`)
        ]);

        const submissions = (subRes && Array.isArray(subRes.data)) ? subRes.data : [];

        const evaluatedSubmissions = submissions.filter(
          (s: StudentSubmissionRawRecord) => s.status === "REVIEWED" || (s.marks !== null && s.marks !== undefined)
        );
        if (evaluatedSubmissions.length > 0) {
          const sum = evaluatedSubmissions.reduce((acc: number, curr: StudentSubmissionRawRecord) => {
            const m = Number(curr.marks);
            if (isNaN(m)) return acc;
            return acc + (m <= 10 ? m * 10 : m);
          }, 0);
          setAvgScore(Math.round(sum / evaluatedSubmissions.length));
        }

        if (isMounted && tasksRes?.data && Array.isArray(tasksRes.data) && tasksRes.data.length > 0) {
          const mapped: StudentTaskUIItem[] = tasksRes.data.map((t: any, idx: number) => {
            const isOverdue = t.submissionDate ? new Date(t.submissionDate) < new Date() : false;

            // Check if student has submitted for this task (match by taskId or title)
            const matchedSub = submissions.find((s: any) =>
              (s.taskId && s.taskId === t.id) ||
              (s.videoTitle && t.title && s.videoTitle.toLowerCase().trim() === t.title.toLowerCase().trim()) ||
              (t.title && s.videoTitle && s.videoTitle.toLowerCase().includes(t.title.toLowerCase()))
            );

            if (matchedSub) {
              const isEvaluated = matchedSub.status === "REVIEWED" || matchedSub.marks !== null;
              return {
                id: t.id || `task-${idx}`,
                submissionId: matchedSub.id,
                name: t.title || "Practice Session Task",
                category: (t.category || "KATHAK").toUpperCase(),
                assignedBy: t.createdByName || "Super Admin",
                assignedByRole: t.creatorRole === "ADMIN" ? "Admin" : "Faculty",
                dateAssigned: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                deadline: t.submissionDate ? new Date(t.submissionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                deadlineNote: isEvaluated ? "Evaluated" : "Submitted - Awaiting Review",
                status: isEvaluated ? "Evaluated" : "Submitted",
                statusColor: isEvaluated ? "bg-purple-100 text-purple-800" : "bg-[#E5F2FF] text-[#2B78C5]",
                isOverdue: false,
                action: isEvaluated ? "evaluation_feedback" : "view",
              };
            }

            return {
              id: t.id || `task-${idx}`,
              name: t.title || "Practice Session Task",
              category: (t.category || "KATHAK").toUpperCase(),
              assignedBy: t.createdByName || "Super Admin",
              assignedByRole: t.creatorRole === "ADMIN" ? "Admin" : "Faculty",
              dateAssigned: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
              deadline: t.submissionDate ? new Date(t.submissionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
              deadlineNote: isOverdue ? "Overdue" : "Due soon",
              status: isOverdue ? "Overdue" : "Assigned",
              statusColor: isOverdue ? "bg-[#FDF2F4] text-rose-700" : "bg-[#E5F2FF] text-sky-800",
              isOverdue,
              action: isOverdue ? "overdue_alert" : "upload",
            };
          });

          // Also append any submissions that were submitted directly without a task ID
          submissions.forEach((s: any, idx: number) => {
            const existsInMapped = mapped.some(m => m.submissionId === s.id);
            if (!existsInMapped) {
              const isEvaluated = s.status === "REVIEWED" || s.marks !== null;
              mapped.push({
                id: s.id || `sub-${idx}`,
                submissionId: s.id,
                name: s.videoTitle || "Practice Submission",
                category: "PRACTICE",
                assignedBy: "Super Admin",
                assignedByRole: "Faculty",
                dateAssigned: s.submissionDate ? new Date(s.submissionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                deadline: s.submissionDate ? new Date(s.submissionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Submitted",
                deadlineNote: isEvaluated ? "Evaluated" : "Submitted - Awaiting Review",
                status: isEvaluated ? "Evaluated" : "Submitted",
                statusColor: isEvaluated ? "bg-purple-100 text-purple-800" : "bg-[#E5F2FF] text-[#2B78C5]",
                isOverdue: false,
                action: isEvaluated ? "evaluation_feedback" : "view",
              });
            }
          });

          setTasksList(mapped);
        } else if (submissions.length > 0) {
          // If no tasks exist in DB, show student's submissions list
          const mapped: StudentTaskUIItem[] = submissions.map((s: any, idx: number) => {
            const isEvaluated = s.status === "REVIEWED" || s.marks !== null;
            return {
              id: s.id || `sub-${idx}`,
              submissionId: s.id,
              name: s.videoTitle || "Practice Video Submission",
              category: "KATHAK",
              assignedBy: "Super Admin",
              assignedByRole: "Faculty",
              dateAssigned: s.submissionDate ? new Date(s.submissionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
              deadline: "Submitted",
              deadlineNote: isEvaluated ? "Evaluated" : "Submitted - Awaiting Review",
              status: isEvaluated ? "Evaluated" : "Submitted",
              statusColor: isEvaluated ? "bg-purple-100 text-purple-800" : "bg-[#E5F2FF] text-[#2B78C5]",
              isOverdue: false,
              action: isEvaluated ? "evaluation_feedback" : "view",
            };
          });
          setTasksList(mapped);
        }
      } catch (err) {
        console.error("Fetch Student Tasks Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDynamicData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTasks = tasksList.filter((task) => {
    if (activeTab === "All Tasks") return true;
    if (activeTab === "Assigned") return task.status === "Assigned";
    if (activeTab === "Submitted") return task.status === "Submitted";
    if (activeTab === "Evaluated") return task.status === "Evaluated";
    if (activeTab === "Overdue") return task.isOverdue || task.status === "Overdue";
    return true;
  });

  const pendingCount = tasksList.filter((t) => t.status === "Assigned" || t.isOverdue).length;
  const evaluatedCount = tasksList.filter((t) => t.status === "Evaluated" || t.status === "Submitted").length;

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
          My Tasks
        </h1>
        <p className="text-sm font-normal text-[#464555]">
          Manage your practice routine and course assignments.
        </p>
      </div>

      {/* TOP 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: TOTAL TASKS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">TOTAL TASKS</span>
            <span className="text-3xl font-extrabold text-[#1B1B24]">{tasksList.length}</span>
            <span className="text-xs text-purple-600 font-semibold block">Fetched live from database</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: PENDING SUBMISSIONS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">PENDING SUBMISSIONS</span>
            <span className="text-3xl font-extrabold text-[#1B1B24]">{String(pendingCount).padStart(2, '0')}</span>
            <span className="text-xs text-rose-600 font-semibold block">{tasksList.filter(t => t.isOverdue).length} overdue tasks</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: COMPLETED REVIEWS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">COMPLETED REVIEWS</span>
            <span className="text-3xl font-extrabold text-[#1B1B24]">{String(evaluatedCount).padStart(2, '0')}</span>
            <span className="text-xs text-sky-600 font-semibold block">Average score: {avgScore}%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* TABS & FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {["All Tasks", "Assigned", "Submitted", "Evaluated", "Overdue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#900C27] text-white shadow-sm"
                  : tab === "Overdue"
                  ? "bg-[#FDF2F4] text-rose-700 hover:bg-rose-100"
                  : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter & Sort Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span>Filter</span>
          </button>
          <button className="bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span>Sort</span>
          </button>
        </div>

      </div>

      {/* TASKS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Header */}
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-4 px-6">TASK NAME &amp; CATEGORY</th>
                <th className="py-4 px-4">ASSIGNED BY</th>
                <th className="py-4 px-4">DATE ASSIGNED</th>
                <th className="py-4 px-4">DEADLINE</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-6 text-center">ACTION</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-stone-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                    <Loader2 className="w-6 h-6 animate-spin text-[#900C27] mx-auto mb-2" />
                    Loading practice tasks from database...
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400 font-semibold">
                    No tasks found in this section.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`transition-colors ${
                      task.isOverdue ? "bg-rose-50/40 hover:bg-rose-50/70" : "hover:bg-stone-50/60"
                    }`}
                  >
                    {/* Task Name & Category */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="font-bold text-sm text-[#1B1B24] block">
                          {task.name}
                        </span>
                        <span className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          {task.category}
                        </span>
                      </div>
                    </td>

                    {/* Assigned By */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-stone-300 overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/Ananya.png" alt={task.assignedBy} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-stone-800">{task.assignedBy}</span>
                      </div>
                    </td>

                    {/* Date Assigned */}
                    <td className="py-4 px-4 font-medium text-stone-600">
                      {task.dateAssigned}
                    </td>

                    {/* Deadline */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-[#1B1B24] block">{task.deadline}</span>
                        <span
                          className={`text-[10px] font-semibold block ${
                            task.isOverdue
                              ? "text-rose-600"
                              : task.status === "Submitted" || task.status === "Evaluated"
                              ? "text-emerald-600"
                              : "text-sky-600"
                          }`}
                        >
                          {task.deadlineNote}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.statusColor}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {task.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-6 text-center">
                      {task.action === "upload" && (
                        <Link
                          href={`/student/video-submission/upload?id=${task.id}`}
                          className="p-2 rounded-xl text-[#900C27] hover:bg-rose-50 transition-colors inline-block"
                          title="Upload Video Submission"
                        >
                          <Upload className="w-4 h-4" />
                        </Link>
                      )}

                      {(task.action === "view" || task.action === "evaluation_feedback") && (
                        <Link
                          href={`/student/video-submission/evaluation${task.submissionId ? `?submissionId=${task.submissionId}` : ''}`}
                          className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors inline-block"
                          title="View Submission Details"
                        >
                          <Eye className="w-4 h-4 text-[#2B78C5]" />
                        </Link>
                      )}

                      {task.action === "overdue_alert" && (
                        <Link
                          href={`/student/video-submission/upload?id=${task.id}`}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 transition-colors inline-block"
                          title="Overdue - Submit Immediately"
                        >
                          <span className="text-rose-600 font-extrabold text-base">!</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
