import PageHero from "@/components/PageHero";

interface PageHeroProps {
  title?: string;
  subtitle?: string;
}

export default function AboutHero({
  title = "About",
  subtitle = "Whether you're a beginner discovering Kathak for the first time or an experienced dancer refining your art, our classes honor the authentic Jaipur Gharana tradition while nurturing your individual journey. One step at a time, one beat at a time.",
}: PageHeroProps) {
  return <PageHero title={title} subtitle={subtitle} />;
}
