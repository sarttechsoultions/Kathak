"use client";

import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  Bell,
  Smartphone,
  Send,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  ChevronDown,
  Upload,
  Bold,
  Italic,
  List,
  Link2,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  Save,
  MessageCircle
} from "lucide-react";

interface CommLog {
  id: string;
  channel: "Email" | "WhatsApp" | "Push" | "SMS";
  recipient: string;
  recipientAvatar?: string;
  subject: string;
  dateSent: string;
  status: "DELIVERED" | "PENDING" | "FAILED";
}

const mockCommLogs: CommLog[] = [
  {
    id: "log-1",
    channel: "Email",
    recipient: "Juliana Smith",
    recipientAvatar: "/Sunita.png",
    subject: "Late Payment Reminder: Kathak Intermediate Fee",
    dateSent: "Oct 24, 09:12 AM",
    status: "DELIVERED"
  },
  {
    id: "log-2",
    channel: "WhatsApp",
    recipient: "Batch B-2024",
    recipientAvatar: "/Ananya.png",
    subject: "Emergency Holiday: Campus Practice Rescheduled",
    dateSent: "Oct 24, 07:30 AM",
    status: "PENDING"
  },
  {
    id: "log-3",
    channel: "Push",
    recipient: "All Students",
    recipientAvatar: "/Meera.png",
    subject: "Upcoming Seminar: Career Opportunities in Classical Dance",
    dateSent: "Oct 23, 04:45 PM",
    status: "DELIVERED"
  },
  {
    id: "log-4",
    channel: "Email",
    recipient: "Robert Miller",
    recipientAvatar: "/Grace1.png",
    subject: "Profile Update Required for Exam Registration",
    dateSent: "Oct 23, 11:20 AM",
    status: "FAILED"
  },
  {
    id: "log-5",
    channel: "SMS",
    recipient: "Amanda King",
    recipientAvatar: "/Sunita.png",
    subject: "Your Kathak Library book return is overdue",
    dateSent: "Oct 23, 09:00 AM",
    status: "DELIVERED"
  }
];

export default function CommunicationView() {
  const [commLogs, setCommLogs] = useState<CommLog[]>(mockCommLogs);
  const [activeTab, setActiveTab] = useState<"Recent" | "Drafts" | "Sent">("Recent");
  const [activeOverviewFilter, setActiveOverviewFilter] = useState<"Direct Messages" | "Batch Announcements" | "Global Broadcasts">("Direct Messages");

  // Navigation View State: 'DASHBOARD' | 'EMAIL_FORM' | 'SMS_FORM' | 'WHATSAPP_FORM'
  const [viewMode, setViewMode] = useState<"DASHBOARD" | "EMAIL_FORM" | "SMS_FORM" | "WHATSAPP_FORM">("DASHBOARD");

  // Email Form State
  const [emailAudience, setEmailAudience] = useState("All Students");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // SMS Form State
  const [smsBatch, setSmsBatch] = useState("Select Specific Batches");
  const [smsTemplate, setSmsTemplate] = useState("");
  const [smsText, setSmsText] = useState("");

  // WhatsApp Form State
  const [waBatch, setWaBatch] = useState("Select Batch");
  const [waStudentSearch, setWaStudentSearch] = useState("");
  const [waContent, setWaContent] = useState(
    "DEAR PARENTS,\n\nThis is to inform you that the Kathak Class scheduled for tomorrow has been rescheduled to 4:00 PM due to the upcoming rehearsal.\n\nPlease ensure the students bring their practice gear.\n\nRegards."
  );

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Email sent successfully!");
    setViewMode("DASHBOARD");
  };

  const handleSendSMS = (e: React.FormEvent) => {
    e.preventDefault();
    alert("SMS Broadcast sent successfully!");
    setViewMode("DASHBOARD");
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    alert("WhatsApp Notification sent successfully!");
    setViewMode("DASHBOARD");
  };

  return (
    <div>
      {/* ================= VIEW 1: COMMUNICATION CENTER MAIN DASHBOARD ================= */}
      {viewMode === "DASHBOARD" && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
          
          {/* Header & Top Tab Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Communication Center
              </h1>
            </div>

            <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl shrink-0">
              {(["Recent", "Drafts", "Sent"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Total Sent</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900">12,482</h3>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +4.2%
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Opened</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-600">92.4%</h3>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +1.7%
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Clicked</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-amber-600">18.7%</h3>
                  <span className="text-[11px] font-bold text-rose-600 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> -0.3%
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Link2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SMS Sent</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-sky-600">3,104</h3>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +2.6%
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Message Overview Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl">
                {(["Direct Messages", "Batch Announcements", "Global Broadcasts"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveOverviewFilter(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeOverviewFilter === tab
                        ? "bg-[#9E0C25] text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-sans font-bold text-lg text-stone-900">Message Overview</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                      <th className="py-3.5 px-4">Channel</th>
                      <th className="py-3.5 px-4">Recipient</th>
                      <th className="py-3.5 px-4">Subject / Heading</th>
                      <th className="py-3.5 px-4">Date Sent</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                    {commLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                        
                        {/* Channel */}
                        <td className="py-4 px-4">
                          <span className="flex items-center gap-2 font-bold text-stone-800">
                            {log.channel === "Email" && <Mail className="w-4 h-4 text-purple-600" />}
                            {log.channel === "WhatsApp" && <MessageCircle className="w-4 h-4 text-emerald-600" />}
                            {log.channel === "Push" && <Bell className="w-4 h-4 text-amber-600" />}
                            {log.channel === "SMS" && <Smartphone className="w-4 h-4 text-sky-600" />}
                            {log.channel}
                          </span>
                        </td>

                        {/* Recipient */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={log.recipientAvatar || "/Ananya.png"} alt={log.recipient} className="w-7 h-7 rounded-full object-cover border border-stone-200 shrink-0" />
                            <span className="font-bold text-stone-900">{log.recipient}</span>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="py-4 px-4 font-medium text-stone-800 max-w-xs truncate">{log.subject}</td>

                        {/* Date Sent */}
                        <td className="py-4 px-4 font-semibold text-stone-500">{log.dateSent}</td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            log.status === "DELIVERED"
                              ? "bg-emerald-100/80 text-emerald-700"
                              : log.status === "PENDING"
                              ? "bg-amber-100/80 text-amber-700"
                              : "bg-rose-100/80 text-rose-700"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              log.status === "DELIVERED" ? "bg-emerald-500" : log.status === "PENDING" ? "bg-amber-500" : "bg-rose-500"
                            }`} />
                            {log.status}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs font-semibold text-stone-400">
                <span>Showing 4 of 1,248 communications</span>
                <button className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">
                  View All Activities
                </button>
              </div>

            </div>

          </div>

          {/* Quick Actions (4 Cards Grid) */}
          <div className="space-y-4 pt-2">
            <h3 className="font-sans font-bold text-lg text-stone-900">Quick Actions</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Draft Email */}
              <div
                onClick={() => setViewMode("EMAIL_FORM")}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#9E0C25] transition-colors">Draft Email</h4>
                    <p className="text-[11px] text-stone-400 font-medium">To batches or groups</p>
                  </div>
                </div>
                <span className="text-stone-400 group-hover:text-[#9E0C25] text-lg font-bold">&gt;</span>
              </div>

              {/* Card 2: WhatsApp Notify */}
              <div
                onClick={() => setViewMode("WHATSAPP_FORM")}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#9E0C25] transition-colors">WhatsApp Notify</h4>
                    <p className="text-[11px] text-stone-400 font-medium">Direct student messaging</p>
                  </div>
                </div>
                <span className="text-stone-400 group-hover:text-[#9E0C25] text-lg font-bold">&gt;</span>
              </div>

              {/* Card 3: Push Alert */}
              <div
                onClick={() => alert("Push Alert Form")}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#9E0C25] transition-colors">Push Alert</h4>
                    <p className="text-[11px] text-stone-400 font-medium">Mobile app broadcasts</p>
                  </div>
                </div>
                <span className="text-stone-400 group-hover:text-[#9E0C25] text-lg font-bold">&gt;</span>
              </div>

              {/* Card 4: SMS Alert */}
              <div
                onClick={() => setViewMode("SMS_FORM")}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#9E0C25] transition-colors">SMS Alert</h4>
                    <p className="text-[11px] text-stone-400 font-medium">Direct mobile text</p>
                  </div>
                </div>
                <span className="text-stone-400 group-hover:text-[#9E0C25] text-lg font-bold">&gt;</span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ================= VIEW 2: SEND EMAIL COMMUNICATION FORM (EXACT FIGMA MATCH) ================= */}
      {viewMode === "EMAIL_FORM" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          
          {/* Back Navigation */}
          <button
            onClick={() => setViewMode("DASHBOARD")}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Send Email Communication</span>
          </button>

          <form onSubmit={handleSendEmail} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
            
            {/* Header Title */}
            <div className="space-y-1 pb-4 border-b border-stone-100">
              <h2 className="font-sans font-extrabold text-xl text-stone-900">Send Email Communication</h2>
              <p className="text-xs text-stone-400 font-medium">
                Compose and send professional email communications to students and specific academic batches.
              </p>
            </div>

            {/* Section 1: Recipient Selection */}
            <div className="space-y-5 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-[#9E0C25] font-bold text-xs flex items-center justify-center">1</span>
                <h4 className="font-bold text-sm text-stone-900">Recipient Selection</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TARGET AUDIENCE</label>
                  <div className="relative">
                    <select
                      value={emailAudience}
                      onChange={(e) => setEmailAudience(e.target.value)}
                      className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                    >
                      <option>All Students</option>
                      <option>Specific Batches</option>
                      <option>Faculty / Teachers</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SELECT SPECIFIC BATCHES</label>
                  <div className="relative">
                    <select className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400">
                      <option>All Students</option>
                      <option>Batch 2024-A</option>
                      <option>Batch 2024-B</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Email Composer */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-[#9E0C25] font-bold text-xs flex items-center justify-center">2</span>
                <h4 className="font-bold text-sm text-stone-900">Email Composer</h4>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SUBJECT LINE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Urgent Update regarding Final Examination Schedule"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                  />
                </div>

                {/* Textarea Editor */}
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">BODY TEXT</label>
                  <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs">
                    <div className="flex items-center gap-3 px-4 py-2 bg-stone-50 border-b border-stone-200 text-stone-500">
                      <button type="button" className="p-1 hover:text-stone-900 font-bold"><Bold className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-stone-900 italic"><Italic className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-stone-900"><List className="w-3.5 h-3.5" /></button>
                      <button type="button" className="p-1 hover:text-stone-900"><Link2 className="w-3.5 h-3.5" /></button>
                    </div>

                    <textarea
                      rows={6}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Type your message here. Use {first_name} for personalization..."
                      className="w-full p-4 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none leading-relaxed resize-none"
                    />
                  </div>
                </div>

                {/* Attach File Drag & Drop Box */}
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">ATTACHMENT</label>
                  <div className="border-2 border-dashed border-stone-300 bg-stone-50/70 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#9E0C25] transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-stone-400" />
                    <h5 className="font-bold text-xs text-stone-800">Click or drag to upload files</h5>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">PDF, PNG, JPG (MAX 10MB EACH)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <span className="text-[11px] font-semibold text-stone-400">Review content before sending.</span>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Send Now</span>
                <Send className="w-3.5 h-3.5 fill-white" />
              </button>
            </div>

          </form>

        </div>
      )}

      {/* ================= VIEW 3: SEND SMS COMMUNICATION FORM (EXACT FIGMA MATCH) ================= */}
      {viewMode === "SMS_FORM" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          
          {/* Back Navigation */}
          <button
            onClick={() => setViewMode("DASHBOARD")}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Send SMS Communication</span>
          </button>

          <form onSubmit={handleSendSMS} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
            
            {/* Header Title */}
            <div className="space-y-1 pb-4 border-b border-stone-100">
              <h2 className="font-sans font-extrabold text-xl text-stone-900">Send SMS Communication</h2>
              <p className="text-xs text-stone-400 font-medium">
                Deploy critical text alerts and announcements to specific student batches or staff groups instantly using our global SMS gateway.
              </p>
            </div>

            {/* Recipient Selection */}
            <div className="space-y-1.5 pb-4 border-b border-stone-100">
              <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">RECIPIENT SELECTION</label>
              <div className="relative max-w-md">
                <select
                  value={smsBatch}
                  onChange={(e) => setSmsBatch(e.target.value)}
                  className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                >
                  <option>Select Specific Batches</option>
                  <option>Batch 2024-A</option>
                  <option>Batch 2024-B</option>
                  <option>All Staff & Faculty</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* SMS Composer */}
            <div className="space-y-4">
              <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SMS COMPOSER</label>

              <div className="space-y-3 max-w-lg">
                <div className="relative">
                  <select
                    value={smsTemplate}
                    onChange={(e) => setSmsTemplate(e.target.value)}
                    className="w-full h-11 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/90 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:outline-none"
                  >
                    <option value="">Select A Template</option>
                    <option value="t1">Exam Schedule Reminder</option>
                    <option value="t2">Class Reschedule Notification</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={160}
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    placeholder="Enter your message here..."
                    className="w-full p-4 rounded-xl bg-white border border-stone-200/90 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 leading-relaxed resize-none"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold text-stone-400">
                    {smsText.length} / 160
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 font-medium">
                  Messages exceeding 160 characters will be sent as 2 SMS credits.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert("Draft Saved")}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => alert("Test SMS sent to admin mobile!")}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Send Test SMS
                </button>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Send SMS Now
              </button>
            </div>

          </form>

        </div>
      )}

      {/* ================= VIEW 4: SEND WHATSAPP COMMUNICATION FORM (EXACT FIGMA MATCH) ================= */}
      {viewMode === "WHATSAPP_FORM" && (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          
          {/* Back Navigation */}
          <button
            onClick={() => setViewMode("DASHBOARD")}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Send WhatsApp Communication</span>
          </button>

          <form onSubmit={handleSendWhatsApp} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
            
            {/* Header Title */}
            <div className="space-y-1 pb-4 border-b border-stone-100">
              <h2 className="font-sans font-extrabold text-xl text-stone-900">Send WhatsApp Communication</h2>
              <p className="text-xs text-stone-400 font-medium">
                Broadcast instant WhatsApp text &amp; media messages directly to parents and students.
              </p>
            </div>

            {/* Select Recipients */}
            <div className="space-y-4 pb-6 border-b border-stone-100">
              <h4 className="font-bold text-sm text-stone-900">Select Recipients</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">ACADEMIC BATCHES</label>
                  <div className="relative">
                    <select
                      value={waBatch}
                      onChange={(e) => setWaBatch(e.target.value)}
                      className="w-full h-11 pl-4 pr-9 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 appearance-none cursor-pointer focus:outline-none focus:border-stone-400"
                    >
                      <option>Select Batch</option>
                      <option>Batch 2024-A</option>
                      <option>Batch 2024-B</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SEARCH INDIVIDUALS</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter student name..."
                      value={waStudentSearch}
                      onChange={(e) => setWaStudentSearch(e.target.value)}
                      className="w-full h-11 pl-9 pr-4 rounded-xl bg-white border border-stone-200/90 text-xs font-semibold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Message Composer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-stone-900">Message Composer</h4>
                <button type="button" className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">+ All Templates</button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">SELECT TEMPLATE</label>
                  <div className="relative max-w-md">
                    <select className="w-full h-11 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/90 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:outline-none">
                      <option>Choose a pre-approved template...</option>
                      <option>Reschedule Notification</option>
                      <option>Fee Reminder</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">MESSAGE CONTENT</label>
                  <textarea
                    rows={5}
                    value={waContent}
                    onChange={(e) => setWaContent(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200/90 text-xs font-medium text-stone-800 focus:bg-white focus:outline-none focus:border-stone-400 leading-relaxed resize-none"
                  />
                </div>

                {/* Media Attachment Drag & Drop Box */}
                <div className="border-2 border-dashed border-stone-300 bg-stone-50/70 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#9E0C25] transition-colors cursor-pointer max-w-md">
                  <Upload className="w-6 h-6 text-stone-400" />
                  <h5 className="font-bold text-xs text-stone-800">Click to upload or drag and drop</h5>
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">IMAGES, JPG, PNG OR DOCUMENTS (PDF - MAX 5MB)</p>
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Send WhatsApp Now</span>
                <Send className="w-3.5 h-3.5 fill-white" />
              </button>
            </div>

          </form>

        </div>
      )}
    </div>
  );
}
