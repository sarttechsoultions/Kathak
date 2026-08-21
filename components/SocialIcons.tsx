"use client";

import React from "react";

export const SOCIAL_LINKS = [
  { href: "https://www.linkedin.com/in/harshita-sharma-01453b38a/", label: "LinkedIn", src: "/icons/linkedin.svg" },
  { href: "https://www.instagram.com/kathakbyharshita", label: "Instagram", src: "/icons/instagram.svg" },
  { href: "https://www.facebook.com/share/17psAxmWmE/", label: "Facebook", src: "/icons/facebook.svg" },
  { href: "https://youtube.com/@kathakbyharshita", label: "YouTube", src: "/icons/youtube.svg" },
  { href: "https://x.com/HarshitaKathak", label: "Twitter", src: "/icons/twitter.svg" },
  { href: "https://pin.it/vz19tbUio", label: "Pinterest", src: "/icons/pinterest.svg" },
  { href: "https://www.tiktok.com/@kathakbyharshita", label: "TikTok", src: "/icons/tiktok.svg" },
  { href: "https://vimeo.com/user248688798", label: "Vimeo", src: "/icons/vimeo.svg" },
] as const;

type SocialIconsProps = {
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
};

export default function SocialIcons({
  className,
  linkClassName,
  iconClassName = "w-5 h-5 object-contain",
}: SocialIconsProps) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className={linkClassName}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={social.src} alt={social.label} className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
