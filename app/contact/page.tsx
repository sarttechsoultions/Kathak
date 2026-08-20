import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import GetInTouchSection from "@/components/GetInTouchSection";
import ContactLocation from "@/components/contact/ContactLocation";

export const metadata: Metadata = {
  title: "Contact | Kathak by Harshita",
  description:
    "Have a question about classes, events, or collaborations? Get in touch with Kathak by Harshita in Jaipur.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col selection:bg-[#C10F3A] selection:text-white">
      <SiteHeader />
      <main className="flex-1 bg-white">
        <AboutHero
          title="Contact"
          subtitle="Whether you're a beginner or a seasoned yogi, our sessions guide you to a healthier body and a centered mind. One breath at a time."
        />
        <GetInTouchSection />
        <ContactLocation />
      </main>
      <Footer />
    </div>
  );
}
