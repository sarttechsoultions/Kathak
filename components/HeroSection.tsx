"use client";

import React from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  videoSrc?: string;
}

export default function HeroSection({ videoSrc = "/herobg.mp4" }: HeroSectionProps) {
  return (
    <section id="home" className="relative w-full min-h-[680px] lg:min-h-[740px] h-[calc(100vh-90px)] max-h-[820px] flex items-center overflow-hidden bg-black text-white">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-kenburns w-full h-full object-cover object-center scale-105 filter brightness-90"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark Vignette & Gradient Overlays for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 z-10" />
      </div>

      {/* Main Hero Container: Subtle upward shift on Mobile (-translate-y-5) for light clearance */}
      <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12 flex flex-col justify-center h-full">
        
        <div className="max-w-2xl space-y-5 sm:space-y-6 mx-auto sm:mx-0 text-center sm:text-left flex flex-col items-center sm:items-start -translate-y-5 sm:translate-y-0">
          {/* Subheader Badge Tagline */}
          <div className="hero-enter inline-block text-center sm:text-left">
            <span className="font-poppins text-xs sm:text-sm md:text-lg lg:text-[24px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] lg:tracking-[8px] leading-[20px] text-white">
              Jaipur Gharana Tradition
            </span>
          </div>

          {/* Main Headline in Playfair Display */}
          <h1 className="hero-enter hero-enter-d1 font-playfair font-medium text-[36px] sm:text-[42px] md:text-[64px] xl:text-[96px] leading-[1.1] xl:leading-[104px] tracking-normal text-center sm:text-left">
            <span className="text-white">
              Step Into The
            </span>
            <br />
            <span className="hero-gold-text sm:whitespace-nowrap">
              Rhythm of Kathak
            </span>
          </h1>

          {/* Description Subtitle in Playfair Display */}
          <p className="hero-enter hero-enter-d2 font-playfair text-sm sm:text-base lg:text-xl text-stone-200 font-normal leading-relaxed max-w-xl opacity-95 text-center sm:text-left mx-auto sm:mx-0">
            Discover the grace, discipline and storytelling that make Kathak a timeless classical art.
          </p>

          {/* CTA Action Buttons */}
          <div className="hero-enter hero-enter-d3 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4 mx-auto sm:mx-0">
            {/* Primary Action Button */}
            <a
              href="#one-to-one"
              className="bg-[#D9383A] hover:bg-[#B91C1C] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-playfair font-semibold text-xs sm:text-base transition-all duration-300 shadow-lg shadow-red-900/40 flex items-center gap-2 group cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>One-to-One</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary Action Button */}
            <a
              href="#inquire"
              className="border border-[#F6D099] hover:border-white bg-black/30 hover:bg-white/10 text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-playfair font-medium text-xs sm:text-base transition-all backdrop-blur-sm cursor-pointer hover:scale-105 active:scale-95"
            >
              Inquire Now
            </a>
          </div>
        </div>

      </div>

      {/* Floating Carousel Arrows (Adjusted height slightly DOWN to top-[46%] on mobile, 50% on desktop) */}
      <button
        aria-label="Previous slide"
        className="absolute top-[46%] sm:top-1/2 left-2 sm:left-4 lg:left-8 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/30 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <button
        aria-label="Next slide"
        className="absolute top-[46%] sm:top-1/2 right-2 sm:right-4 lg:right-8 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/30 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <div className="hidden sm:block absolute bottom-7 left-1/2 -translate-x-1/2 z-30">
        <a
          href="#about"
          aria-label="Scroll to about section"
          className="hero-enter hero-enter-d4 flex flex-col items-center gap-1 text-white/75 hover:text-white transition-colors"
        >
          <span className="font-sans text-[10px] tracking-[0.28em] uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>

    </section>
  );
}
