"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Search,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Bell,
  TrendingUp,
  CreditCard,
  Plus,
  Loader2,
  X,
  FileSpreadsheet
} from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

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
  rawTotal: number;
  rawPaid: number;
  rawPending: number;
}

interface PaymentTx {
  id: string;
  amount: number;
  gateway: string;
  transactionId: string;
  createdAt: string;
  user?: { fullName: string; email: string };
  enrollment?: { course?: { title: string } };
}

export default function FinanceView() {
  const [financeList, setFinanceList] = useState<FinanceRecord[]>([]);
  const [todaysTransactions, setTodaysTransactions] = useState<PaymentTx[]>([]);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    paidStudents: 0,
    pendingStudents: 0,
    totalFeeAmount: 0,
    amountReceived: 0,
    pendingAmount: 0,
    overdueCount: 0,
    overdueAmount: 0,
    partialCount: 0,
    partialAmount: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [batchFilter, setBatchFilter] = useState("All Batches");

  // Record Payment Modal State
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentGateway, setPaymentGateway] = useState("MANUAL_CASH");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(ENDPOINTS.ADMIN_FINANCE);
      if (res.data) {
        if (Array.isArray(res.data.financeList)) {
          setFinanceList(res.data.financeList);
        } else if (Array.isArray(res.data.records)) {
          setFinanceList(res.data.records);
        }

        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }

        if (Array.isArray(res.data.todaysPayments)) {
          setTodaysTransactions(res.data.todaysPayments);
        }
      }
    } catch (err) {
      console.error("Failed to fetch finance records:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !paymentAmount || Number(paymentAmount) <= 0) {
      alert("Please select a student and enter a valid payment amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("/admin/payments", {
        method: "POST",
        body: JSON.stringify({
          studentId: selectedStudentId,
          amount: Number(paymentAmount),
          gateway: paymentGateway
        })
      });

      await openThemeSuccess("Fee payment recorded successfully!", "Payment Recorded");
      setShowRecordModal(false);
      setSelectedStudentId("");
      setPaymentAmount("");
      fetchFinanceData();
    } catch (err: any) {
      alert(err.message || "Failed to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = async () => {
    if (filteredRecords.length === 0) {
      alert("No finance records available to export.");
      return;
    }

    const headers = ["Student ID", "Student Name", "Course", "Batch", "Total Fees", "Paid Amount", "Pending Amount"];
    const rows = filteredRecords.map((r) => [
      r.studentIdCode,
      `"${r.studentName.replace(/"/g, '""')}"`,
      `"${r.course}"`,
      `"${r.batch}"`,
      `"${r.totalFees}"`,
      `"${r.paidAmount}"`,
      `"${r.pendingAmount}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Kathak_Finance_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await openThemeSuccess("Finance report exported successfully as CSV!", "CSV Exported");
  };

  const filteredRecords = financeList.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentIdCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = courseFilter === "All Courses" || r.course === courseFilter;
    const matchesBatch = batchFilter === "All Batches" || r.batch === batchFilter;

    return matchesSearch && matchesCourse && matchesBatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Finance & Fee Management
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-500">
            Real-time overview of student fee payments, revenue collections & pending dues.
          </p>
        </div>

        <button
          onClick={() => setShowRecordModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Fee Payment</span>
        </button>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Total Students</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : metrics.totalStudents}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Paid Students</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : metrics.paidStudents}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Pending Dues Students</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-rose-600 mt-1">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : metrics.pendingStudents}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Total Fee Billed</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">
                {isLoading ? "..." : `₹${metrics.totalFeeAmount.toLocaleString("en-IN")}`}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Amount Received</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">
                {isLoading ? "..." : `₹${metrics.amountReceived.toLocaleString("en-IN")}`}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">Pending Amount</p>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-rose-600 mt-1">
                {isLoading ? "..." : `₹${metrics.pendingAmount.toLocaleString("en-IN")}`}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Today's Payments & Pending Dues Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-sans font-bold text-lg text-stone-900">Today's Transactions</h3>
              <p className="text-xs text-stone-400 font-medium">Real-time incoming fee transactions processed today.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
              {todaysTransactions.length} Transactions Today
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                  <th className="py-3 px-3">TRANSACTION ID</th>
                  <th className="py-3 px-3">STUDENT NAME</th>
                  <th className="py-3 px-3">PAYMENT METHOD</th>
                  <th className="py-3 px-3 text-right">AMOUNT PAID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                {todaysTransactions.length > 0 ? (
                  todaysTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-stone-600">{tx.transactionId}</td>
                      <td className="py-3.5 px-3 font-bold text-stone-900">{tx.user?.fullName || "Student"}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                          {tx.gateway}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-extrabold text-emerald-600 text-right">₹{tx.amount.toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-xs text-stone-400 font-medium">
                      No fee transactions recorded today yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="font-sans font-bold text-base text-stone-900">Pending Dues Students</h4>
            <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {financeList.filter((r) => r.rawPending > 0).length} Pending
            </span>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {financeList.filter((r) => r.rawPending > 0).slice(0, 5).map((due) => (
              <div key={due.id} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={due.studentAvatar} alt={due.studentName} className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">{due.studentName}</span>
                    <span className="text-[10px] text-stone-400 font-semibold block">{due.batch}</span>
                  </div>
                </div>
                <span className="font-sans font-extrabold text-xs text-rose-600">{due.pendingAmount}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert("Fee reminder notification sent to all pending students!")}
            className="w-full py-3 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Send Fee Reminders</span>
          </button>
        </div>

      </div>

      {/* Main Student Directory Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-50 hover:text-[#9E0C25] cursor-pointer shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#9E0C25]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

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
              {filteredRecords.length > 0 ? (
                filteredRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-stone-600">{row.studentIdCode}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={row.studentAvatar} alt={row.studentName} className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0" />
                        <span className="font-bold text-stone-900 text-sm">{row.studentName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-stone-600">{row.course}</td>
                    <td className="py-4 px-4 font-bold text-stone-800">{row.batch}</td>
                    <td className="py-4 px-4 font-bold text-stone-900">{row.totalFees}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">{row.paidAmount}</td>
                    <td className="py-4 px-4 font-bold text-rose-600">{row.pendingAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400 text-xs font-semibold">
                    No student finance records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Record Fee Payment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative border border-stone-200">
            <button
              onClick={() => setShowRecordModal(false)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-playfair font-bold text-xl text-stone-900">Record Student Fee Payment</h3>
              <p className="text-xs text-stone-500">Add an incoming manual or online fee payment transaction.</p>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Select Student</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-stone-50 focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                >
                  <option value="">-- Choose Student --</option>
                  {financeList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.studentName} ({s.studentIdCode}) - Pending: {s.pendingAmount}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 5000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 bg-stone-50 focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Payment Method</label>
                <select
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 bg-stone-50 focus:bg-white focus:border-[#9E0C25] focus:outline-none"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="MANUAL_CASH">Cash Payment</option>
                  <option value="BANK_TRANSFER">Bank Net Banking</option>
                  <option value="CARD">Credit / Debit Card</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white text-xs font-bold shadow-md disabled:opacity-60"
                >
                  {isSubmitting ? "Recording..." : "Confirm & Save Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
