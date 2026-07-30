"use client";

import React, { useState } from "react";
import {
  Share2,
  Download,
  CheckCircle2,
  QrCode,
  Copy,
  Award,
  ChevronRight,
  ShieldCheck,
  Globe
} from "lucide-react";

export default function StudentCertificatesPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* PAGE HEADER & TOP ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
            ACHIEVED ON MAY 15, 2025
          </span>
          <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
            Bharatanatyam Intermediate
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors shadow-2xs cursor-pointer">
            <Share2 className="w-4 h-4 text-stone-500" />
            <span>Share Online</span>
          </button>

          <button className="bg-[#900C27] hover:bg-[#780A20] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* MAIN 2-COLUMN GRID (Left Certificate Document Canvas | Right Details & Share) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CERTIFICATE DOCUMENT CANVAS PREVIEW (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl relative space-y-8 text-center min-h-[620px] flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Corner Frame Crop Marks */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-rose-900/30" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-rose-900/30" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-rose-900/30" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-rose-900/30" />

          {/* Header Logo */}
          <div className="space-y-1">
            <span className="text-sm font-serif font-bold text-[#900C27] tracking-widest uppercase block">
              Nritya
            </span>
            <span className="text-[9px] font-sans font-bold text-stone-400 uppercase tracking-widest block">
              DANCE ACADEMY
            </span>
          </div>

          {/* Certificate Title */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1B1B24] tracking-wider uppercase">
              CERTIFICATE OF COMPLETION
            </h2>
            <p className="text-xs font-serif italic text-stone-500">
              This is to certify that
            </p>
          </div>

          {/* Student Name */}
          <div className="py-2 border-b border-stone-200 max-w-sm mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1B1B24]">
              Ananya Deshpande
            </h3>
          </div>

          {/* Course Completion Statement */}
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            has successfully completed the intensive curriculum and practical examinations for the course
          </p>

          {/* Course Badge */}
          <div>
            <span className="inline-block bg-[#FDF2F4] text-[#900C27] border border-rose-200 px-4 py-1.5 rounded-full text-xs font-bold">
              Bharatanatyam Intermediate
            </span>
          </div>

          {/* Grade & Date */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-xs py-2">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">GRADE</span>
              <span className="font-bold text-[#1B1B24] text-sm">Distinction</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">DATE</span>
              <span className="font-bold text-[#1B1B24] text-sm">May 15, 2025</span>
            </div>
          </div>

          {/* Bottom Signatures Row */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between px-4 text-xs text-stone-500">
            
            {/* Registrar Signature */}
            <div className="text-left space-y-1">
              <div className="w-8 h-8 rounded-full border border-rose-200 bg-rose-50 flex items-center justify-center text-[#900C27] mb-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-stone-400 block border-t border-stone-300 pt-1">
                Registrar signature
              </span>
            </div>

            {/* Guru Signature */}
            <div className="text-right space-y-1">
              <span className="font-serif italic text-sm text-stone-800 font-bold block pb-1">
                Guru Meenakshi
              </span>
              <span className="text-[10px] font-bold text-stone-400 block border-t border-stone-300 pt-1">
                Guru Meenakshi, Artistic Director
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: DETAILS, QR VERIFICATION & SHARING (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* BOX 1: CERTIFICATE DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Award className="w-4 h-4 text-[#900C27]" />
              <h3 className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider">
                Certificate Details
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold uppercase text-[10px]">CERTIFICATE ID</span>
                <span className="font-mono font-bold text-rose-700">NAC-2025-089</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold uppercase text-[10px]">ISSUED BY</span>
                <span className="font-bold text-[#1B1B24]">Guru Meenakshi</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold uppercase text-[10px]">STATUS</span>
                <span className="bg-[#E5F2FF] text-[#2B78C5] px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* QR Code Verification Card */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-center space-y-2 pt-3">
              <div className="w-20 h-20 bg-white p-2 border border-stone-200 rounded-xl mx-auto shadow-2xs flex items-center justify-center">
                <QrCode className="w-16 h-16 text-stone-800" />
              </div>
              <p className="text-[10px] text-stone-500 max-w-xs mx-auto leading-normal font-medium">
                Scan to verify this achievement on the official Nritya Academy portal.
              </p>
            </div>
          </div>

          {/* BOX 2: SHARE ACHIEVEMENT */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider">
              Share Achievement
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="bg-[#0A66C2] hover:bg-[#084e96] text-white p-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>LinkedIn</span>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="bg-black hover:bg-stone-800 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Twitter</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-90 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 transition-opacity"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="bg-[#E5F2FF] hover:bg-sky-100 text-sky-800 p-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          {/* BOX 3: YOUR OTHER CERTIFICATES */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider">
              Your Other Certificates
            </h3>

            <div className="p-3.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 flex items-center justify-between transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                  🎖️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1B1B24]">Bharatanatyam Foundation</h4>
                  <span className="text-[10px] text-stone-400 font-medium">Issued Jan 2024</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
