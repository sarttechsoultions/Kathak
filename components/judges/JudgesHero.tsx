import PageHero from "@/components/PageHero";

export default function JudgesHero() {
  return (
    <PageHero
      title="Judges & Choreographers"
      subtitle={
        <>
          Guided by masters. Inspired by excellence.
          <br className="hidden sm:block" /> Meet the visionary experts who shape, evaluate and
          elevate the art of Kathak
        </>
      }
      imageAlt="Kathak dancer in traditional attire"
    />
  );
}
