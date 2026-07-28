"use client";

import React from "react";

interface StatItem {
  number: string;
  label: string;
  iconSrc: string;
}

const statsData: StatItem[] = [
  {
    number: "2500+",
    label: "STUDENTS TRAINED",
    iconSrc: "/icons/students.png",
  },
  {
    number: "25+",
    label: "COUNTRIES REACHED",
    iconSrc: "/icons/countries.png",
  },
  {
    number: "10+",
    label: "YEARS EXPERIENCE",
    iconSrc: "/icons/years.png",
  },
  {
    number: "120+",
    label: "PERFORMANCES",
    iconSrc: "/icons/PERFORMANCES.png",
  },
  {
    number: "50+",
    label: "WORKSHOPS CONDUCTED",
    iconSrc: "/icons/WORKSHOPS.png",
  },
  {
    number: "30+",
    label: "AWARDS & RECOGNITIONS",
    iconSrc: "/icons/AWARDS.png",
  },
];

export default function StatsSection() {
  return (
    <section id="stats" className="relative w-full bg-white border-y border-[#E5E7EB] py-8 sm:py-10 my-0">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-10 divide-y sm:divide-y-0 lg:divide-x lg:divide-dashed lg:divide-[#D4AF37]/40">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center gap-3.5 px-2 text-center mx-auto ${
                idx !== 0 ? "pt-4 sm:pt-0 lg:pl-6" : ""
              }`}
            >
              {/* Icon - Centered alongside text */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stat.iconSrc}
                alt={stat.label}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0"
              />

              {/* Text Column - Centered Number and Label */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-sans font-bold text-2xl sm:text-[24px] text-[#1F4A3A] tracking-[1px] leading-[32px] text-center w-full">
                  {stat.number}
                </span>
                <span className="font-sans font-semibold text-[11px] sm:text-xs text-[#687280] tracking-[0.5px] leading-[15px] uppercase whitespace-nowrap text-center w-full">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
