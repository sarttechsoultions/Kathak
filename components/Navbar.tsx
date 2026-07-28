"use client";

import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#home", active: true },
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Vision & Goals", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Judges & Choreographers", href: "#accolades" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  logoSrc?: string;
}

export default function Navbar({ logoSrc = "/logo.png" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("IN");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all">
      <div className="w-full max-w-[1536px] mx-auto h-[90px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo - Pushed further to Left */}
        <Link href="/" className="flex items-center shrink-0 group py-1 -ml-1 sm:ml-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Kathak by Harshita Logo"
            className="h-14 sm:h-16 max-h-[64px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Center Navigation Links (Using Playfair Display Font) */}
        <nav className="hidden xl:flex items-center gap-6 lg:gap-7 xl:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-playfair text-[15px] transition-all duration-200 whitespace-nowrap relative py-1 ${
                item.active
                  ? "text-[#D9383A] font-semibold"
                  : "text-stone-700 hover:text-[#D9383A] font-medium"
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D9383A] rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Action Controls - Pushed further to Right */}
        <div className="hidden sm:flex items-center gap-4 -mr-1 sm:mr-0">
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 px-3.5 py-1.5 rounded-full text-xs font-medium text-stone-700 transition-colors cursor-pointer"
              title="Select Currency"
            >
              <span className="text-sm">🇮🇳</span>
              <span className="font-semibold tracking-wide text-stone-800">
                {selectedCurrency}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${currencyDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-lg border border-stone-100 py-1.5 z-50 text-xs font-playfair animate-in fade-in slide-in-from-top-2">
                {["INR", "USD", "GBP"].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setSelectedCurrency(curr);
                      setCurrencyDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-stone-50 flex items-center justify-between font-medium text-stone-800 cursor-pointer"
                  >
                    <span>{curr === "INR" ? "🇮🇳 INR" : curr === "USD" ? "🇺🇸 USD" : "🇬🇧 GBP"}</span>
                    {selectedCurrency === curr && <span className="text-[#D9383A]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Button */}
          <Link
            href="/login"
            className="bg-[#C10F3A] hover:bg-[#B91C1C] text-white px-7 py-2 rounded-full font-playfair font-semibold text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-6 py-4 shadow-lg animate-in slide-in-from-top-3">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-playfair text-base py-2 transition-colors border-b border-stone-100 ${
                  item.active
                    ? "text-[#D9383A] font-semibold pl-2 border-l-4 border-l-[#D9383A]"
                    : "text-stone-700 hover:text-[#D9383A]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200 text-xs font-medium">
              <span>🇮🇳</span>
              <span>{selectedCurrency}</span>
            </div>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#D9383A] text-white px-6 py-2 rounded-full font-playfair font-semibold text-sm"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
