"use client";

import Reveal from "@/components/Reveal";
import CountUpValue from "@/components/CountUpValue";

const ASSET = "/judges-page";

const highlights = [
  "Over a decade of experience in choreography",
  "Specializes in thematic productions",
  "Known for intricate footwork patterns, graceful spins & expressive storytelling",
  "Creates for solo, duet, group & large-scale productions",
];

const uniques = [
  {
    icon: `${ASSET}/icon-essence.svg`,
    iconSize: { w: 40, h: 36 },
    title: "Traditional Essence",
    description: "Deep respect for the purity of Kathak.",
  },
  {
    icon: `${ASSET}/icon-storytelling.svg`,
    iconSize: { w: 43, h: 33 },
    title: "Innovative Storytelling",
    description: "Contemporary narratives with classical depth.",
  },
  {
    icon: `${ASSET}/icon-harmony.svg`,
    iconSize: { w: 40, h: 36 },
    title: "Music & Movement Harmony",
    description: "Perfect sync of rhythm, emotion & expression.",
  },
  {
    icon: `${ASSET}/icon-stage.svg`,
    iconSize: { w: 46, h: 36 },
    title: "Stage Impact",
    description: "Grand, engaging & visually captivating productions.",
  },
  {
    icon: `${ASSET}/icon-audience.svg`,
    iconSize: { w: 40, h: 33 },
    title: "Audience Connection",
    description: "Creating experiences that leave a lasting impact.",
  },
];

const stats = [
  { icon: `${ASSET}/icon-productions.svg`, iconSize: { w: 34, h: 26 }, value: "50+", label: "Original Productions" },
  { icon: `${ASSET}/icon-performances.svg`, iconSize: { w: 38, h: 30 }, value: "100+", label: "Stage Performances" },
  { icon: `${ASSET}/icon-years.svg`, iconSize: { w: 30, h: 30 }, value: "15+", label: "Years of Choreography" },
  { icon: `${ASSET}/icon-countries.svg`, iconSize: { w: 30, h: 30 }, value: "10+", label: "Countries Showcased" },
  { icon: `${ASSET}/icon-impact.svg`, iconSize: { w: 38, h: 30 }, value: "5000+", label: "Audience Impacted" },
];

export default function ChoreographerExtraordinaire() {
  return (
    <section className="relative bg-white pb-12 sm:pb-16 lg:pb-20">
      <div className="w-full max-w-[1152px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal animation="scale">
        <div className="relative overflow-hidden bg-[#8B1D3B] rounded-3xl py-12 sm:py-16 px-6 sm:px-8 lg:px-12">
          <div
            className="absolute inset-0 opacity-10 bg-repeat bg-top-left pointer-events-none"
            style={{ backgroundImage: `url(${ASSET}/choreo-texture.png)`, backgroundSize: "67px 100px" }}
          />

          <div className="relative flex flex-col gap-12">
            <div className="flex items-center justify-center gap-4">
              <span className="hidden sm:block w-16 h-px bg-[#D4AF37] opacity-50" />
              <span className="relative overflow-clip shrink-0" style={{ width: 14, height: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icon-star.svg`} alt="" className="size-full object-contain" />
              </span>
              <h2 className="font-playfair font-bold text-2xl sm:text-3xl lg:text-[36px] leading-10 tracking-[0.9px] text-white text-center">
                Choreographer Extraordinaire
              </h2>
              <span className="relative overflow-clip shrink-0" style={{ width: 14, height: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icon-star.svg`} alt="" className="size-full object-contain" />
              </span>
              <span className="hidden sm:block w-16 h-px bg-[#D4AF37] opacity-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-playfair font-bold text-xl leading-7 text-white shrink-0">
                    A Visionary in Motion
                  </h3>
                  <span className="flex-1 h-px bg-[#D4AF37] opacity-30" />
                  <span className="relative overflow-clip shrink-0" style={{ width: 10, height: 9 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${ASSET}/icon-diamond.svg`} alt="" className="size-full object-contain" />
                  </span>
                </div>
                <p className="font-sans font-light text-sm leading-[22.75px] text-[#E5E7EB]">
                  Harshita&apos;s choreographies are a beautiful blend of tradition and innovation.
                  Rooted in the classical grammar of Kathak, her works reflect contemporary themes,
                  powerful storytelling, and deep emotional resonance.
                </p>
                <ul className="flex flex-col gap-4 pt-1">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="relative overflow-clip shrink-0 mt-0.5" style={{ width: 18, height: 18 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${ASSET}/icon-gold-check.svg`} alt="" className="size-full object-contain" />
                      </span>
                      <p className="font-sans text-sm leading-5 text-[#E5E7EB]">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full max-w-[360px] mx-auto">
                <div className="aspect-square rounded-2xl border-4 border-[#8B1D3B] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.5)] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${ASSET}/harshita-dancing.png`}
                    alt="Guru Harshita performing on stage"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <h3 className="font-playfair font-bold text-xl leading-7 text-white">
                    What Makes Her Choreography Unique
                  </h3>
                  <span className="relative overflow-clip shrink-0 mt-2" style={{ width: 10, height: 9 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${ASSET}/icon-diamond.svg`} alt="" className="size-full object-contain" />
                  </span>
                </div>
                <div className="flex flex-col gap-6">
                  {uniques.map((item) => (
                    <div key={item.title} className="flex items-start rounded-lg p-1 -m-1 hover:bg-white/5 transition-colors duration-300">
                      <span
                        className="relative overflow-clip shrink-0"
                        style={{ width: item.iconSize.w, height: item.iconSize.h }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.icon} alt="" className="size-full object-contain" />
                      </span>
                      <div className="pl-1">
                        <h4 className="font-playfair font-bold text-sm leading-5 text-white">
                          {item.title}
                        </h4>
                        <p className="font-sans text-xs leading-4 text-[#D1D5DB]">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center gap-1 px-2 transition-transform duration-300 hover:-translate-y-1 ${
                    index > 0 ? "lg:border-l lg:border-white/20" : ""
                  }`}
                >
                  <span
                    className="relative overflow-clip"
                    style={{ width: stat.iconSize.w, height: stat.iconSize.h }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stat.icon} alt="" className="size-full object-contain" />
                  </span>
                  <p className="font-sans font-bold text-[30px] leading-9 text-white">
                    <CountUpValue display={stat.value} />
                  </p>
                  <p className="font-sans text-xs leading-4 tracking-[0.6px] uppercase text-[#D1D5DB] text-center">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
