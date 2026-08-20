const stats = [
  { number: "2500+", label: "Students Trained" },
  { number: "10+", label: "Years Experience" },
  { number: "50+", label: "Workshops" },
  { number: "120+", label: "Performances" },
];

export default function AboutStatsSection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-16">
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-playfair font-bold text-3xl sm:text-4xl lg:text-[48px] leading-none text-[#153325]">
                {stat.number}
              </p>
              <p className="font-sans text-xs sm:text-base text-[#153325]/80 tracking-[0.8px] uppercase mt-2 leading-6">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
