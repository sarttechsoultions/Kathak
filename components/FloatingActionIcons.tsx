import { Bot } from "lucide-react";

export default function FloatingActionIcons() {
  return (
    <>
      <div className="fixed bottom-12 sm:bottom-8 left-3 sm:left-6 z-50 flex flex-col items-center gap-3">
        <a
          href="tel:+919079192223"
          aria-label="Call Us"
          className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-115 hover:-translate-y-1 active:scale-95 drop-shadow-xl hover:drop-shadow-2xl group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/phone.png" alt="Phone" className="w-full h-full object-contain filter group-hover:brightness-110 transition-all" />
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Profile"
          className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-115 hover:-translate-y-1 active:scale-95 drop-shadow-xl hover:drop-shadow-2xl group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/insta.png" alt="Instagram" className="w-full h-full object-contain filter group-hover:brightness-110 transition-all" />
        </a>
      </div>

      <div className="fixed bottom-12 sm:bottom-8 right-3 sm:right-6 z-50 flex flex-col items-center gap-3">
        <a
          href="https://wa.me/919079192223"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-115 hover:-translate-y-1 active:scale-95 drop-shadow-xl hover:drop-shadow-2xl group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/whatsapp.png" alt="WhatsApp" className="w-full h-full object-contain filter group-hover:brightness-110 transition-all" />
        </a>

        <button
          type="button"
          aria-label="Chatbot Support"
          className="pulse-ring w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[#C10F3A] hover:bg-[#A01830] text-white flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-xl hover:shadow-2xl p-3"
        >
          <Bot className="w-7 h-7 text-white" />
        </button>
      </div>
    </>
  );
}
