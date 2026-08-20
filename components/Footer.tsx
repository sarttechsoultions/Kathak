"use client";

import React from "react";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#1F4A3A] text-white pt-14 sm:pt-16 pb-8 border-t border-[#1F4A3A] overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns Grid: 2 columns side-by-side on Mobile (grid-cols-2), 12 columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-[48px] items-start pb-12">
          
          {/* Column 1: Logo, Tagline & Social Icons (Top-Left on Mobile, lg:col-span-4) */}
          <div className="col-span-1 lg:col-span-4 space-y-3 sm:space-y-4 order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Kathak by Harshita Logo"
              className="h-12 sm:h-16 w-auto object-contain"
            />
            {/* Tagline: Playfair Display Medium */}
            <h3 className="font-playfair font-medium text-sm sm:text-xl lg:text-[24px] text-[#D9BE7A] leading-snug sm:leading-[32px] max-w-[256px]">
              Preserving Tradition, Inspiring Generations.
            </h3>

            {/* Footer Social Media PNG Icons */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-1.5 rounded-full bg-white/10 hover:bg-[#C10F3A] transition-all hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/linkedin.png" alt="LinkedIn" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1.5 rounded-full bg-white/10 hover:bg-[#C10F3A] transition-all hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/insta.png" alt="Instagram" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-1.5 rounded-full bg-white/10 hover:bg-[#C10F3A] transition-all hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/facebook.png" alt="Facebook" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-1.5 rounded-full bg-white/10 hover:bg-[#C10F3A] transition-all hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/youtube.png" alt="YouTube" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
              </a>
            </div>
          </div>

          {/* Column 4: Contact Info (Top-Right on Mobile, lg:col-span-2) */}
          <div className="col-span-1 lg:col-span-2 relative flex flex-col justify-between h-full space-y-4 sm:space-y-6 order-2 lg:order-4">
            <div className="space-y-2.5 sm:space-y-3.5">
              {/* Header */}
              <h4 className="font-playfair font-medium text-base sm:text-lg lg:text-[20px] text-[#D9BE7A] leading-[28px]">
                Contact Info
              </h4>
              <ul className="space-y-2 sm:space-y-3 font-sans text-xs sm:text-sm text-stone-200 font-normal">
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9BE7A] shrink-0 mt-0.5" />
                  <span className="leading-tight">Jaipur, Rajasthan, India</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9BE7A] shrink-0" />
                  <span>+91 1234567890</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9BE7A] shrink-0 mt-0.5" />
                  <span className="break-all sm:break-normal">kathakbyharshita@gmail.com
</span>
                </li>
              </ul>
            </div>

            {/* Desktop-Only Scroll-To-Top Crimson Red Button */}
            <div className="pt-1 sm:pt-2 hidden lg:block">
              <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="w-10 h-10 rounded-lg bg-[#C10F3A] hover:bg-[#A01830] text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links (Bottom-Left on Mobile, lg:col-span-3) */}
          <div className="col-span-1 lg:col-span-3 space-y-2.5 sm:space-y-3.5 order-3 lg:order-2">
            {/* Header */}
            <h4 className="font-playfair font-medium text-base sm:text-lg lg:text-[20px] text-[#D9BE7A] leading-[28px]">
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 font-sans text-xs sm:text-sm text-stone-200 font-normal">
              <li>
                <a href="/" className="hover:text-[#D9BE7A] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#D9BE7A] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#courses" className="hover:text-[#D9BE7A] transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="/#vision" className="hover:text-[#D9BE7A] transition-colors">
                  Vision &amp; Goals
                </a>
              </li>
              <li>
                <a href="/#gallery" className="hover:text-[#D9BE7A] transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/#judges" className="hover:text-[#D9BE7A] transition-colors">
                  Judges &amp; Choreographers
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-[#D9BE7A] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses (Bottom-Right on Mobile, lg:col-span-3) */}
          <div className="col-span-1 lg:col-span-3 space-y-2.5 sm:space-y-3.5 order-4 lg:order-3">
            {/* Header */}
            <h4 className="font-playfair font-medium text-base sm:text-lg lg:text-[20px] text-[#D9BE7A] leading-[28px]">
              Courses
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 font-sans text-xs sm:text-sm text-stone-200 font-normal">
              <li>
                <a href="/#courses-india" className="hover:text-[#D9BE7A] transition-colors">
                  India Programs
                </a>
              </li>
              <li>
                <a href="/#courses-ladies" className="hover:text-[#D9BE7A] transition-colors">
                  Ladies Wellness Batch
                </a>
              </li>
              <li>
                <a href="/#courses-hobby" className="hover:text-[#D9BE7A] transition-colors">
                  Hobby Kathak Batch
                </a>
              </li>
              <li>
                <a href="/#courses-intl" className="hover:text-[#D9BE7A] transition-colors">
                  International Programs
                </a>
              </li>
              <li>
                <a href="/#courses-private" className="hover:text-[#D9BE7A] transition-colors">
                  Private One-to-One
                </a>
              </li>
            </ul>

            {/* Mobile-Only Scroll-To-Top Crimson Red Button below Courses */}
            <div className="pt-3 flex justify-start lg:hidden">
              <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="w-10 h-10 rounded-lg bg-[#C10F3A] hover:bg-[#A01830] text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[11px] text-stone-300 uppercase tracking-wider font-normal text-center sm:text-left">
          <p>© 2025 KATHAK BY HARSHITA. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </a>
            <span>|</span>
            <a href="#terms" className="hover:text-white transition-colors">
              TERMS &amp; CONDITIONS
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
