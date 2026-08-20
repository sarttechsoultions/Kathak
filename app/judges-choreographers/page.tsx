import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import JudgesHero from "@/components/judges/JudgesHero";
import JudgingExperience from "@/components/judges/JudgingExperience";
import OrganizersChoose from "@/components/judges/OrganizersChoose";
import ChoreographerExtraordinaire from "@/components/judges/ChoreographerExtraordinaire";
import ProductionsOfferings from "@/components/judges/ProductionsOfferings";
import JudgesCta from "@/components/judges/JudgesCta";

export const metadata: Metadata = {
  title: "Judges & Choreographers | Kathak by Harshita",
  description:
    "Guided by masters. Inspired by excellence. Meet the visionary experts who shape, evaluate and elevate the art of Kathak.",
};

export default function JudgesChoreographersPage() {
  return (
    <div
      id="judges"
      className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-[#C10F3A] selection:text-white"
    >
      <SiteHeader />
      <main className="flex-1 bg-white">
        <JudgesHero />
        <JudgingExperience />
        <OrganizersChoose />
        <ChoreographerExtraordinaire />
        <ProductionsOfferings />
        <JudgesCta />
      </main>
      <Footer />
    </div>
  );
}
