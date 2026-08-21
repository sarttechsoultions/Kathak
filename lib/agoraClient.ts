"use client";

import React, { useState } from "react";
import AgoraRTC, { AgoraRTCProvider, type IAgoraRTCClient } from "agora-rtc-react";

export function AgoraProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState<IAgoraRTCClient | null>(() => {
    if (typeof window === "undefined") return null;
    return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  });

  if (!client) {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(AgoraRTCProvider, { client }, children);
}
