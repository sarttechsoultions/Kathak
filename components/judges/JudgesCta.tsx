"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";

const ASSET = "/judges-page";

export default function JudgesCta() {
  return (
    <section className="relative bg-white pb-16 sm:pb-20">
      <div className="w-full max-w-[1152px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal animation="scale">
          <div className="relative overflow-hidden bg-[#8B1D3B] rounded-2xl px-6 sm:px-8 py-8 flex flex-col lg:flex-row lg:items-center gap-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
            <span className="absolute left-0 top-0 size-[60px] overflow-clip pointer-events-none opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSET}/cta-deco.svg`} alt="" className="size-full object-contain" />
            </span>

            <div className="relative flex items-center gap-1 shrink-0">
              <span className="relative overflow-clip shrink-0" style={{ width: 56, height: 36 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icon-calendar.svg`} alt="" className="size-full object-contain" />
              </span>
              <div>
                <h3 className="font-playfair font-bold text-xl sm:text-2xl leading-8 text-white">
                  Looking for a Judge or Choreographer
                </h3>
                <p className="font-sans font-medium text-lg leading-7 text-white">
                  for Your Next Event?
                </p>
              </div>
            </div>

            <p className="relative lg:flex-1 lg:border-l lg:border-white/30 lg:pl-6 font-sans text-sm leading-5 text-white/90">
              Invite Harshita to bring expertise, authenticity and elegance to your stage.
            </p>

            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F9F4F0] text-[#8B1D3B] px-8 py-3 rounded-full shrink-0 shadow-sm transition-all hover:scale-105 active:scale-95 group"
            >
              <span className="font-sans font-bold text-base leading-6">Invite Harshita</span>
              <span className="relative overflow-clip shrink-0 transition-transform group-hover:translate-x-0.5" style={{ width: 14, height: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icon-arrow.svg`} alt="" className="size-full object-contain" />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
