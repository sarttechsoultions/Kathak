"use client";

import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialIcons from "@/components/SocialIcons";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Vision & Goals", href: "/vision-goals" },
  { label: "Gallery", href: "/gallery" },
  { label: "Judges & Choreographers", href: "/judges-choreographers" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  logoSrc?: string;
}

export default function Navbar({ logoSrc = "/logo.png" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India (IN)");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/about") return pathname === "/about";
    if (href === "/courses") return pathname === "/courses" || pathname.startsWith("/courses/");
    if (href === "/vision-goals") return pathname === "/vision-goals";
    if (href === "/gallery") return pathname === "/gallery";
    if (href === "/judges-choreographers") return pathname === "/judges-choreographers";
    if (href === "/contact") return pathname === "/contact";
    if (href === "/") return pathname === "/";
    return false;
  };

  return (
    <header className="relative z-[100] w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
      <div className="w-full max-w-[1536px] mx-auto h-[60px] sm:h-[90px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center shrink-0 group py-1 -ml-1 sm:ml-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Kathak by Harshita Logo"
            className="h-11 sm:h-16 max-h-[64px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 lg:gap-7 xl:gap-8">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
            <Link
              key={item.label}
              href={item.href}
              className={`font-playfair text-[15px] transition-all duration-200 whitespace-nowrap relative py-1 ${
                active
                  ? "text-[#D9383A] font-semibold"
                  : "text-stone-700 hover:text-[#D9383A] font-medium"
              }`}
            >
              {item.label}
              {active && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D9383A] rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Country / Language Selector Pill + Login Button */}
        <div className="hidden sm:flex items-center gap-4 -mr-1 sm:mr-0">
          
          {/* Country / Language Selection Pill Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-2 bg-white hover:bg-stone-50 border border-stone-200/90 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-stone-800 transition-colors cursor-pointer shadow-2xs"
              title="Select Language / Country"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/india-flag.svg"
                alt="India Flag"
                className="w-5 h-3.5 object-cover rounded-[2px] shadow-2xs shrink-0"
              />
              <span className="font-sans font-medium text-stone-800">
                India (IN)
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-600 transition-transform duration-200 ${currencyDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 text-xs font-sans animate-in fade-in slide-in-from-top-2">
                {[
                  { label: "India (IN)", flagSrc: "/icons/india-flag.svg" },
                  { label: "USA (US)", flagEmoji: "🇺🇸" },
                  { label: "UK (GB)", flagEmoji: "🇬🇧" },
                  { label: "Canada (CA)", flagEmoji: "🇨🇦" },
                ].map((country) => (
                  <button
                    key={country.label}
                    onClick={() => {
                      setSelectedCountry(country.label);
                      setCurrencyDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center justify-between font-medium text-stone-800 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {country.flagSrc ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={country.flagSrc} alt={country.label} className="w-4 h-3 object-cover rounded-[2px]" />
                      ) : (
                        <span>{country.flagEmoji}</span>
                      )}
                      <span>{country.label}</span>
                    </span>
                    {selectedCountry === country.label && <span className="text-[#C10F3A]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Student Login Button */}
          <Link
            href="/login"
            className="bg-[#C10F3A] hover:bg-[#B91C1C] text-white px-7 py-2 rounded-full font-playfair font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center cursor-pointer"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-6 py-4 shadow-xl animate-in slide-in-from-top-3 relative z-[100]">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-playfair text-base py-2 transition-colors border-b border-stone-100 ${
                  active
                    ? "text-[#D9383A] font-semibold pl-2 border-l-4 border-l-[#D9383A]"
                    : "text-stone-700 hover:text-[#D9383A]"
                }`}
              >
                {item.label}
              </Link>
              );
            })}
          </nav>
          
          <div className="space-y-3 mt-4 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between gap-2">
              {/* Mobile Country/Language Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="flex items-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full text-xs font-medium text-stone-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/india-flag.svg"
                    alt="India Flag"
                    className="w-4 h-3 object-cover rounded-[2px] shrink-0"
                  />
                  <span className="font-sans font-medium">India (IN)</span>
                  <ChevronDown className="w-3 h-3 text-stone-600" />
                </button>
              </div>

              {/* Mobile Login Button */}
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#C10F3A] hover:bg-[#B91C1C] text-white px-6 py-1.5 rounded-full font-playfair font-semibold text-xs transition-all cursor-pointer inline-block text-center"
              >
                Login
              </Link>
            </div>

            {/* Mobile Social Media Icons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500 font-medium">Follow Us:</span>
              <SocialIcons
                className="flex items-center gap-2"
                linkClassName="inline-flex items-center justify-center rounded-full hover:scale-110 transition-transform"
                iconClassName="w-6 h-6 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
