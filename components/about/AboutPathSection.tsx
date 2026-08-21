"use client";

import Reveal from "@/components/Reveal";

export default function AboutPathSection() {
  return (
    <section className="relative bg-white pt-6 sm:pt-8 pb-14 sm:pb-20">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[50px] items-center">
          <Reveal animation="left" className="w-full lg:flex-1 flex flex-col gap-3 sm:gap-4">
            <p className="font-sans font-bold text-sm sm:text-lg lg:text-[24px] leading-6 tracking-[1.2px] sm:tracking-[1.6px] text-[#C10F3A] uppercase">
              About Kathak by Harshita
            </p>
            <h2 className="font-playfair font-bold text-[28px] sm:text-[40px] lg:text-[48px] leading-tight lg:leading-[60px] text-black">
              The Path of Classical Dance Begins Here
            </h2>
            <div className="flex flex-col gap-3 font-sans text-[15px] sm:text-[16px] leading-6 text-black">
              <p className="font-medium">
                Qualified the NTA UGC NET 2023 in Performing Arts with specialization in Dance,
                demonstrating expertise in classical and contemporary dance forms.
              </p>
              <p>
                Trained under Guru Dr. Swati Agarwal from the lineage of Pt. Girdhari Maharaj.
                Ministry of Culture Scholar with Master&apos;s degree and multiple professional
                certifications in Kathak.
              </p>
              <p>
                <span className="font-bold">Special Honor</span>: Performed at Republic Day Parade
                2023, Kartavya Path, New Delhi.
              </p>
              <p>Passionate about preserving classical Kathak and teaching the next generation of dancers.</p>
              <p>
                Kathak is not just an art form for Harshita—it is her way of connecting hearts,
                culture, and emotions through rhythm and expression.
              </p>
              <p>
                From her early years, Harshita showed an extraordinary inclination towards dance.
                Her graceful movements, deep understanding of rhythm, and soulful abhinaya soon
                made her stand apart. Over the years, she trained under renowned Gurus, performed
                at prestigious festivals, and represented Indian classical dance on both national
                and international platforms.
              </p>
              <p className="font-bold">
                Doordarshan Graded Artist | University Gold Medalist | Ministry of Culture Scholar
              </p>
              <p>
                Trained under <span className="font-bold">Guru Dr. Swati Agarwal</span> from the
                lineage of legendary <span className="font-semibold">Guru Pt. Girdhari Maharaj</span>
                , Harshita holds multiple certifications in Kathak.
              </p>
            </div>
          </Reveal>

          <Reveal animation="right" delay={120} className="w-full lg:flex-1">
            <div className="relative w-full h-[300px] sm:h-[460px] lg:h-[640px] overflow-hidden rounded group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about-page/legacy-studio.jpg"
                alt="Guru Harshita with students at Kathak by Harshita"
                className="h-full w-full object-cover object-[18%_center] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
