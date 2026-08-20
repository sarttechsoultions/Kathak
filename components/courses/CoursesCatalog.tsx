"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

type FilterId =
  | "all"
  | "beginners"
  | "intermediate"
  | "advanced"
  | "ladies"
  | "kids"
  | "hobby";

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Courses" },
  { id: "beginners", label: "Beginners" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "ladies", label: "Ladies Wellness" },
  { id: "kids", label: "Kids (Age 5+)" },
  { id: "hobby", label: "Hobby Kathak" },
];

interface LevelCourse {
  id: string;
  title: string;
  category: "beginners" | "intermediate" | "advanced";
}

const levelCourses: LevelCourse[] = [
  { id: "beginner-foundation", title: "Beginner – Foundation Level", category: "beginners" },
  { id: "beginner-prarambhik", title: "Beginner – Prarambhik Batch", category: "beginners" },
  { id: "intermediate-madhyama", title: "Intermediate – Madhyama Level", category: "intermediate" },
  { id: "intermediate-progression", title: "Intermediate – Progression Batch", category: "intermediate" },
  { id: "advanced-visharad", title: "Advanced – Visharad Level", category: "advanced" },
  { id: "advanced-performance", title: "Advanced – Performance Batch", category: "advanced" },
];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 w-full">
      <div className="flex-1 h-px bg-[#E5E7EB] min-w-4" />
      <h2 className="font-sans font-bold text-[#C10F3A] text-[13px] sm:text-[18px] lg:text-[20px] tracking-[0.4px] sm:tracking-[0.5px] uppercase text-center leading-snug max-w-[70%] sm:max-w-none sm:whitespace-nowrap">
        {label}
      </h2>
      <span className="size-3.5 sm:size-4 overflow-clip shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/courses-page/gold-dot.svg" alt="" className="size-full" />
      </span>
      <div className="flex-1 h-px bg-[#E5E7EB] min-w-4" />
    </div>
  );
}

function ActionButtons({ detailsHref }: { detailsHref: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <Link
        href={detailsHref}
        className="inline-flex h-8 items-center justify-center px-3 sm:px-[15px] rounded-full bg-[#C10F3A] text-white font-sans font-semibold text-xs sm:text-sm hover:bg-[#A01830] transition-all hover:scale-105 active:scale-95"
      >
        View Details
      </Link>
      <Link
        href="/student/enroll"
        className="inline-flex h-8 items-center justify-center px-3 sm:px-[15px] rounded-full bg-[#C10F3A] text-white font-sans font-semibold text-xs sm:text-sm hover:bg-[#A01830] transition-all hover:scale-105 active:scale-95"
      >
        Enroll now
      </Link>
    </div>
  );
}

function CardArt({ variant = "level" }: { variant?: "level" | "specialized" }) {
  return (
    <div className="absolute inset-y-0 right-0 w-[38%] sm:w-[52%] pointer-events-none overflow-hidden opacity-50 sm:opacity-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/classesbg.png"
        alt=""
        className={
          variant === "level"
            ? "absolute right-[-8%] bottom-[-4%] h-[108%] w-auto max-w-none object-contain object-right-bottom transition-transform duration-700 group-hover:scale-105"
            : "absolute right-[-10%] bottom-[2%] h-[82%] w-auto max-w-none object-contain object-right-bottom transition-transform duration-700 group-hover:scale-105"
        }
      />
    </div>
  );
}

function CourseCard({ id, title }: { id: string; title: string }) {
  return (
    <article className="hover-lift group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-black bg-gradient-to-l from-[#F4E2CC] to-white min-h-[280px] sm:min-h-[335px] shadow-sm">
      <CardArt />
      <div className="relative z-10 flex flex-col justify-between min-h-[280px] sm:min-h-[335px] p-5 sm:pl-8 sm:pr-6 sm:pt-7 sm:pb-5 max-w-[72%] sm:max-w-[62%]">
        <div className="flex flex-col gap-3 sm:gap-4">
          <h3 className="font-playfair font-bold text-[16px] sm:text-[20px] leading-6 sm:leading-7 text-[#111827]">
            {title}
          </h3>
          <div className="font-sans font-bold text-[14px] leading-5 text-black">
            <p>Group class (Online)</p>
            <ul className="list-disc pl-5 font-medium mt-1 space-y-0.5">
              <li>$ 2200 / month</li>
              <li>10 classes per month</li>
            </ul>
          </div>
          <div className="font-sans font-bold text-[14px] leading-5 text-black">
            <p>Personal (One to One) Classes</p>
            <ul className="list-disc pl-5 font-medium mt-1 space-y-0.5">
              <li>$ 400 per class</li>
              <li>Minimum 4 classes per month</li>
            </ul>
          </div>
        </div>
        <div className="pt-3">
          <ActionButtons detailsHref={`/courses/${id}`} />
        </div>
      </div>
    </article>
  );
}

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span className="size-[10.5px] overflow-clip shrink-0 flex items-center justify-center">
        <Check className="size-[10px] text-[#22C55E]" strokeWidth={3} />
      </span>
      <span className="font-sans text-[12px] leading-4 text-[#374151]">{children}</span>
    </li>
  );
}

function SpecializedCard({
  id,
  title,
  badge,
  badgeTone,
  description,
  children,
}: {
  id: string;
  title: string;
  badge: string;
  badgeTone: "online" | "flexible";
  description: string;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      className="hover-lift group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-black bg-gradient-to-l from-[#F4E2CC] to-white min-h-0 lg:min-h-[459px] flex flex-col p-4 sm:p-5 shadow-sm"
    >
      <div className="relative z-10 flex flex-col gap-3 flex-1 max-w-[80%] sm:max-w-[78%]">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-playfair font-bold text-[16px] sm:text-[18px] leading-6 sm:leading-7 text-[#111827]">{title}</h3>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase leading-[15px] ${
              badgeTone === "online"
                ? "bg-[#DCFCE7] text-[#166534]"
                : "bg-[#22C55E] text-white"
            }`}
          >
            {badge}
          </span>
        </div>
        <p className="font-sans text-[12px] leading-4 text-[#4B5563]">{description}</p>
        {children}
      </div>
      <div className="relative z-10 flex items-center gap-3 mt-4">
        <ActionButtons detailsHref={`/courses/${id}`} />
      </div>
      <CardArt variant="specialized" />
    </article>
  );
}

export default function CoursesCatalog() {
  const [active, setActive] = useState<FilterId>("all");

  const visibleLevel = useMemo((): readonly ("beginners" | "intermediate" | "advanced")[] => {
    if (active === "all") return ["beginners", "intermediate", "advanced"];
    if (active === "beginners" || active === "intermediate" || active === "advanced") {
      return [active];
    }
    return [];
  }, [active]);

  const showLadies = active === "all" || active === "ladies";
  const showKids = active === "all" || active === "kids";
  const showHobby = active === "all" || active === "hobby";
  const showSpecialized = showLadies || showKids || showHobby;

  return (
    <section className="w-full bg-white pb-16 sm:pb-20 lg:pb-24 overflow-x-hidden">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex items-center sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-6 sm:py-10 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {filters.map((filter) => {
            const selected = active === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActive(filter.id)}
                className={`shrink-0 px-3.5 sm:px-6 py-2 sm:py-[9px] rounded-full font-sans font-medium text-xs sm:text-sm transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  selected
                    ? "bg-[#C10F3A] text-white"
                    : "bg-white text-[#374151] border border-[#D1D5DB] hover:border-[#C10F3A] hover:text-[#C10F3A]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </Reveal>

        <div className="flex flex-col gap-10">
          {(["beginners", "intermediate", "advanced"] as const).map((category) => {
            if (!visibleLevel.includes(category)) return null;
            const cards = levelCourses.filter((course) => course.category === category);
            const heading =
              category === "beginners"
                ? "Beginner Courses"
                : category === "intermediate"
                  ? "Intermediate Courses"
                  : "Advanced Courses";
            return (
              <div key={category} className="flex flex-col gap-5">
                <Reveal>
                  <SectionHeading label={heading} />
                </Reveal>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                  {cards.map((course, index) => (
                    <Reveal key={course.id} delay={index * 90} animation="scale">
                      <CourseCard id={course.id} title={course.title} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}

          {showSpecialized && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {showLadies && (
                  <Reveal animation="scale" className="flex flex-col gap-3">
                    <SectionHeading label="Ladies Wellness Batch" />
                    <SpecializedCard
                      id="ladies"
                      title="Ladies Wellness Batch"
                      badge="Online"
                      badgeTone="online"
                      description="For women who wish to learn Kathak for physical fitness, mental well-being, stress relief, confidence, and self-expression."
                    >
                      <div className="flex flex-col gap-3 pt-1">
                        <div>
                          <p className="font-sans font-semibold text-[12px] leading-4 text-[#C10F3A]">
                            Group Classes (Online)
                          </p>
                          <p className="font-sans text-[12px] leading-4 text-[#4B5563] mt-1">₹2200 / month</p>
                          <p className="font-sans text-[12px] leading-4 text-[#4B5563]">8 classes per month</p>
                        </div>
                        <div>
                          <p className="font-sans font-semibold text-[12px] leading-4 text-[#C10F3A]">
                            Personal (One-on-One) Classes
                          </p>
                          <p className="font-sans text-[12px] leading-4 text-[#4B5563] mt-1">₹700 per class</p>
                          <p className="font-sans text-[12px] leading-4 text-[#4B5563]">
                            Minimum 4 classes per month
                          </p>
                        </div>
                        <div className="bg-[rgba(254,242,242,0.5)] border border-[#FEE2E2] rounded-lg px-3 pt-4 pb-3">
                          <p className="font-sans font-semibold text-[12px] leading-4 text-[#C10F3A] mb-2">
                            Benefits
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            <CheckItem>Improves physical fitness &amp; flexibility</CheckItem>
                            <CheckItem>Reduces stress &amp; promotes mental well-being</CheckItem>
                          </ul>
                        </div>
                      </div>
                    </SpecializedCard>
                  </Reveal>
                )}

                {showKids && (
                  <Reveal animation="scale" delay={90} className="flex flex-col gap-3">
                    <SectionHeading label="Kids Batch (Age 5+)" />
                    <SpecializedCard
                      id="kids"
                      title="Kids Batch (Age 5+)"
                      badge="Online"
                      badgeTone="online"
                      description="A fun and structured Kathak program designed for children to build a strong foundation while enjoying the learning process."
                    >
                      <div className="flex flex-col gap-3 pt-1">
                        <div>
                          <p className="font-sans font-semibold text-[12px] leading-4 text-[#C10F3A]">
                            Group Classes (Online)
                          </p>
                          <p className="font-sans text-[12px] leading-4 text-[#4B5563] mt-1">₹2200 / month</p>
                          <p className="font-sans text-[12px] leading-4 text-[#4B5563]">10 classes per month</p>
                        </div>
                        <div className="bg-[rgba(254,242,242,0.5)] border border-[#DBEAFE] rounded-lg px-3 pt-4 pb-3">
                          <p className="font-sans font-semibold text-[12px] leading-4 text-[#C10F3A] mb-2">
                            Benefits
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            <CheckItem>Builds rhythm and coordination</CheckItem>
                            <CheckItem>Improves focus and concentration</CheckItem>
                          </ul>
                        </div>
                      </div>
                    </SpecializedCard>
                  </Reveal>
                )}

                {showHobby && (
                  <Reveal animation="scale" delay={180} className="flex flex-col gap-3">
                    <SectionHeading label="Hobby Kathak Batch" />
                    <SpecializedCard
                      id="hobby"
                      title="Hobby Kathak Batch"
                      badge="Flexible"
                      badgeTone="flexible"
                      description="Learn Kathak at your own pace for passion, culture and personal growth."
                    >
                      <div className="pt-1">
                        <p className="font-sans font-semibold text-[12px] leading-4 text-[#C10F3A] mb-2">
                          What You Get
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          <CheckItem>Learn at your own pace</CheckItem>
                          <CheckItem>Focus on traditional art &amp; culture</CheckItem>
                          <CheckItem>Improve grace, posture &amp; expressions</CheckItem>
                        </ul>
                      </div>
                    </SpecializedCard>
                  </Reveal>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
