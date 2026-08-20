"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

interface StudentCard {
  id: string;
  name: string;
  location: string;
  imageSrc: string;
}

const studentsData: StudentCard[] = [
  {
    id: "student-1",
    name: "Ananya Sharma",
    location: "Jaipur, India",
    imageSrc: "/Ananya.png",
  },
  {
    id: "student-2",
    name: "Meera Joshi",
    location: "Jaipur, India",
    imageSrc: "/Meera.png",
  },
  {
    id: "student-3",
    name: "Riya Patel",
    location: "Jaipur, India",
    imageSrc: "/Riya.png",
  },
  {
    id: "student-4",
    name: "Sunita Sharma",
    location: "Jaipur, India",
    imageSrc: "/Sunita.png",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative w-full bg-white py-14 sm:py-16 lg:py-20 text-stone-900 overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <Reveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-10 lg:mb-12">
          {/* Header Title & Subtitle */}
          <div className="space-y-1">
            <h2 className="font-playfair text-[40px] font-medium leading-[48px] tracking-[0px] text-[#1F4A3A]">
  What Our Student Say
</h2>
           <p className="font-inter text-[20px] font-medium leading-[20px] tracking-normal text-[#6B7280]">
  Real stories from our kathak family
</p>
          </div>

          {/* View All Testimonials CTA Button */}
          <a
            href="#testimonials"
            className="bg-[#C10F3A] hover:bg-[#A01830] text-white px-6 py-2.5 rounded-full font-playfair font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          >
            <span>View all Testimonials</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </Reveal>

        <Reveal delay={80}>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {studentsData.map((student) => (
            <div
              key={student.id}
              className="flex flex-col items-center group hover-lift w-[78%] min-w-[78%] sm:w-[calc(50%-12px)] sm:min-w-[calc(50%-12px)] lg:w-auto lg:min-w-0 shrink-0 snap-start"
            >
              <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[340px] rounded-2xl overflow-hidden shadow-md border border-stone-200/60 bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={student.imageSrc}
                  alt={student.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="mt-2 text-center">
                <h3 className="font-inter text-[12px] font-normal leading-[16px] text-black">
                  {student.name}
                </h3>
                <p className="font-inter text-[12px] font-normal leading-[16px] text-[#6B7280]">
                  {student.location}
                </p>
              </div>
            </div>
          ))}
        </div>
        </Reveal>

      </div>
    </section>
  );
}
