"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

export function useFullscreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const doc = document as FullscreenDocument;
      const active = doc.fullscreenElement || doc.webkitFullscreenElement || null;
      setIsFullscreen(active === containerRef.current);
    };

    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const node = containerRef.current as FullscreenElement | null;
    if (!node) return;

    const doc = document as FullscreenDocument;
    const active = doc.fullscreenElement || doc.webkitFullscreenElement || null;

    try {
      if (active) {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
        return;
      }

      if (node.requestFullscreen) await node.requestFullscreen();
      else if (node.webkitRequestFullscreen) await node.webkitRequestFullscreen();
    } catch (err) {
      console.warn("Fullscreen toggle failed:", err);
    }
  }, []);

  return { containerRef, isFullscreen, toggleFullscreen };
}
