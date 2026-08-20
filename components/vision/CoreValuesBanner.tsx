"use client";

import { Poppins } from "next/font/google";
import Reveal from "@/components/Reveal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
});

const ASSET = "/vision-goals";

const values = [
  {
    icon: `${ASSET}/icon-value-tradition.svg`,
    iconSize: { w: 30, h: 24 },
    label: "Respect for Tradition",
  },
  {
    icon: `${ASSET}/icon-value-discipline.svg`,
    iconSize: { w: 23, h: 24 },
    label: "Discipline & Dedication",
  },
  {
    icon: `${ASSET}/icon-value-integrity.svg`,
    iconSize: { w: 24, h: 21 },
    label: "Integrity & Passion",
  },
  {
    icon: `${ASSET}/icon-value-inclusivity.svg`,
    iconSize: { w: 30, h: 24 },
    label: "Inclusivity & Compassion",
  },
  {
    icon: `${ASSET}/icon-value-excellence.svg`,
    iconSize: { w: 24, h: 24 },
    label: "Excellence in Everything",
  },
];

export default function CoreValuesBanner() {
  return (
    <section className="relative bg-[#FCFAF8] py-10 sm:py-12">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal animation="scale">
        <div className="relative overflow-clip rounded-2xl bg-[#153325] p-6 sm:p-8 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-0">
          <div className="lg:w-[290px] shrink-0 lg:pr-6 lg:border-r lg:border-[#4B5563] flex flex-col gap-1">
            <h3 className="font-playfair font-normal text-2xl leading-8 text-[#D4AF37]">
              Our Core Values
            </h3>
            <span className="mt-2 block h-0.5 w-12 bg-[#D4AF37]" />
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 lg:pl-8">
            {values.map((value) => (
              <div
                key={value.label}
                className="flex flex-col items-center text-center max-w-[120px] mx-auto transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  className="relative overflow-clip mb-2"
                  style={{ width: value.iconSize.w, height: value.iconSize.h }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value.icon}
                    alt=""
                    width={value.iconSize.w}
                    height={value.iconSize.h}
                    className="size-full object-contain"
                  />
                </span>
                <p
                  className={`${poppins.className} font-medium text-xs leading-4 text-white text-center`}
                >
                  {value.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
