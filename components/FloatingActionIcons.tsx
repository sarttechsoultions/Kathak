"use client";

import { useEffect, useRef, useState } from "react";

const CALL_NUMBERS = [
  { href: "tel:+919079192223", label: "+91 9079192223" },
  { href: "tel:+917611043830", label: "+91 7611043830" },
];

export default function FloatingActionIcons() {
  const [callOpen, setCallOpen] = useState(false);
  const callRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!callOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!callRef.current?.contains(event.target as Node)) {
        setCallOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCallOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [callOpen]);

  return (
    <>
      <div className="fixed bottom-12 sm:bottom-8 left-3 sm:left-6 z-50 flex flex-col items-center gap-3.5">
        <div ref={callRef} className="relative">
          <button
            type="button"
            aria-label="Call Us"
            aria-expanded={callOpen}
            onClick={() => setCallOpen((open) => !open)}
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.28)]"
          >
            <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
              <circle cx="24" cy="24" r="24" fill="#C10F3A" />
              <g transform="translate(10 10) scale(1.16)" fill="#fff">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </g>
            </svg>
          </button>

          {callOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-[220px] sm:w-[240px] bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.22)] border border-stone-100 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
              <p className="px-4 pt-3 pb-2 font-playfair font-semibold text-sm text-[#C10F3A] border-b border-stone-100">
                Select a number
              </p>
              <div className="p-1.5">
                {CALL_NUMBERS.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    onClick={() => setCallOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-800 hover:bg-[#f9e7eb] hover:text-[#C10F3A] transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#C10F3A] text-white flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                        />
                      </svg>
                    </span>
                    <span className="font-sans font-semibold text-sm tracking-wide">
                      {phone.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <a
          href="https://www.instagram.com/kathakbyharshita"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Profile"
          className="w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.28)]"
        >
          <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
            <defs>
              <radialGradient id="ig-fab" cx="30%" cy="107%" r="150%">
                <stop offset="0%" stopColor="#FDF497" />
                <stop offset="5%" stopColor="#FDF497" />
                <stop offset="45%" stopColor="#FD5949" />
                <stop offset="60%" stopColor="#D6249F" />
                <stop offset="90%" stopColor="#285AEB" />
              </radialGradient>
            </defs>
            <circle cx="24" cy="24" r="24" fill="url(#ig-fab)" />
            <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2.4" />
            <circle cx="24" cy="24" r="5.2" fill="none" stroke="#fff" strokeWidth="2.4" />
            <circle cx="30.6" cy="17.4" r="1.55" fill="#fff" />
          </svg>
        </a>
      </div>

      <div className="fixed bottom-12 sm:bottom-8 right-3 sm:right-6 z-50 flex flex-col items-center gap-3.5">
        <a
          href="https://wa.me/919079192223"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center transition-transform duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1 active:scale-95 drop-shadow-[0_8px_18px_rgba(37,211,102,0.45)]"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
            <path
              fill="#25D366"
              d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"
            />
            <circle cx="12.04" cy="11.91" r="7.35" fill="#fff" />
            <path
              fill="#25D366"
              d="M8.53 7.53c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74 2.05.9 2.48.72 2.92.68.45-.05 1.45-.59 1.65-1.16.21-.56.21-1.05.15-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.72-1.67-.8-.22-.08-.38-.12-.54.12s-.62 1.16-.76 1.4c-.14.24-.28.26-.52.14-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.12.24-.3.36-.45.12-.15.16-.25.24-.41.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.38-.4-.53-.4h-.16z"
            />
          </svg>
        </a>

        <button
          type="button"
          aria-label="Chatbot Support"
          className="pulse-ring w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-[0_8px_20px_rgba(193,15,58,0.4)]"
        >
          <svg viewBox="0 0 48 48" className="w-full h-full" aria-hidden="true">
            <circle cx="24" cy="24" r="24" fill="#C10F3A" />
            <path
              fill="#fff"
              d="M14.5 16.2h19c1.66 0 3 1.34 3 3v10.1c0 1.66-1.34 3-3 3H27.2l-4.15 3.7c-.5.45-1.3.09-1.3-.55v-3.15H14.5c-1.66 0-3-1.34-3-3V19.2c0-1.66 1.34-3 3-3Z"
            />
            <circle cx="19.2" cy="24.3" r="1.85" fill="#C10F3A" />
            <circle cx="24" cy="24.3" r="1.85" fill="#C10F3A" />
            <circle cx="28.8" cy="24.3" r="1.85" fill="#C10F3A" />
          </svg>
        </button>
      </div>
    </>
  );
}
