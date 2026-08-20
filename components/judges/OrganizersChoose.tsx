"use client";

import Reveal from "@/components/Reveal";

const ASSET = "/judges-page";

const reasons = [
  {
    icon: `${ASSET}/icon-credibility.svg`,
    iconSize: { w: 33, h: 34 },
    title: "Credibility & Experience",
    description: "A name trusted by leading cultural organizations and festivals.",
  },
  {
    icon: `${ASSET}/icon-fair.svg`,
    iconSize: { w: 38, h: 34 },
    title: "Fair & Transparent Judgement",
    description: "Ensures every participant gets the recognition they deserve.",
  },
  {
    icon: `${ASSET}/icon-feedback.svg`,
    iconSize: { w: 34, h: 32 },
    title: "Motivational Feedback",
    description: "Constructive guidance to help artists improve and grow.",
  },
  {
    icon: `${ASSET}/icon-ambassador.svg`,
    iconSize: { w: 34, h: 34 },
    title: "Cultural Ambassador",
    description: "Promotes Indian classical arts with pride and responsibility.",
  },
];

export default function OrganizersChoose() {
  return (
    <section className="relative bg-white pb-12 sm:pb-16 lg:pb-20">
      <div className="w-full max-w-[1237px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal animation="scale">
          <div className="bg-[#F2EAE5] rounded-2xl overflow-hidden px-5 sm:px-7 py-5 sm:py-6">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-playfair font-bold text-xl sm:text-2xl leading-8 text-[#111827] shrink-0">
                Why Event Organizers Choose Harshita
              </h2>
              <span className="hidden sm:block flex-1 h-px bg-[rgba(193,15,58,0.3)]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <Reveal animation="left" className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] overflow-hidden rounded-xl group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ASSET}/organizers-dancer.png`}
                  alt="Guru Harshita performing Kathak"
                  className="absolute inset-0 size-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                />
              </Reveal>

              <div className="flex flex-col gap-5">
                {reasons.map((reason, index) => (
                  <Reveal key={reason.title} animation="right" delay={index * 80}>
                    <div className="bg-[rgba(193,15,58,0.05)] border border-[rgba(193,15,58,0.1)] rounded-lg p-[13px] flex items-start transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
                      <span className="pr-3 shrink-0">
                        <span
                          className="relative overflow-clip block"
                          style={{ width: reason.iconSize.w, height: reason.iconSize.h }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={reason.icon} alt="" className="size-full object-contain" />
                        </span>
                      </span>
                      <div>
                        <h3 className="font-sans font-bold text-sm leading-5 text-[#111827]">
                          {reason.title}
                        </h3>
                        <p className="font-sans text-xs leading-4 text-[#4B5563]">{reason.description}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
