"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  Download,
  Eye,
  Pencil,
  Ban,
  Trash2,
  ArrowLeft,
  Camera,
  GraduationCap,
  Calendar,
  User,
  PhoneCall,
  BarChart3,
  BookOpen,
  Users
} from "lucide-react";

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  course: string;
  batch: string;
  time: string;
  joiningDate: string;
  status: "Active" | "Inactive" | "Blocked";
  dob?: string;
  gender?: string;
  address?: string;
  level?: string;
  guru?: string;
  father?: string;
  mother?: string;
  emergencyContact?: string;
  attendanceRate?: string;
  assignmentsScore?: string;
  totalFee?: string;
  pendingFee?: string;
}

const mockStudents: StudentRecord[] = [
  {
    id: "STU-1001",
    name: "Alex Rivera",
    email: "alex.riv@kinetic.edu",
    phone: "+91 98765 43210",
    avatar: "/Ananya.png",
    course: "Modern Jazz Fusion",
    batch: "Spring 2024",
    time: "05:00 PM",
    joiningDate: "Oct 12, 2023",
    status: "Active",
    dob: "12th May 2002",
    gender: "Male",
    address: "Flat 402, Royal Residency, Sector 15, Vashi, Navi Mumbai - 400703",
    level: "Intermediate Level",
    guru: "Guru Meenakshi",
    father: "Mr. Suresh Sharma",
    mother: "Mrs. Sunita Sharma",
    emergencyContact: "+91 91234 56789",
    attendanceRate: "92",
    assignmentsScore: "14 / 16",
    totalFee: "₹12,000",
    pendingFee: "₹2,000"
  },
  {
    id: "STU-1002",
    name: "Maya Sterling",
    email: "m.sterling@gmail.com",
    phone: "+91 98765 43211",
    avatar: "/Sunita.png",
    course: "Urban Core Styles",
    batch: "Elite Fundamentals",
    time: "06:30 PM",
    joiningDate: "Nov 05, 2023",
    status: "Active",
    dob: "18th Aug 2003",
    gender: "Female",
    address: "B-204, Green Acres, Bandra West, Mumbai - 400050",
    level: "Beginner Level",
    guru: "Guru Harshita",
    father: "Mr. Vikram Sterling",
    mother: "Mrs. Anita Sterling",
    emergencyContact: "+91 98200 11223",
    attendanceRate: "95",
    assignmentsScore: "16 / 16",
    totalFee: "₹15,000",
    pendingFee: "₹0"
  },
  {
    id: "STU-1003",
    name: "Julian Chen",
    email: "jchen.dance@kinetic.edu",
    phone: "+91 98765 43212",
    avatar: "/Meera.png",
    course: "Contemporary Flow",
    batch: "Masters Series",
    time: "05:30 PM",
    joiningDate: "Dec 01, 2023",
    status: "Inactive",
    dob: "05th Jan 2001",
    gender: "Male",
    address: "12, Rose Villa, Juhu, Mumbai - 400049",
    level: "Advanced Level",
    guru: "Guru Meenakshi",
    father: "Mr. Robert Chen",
    mother: "Mrs. Mary Chen",
    emergencyContact: "+91 97111 22334",
    attendanceRate: "78",
    assignmentsScore: "10 / 16",
    totalFee: "₹18,000",
    pendingFee: "₹4,500"
  },
  {
    id: "STU-1004",
    name: "Sarah Jenkins",
    email: "sara.j@gmail.com",
    phone: "+91 98765 43213",
    avatar: "/Grace1.png",
    course: "Classical Ballet III",
    batch: "Elite Fundamentals",
    time: "04:00 PM",
    joiningDate: "Jan 15, 2024",
    status: "Active",
    dob: "22nd Nov 2004",
    gender: "Female",
    address: "501, Heritage Park, Thane West - 400601",
    level: "Intermediate Level",
    guru: "Guru Harshita",
    father: "Mr. David Jenkins",
    mother: "Mrs. Sarah Jenkins Sr.",
    emergencyContact: "+91 99300 44556",
    attendanceRate: "88",
    assignmentsScore: "13 / 16",
    totalFee: "₹12,000",
    pendingFee: "₹1,000"
  }
];

export default function StudentView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [statusFilter, setStatusFilter] = useState("Status: All");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  return (
    <div>
      {!selectedStudent ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Student Management
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Students</p>
              <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">1,248</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Active Now</p>
              <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">312</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">New Joined Students</p>
              <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">12</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-center items-center text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Blocked Students</p>
              <h3 className="font-sans font-extrabold text-2xl text-stone-900 mt-1">8</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="relative">
                  <select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>All Batches</option>
                    <option>Spring 2024</option>
                    <option>Elite Fundamentals</option>
                    <option>Masters Series</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
                  >
                    <option>Status: All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Blocked</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button className="p-2.5 rounded-xl border border-stone-200/80 hover:bg-stone-50 text-stone-600 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl border border-stone-200/80 hover:bg-stone-50 text-stone-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3 px-4">STUDENT ID</th>
                    <th className="py-3 px-4">STUDENT NAME</th>
                    <th className="py-3 px-4">COURSE</th>
                    <th className="py-3 px-4">BATCH</th>
                    <th className="py-3 px-4">TIME</th>
                    <th className="py-3 px-4">JOINING DATE</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {mockStudents.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-stone-800">{row.id}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                          <div>
                            <button
                              onClick={() => setSelectedStudent(row)}
                              className="block font-bold text-stone-900 hover:text-[#9E0C25] text-left cursor-pointer transition-colors"
                            >
                              {row.name}
                            </button>
                            <span className="block text-[11px] text-stone-400 font-normal">{row.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-stone-800 font-semibold">{row.course}</td>
                      <td className="py-4 px-4 text-stone-600">{row.batch}</td>
                      <td className="py-4 px-4 text-stone-600">{row.time}</td>
                      <td className="py-4 px-4 text-stone-600">{row.joiningDate}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          row.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                            : "bg-stone-100 text-stone-500 border border-stone-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Active" ? "bg-emerald-500" : "bg-stone-400"}`} />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-stone-400">
                          <button
                            onClick={() => setSelectedStudent(row)}
                            title="View Student Details"
                            className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert(`Edit Student: ${row.name}`)}
                            title="Edit Student"
                            className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert(`Toggle Block Status: ${row.name}`)}
                            title="Block Student"
                            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert(`Delete Record: ${row.name}`)}
                            title="Delete Student"
                            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <div>Showing 1 to 4 of 1,248 students</div>
              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50">Previous</button>
                <button className="px-3 py-1.5 rounded-lg bg-[#9E0C25] text-white font-bold">1</button>
                <button className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50">2</button>
                <button className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50">3</button>
                <span className="px-1 text-stone-400">...</span>
                <button className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50">124</button>
                <button className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50">Next</button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedStudent(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#9E0C25] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student Management</span>
          </button>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#701623] via-[#9E0C25] to-[#701623] relative p-6 flex items-end">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="p-6 pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                  />
                  <button className="w-8 h-8 rounded-full bg-[#9E0C25] text-white flex items-center justify-center absolute -bottom-2 -right-2 shadow-md hover:scale-110 transition-transform cursor-pointer">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 sm:pb-2">
                  <h2 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900">
                    {selectedStudent.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-500">
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#9E0C25]" />
                      {selectedStudent.level || "Intermediate Level"}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      Joined August 2024
                    </span>
                  </div>
                </div>
              </div>

              <button className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all cursor-pointer self-stretch sm:self-auto text-center">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#9E0C25]" />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">FULL NAME</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">DATE OF BIRTH</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.dob || "12th May 2002"}</span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">GENDER</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.gender || "Male"}</span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">BATCH</span>
                    <span className="font-semibold text-sm text-stone-900">Kathak Basics - B1</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#9E0C25]" />
                  <span>Contact Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">PHONE NUMBER</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.phone}</span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">EMAIL ADDRESS</span>
                    <span className="font-semibold text-sm text-stone-900">{selectedStudent.email}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-stone-400">RESIDENTIAL ADDRESS</span>
                    <span className="font-semibold text-xs sm:text-sm text-stone-800 leading-relaxed">
                      {selectedStudent.address || "Flat 402, Royal Residency, Sector 15, Vashi, Navi Mumbai - 400703"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#9E0C25]" />
                  <span>Performance & Financial Summary</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">ATTENDANCE</span>
                    <span className="font-extrabold text-2xl text-stone-900 mt-1 block">{selectedStudent.attendanceRate || "92"}%</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">ASSIGNMENTS</span>
                    <span className="font-extrabold text-2xl text-stone-900 mt-1 block">{selectedStudent.assignmentsScore || "14 / 16"}</span>
                    <span className="text-[10px] font-semibold text-emerald-600">87.5% Completion Rate</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-center relative">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-100 text-rose-700 absolute top-2 right-2">PENDING</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">FINANCIAL SUMMARY</span>
                    <div className="mt-2 text-xs">
                      <span className="block font-semibold text-stone-500">Total Fee: <strong className="text-stone-900">{selectedStudent.totalFee || "₹12,000"}</strong></span>
                      <span className="block font-bold text-rose-600">Pending: {selectedStudent.pendingFee || "₹2,000"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#9E0C25]" />
                  <span>Academic Profile</span>
                </h3>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">Course Name</span>
                    <span className="font-bold text-xs text-stone-900">{selectedStudent.course}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">Current Level</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-[#9E0C25]">Intermediate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">Batch Timing</span>
                    <span className="font-bold text-xs text-stone-900">Tue & Thu | 06:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-xs text-stone-500 font-medium">Assigned Guru</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-900">{selectedStudent.guru || "Guru Meenakshi"}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/Sunita.png" alt="Guru" className="w-6 h-6 rounded-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-base text-stone-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#9E0C25]" />
                  <span>Guardians</span>
                </h3>
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">FATHER</span>
                    <span className="font-bold text-xs text-stone-900 mt-0.5 block">{selectedStudent.father || "Mr. Suresh Sharma"}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">MOTHER</span>
                    <span className="font-bold text-xs text-stone-900 mt-0.5 block">{selectedStudent.mother || "Mrs. Sunita Sharma"}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/70">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-rose-600">EMERGENCY CONTACT</span>
                    <span className="font-extrabold text-sm text-rose-700 mt-0.5 block">{selectedStudent.emergencyContact || "+91 91234 56789"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
