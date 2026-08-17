"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Printer,
  X,
  Loader2,
  Download
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  statusBadge: string;
}

export default function StudentFeeManagementPage() {
  const [financeData, setFinanceData] = useState({
    totalFee: 0,
    paidAmount: 0,
    pendingAmount: 0,
    nextDueDate: "No Dues"
  });
  const [courseTitle, setCourseTitle] = useState("Course");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");

  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  const fetchStudentFinance = async () => {
    setIsLoading(true);
    try {
      const userStr = localStorage.getItem("kathak_student_user") || localStorage.getItem("kathak_session_user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (user) {
        setStudentName(user.fullName || user.name || "Student");
        setStudentId(user.studentId || user.email || "#STU-001");
      }

      const res = await apiRequest("/student/finance");
      if (res.data) {
        setFinanceData({
          totalFee: res.data.totalFee || 0,
          paidAmount: res.data.paidAmount || 0,
          pendingAmount: res.data.pendingAmount ?? 0,
          nextDueDate: res.data.nextDueDate || "Cleared"
        });
        if (res.data.courseTitle) {
          setCourseTitle(res.data.courseTitle);
        }
        if (Array.isArray(res.data.transactions)) {
          setTransactions(res.data.transactions);
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}} />
      <div className="space-y-8 font-sans pb-16 animate-in fade-in duration-300 print:hidden">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Fee Ledger</h1>
        <p className="text-sm font-medium text-stone-500 mt-1">
          Track your course fee status and download your payment receipts.
        </p>
      </div>

      {/* TOP 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: NEXT PAYMENT DUE */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-full blur-2xl -mr-10 -mt-10" />
          <span className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider block relative z-10">
            TOTAL COURSE FEE
          </span>
          <span className="text-3xl font-extrabold text-[#1B1B24] block relative z-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-stone-300" /> : `₹${financeData.totalFee.toLocaleString("en-IN")}`}
          </span>
          <p className="text-xs font-semibold text-[#900C27] flex items-center gap-1.5 pt-1 relative z-10">
            <Calendar className="w-3.5 h-3.5" />
            <span>{courseTitle}</span>
          </p>
        </div>

        {/* Card 2: CURRENT BALANCE (Solid Maroon) */}
        <div className="bg-gradient-to-br from-[#9E0C25] to-[#600018] rounded-2xl p-6 text-white space-y-2 shadow-md relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mb-10" />
          <span className="text-[10.5px] font-extrabold text-rose-200 uppercase tracking-wider block relative z-10">
            PENDING DUES BALANCE
          </span>
          <div className="flex items-baseline gap-3 relative z-10">
            <span className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isLoading ? "..." : `₹${financeData.pendingAmount.toLocaleString("en-IN")}`}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white">
              {financeData.pendingAmount === 0 ? "Fee Cleared" : "Pending Clearance"}
            </span>
          </div>
        </div>

        {/* Card 3: TOTAL PAID (YTD) */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-2 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-20 h-20 bg-emerald-50 rounded-full blur-xl -mr-8 -mt-10" />
          <span className="text-[10.5px] font-extrabold text-stone-400 uppercase tracking-wider block relative z-10">
            TOTAL PAID AMOUNT
          </span>
          <span className="text-3xl font-extrabold text-emerald-600 block relative z-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {isLoading ? "..." : `₹${financeData.paidAmount.toLocaleString("en-IN")}`}
          </span>
          <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 pt-1 relative z-10">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{transactions.length} total transactions</span>
          </p>
        </div>

      </div>

      {/* BOTTOM SECTION: PAYMENT HISTORY TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-50/50">
          <div>
            <h3 className="text-base font-bold text-[#1B1B24]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Payment History</h3>
            <p className="text-xs font-medium text-stone-500 mt-1">View your past transactions and download official receipts.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-stone-100 text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                <th className="py-4 px-6 whitespace-nowrap">TRANSACTION ID</th>
                <th className="py-4 px-6 whitespace-nowrap">DATE</th>
                <th className="py-4 px-6 whitespace-nowrap">DESCRIPTION</th>
                <th className="py-4 px-6 whitespace-nowrap">AMOUNT</th>
                <th className="py-4 px-6 whitespace-nowrap">STATUS</th>
                <th className="py-4 px-6 whitespace-nowrap text-right">RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-stone-300" />
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/80 transition-colors group">
                    <td className="py-4 px-6 font-mono text-stone-600 text-[13px]">{tx.id}</td>
                    <td className="py-4 px-6 text-stone-500 text-[13px]">{tx.date}</td>
                    <td className="py-4 px-6 font-bold text-[#1B1B24]">{tx.description}</td>
                    <td className="py-4 px-6 font-black text-[#1B1B24]">{tx.amount}</td>
                    <td className="py-4 px-6">
                      <span className={tx.statusBadge}>{tx.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {tx.status === "SUCCESS" ? (
                        <button
                          onClick={() => setSelectedReceipt(tx)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 transition-colors text-[11px] font-bold tracking-wide uppercase cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-stone-400 uppercase">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400 text-sm font-medium">
                    No payment history recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 print:p-0 print:block print:static print:z-auto">
          
          {/* Backdrop (hidden in print) */}
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm print:hidden animate-in fade-in duration-200"
            onClick={() => setSelectedReceipt(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full print:shadow-none print:rounded-none print:w-full print:max-w-none print:h-auto animate-in zoom-in-95 duration-200">
            
            {/* Action Bar (hidden in print) */}
            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-stone-50 print:hidden shrink-0">
              <h2 className="text-sm font-bold text-stone-700">Digital Receipt</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#900C27] text-white hover:bg-[#7a0a21] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-2 rounded-xl text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="relative p-8 sm:p-12 overflow-y-auto print:overflow-visible print:p-12 bg-white min-h-[600px]" id="printable-receipt">
              
              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Watermark" 
                  className="w-[80%] max-w-md object-contain opacity-[0.10] grayscale"
                />
              </div>

              {/* Receipt Header */}
              <div className="relative z-10 flex items-start justify-between border-b-2 border-stone-100 pb-8 mb-8">
                <div>
                  <img src="/logo.png" alt="Kathak by Harshita" className="h-14 w-auto object-contain mb-4" />
                  <p className="text-sm font-bold text-stone-900">Kathak by Harshita</p>
                  <p className="text-xs font-medium text-stone-500 mt-0.5">Plot No. 12, Dance Academy Street</p>
                  <p className="text-xs font-medium text-stone-500">New Delhi, India - 110001</p>
                  <p className="text-xs font-medium text-stone-500 mt-1">support@kathak.com</p>
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-black text-stone-200 uppercase tracking-widest mb-2">RECEIPT</h1>
                  <p className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-bold text-stone-900">{selectedReceipt.date}</p>
                </div>
              </div>

              {/* Billed To & Receipt Info */}
              <div className="relative z-10 grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-2">Billed To</p>
                  <p className="text-base font-bold text-stone-900">{studentName}</p>
                  <p className="text-sm font-medium text-stone-500 mt-0.5">Student ID: {studentId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-2">Transaction Details</p>
                  <p className="text-sm font-medium text-stone-500 mb-1">
                    <span className="font-bold text-stone-900">ID:</span> {selectedReceipt.id}
                  </p>
                  <p className="text-sm font-medium text-stone-500">
                    <span className="font-bold text-stone-900">Status:</span> 
                    <span className="text-emerald-600 font-bold ml-1">Paid Successfully</span>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="relative z-10">
                <table className="w-full text-left border-collapse mb-10">
                  <thead>
                    <tr className="border-b-2 border-stone-900">
                      <th className="py-3 text-xs font-extrabold text-stone-900 uppercase tracking-wider w-[70%]">Description</th>
                      <th className="py-3 text-xs font-extrabold text-stone-900 uppercase tracking-wider text-right w-[30%]">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="py-4 text-sm font-bold text-stone-800">{selectedReceipt.description}</td>
                      <td className="py-4 text-sm font-bold text-stone-800 text-right">{selectedReceipt.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals and Seal */}
              <div className="relative z-10 flex justify-between items-end mb-16">
                
                {/* Seal / Signature */}
                <div className="flex flex-col items-center ml-8">
                  <div className="w-24 h-24 rounded-full border-4 border-rose-900/20 flex items-center justify-center text-center p-2 mb-2 relative transform -rotate-12">
                    <div className="w-full h-full rounded-full border border-dashed border-rose-900/30 flex items-center justify-center">
                      <span className="text-[9px] font-black uppercase text-rose-900/40 leading-tight">
                        Kathak<br/>Authorized<br/>Signature
                      </span>
                    </div>
                  </div>
                  <div className="w-32 border-b border-stone-800 mb-1"></div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Authorized Signatory</span>
                </div>

                {/* Amount Totals */}
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm font-bold text-stone-500">
                    <span>Subtotal</span>
                    <span>{selectedReceipt.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-500">
                    <span>Tax (0%)</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-stone-900 pt-3 border-t-2 border-stone-900">
                    <span>Total Paid</span>
                    <span>{selectedReceipt.amount}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 border-t border-stone-200 pt-6 text-center">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                  Thank you for learning with Kathak By Harshita
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
