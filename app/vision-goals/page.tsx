import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import VisionGoalsHero from "@/components/vision/VisionGoalsHero";
import OurVisionSection from "@/components/vision/OurVisionSection";
import OurGoalsSection from "@/components/vision/OurGoalsSection";
import CoreValuesBanner from "@/components/vision/CoreValuesBanner";
import VisionCta from "@/components/vision/VisionCta";

export const metadata: Metadata = {
  title: "Vision & Goals | Kathak by Harshita",
  description:
    "Guided by our vision. Driven by our goals. Dedicated to the growth of Kathak and every learner we inspire.",
};

export default function VisionGoalsPage() {
  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-[#C10F3A] selection:text-white">
      <SiteHeader />
      <main className="flex-1 bg-white">
        <VisionGoalsHero />
        <OurVisionSection />
        <OurGoalsSection />
        <CoreValuesBanner />
        <VisionCta />
      </main>
      <Footer />
    </div>
  );
}
