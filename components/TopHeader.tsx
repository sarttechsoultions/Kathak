"use client";

import React from "react";
import { Phone, Mail } from "lucide-react";

export default function TopHeader() {
  return (
    <div className="bg-[#f9e7eb] text-stone-300 text-xs py-1 sm:py-2 px-3 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1536px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Social Icons - Hidden on Mobile, Shown on Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <a href="#" aria-label="LinkedIn" className="p-1 rounded-full hover:bg-stone-800 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/linkedin.png" alt="LinkedIn" className="w-5 h-5 object-contain" />
          </a>
          <a href="#" aria-label="Instagram" className="p-1 rounded-full hover:bg-stone-800 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/insta.png" alt="Instagram" className="w-5 h-5 object-contain" />
          </a>
          <a href="#" aria-label="Facebook" className="p-1 rounded-full hover:bg-stone-800 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/facebook.png" alt="Facebook" className="w-5 h-5 object-contain" />
          </a>
          <a href="#" aria-label="YouTube" className="p-1 rounded-full hover:bg-stone-800 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/youtube.png" alt="YouTube" className="w-5 h-5 object-contain" />
          </a>
        </div>

        {/* Center Contact Info (Mobile: Only Phone, Email & Button in one row) */}
        <div className="flex items-center gap-2 sm:gap-6 font-medium text-[#000000] text-[11px] sm:text-xs">
          <a href="tel:+919079192223" className="flex items-center gap-1 shrink-0 hover:text-[#C10F3A] transition-colors">
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#000000]" />
            <span>+91 9079192223</span>
          </a>
          <a href="mailto:kathakbyharshita@gmail.com" className="flex items-center gap-1 hover:text-[#C10F3A] transition-colors shrink-0">
            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#000000]" />
            <span className="truncate max-w-[130px] sm:max-w-none">kathakbyharshita@gmail.com
</span>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#contact"
            className="bg-[#C10F3A] hover:bg-[#B91C1C] text-white px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-colors whitespace-nowrap"
          >
            Book Demo Classes
          </a>
        </div>

      </div>
    </div>
  );
}
