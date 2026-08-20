"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: "up" | "left" | "right" | "scale";
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  animation = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animationClass =
    animation === "left"
      ? "reveal-left"
      : animation === "right"
        ? "reveal-right"
        : animation === "scale"
          ? "reveal-scale"
          : "";

  return (
    <div
      ref={ref}
      className={`reveal ${animationClass} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
