import type { Metadata } from "next";
import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import OurLegacySection from "@/components/about/OurLegacySection";
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
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-[#C10F3A] selection:text-white">
      <TopHeader />
      <Navbar />
      <main className="flex-1 bg-white">
        <AboutHero />
        <OurLegacySection />
        <JaipurGharanaSection />
        <GuruSection />
        <AboutStatsSection />
      </main>
      <Footer />
    </div>
  );
}
