"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";

const ASSET = "/judges-page";

const productions = [
  {
    image: `${ASSET}/production-meera.png`,
    title: "Meera: The Divine Calling",
    year: "2023",
    description:
      "A critically acclaimed dance drama exploring the spiritual journey of the mystic poetess through Kathak.",
  },
  {
    image: `${ASSET}/production-rhythms.png`,
    title: "Rhythms of Earth",
    year: "2022",
    description:
      "An experimental contemporary piece fusing classical footwork with global percussion instruments.",
  },
  {
    image: `${ASSET}/production-anveshana.png`,
    title: "Anveshana: The Search",
    year: "2021",
    description:
      "A solo choreographic exploration of the self, presented at the International Arts Festival.",
  },
];

const offerings = [
  {
    icon: `${ASSET}/icon-offer-stage.svg`,
    iconSize: { w: 20, h: 16 },
    title: "Stage Productions & Collaborations",
    description: "Concept to completion productions",
  },
  {
    icon: `${ASSET}/icon-offer-workshops.svg`,
    iconSize: { w: 20, h: 16 },
    title: "Workshops for All Age Groups",
    description: "Interactive, engaging & value driven",
  },
  {
    icon: `${ASSET}/icon-offer-direction.svg`,
    iconSize: { w: 17, h: 16 },
    title: "Creative Direction for Cultural Events",
    description: "Elevating events with artistic excellence",
  },
  {
    icon: `${ASSET}/icon-offer-mentorship.svg`,
    iconSize: { w: 12, h: 16 },
    title: "Judging & Mentorship",
    description: "Guiding dancers & choreographers towards excellence",
  },
];

export default function ProductionsOfferings() {
  return (
    <section className="relative bg-white pb-12 sm:pb-16">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-8 items-stretch">
          <Reveal animation="left" className="h-full">
          <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 sm:p-8 shadow-[0px_4px_3px_rgba(0,0,0,0.05),0px_1px_1.5px_rgba(0,0,0,0.1)] flex flex-col gap-8 h-full">
            <div className="flex items-center justify-center gap-4">
              <span className="hidden sm:block w-12 h-px bg-[#D4AF37] opacity-50" />
              <span className="relative overflow-clip shrink-0" style={{ width: 10, height: 9 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icon-gold-dot.svg`} alt="" className="size-full object-contain" />
              </span>
              <h2 className="font-playfair font-bold text-2xl leading-8 text-[#111827] text-center">
                Notable Productions
              </h2>
              <span className="relative overflow-clip shrink-0" style={{ width: 10, height: 9 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ASSET}/icon-gold-dot.svg`} alt="" className="size-full object-contain" />
              </span>
              <span className="hidden sm:block w-12 h-px bg-[#D4AF37] opacity-50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {productions.map((production) => (
                <article key={production.title} className="flex flex-col gap-2 group">
                  <div className="h-40 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={production.image}
                      alt={production.title}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-2 pt-2">
                    <h3 className="font-playfair font-bold text-sm leading-5 text-[#111827]">
                      {production.title}
                    </h3>
                    <span className="bg-[#F4E6C3] text-[#854D0E] text-xs leading-4 font-medium px-2 py-1 rounded shrink-0">
                      {production.year}
                    </span>
                  </div>
                  <p className="font-sans text-xs leading-4 text-[#4B5563]">{production.description}</p>
                </article>
              ))}
            </div>
          </div>
          </Reveal>

          <Reveal animation="right" delay={120} className="h-full">
          <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 sm:p-8 shadow-[0px_4px_3px_rgba(0,0,0,0.05),0px_1px_1.5px_rgba(0,0,0,0.1)] flex flex-col h-full">
            <h2 className="font-playfair font-bold text-2xl leading-8 text-[#111827] text-center pb-8">
              Collaborations &amp; Offerings
            </h2>
            <div className="flex flex-col gap-6 flex-1">
              {offerings.map((offering) => (
                <div key={offering.title} className="flex items-start rounded-lg p-1 -m-1 hover:bg-[#FCE7F3]/40 transition-colors duration-300">
                  <span className="pr-4 shrink-0">
                    <span className="size-10 rounded-full bg-[#FCE7F3] flex items-center justify-center">
                      <span
                        className="relative overflow-clip"
                        style={{ width: offering.iconSize.w, height: offering.iconSize.h }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={offering.icon} alt="" className="size-full object-contain" />
                      </span>
                    </span>
                  </span>
                  <div>
                    <h3 className="font-playfair font-bold text-sm leading-5 text-[#111827]">
                      {offering.title}
                    </h3>
                    <p className="font-sans text-xs leading-4 text-[#4B5563]">{offering.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-8 w-full bg-[#8B1D3B] hover:bg-[#7A1833] text-white font-sans font-semibold text-base leading-6 py-3 rounded-xl text-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Invite Harshita for Your Next Event
            </Link>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
