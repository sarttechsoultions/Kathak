import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";
import FloatingActionIcons from "@/components/FloatingActionIcons";

export default function SiteHeader() {
  return (
    <>
      <div className="sticky top-0 z-[100] w-full bg-white">
        <TopHeader />
        <Navbar />
      </div>
      <FloatingActionIcons />
    </>
  );
}
