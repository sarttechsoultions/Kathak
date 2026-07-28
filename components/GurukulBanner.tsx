"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function GurukulBanner() {
  return (
    <section id="gurukul" className="relative w-full bg-[#153325] text-white mt-12 sm:mt-16 lg:mt-20 mb-0 overflow-hidden shadow-xl min-h-[290px]">
      
      {/* Left Image Section: On Desktop absolutely anchored to left edge; On Mobile compact top image */}
      <div className="lg:absolute lg:top-0 lg:left-0 lg:bottom-0 lg:w-[32%] xl:w-[28%] w-full h-[220px] sm:h-[280px] lg:h-full flex items-center justify-center overflow-hidden z-0 bg-[#153325]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gurukul.png"
          alt="Private Gurukul Experience"
          className="w-full h-full object-contain object-center lg:object-cover lg:object-left"
        />
      </div>

      {/* Main Content Grid Container */}
      <div className="relative w-full max-w-[1536px] mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0">

          {/* Spacer Column reserved for Left Image on Desktop */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:min-h-[290px]" />

          {/* Center Column: Text Content */}
          <div className="lg:col-span-4 px-6 sm:px-8 space-y-3 py-6 lg:py-8 border-b lg:border-b-0 lg:border-r border-dashed border-[#D4AF37]/40 flex flex-col justify-center text-center lg:text-left bg-[#153325]/90 lg:bg-transparent">
            <h3 className="font-playfair font-medium text-2xl sm:text-3xl lg:text-[32px] leading-tight sm:leading-[48px] tracking-[1px] text-[#D9BE7A]">
              Private Gurukul Experience
            </h3>

            <h4 className="font-playfair font-normal text-xl sm:text-2xl leading-snug sm:leading-[48px] tracking-[1px] text-white">
              One-to-One Mentorship
            </h4>

            <p className="font-inter text-white text-sm sm:text-base leading-relaxed sm:leading-[22px] tracking-[1px] font-normal max-w-md mx-auto lg:mx-0">
              Experience personalized training designed around your unique goals and Experience personalized training designed around your unique goals.
            </p>
          </div>

          {/* Right Column: 4 Circular Feature Badges + Book Button */}
          <div className="lg:col-span-4 xl:col-span-5 flex flex-col justify-center items-center lg:items-start gap-6 px-6 sm:px-10 py-6 lg:py-8 bg-[#153325]">

            {/* 4 Circular Feature Icons: 2x2 Grid on Mobile, 4-in-a-row on Tablet/Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-md mx-auto lg:max-w-none">

              {/* Badge 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full border border-[#D4AF37] flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/Personalized.png"
                    alt="Personalized Learning Plan"
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                </div>
                <span className="mt-2 font-poppins text-[11px] sm:text-[12px] leading-[15px] text-center text-white">
                  Personalized <br /> Learning Plan
                </span>
              </div>

              {/* Badge 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full border border-[#D4AF37] flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Flexible.png" alt="Flexible Schedule" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                </div>
                <span className="mt-2 font-poppins text-[11px] sm:text-[12px] leading-[15px] text-center text-white">
                  Flexible <br /> Schedule
                </span>
              </div>

              {/* Badge 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full border border-[#D4AF37] flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Faster.png" alt="Faster Progress" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
                </div>
                <span className="mt-2 font-poppins text-[11px] sm:text-[12px] leading-[15px] text-center text-white">
                  Faster <br /> Progress
                </span>
              </div>

              {/* Badge 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full border border-[#D4AF37] flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Performance.png" alt="Performance Guidance" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
                </div>
                <span className="mt-2 font-poppins text-[11px] sm:text-[12px] leading-[15px] text-center text-white">
                  Performance <br /> Guidance
                </span>
              </div>

            </div>

            {/* CTA Button */}
            <div className="w-full flex justify-center lg:justify-start mt-2 pb-4 lg:pb-0">
              <a
                href="#book-personal"
                className="inline-flex h-[44px] w-full max-w-[280px] sm:w-[261px] items-center justify-center gap-2 rounded-full bg-[#C10F3A] px-6 sm:px-8 py-3 font-playfair text-sm font-semibold text-white transition-colors hover:bg-[#A01830] shadow-md"
              >
                <span>Book Your Personal Class</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
