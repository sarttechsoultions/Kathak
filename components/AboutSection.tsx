"use client";

import React from "react";
import { ArrowRight, Trophy, Users, Globe, Award } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-white py-12 sm:py-20 lg:py-28 overflow-hidden text-stone-900">
      {/* Right Background Image (image 14.png from Figma) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-40 sm:opacity-50 lg:opacity-65 max-w-[280px] sm:max-w-[380px] lg:max-w-[460px] translate-x-4 sm:translate-x-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about/image 14.png"
          alt="Mandala Background Pattern"
          className="spin-slow w-full h-auto object-contain select-none"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Image Collage with Floating Badge on Right Edge */}
          <Reveal animation="left" className="lg:col-span-6 relative px-2 sm:px-6 lg:pr-8 lg:pl-0">
            <div className="grid grid-cols-12 gap-3 sm:gap-4 relative max-w-[620px] mx-auto lg:max-w-none">

              {/* Left Tall Portrait Image (Rectangle 40.png) */}
              <div className="col-span-6">
                <div className="relative h-[380px] sm:h-[460px] lg:h-[500px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-100 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about/Rectangle 40.png"
                    alt="Kathak Dancer Portrait"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Right Stacked 2 Images (Rectangle 41.png & Rectangle 42.png) */}
              <div className="col-span-6 flex flex-col gap-3 sm:gap-4 justify-between">
                {/* Top Feet / Ghungroo Image */}
                <div className="relative h-[184px] sm:h-[222px] lg:h-[242px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-stone-100 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about/Rectangle 41.png"
                    alt="Kathak Ghungroo Feet"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Bottom Student Mudra Image */}
                <div className="relative h-[184px] sm:h-[222px] lg:h-[242px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-stone-100 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/about/Rectangle 42.png"
                    alt="Kathak Student Performing Mudra"
                    className="w-full h-full object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Floating Circular Badge on Right Edge Center with Gold Ring */}
              <div className="absolute top-[48%] sm:top-[52%] right-[-6px] sm:-right-7 lg:-right-9 -translate-y-1/2 z-30">
                <div className="float-y">
                  <div className="w-22 h-22 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-[#0A4A40] border-[3px] sm:border-[3.5px] border-[#D4AF37] shadow-2xl flex flex-col items-center justify-center text-center p-1.5 sm:p-2 transform hover:scale-105 transition-transform duration-300">
                  <span className="font-playfair font-bold text-xl sm:text-3xl lg:text-4xl text-white leading-none tracking-tight">
                    10+
                  </span>
                  <span className="font-playfair text-[9.5px] sm:text-xs lg:text-sm text-stone-100 leading-tight font-medium mt-0.5 sm:mt-1">
                    Years of <br /> Excellence
                  </span>
                </div>
                </div>
              </div>

            </div>
          </Reveal>

          {/* Right Column: About Content */}
          <Reveal animation="right" delay={120} className="lg:col-span-6 space-y-6 lg:pl-4">

            {/* Tagline */}
            <div>
              <span className="font-poppins text-2xl font-bold tracking-[8px] text-[#9E0C25] uppercase leading-5">
                ABOUT US
              </span>

              {/* Main Headline */}
              <h2 className="font-playfair font-medium text-3xl sm:text-4xl lg:text-[40px] leading-[48px] tracking-normal text-black mt-2">
                Nurturing Tradition. <br />
                Inspiring Generation.
              </h2>
            </div>

            {/* Description Paragraph */}
        <p className="font-inter text-black text-sm sm:text-base lg:text-lg leading-6 tracking-[1px] font-normal">
  Kathak by Harshita is a dedicated platform to preserve and promote the rich heritage of Jaipur Gharana. We blend tradition with modern teaching to create confident, graceful and expressive dancers.
</p>

            {/* 4 Feature Cards Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 pt-2">

  {/* Feature 1 */}
  <div className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-stone-50 transition-colors duration-300">
    <img src="/icons/trophy.png" alt="Jaipur Gharana Icon" className="w-6 h-6 object-contain" />
    <div>
      <h3 className="font-inter font-normal text-lg leading-6 tracking-[1px] text-black">
        Jaipur Gharana Specialization
      </h3>
    </div>
  </div>

  {/* Feature 2 */}
  <div className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-stone-50 transition-colors duration-300">
    <img src="/icons/person.png" alt="Personalized Attention Icon" className="w-6 h-6 object-contain" />
    <div>
      <h3 className="font-inter font-normal text-lg leading-6 tracking-[1px] text-black">
        Personalized Attention
      </h3>
    </div>
  </div>

  {/* Feature 3 */}
  <div className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-stone-50 transition-colors duration-300">
    <img src="/icons/Vector.png" alt="Global Online Classes Icon" className="w-6 h-6 object-contain" />
    <div>
      <h3 className="font-inter font-normal text-lg leading-6 tracking-[1px] text-black">
        Global Online Classes
      </h3>
    </div>
  </div>

  {/* Feature 4 */}
  <div className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-stone-50 transition-colors duration-300">
    <img src="/icons/stage.png" alt="Stage & Performance Opportunities Icon" className="w-6 h-6 object-contain" />
    <div>
      <h3 className="font-inter font-normal text-lg leading-6 tracking-[1px] text-black">
        Stage & Performance Opportunities
      </h3>
    </div>
  </div>

</div>

            {/* Bottom Call to Action Link */}
            <div className="pt-2">
              <a
                href="/about"
                className="inline-flex items-center gap-2 font-playfair font-semibold text-[#D9383A] hover:text-[#B91C1C] text-sm sm:text-base transition-colors group cursor-pointer"
              >
                <span>Know More About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </Reveal>

        </div>
      </div>
    </section>
  );
}
