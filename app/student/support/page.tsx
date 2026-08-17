"use client";

import React, { useState } from "react";
import { HelpCircle, Send, CheckCircle2, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

export default function StudentSupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await apiRequest(ENDPOINTS.SUPPORT_SUBMIT, {
        method: "POST",
        body: JSON.stringify({ subject, message, classMode: "ONLINE" })
      });
      
      if (res.status === "success") {
        setIsSuccess(true);
        setSubject("");
        setMessage("");
      } else {
        alert(res.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit ticket. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
          <HelpCircle className="w-7 h-7 text-[#900C27]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contact Support</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">
            Need help with your classes, assignments, or fees? Send a message to the Admin team.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        
        <div className="p-6 sm:p-10">
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-stone-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ticket Submitted!</h2>
              <p className="text-sm font-medium text-stone-500 max-w-md">
                We have successfully received your query. Our admin team will review it and reply to your registered email address within 24 hours.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-6 px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-colors cursor-pointer"
              >
                Submit Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Alert Info */}
              <div className="flex gap-3 bg-stone-50 border border-stone-200 p-4 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-[#900C27] shrink-0 mt-0.5" />
                <p className="text-[13px] font-medium text-stone-600 leading-relaxed">
                  Your Name, Email, and Student ID will be automatically attached to this ticket. Please provide as much detail as possible in the message box below so we can resolve your issue quickly!
                </p>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  placeholder="E.g. Unable to upload video assignment"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-white border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#900C27] focus:ring-1 focus:ring-[#900C27] transition-all disabled:opacity-50"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider">Message</label>
                <textarea
                  rows={6}
                  placeholder="Describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="w-full p-4 rounded-xl bg-white border border-stone-200 text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#900C27] focus:ring-1 focus:ring-[#900C27] transition-all disabled:opacity-50 resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !subject.trim() || !message.trim()}
                  className={`px-8 py-3.5 rounded-xl text-sm font-extrabold shadow-md transition-all flex items-center gap-2 uppercase tracking-wide ${
                    isSubmitting || !subject.trim() || !message.trim()
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                      : "bg-[#900C27] text-white hover:bg-[#7a0a21] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
      
      {/* FAQs Snippet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600 shrink-0 mt-0.5">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm mb-1">When will I get a reply?</h3>
            <p className="text-xs font-medium text-stone-500 leading-relaxed">Our support team operates Mon-Sat, 9 AM - 6 PM. Most tickets are resolved within 24 hours.</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm mb-1">Emergency Queries</h3>
            <p className="text-xs font-medium text-stone-500 leading-relaxed">If you are facing a payment failure issue, please include the Razorpay Transaction ID in your message.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
