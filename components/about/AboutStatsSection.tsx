"use client";

import CountUpValue from "@/components/CountUpValue";
import Reveal from "@/components/Reveal";

const stats = [
  { number: "2500+", label: "Students Trained" },
  { number: "10+", label: "Years Experience" },
  { number: "50+", label: "Workshops" },
  { number: "120+", label: "Performances" },
];

export default function AboutStatsSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-[64px]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} animation="scale">
              <div className="text-center px-1 transition-transform duration-300 hover:-translate-y-1">
                <p className="font-playfair font-bold text-[28px] sm:text-4xl lg:text-[48px] leading-none text-[#153325]">
                  <CountUpValue display={stat.number} />
                </p>
                <p className="font-sans text-[11px] sm:text-sm lg:text-base text-[#153325]/80 tracking-[0.6px] sm:tracking-[0.8px] uppercase mt-2 leading-snug sm:leading-6">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
