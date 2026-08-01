"use client";

import { useEffect, useState } from "react";

export function Watermark({ label }: { label: string }) {
  const [pos, setPos] = useState({ top: "10%", left: "10%" });

  useEffect(() => {
    const id = setInterval(() => {
      setPos({ top: `${10 + Math.random() * 70}%`, left: `${10 + Math.random() * 70}%` });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="pointer-events-none absolute z-20 select-none rounded-md bg-black/30 px-2 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-sm transition-all duration-1000"
      style={{ top: pos.top, left: pos.left }}
    >
      {label}
    </div>
  );
}