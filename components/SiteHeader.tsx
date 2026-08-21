import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";
import FloatingActionIcons from "@/components/FloatingActionIcons";

export default function SiteHeader() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] w-full bg-white">
        <TopHeader />
        <Navbar />
      </div>
      {/* Reserves space so page content is not hidden under the fixed header */}
      <div className="h-[100px] sm:h-[134px] w-full shrink-0" aria-hidden="true" />
      <FloatingActionIcons />
    </>
  );
}
