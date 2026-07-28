"use client";

import React, { useState } from "react";

interface CourseCardData {
  id: string;
  category: "basic" | "intermediate" | "premium";
  categoryLabel: "BASIC" | "INTERMEDIATE" | "PREMIUM";
  title: string;
  groupPrice: string;
  groupClassesCount: string;
  oneToOnePrice: string;
  oneToOneClassesCount: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

const coursesData: CourseCardData[] = [
  // Basic Level Courses
  {
    id: "basic-1",
    category: "basic",
    categoryLabel: "BASIC",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#76D7C4]",
    badgeText: "text-stone-900",
    borderColor: "border-[#76D7C4]",
  },
  {
    id: "basic-2",
    category: "basic",
    categoryLabel: "BASIC",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#76D7C4]",
    badgeText: "text-stone-900",
    borderColor: "border-[#76D7C4]",
  },
  {
    id: "basic-3",
    category: "basic",
    categoryLabel: "BASIC",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#76D7C4]",
    badgeText: "text-stone-900",
    borderColor: "border-[#76D7C4]",
  },

  // Intermediate Level Courses
  {
    id: "inter-1",
    category: "intermediate",
    categoryLabel: "INTERMEDIATE",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#E5B869]",
    badgeText: "text-stone-900",
    borderColor: "border-[#E5B869]",
  },
  {
    id: "inter-2",
    category: "intermediate",
    categoryLabel: "INTERMEDIATE",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#E5B869]",
    badgeText: "text-stone-900",
    borderColor: "border-[#E5B869]",
  },
  {
    id: "inter-3",
    category: "intermediate",
    categoryLabel: "INTERMEDIATE",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#E5B869]",
    badgeText: "text-stone-900",
    borderColor: "border-[#E5B869]",
  },

  // Premium Level Courses
  {
    id: "prem-1",
    category: "premium",
    categoryLabel: "PREMIUM",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#C81E3D]",
    badgeText: "text-white",
    borderColor: "border-[#C81E3D]",
  },
  {
    id: "prem-2",
    category: "premium",
    categoryLabel: "PREMIUM",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#C81E3D]",
    badgeText: "text-white",
    borderColor: "border-[#C81E3D]",
  },
  {
    id: "prem-3",
    category: "premium",
    categoryLabel: "PREMIUM",
    title: "1. Kathak classes fee structure (India) Beginners",
    groupPrice: "$ 2200 / month",
    groupClassesCount: "10 classes per month",
    oneToOnePrice: "$ 400 per class",
    oneToOneClassesCount: "Minimum 4 classes per month",
    badgeBg: "bg-[#C81E3D]",
    badgeText: "text-white",
    borderColor: "border-[#C81E3D]",
  },
];

export default function CoursesSection() {
  const [activeFilter, setActiveFilter] = useState<"all" | "basic" | "intermediate" | "premium">("all");

  const filteredCourses = activeFilter === "all"
    ? coursesData
    : coursesData.filter((c) => c.category === activeFilter);

  return (
    <section id="courses" className="relative bg-[#ffffff]  sm:py-20 lg:py-28 overflow-hidden text-stone-900 ">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
      <span className="font-poppins text-2xl font-bold tracking-[8px] text-[#9E0C25] uppercase leading-5">
  courses
</span>

      <h2 className="font-playfair font-medium text-3xl sm:text-4xl lg:text-[40px] leading-[48px] tracking-normal text-black text-center">
  Learn, Perform, Evolve.
</h2>

      <p className="font-inter font-normal text-sm sm:text-base lg:text-lg leading-6 tracking-[1px] text-black text-center">
  Courses designed for every age, skill level and aspiration.
</p>

          {/* Level Filter Tabs */}
          <div className="flex items-center justify-center gap-6 pt-6">
  <button className="px-8 py-3 rounded-full text-xs  font-sans font-bold bg-[#1F4A3A] text-[#ffffff] shadow-md cursor-pointer">
    Basic
  </button>
  <button className="px-8 py-3 rounded-full text-xs font-sans font-bold bg-[#E5B869] text-[#ffffff] shadow-md cursor-pointer">
    Intermediate
  </button>
  <button className="px-8 py-3 rounded-full text-xs font-sans font-bold bg-[#C81E3D] text-white shadow-md cursor-pointer">
    Premium
  </button>
</div>
        </div>

        {/* 3x3 Grid of Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`relative rounded-3xl border-2 ${course.borderColor} bg-gradient-to-br from-white to-[#f6e6d3] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[330px]`}
            >
              {/* Card Top Left Level Badge */}
              <div className="absolute top-0 left-0 z-20">
                <span className={`inline-block px-7 py-2.5 rounded-br-2xl rounded-tl-3xl text-xs font-sans font-extrabold tracking-wider ${course.badgeBg} ${course.badgeText} shadow-xs`}>
                  {course.categoryLabel}
                </span>
              </div>

              {/* Card Main Body Content */}
         <div className="pt-14 px-6 sm:px-7 pb-6 flex-1 flex flex-col justify-between z-10 relative">
  
  {/* Course Title */}
  <h3 className="font-inter font-medium text-sm leading-5 text-black mb-4 max-w-[72%]">
    {course.title}
  </h3>

  {/* Fee Structure */}
  <div className="space-y-4 font-inter text-sm leading-5 text-black max-w-[68%]">
    
    {/* Group Class Info */}
    <div className="space-y-1">
      <p className="font-medium text-black">
        Group class &nbsp;(Online)
      </p>
      <ul className="space-y-1 pl-3 font-medium text-black list-disc">
        <li>{course.groupPrice}</li>
        <li>{course.groupClassesCount}</li>
      </ul>
    </div>

    {/* Personal / One to One Info */}
    <div className="space-y-1 pt-1">
      <p className="font-medium text-black">
        Personal (One to One) Classes
      </p>
      <ul className="space-y-1 pl-3 font-medium text-black list-disc">
        <li>{course.oneToOnePrice}</li>
        <li>{course.oneToOneClassesCount}</li>
      </ul>
    </div>

  </div>

  {/* Action Buttons at Bottom */}
  <div className="flex items-center gap-2 pt-4">
    <button className="bg-[#C81E3D] hover:bg-[#A01830] text-white px-3 py-1.5 rounded-full font-inter font-medium text-sm transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95">
      Enquire Now
    </button>
    <button className="bg-[#C81E3D] hover:bg-[#A01830] text-white px-3 py-1.5 rounded-full font-inter font-medium text-sm transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95">
      Enroll now
    </button>
  </div>

</div>

              {/* Right Side Background Image (classesbg.png from public) */}
              <div className="absolute right-0 bottom-0 top-0 w-[55%] pointer-events-none z-0 flex items-end justify-end overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/classesbg.png"
                  alt="Kathak Dancer and Mandala Motif"
                  className="h-[95%] w-auto object-contain object-right-bottom transition-transform duration-500 hover:scale-105"
                />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
