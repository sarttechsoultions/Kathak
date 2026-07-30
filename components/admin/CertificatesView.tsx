"use client";

import React, { useState } from "react";
import {
  FileCheck,
  Award,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  Plus,
  Filter,
  Eye,
  Download,
  Ban,
  ArrowLeft,
  Upload,
  Save,
  CheckCircle2,
  Check,
  FileText,
  User,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react";

interface CertificateRecord {
  id: string;
  certCode: string;
  studentName: string;
  studentAvatar: string;
  batchName: string;
  issueDate: string;
  status: "ISSUED" | "REVOKED" | "PENDING";
}

const mockCertificates: CertificateRecord[] = [
  {
    id: "cert-1",
    certCode: "KAC-2024-[#1]",
    studentName: "Jayesh Singh",
    studentAvatar: "/Ananya.png",
    batchName: "Kathak Basics - B1",
    issueDate: "May 12, 2024",
    status: "ISSUED"
  },
  {
    id: "cert-2",
    certCode: "KAC-2024-[#2]",
    studentName: "Tanya Verma",
    studentAvatar: "/Sunita.png",
    batchName: "Kathak Intermediate - A2",
    issueDate: "June 01, 2024",
    status: "ISSUED"
  },
  {
    id: "cert-3",
    certCode: "KAC-2024-[#3]",
    studentName: "Ananya Kulkarni",
    studentAvatar: "/Meera.png",
    batchName: "Kathak Basics - B3",
    issueDate: "July 18, 2024",
    status: "ISSUED"
  },
  {
    id: "cert-4",
    certCode: "KAC-2024-[#4]",
    studentName: "Rohan Deshmukh",
    studentAvatar: "/Grace1.png",
    batchName: "Bharatanatyam Intro - C2",
    issueDate: "Jan 10, 2024",
    status: "ISSUED"
  }
];

export default function CertificatesView() {
  // Navigation Mode: 'HUB' | 'ISSUE_FORM' | 'BUILDER'
  const [viewMode, setViewMode] = useState<"HUB" | "ISSUE_FORM" | "BUILDER">("HUB");

  // State Lists & Form States
  const [certificatesList, setCertificatesList] = useState<CertificateRecord[]>(mockCertificates);
  
  // Issue Certificate Form State
  const [selectedStudent, setSelectedStudent] = useState("Ananya Deshmukh");
  const [academicBatch, setAcademicBatch] = useState("Kathak Intermediate - A2");
  const [certNumber, setCertNumber] = useState("KAC-2024-009");
  const [issueDate, setIssueDate] = useState("2024-05-19");
  const [achievementDegree, setAchievementDegree] = useState("Distinction / Grade A");
  const [emailNotify, setEmailNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(true);

  // Certificate Builder State
  const [academyName, setAcademyName] = useState("Harshita Dance Academy");
  const [mainHeading, setMainHeading] = useState("Certificate of Completion");
  const [subHeadingText, setSubHeadingText] = useState("This is proudly presented to acknowledge the successful completion of classical Kathak training.");
  const [toggleStudentName, setToggleStudentName] = useState(true);
  const [toggleBatchName, setToggleBatchName] = useState(true);
  const [toggleDate, setToggleDate] = useState(true);
  const [toggleScore, setToggleScore] = useState(true);

  const handleIssueCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: CertificateRecord = {
      id: `cert-${certificatesList.length + 1}`,
      certCode: certNumber,
      studentName: selectedStudent,
      studentAvatar: "/Ananya.png",
      batchName: academicBatch,
      issueDate: "May 19, 2024",
      status: "ISSUED"
    };
    setCertificatesList([newCert, ...certificatesList]);
    alert(`Certificate ${certNumber} sent to ${selectedStudent} successfully!`);
    setViewMode("HUB");
  };

  const handleSaveTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Certificate Template saved successfully!");
    setViewMode("ISSUE_FORM");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[1300px] mx-auto">
      
      {/* ================= SCREEN 1: DIGITAL CERTIFICATE HUB OVERVIEW DIRECTORY ================= */}
      {viewMode === "HUB" && (
        <div className="space-y-8">
          
          {/* Header & Top Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                Digital Certificate Hub
              </h1>
              <p className="text-xs sm:text-sm font-medium text-stone-500 max-w-3xl">
                Manage, verify, and issue the full ledger of all academic credentials. Authenticate issued certificates through our encryption ledger.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setViewMode("ISSUE_FORM")}
                className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Issue New Certificate</span>
              </button>

              <button
                onClick={() => alert("Filter Certificates")}
                className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">TOTAL ISSUED</p>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">12,842</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">VERIFICATIONS</p>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-emerald-600 mt-1">48,201</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">PENDING SYNC</p>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-amber-600 mt-1">24</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">REVOKED</p>
                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-rose-600 mt-1">156</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Certificate Inventory Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-lg text-stone-900">Certificate Inventory</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                    <th className="py-3.5 px-4">CERTIFICATE ID</th>
                    <th className="py-3.5 px-4">STUDENT NAME</th>
                    <th className="py-3.5 px-4">BATCH NAME</th>
                    <th className="py-3.5 px-4">ISSUE DATE</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                  {certificatesList.map((cert) => (
                    <tr key={cert.id} className="hover:bg-stone-50/80 transition-colors">
                      
                      {/* Cert Code */}
                      <td className="py-4 px-4 font-bold text-rose-700">{cert.certCode}</td>

                      {/* Student Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cert.studentAvatar} alt={cert.studentName} className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0" />
                          <span className="font-bold text-stone-900 text-sm">{cert.studentName}</span>
                        </div>
                      </td>

                      {/* Batch Name */}
                      <td className="py-4 px-4 font-semibold text-stone-700">{cert.batchName}</td>

                      {/* Issue Date */}
                      <td className="py-4 px-4 font-semibold text-stone-500">{cert.issueDate}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold border border-emerald-200">
                          • {cert.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => alert(`Viewing Certificate ${cert.certCode}`)}
                            title="View Certificate"
                            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert(`Downloading PDF for ${cert.certCode}`)}
                            title="Download PDF"
                            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-900 cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCertificatesList(certificatesList.filter((c) => c.id !== cert.id))}
                            title="Revoke Certificate"
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer"
                          >
                            <Ban className="w-4 h-4" />
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
              <div>Showing 1-10 of 12,842 results</div>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-400 flex items-center justify-center cursor-not-allowed"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg bg-[#9E0C25] text-white font-bold flex items-center justify-center">1</button>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">2</button>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">3</button>
                <span>...</span>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center">1,284</button>
                <button className="w-7 h-7 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= SCREEN 2: ISSUE CERTIFICATE WORKSPACE (EXACT FIGMA MATCH) ================= */}
      {viewMode === "ISSUE_FORM" && (
        <form onSubmit={handleIssueCertificateSubmit} className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          
          {/* Header & Create Template Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setViewMode("HUB")}
                className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer uppercase mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Issue Certificate</span>
              </button>
              <p className="text-xs text-stone-400 font-medium">
                Enter student details to generate and send verified certificate.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewMode("BUILDER")}
              className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              Create Template
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
            
            {/* Form Fields Grid */}
            <div className="space-y-5 text-xs font-semibold">
              
              {/* Row 1: Select Student & Academic Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">SELECT STUDENT</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  >
                    <option>Ananya Deshmukh</option>
                    <option>Jayesh Singh</option>
                    <option>Tanya Verma</option>
                    <option>Rohan Deshmukh</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">ACADEMIC BATCH</label>
                  <input
                    type="text"
                    value={academicBatch}
                    onChange={(e) => setAcademicBatch(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>

              {/* Row 2: Cert Number & Issue Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">CERT NUMBER</label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">ISSUE DATE</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>

              {/* Row 3: Achievement Degree */}
              <div className="space-y-1.5">
                <label className="block text-stone-700 font-bold uppercase text-[10.5px]">COURSE COMPLETION DEGREE / ACHIEVEMENT</label>
                <input
                  type="text"
                  value={achievementDegree}
                  onChange={(e) => setAchievementDegree(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-[#9E0C25]"
                />
              </div>

            </div>

            {/* Notification Settings Box */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-4">
              <h4 className="font-sans font-bold text-xs text-stone-900 uppercase tracking-wider">NOTIFICATION SETTINGS</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">Email Notification</span>
                  <button
                    type="button"
                    onClick={() => setEmailNotify(!emailNotify)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      emailNotify ? "bg-[#9E0C25]" : "bg-stone-300"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                      emailNotify ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">App Push Notification</span>
                  <button
                    type="button"
                    onClick={() => setPushNotify(!pushNotify)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      pushNotify ? "bg-[#9E0C25]" : "bg-stone-300"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                      pushNotify ? "right-0.5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="submit"
                className="w-full sm:w-80 py-3.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase"
              >
                Send Certificate
              </button>

              <button
                type="button"
                onClick={() => alert("Generating PDF Certificate Preview...")}
                className="w-full sm:w-80 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs shadow-xs transition-all cursor-pointer uppercase"
              >
                Download PDF Preview
              </button>
            </div>

          </div>

        </form>
      )}

      {/* ================= SCREEN 3: CERTIFICATE BUILDER WORKSPACE (EXACT FIGMA MATCH) ================= */}
      {viewMode === "BUILDER" && (
        <form onSubmit={handleSaveTemplateSubmit} className="space-y-6 animate-in fade-in duration-300 max-w-[1100px] mx-auto">
          
          {/* Header & Save Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setViewMode("ISSUE_FORM")}
                className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer uppercase mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Certificate Builder</span>
              </button>
              <p className="text-xs text-stone-400 font-medium">
                Customize your academy's digital certificate template.
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              Save Template
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-8">
            
            {/* Section 1: Academy Branding */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-4">
              <h4 className="font-sans font-bold text-xs text-stone-900 uppercase tracking-wider">ACADEMY BRANDING</h4>

              <div className="space-y-4 text-xs font-semibold">
                <div className="border-2 border-dashed border-stone-300 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-[#9E0C25]">
                  <Upload className="w-5 h-5 text-[#9E0C25]" />
                  <span className="font-bold text-stone-900">Upload Academy Logo</span>
                  <span className="text-[10px] text-stone-400 uppercase">PNG, JPEG, SVG (MAX 2MB)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">ACADEMY NAME</label>
                  <input
                    type="text"
                    value={academyName}
                    onChange={(e) => setAcademyName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Template Content */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-4">
              <h4 className="font-sans font-bold text-xs text-stone-900 uppercase tracking-wider">TEMPLATE CONTENT</h4>

              <div className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">MAIN HEADING</label>
                  <input
                    type="text"
                    value={mainHeading}
                    onChange={(e) => setMainHeading(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-700 font-bold uppercase text-[10.5px]">SUB-TEXT BODY</label>
                  <textarea
                    rows={3}
                    value={subHeadingText}
                    onChange={(e) => setSubHeadingText(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white border border-stone-200/90 text-stone-900 font-semibold text-xs focus:outline-none focus:border-[#9E0C25]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Dynamic Placeholders */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-4">
              <h4 className="font-sans font-bold text-xs text-stone-900 uppercase tracking-wider">DYNAMIC PLACEHOLDERS</h4>

              <div className="space-y-3">
                {[
                  { label: "[Student Name]", state: toggleStudentName, setState: setToggleStudentName },
                  { label: "[Batch Name]", state: toggleBatchName, setState: setToggleBatchName },
                  { label: "[Date of Issue]", state: toggleDate, setState: setToggleDate },
                  { label: "[Grade / Score]", state: toggleScore, setState: setToggleScore }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200/70">
                    <span className="font-mono text-xs font-bold text-stone-800">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => item.setState(!item.state)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        item.state ? "bg-[#9E0C25]" : "bg-stone-300"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        item.state ? "right-0.5" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Template Button */}
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase"
              >
                Save &amp; Publish Template
              </button>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
