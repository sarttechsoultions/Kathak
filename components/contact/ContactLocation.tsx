"use client";

import { Poppins } from "next/font/google";
import Reveal from "@/components/Reveal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const ASSET = "/contact-page";
const MAP_QUERY = "G-A-63 Bhawani Nagar Sikar Road Jaipur 302016";
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

const socials = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://youtube.com", label: "YouTube" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://pinterest.com", label: "Pinterest" },
];

const phones = [
  { href: "tel:+919079192223", label: "+91 9079192223" },
  { href: "tel:+917611043830", label: "+91 7611043830" },
  { href: "tel:+919680808062", label: "+91 9680808062" },
];

export default function ContactLocation() {
  return (
    <section className="relative bg-white pb-16 sm:pb-20">
      <div className="w-full max-w-[1110px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal animation="scale">
          <div className="relative overflow-hidden bg-white rounded-[20px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.25)] flex flex-col lg:flex-row min-h-[480px] lg:min-h-[609px]">
            <div className="bg-[#C10F3A] w-full lg:w-[81px] shrink-0 flex items-center justify-center py-6 lg:py-0">
              <div className="relative w-[26px] h-[270px] overflow-clip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ASSET}/social-strip.svg`}
                  alt=""
                  className="size-full object-contain"
                />
                <nav
                  aria-label="Contact social links"
                  className="absolute inset-0 flex flex-col"
                >
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex-1 hover:bg-white/10 transition-colors"
                    />
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[451px_1fr] gap-6 lg:gap-8 p-6 sm:p-8 lg:pl-6 lg:pr-4 lg:py-[50px] items-center">
              <div className="flex flex-col gap-6 lg:gap-8">
                <Reveal animation="left">
                  <article className="hover-lift bg-white rounded-[10px] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.25)] px-5 py-3.5 flex items-start gap-4 min-h-[94px]">
                    <span className="relative overflow-clip shrink-0 mt-2" style={{ width: 29, height: 36 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${ASSET}/icon-visit.svg`} alt="" className="size-full object-contain" />
                    </span>
                    <div>
                      <h3 className="font-playfair font-bold text-base leading-6 text-[#1A1A1A]">Visit Us</h3>
                      <p className={`${poppins.className} text-sm leading-[22.75px] text-[#6B7280]`}>
                        G-A-63 Bhawani Nagar Sikar Road Jaipur
                        <br />
                        302016, Rajasthan, India
                      </p>
                    </div>
                  </article>
                </Reveal>

                <Reveal animation="left" delay={90}>
                  <article className="hover-lift bg-white rounded-[10px] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.25)] px-5 py-3.5 flex items-start gap-4 min-h-[94px]">
                    <span className="relative overflow-clip shrink-0 mt-2.5" style={{ width: 26, height: 26 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${ASSET}/icon-call.svg`} alt="" className="size-full object-contain" />
                    </span>
                    <div>
                      <h3 className="font-playfair font-bold text-base leading-6 text-[#1A1A1A]">Call Us</h3>
                      <p className={`${poppins.className} text-sm leading-[22.75px] text-[#6B7280]`}>
                        {phones.map((phone, index) => (
                          <span key={phone.href}>
                            {index > 0 ? ", " : ""}
                            <a href={phone.href} className="hover:text-[#C10F3A] transition-colors">
                              {phone.label}
                            </a>
                          </span>
                        ))}
                      </p>
                    </div>
                  </article>
                </Reveal>

                <Reveal animation="left" delay={180}>
                  <article className="hover-lift bg-white rounded-[10px] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.25)] px-5 py-3.5 flex items-start gap-4 min-h-[94px]">
                    <span className="relative overflow-clip shrink-0 mt-2.5" style={{ width: 30, height: 24 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${ASSET}/icon-email.svg`} alt="" className="size-full object-contain" />
                    </span>
                    <div>
                      <h3 className="font-playfair font-bold text-base leading-6 text-[#1A1A1A]">Email Us</h3>
                      <a
                        href="mailto:support@kathakbyharshita.com"
                        className={`${poppins.className} text-sm leading-[22.75px] text-[#6B7280] hover:text-[#C10F3A] transition-colors break-all`}
                      >
                        support@kathakbyharshita.com
                      </a>
                    </div>
                  </article>
                </Reveal>
              </div>

              <Reveal animation="right" delay={120} className="w-full">
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open studio location in Google Maps"
                  className="relative block w-full h-[280px] sm:h-[360px] lg:h-[497px] overflow-hidden rounded-lg group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${ASSET}/map.png`}
                    alt="Map of Kathak by Harshita studio in Jaipur"
                    className="absolute inset-0 size-full object-cover object-left transition-transform duration-700 group-hover:scale-105"
                  />
                </a>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
