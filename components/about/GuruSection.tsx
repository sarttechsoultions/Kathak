"use client";

import Reveal from "@/components/Reveal";

export default function GuruSection() {
  return (
    <section className="bg-[#F4FAFD] py-12 sm:py-16 lg:py-[80px]">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal animation="scale">
          <div className="bg-[#C10F3A] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden p-5 sm:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="w-full lg:w-[447px] h-[240px] sm:h-[380px] lg:h-[500px] shrink-0">
              <div className="relative h-full w-full overflow-hidden rounded-lg group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about-page/guru-portrait.jpg"
                  alt="Guru Harshita"
                  className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="flex-1 text-white py-1 sm:py-2 lg:py-8 lg:pr-12 flex flex-col gap-2">
              <p className="font-sans text-xs sm:text-base tracking-[1.6px] uppercase text-[#D9BE7A] leading-6">
                The Visionary
              </p>
              <h2 className="font-playfair font-bold text-[28px] sm:text-4xl lg:text-[48px] leading-tight lg:leading-[56px] pb-3 sm:pb-4">
                Guru Harshita
              </h2>
              <blockquote className="border-l-4 border-[#E5E7EB] pl-4 sm:pl-7 font-sans text-[15px] sm:text-base leading-6 opacity-90">
                &ldquo;Kathak is my language. It is how I speak to the world, and how I honor my
                ancestors. My mission is to ensure every student finds their own voice through
                this rhythm.&rdquo;
              </blockquote>
              <p className="font-sans text-[15px] sm:text-base leading-6 pt-4 sm:pt-6">
                With over two decades of rigorous training and stage experience, Harshita has
                dedicated her life to the propagation of Jaipur Gharana. Her teaching methodology
                balances strict traditional discipline with contemporary pedagogical approaches,
                making the art accessible to students across the globe.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
