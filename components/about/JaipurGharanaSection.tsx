const pillars = [
  {
    number: "1",
    title: "Technical Precision",
    description:
      "Emphasis on intricate footwork (Tatkar) and complex rhythmic patterns (Layakari) executed with lightning speed and mathematical accuracy.",
  },
  {
    number: "2",
    title: "Spirituality",
    description:
      "Tracing roots back to temple dancers, the Jaipur style focuses heavily on ‘Bhakti’ and spiritual devotion through expressive storytelling (Abhinaya).",
  },
  {
    number: "3",
    title: "Stately Chakkars",
    description:
      "Renowned for powerful, rapid-fire pirouettes (Chakkars) that stop precisely on the beat, showcasing immense balance and control.",
  },
];

export default function JaipurGharanaSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-[80px] overflow-hidden">
      {/* Decorative mandala — same asset used on the homepage About section */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 max-w-[280px] sm:max-w-[420px] translate-x-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about/image 14.png"
          alt=""
          className="w-full h-auto object-contain select-none"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 lg:mb-16">
          <h2 className="font-playfair font-bold text-3xl sm:text-4xl lg:text-[48px] leading-tight lg:leading-[56px] text-[#C10F3A]">
            The Splendor of Jaipur Gharana
          </h2>
          <p className="font-sans text-sm sm:text-base text-black leading-6">
            Distinctive for its vigor, technical prowess, and spiritual depth, our lineage
            celebrates the &lsquo;Vira Rasa&rsquo;—the heroic sentiment of classical dance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {pillars.map((pillar) => (
            <article
              key={pillar.number}
              className="relative bg-white/60 backdrop-blur-[2px] border border-[rgba(224,191,191,0.3)] rounded-lg p-8 pt-10 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute left-1/2 -translate-x-1/2 -top-6 size-12 rounded-xl bg-[#C10F3A] shadow-lg flex items-center justify-center">
                <span className="font-sans font-bold text-2xl text-white leading-6">
                  {pillar.number}
                </span>
              </div>
              <h3 className="font-playfair font-semibold text-xl sm:text-2xl text-[#C10F3A] leading-8 mb-2">
                {pillar.title}
              </h3>
              <p className="font-sans text-sm sm:text-base text-black leading-6">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
