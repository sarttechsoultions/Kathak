import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import OurLegacySection from "@/components/about/OurLegacySection";
import AboutPathSection from "@/components/about/AboutPathSection";
import JaipurGharanaSection from "@/components/about/JaipurGharanaSection";
import GuruSection from "@/components/about/GuruSection";
import AboutStatsSection from "@/components/about/AboutStatsSection";

export const metadata: Metadata = {
  title: "About Us | Kathak by Harshita",
  description:
    "Our story of preserving Jaipur Gharana Kathak — the legacy, the splendor of the tradition, and the vision of Guru Harshita.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col overflow-x-clip selection:bg-[#C10F3A] selection:text-white">
      <SiteHeader />
      <main className="flex-1 bg-white">
        <AboutHero />
        <OurLegacySection />
        <AboutPathSection />
        <JaipurGharanaSection />
        <GuruSection />
        <AboutStatsSection />
      </main>
      <Footer />
    </div>
  );
}
