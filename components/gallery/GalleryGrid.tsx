"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";

const ASSET = "/gallery-page";

type GalleryFilter = "all" | "harshita" | "student" | "media" | "video";

const filters: { id: GalleryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "harshita", label: "Harshita's Gallery" },
  { id: "student", label: "Student Gallery" },
  { id: "media", label: "Media Coverage" },
  { id: "video", label: "Video Gallery" },
];

const photos = [
  {
    src: `${ASSET}/photo-1.png`,
    alt: "Guru Harshita teaching a young student",
    category: "harshita" as const,
    aspect: "aspect-[368/275]",
  },
  {
    src: `${ASSET}/photo-2.png`,
    alt: "Kathak dancers in a traditional courtyard",
    category: "student" as const,
    aspect: "aspect-[368/659]",
  },
  {
    src: `${ASSET}/photo-3.png`,
    alt: "Kathak dancer's feet with ghungroos",
    category: "harshita" as const,
    aspect: "aspect-[368/549]",
  },
  {
    src: `${ASSET}/photo-4.png`,
    alt: "Kathak dancer performing in a courtyard",
    category: "student" as const,
    aspect: "aspect-[368/247]",
  },
  {
    src: `${ASSET}/photo-5.png`,
    alt: "Kathak dancer on stage",
    category: "media" as const,
    aspect: "aspect-[368/201]",
  },
  {
    src: `${ASSET}/photo-6.png`,
    alt: "Group Kathak performance",
    category: "media" as const,
    aspect: "aspect-[368/247]",
  },
];

export default function GalleryGrid() {
  const [active, setActive] = useState<GalleryFilter>("all");

  const visible = useMemo(
    () => (active === "all" ? photos : photos.filter((photo) => photo.category === active)),
    [active]
  );

  return (
    <section className="bg-white pt-8 sm:pt-10 pb-4">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        <Reveal className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          {filters.map((filter) => {
            const selected = active === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActive(filter.id)}
                className={`px-[25px] py-[9px] rounded-xl font-sans text-base leading-6 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  selected
                    ? "bg-[#C10F3A] text-white border border-[#735C00] shadow-sm"
                    : "bg-[#FFF8F5] text-[#C10F3A] border border-[#C10F3A]/30 hover:border-[#C10F3A]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </Reveal>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {visible.map((photo, index) => (
            <Reveal
              key={`${photo.src}-${active}`}
              delay={index * 80}
              animation="scale"
              className="mb-6 break-inside-avoid"
            >
            <figure className="hover-lift relative overflow-clip rounded bg-[#FFF8F5] border-t-4 border-[#6B0026] shadow-sm group">
              <div className={`relative w-full overflow-clip ${photo.aspect}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#6B0026]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="relative overflow-clip" style={{ width: 44, height: 30 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${ASSET}/icon-zoom.svg`}
                      alt=""
                      width={44}
                      height={30}
                      className="size-full object-contain"
                    />
                  </span>
                </div>
              </div>
            </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
