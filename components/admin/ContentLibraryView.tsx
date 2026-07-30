"use client";

import React, { useState } from "react";
import {
  Users,
  Calendar,
  Download,
  Filter,
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  FileText,
  Video,
  Music,
  BookOpen,
  ArrowRight,
  Eye,
  Mail,
  MessageSquare,
  MessageCircle
} from "lucide-react";

interface RosterStudent {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  studentIdCode: string;
  batchName: string;
  contactNumber: string;
  emailAddress: string;
}

const mockRosterStudents: RosterStudent[] = [
  {
    id: "r-1",
    name: "Ishan Malhotra",
    avatar: "/Ananya.png",
    joinedDate: "Joined 15 May 2024",
    studentIdCode: "STD-2024-0015",
    batchName: "Kathak Beginners",
    contactNumber: "+91 98323 99441",
    emailAddress: "ishaan.mal@kinetics.org"
  },
  {
    id: "r-2",
    name: "Ananya Patel",
    avatar: "/Sunita.png",
    joinedDate: "Joined 12 May 2024",
    studentIdCode: "STD-2024-0016",
    batchName: "Kathak Intermediate",
    contactNumber: "+91 98765 43210",
    emailAddress: "ananya.p@kinetics.org"
  },
  {
    id: "r-3",
    name: "Rohan Verma",
    avatar: "/Meera.png",
    joinedDate: "Joined 10 May 2024",
    studentIdCode: "STD-2024-0017",
    batchName: "Kathak Advanced",
    contactNumber: "+91 91234 56789",
    emailAddress: "rohan.v@kinetics.org"
  },
  {
    id: "r-4",
    name: "Sia Gupta",
    avatar: "/Grace1.png",
    joinedDate: "Joined 08 May 2024",
    studentIdCode: "STD-2024-0018",
    batchName: "Kathak Beginners",
    contactNumber: "+91 98111 22334",
    emailAddress: "sia.g@kinetics.org"
  }
];

export default function ContentLibraryView() {
  const [viewFormat, setViewFormat] = useState<"List" | "Grid">("List");
  const [rosterList, setRosterList] = useState<RosterStudent[]>(mockRosterStudents);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [sortBy, setSortBy] = useState("Recently Joined");

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* Breadcrumb & Header Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-400">
            <span>Batches</span>
            <span>&gt;</span>
            <span className="text-[#9E0C25] font-bold">Performing Arts</span>
          </div>
          <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Bharatanatyam Intermediate 2024–25
          </h1>
          
          <div className="flex items-center gap-3 pt-1">
            <span className="px-3 py-1 rounded-full bg-rose-50 text-[#9E0C25] text-xs font-extrabold border border-rose-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>42 Students Enrolled</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Term: Q3 (Jul - Sep)</span>
            </span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="flex items-center p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setViewFormat("Grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewFormat === "Grid"
                  ? "bg-[#9E0C25] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>

            <button
              onClick={() => setViewFormat("List")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewFormat === "List"
                  ? "bg-[#9E0C25] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-50 cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => alert("Exporting PDF...")}
            className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Roster & Content Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
        
        {/* Controls Sub-Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
            <span>Show:</span>
            <div className="relative">
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(e.target.value)}
                className="h-8 pl-3 pr-7 rounded-lg bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 appearance-none cursor-pointer focus:outline-none"
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span>Displaying 1 - 10 of 42</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span>Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 pl-3 pr-8 rounded-lg bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 appearance-none cursor-pointer focus:outline-none"
              >
                <option>Recently Joined</option>
                <option>Name A-Z</option>
                <option>Student ID</option>
              </select>
              <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* View Mode: List View Table */}
        {viewFormat === "List" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                  <th className="py-3.5 px-4">PROFILE</th>
                  <th className="py-3.5 px-4">STUDENT ID</th>
                  <th className="py-3.5 px-4">BATCH</th>
                  <th className="py-3.5 px-4">CONTACT NUMBER</th>
                  <th className="py-3.5 px-4">EMAIL ADDRESS</th>
                  <th className="py-3.5 px-4 text-center">WHATSAPP</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                {rosterList.map((st) => (
                  <tr key={st.id} className="hover:bg-stone-50/80 transition-colors">
                    
                    {/* Profile */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={st.avatar} alt={st.name} className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0" />
                        <div>
                          <span className="font-bold text-stone-900 text-sm block">{st.name}</span>
                          <span className="text-[10.5px] text-stone-400 font-semibold block">{st.joinedDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="py-4 px-4 font-bold text-stone-700">{st.studentIdCode}</td>

                    {/* Batch */}
                    <td className="py-4 px-4 font-bold text-stone-800">{st.batchName}</td>

                    {/* Contact Number */}
                    <td className="py-4 px-4 font-semibold text-stone-600">{st.contactNumber}</td>

                    {/* Email Address */}
                    <td className="py-4 px-4 font-semibold text-stone-600">{st.emailAddress}</td>

                    {/* WhatsApp */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => alert(`Opening WhatsApp Chat with ${st.name}...`)}
                        title="Chat on WhatsApp"
                        className="p-1.5 hover:bg-emerald-50 rounded-xl text-emerald-600 transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        <MessageCircle className="w-4 h-4 fill-emerald-100 text-emerald-600" />
                      </button>
                    </td>

                    {/* Actions (Eye, Mail, Chat) */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => alert(`View Details for ${st.name}`)}
                          title="View Profile"
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => alert(`Send Email to ${st.emailAddress}`)}
                          title="Send Email"
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => alert(`Direct Message ${st.name}`)}
                          title="Direct Message"
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* View Mode: Grid View Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rosterList.map((st) => (
              <div key={st.id} className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/80 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-full object-cover border border-stone-200 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{st.name}</h4>
                    <span className="text-[10.5px] text-stone-400 font-semibold block">{st.joinedDate}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-semibold text-stone-600 pt-2 border-t border-stone-200/60">
                  <p><strong className="text-stone-400">ID:</strong> {st.studentIdCode}</p>
                  <p><strong className="text-stone-400">Batch:</strong> {st.batchName}</p>
                  <p><strong className="text-stone-400">Contact:</strong> {st.contactNumber}</p>
                  <p className="truncate"><strong className="text-stone-400">Email:</strong> {st.emailAddress}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                  <button
                    onClick={() => alert(`WhatsApp Chat with ${st.name}`)}
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <div className="flex items-center gap-1 text-stone-400">
                    <button onClick={() => alert(`View ${st.name}`)} className="hover:text-stone-900 p-1"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => alert(`Email ${st.name}`)} className="hover:text-stone-900 p-1"><Mail className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs font-semibold text-stone-400">
          <button className="flex items-center gap-1 hover:text-stone-900 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
            <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">3</button>
            <span>...</span>
            <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">5</button>
          </div>

          <button className="flex items-center gap-1 hover:text-stone-900 cursor-pointer">
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
