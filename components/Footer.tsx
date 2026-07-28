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
        
        {/* Main 4 Columns Grid (Gap: 48px) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-[48px] items-start pb-12">
          
          {/* Column 1: Logo & Tagline (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Kathak by Harshita Logo"
              className="h-14 sm:h-16 w-auto object-contain"
            />
            {/* Tagline: Playfair Display Medium 24px, #D9BE7A, Line Height 32px */}
            <h3 className="font-playfair font-medium text-xl sm:text-[24px] text-[#D9BE7A] leading-[32px] max-w-[256px]">
              Preserving Tradition, Inspiring Generations.
            </h3>
          </div>

          {/* Column 2: Quick Links (col-span-3) */}
          <div className="lg:col-span-3 space-y-3.5">
            {/* Header: Playfair Display Medium 20px, #D9BE7A, Line Height 28px */}
            <h4 className="font-playfair font-medium text-lg sm:text-[20px] text-[#D9BE7A] leading-[28px]">
              Quick Links
            </h4>
            <ul className="space-y-2 font-sans text-xs sm:text-sm text-stone-200 font-normal">
              <li>
                <a href="#home" className="hover:text-[#D9BE7A] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D9BE7A] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-[#D9BE7A] transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#vision" className="hover:text-[#D9BE7A] transition-colors">
                  Vision &amp; Goals
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#D9BE7A] transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#judges" className="hover:text-[#D9BE7A] transition-colors">
                  Judges&amp;Choreographers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D9BE7A] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses (col-span-3) */}
          <div className="lg:col-span-3 space-y-3.5">
            {/* Header: Playfair Display Medium 20px, #D9BE7A, Line Height 28px */}
            <h4 className="font-playfair font-medium text-lg sm:text-[20px] text-[#D9BE7A] leading-[28px]">
              Courses
            </h4>
            <ul className="space-y-2 font-sans text-xs sm:text-sm text-stone-200 font-normal">
              <li>
                <a href="#courses-india" className="hover:text-[#D9BE7A] transition-colors">
                  India Programs
                </a>
              </li>
              <li>
                <a href="#courses-ladies" className="hover:text-[#D9BE7A] transition-colors">
                  Ladies Wellness Batch
                </a>
              </li>
              <li>
                <a href="#courses-hobby" className="hover:text-[#D9BE7A] transition-colors">
                  Hobby Kathak Batch
                </a>
              </li>
              <li>
                <a href="#courses-intl" className="hover:text-[#D9BE7A] transition-colors">
                  International Programs
                </a>
              </li>
              <li>
                <a href="#courses-private" className="hover:text-[#D9BE7A] transition-colors">
                  Private One-to-One
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info & Scroll-To-Top Button (col-span-2) */}
          <div className="lg:col-span-2 relative flex flex-col justify-between h-full space-y-6">
            <div className="space-y-3.5">
              {/* Header: Playfair Display Medium 20px, #D9BE7A, Line Height 28px */}
              <h4 className="font-playfair font-medium text-lg sm:text-[20px] text-[#D9BE7A] leading-[28px]">
                Contact Info
              </h4>
              <ul className="space-y-3 font-sans text-xs sm:text-sm text-stone-200 font-normal">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D9BE7A] shrink-0" />
                  <span>Jaipur, Rajasthan, India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D9BE7A] shrink-0" />
                  <span>+91 1234567890</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#D9BE7A] shrink-0" />
                  <span className="truncate">info@kathakbyharshita.com</span>
                </li>
              </ul>
            </div>

            {/* Scroll-To-Top Crimson Red Button */}
            <div className="pt-2">
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
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[11px] text-stone-300 uppercase tracking-wider font-normal">
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
