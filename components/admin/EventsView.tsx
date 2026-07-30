"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  ArrowLeft,
  Clock,
  Users,
  Award,
  Video,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Calendar as CalendarIcon
} from "lucide-react";

interface EventRecord {
  id: string;
  eventName: string;
  category: "Workshop" | "Competition" | "Seminar";
  dateTime: string;
  leadInstructor: string;
  capacity: number;
  registered: number;
  status: "LIVE NOW" | "UPCOMING" | "COMPLETED";
}

const mockEvents: EventRecord[] = [
  {
    id: "evt-1",
    eventName: "Kathak Abhinaya Intensive Summit 2024",
    category: "Workshop",
    dateTime: "24 Oct, 10:00 AM",
    leadInstructor: "Dr. Rahul Sharma",
    capacity: 250,
    registered: 242,
    status: "LIVE NOW"
  },
  {
    id: "evt-2",
    eventName: "Tatkar & Layakari Footwork Challenge",
    category: "Competition",
    dateTime: "28 Oct, 09:00 AM",
    leadInstructor: "Prof. Anish K.",
    capacity: 100,
    registered: 98,
    status: "UPCOMING"
  },
  {
    id: "evt-3",
    eventName: "Indian Classical Mudra & Rasa Seminar",
    category: "Seminar",
    dateTime: "05 Nov, 02:00 PM",
    leadInstructor: "S. Mukherjee",
    capacity: 500,
    registered: 412,
    status: "UPCOMING"
  },
  {
    id: "evt-4",
    eventName: "Advanced Teen Classical Footwork",
    category: "Workshop",
    dateTime: "12 Nov, 11:00 AM",
    leadInstructor: "P. Lakhani",
    capacity: 60,
    registered: 58,
    status: "UPCOMING"
  }
];

export default function EventsView() {
  // Mode: 'DIRECTORY' | 'ORCHESTRATOR'
  const [viewMode, setViewMode] = useState<"DIRECTORY" | "ORCHESTRATOR">("DIRECTORY");
  
  // Filter States
  const [eventsList, setEventsList] = useState<EventRecord[]>(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Workshop" | "Competition" | "Seminar">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Event Orchestrator Form States (Exact Figma Match)
  const [eventTitle, setEventTitle] = useState("Kathak Rhythm & Abhinaya Masterclass");
  const [eventCategory, setEventCategory] = useState<"Workshop" | "Competition" | "Seminar">("Workshop");
  const [eventDescription, setEventDescription] = useState("Provide a detailed overview of the event's goals and curriculum for classical dance mastery...");
  const [startDate, setStartDate] = useState("2024-11-15");
  const [endDate, setEndDate] = useState("2024-11-17");
  const [startTime, setStartTime] = useState("10:00");
  const [durationMins, setDurationMins] = useState(60);
  const [leadInstructor, setLeadInstructor] = useState("Guru Harshita");
  const [capacity, setCapacity] = useState(50);
  const [level, setLevel] = useState("Intermediate");
  const [registrationFee, setRegistrationFee] = useState("₹ 1,500.00");
  const [locationLink, setLocationLink] = useState("Auditorium Hall A or https://zoom.us/j/kathak-masterclass");

  const handleSaveEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: EventRecord = {
      id: `evt-${eventsList.length + 1}`,
      eventName: eventTitle || "New Classical Workshop",
      category: eventCategory,
      dateTime: `${startDate}, ${startTime}`,
      leadInstructor: leadInstructor,
      capacity: capacity,
      registered: 0,
      status: "UPCOMING"
    };

    setEventsList([newEvent, ...eventsList]);
    alert(`Event "${newEvent.eventName}" published successfully!`);
    setViewMode("DIRECTORY");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* ================= SCREEN 1: EVENTS & WORKSHOPS DIRECTORY (EXACT FIGMA MATCH) ================= */}
      {viewMode === "DIRECTORY" && (
        <div className="space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Events &amp; Workshops
              </h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500 max-w-3xl">
                Oversee all scheduled, live, and upcoming educational programs.
              </p>
            </div>

            <button
              onClick={() => setViewMode("ORCHESTRATOR")}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>

          {/* 3 Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Card 1: Total Events */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Total Events</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <h3 className="font-sans font-extrabold text-3xl text-stone-900">124</h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10.5px] font-extrabold">+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <CalendarDays className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Active Workshops */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Active Workshops</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <h3 className="font-sans font-extrabold text-3xl text-sky-600">8</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold">LIVE NOW</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Video className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: New Registrations */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">New Registrations</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <h3 className="font-sans font-extrabold text-3xl text-amber-600">452</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10.5px] font-extrabold">+84 today</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Managed Events Directory Section */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-sans font-bold text-lg text-stone-900">Managed Events</h3>
            </div>

            {/* Controls Bar: Category Pills + Search + Date Range + Export */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {(["All", "Workshop", "Competition", "Seminar"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#9E0C25] text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {cat === "All" ? "All Events" : `${cat}s`}
                  </button>
                ))}
              </div>

              {/* Date Range Picker & Search & Export */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full lg:w-60">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search events or instructor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="h-9 px-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-600 flex items-center gap-2 shrink-0">
                  <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                  <span>Oct 20, 2023 - Nov 20, 2023</span>
                </div>

                <button
                  onClick={() => alert("Exporting events directory...")}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Events Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">EVENT NAME</th>
                    <th className="py-3.5 px-4">CATEGORY</th>
                    <th className="py-3.5 px-4">DATE &amp; TIME</th>
                    <th className="py-3.5 px-4">LEAD INSTRUCTOR</th>
                    <th className="py-3.5 px-4">CAPACITY</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {eventsList
                    .filter((e) => selectedCategory === "All" || e.category === selectedCategory)
                    .filter((e) => e.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || e.leadInstructor.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((evt) => (
                      <tr key={evt.id} className="hover:bg-stone-50/80 transition-colors">
                        
                        {/* Event Name */}
                        <td className="py-4 px-4 font-bold text-stone-900 text-sm">{evt.eventName}</td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            evt.category === "Workshop"
                              ? "bg-sky-100 text-sky-800"
                              : evt.category === "Competition"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {evt.category}
                          </span>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-4 font-semibold text-stone-600">{evt.dateTime}</td>

                        {/* Lead Instructor */}
                        <td className="py-4 px-4 font-bold text-stone-800">{evt.leadInstructor}</td>

                        {/* Capacity & Registered */}
                        <td className="py-4 px-4 font-semibold text-stone-700">
                          {evt.registered} / <span className="text-stone-400">{evt.capacity}</span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                            evt.status === "LIVE NOW"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse"
                              : "bg-sky-50 text-sky-700 border border-sky-200"
                          }`}>
                            • {evt.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => alert(`Viewing Event ${evt.eventName}`)}
                              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setViewMode("ORCHESTRATOR")}
                              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEventsList(eventsList.filter((item) => item.id !== evt.id))}
                              className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-400">
              <div>Showing 1 to 4 of 124 events</div>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-400 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">3</button>
                <span>...</span>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= SCREEN 2: EVENT ORCHESTRATOR FORM WORKSPACE (EXACT FIGMA MATCH) ================= */}
      {viewMode === "ORCHESTRATOR" && (
        <form onSubmit={handleSaveEventSubmit} className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMode("DIRECTORY")}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Event Orchestrator</span>
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Event Orchestrator
            </h1>
            <p className="text-xs text-stone-400 font-medium">
              Configure the parameters for your next institutional engagement.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
            
            {/* Section 1: General Information */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-5">
              <div className="flex items-center gap-2 text-stone-900">
                <span className="w-3 h-3 rounded-full bg-[#9E0C25]" />
                <h4 className="font-sans font-bold text-sm uppercase tracking-wider">General Information</h4>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">EVENT TITLE</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Advanced Kathak Rhythm & Abhinaya Masterclass"
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">CATEGORY</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">DESCRIPTION</label>
                  <textarea
                    rows={4}
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Provide a detailed overview of the event's goals and curriculum..."
                    className="w-full p-3.5 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>
            </div>

            {/* Grid 2 Columns: Section 2 (Schedule Details) & Section 3 (Instructor & Capacity) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Section 2: Schedule Details */}
              <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-4">
                <div className="flex items-center gap-2 text-stone-900">
                  <CalendarIcon className="w-4 h-4 text-[#9E0C25]" />
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Schedule Details</h4>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-stone-700 font-bold uppercase text-[10.5px]">START DATE</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-stone-700 font-bold uppercase text-[10.5px]">END DATE</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-stone-700 font-bold uppercase text-[10.5px]">START TIME</label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-stone-700 font-bold uppercase text-[10.5px]">DURATION (MINS)</label>
                      <input
                        type="number"
                        value={durationMins}
                        onChange={(e) => setDurationMins(Number(e.target.value))}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Instructor & Capacity */}
              <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-4">
                <div className="flex items-center gap-2 text-stone-900">
                  <Users className="w-4 h-4 text-[#9E0C25]" />
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Instructor &amp; Capacity</h4>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="block text-stone-700 font-bold uppercase text-[10.5px]">LEAD INSTRUCTOR</label>
                    <select
                      value={leadInstructor}
                      onChange={(e) => setLeadInstructor(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                    >
                      <option>Guru Harshita</option>
                      <option>Dr. Rahul Sharma</option>
                      <option>Prof. Anish K.</option>
                      <option>S. Mukherjee</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-stone-700 font-bold uppercase text-[10.5px]">CAPACITY</label>
                      <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-stone-700 font-bold uppercase text-[10.5px]">LEVEL</label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>All Levels</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Section 4: Pricing & Venue */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <MapPin className="w-4 h-4 text-[#9E0C25]" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider">Pricing &amp; Venue</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">REGISTRATION FEE (₹)</label>
                  <input
                    type="text"
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">LOCATION / VIRTUAL LINK</label>
                  <input
                    type="text"
                    value={locationLink}
                    onChange={(e) => setLocationLink(e.target.value)}
                    placeholder="Room 402, North Wing or https://zoom.us/j/..."
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Right Action Buttons */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewMode("DIRECTORY")}
                className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase"
              >
                Save Event
              </button>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
