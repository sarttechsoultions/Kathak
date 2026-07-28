"use client";

import React from "react";

interface AccoladeCard {
  id: string;
  iconSrc: string;
  title: string;
  organization: string;
  description: string;
}

const accoladesData: AccoladeCard[] = [
  {
    id: "accolade-1",
    iconSrc: "/icons/best.png",
    title: "Best Classical Dance Academy",
    organization: "JAIPUR CULTURAL FORUM 2023",
    description: "Recognized for excellence in pedagogical methods and preserving the technical purity of Jaipur Gharana.",
  },
  {
    id: "accolade-2",
    iconSrc: "/icons/heritage.png",
    title: "Heritage Preservation Award",
    organization: "RAJASTHAN ARTS COUNCIL",
    description: "Awarded for significant contributions to the documentation and teaching of rare temple-style Kathak compositions.",
  },
  {
    id: "accolade-3",
    iconSrc: "/icons/artistic.png",
    title: "Artistic Visionary Prize",
    organization: "NATIONAL DANCE ALLIANCE 2022",
    description: "Honoring Guru Harshita's vision in bridging the gap between ancient traditions and contemporary world stages.",
  },
];

export default function AccoladesSection() {
  return (
    <section id="accolades" className="relative bg-white py-14 sm:py-16 lg:py-20 overflow-hidden text-stone-900">
      <div className="w-full max-w-[1232px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
          {/* Tagline: Poppins Bold 24px, #9F0C25, Letter Spacing 1.6px */}
          <span className="font-sans font-bold text-xl sm:text-2xl tracking-[1.6px] text-[#9F0C25] uppercase leading-[24px] block">
            ACCOLADES
          </span>

          {/* Headline: Playfair Display Bold 40px, #D9BE7A, Line Height 56px */}
          <h2 className="font-playfair text-3xl sm:text-[40px] font-bold leading-[56px] text-[#D9BE7A] tracking-normal">
            Awards & Recognitions
          </h2>
        </div>

        {/* 3 Cards Grid (Gap: 30px) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[30px]">
          {accoladesData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 space-y-5 flex flex-col justify-between"
            >
              {/* Top Red Badge Icon */}
              <div className="w-12 h-12 rounded-xl  flex items-center justify-center shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.iconSrc}
                  alt={card.title}
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                {/* Title: Playfair Display SemiBold 24px, #570013, Line Height 32px */}
                <h3 className="font-playfair font-semibold text-xl sm:text-[24px] text-[#570013] leading-[32px]">
                  {card.title}
                </h3>
                {/* Organization: Inter SemiBold 12px, #687280 */}
                <p className="font-sans text-[11px] sm:text-xs font-semibold text-[#687280] uppercase tracking-[0.5px] leading-[15px]">
                  {card.organization}
                </p>
              </div>

              {/* Description: Manrope 16px Regular, #584141, Line Height 24px */}
              <p className="font-sans text-[#584141] text-sm sm:text-base leading-[24px] font-normal">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
