"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Download,
  Calendar,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Filter,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { openThemeSuccess } from "@/components/ThemeDialogProvider";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  statusBadge: string;
}

export default function StudentFeeManagementPage() {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [autoPay, setAutoPay] = useState(true);
  const [amount, setAmount] = useState("4500");
  const [courseTitle, setCourseTitle] = useState("Kathak Dance Advanced");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [financeData, setFinanceData] = useState({
    totalFee: 12000,
    paidAmount: 0,
    pendingAmount: 12000,
    nextDueDate: "15th Next Month"
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentFinance = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest("/student/finance");
      if (res.data) {
        setFinanceData({
          totalFee: res.data.totalFee || 12000,
          paidAmount: res.data.paidAmount || 0,
          pendingAmount: res.data.pendingAmount ?? 12000,
          nextDueDate: res.data.nextDueDate || "15th Next Month"
        });
        if (res.data.courseTitle) {
          setCourseTitle(res.data.courseTitle);
        }
        if (Array.isArray(res.data.transactions)) {
          setTransactions(res.data.transactions);
        }
        if (res.data.pendingAmount > 0) {
          setAmount(String(res.data.pendingAmount));
        }
      }
    } catch (err) {
      console.error("Failed to fetch student finance data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentFinance();
  }, []);

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    setIsProcessing(true);
    try {
      const userStr = localStorage.getItem("kathak_student_user") || localStorage.getItem("kathak_user");
      const user = userStr ? JSON.parse(userStr) : null;
      const studentId = user?.id;

      await apiRequest("/admin/payments", {
        method: "POST",
        body: JSON.stringify({
          studentId,
          amount: Number(amount),
          gateway: selectedMethod.toUpperCase()
        })
      });

      setPaymentSuccess(true);
      await openThemeSuccess(`Payment of ₹${Number(amount).toLocaleString("en-IN")} completed successfully!`, "Payment Successful");
      setTimeout(() => setPaymentSuccess(false), 4000);
      fetchStudentFinance();
    } catch (err: any) {
      alert(err.message || "Failed to process payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* TOP 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: NEXT PAYMENT DUE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            NEXT PAYMENT DUE
          </span>
          <span className="text-3xl font-extrabold text-[#1B1B24] block">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : financeData.nextDueDate}
          </span>
          <p className="text-xs font-semibold text-[#900C27] flex items-center gap-1.5 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{courseTitle}</span>
          </p>
        </div>

        {/* Card 2: CURRENT BALANCE (Solid Maroon) */}
        <div className="bg-gradient-to-br from-[#800020] via-[#8B1D2C] to-[#600018] rounded-2xl p-6 text-white space-y-2 shadow-md">
          <span className="text-[10px] font-bold text-rose-200 uppercase tracking-wider block">
            PENDING DUES BALANCE
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">
              {isLoading ? "..." : `₹${financeData.pendingAmount.toLocaleString("en-IN")}`}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white">
              {financeData.pendingAmount === 0 ? "Fee Cleared" : "Pending Clearance"}
            </span>
          </div>
        </div>

        {/* Card 3: TOTAL PAID (YTD) */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            TOTAL PAID AMOUNT
          </span>
          <span className="text-3xl font-extrabold text-[#1B1B24] block">
            {isLoading ? "..." : `₹${financeData.paidAmount.toLocaleString("en-IN")}`}
          </span>
          <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 pt-1">
            <span className="text-emerald-600 font-bold">📈</span>
            <span>{transactions.length} total transactions</span>
          </p>
        </div>

      </div>

      {/* MIDDLE 2-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Online Payment Form Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-[#1B1B24]">Online Fee Payment</h2>
              <p className="text-xs text-stone-400 font-medium">Complete your pending course fee securely</p>
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <CreditCard className="w-4 h-4" />
              <Landmark className="w-4 h-4" />
              <Smartphone className="w-4 h-4" />
            </div>
          </div>

          <form onSubmit={handlePayNow} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-8 space-y-1.5">
                <label className="font-bold text-stone-600 block">Enrolled Course</label>
                <input
                  type="text"
                  disabled
                  value={courseTitle}
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl p-3 text-xs font-bold text-stone-800"
                />
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="font-bold text-stone-600 block">Amount to Pay (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-500">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#900C27] rounded-xl pl-8 pr-3 py-3 text-xs font-bold text-stone-800 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Supported Payment Methods */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-stone-600 block">Payment Method</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("card")}
                  className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedMethod === "card"
                      ? "border-[#900C27] bg-rose-50/50 text-[#900C27]"
                      : "border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit/Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("upi")}
                  className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedMethod === "upi"
                      ? "border-[#900C27] bg-rose-50/50 text-[#900C27]"
                      : "border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI (GPay, PhonePe)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("netbanking")}
                  className={`p-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedMethod === "netbanking"
                      ? "border-[#900C27] bg-rose-50/50 text-[#900C27]"
                      : "border-stone-200 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isProcessing || financeData.pendingAmount === 0}
                className="w-full bg-[#900C27] hover:bg-[#780A20] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : financeData.pendingAmount === 0 ? (
                  <span>Fee Fully Paid</span>
                ) : (
                  <>
                    <span>Pay ₹{Number(amount || 0).toLocaleString("en-IN")} Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Auto-Pay & Reminders */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>

              <button
                onClick={() => setAutoPay(!autoPay)}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  autoPay ? "bg-[#900C27]" : "bg-stone-300"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    autoPay ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#1B1B24]">Auto-Pay Enabled</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal">
                Automatically charge monthly course fees on due date using your primary UPI.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: PAYMENT HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="text-base font-bold text-[#1B1B24]">Payment History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-4">TRANSACTION ID</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">COURSE/DESCRIPTION</th>
                <th className="py-3 px-4">AMOUNT</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono text-stone-600 font-bold">{tx.id}</td>
                    <td className="py-4 px-4 text-stone-500">{tx.date}</td>
                    <td className="py-4 px-4 font-bold text-[#1B1B24]">{tx.description}</td>
                    <td className="py-4 px-4 font-extrabold text-[#1B1B24]">{tx.amount}</td>
                    <td className="py-4 px-4">
                      <span className={tx.statusBadge}>{tx.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-stone-400 text-xs font-medium">
                    No payment history recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
