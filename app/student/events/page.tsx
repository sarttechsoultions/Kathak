"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  CheckCircle2,
  Tag,
  ArrowRight,
  Grid,
  List
} from "lucide-react";

export default function StudentEventsWorkshopsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* 1. TOP HERO FEATURED EVENT BANNER CARD */}
      <div className="bg-stone-900 rounded-[24px] overflow-hidden relative shadow-xl p-6 sm:p-8 border border-stone-800 text-white min-h-[260px] flex flex-col justify-between">
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gurukul-dancer.jpg"
            alt="Summer Intensive Masterclass 2025"
            className="w-full h-full object-cover object-center filter brightness-60"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/classesbg.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="bg-[#900C27] text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
            MOST ANTICIPATED
          </span>
          <span className="bg-rose-950/80 backdrop-blur-md border border-rose-400/30 text-rose-200 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>Filling Fast</span>
          </span>
        </div>

        {/* Banner Content & Countdown */}
        <div className="relative z-10 space-y-3 pt-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight max-w-xl">
            Summer Intensive Masterclass 2025
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 font-normal max-w-lg leading-relaxed">
            3-Day immersive workshop with Padma Shri Dr. Ananda Shankar Jayant.<br />
            <span className="text-stone-300 text-xs">Limited spots available for advanced students.</span>
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            
            {/* Countdown Boxes */}
            <div className="flex items-center gap-2 text-center">
              <div className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl">
                <span className="text-base font-extrabold text-white block leading-none">12</span>
                <span className="text-[8px] font-bold text-stone-300 uppercase block tracking-wider pt-0.5">DAYS</span>
              </div>
              <div className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl">
                <span className="text-base font-extrabold text-white block leading-none">08</span>
                <span className="text-[8px] font-bold text-stone-300 uppercase block tracking-wider pt-0.5">HOURS</span>
              </div>
              <div className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl">
                <span className="text-base font-extrabold text-white block leading-none">45</span>
                <span className="text-[8px] font-bold text-stone-300 uppercase block tracking-wider pt-0.5">MINS</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="bg-[#900C27] hover:bg-[#780A20] text-white px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer">
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>

      {/* 2. MIDDLE 2-COLUMN SECTION (Left Workshops & Registrations | Right Calendar & Track) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* UPCOMING WORKSHOPS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1B1B24]">Upcoming Workshops</h2>
                <p className="text-xs text-stone-400 font-medium">Curated sessions for every skill level</p>
              </div>

              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white text-[#900C27] shadow-xs" : "text-stone-400"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white text-[#900C27] shadow-xs" : "text-stone-400"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2 Workshop Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Workshop Card 1 */}
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group">
                <div className="h-36 bg-stone-900 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Ananya.png" alt="Contemporary Fusion Basics" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2.5 left-2.5 bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    Workshop
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-[#1B1B24] text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
                    ₹1,500
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-[#1B1B24] group-hover:text-[#900C27] transition-colors leading-snug">
                      Contemporary Fusion Basics
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <div className="w-4 h-4 rounded-full bg-stone-300 overflow-hidden shrink-0" />
                      <span>by Megha Iyer</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-stone-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>24 July</span>
                        <Clock className="w-3.5 h-3.5 text-stone-400 ml-2" />
                        <span>05:00 PM</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Studio A / Live</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                    <button className="flex-1 border border-stone-200 hover:border-stone-300 text-stone-700 py-1.5 rounded-xl text-xs font-semibold">
                      Details
                    </button>
                    <button className="flex-1 bg-[#900C27] hover:bg-[#780A20] text-white py-1.5 rounded-xl text-xs font-bold shadow-2xs">
                      Register
                    </button>
                  </div>
                </div>
              </div>

              {/* Workshop Card 2 */}
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group">
                <div className="h-36 bg-stone-900 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/classesbg.png" alt="The History of Classical Mudras" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2.5 left-2.5 bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    Seminar
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
                    Free
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-[#1B1B24] group-hover:text-[#900C27] transition-colors leading-snug">
                      The History of Classical Mudras
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <div className="w-4 h-4 rounded-full bg-stone-300 overflow-hidden shrink-0" />
                      <span>by Guru Someshwar</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-stone-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>26 July</span>
                        <Clock className="w-3.5 h-3.5 text-stone-400 ml-2" />
                        <span>11:00 AM</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Zoom Live</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                    <button className="flex-1 border border-stone-200 hover:border-stone-300 text-stone-700 py-1.5 rounded-xl text-xs font-semibold">
                      Details
                    </button>
                    <button className="flex-1 bg-[#900C27] hover:bg-[#780A20] text-white py-1.5 rounded-xl text-xs font-bold shadow-2xs">
                      Join Free
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* MY REGISTRATIONS SECTION */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-[#1B1B24]">My Registrations</h3>
              <a href="#history" className="text-xs text-[#900C27] font-semibold hover:underline">
                View History
              </a>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Item 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#900C27] flex items-center justify-center shrink-0 font-bold">
                    🎭
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1B24]">Annual Production Audition</h4>
                    <span className="text-[10px] text-stone-400">18 July 2025 • 4:00 PM</span>
                  </div>
                </div>
                <span className="bg-[#E6F7ED] text-[#22A05B] px-3 py-1 rounded-full text-[10px] font-bold">
                  Confirmed
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#900C27] flex items-center justify-center shrink-0 font-bold">
                    💪
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1B24]">Core Strength for Dancers</h4>
                    <span className="text-[10px] text-stone-400">21 July 2025 • 7:00 AM</span>
                  </div>
                </div>
                <span className="bg-[#FEF3C7] text-[#D97706] px-3 py-1 rounded-full text-[10px] font-bold">
                  Upcoming
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* JULY 2025 CALENDAR WIDGET */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#1B1B24] uppercase tracking-wider">July 2025</h4>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <button className="hover:text-black">‹</button>
                <button className="hover:text-black">›</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-stone-400 uppercase">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              <span className="text-stone-300 py-1">29</span>
              <span className="text-stone-300 py-1">30</span>
              <span className="py-1">1</span>
              <span className="py-1">2</span>
              <span className="py-1">3</span>
              <span className="py-1">4</span>
              <span className="py-1">5</span>
              <span className="py-1">6</span>
              <span className="py-1">7</span>
              <span className="py-1">8</span>
              <span className="py-1">9</span>
              <span className="py-1">10</span>
              <span className="py-1">11</span>
              <span className="py-1">12</span>
              <span className="py-1">13</span>
              <span className="py-1">14</span>
              <span className="w-7 h-7 mx-auto rounded-full bg-[#900C27] text-white flex items-center justify-center font-bold">15</span>
              <span className="py-1">16</span>
              <span className="py-1">17</span>
              <span className="py-1">18</span>
              <span className="py-1">19</span>
              <span className="w-7 h-7 mx-auto rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center">20</span>
              <span className="w-7 h-7 mx-auto rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center">21</span>
              <span className="py-1">22</span>
              <span className="py-1">23</span>
              <span className="w-7 h-7 mx-auto rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center">24</span>
              <span className="py-1">25</span>
              <span className="py-1">26</span>
            </div>

            <div className="pt-2 border-t border-stone-100 text-[10px] font-semibold text-stone-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#900C27]" />
                15 Jul - Kathak Practice Session
              </span>
              <span className="text-stone-400">05:00 PM</span>
            </div>
          </div>

          {/* COMPETITION TRACK TIMELINE */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#1B1B24]">Competition Track</h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-rose-200">
              
              {/* Item 1 */}
              <div className="relative space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#900C27] absolute -left-[21px] top-1 ring-4 ring-rose-100" />
                <h4 className="text-xs font-bold text-[#1B1B24]">Semi-finals Schedule</h4>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Your performance slot is at 10:30 AM on 5th Aug. Auditorium Main Stage
                </p>
              </div>

              {/* Item 2 */}
              <div className="relative space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#900C27] absolute -left-[21px] top-1" />
                <h4 className="text-xs font-bold text-[#1B1B24]">Costume Fitting</h4>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Collect your finished ensemble from the costume wing.
                </p>
                <span className="text-[10px] text-stone-400 font-medium block">Due: 20 Jul 2025</span>
              </div>

              {/* Item 3 */}
              <div className="relative space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#900C27] absolute -left-[21px] top-1" />
                <h4 className="text-xs font-bold text-[#1B1B24]">Final Rehearsal</h4>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Mandatory stage walk-through and lighting check.
                </p>
                <span className="text-[10px] text-stone-400 font-medium block">3rd Aug • 2:00 PM</span>
              </div>

            </div>

            <div className="pt-2 border-t border-stone-100 text-center">
              <button className="text-xs font-bold text-[#900C27] hover:underline">
                View All Updates
              </button>
            </div>
          </div>

          {/* MASTERCLASS SERIES PASS BANNER CARD (Solid Maroon Red Background) */}
          <div className="bg-gradient-to-br from-[#800020] via-[#8B1D2C] to-[#600018] rounded-2xl p-6 text-white space-y-3 shadow-md relative overflow-hidden">
            <span className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-rose-100">
              EARLY BIRD SPECIAL
            </span>

            <h3 className="text-lg font-bold text-white leading-tight">
              Masterclass Series Pass
            </h3>

            <p className="text-xs text-rose-100 font-normal leading-relaxed">
              Get 25% off when you book 3 or more workshops this month.
            </p>

            <div className="pt-2">
              <button className="bg-white hover:bg-stone-100 text-[#800020] px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer">
                Claim Offer
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
