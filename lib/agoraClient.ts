"use client";

import AgoraRTC from "agora-rtc-sdk-ng";
import { AgoraRTCProvider, IAgoraRTCClient } from "agora-rtc-react";
import React, { useState } from "react";

export function AgoraProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState<IAgoraRTCClient | null>(() => {
    if (typeof window !== "undefined") {
      return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }) as unknown as IAgoraRTCClient;
    }
    return null;
  });

  if (!client) {
    return React.createElement(React.Fragment, null, children);
  }

  return React.createElement(AgoraRTCProvider, { client }, children);
}