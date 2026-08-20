import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import GalleryVideos from "@/components/gallery/GalleryVideos";

export const metadata: Metadata = {
  title: "Our Gallery | Kathak by Harshita",
  description:
    "Capturing the rhythm, grace, and tradition of Kathak and Indian classical arts.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-[#C10F3A] selection:text-white">
      <SiteHeader />
      <main className="flex-1 bg-white">
        <GalleryHero />
        <GalleryGrid />
        <GalleryVideos />
      </main>
      <Footer />
    </div>
  );
}
