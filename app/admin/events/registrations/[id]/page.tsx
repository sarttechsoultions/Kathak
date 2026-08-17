"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Users, Mail, Phone, Calendar, CheckCircle, Clock } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeError } from "@/components/ThemeDialogProvider";

interface Attendee {
  id: string;
  student: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
  paymentStatus: string;
  registeredAt: string;
}

export default function EventRegistrationsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setIsLoading(true);
      try {
        // Backend API call to get event attendees
        const response = await apiRequest<{ success: boolean; data: { title: string; registrations: Attendee[] } }>(`${ENDPOINTS.ADMIN_EVENTS}/${eventId}/attendees`);
        
        if (response.success && response.data) {
          setEventTitle(response.data.title);
          setAttendees(response.data.registrations);
        }
      } catch (error: unknown) {
        console.error("Failed to load attendees:", error);
        openThemeError((error as { message?: string }).message || "Failed to load registered persons.");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchRegistrations();
    }
  }, [eventId]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Header */}
      <div className="max-w-[1000px] mx-auto mb-8">
        <button 
          onClick={() => router.push("/admin/events")} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors text-[14px] font-medium cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back to Events
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[28px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Registered Persons
            </h1>
            <p className="text-gray-500 text-[14px] mt-1">
              Event: <span className="font-semibold text-gray-800">{eventTitle || "Loading..."}</span>
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-[14px] font-semibold text-gray-700 flex items-center gap-2">
            <Users size={18} className="text-[#9B3434]" />
            Total Registrations: <span className="text-[#9B3434]">{attendees.length}</span>
          </div>
        </div>
      </div>

      {/* Attendees Table Container */}
      <div className="max-w-[1000px] mx-auto bg-white rounded-[16px] border border-gray-100 shadow-sm overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-gray-100">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Registered At</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 text-[14px]">
                    Loading registered persons...
                  </td>
                </tr>
              ) : attendees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 text-[14px]">
                    No registrations found for this event yet.
                  </td>
                </tr>
              ) : (
                attendees.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#9B3434]/10 text-[#9B3434] flex items-center justify-center text-[12px] font-bold">
                          {getInitials(item.student.fullName)}
                        </div>
                        <span className="font-semibold text-[#0B1C30] text-[14px]">{item.student.fullName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[14px] text-gray-600 flex items-center gap-2 mt-2">
                      <Mail size={14} className="text-gray-400" />
                      {item.student.email}
                    </td>
                    <td className="py-4 px-6 text-[14px] text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        {item.student.phone || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[14px] text-gray-600">
                      {new Date(item.registeredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${
                        item.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.paymentStatus === 'SUCCESS' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {item.paymentStatus}
                      </span>
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