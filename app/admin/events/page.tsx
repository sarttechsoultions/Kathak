'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, ENDPOINTS } from '@/lib/api';
import { openThemeConfirm, openThemeSuccess, openThemeError } from '@/components/ThemeDialogProvider';
import {
  Calendar, PlayCircle, Users, Plus, ChevronDown, Download,
  Code, FlaskConical, BrainCircuit, Braces, Edit3, Trash2,
  ChevronLeft, ChevronRight, CalendarDays
} from 'lucide-react';

interface EventStats {
  totalEvents: number;
  activeWorkshops: number;
  newRegistrations: number;
}

interface EventItem {
  id: string;
  title: string;
  category: string;
  startDate: string;
  startTime: string;
  leadInstructor?: { fullName: string };
  capacity: number;
  registrationFee: number;
  status: string;
  _count?: { registrations: number };
}

export default function ManagedEvents() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<EventStats>({ totalEvents: 0, activeWorkshops: 0, newRegistrations: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ['All', 'Workshops', 'Competitions', 'Seminars'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Stats using aapka apiRequest
        const statsData = await apiRequest<{ success: boolean; data: EventStats }>(ENDPOINTS.ADMIN_EVENTS_STATS);
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        }

        // --- YAHAN CHANGE HUA HAI ---
        // UI tabs (Plural) ko DB Enums (Singular) mein map karein
        let dbCategory = activeTab;
        if (activeTab === 'Workshops') dbCategory = 'Workshop';
        if (activeTab === 'Competitions') dbCategory = 'Competition';
        if (activeTab === 'Seminars') dbCategory = 'Seminar';

        // 2. Fetch Events (sahi DB category bhej kar)
        const categoryQuery = activeTab !== 'All' ? `?category=${dbCategory}` : '';
        const eventsData = await apiRequest<{ success: boolean; data: EventItem[] }>(`${ENDPOINTS.ADMIN_EVENTS}${categoryQuery}`);

        if (eventsData.success && eventsData.data) {
          setEvents(eventsData.data);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTab]);

  const getInitials = (name?: string) => {
    if (!name) return "NA";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'LIVE': return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'SCHEDULED': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'DRAFT': return { bg: 'bg-orange-100', text: 'text-orange-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'workshop': return <Code size={16} className="text-[#9B3434]" />;
      case 'competition': return <FlaskConical size={16} className="text-[#9B3434]" />;
      case 'seminar': return <BrainCircuit size={16} className="text-[#9B3434]" />;
      default: return <Braces size={16} className="text-[#9B3434]" />;
    }
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    let timePart = timeStr;
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours);
      timePart = `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
    }
    return `${datePart}, ${timePart}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Top Cards (No change in UI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#9B3434]/10 flex items-center justify-center">
              <Calendar size={24} className="text-[#9B3434]" />
            </div>
          </div>
          <div>
            <h3 className="text-gray-500 text-[13px] font-semibold mb-1">Total Events</h3>
            <p className="text-[32px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isLoading ? '...' : stats.totalEvents}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#9B3434]/10 flex items-center justify-center">
              <PlayCircle size={24} className="text-[#9B3434]" />
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Live Now</span>
          </div>
          <div>
            <h3 className="text-gray-500 text-[13px] font-semibold mb-1">Active Workshops</h3>
            <p className="text-[32px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isLoading ? '...' : stats.activeWorkshops}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#9B3434]/10 flex items-center justify-center">
              <Users size={24} className="text-[#9B3434]" />
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">+ Today</span>
          </div>
          <div>
            <h3 className="text-gray-500 text-[13px] font-semibold mb-1">New Registrations</h3>
            <p className="text-[32px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isLoading ? '...' : stats.newRegistrations}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm">

        <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-[24px] font-bold text-[#0B1C30] leading-[31.2px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Managed Events
            </h2>
            <p className="text-gray-500 text-[14px] mt-1">
              Oversee all scheduled, live, and upcoming educational programs.
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/events/createevent')}
            className="bg-[#9B3434] hover:bg-[#832c2c] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium flex items-center gap-2 transition-colors duration-200 cursor-pointer"
          >
            <Plus size={18} />
            Create New Event
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${activeTab === tab ? "bg-[#9B3434] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-y border-gray-100">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lead Instructor</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Reg.</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 text-[14px]">Loading events...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 text-[14px]">No events found. Create one!</td>
                </tr>
              ) : (
                events.map((event) => {
                  const statusStyling = getStatusStyle(event.status);
                  const instructorName = event.leadInstructor?.fullName || 'Unassigned';

                  return (
                    <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#9B3434]/10 flex items-center justify-center">
                            {getCategoryIcon(event.category)}
                          </div>
                          <span className="font-semibold text-[#0B1C30] text-[14px]">{event.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-gray-600">{event.category}</td>
                      <td className="py-4 px-6 text-[14px] text-gray-600">
                        {formatDateTime(event.startDate, event.startTime)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center text-[10px] font-bold">
                            {getInitials(instructorName)}
                          </div>
                          <span className="text-[14px] text-gray-600">{instructorName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-gray-600">{event.capacity}</td>
                      <td className="py-4 px-6 text-[14px] font-bold text-[#0B1C30]">{event._count?.registrations || 0}</td>
                      <td className="py-4 px-6 text-[14px] font-bold text-[#0B1C30]">
                        {event.registrationFee === 0 ? "FREE" : `₹${event.registrationFee}`}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusStyling.bg} ${statusStyling.text}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4 text-gray-400">
                          <button 
      title="Edit Event"
      onClick={() => router.push(`/admin/events/editevent/${event.id}`)}
      className="hover:text-blue-600 transition-colors cursor-pointer"
    >
      <Edit3 size={18} />
    </button>

    {/* 2. View Persons / Registrations Button */}
    <button 
      title="View Registered Persons"
      onClick={() => router.push(`/admin/events/registrations/${event.id}`)}
      className="hover:text-green-600 transition-colors cursor-pointer"
    >
      <Users size={18} />
    </button>
                          <button
                            title="Delete Event"
                            className="hover:text-red-600 transition-colors cursor-pointer"
                            onClick={async () => {
                              const isConfirmed = await openThemeConfirm(
                                `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
                                "Delete Event"
                              );

                              // Agar user Confirm dabata hai, tabhi aage ka logic chalega
                              if (isConfirmed) {
                                try {
                                  await apiRequest(`${ENDPOINTS.ADMIN_EVENTS}/${event.id}`, { method: 'DELETE' });

                                  // UI se event hatao
                                  setEvents(events.filter(e => e.id !== event.id));

                                  // Success Toast show karo
                                  openThemeSuccess("Event has been successfully deleted.");
                                } catch (e) {
                                  // Error Toast show karo
                                  openThemeError("Failed to delete event. Please try again.");
                                }
                              }
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}