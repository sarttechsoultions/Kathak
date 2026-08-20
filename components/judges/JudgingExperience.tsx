"use client";

import Reveal from "@/components/Reveal";

const ASSET = "/judges-page";

const cards = [
  {
    icon: `${ASSET}/icon-national.svg`,
    iconSize: { w: 20, h: 20 },
    title: "National & Government-Level Judging Experience",
    items: [
      "Judged 500+ National & State Level Competitions",
      "Empanelled with prestigious government & cultural bodies",
      "Expertise in evaluating classical standards with fairness & precision",
    ],
  },
  {
    icon: `${ASSET}/icon-international.svg`,
    iconSize: { w: 20, h: 20 },
    title: "International Recognition & Global Judging Opportunities",
    items: [
      "Invited as Judge in International Kathak Festivals",
      "Recognized for promoting Indian culture across global platforms",
      "Experience in judging diverse age groups & skill levels",
    ],
  },
  {
    icon: `${ASSET}/icon-organizers.svg`,
    iconSize: { w: 25, h: 20 },
    title: "Why Event Organizers Choose Harshita as a Judge",
    items: [
      "Deep knowledge of Kathak in its traditional & contemporary forms",
      "Balanced, transparent & constructive judgement",
      "Professional, punctual & highly respected by artists & organizers",
    ],
  },
  {
    icon: `${ASSET}/icon-culture.svg`,
    iconSize: { w: 25, h: 20 },
    title: "Spreading Culture Through Judgement",
    items: [
      "Encouraging young talent & preserving classical values",
      "Inspiring artists to grow with discipline & devotion",
      "Dedicated to the growth and global recognition of Indian classical arts",
    ],
  },
];

export default function JudgingExperience() {
  return (
    <section className="relative bg-white py-12 sm:py-16 lg:py-20">
      <div className="w-full max-w-[1232px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 90} animation="scale">
              <article className="hover-lift bg-white border border-[#F3F4F6] rounded-2xl p-[21px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_2px_4px_-1px_rgba(0,0,0,0.03)] drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)] flex flex-col items-center gap-4 h-full">
                <span className="size-12 rounded-[24px] bg-[#C10F3A] flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110">
                  <span
                    className="relative overflow-clip"
                    style={{ width: card.iconSize.w, height: card.iconSize.h }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.icon} alt="" className="size-full object-contain" />
                  </span>
                </span>
                <h3 className="font-playfair font-bold text-[14px] leading-[17.5px] text-[#1F2937] text-center">
                  {card.title}
                </h3>
                <ul className="flex flex-col gap-5 w-full">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-0.5">
                      <span className="relative overflow-clip shrink-0 mt-px" style={{ width: 22, height: 18 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${ASSET}/icon-check.svg`} alt="" className="size-full object-contain" />
                      </span>
                      <p className="font-sans text-xs leading-4 text-[#4B5563]">{item}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
