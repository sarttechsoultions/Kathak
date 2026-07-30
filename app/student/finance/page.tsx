"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Filter
} from "lucide-react";

export default function StudentFeeManagementPage() {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [autoPay, setAutoPay] = useState(true);
  const [amount, setAmount] = useState("4500");
  const [course, setCourse] = useState("Kathak Advanced - Monthly Fee");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 3000);
    }, 1500);
  };

  const transactions = [
    {
      id: "#TRA-99021",
      date: "15 Sep, 2025",
      description: "Monthly Fee - September",
      amount: "₹4,500.00",
      status: "PAID",
      statusBadge: "text-rose-700 font-bold",
    },
    {
      id: "#TRA-98110",
      date: "05 Sep, 2025",
      description: "Ghungroo Rental",
      amount: "₹1,200.00",
      status: "PAID",
      statusBadge: "text-rose-700 font-bold",
    },
    {
      id: "#TRA-97652",
      date: "15 Aug, 2025",
      description: "Monthly Fee - August",
      amount: "₹4,500.00",
      status: "PENDING",
      statusBadge: "bg-[#FDEAE2] text-[#C15C3D] px-2.5 py-0.5 rounded-md font-bold text-[10px]",
    },
    {
      id: "#TRA-96541",
      date: "01 Aug, 2025",
      description: "Annual Recital Contribution",
      amount: "₹5,000.00",
      status: "PAID",
      statusBadge: "text-rose-700 font-bold",
    },
  ];

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
            15 Oct, 2025
          </span>
          <p className="text-xs font-semibold text-[#900C27] flex items-center gap-1.5 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Classical Kathak - Advanced</span>
          </p>
        </div>

        {/* Card 2: CURRENT BALANCE (Solid Maroon) */}
        <div className="bg-gradient-to-br from-[#800020] via-[#8B1D2C] to-[#600018] rounded-2xl p-6 text-white space-y-2 shadow-md">
          <span className="text-[10px] font-bold text-rose-200 uppercase tracking-wider block">
            CURRENT BALANCE
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">₹4,500.00</span>
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white">
              Pending Clearance
            </span>
          </div>
        </div>

        {/* Card 3: TOTAL PAID (YTD) */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            TOTAL PAID (YTD)
          </span>
          <span className="text-3xl font-extrabold text-[#1B1B24] block">
            ₹54,000.00
          </span>
          <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 pt-1">
            <span className="text-emerald-600 font-bold">📈</span>
            <span>12 successful payments</span>
          </p>
        </div>

      </div>

      {/* MIDDLE 2-COLUMN SECTION (Online Payment Form Left | Auto-Pay & Reminders Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Online Payment Form Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-[#1B1B24]">Online Payment</h2>
              <p className="text-xs text-stone-400 font-medium">Complete your pending fee securely</p>
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
                <label className="font-bold text-stone-600 block">Select Course</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-[#900C27] rounded-xl p-3 text-xs font-medium text-stone-800 focus:outline-none transition-colors"
                >
                  <option>Kathak Advanced - Monthly Fee</option>
                  <option>Bharatanatyam Intermediate</option>
                  <option>Special Workshop Fee</option>
                </select>
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="font-bold text-stone-600 block">Amount to Pay</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-500">₹</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#900C27] rounded-xl pl-8 pr-3 py-3 text-xs font-bold text-stone-800 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Supported Payment Methods */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-stone-600 block">Supported Payment Methods</span>
              
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

            {/* Pay Now Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#900C27] hover:bg-[#780A20] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Pay Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN: Auto-Pay & Fee Reminders (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* BOX 1: AUTO-PAY ENABLED */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>

              {/* Toggle */}
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
                Automatically charge fees on the 5th of every month using your primary UPI ID.
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-block bg-stone-50 border border-stone-200 border-dashed px-3 py-1.5 rounded-xl text-[11px] font-mono text-stone-600">
                Linked Account: <span className="font-bold text-[#1B1B24]">rahul.sharma@okaxis</span>
              </span>
            </div>
          </div>

          {/* BOX 2: FEE REMINDERS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#1B1B24]">Fee Reminders</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-stone-800 font-semibold p-2.5 rounded-xl bg-rose-50/50">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                <span>Advanced Kathak Fee (Due in 5 days)</span>
              </div>

              <div className="flex items-center gap-2 text-stone-500 font-medium p-2.5 rounded-xl bg-stone-50">
                <span className="w-2 h-2 rounded-full bg-stone-300 shrink-0" />
                <span>Costume Rental (Paid)</span>
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full border border-stone-200 hover:border-stone-300 text-stone-700 py-2 rounded-xl text-xs font-semibold transition-colors">
                Manage All Reminders
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: PAYMENT HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
        
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="text-base font-bold text-[#1B1B24]">
            Payment History
          </h3>

          <button className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Filter</span>
          </button>
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
                <th className="py-3 px-4 text-right">RECEIPT</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-4 px-4 font-mono text-stone-600 font-bold">{tx.id}</td>
                  <td className="py-4 px-4 text-stone-500">{tx.date}</td>
                  <td className="py-4 px-4 font-bold text-[#1B1B24]">{tx.description}</td>
                  <td className="py-4 px-4 font-extrabold text-[#1B1B24]">{tx.amount}</td>
                  <td className="py-4 px-4">
                    <span className={tx.statusBadge}>{tx.status}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors">
                      <Download className="w-4 h-4 text-rose-700 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Centered Link */}
        <div className="text-center pt-3 border-t border-stone-100">
          <a href="#history" className="text-xs font-bold text-[#900C27] hover:underline inline-flex items-center gap-1">
            <span>View All Transaction History</span>
            <span>›</span>
          </a>
        </div>

      </div>

      {paymentSuccess && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Payment of ₹4,500 Processed Successfully!</span>
        </div>
      )}

    </div>
  );
}
