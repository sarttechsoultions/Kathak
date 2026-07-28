"use client";

import React from "react";
import { Star, User } from "lucide-react";

interface ReviewCard {
  id: string;
  quote: string;
  name: string;
  role: string;
}

const reviewsData: ReviewCard[] = [
  {
    id: "review-1",
    quote:
      "Learning under Harshita Didi has been a transformative experience. Her attention to the technical nuances of the Jaipur Gharana is unparalleled. I've seen immense growth in my footwork and confidence.",
    name: "Ananya Sharma",
    role: "Student for 3 years",
  },
  {
    id: "review-2",
    quote:
      "The atmosphere at the academy is so nurturing. As an adult beginner, I was nervous, but the teaching methodology makes complex rhythms accessible and enjoyable. Highly recommend!",
    name: "Priya Mehta",
    role: "Adult Batch Student",
  },
  {
    id: "review-3",
    quote:
      "Authentic training in its purest form. The focus on 'Riyaaz' and the spiritual aspect of Kathak is what sets this academy apart. It's not just dance; it's a way of life here.",
    name: "Rahul Verma",
    role: "Advanced Student",
  },
];

export default function StudentReviewsSection() {
  return (
    <section id="reviews" className="relative bg-white py-14 sm:py-16 lg:py-20 overflow-hidden text-stone-900">
      <div className="w-full max-w-[1232px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
          {/* Tagline: Manrope Regular 16px, #570013, Letter Spacing 1.6px */}
          <span className="font-sans font-normal text-sm sm:text-base tracking-[1.6px] text-[#570013] uppercase leading-[24px] block">
            TESTIMONIALS
          </span>

          {/* Headline: Playfair Display Bold 48px, #570013, Line Height 56px */}
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[48px] font-bold leading-[56px] text-[#570013] tracking-normal">
            What Our Students Say
          </h2>

          {/* 5-Star Google Rating Subhead: Manrope 16px Regular, #584141 */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex items-center gap-1 text-[#735C00]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-sans text-sm sm:text-base text-[#584141] font-normal leading-[24px]">
              4.9/5 on Google Reviews
            </span>
          </div>
        </div>

        {/* 3 Review Cards Grid (Gap: 48px) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[48px]">
          {reviewsData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between"
            >
              {/* Top Row: 5 Stars */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#735C00]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {/* Subtle Google icon placeholder dot */}
                <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-400">
                  G
                </div>
              </div>

              {/* Quote Paragraph: Manrope 16px Regular, #584141, Line Height 24px */}
              <p className="font-sans text-[#584141] text-sm sm:text-base leading-[24px] font-normal italic">
                &ldquo;{card.quote}&rdquo;
              </p>

              {/* Bottom Student Avatar & Name */}
              <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#570013]" />
                </div>
                <div className="space-y-0.5">
                 <h4 className="font-inter font-medium text-[14px] leading-[20px] text-[#570013]">
  {card.name}
</h4>
                  <p className="font-sans text-xs text-[#584141]">
                    {card.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
