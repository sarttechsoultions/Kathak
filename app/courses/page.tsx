import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CoursesHero from "@/components/courses/CoursesHero";
import CoursesCatalog from "@/components/courses/CoursesCatalog";

export const metadata: Metadata = {
  title: "Courses | Kathak by Harshita",
  description:
    "Begin your journey into Kathak — a dance of rhythm, grace, and soul. Find your expression through intricate footwork, storytelling, and classical heritage.",
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col overflow-x-clip selection:bg-[#C10F3A] selection:text-white">
      <SiteHeader />
      <main className="flex-1 bg-white">
        <CoursesHero />
        <CoursesCatalog />
      </main>
      <Footer />
    </div>
  );
}
