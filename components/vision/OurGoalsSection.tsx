"use client";

import { Poppins } from "next/font/google";
import Reveal from "@/components/Reveal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ASSET = "/vision-goals";

const goals = [
  {
    icon: `${ASSET}/icon-goal-access.svg`,
    iconSize: { w: 25, h: 18 },
    title: "Accessible Education",
    copy: "Make quality Kathak education accessible to everyone, everywhere, through online & offline platforms.",
  },
  {
    icon: `${ASSET}/icon-goal-growth.svg`,
    iconSize: { w: 20, h: 18 },
    title: "Student Growth",
    copy: "Build a strong foundation for students and help them progress from beginners to performers.",
  },
  {
    icon: `${ASSET}/icon-goal-culture.svg`,
    iconSize: { w: 25, h: 20 },
    title: "Cultural Promotion",
    copy: "Promote Indian culture and classical arts through performances, workshops and collaborations.",
  },
  {
    icon: `${ASSET}/icon-goal-learn.svg`,
    iconSize: { w: 14, h: 20 },
    title: "Innovative Learning",
    copy: "Incorporate technology and creative teaching methods for an engaging learning experience.",
  },
  {
    icon: `${ASSET}/icon-goal-community.svg`,
    iconSize: { w: 25, h: 20 },
    title: "Community Building",
    copy: "Create a supportive and inspiring community of learners, artists and gurus.",
  },
  {
    icon: `${ASSET}/icon-goal-global.svg`,
    iconSize: { w: 20, h: 20 },
    title: "Global Recognition",
    copy: "Strive to bring Kathak to international stages and earn worldwide recognition.",
  },
];

export default function OurGoalsSection() {
  return (
    <section className="relative bg-[#F9FAFB]/50 py-16 sm:py-20">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-center gap-4 mb-12 lg:mb-16">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-[#C10F3A]" />
            <p
              className={`${poppins.className} font-semibold text-sm leading-5 tracking-[1.4px] uppercase text-[#C10F3A]`}
            >
              OUR GOALS
            </p>
            <span className="h-px w-8 bg-[#C10F3A]" />
          </div>
          <h2 className="font-playfair font-normal text-[28px] sm:text-[32px] lg:text-[36px] leading-10 text-[#111827] text-center">
            Steps Towards a Stronger Kathak Future
          </h2>
        </Reveal>

        <div className="relative">
          <div
            aria-hidden
            className="hidden lg:block absolute top-7 left-[6%] right-[6%] h-0.5 bg-[#E5E7EB]"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {goals.map((goal, index) => (
              <Reveal key={goal.title} delay={index * 80} animation="scale">
              <article
                className="hover-lift relative bg-white border border-[#F3F4F6] rounded-xl shadow-sm p-[25px] flex flex-col items-center gap-2 text-center h-full"
              >
                {index < goals.length - 1 ? (
                  <span
                    aria-hidden
                    className="hidden lg:block absolute -right-[5px] top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-[#C10F3A] z-10"
                  />
                ) : null}
                <span className="relative z-10 size-14 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <span
                    className="relative overflow-clip"
                    style={{ width: goal.iconSize.w, height: goal.iconSize.h }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={goal.icon}
                      alt=""
                      width={goal.iconSize.w}
                      height={goal.iconSize.h}
                      className="size-full object-contain"
                    />
                  </span>
                </span>
                <h3
                  className={`${poppins.className} font-semibold text-sm leading-5 text-[#111827] pt-2`}
                >
                  {goal.title}
                </h3>
                <p
                  className={`${poppins.className} font-normal text-xs leading-[19.5px] text-[#6B7280]`}
                >
                  {goal.copy}
                </p>
              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
