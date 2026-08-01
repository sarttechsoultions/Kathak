"use client";

import AgoraRTC from "agora-rtc-sdk-ng";
import { AgoraRTCProvider, IAgoraRTCClient } from "agora-rtc-react";
import React from "react";

export const agoraClient: IAgoraRTCClient | null =
  typeof window !== "undefined"
    ? (AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }) as unknown as IAgoraRTCClient)
    : null;

export function AgoraProvider({ children }: { children: React.ReactNode }) {
  if (!agoraClient) {
    return React.createElement(React.Fragment, null, children);
  }
  return React.createElement(AgoraRTCProvider, { client: agoraClient }, children);
}