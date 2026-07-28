"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: "grace-1",
    src: "/Grace1.png",
    alt: "International Cultural Harmony - Moments of Grace",
  },
  {
    id: "grace-2",
    src: "/Grace2.png",
    alt: "Kathak Stage Performance - Moments of Grace",
  },
  {
    id: "grace-3",
    src: "/Grace3.png",
    alt: "Duet Classical Performance - Moments of Grace",
  },
  {
    id: "grace-4",
    src: "/Grace4.png",
    alt: "Award Ceremony - Moments of Grace",
  },
  {
    id: "grace-5",
    src: "/Grace1.png",
    alt: "Kathak Performance - Moments of Grace",
  },
  {
    id: "grace-6",
    src: "/Grace2.png",
    alt: "Stage Event - Moments of Grace",
  },
];

export default function MomentsOfGrace() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHoveredOrTouched, setIsHoveredOrTouched] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Auto-scroll loop every 2.5 seconds
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (isHoveredOrTouched || isMouseDown) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScrollLeft - 15) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isHoveredOrTouched, isMouseDown]);

  // Mouse Drag Scroll Handlers for Desktop Users
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsMouseDown(true);
    setIsHoveredOrTouched(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsHoveredOrTouched(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsHoveredOrTouched(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section id="gallery" className="relative w-full bg-white py-14 sm:py-16 lg:py-20 text-stone-900 overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 sm:mb-10 lg:mb-12">
          {/* Header Title & Subtitle */}
          <div className="space-y-1">
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1F4A3A] leading-tight tracking-tight">
              Moments of Grace
            </h2>
            <p className="font-sans text-[#6B7280] text-sm sm:text-base font-normal">
              Glimpses from our journey
            </p>
          </div>

          {/* Explore Gallery CTA Button */}
          <a
            href="#gallery"
            className="bg-[#C10F3A] hover:bg-[#A01830] text-white px-6 py-2.5 rounded-full font-playfair font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Explore Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Scrollable Image Cards Row: Mouse Drag + Finger Slide + Auto Scroll (Single Set) */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveredOrTouched(true)}
          onTouchStart={() => setIsHoveredOrTouched(true)}
          onTouchEnd={() => setTimeout(() => setIsHoveredOrTouched(false), 2000)}
          className={`flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory select-none scrollbar-none ${
            isMouseDown ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="relative w-[82%] sm:w-[calc((100%-1.5rem)/2.1)] md:w-[calc((100%-2.5rem)/3.1)] lg:w-[calc((100%-3.75rem)/4.1)] min-w-[82%] sm:min-w-[calc((100%-1.5rem)/2.1)] md:min-w-[calc((100%-2.5rem)/3.1)] lg:min-w-[calc((100%-3.75rem)/4.1)] h-[280px] sm:h-[320px] lg:h-[340px] rounded-2xl overflow-hidden shadow-md group border border-stone-200/60 bg-stone-100 shrink-0 snap-start transition-all duration-300 pointer-events-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              />
              {/* Subtle hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
