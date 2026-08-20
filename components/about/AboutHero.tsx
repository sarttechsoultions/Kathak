"use client";

import React from "react";

const socialLinks = [
  { href: "https://linkedin.com", src: "/icons/linkedin.png", label: "LinkedIn" },
  { href: "https://instagram.com", src: "/icons/insta.png", label: "Instagram" },
  { href: "https://facebook.com", src: "/icons/facebook.png", label: "Facebook" },
  { href: "https://youtube.com", src: "/icons/youtube.png", label: "YouTube" },
  { href: "tel:+919079192223", src: "/icons/phone.png", label: "Call Us" },
];

export default function AboutHero() {
  return (
    <section className="relative w-full h-[520px] sm:h-[640px] lg:h-[819px] overflow-hidden bg-black text-white">
      {/* Background photos from Figma */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about-page/hero-bg.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about-page/hero-dancer.png"
          alt="Kathak dancer in motion"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#570013]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Copy */}
      <div className="relative z-20 h-full w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center">
        <div className="max-w-3xl space-y-4">
          <p className="font-sans text-xs sm:text-sm lg:text-base tracking-[0.2em] uppercase text-[#E9C349]">
            Since 2014
          </p>
          <h1 className="font-playfair font-bold text-4xl sm:text-5xl lg:text-[64px] leading-tight lg:leading-[80px] tracking-tight text-white">
            Preserving the Rhythm of
            <br />
            Tradition:{" "}
            <span className="italic">Our Story</span>
          </h1>
          <p className="font-sans text-sm sm:text-base lg:text-lg text-white/90 leading-7 max-w-xl">
            Experience the discipline, speed, and spiritual storytelling of Jaipur
            Gharana Kathak through the vision of Harshita.
          </p>
        </div>
      </div>

      {/* Prev / next arrows */}
      <button
        type="button"
        aria-label="Previous"
        className="hidden sm:flex absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 z-30 size-10 items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/about-page/icon-next.svg" alt="" className="size-10 rotate-180" />
      </button>
      <button
        type="button"
        aria-label="Next"
        className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 size-10 items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/about-page/icon-next.svg" alt="" className="size-10" />
      </button>

      {/* Watch intro */}
      <a
        href="#legacy"
        className="hidden md:flex absolute right-10 lg:right-[120px] bottom-16 z-30 items-center gap-2 text-white"
      >
        <span className="size-10 overflow-clip shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about-page/icon-video.svg" alt="" className="size-10" />
        </span>
        <span className="leading-tight">
          <span className="block font-sans font-medium text-base tracking-[1px]">Watch Intro</span>
          <span className="block font-sans text-[10px] font-normal">See Kathak in motion</span>
        </span>
      </a>

      {/* Left social stack */}
      <div className="hidden lg:flex absolute left-3.5 bottom-24 z-30 flex-col gap-2.5">
        {socialLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={item.label}
            className="size-12 overflow-clip rounded-full hover:scale-110 transition-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.label} className="size-12 object-contain" />
          </a>
        ))}
      </div>

      {/* Sticky WhatsApp */}
      <a
        href="https://wa.me/919079192223"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-8 right-4 sm:right-6 z-50 size-12 rounded-full bg-[#25D366] p-3 shadow-2xl hover:scale-110 transition-transform overflow-clip"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/whatsapp.png" alt="WhatsApp" className="size-full object-contain" />
      </a>
    </section>
  );
}
