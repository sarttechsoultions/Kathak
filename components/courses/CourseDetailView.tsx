"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { LearningMode, PublicCourse } from "@/lib/publicCourses";
import Reveal from "@/components/Reveal";

const ASSET = "/course-detail";

const features = [
  {
    icon: `${ASSET}/icon-expert.svg`,
    title: "Expert Guidance",
    copy: "Learn from experienced Kathak teachers",
  },
  {
    icon: `${ASSET}/icon-personal.svg`,
    title: "Personal Attention",
    copy: "Small batches for better learning",
  },
  {
    icon: `${ASSET}/icon-timings.svg`,
    title: "Flexible Timings",
    copy: "Choose timings that suit you",
  },
  {
    icon: `${ASSET}/icon-lifetime.svg`,
    title: "Lifetime Support",
    copy: "We are with you every step",
  },
];

const examSteps = [
  {
    n: "1",
    title: "Weekly Assignments",
    copy: "Practice based tasks to improve skills",
  },
  {
    n: "2",
    title: "Teacher Feedback",
    copy: "Personalized feedback on your progress",
  },
  {
    n: "3",
    title: "Monthly Evaluation",
    copy: "Performance review and improvement tips",
  },
  {
    n: "4",
    title: "Final Exam",
    copy: "Practical & theory exam at the end of course",
  },
];

const opportunities = [
  {
    icon: `${ASSET}/icon-advanced.svg`,
    title: "Continue Advanced Learning",
    copy: "Progress to Intermediate and Advanced levels.",
  },
  {
    icon: `${ASSET}/icon-stage.svg`,
    title: "Stage Performances",
    copy: "Participate in recitals and cultural events.",
  },
  {
    icon: `${ASSET}/icon-teaching.svg`,
    title: "Teaching Opportunities",
    copy: "Start your journey as a Kathak instructor.",
  },
  {
    icon: `${ASSET}/icon-ambassador.svg`,
    title: "Cultural Ambassador",
    copy: "Represent Indian classical dance at national & international events.",
  },
  {
    icon: `${ASSET}/icon-growth.svg`,
    title: "Personal Growth",
    copy: "Improved confidence, discipline, and overall personality.",
  },
  {
    icon: `${ASSET}/icon-certificate.svg`,
    title: "Certification Advantage",
    copy: "Use your certificate to highlight your skills in dance.",
  },
];

const trustItems = [
  { icon: `${ASSET}/icon-personal.svg`, title: "Batch Size", copy: "8 - 15 Students" },
  { icon: `${ASSET}/icon-support.svg`, title: "Support", copy: "Dedicated Student Support" },
  { icon: `${ASSET}/icon-refund.svg`, title: "Refund Policy", copy: "7 Days Easy Refund" },
  { icon: `${ASSET}/icon-payment.svg`, title: "Payment Options", copy: "Secure & Easy Payments" },
  { icon: `${ASSET}/icon-accredited.svg`, title: "Accredited", copy: "Trusted by 1000+ Students" },
];

const highlights = [
  { icon: `${ASSET}/icon-beginner.svg`, label: "Beginner Friendly" },
  { icon: `${ASSET}/icon-steps.svg`, label: "Step-by-Step Learning" },
  { icon: `${ASSET}/icon-doubt.svg`, label: "Live Doubt Sessions" },
  { icon: `${ASSET}/icon-performance.svg`, label: "Performance Opportunities" },
  { icon: `${ASSET}/icon-foundation.svg`, label: "Build Strong Foundation" },
];

const perks = [
  { icon: `${ASSET}/icon-batches.svg`, label: "Flexible Batches" },
  { icon: `${ASSET}/icon-weekend.svg`, label: "Weekend & Weekday Options" },
  { icon: `${ASSET}/icon-guarantee.svg`, label: "100% Satisfaction Guarantee" },
];

function AssetIcon({ src, size }: { src: string; size: number }) {
  return (
    <span
      className="relative overflow-clip shrink-0 block"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={size} height={size} className="size-full object-contain" />
    </span>
  );
}

function splitPrice(price: string) {
  const parts = price.split(/\s*\/\s*/);
  return {
    amount: parts[0]?.trim() ?? price,
    unit: parts[1] ? `/ ${parts[1].trim()}` : "",
  };
}

function splitDuration(title: string) {
  const match = title.match(/^(.*?)\s+(\([^)]+\))$/);
  return match ? { heading: match[1], sub: match[2] } : { heading: title, sub: null };
}

function AboutParagraph({ title, text }: { title: string; text: string }) {
  const emphasis = "confidence and grace in dance";
  const pattern = new RegExp(
    `(${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|${emphasis})`,
    "g"
  );
  const chunks = text.split(pattern);

  return (
    <p className="font-sans text-[15px] sm:text-base leading-6 sm:leading-[26px] text-[#4B5563]">
      {chunks.map((chunk, index) =>
        chunk === title || chunk === emphasis ? (
          <span key={index} className="font-semibold text-[#111827]">
            {chunk}
          </span>
        ) : (
          <span key={index}>{chunk}</span>
        )
      )}
    </p>
  );
}

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">
        <AssetIcon src={`${ASSET}/icon-check.svg`} size={20} />
      </span>
      <span className="font-sans text-[15px] sm:text-base leading-6 text-[#374151]">{children}</span>
    </li>
  );
}

function PricingCard({ course }: { course: PublicCourse }) {
  const options = useMemo(() => {
    const list: {
      id: LearningMode;
      fee: NonNullable<PublicCourse["group"]>;
      icon: string;
    }[] = [];
    if (course.group) {
      list.push({ id: "group", fee: course.group, icon: `${ASSET}/icon-group.svg` });
    }
    if (course.personal) {
      list.push({
        id: "personal",
        fee: course.personal,
        icon: `${ASSET}/icon-one-to-one.svg`,
      });
    }
    return list;
  }, [course]);

  const [mode, setMode] = useState<LearningMode>(options[0]?.id ?? "group");

  return (
    <aside className="bg-white border-2 border-[#FEE2E2] rounded-2xl shadow-sm pt-3 pb-5 sm:pb-[26px] px-4 sm:px-[26px] flex flex-col gap-5">
      <h2 className="font-sans font-bold text-base sm:text-lg leading-7 text-[#C10F3A] text-center">
        Choose Your Learning Mode
      </h2>

      <div className="flex flex-col gap-6">
        {options.map((option) => {
          const active = option.id === mode;
          const { amount, unit } = splitPrice(option.fee.price);
          return (
            <div
              key={option.id}
              className={`relative rounded-xl p-3.5 sm:p-[17px] transition-all duration-300 ${
                active
                  ? "bg-[#FEF2F2]/30 border border-[#FECACA] shadow-sm"
                  : "bg-white border border-[#E5E7EB] hover:border-[#FECACA]"
              }`}
            >
              <button
                type="button"
                onClick={() => setMode(option.id)}
                className="absolute left-1.5 top-[18px] size-5 rounded-full border-2 shrink-0 flex items-center justify-center cursor-pointer bg-white"
                style={{ borderColor: active ? "#C10F3A" : "#D1D5DB" }}
                aria-pressed={active}
                aria-label={`Select ${option.fee.label}`}
              >
                {active ? <span className="size-3 rounded-full bg-[#C10F3A]" /> : null}
              </button>

              <div className="pl-4 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans font-bold text-sm sm:text-base leading-5 sm:leading-6 text-[#111827] pr-2">
                    {option.fee.label}
                  </h3>
                  <AssetIcon src={option.icon} size={20} />
                </div>
                <p className="font-sans">
                  <span className="font-bold text-lg leading-7 text-[#111827]">{amount} </span>
                  {unit ? (
                    <span className="font-normal text-sm leading-5 text-[#6B7280]">{unit}</span>
                  ) : null}
                </p>
                <p className="font-sans text-sm leading-5 text-[#4B5563] pb-3">
                  {option.fee.note}
                </p>
                <Link
                  href="/student/enroll"
                  onClick={() => setMode(option.id)}
                  className={`inline-flex w-full h-10 items-center justify-center rounded-lg font-sans font-medium text-sm leading-5 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    active
                      ? "bg-[#C10F3A] text-white shadow-sm hover:bg-[#A01830]"
                      : "bg-white border border-[#C10F3A] text-[#C10F3A] hover:bg-[#FEF2F2]"
                  }`}
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <ul className="border-t border-[#F3F4F6] pt-6 flex flex-col gap-3">
        {perks.map((perk) => (
          <li key={perk.label} className="flex items-center gap-2">
            <AssetIcon src={perk.icon} size={16} />
            <span className="font-sans text-sm leading-5 text-[#4B5563]">{perk.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function CourseDetailView({ course }: { course: PublicCourse }) {
  const duration = splitDuration(course.durationTitle);
  const about = course.about ?? course.intro;

  return (
    <div className="bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[40px] py-6 sm:py-10 lg:py-8">
        <Reveal>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#6B7280] hover:text-[#C10F3A] transition-all mb-6 w-fit group"
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Courses
          </Link>
        </Reveal>
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-[40px] xl:gap-12 items-start">
          <div className="flex flex-col gap-8 sm:gap-12">
            <Reveal className="flex flex-col gap-4 sm:gap-6">
              <h1 className="font-playfair font-bold text-xl sm:text-2xl leading-7 sm:leading-8 text-[#111827] flex items-center gap-2">
                <AssetIcon src={`${ASSET}/icon-about-flower.svg`} size={24} />
                About This Course
              </h1>
              <AboutParagraph title={course.title} text={about} />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
                {features.map((feature, index) => (
                  <Reveal key={feature.title} delay={index * 80} animation="scale">
                  <article
                    className="hover-lift bg-white border border-[#FEE2E2] rounded-xl shadow-sm p-3 sm:p-[17px] flex flex-col items-center text-center h-full"
                  >
                    <span className="size-10 sm:size-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-2 sm:mb-3">
                      <AssetIcon src={feature.icon} size={24} />
                    </span>
                    <h3 className="font-sans font-semibold text-[13px] sm:text-sm leading-5 text-[#111827] mb-1">
                      {feature.title}
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs leading-4 text-[#6B7280]">{feature.copy}</p>
                  </article>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal>
            <section className="bg-white border border-[#FEE2E2] rounded-2xl shadow-sm p-4 sm:p-8 flex flex-col gap-5 sm:gap-6">
              <h2 className="font-playfair font-bold text-lg sm:text-xl leading-7 text-[#111827] flex items-center gap-2">
                <AssetIcon src={`${ASSET}/icon-includes.svg`} size={20} />
                Course Includes
              </h2>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4">
                {course.includes.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
            </section>
            </Reveal>

            <div className="lg:hidden">
              <Reveal>
                <PricingCard course={course} />
              </Reveal>
            </div>

            <Reveal>
            <section className="bg-white border border-[#FEE2E2] rounded-2xl shadow-sm p-4 sm:p-8 flex flex-col gap-5 sm:gap-6">
              <h2 className="font-playfair font-bold text-lg sm:text-xl leading-7 text-[#111827] flex items-center gap-2">
                <AssetIcon src={`${ASSET}/icon-learn.svg`} size={20} />
                What You&apos;ll Learn
              </h2>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4">
                {course.learn.map((item) => (
                  <CheckItem key={item}>{item}</CheckItem>
                ))}
              </ul>
            </section>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Reveal animation="scale">
              <article className="hover-lift bg-white border border-[#FEE2E2] rounded-xl shadow-sm p-4 sm:p-[25px] flex flex-col gap-4 h-full">
                <div className="flex items-center gap-3">
                  <span className="size-9 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                    <AssetIcon src={`${ASSET}/icon-class-mode.svg`} size={20} />
                  </span>
                  <h3 className="font-sans font-bold text-base leading-6 text-[#111827]">
                    Class Mode
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="font-sans font-semibold text-sm leading-5 text-[#1F2937]">
                      Online Classes
                    </h4>
                    <p className="font-sans text-xs leading-4 text-[#6B7280] mt-0.5">
                      Live interactive sessions on Google Meet / Zoom
                    </p>
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-sm leading-5 text-[#1F2937]">
                      Offline Classes
                    </h4>
                    <p className="font-sans text-xs leading-4 text-[#6B7280] mt-0.5">
                      At our academy studio (Jaipur, Rajasthan)
                    </p>
                  </div>
                </div>
              </article>
              </Reveal>

              <Reveal animation="scale" delay={90}>
              <article className="hover-lift bg-white border border-[#FEE2E2] rounded-xl shadow-sm p-4 sm:p-[25px] flex flex-col gap-4 h-full">
                <div className="flex items-center gap-3">
                  <span className="size-9 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                    <AssetIcon src={`${ASSET}/icon-duration.svg`} size={20} />
                  </span>
                  <h3 className="font-sans font-bold text-base leading-6 text-[#111827]">
                    Course Duration
                  </h3>
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-sm leading-5 text-[#1F2937]">
                    {duration.heading}
                  </h4>
                  {duration.sub ? (
                    <p className="font-sans text-xs leading-4 text-[#6B7280] mt-0.5">
                      {duration.sub}
                    </p>
                  ) : null}
                  <div className="border-t border-[#F3F4F6] mt-4 pt-2.5 flex items-start gap-2">
                    <span className="mt-0.5">
                      <AssetIcon src={`${ASSET}/icon-clock.svg`} size={16} />
                    </span>
                    <p className="font-sans text-xs leading-4 text-[#4B5563]">
                      {course.durationNote}
                    </p>
                  </div>
                </div>
              </article>
              </Reveal>

              <Reveal animation="scale" delay={180}>
              <article className="hover-lift bg-white border border-[#FEE2E2] rounded-xl shadow-sm p-4 sm:p-[25px] flex flex-col gap-4 h-full">
                <div className="flex items-center gap-3">
                  <span className="size-9 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                    <AssetIcon src={`${ASSET}/icon-eligibility.svg`} size={20} />
                  </span>
                  <h3 className="font-sans font-bold text-base leading-6 text-[#111827]">
                    Eligibility
                  </h3>
                </div>
                <p className="font-sans text-sm leading-5 text-[#374151]">
                  {course.eligibilityTitle}
                </p>
                <div className="border-t border-[#F3F4F6] pt-2.5">
                  <p className="font-sans text-sm leading-5 text-[#374151]">
                    {course.eligibilityNote}
                  </p>
                </div>
              </article>
              </Reveal>
            </div>

            <Reveal>
            <section className="bg-white border border-[#FEE2E2] rounded-2xl shadow-sm p-4 sm:p-8 flex flex-col gap-6 sm:gap-8">
              <h2 className="font-playfair font-bold text-lg sm:text-xl leading-7 text-[#111827]">
                Assignments & Exam
              </h2>
              <ol className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <span
                  aria-hidden
                  className="hidden lg:block absolute left-12 right-12 top-6 h-0.5 bg-[#FEE2E2]"
                />
                {examSteps.map((step) => (
                  <li key={step.n} className="relative flex flex-col items-center text-center">
                    <span className="size-12 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] shadow-sm flex items-center justify-center font-sans font-bold text-lg leading-7 text-[#C10F3A] mb-4 bg-clip-padding transition-transform duration-300 hover:scale-110">
                      {step.n}
                    </span>
                    <h3 className="font-sans font-semibold text-sm leading-5 text-[#111827] mb-2">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs leading-4 text-[#6B7280]">{step.copy}</p>
                  </li>
                ))}
              </ol>
            </section>
            </Reveal>

            <Reveal className="flex flex-col gap-2">
              <div className="flex items-start sm:items-center gap-2">
                <h2 className="font-playfair font-bold text-xl sm:text-2xl leading-7 sm:leading-8 text-[#111827]">
                  Future Opportunities After Completing This Course
                </h2>
                <span className="shrink-0 mt-1 sm:mt-0">
                  <AssetIcon src={`${ASSET}/icon-spark.svg`} size={16} />
                </span>
              </div>
              <p className="font-sans text-sm leading-5 text-[#4B5563]">
                Build a strong foundation today and unlock endless possibilities tomorrow.
              </p>
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 pt-4 sm:pt-6 items-stretch">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 flex-1">
                  {opportunities.map((item) => (
                    <article key={item.title} className="flex items-start gap-4 rounded-lg p-1 -m-1 hover:bg-[#FEF2F2]/60 transition-colors duration-300">
                      <span className="size-9 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                        <AssetIcon src={item.icon} size={20} />
                      </span>
                      <div>
                        <h3 className="font-sans font-bold text-sm leading-5 text-[#111827]">
                          {item.title}
                        </h3>
                        <p className="font-sans text-xs leading-4 text-[#6B7280] mt-0.5">
                          {item.copy}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                <aside className="relative overflow-clip rounded-2xl bg-[#C10F3A] px-5 py-7 sm:px-8 sm:py-9 w-full lg:w-[244px] shrink-0 flex flex-col justify-center">
                  <span className="absolute -bottom-12 -right-12 opacity-20 size-48 overflow-clip spin-slow">
                    <AssetIcon src={`${ASSET}/quote-mandala.svg`} size={192} />
                  </span>
                  <p className="relative font-playfair italic text-lg sm:text-xl leading-7 sm:leading-[32.5px] text-white">
                    &ldquo;Every step you learn today is a stage towards a beautiful tomorrow.&rdquo;
                  </p>
                  <span className="relative mt-4 block w-12 h-0.5 bg-[#CFB53B]" />
                </aside>
              </div>
            </Reveal>

            <Reveal className="border-y border-[#E5E7EB] py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 sm:gap-y-6">
                {trustItems.map((item) => (
                  <div key={item.title} className="flex items-start sm:items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5">
                    <AssetIcon src={item.icon} size={24} />
                    <div>
                      <p className="font-sans font-semibold text-sm leading-5 text-[#111827]">
                        {item.title}
                      </p>
                      <p className="font-sans text-xs leading-4 text-[#6B7280]">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="flex flex-col sm:flex-row gap-5">
              <Reveal animation="left" className="relative overflow-clip rounded-2xl shadow-md w-full sm:w-[379px] sm:max-w-[50%] lg:max-w-none shrink-0 group">
                <div className="relative aspect-[379/212] w-full overflow-clip">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${ASSET}/intro-video.png`}
                    alt=""
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <span className="pulse-ring size-14 rounded-full bg-white flex items-center justify-center shadow-lg pl-1 transition-transform duration-300 group-hover:scale-110">
                      <AssetIcon src={`${ASSET}/icon-play.svg`} size={24} />
                    </span>
                    <p className="mt-3 font-sans font-medium text-sm leading-5 text-white tracking-wide">
                      Watch Intro Video
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal animation="right" delay={120} className="flex-1">
              <aside className="h-full bg-[#FEF2F2]/50 border border-[#FEE2E2] rounded-2xl p-4 sm:p-[25px] flex flex-col gap-4">
                <h2 className="font-playfair font-bold text-base sm:text-lg leading-7 text-[#111827]">
                  Course Highlights
                </h2>
                <ul className="flex flex-col gap-4">
                  {highlights.map((item) => (
                    <li key={item.label} className="flex items-center gap-3">
                      <span className="size-7 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                        <AssetIcon src={item.icon} size={16} />
                      </span>
                      <span className="font-sans text-sm leading-5 text-[#374151]">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
              </Reveal>
            </div>
          </div>

          <div className="hidden lg:block sticky top-[140px]">
            <Reveal animation="right">
              <PricingCard course={course} />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
