"use client";

import React from "react";
import { Phone, Mail, User } from "lucide-react";

export default function TopHeader() {
  return (
    <div className="bg-[#f9e7eb] text-stone-300 text-xs py-2 px-4 sm:px-6 lg:px-10 ">
      <div className="w-full max-w-[1536px] mx-auto flex items-center justify-between gap-4">
        {/* Left Social Icons */}
        <div className="flex items-center gap-3">
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

        {/* Center Contact Info */}
        <div className="flex items-center gap-6 font-medium text-[#000000]">
          <a href="tel:+919876543210" className="flex items-center gap-1.5 ">
            <Phone className="w-3.5 h-3.5 text-[#000000]" />
            <span>+91 98765 43210</span>
          </a>
          <a href="mailto:info@kathak.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-[#000000]" />
            <span>info@kathak.com</span>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
        
          <a
            href="#"
            className="bg-[#C10F3A] hover:bg-[#B91C1C] text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors"
          >
            Book Free Trial
          </a>
        </div>
      </div>
    </div>
  );
}
