"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  FileText,
  Download,
  Loader2
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function StudentProgressPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await apiRequest(ENDPOINTS.STUDENT_PROGRESS);
      setData(response.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT": return "bg-[#E6F7ED] text-[#22A05B]";
      case "ABSENT": return "bg-[#FDF2F4] text-[#C10F3A]";
      case "LATE": return "bg-amber-100 text-amber-700";
      case "GRADED": return "text-emerald-600";
      case "SUBMITTED": return "text-blue-600";
      case "PENDING": return "text-amber-600";
      case "OVERDUE": return "text-rose-600";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#900C27]" />
      </div>
    );
  }

  if (!data) return null;

  const { metrics, attendanceHistory, assignments, tasks } = data;

  return (
    <div className="space-y-8 font-sans pb-16 animate-in fade-in duration-300">
      
      {/* PAGE HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold text-[#900C27] tracking-tight">
            Student Progress
          </h1>
          <p className="text-xs font-semibold text-stone-400">
            Real-time Performance Dashboard
          </p>
        </div>

        <button className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0">
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* TOP 4 METRIC SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: OVERALL PROGRESS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">OVERALL PROGRESS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B24]">{metrics.overallProgress}%</span>
              <span className="text-xs font-semibold text-stone-400">Score</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#900C27] h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.overallProgress}%` }} />
          </div>
        </div>

        {/* Card 2: ATTENDANCE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-400">
              {metrics.presentDays}/{metrics.totalDays} Days
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">ATTENDANCE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B24]">{metrics.attendanceRate}%</span>
              <span className="text-xs font-semibold text-stone-400">Present</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.attendanceRate}%` }} />
          </div>
        </div>

        {/* Card 3: TASK COMPLETION */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-400">
              {metrics.completedTasks}/{metrics.totalTasks} Done
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">TASK COMPLETION</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B24]">{metrics.taskCompletionRate}%</span>
              <span className="text-xs font-semibold text-stone-400">Rate</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-600 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.taskCompletionRate}%` }} />
          </div>
        </div>

        {/* Card 4: ASSIGNMENT COMPLETE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
              {metrics.pendingAssignments} Pending
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">ASSIGNMENT SCORE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B24]">{metrics.avgAssignmentScore}</span>
              <span className="text-xs font-semibold text-stone-400">Avg</span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${metrics.avgAssignmentScore}%` }} />
          </div>
        </div>

      </div>

      {/* CLASS ATTENDANCE HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100">
           <h3 className="text-base font-bold text-[#1B1B24]">Recent Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">CLASS</th>
                <th className="py-4 px-6 text-right">STATUS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs">
              {attendanceHistory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-stone-500">No attendance records found.</td>
                </tr>
              ) : (
                attendanceHistory.map((record: any) => (
                  <tr key={record.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-stone-700">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#1B1B24] block text-sm">{record.class}</span>
                      <span className="text-[11px] text-stone-400">{record.instructor}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`${getStatusColor(record.status)} px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGNMENTS SECTION TABLE */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1B1B24]">
          Assignments
        </h3>

        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-4 px-6">TITLE</th>
                  <th className="py-4 px-6">DATES</th>
                  <th className="py-4 px-6">STATUS</th>
                  <th className="py-4 px-6 text-right">MARKS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 text-xs">
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-stone-500">No assignments found.</td>
                  </tr>
                ) : (
                  assignments.map((assignment: any) => (
                    <tr key={assignment.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#1B1B24] text-sm">
                        {assignment.title}
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <span className="text-stone-500 font-medium block">Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</span>
                        <span className="text-stone-400 font-medium block">Deadline: {new Date(assignment.deadline).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-xs ${getStatusColor(assignment.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${assignment.status === 'GRADED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {assignment.status}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right font-semibold ${assignment.marks !== "--" ? 'text-[#900C27] text-sm font-extrabold' : 'text-stone-400'}`}>
                        {assignment.marks} / {assignment.totalMarks}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* TASKS SECTION TABLE */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1B1B24]">
          Tasks & Exams
        </h3>

        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-4 px-6">TITLE</th>
                  <th className="py-4 px-6">DATES</th>
                  <th className="py-4 px-6">STATUS</th>
                  <th className="py-4 px-6 text-right">MARKS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 text-xs">
                 {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-stone-500">No tasks or exams found.</td>
                  </tr>
                ) : (
                  tasks.map((task: any) => (
                    <tr key={task.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#1B1B24] text-sm">
                        {task.title}
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <span className="text-stone-500 font-medium block">Date: {new Date(task.assignedDate).toLocaleDateString()}</span>
                        <span className="text-stone-400 font-medium block">Completed: {new Date(task.completedDate).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-xs ${getStatusColor(task.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'GRADED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                          {task.status}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right font-semibold ${task.marks !== "--" ? 'text-[#900C27] text-sm font-extrabold' : 'text-stone-400'}`}>
                        {task.marks} / {task.totalMarks}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
