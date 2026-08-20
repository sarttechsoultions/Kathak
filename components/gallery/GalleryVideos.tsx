"use client";

import Reveal from "@/components/Reveal";

const ASSET = "/gallery-page";

const videos = [
  {
    src: `${ASSET}/video-masterclass.png`,
    title: "Kathak Masterclass 2023",
  },
  {
    src: `${ASSET}/video-diwali.png`,
    title: "Diwali Showcase",
  },
];

export default function GalleryVideos() {
  return (
    <section className="bg-[#FBF2ED] py-16 sm:py-20">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        <Reveal className="flex flex-col items-center gap-4 mb-10 sm:mb-12">
          <h2 className="font-playfair font-bold text-[32px] sm:text-[40px] leading-[48px] text-[#C10F3A] text-center">
            Video Highlights
          </h2>
          <div className="flex items-center justify-center">
            <span className="h-px w-[50px] bg-[#735C00]/30" />
            <span className="mx-4 relative overflow-clip shrink-0" style={{ width: 20, height: 20 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${ASSET}/icon-play-heading.svg`}
                alt=""
                width={20}
                height={20}
                className="size-full object-contain"
              />
            </span>
            <span className="h-px w-[50px] bg-[#735C00]/30" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <Reveal key={video.title} delay={index * 120} animation="scale">
              <article className="hover-lift relative overflow-clip rounded border border-[#E9E1DC] shadow-sm group">
                <div className="relative aspect-[16/9] w-full bg-[#323330]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.src}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="pulse-ring size-16 rounded-xl bg-[#C10F3A]/80 border-2 border-[#735C00] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <span className="relative overflow-clip" style={{ width: 14, height: 18 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${ASSET}/icon-play.svg`}
                          alt=""
                          width={14}
                          height={18}
                          className="size-full object-contain"
                        />
                      </span>
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="font-playfair font-semibold text-2xl sm:text-[28px] leading-9 text-white">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
