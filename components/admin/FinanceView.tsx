"use client";

import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Search,
  Filter,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Bell,
  Clock,
  TrendingUp,
  FileText,
  CreditCard,
  DollarSign
} from "lucide-react";

interface FinanceRecord {
  id: string;
  studentIdCode: string;
  studentName: string;
  studentAvatar: string;
  course: string;
  batch: string;
  totalFees: string;
  paidAmount: string;
  pendingAmount: string;
}

const mockFinanceRecords: FinanceRecord[] = [
  {
    id: "fin-1",
    studentIdCode: "STL001",
    studentName: "Rahul Sharma",
    studentAvatar: "/Ananya.png",
    course: "Digital Marketing",
    batch: "DM-05",
    totalFees: "₹25,000",
    paidAmount: "₹15,000",
    pendingAmount: "₹10,000"
  },
  {
    id: "fin-2",
    studentIdCode: "STL002",
    studentName: "Priya Patel",
    studentAvatar: "/Sunita.png",
    course: "Web Development",
    batch: "WD-12",
    totalFees: "₹30,000",
    paidAmount: "₹30,000",
    pendingAmount: "₹0"
  },
  {
    id: "fin-3",
    studentIdCode: "STL003",
    studentName: "Amit Verma",
    studentAvatar: "/Meera.png",
    course: "Graphic Design",
    batch: "GD-03",
    totalFees: "₹20,000",
    paidAmount: "₹15,000",
    pendingAmount: "₹5,000"
  },
  {
    id: "fin-4",
    studentIdCode: "STL004",
    studentName: "Neha Singh",
    studentAvatar: "/Grace1.png",
    course: "Data Science",
    batch: "DS-01",
    totalFees: "₹35,000",
    paidAmount: "₹10,000",
    pendingAmount: "₹25,000"
  }
];

export default function FinanceView() {
  const [financeList, setFinanceList] = useState<FinanceRecord[]>(mockFinanceRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [batchFilter, setBatchFilter] = useState("All Batches");

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
          Finance Dashboard
        </h1>
        <p className="text-xs sm:text-sm font-medium text-stone-500">
          Overview of student payments and collections.
        </p>
      </div>

      {/* 6 Top Summary Metric Cards (2 rows of 3 cards) */}
      <div className="space-y-4">
        {/* Row 1: Student Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Total Students</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">1,248</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Paid Students</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">756</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Pending Students</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-rose-600 mt-1">456</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Row 2: Monetary Amounts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Total Fee Amount</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">₹1,24,80,000</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Amount Received</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">₹78,45,600</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Pending Amount</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-rose-600 mt-1">₹46,34,400</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Today's Payments Table & Due Payments Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (8 cols): Today's Payments Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-sans font-bold text-lg text-stone-900">Today's Payments</h3>
              <p className="text-xs text-stone-400 font-medium">Summary of today's incoming fee transactions.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
              2 Transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                  <th className="py-3 px-3">STUDENT ID</th>
                  <th className="py-3 px-3">STUDENT NAME</th>
                  <th className="py-3 px-3">COURSE</th>
                  <th className="py-3 px-3">BATCH</th>
                  <th className="py-3 px-3">TOTAL FEES</th>
                  <th className="py-3 px-3">PAID AMOUNT</th>
                  <th className="py-3 px-3">PENDING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                {[
                  { id: "STL001", name: "Arjun Kapoor", avatar: "/Ananya.png", course: "Web Development", batch: "WD-12", total: "₹30,000", paid: "₹30,000", pending: "₹0" },
                  { id: "STL002", name: "Tanya Mehrotra", avatar: "/Sunita.png", course: "Data Science", batch: "DS-01", total: "₹35,000", paid: "₹35,000", pending: "₹0" }
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-stone-600">{row.id}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={row.avatar} alt={row.name} className="w-7 h-7 rounded-full object-cover border border-stone-200 shrink-0" />
                        <span className="font-bold text-stone-900">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-stone-600">{row.course}</td>
                    <td className="py-3.5 px-3 font-bold text-stone-800">{row.batch}</td>
                    <td className="py-3.5 px-3 font-bold text-stone-900">{row.total}</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-600">{row.paid}</td>
                    <td className="py-3.5 px-3 font-bold text-rose-600">{row.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Due Payments Widget */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-sans font-bold text-base text-stone-900">Due Payments</h4>
            <button className="text-xs font-bold text-[#9E0C25] hover:underline cursor-pointer">View All</button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Amit Kumar", avatar: "/Meera.png", due: "Due: 15 May 2024", amount: "₹15,500" },
              { name: "Neha Singh", avatar: "/Grace1.png", due: "Due: 18 May 2024", amount: "₹22,000" },
              { name: "Rohan Patel", avatar: "/Ananya.png", due: "Due: 20 May 2024", amount: "₹12,400" }
            ].map((due, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={due.avatar} alt={due.name} className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">{due.name}</span>
                    <span className="text-[10px] text-stone-400 font-semibold block">{due.due}</span>
                  </div>
                </div>
                <span className="font-sans font-extrabold text-xs text-rose-600">{due.amount}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert("Reminders sent to all due students!")}
            className="w-full py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>+ Remind Students</span>
          </button>
        </div>

      </div>

      {/* Main Finance Table Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
        
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
              >
                <option>All Courses</option>
                <option>Digital Marketing</option>
                <option>Web Development</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="h-10 pl-4 pr-9 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 appearance-none cursor-pointer focus:bg-white focus:outline-none"
              >
                <option>All Batches</option>
                <option>DM-05</option>
                <option>WD-12</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={() => alert("Downloading Finance Report...")}
              className="px-4 py-2 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-100 cursor-pointer shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                <th className="py-3.5 px-4">STUDENT ID</th>
                <th className="py-3.5 px-4">STUDENT NAME</th>
                <th className="py-3.5 px-4">COURSE</th>
                <th className="py-3.5 px-4">BATCH</th>
                <th className="py-3.5 px-4">TOTAL FEES</th>
                <th className="py-3.5 px-4">PAID AMOUNT</th>
                <th className="py-3.5 px-4">PENDING AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
              {financeList.map((row) => (
                <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                  
                  {/* Student ID */}
                  <td className="py-4 px-4 font-bold text-stone-600">{row.studentIdCode}</td>

                  {/* Student Name */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={row.studentAvatar} alt={row.studentName} className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0" />
                      <span className="font-bold text-stone-900 text-sm">{row.studentName}</span>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-4 px-4 font-semibold text-stone-600">{row.course}</td>

                  {/* Batch */}
                  <td className="py-4 px-4 font-bold text-stone-800">{row.batch}</td>

                  {/* Total Fees */}
                  <td className="py-4 px-4 font-bold text-stone-900">{row.totalFees}</td>

                  {/* Paid Amount */}
                  <td className="py-4 px-4 font-bold text-emerald-600">{row.paidAmount}</td>

                  {/* Pending Amount */}
                  <td className="py-4 px-4 font-bold text-rose-600">{row.pendingAmount}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-400">
          <div>Showing 1-10 of 1,248 students</div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-400 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button className="w-7 h-7 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
            <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">3</button>
            <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>

      </div>

      {/* Bottom 3 Analytics Widget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Overdue Payments */}
        <div className="bg-white rounded-3xl p-6 border-2 border-rose-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-rose-600 block">
              Overdue Payments
            </span>
            <button className="text-[10px] font-bold text-rose-600 hover:underline">View All</button>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="font-sans font-extrabold text-3xl text-rose-600">78</h3>
              <span className="text-stone-400 text-xs font-bold">Students</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Total Overdue Amount</span>
              <span className="font-sans font-extrabold text-base text-rose-700">₹8,75,600</span>
            </div>
          </div>
        </div>

        {/* Card 2: Students with No Payment */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-600 block">
              Students with No Payment
            </span>
            <button className="text-[10px] font-bold text-amber-600 hover:underline">View All</button>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="font-sans font-extrabold text-3xl text-amber-600">32</h3>
              <span className="text-stone-400 text-xs font-bold">Students</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Total Pending Amount</span>
              <span className="font-sans font-extrabold text-base text-amber-700">₹12,40,000</span>
            </div>
          </div>
        </div>

        {/* Card 3: Partial Payments */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-sky-600 block">
              Partial Payments
            </span>
            <button className="text-[10px] font-bold text-sky-600 hover:underline">View All</button>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="font-sans font-extrabold text-3xl text-sky-600">158</h3>
              <span className="text-stone-400 text-xs font-bold">Students</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Total Pending Amount</span>
              <span className="font-sans font-extrabold text-base text-sky-700">₹25,18,800</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
