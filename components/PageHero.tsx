import type { ReactNode } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

interface PageHeroProps {
  title: ReactNode;
  subtitle: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export default function PageHero({
  title,
  subtitle,
  imageSrc = "/courses-page/hero-layer.png",
  imageAlt = "Kathak dancer in motion",
}: PageHeroProps) {
  return (
    <section className="relative w-full min-h-[200px] sm:h-[340px] lg:h-[391px] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 size-full object-cover object-[center_15%] sm:object-[center_20%] lg:object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(87,0,19,0.75)] to-[rgba(87,0,19,0)]" />

      <div className="relative z-20 h-full w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[60px] flex flex-col justify-center py-7 sm:py-0">
        <div className="max-w-[1280px] sm:pt-8 lg:pt-12 flex flex-col gap-2 sm:gap-4">
          <h1 className="hero-enter font-playfair font-normal text-[26px] sm:text-[56px] lg:text-[72px] leading-tight sm:leading-[56px] lg:leading-[66px] tracking-[1.4px] sm:tracking-[3.2px] uppercase text-[#E9C349] w-fit">
            {title}
          </h1>
          <p
            className={`hero-enter hero-enter-d2 ${poppins.className} font-normal text-[12px] sm:text-[17px] lg:text-[20px] leading-[18px] sm:leading-8 lg:leading-[40px] tracking-normal sm:tracking-[-1.28px] text-white/95 max-w-[520px] sm:max-w-[760px] lg:max-w-[976px]`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
