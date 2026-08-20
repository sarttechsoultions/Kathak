"use client";

import Reveal from "@/components/Reveal";

const pillars = [
  {
    number: "1",
    title: "Technical Precision",
    description:
      "Emphasis on intricate footwork (Tatkar) and complex rhythmic patterns (Layakari) executed with lightning speed and mathematical accuracy.",
  },
  {
    number: "2",
    title: "Spirituality",
    description:
      "Tracing roots back to temple dancers, the Jaipur style focuses heavily on ‘Bhakti’ and spiritual devotion through expressive storytelling (Abhinaya).",
  },
  {
    number: "3",
    title: "Stately Chakkars",
    description:
      "Renowned for powerful, rapid-fire pirouettes (Chakkars) that stop precisely on the beat, showcasing immense balance and control.",
  },
];

export default function JaipurGharanaSection() {
  return (
    <section className="relative bg-white py-14 sm:py-16 lg:py-[80px] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about-page/mandala.svg"
          alt=""
          className="spin-slow size-[140px] sm:size-[200px] object-contain select-none"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mx-auto text-center flex flex-col gap-3 sm:gap-4 mb-10 sm:mb-12 lg:mb-16">
          <h2 className="font-playfair font-bold text-[28px] sm:text-4xl lg:text-[48px] leading-tight lg:leading-[56px] text-[#C10F3A]">
            The Splendor of Jaipur Gharana
          </h2>
          <p className="font-sans text-[15px] sm:text-base text-black leading-6">
            Distinctive for its vigor, technical prowess, and spiritual depth, our lineage
            celebrates the &lsquo;Vira Rasa&rsquo;—the heroic sentiment of classical dance.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 pt-8">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.number} delay={index * 120} animation="scale">
              <article className="hover-lift relative backdrop-blur-[2px] bg-white/60 border border-[rgba(224,191,191,0.3)] rounded-lg p-6 sm:p-8 lg:p-[33px] text-center flex flex-col gap-2">
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 size-12 rounded-xl bg-[#C10F3A] shadow-lg flex items-center justify-center">
                  <span className="font-sans font-bold text-2xl text-white leading-6">
                    {pillar.number}
                  </span>
                </div>
                <h3 className="font-playfair font-semibold text-xl sm:text-2xl text-[#C10F3A] leading-8 pt-2">
                  {pillar.title}
                </h3>
                <p className="font-sans text-[15px] sm:text-base text-black leading-6">{pillar.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
