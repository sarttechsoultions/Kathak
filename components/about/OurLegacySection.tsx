export default function OurLegacySection() {
  return (
    <section id="legacy" className="relative bg-white py-16 sm:py-20 lg:py-[80px] overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[50px] items-center">
          {/* Studio portrait + experience badge */}
          <div className="relative">
            <div className="p-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about-page/legacy-studio.png"
                  alt="Guru Harshita teaching Kathak students in the studio"
                  className="h-full w-full object-cover object-[30%_center]"
                />
              </div>
            </div>

            <div className="absolute bottom-0 right-0 sm:-right-2 translate-y-2 sm:translate-y-4 size-[140px] sm:size-[192px] rounded-full bg-gradient-to-b from-[#09996f] to-[#033325] border-4 border-[#F4FAFD] shadow-xl flex flex-col items-center justify-center text-center p-4">
              <span className="font-playfair font-bold text-3xl sm:text-4xl text-white leading-10">
                10+
              </span>
              <span className="font-sans text-[10px] sm:text-xs text-white tracking-[0.6px] uppercase leading-[15px] mt-1">
                Years of Artistic
                <br />
                Excellence
              </span>
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-4 lg:pl-2">
            <p className="font-sans font-bold text-lg sm:text-2xl tracking-[1.6px] text-[#C10F3A] uppercase">
              Our Legacy
            </p>
            <h2 className="font-playfair font-bold text-3xl sm:text-4xl lg:text-[48px] leading-tight lg:leading-[60px] text-black">
              Nurturing Tradition,
              <br />
              Inspiring Generation
            </h2>
            <div className="space-y-6 font-sans text-sm sm:text-base text-black leading-6">
              <p>
                Kathak by Harshita was founded with a singular vision: to create a space where
                the ancient art of Jaipur Gharana Kathak could flourish in the modern world while
                maintaining its uncompromising technical integrity.
              </p>
              <p>
                What started as a small group of passionate learners has evolved into a global
                community. We believe that Kathak is more than just a dance; it is a spiritual
                journey that balances the fire of rhythmic footwork with the grace of narrative
                expression.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
              <div className="flex items-start gap-3">
                <span className="size-[22px] overflow-clip shrink-0 mt-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/about-page/icon-spark.svg" alt="" className="size-[22px]" />
                </span>
                <span className="font-sans text-sm sm:text-base text-[#570013] leading-6">
                  Authentic Jaipur Lineage
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-3 overflow-clip shrink-0 mt-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/about-page/icon-people.svg" alt="" className="w-6 h-3" />
                </span>
                <span className="font-sans text-sm sm:text-base text-[#570013] leading-6">
                  Inclusive Learning Environment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
