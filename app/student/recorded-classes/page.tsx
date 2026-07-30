"use client";

import React, { useState } from "react";
import { Play, FileText, Download, Clock, ChevronDown } from "lucide-react";

const coursesList = [
  {
    id: 1,
    title: "Footwork Basics",
    description: "Master the fundamental 'Adavus' and rhythmic steps that form the...",
    level: "BEGINNER",
    topic: "Kathak",
    timeAgo: "2 days ago",
    duration: "25:00",
    image: "/gurukul-dancer.jpg",
    actionLabel: "Download PDF",
  },
  {
    id: 2,
    title: "Mudras: Hand Language",
    description: "Learn the 28 single-hand gestures (Asamyuta Hastas) and their...",
    level: "FOUNDATION",
    topic: "Kathak",
    timeAgo: "1 week ago",
    duration: "18:45",
    image: "/Ananya.png",
    actionLabel: "Download PDF",
  },
  {
    id: 3,
    title: "Rhythm & Taal Patterns",
    description: "Exploration of Adi Tala and complex jatis in varied speeds (Laya) for...",
    level: "INTERMEDIATE",
    topic: "Theory",
    timeAgo: "5 days ago",
    duration: "42:15",
    image: "/classesbg.png",
    actionLabel: "Resources",
  },
  {
    id: 4,
    title: "Abhinaya: Art of Expression",
    description: "Translating poetry into movement through the nine emotions...",
    level: "ADVANCED",
    topic: "Kathak",
    timeAgo: "3 weeks ago",
    duration: "35:30",
    image: "/Grace1.png",
    actionLabel: "Script Guide",
  },
  {
    id: 5,
    title: "Grooming & Costume",
    description: "A step-by-step guide to Bharatanatyam makeup and proper...",
    level: "TUTORIAL",
    topic: "Costume & Makeup",
    timeAgo: "1 month ago",
    duration: "12:00",
    image: "/Grace2.png",
    actionLabel: "Checklist",
  },
  {
    id: 6,
    title: "The Daily Warm-up",
    description: "Essential stretches and core strengthening exercises specifically...",
    level: "DAILY",
    topic: "Warm-ups",
    timeAgo: "2 weeks ago",
    duration: "15:50",
    image: "/Grace3.png",
    actionLabel: "Exercise Guide",
  },
];

export default function StudentRecordedClassesPage() {
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const skillLevels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
  const danceTopics = [
    "All Topics",
    "Bharatanatyam",
    "Kathak",
    "Contemporary",
    "Theory",
    "Warm-ups",
    "Folk",
    "Costume & Makeup",
  ];

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* PAGE HEADER */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-bold text-[#1B1B24] tracking-tight">
          Advance Your Craft
        </h1>
        <p className="text-sm font-normal text-[#464555] max-w-3xl leading-relaxed">
          Access our comprehensive archive of dance tutorials. Master every move at your own pace from our curated library of classical and contemporary styles.
        </p>
      </div>

      {/* FILTERS SECTION */}
      <div className="space-y-4">
        
        {/* SKILL LEVEL FILTERS */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block">
            SKILL LEVEL
          </span>
          <div className="flex items-center gap-2.5 flex-wrap">
            {skillLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? "bg-[#900C27] text-white shadow-sm"
                    : "bg-white border border-stone-200 text-stone-700 hover:border-stone-300"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* DANCE TOPICS FILTERS */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block">
            DANCE TOPICS
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {danceTopics.map((tpc) => (
              <button
                key={tpc}
                onClick={() => setSelectedTopic(tpc)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedTopic === tpc
                    ? "bg-[#900C27] text-white font-semibold"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
                }`}
              >
                {tpc}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3x2 CARD GRID OF TUTORIALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            {/* Card Thumbnail */}
            <div className="h-44 bg-stone-900 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/classesbg.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Video Duration Badge (Bottom Right) */}
              <span className="absolute bottom-2.5 right-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                {item.duration}
              </span>
            </div>

            {/* Card Content Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Level & Time Ago Badges */}
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-[#FDF2F4] text-[#900C27] px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider">
                    {item.level}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {item.timeAgo}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1B1B24] group-hover:text-[#900C27] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                <button className="flex-1 bg-[#900C27] hover:bg-[#780A20] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch</span>
                </button>

                <button className="flex-1 border border-stone-200 hover:border-stone-300 text-stone-700 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white">
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>{item.actionLabel}</span>
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* BOTTOM LOAD MORE BUTTON */}
      <div className="flex justify-center pt-4">
        <button className="border-2 border-[#900C27] text-[#900C27] hover:bg-rose-50 px-8 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer">
          <span>Load More Classes</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
