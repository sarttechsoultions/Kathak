"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function GurukulBanner() {
  return (
    <section id="gurukul" className="relative w-full bg-[#153325] text-white my-12 sm:my-16 lg:my-20 overflow-hidden shadow-xl">
      <div className="w-full">

        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0">


          {/* Left Image Section: gurukul.png */}
          <div className="lg:col-span-3 self-stretch">
            <img
              src="/gurukul.png"
              alt="Private Gurukul Experience"
              className="w-full h-full object-contain object-left"
            />
          </div>
          {/* Center Column: Text Content */}
          <div className="lg:col-span-4 px-8 lg:px-10 space-y-3 py-6 lg:py-8 border-r border-dashed border-[#D4AF37]/40">
            <h3 className="font-playfair font-medium text-2xl sm:text-3xl lg:text-[32px] leading-[48px] tracking-[1px] text-[#D9BE7A]">
              Private Gurukul Experience
            </h3>

            <h4 className="font-playfair font-normal text-2xl leading-[48px] tracking-[1px] text-white">
              One-to-One Mentorship
            </h4>

            <p className="font-inter text-white text-base leading-[22px] tracking-[1px] font-normal max-w-md">
              Experience personalized training designed around your unique goals and Experience personalized training designed around your unique goals.
            </p>
          </div>

          {/* Right Column: 4 Circular Feature Badges + Book Button */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start gap-6 px-20">

            {/* 4 Circular Feature Icons (No Hover Effects, using exact PNG icons) */}
            <div className="flex items-start justify-center gap-6">

              {/* Badge 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[62px] h-[62px] rounded-full border border-[#D4AF37] flex items-center justify-center">
                  <img
                    src="/icons/Personalized.png"
                    alt="Personalized Learning Plan"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="mt-2 font-poppins text-[12px] leading-[15px] text-center text-white">
                  Personalized <br /> Learning Plan
                </span>
              </div>

              {/* Badge 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[62px] h-[62px] rounded-full border border-[#D4AF37] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Flexible.png" alt="Flexible Schedule" className="w-12 h-12 object-contain" />
                </div>
                <span className="mt-2 font-poppins text-[12px] leading-[15px] text-center text-white">
                  Flexible <br /> Schedule
                </span>
              </div>

              {/* Badge 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[62px] h-[62px] rounded-full border border-[#D4AF37] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Faster.png" alt="Faster Progress" className="w-10 h-10 object-contain" />
                </div>
                <span className="mt-2 font-poppins text-[12px] leading-[15px] text-center text-white">
                  Faster <br /> Progress
                </span>
              </div>

              {/* Badge 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-[62px] h-[62px] rounded-full border border-[#D4AF37] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/Performance.png" alt="Performance Guidance" className="w-10 h-10 object-contain" />
                </div>
                <span className="mt-2 font-poppins text-[12px] leading-[15px] text-center text-white">
                  Performance <br /> Guidance
                </span>
              </div>

            </div>

            {/* CTA Button */}
            <div className="w-full flex justify-start mt-3">
              <a
                href="#book-personal"
                className="inline-flex h-[44px] w-[261px] items-center justify-center gap-2 rounded-full bg-[#C10F3A] px-8 py-3 font-playfair text-sm font-semibold text-white transition-colors hover:bg-[#A01830]"
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
