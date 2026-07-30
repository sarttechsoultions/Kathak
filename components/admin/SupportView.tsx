"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Wrench,
  Globe,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Paperclip,
  Send,
  LifeBuoy,
  FileText,
  ShieldCheck,
  Server,
  Monitor,
  Zap,
  ArrowRight,
  Eye
} from "lucide-react";

interface SupportTicket {
  id: string;
  ticketCode: string;
  categoryType: "Technical" | "Dashboard";
  subject: string;
  submittedBy: string;
  avatar: string;
  lastUpdated: string;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN PROGRESS" | "RESOLVED";
}

const mockTickets: SupportTicket[] = [
  {
    id: "t-1",
    ticketCode: "TCK-8921",
    categoryType: "Technical",
    subject: "Live Class Video Streaming Latency on Mobile App",
    submittedBy: "Guru Harshita",
    avatar: "/Ananya.png",
    lastUpdated: "10 Mins ago",
    priority: "HIGH",
    status: "IN PROGRESS"
  },
  {
    id: "t-2",
    ticketCode: "TCK-8918",
    categoryType: "Dashboard",
    subject: "Unable to export monthly attendance report PDF",
    submittedBy: "Ananya Admin",
    avatar: "/Sunita.png",
    lastUpdated: "1 Hour ago",
    priority: "MEDIUM",
    status: "OPEN"
  },
  {
    id: "t-3",
    ticketCode: "TCK-8904",
    categoryType: "Technical",
    subject: "Payment Callback Gateway Sync Issue for Term Fees",
    submittedBy: "Finance Team",
    avatar: "/Meera.png",
    lastUpdated: "Yesterday",
    priority: "URGENT",
    status: "RESOLVED"
  },
  {
    id: "t-4",
    ticketCode: "TCK-8890",
    categoryType: "Dashboard",
    subject: "Bulk Student Certificate Generation Permission Request",
    submittedBy: "Rajesh Kumar",
    avatar: "/Grace1.png",
    lastUpdated: "2 Days ago",
    priority: "LOW",
    status: "RESOLVED"
  }
];

export default function SupportView() {
  const [activeTab, setActiveTab] = useState<"All" | "Technical" | "Dashboard">("All");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New Ticket Form State
  const [ticketType, setTicketType] = useState<"Technical" | "Dashboard">("Technical");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketPriority, setTicketPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [ticketMessage, setTicketMessage] = useState("");

  // FAQs Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) {
      alert("Please enter a ticket subject.");
      return;
    }

    const newTicket: SupportTicket = {
      id: `t-${mockTickets.length + 1}`,
      ticketCode: `TCK-${Math.floor(8900 + Math.random() * 100)}`,
      categoryType: ticketType,
      subject: ticketSubject,
      submittedBy: "Admin User",
      avatar: "/Ananya.png",
      lastUpdated: "Just now",
      priority: ticketPriority,
      status: "OPEN"
    };

    mockTickets.unshift(newTicket);
    alert(`Support Ticket ${newTicket.ticketCode} submitted successfully! Our engineers will respond shortly.`);
    setShowNewTicketModal(false);
    setTicketSubject("");
    setTicketMessage("");
  };

  const faqsList = [
    {
      q: "How to troubleshoot video playback or streaming latency in Live Classes?",
      a: "Ensure your internet speed is at least 10 Mbps. If latency persists, switch video resolution to 720p or restart the streaming CDN gateway from the Technical Support panel."
    },
    {
      q: "How do I issue certificates in bulk for a whole batch?",
      a: "Go to Digital Certificate Hub > Issue New Certificate, select the Batch from the dropdown, choose your template, and click 'Send Certificates to All Students'."
    },
    {
      q: "What should I do if a student payment status shows pending after deduction?",
      a: "Navigate to Finance > Search Student ID. Click 'Re-sync Gateway Transaction' to auto-fetch payment confirmation from the Razorpay API."
    },
    {
      q: "How to update teacher permissions or add a new faculty member?",
      a: "Go to Teachers management in the sidebar, click 'Add New Teacher', select their role (Head Faculty vs Assistant Instructor), and assign their designated batches."
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* Header Banner & New Ticket Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Support &amp; Help Desk
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-500 max-w-3xl">
            Get instant assistance, submit technical tickets, and resolve academy dashboard or streaming inquiries.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* 2 Primary Support Type Cards (Technical vs Dashboard Operations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category 1: Technical & System Support */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-[#4a0612] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-stone-800 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Operational</span>
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-playfair font-bold text-2xl text-white">Technical &amp; System Support</h3>
              <p className="text-xs text-stone-300 font-medium leading-relaxed max-w-md">
                API connectivity, video streaming latency, payment gateway sync, server uptime, and database backup inquiries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setTicketType("Technical");
                setShowNewTicketModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Submit Tech Ticket</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => alert("Checking Technical Infrastructure Status: Uptime 99.98%, API Latency 42ms.")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              System Status
            </button>
          </div>
        </div>

        {/* Category 2: Web & Dashboard Operations Support */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs border border-stone-200/80 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Globe className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-extrabold border border-sky-200">
                Operations Desk
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-playfair font-bold text-2xl text-stone-900">Web &amp; Dashboard Operations</h3>
              <p className="text-xs text-stone-500 font-medium leading-relaxed max-w-md">
                Class scheduling, student enrollment, content library uploads, certificate issuing, and account permission guides.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
            <button
              onClick={() => {
                setTicketType("Dashboard");
                setShowNewTicketModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Submit Ops Ticket</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => alert("Opening Academy Operations User Guide...")}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
            >
              User Guide
            </button>
          </div>
        </div>

      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Open Tickets</p>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-sky-600 mt-1">4</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Avg Response Time</p>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">14 Mins</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">System Uptime</p>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-purple-600 mt-1">99.98%</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Resolved Tickets</p>
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">1,280</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Support Tickets Directory Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
        
        {/* Controls Sub-Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2">
            {(["All", "Technical", "Dashboard"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#9E0C25] text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tab === "All" ? "All Tickets" : tab === "Technical" ? "🛠️ Technical Support" : "🌐 Web & Dashboard Ops"}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticket ID or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
            />
          </div>

        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                <th className="py-3.5 px-4">TICKET ID</th>
                <th className="py-3.5 px-4">CATEGORY</th>
                <th className="py-3.5 px-4">SUBJECT</th>
                <th className="py-3.5 px-4">SUBMITTED BY</th>
                <th className="py-3.5 px-4">LAST UPDATED</th>
                <th className="py-3.5 px-4">PRIORITY</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
              {mockTickets
                .filter((t) => activeTab === "All" || t.categoryType === activeTab)
                .filter((t) => t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                    
                    {/* Ticket Code */}
                    <td className="py-4 px-4 font-bold text-[#9E0C25]">{t.ticketCode}</td>

                    {/* Category Badge */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        t.categoryType === "Technical"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-sky-100 text-sky-800"
                      }`}>
                        {t.categoryType === "Technical" ? "🛠️ Technical" : "🌐 Dashboard Ops"}
                      </span>
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-4 font-bold text-stone-900 max-w-[280px] truncate">{t.subject}</td>

                    {/* Submitted By */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.avatar} alt={t.submittedBy} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <span className="font-semibold text-stone-700">{t.submittedBy}</span>
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 font-semibold text-stone-400">{t.lastUpdated}</td>

                    {/* Priority */}
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold ${
                        t.priority === "URGENT"
                          ? "bg-rose-600 text-white"
                          : t.priority === "HIGH"
                          ? "bg-rose-100 text-rose-700"
                          : t.priority === "MEDIUM"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-100 text-stone-600"
                      }`}>
                        {t.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                        t.status === "RESOLVED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : t.status === "IN PROGRESS"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-sky-50 text-sky-700 border border-sky-200"
                      }`}>
                        • {t.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => alert(`Opening Ticket Details for ${t.ticketCode}`)}
                        className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-900 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Interactive FAQs Accordion Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="font-playfair font-bold text-xl text-stone-900">
            Frequently Asked Support Questions
          </h3>
          <p className="text-xs text-stone-400 font-medium">
            Quick resolution guides for common technical and dashboard inquiries.
          </p>
        </div>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="rounded-2xl border border-stone-200/80 overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-sans font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-between gap-4 bg-stone-50/60 hover:bg-stone-100/80 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#9E0C25]" : ""}`} />
                </button>

                {isOpen && (
                  <div className="p-4 bg-white border-t border-stone-100 text-xs font-medium text-stone-600 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW TICKET SUBMISSION MODAL */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 border border-stone-200">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-playfair font-bold text-xl text-stone-900">Submit New Support Ticket</h3>
                <p className="text-xs text-stone-400 font-medium">Direct line to our technical &amp; operations team.</p>
              </div>
              <button onClick={() => setShowNewTicketModal(false)} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs font-semibold">
              
              {/* Support Type Selector */}
              <div className="space-y-1.5">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">SUPPORT TYPE</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTicketType("Technical")}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      ticketType === "Technical"
                        ? "border-[#9E0C25] bg-rose-50 text-[#9E0C25] shadow-xs"
                        : "border-stone-200 bg-stone-50 text-stone-600"
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>🛠️ Technical</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTicketType("Dashboard")}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      ticketType === "Dashboard"
                        ? "border-[#9E0C25] bg-rose-50 text-[#9E0C25] shadow-xs"
                        : "border-stone-200 bg-stone-50 text-stone-600"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>🌐 Dashboard Ops</span>
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">SUBJECT</label>
                <input
                  type="text"
                  placeholder="Summarize the issue or request..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                />
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">PRIORITY</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketPriority(p)}
                      className={`py-2 rounded-lg text-[10.5px] font-extrabold border cursor-pointer ${
                        ticketPriority === p
                          ? "border-[#9E0C25] bg-[#9E0C25] text-white"
                          : "border-stone-200 bg-stone-50 text-stone-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">DESCRIPTION</label>
                <textarea
                  rows={4}
                  placeholder="Provide steps to reproduce or specific details..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold text-xs focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase"
                >
                  Submit Ticket
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
