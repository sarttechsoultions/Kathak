export default function GuruSection() {
  return (
    <section className="bg-[#F4FAFD] py-16 sm:py-20 lg:py-[80px]">
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="bg-[#C10F3A] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div className="w-full lg:w-[447px] h-[360px] sm:h-[440px] lg:h-[500px] shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-lg shadow-inner border-4 border-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about-page/guru-portrait.png"
                alt="Guru Harshita"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          <div className="flex-1 text-white py-2 lg:py-8 lg:pr-12 space-y-2">
            <p className="font-sans text-sm sm:text-base tracking-[1.6px] uppercase text-[#D9BE7A]">
              The Visionary
            </p>
            <h2 className="font-playfair font-bold text-3xl sm:text-4xl lg:text-[48px] leading-tight lg:leading-[56px] pb-4">
              Guru Harshita
            </h2>
            <blockquote className="border-l-4 border-stone-200 pl-6 opacity-90 font-sans text-sm sm:text-base leading-6 italic">
              &ldquo;Kathak is my language. It is how I speak to the world, and how I honor my
              ancestors. My mission is to ensure every student finds their own voice through
              this rhythm.&rdquo;
            </blockquote>
            <p className="font-sans text-sm sm:text-base leading-6 pt-6">
              With over two decades of rigorous training and stage experience, Harshita has
              dedicated her life to the propagation of Jaipur Gharana. Her teaching methodology
              balances strict traditional discipline with contemporary pedagogical approaches,
              making the art accessible to students across the globe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
