"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useMemo, useState } from "react";
import { BarChart2, Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Download, Printer, RotateCw, Save, Users, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

type Status = "U" | "P" | "A" | "L" | "LV";
interface Record { id: string; studentId: string; name: string; email?: string; avatar: string; batchCode: string; courseName: string; status: Status; }
interface Batch { id: string; name: string; code: string; course: string; status: string; }

const sessions = ["Morning Session", "Afternoon Session", "Evening Session"];

export default function AttendanceView() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedSession, setSelectedSession] = useState(sessions[0]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [analytics, setAnalytics] = useState<{ id: string; name: string; rate: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const metrics = useMemo(() => ({
    total: records.length,
    present: records.filter((record) => record.status === "P").length,
    absent: records.filter((record) => record.status === "A").length,
    unmarked: records.filter((record) => record.status === "U").length
  }), [records]);
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const visibleRecords = records.slice((page - 1) * pageSize, page * pageSize);
  const selectedBatch = batches.find((batch) => batch.id === selectedBatchId);
  const summaryCards: { Icon: LucideIcon; label: string; value: number; color: string }[] = [
    { Icon: Users, label: "Enrolled Students", value: metrics.total, color: "text-indigo-600" },
    { Icon: CheckCircle2, label: "Present", value: metrics.present, color: "text-emerald-600" },
    { Icon: XCircle, label: "Absent", value: metrics.absent, color: "text-rose-600" },
    { Icon: CalendarIcon, label: "Unmarked", value: metrics.unmarked, color: "text-amber-600" }
  ];

  const loadBatches = async () => {
    const response = await apiRequest(ENDPOINTS.ADMIN_BATCHES);
    const loaded = (response.data?.batches ?? []).filter((batch: Batch) => batch.status === "Active");
    setBatches(loaded);
    setSelectedBatchId((current) => loaded.some((batch: Batch) => batch.id === current) ? current : loaded[0]?.id || "");
  };

  const loadAttendance = async () => {
    if (!selectedBatchId) { setRecords([]); setAnalytics([]); return; }
    setLoading(true);
    try {
      const query = new URLSearchParams({ date: selectedDate, batchId: selectedBatchId, session: selectedSession });
      const response = await apiRequest(`${ENDPOINTS.ADMIN_ATTENDANCE}?${query}`);
      setRecords(response.data?.records ?? []);
      setAnalytics(response.data?.batchAnalytics ?? []);
      setPage(1);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadBatches().catch(() => setLoading(false)); }, []);
  useEffect(() => { loadAttendance().catch(() => { setRecords([]); setAnalytics([]); setLoading(false); }); }, [selectedBatchId, selectedDate, selectedSession]);

  const setStatus = (id: string, status: Status) => setRecords((current) => current.map((record) => record.id === id ? { ...record, status } : record));
  const markAll = (status: Status) => setRecords((current) => current.map((record) => ({ ...record, status })));
  const saveAttendance = async () => {
    if (!selectedBatchId) return;
    setSaving(true);
    try {
      await apiRequest(ENDPOINTS.ADMIN_ATTENDANCE, { method: "POST", body: JSON.stringify({ batchId: selectedBatchId, date: selectedDate, session: selectedSession, records }) });
      await loadAttendance();
      await openThemeSuccess("Attendance saved successfully.", "Attendance Saved");
    } finally { setSaving(false); }
  };
  const exportCsv = () => {
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const content = [["Student", "Student ID", "Batch", "Course", "Session", "Date", "Status"], ...records.map((r) => [escape(r.name), r.studentId, escape(r.batchCode), escape(r.courseName), escape(selectedSession), selectedDate, r.status])].map((line) => line.join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" })); link.download = `attendance-${selectedDate}.csv`; link.click(); URL.revokeObjectURL(link.href);
  };

  return <div className="space-y-8 animate-in fade-in duration-300 max-w-[1350px] mx-auto pb-12">
    <div><h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900">Attendance Management</h1><p className="text-sm text-stone-500 mt-1">Mark and save attendance for enrolled students.</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map(({ Icon, label, value, color }) => <div key={label} className="bg-white rounded-2xl border border-stone-200 p-5"><Icon className={`w-5 h-5 ${color}`} /><p className="text-xs font-semibold text-stone-500 mt-3">{label}</p><p className="text-3xl font-black text-stone-900">{value}</p></div>)}
    </div>
    <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-wrap gap-3 items-center">
      <input aria-label="Attendance date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="h-10 px-3 rounded-xl border border-stone-200 text-sm font-semibold" />
      <select aria-label="Batch" value={selectedBatchId} onChange={(event) => setSelectedBatchId(event.target.value)} className="h-10 px-3 rounded-xl border border-stone-200 text-sm font-semibold min-w-52"><option value="">Select an active batch</option>{batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.name} · {batch.code}</option>)}</select>
      <select aria-label="Session" value={selectedSession} onChange={(event) => setSelectedSession(event.target.value)} className="h-10 px-3 rounded-xl border border-stone-200 text-sm font-semibold">{sessions.map((session) => <option key={session}>{session}</option>)}</select>
      <div className="ml-auto flex flex-wrap gap-2"><button onClick={() => markAll("P")} disabled={!records.length} className="px-3 py-2 rounded-xl text-xs font-bold border border-emerald-200 text-emerald-700 disabled:opacity-50">Mark all present</button><button onClick={exportCsv} className="px-3 py-2 rounded-xl text-xs font-bold border border-stone-200 flex gap-1"><Download className="w-4 h-4" />Export</button><button onClick={() => window.print()} className="px-3 py-2 rounded-xl text-xs font-bold border border-stone-200 flex gap-1"><Printer className="w-4 h-4" />Print</button><button onClick={saveAttendance} disabled={!records.length || saving} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#9E0C25] text-white disabled:opacity-50 flex gap-1">{saving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? "Saving" : "Save attendance"}</button></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden"><div className="p-5 border-b border-stone-100"><h2 className="font-bold text-stone-900">{selectedBatch ? `${selectedBatch.name} — ${selectedSession}` : "Select a batch"}</h2></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-stone-50 text-[11px] uppercase text-stone-500"><tr><th className="p-4">Student</th><th className="p-4">Course</th><th className="p-4 text-center">Status</th></tr></thead><tbody className="divide-y divide-stone-100">{loading ? <tr><td colSpan={3} className="p-12 text-center text-stone-400"><RotateCw className="inline w-5 h-5 animate-spin mr-2" />Loading attendance…</td></tr> : !selectedBatchId ? <tr><td colSpan={3} className="p-12 text-center text-stone-400">Select a batch to load its enrolled students.</td></tr> : visibleRecords.length ? visibleRecords.map((record) => <tr key={record.id}><td className="p-4"><div className="font-bold text-stone-900">{record.name}</div><div className="text-xs text-stone-400">{record.studentId}</div></td><td className="p-4 text-sm text-stone-600">{record.courseName}</td><td className="p-4"><div className="flex justify-center gap-1">{(["U", "P", "A", "L", "LV"] as Status[]).map((status) => <button key={status} onClick={() => setStatus(record.id, status)} title={{ U: "Unmarked", P: "Present", A: "Absent", L: "Late", LV: "Leave" }[status]} className={`w-8 h-8 rounded-lg text-xs font-black border ${record.status === status ? ({ U: "bg-amber-500 text-white", P: "bg-emerald-500 text-white", A: "bg-rose-600 text-white", L: "bg-orange-500 text-white", LV: "bg-stone-600 text-white" }[status]) : "border-stone-200 text-stone-500"}`}>{status}</button>)}</div></td></tr>) : <tr><td colSpan={3} className="p-12 text-center text-stone-400">No enrolled students in this batch. Add students from Batch Management first.</td></tr>}</tbody></table></div>{records.length > pageSize && <div className="p-4 border-t flex justify-between text-sm"><span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, records.length)} of {records.length}</span><div className="flex gap-2"><button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft /></button><button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight /></button></div></div>}</div><aside className="bg-white rounded-2xl border border-stone-200 p-5"><div className="flex items-center gap-2 font-bold text-stone-900"><BarChart2 className="w-4 h-4 text-[#9E0C25]" />Batch attendance rate</div><p className="text-xs text-stone-500 mt-1">Present and late students, for the selected date and session.</p><div className="space-y-4 mt-5">{analytics.length ? analytics.map((batch) => <div key={batch.id}><div className="flex justify-between text-xs font-bold"><span>{batch.name}</span><span>{batch.rate}%</span></div><div className="h-2 bg-stone-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${batch.rate}%` }} /></div></div>) : <p className="text-sm text-stone-400">No active batches.</p>}</div></aside></div>
  </div>;
}
