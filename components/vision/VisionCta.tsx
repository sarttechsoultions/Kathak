"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function VisionCta() {
  return (
    <section className="relative bg-[#FCFAF8] pb-16 sm:pb-20">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal animation="scale">
        <div className="relative overflow-clip bg-white border border-[#F3F4F6] rounded-2xl shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6 sm:p-8 lg:p-[41px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="absolute bottom-[-35px] right-[-64px] opacity-10 w-64 h-[140px] overflow-clip rounded-[50px] pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vision-goals/cta-pattern.png"
              alt=""
              className="size-full object-cover"
            />
          </div>

          <div className="relative flex items-center gap-6">
            <span className="size-20 rounded-full bg-[#D33737] overflow-clip shrink-0 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vision-goals/ghungroo.png"
                alt=""
                className="absolute h-[54%] left-0 top-[23%] w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-playfair font-normal text-xl sm:text-2xl leading-8 text-[#C10F3A]">
                Be a Part of Our Journey
              </h3>
              <p
                className={`${poppins.className} font-normal text-sm sm:text-base leading-6 text-[#4B5563] max-w-[520px]`}
              >
                Together, let&apos;s keep the rhythm of Kathak alive and create a legacy for
                generations to come.
              </p>
            </div>
          </div>

          <Link
            href="/courses"
            className="relative inline-flex items-center justify-center gap-2 bg-[#C10F3A] hover:bg-[#A01830] text-white px-8 py-3 rounded-full shrink-0 transition-all hover:scale-105 active:scale-95 group"
          >
            <span className={`${poppins.className} font-medium text-base leading-6`}>
              Join Our Classes
            </span>
            <span className="relative overflow-clip shrink-0 transition-transform group-hover:translate-x-0.5" style={{ width: 14, height: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vision-goals/icon-arrow.svg"
                alt=""
                width={14}
                height={12}
                className="size-full object-contain"
              />
            </span>
          </Link>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
