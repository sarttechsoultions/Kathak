import PageHero from "@/components/PageHero";

export default function VisionGoalsHero() {
  return (
    <PageHero
      title="Vision & Goals"
      subtitle={
        <>
          Guided by our vision. Driven by our goals.
          <br className="hidden sm:block" /> Dedicated to the growth of Kathak and every learner we
          inspire.
        </>
      }
    />
  );
}
