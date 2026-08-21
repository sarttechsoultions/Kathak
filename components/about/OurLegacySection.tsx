"use client";

import Reveal from "@/components/Reveal";

export default function OurLegacySection() {
  return (
    <section id="legacy" className="relative bg-white pt-8 sm:pt-10 pb-16 sm:pb-20 overflow-visible">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-[50px]">
          <Reveal animation="left" className="relative isolate w-full lg:flex-1 mb-8 sm:mb-10 lg:mb-0">
            <div className="relative w-full h-[300px] sm:h-[460px] lg:h-[640px] overflow-hidden rounded group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about-page/legacy-studio.jpg"
                alt="Guru Harshita teaching Kathak students in the studio"
                className="h-full w-full object-cover object-[18%_center] transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute z-10 bottom-[-28px] sm:bottom-[-32px] right-1 sm:right-[-8px] lg:right-[-16px]">
              <div className="float-y">
                <div className="size-[120px] sm:size-[160px] lg:size-[192px] rounded-full bg-gradient-to-b from-[#09996F] to-[#033325] border-4 border-[#F4FAFD] p-4 sm:p-7 flex flex-col items-center justify-center text-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-300">
                  <span className="font-playfair font-bold text-[24px] sm:text-[32px] lg:text-[36px] text-white leading-none sm:leading-10">
                    10+
                  </span>
                  <span className="font-sans text-[9px] sm:text-[10px] lg:text-xs text-white tracking-[0.6px] uppercase leading-[13px] sm:leading-[15px] mt-1">
                    Years of Artistic
                    <br />
                    Excellence
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal animation="right" delay={120} className="w-full lg:flex-1 flex flex-col gap-3 sm:gap-4">
            <p className="font-sans font-bold text-sm sm:text-lg lg:text-[24px] leading-6 tracking-[1.2px] sm:tracking-[1.6px] text-[#C10F3A] uppercase">
              Our Legacy
            </p>
            <h2 className="font-playfair font-bold text-[28px] sm:text-[40px] lg:text-[48px] leading-tight lg:leading-[60px] text-black">
              Nurturing Tradition, Inspiring Generation
            </h2>
            <div className="flex flex-col gap-4 sm:gap-6 font-sans text-[15px] sm:text-[16px] leading-6 text-black">
              <p>
                Kathak by Harshita was founded with a singular vision: to create a space where
                the ancient art of Jaipur Gharana Kathak could flourish in the modern world while
                maintaining its uncompromising technical integrity.
              </p>
              <p>
                What started as a small group of passionate learners has evolved into a global
                community. We believe that Kathak is more than just a dance; it is a spiritual
                journey that balances the fire of rhythmic footwork with the grace of narrative
                expression.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex items-center gap-3 flex-1 rounded-lg p-2 -ml-2 hover:bg-stone-50 transition-colors duration-300">
                <span className="size-[22px] overflow-clip shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/about-page/icon-spark.svg" alt="" className="size-[22px]" />
                </span>
                <span className="font-sans text-[15px] sm:text-[16px] leading-6 text-[#570013]">
                  Authentic Jaipur Lineage
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 rounded-lg p-2 -ml-2 hover:bg-stone-50 transition-colors duration-300">
                <span className="w-6 h-3 overflow-clip shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/about-page/icon-people.svg" alt="" className="w-6 h-3" />
                </span>
                <span className="font-sans text-[15px] sm:text-[16px] leading-6 text-[#570013]">
                  Inclusive Learning Environment
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
