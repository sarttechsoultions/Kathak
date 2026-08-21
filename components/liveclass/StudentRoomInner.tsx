"use client";

import React, { useEffect, useState } from "react";
import { Hand, Maximize2, Minimize2, Mic, MicOff, PhoneOff, ShieldCheck, Video as VideoIcon, VideoOff } from "lucide-react";
import { AgoraProvider } from "@/lib/agoraClient";
import { LocalVideoTrack, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRemoteUsers } from "agora-rtc-react";
import { LiveChatPanel } from "@/components/liveclass/LiveChatPanel";
import { Watermark } from "@/components/liveclass/Watermark";
import { getSocket } from "@/lib/socket";
import { useFullscreen } from "@/components/liveclass/useFullscreen";

export type JoinInfo = {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  userId?: string;
  userName?: string;
  isMainSpeaker?: boolean;
  role?: string;
  liveClass: { title: string; batchName: string; teacherName: string };
};

function StudentRoomInnerContent({ joinInfo, onLeave }: { joinInfo: JoinInfo; onLeave: () => void }) {
  const channelName = joinInfo?.channelName || "kathak-live";
  const appId = joinInfo?.appId || "testing";

  const joinUid = Number(joinInfo?.uid) || 0;
  const onLeaveRef = React.useRef(onLeave);
  onLeaveRef.current = onLeave;

  useJoin(
    { appid: appId, channel: channelName, token: joinInfo?.token || null, uid: joinUid },
    Boolean(joinInfo?.channelName && joinInfo?.appId && joinUid > 0)
  );

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [deviceToast, setDeviceToast] = useState("");
  const [busy, setBusy] = useState<"mic" | "cam" | null>(null);
  const { containerRef, isFullscreen, toggleFullscreen } = useFullscreen();

  const [studentName] = useState<string>(() => {
    if (joinInfo.userName) return joinInfo.userName;
    if (typeof window !== "undefined") {
      try {
        const stored =
          localStorage.getItem("kathak_student_user") ||
          localStorage.getItem("kathak_user") ||
          localStorage.getItem("kathak_admin_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.fullName || parsed.name || "Student";
        }
      } catch (e) {
        console.error("Could not parse user profile name:", e);
      }
    }
    return "Student";
  });

  const [studentId] = useState<string | undefined>(() => {
    if (joinInfo.userId) return joinInfo.userId;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kathak_student_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.id || undefined;
        }
      } catch {}
    }
    return undefined;
  });

  const { localMicrophoneTrack, isLoading: micLoading, error: micError } = useLocalMicrophoneTrack(true);
  const { localCameraTrack, isLoading: camLoading, error: camError } = useLocalCameraTrack(true);

  const localMicrophoneTrackRef = React.useRef(localMicrophoneTrack);
  const localCameraTrackRef = React.useRef(localCameraTrack);
  localMicrophoneTrackRef.current = localMicrophoneTrack;
  localCameraTrackRef.current = localCameraTrack;
  const pendingMediaRef = React.useRef<{ camera?: boolean; mic?: boolean } | null>(null);

  usePublish(
    [localMicrophoneTrack, localCameraTrack],
    Boolean(joinInfo?.channelName && joinInfo?.appId)
  );

  useEffect(() => {
    if (!deviceToast) return;
    const timer = setTimeout(() => setDeviceToast(""), 4000);
    return () => clearTimeout(timer);
  }, [deviceToast]);

  useEffect(() => {
    if (micError) {
      console.warn("Microphone device not found or access denied:", micError);
      setMicOn(false);
      setDeviceToast("Microphone not found or permission denied.");
    }
  }, [micError]);

  useEffect(() => {
    if (camError) {
      console.warn("Camera device not found or access denied:", camError);
      setCamOn(false);
      setDeviceToast("Camera not found or permission denied.");
    }
  }, [camError]);

  const remoteUsers = useRemoteUsers();
  const hostUser =
    remoteUsers.find((u) => u.hasVideo) ||
    remoteUsers[0];

  useEffect(() => {
    const socket = getSocket();
    if (studentName) {
      socket.emit("liveclass:join", {
        roomName: joinInfo.channelName,
        userName: studentName,
        userRole: "Student",
        studentId,
        agoraUid: joinUid,
      });
    }

    const onClassUpdated = (updated: { roomName?: string; status?: string }) => {
      if (updated.roomName === joinInfo.channelName && (updated.status === "COMPLETED" || updated.status === "CANCELLED")) {
        onLeaveRef.current();
      }
    };
    socket.on("liveclass:class-updated", onClassUpdated);

    return () => {
      socket.emit("liveclass:leave", { roomName: joinInfo.channelName });
      socket.off("liveclass:class-updated", onClassUpdated);
    };
  }, [joinInfo.channelName, studentId, studentName, joinUid]);

  useEffect(() => {
    const socket = getSocket();

    const applyCamera = async (enabled: boolean, requestedBy: string) => {
      const track = localCameraTrackRef.current;
      if (!track) {
        pendingMediaRef.current = { ...(pendingMediaRef.current || {}), camera: enabled };
        setDeviceToast(`${requestedBy} asked to turn your camera ${enabled ? "on" : "off"}. Camera is still starting.`);
        return;
      }
      try {
        await track.setEnabled(enabled);
        setCamOn(enabled);
        setDeviceToast(`${requestedBy} turned your camera ${enabled ? "on" : "off"}.`);
      } catch (err) {
        console.warn("Host camera control failed:", err);
        setDeviceToast(`Could not change camera as requested by ${requestedBy}.`);
      }
    };

    const applyMic = async (enabled: boolean, requestedBy: string) => {
      const track = localMicrophoneTrackRef.current;
      if (!track) {
        pendingMediaRef.current = { ...(pendingMediaRef.current || {}), mic: enabled };
        setDeviceToast(`${requestedBy} asked to turn your microphone ${enabled ? "on" : "off"}. Microphone is still starting.`);
        return;
      }
      try {
        await track.setEnabled(enabled);
        setMicOn(enabled);
        setDeviceToast(`${requestedBy} turned your microphone ${enabled ? "on" : "off"}.`);
      } catch (err) {
        console.warn("Host microphone control failed:", err);
        setDeviceToast(`Could not change microphone as requested by ${requestedBy}.`);
      }
    };

    const onMediaControl = (payload: { camera?: boolean; mic?: boolean; requestedBy?: string }) => {
      const who = payload?.requestedBy || "Teacher";
      if (payload?.camera !== undefined) void applyCamera(payload.camera, who);
      if (payload?.mic !== undefined) void applyMic(payload.mic, who);
    };

    socket.on("liveclass:media-control", onMediaControl);
    return () => {
      socket.off("liveclass:media-control", onMediaControl);
    };
  }, []);

  useEffect(() => {
    const pending = pendingMediaRef.current;
    if (!pending) return;

    const applyPending = async () => {
      if (pending.camera !== undefined && localCameraTrack) {
        try {
          await localCameraTrack.setEnabled(pending.camera);
          setCamOn(pending.camera);
        } catch {}
        pending.camera = undefined;
      }
      if (pending.mic !== undefined && localMicrophoneTrack) {
        try {
          await localMicrophoneTrack.setEnabled(pending.mic);
          setMicOn(pending.mic);
        } catch {}
        pending.mic = undefined;
      }
      if (pending.camera === undefined && pending.mic === undefined) {
        pendingMediaRef.current = null;
      }
    };

    void applyPending();
  }, [localCameraTrack, localMicrophoneTrack]);

  const toggleMic = async () => {
    if (busy || micLoading) return;
    if (!localMicrophoneTrack) {
      setDeviceToast("Microphone is still starting. Try again in a moment.");
      return;
    }
    const next = !micOn;
    setBusy("mic");
    try {
      await localMicrophoneTrack.setEnabled(next);
      setMicOn(next);
    } catch (err) {
      console.warn("Failed to toggle microphone:", err);
      setDeviceToast("Could not toggle microphone. Check browser permission.");
    } finally {
      setBusy(null);
    }
  };

  const toggleCam = async () => {
    if (busy || camLoading) return;
    if (!localCameraTrack) {
      setDeviceToast("Camera is still starting. Try again in a moment.");
      return;
    }
    const next = !camOn;
    setBusy("cam");
    try {
      await localCameraTrack.setEnabled(next);
      setCamOn(next);
    } catch (err) {
      console.warn("Failed to toggle camera:", err);
      setDeviceToast("Could not toggle camera. Check browser permission.");
    } finally {
      setBusy(null);
    }
  };

  const handRaise = () => {
    const next = !handRaised;
    setHandRaised(next);
    if (next) {
      getSocket().emit("liveclass:raise-hand", { roomName: joinInfo.channelName, senderName: studentName });
    }
  };

  return (
    <div className="w-full max-w-[1350px] mx-auto space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">{joinInfo.liveClass.title}</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">{joinInfo.liveClass.batchName} · {joinInfo.liveClass.teacherName}</p>
      </div>

      {deviceToast ? (
        <div className="rounded-xl bg-stone-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5">
          {deviceToast}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4 sm:gap-5">
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black ${
            isFullscreen
              ? "h-screen w-screen rounded-none"
              : "h-[52vh] min-h-[280px] sm:h-[60vh] lg:h-[68vh]"
          }`}
          onDoubleClick={toggleFullscreen}
        >
          {hostUser ? (
            <RemoteUser user={hostUser} playVideo playAudio className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-stone-400">
              Waiting for the teacher to start the camera…
            </div>
          )}

          <Watermark label="Kathak by Harshita" />

          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 h-20 w-28 sm:h-24 sm:w-32 overflow-hidden rounded-xl border-2 border-white/40 bg-stone-900 shadow-md">
            {camOn && localCameraTrack ? (
              <LocalVideoTrack track={localCameraTrack} play className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-stone-400">Camera off</div>
            )}
            <div className="absolute bottom-1 left-1 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-extrabold text-white truncate max-w-[110px]">
              {studentName} (You)
            </div>
          </div>

          <div
            className="absolute bottom-3 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-[520px] -translate-x-1/2 flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-black/70 px-3 py-2 backdrop-blur-sm"
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={toggleMic}
              disabled={busy === "mic" || micLoading}
              className={`rounded-full p-3 min-w-11 min-h-11 flex items-center justify-center cursor-pointer disabled:opacity-50 ${
                micOn ? "bg-white/15 text-white hover:bg-white/25" : "bg-red-600 text-white"
              }`}
              title={micOn ? "Mute microphone" : "Unmute microphone"}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={toggleCam}
              disabled={busy === "cam" || camLoading}
              className={`rounded-full p-3 min-w-11 min-h-11 flex items-center justify-center cursor-pointer disabled:opacity-50 ${
                camOn ? "bg-white/15 text-white hover:bg-white/25" : "bg-red-600 text-white"
              }`}
              title={camOn ? "Turn camera off" : "Turn camera on"}
            >
              {camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={handRaise}
              className={`rounded-full p-3 min-w-11 min-h-11 flex items-center justify-center cursor-pointer ${
                handRaised ? "bg-amber-500 text-white" : "bg-white/15 text-white hover:bg-white/25"
              }`}
              title="Raise hand"
            >
              <Hand className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full p-3 min-w-11 min-h-11 flex items-center justify-center cursor-pointer bg-white/15 text-white hover:bg-white/25"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={onLeave}
              className="flex items-center gap-1.5 rounded-full bg-[#900C27] px-4 py-3 min-h-11 text-xs font-bold text-white hover:bg-[#780A20] cursor-pointer"
            >
              <PhoneOff className="h-4 w-4" />Leave
            </button>
          </div>
        </div>

        <div className="h-[48vh] min-h-[320px] sm:h-[50vh] xl:h-[68vh] space-y-3">
          <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
            <ShieldCheck className="h-4 w-4 shrink-0" />This session is private and protected.
          </div>
          <div className="h-[calc(100%-2.75rem)]">
            <LiveChatPanel roomName={joinInfo.channelName} senderName={studentName} userRole="Student" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentRoomInner({ joinInfo, onLeave }: { joinInfo: JoinInfo; onLeave: () => void }) {
  return (
    <AgoraProvider>
      <StudentRoomInnerContent joinInfo={joinInfo} onLeave={onLeave} />
    </AgoraProvider>
  );
}
