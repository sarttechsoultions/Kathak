import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import GurukulBanner from "@/components/GurukulBanner";
import StatsSection from "@/components/StatsSection";
import AccoladesSection from "@/components/AccoladesSection";
import MomentsOfGrace from "@/components/MomentsOfGrace";
import TestimonialsSection from "@/components/TestimonialsSection";
import GetInTouchSection from "@/components/GetInTouchSection";
import StudentReviewsSection from "@/components/StudentReviewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-[#D9383A] selection:text-white">
      {/* Top Contact Bar */}
      <TopHeader />

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Main Page Sections */}
      <main className="flex-1 bg-white">
        <HeroSection videoSrc="/herobg.mp4" />
        <AboutSection />
        <CoursesSection />
        <GurukulBanner />
        <StatsSection />
        <AccoladesSection />
        <MomentsOfGrace />
        <TestimonialsSection />
        <GetInTouchSection />
        <StudentReviewsSection />
      </main>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
