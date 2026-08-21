"use client";

import { Poppins } from "next/font/google";
import Reveal from "@/components/Reveal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ASSET = "/vision-goals";

const features = [
  {
    icon: `${ASSET}/icon-heritage.svg`,
    iconSize: { w: 24, h: 24 },
    title: "Preserve Heritage",
    copy: "Safeguard the purity and authenticity of Kathak for future generations.",
  },
  {
    icon: `${ASSET}/icon-globe.svg`,
    iconSize: { w: 24, h: 24 },
    title: "Global Outreach",
    copy: "Spread the beauty of Kathak worldwide and build a global community.",
  },
  {
    icon: `${ASSET}/icon-education.svg`,
    iconSize: { w: 27, h: 21 },
    title: "Quality Education",
    copy: "Provide structured, modern and result-oriented training at every level.",
  },
  {
    icon: `${ASSET}/icon-excellence.svg`,
    iconSize: { w: 25, h: 24 },
    title: "Inspire Excellence",
    copy: "Nurture talent and encourage creativity, confidence and lifelong discipline.",
  },
];

function AssetIcon({
  src,
  width,
  height,
}: {
  src: string;
  width: number;
  height: number;
}) {
  return (
    <span className="relative overflow-clip shrink-0 block" style={{ width, height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={width} height={height} className="size-full object-contain" />
    </span>
  );
}

export default function OurVisionSection() {
  return (
    <section className="relative bg-white py-14 sm:py-16 lg:py-20 overflow-visible">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-10">
          <Reveal animation="left" className="relative w-full lg:w-[42%] shrink-0">
            <div className="relative aspect-[4/5] w-full overflow-clip rounded-3xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${ASSET}/studio.png`}
                alt="Guru Harshita teaching Kathak students in the studio"
                className="absolute inset-0 size-full object-cover object-[18%_center] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <aside className="absolute z-10 bottom-6 sm:bottom-10 right-0 sm:-right-8 lg:-right-10 max-w-[280px]">
              <div className="float-y">
                <div className="rounded-tl-none rounded-tr-[24px] rounded-br-none rounded-bl-[24px] bg-gradient-to-r from-[#09996F] to-[#033325] pl-8 pr-10 py-8 shadow-lg">
              <span className="block overflow-clip" style={{ width: 26, height: 19 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ASSET}/quote-mark.svg`}
                  alt=""
                  width={26}
                  height={19}
                  className="size-full object-contain"
                />
              </span>
              <p className="mt-4 font-playfair italic text-lg leading-[24.75px] text-white">
                Kathak is not just a dance form, it&apos;s a way of life.
              </p>
                </div>
              </div>
            </aside>
          </Reveal>

          <Reveal animation="right" delay={120} className="w-full lg:flex-1 lg:pl-10 flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-[#C10F3A]" />
                <p
                  className={`${poppins.className} font-semibold text-sm leading-5 tracking-[1.4px] uppercase text-[#C10F3A]`}
                >
                  OUR VISION
                </p>
                <span className="h-px w-8 bg-[#C10F3A]" />
              </div>
              <h2 className="font-playfair font-normal text-[32px] sm:text-[40px] lg:text-[48px] leading-tight lg:leading-[48px] text-[#111827]">
                Preserving Tradition.
                <br />
                Inspiring Generations.
              </h2>
              <p
                className={`${poppins.className} font-normal text-base leading-[26px] text-[#4B5563] pt-2 max-w-[768px]`}
              >
                Our vision is to be a global leader in Kathak education, preserving the rich
                heritage of this classical art form while making it accessible to learners of all
                ages and backgrounds through innovative teaching, inclusivity, and cultural
                exchange.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="flex flex-col gap-3 items-start rounded-xl p-2 -m-2 hover:bg-[#FEF2F2]/70 transition-colors duration-300"
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <span className="size-16 rounded-full bg-[#FEF2F2] flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <AssetIcon
                      src={feature.icon}
                      width={feature.iconSize.w}
                      height={feature.iconSize.h}
                    />
                  </span>
                  <h3 className="font-playfair font-semibold text-xl leading-7 text-[#111827] pt-2">
                    {feature.title}
                  </h3>
                  <p
                    className={`${poppins.className} font-normal text-sm leading-5 text-[#4B5563]`}
                  >
                    {feature.copy}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
