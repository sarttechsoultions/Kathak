"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Share2 } from "lucide-react";

interface HeroSectionProps {
  videoSrc?: string;
}

export default function HeroSection({ videoSrc = "/herobg.mp4" }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section id="home" className="relative w-full min-h-[680px] lg:min-h-[740px] h-[calc(100vh-90px)] max-h-[820px] flex items-center overflow-hidden bg-black text-white">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-90"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark Vignette & Gradient Overlays for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 z-10" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 py-12 flex flex-col justify-center h-full">
        
        <div className="max-w-2xl space-y-6">
          {/* Subheader Badge Tagline */}
          <div className="inline-block">
          <span className="font-poppins text-sm md:text-lg lg:text-[24px] font-bold uppercase tracking-[0.2em] lg:tracking-[8px] leading-[20px] text-[#fffff]">
  Jaipur Gharana Tradition
</span>
          </div>

          {/* Main Headline in Playfair Display */}
          <h1 className="font-playfair font-medium text-[42px] md:text-[64px] xl:text-[96px] leading-[1.08] xl:leading-[104px] tracking-normal">
  <span className="text-white">
    Step Into The
  </span>
  <br />
  <span className="whitespace-nowrap text-[#F6D099]">
    Rhythm of Kathak
  </span>
</h1>

          {/* Description Subtitle in Playfair Display */}
          <p className="font-playfair text-base sm:text-lg lg:text-xl text-stone-200 font-normal leading-relaxed max-w-xl opacity-95">
            Discover the grace, discipline and storytelling that make Kathak a timeless classical art.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* Primary Action Button */}
            <a
              href="#one-to-one"
              className="bg-[#D9383A] hover:bg-[#B91C1C] text-white px-7 py-3.5 rounded-full font-playfair font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-red-900/40 flex items-center gap-2 group cursor-pointer"
            >
              <span>One-to-One</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary Action Button */}
            <a
              href="#inquire"
              className="border border-[#F6D099] hover:border-white bg-black/30 hover:bg-white/10 text-white px-7 py-3.5 rounded-full font-playfair font-medium text-sm sm:text-base transition-all backdrop-blur-sm cursor-pointer"
            >
              Inquire Now
            </a>
          </div>
        </div>

      </div>

      {/* Floating Carousel Arrows */}
      <button
        aria-label="Previous slide"
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/30 bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        aria-label="Next slide"
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/30 bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Floating Action Controls */}
      {/* Bottom Left Floating Phone Button */}
      <div className="absolute bottom-6 left-6 lg:left-12 z-30">
        <a
          href="tel:+919876543210"
          aria-label="Call Us"
          className="w-11 h-11 rounded-full bg-black/60 hover:bg-[#D9383A] border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg p-2.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/phone.png" alt="Phone" className="w-full h-full object-contain" />
        </a>
      </div>

      {/* Bottom Right Actions */}
      <div className="absolute bottom-6 right-6 lg:right-12 z-30 flex items-center gap-3">
        {/* Watch Intro Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 bg-black/50 hover:bg-black/80 border border-white/20 px-4 py-2 rounded-full text-xs font-playfair font-medium text-white backdrop-blur-md transition-all cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-[#D9383A] flex items-center justify-center">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
          <span>Watch Intro</span>
        </button>

        {/* WhatsApp Icon Button */}
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-md p-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/whatsapp.png" alt="WhatsApp" className="w-full h-full object-contain" />
        </a>

        {/* Share Button */}
        <button
          aria-label="Share page"
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-md"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
