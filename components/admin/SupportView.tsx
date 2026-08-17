"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  Mail,
  User,
  MoreVertical,
  X,
  Send,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

interface Inquiry {
  id: string;
  fullName: string;
  contactInfo: string;
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "REPLIED" | string;
  createdAt: string;
}

export default function SupportView() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "NEW" | "RESOLVED">("ALL");
  
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(ENDPOINTS.ADMIN_INQUIRIES);
      if (res.status === "success") {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry) return;
    if (!replyMessage.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    try {
      setIsSendingReply(true);
      const res = await apiRequest(`${ENDPOINTS.ADMIN_INQUIRIES}/${selectedInquiry.id}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: replyMessage })
      });
      
      if (res.status === "success") {
        alert("Reply sent successfully via Email!");
        // Update local state to reflect RESOLVED status
        setInquiries(prev => prev.map(inq => 
          inq.id === selectedInquiry.id ? { ...inq, status: "RESOLVED" } : inq
        ));
        setSelectedInquiry(prev => prev ? { ...prev, status: "RESOLVED" } : null);
        setReplyMessage("");
      }
    } catch (err) {
      console.error("Failed to send reply", err);
      alert("Failed to send reply. Please check connection.");
    } finally {
      setIsSendingReply(false);
    }
  };

  // Derived state
  const filteredInquiries = inquiries.filter(inq => {
    if (activeFilter === "NEW" && inq.status === "RESOLVED") return false;
    if (activeFilter === "RESOLVED" && inq.status !== "RESOLVED") return false;
    
    const searchMatch = inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        inq.contactInfo.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  const totalQueries = inquiries.length;
  const newQueries = inquiries.filter(i => i.status !== "RESOLVED").length;
  const resolvedQueries = inquiries.filter(i => i.status === "RESOLVED").length;

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-300 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            User Helpdesk Inbox
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-500">
            Manage inquiries, answer student questions, and provide support.
          </p>
        </div>
      </div>

      {/* 3 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Total Queries</p>
            <h3 className="font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{totalQueries}</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-rose-400">Unread / Pending</p>
            <h3 className="font-extrabold text-2xl sm:text-3xl text-[#9E0C25] mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{newQueries}</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#9E0C25] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Resolved</p>
            <h3 className="font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{resolvedQueries}</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Split Pane Interface */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px] pb-10">
        
        {/* Left Pane: Inbox List */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-stone-100 space-y-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25] transition-colors"
              />
            </div>
            
            <div className="flex gap-2">
              {(["ALL", "NEW", "RESOLVED"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                    activeFilter === f 
                      ? "bg-[#9E0C25] text-white"
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  }`}
                >
                  {f === "NEW" ? "PENDING" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 text-[#9E0C25] animate-spin" />
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-8 text-center text-stone-400 flex flex-col items-center">
                <Mail className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-wider">Inbox Empty</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {filteredInquiries.map((inq) => (
                  <button
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`w-full text-left p-4 transition-all hover:bg-rose-50/50 focus:outline-none ${
                      selectedInquiry?.id === inq.id ? "bg-rose-50 border-l-4 border-[#9E0C25]" : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-stone-900 truncate pr-2">{inq.fullName}</h4>
                      <span className="text-[10px] font-semibold text-stone-400 shrink-0">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-stone-800 truncate mb-1.5">{inq.subject}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] text-stone-500 truncate pr-4">{inq.message}</p>
                      {inq.status !== "RESOLVED" && (
                        <span className="w-2 h-2 rounded-full bg-[#9E0C25] shrink-0"></span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Message Detail & Reply */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col overflow-hidden relative">
          
          {!selectedInquiry ? (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400 p-8">
              <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-stone-300" />
              </div>
              <p className="text-sm font-bold text-stone-500">Select an inquiry to view details</p>
              <p className="text-xs font-medium text-stone-400 mt-1">Read messages and reply via email instantly.</p>
            </div>
          ) : (
            <>
              {/* Detail Header */}
              <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold shrink-0">
                      {selectedInquiry.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-stone-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedInquiry.fullName}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs font-medium text-stone-500">
                          <Mail className="w-3 h-3" /> {selectedInquiry.contactInfo}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                          {new Date(selectedInquiry.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-stone-200 text-[10px] font-extrabold uppercase tracking-wider">
                    {selectedInquiry.status === "RESOLVED" ? (
                      <><CheckCircle2 className="w-3 h-3 text-emerald-500"/> <span className="text-emerald-700">Resolved</span></>
                    ) : (
                      <><AlertCircle className="w-3 h-3 text-amber-500"/> <span className="text-amber-700">Pending Action</span></>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 hover:bg-stone-200 rounded-xl text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Body */}
              <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
                <h3 className="text-base font-black text-stone-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{selectedInquiry.subject}</h3>
                <div className="text-sm text-stone-700 font-medium leading-relaxed whitespace-pre-wrap bg-white p-5 rounded-2xl border border-stone-100 shadow-xs">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Email Reply Box */}
              <div className="p-4 sm:p-6 border-t border-stone-100 bg-white">
                <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-2">
                  Reply via Email (To: {selectedInquiry.contactInfo})
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    placeholder="Type your response here... It will be sent to their email."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full p-4 pb-14 rounded-2xl bg-stone-50 border border-stone-200 text-sm font-medium text-stone-900 focus:bg-white focus:outline-none focus:border-[#9E0C25] resize-none transition-colors"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {selectedInquiry.status === "RESOLVED" && (
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase mr-2">
                        Already Resolved
                      </span>
                    )}
                    <button
                      onClick={handleSendReply}
                      disabled={isSendingReply || !replyMessage.trim()}
                      className={`px-5 py-2 rounded-xl text-xs font-extrabold uppercase shadow-sm transition-all flex items-center gap-2 ${
                        isSendingReply || !replyMessage.trim()
                          ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                          : "bg-[#9E0C25] text-white hover:bg-[#800A1E] cursor-pointer hover:shadow-md"
                      }`}
                    >
                      {isSendingReply ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Send Reply</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
