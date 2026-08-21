"use client";

import React, { useEffect, useState } from "react";
import { Hand, Mic, MicOff, PhoneOff, ShieldCheck, Video as VideoIcon, VideoOff } from "lucide-react";
import { AgoraProvider } from "@/lib/agoraClient";
import { LocalVideoTrack, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRemoteUsers } from "agora-rtc-react";
import { LiveChatPanel } from "@/components/liveclass/LiveChatPanel";
import { Watermark } from "@/components/liveclass/Watermark";
import { getSocket } from "@/lib/socket";

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

  const { localMicrophoneTrack, error: micError } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack, error: camError } = useLocalCameraTrack(camOn);

  useEffect(() => {
    if (camError) {
      console.warn("Camera device not found or access denied:", camError);
      setCamOn(false);
    }
  }, [camError]);

  useEffect(() => {
    if (micError) {
      console.warn("Microphone device not found or access denied:", micError);
      setMicOn(false);
    }
  }, [micError]);

  const tracksToPublish = [
    ...(micOn && localMicrophoneTrack ? [localMicrophoneTrack] : []),
    ...(camOn && localCameraTrack ? [localCameraTrack] : []),
  ];
  usePublish(tracksToPublish, Boolean(joinInfo?.channelName && joinInfo?.appId) && tracksToPublish.length > 0);

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
  }, [joinInfo.channelName, studentId, studentName]);

  const handRaise = () => {
    getSocket().emit("liveclass:raise-hand", { roomName: joinInfo.channelName, senderName: studentName });
  };

  return (
    <div className="max-w-[1350px] mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{joinInfo.liveClass.title}</h1>
        <p className="text-sm text-stone-500">{joinInfo.liveClass.batchName} · {joinInfo.liveClass.teacherName}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <div className="relative h-[70vh] overflow-hidden rounded-3xl bg-black">
          {hostUser ? (
            <RemoteUser user={hostUser} playVideo playAudio className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">Waiting for the teacher to start the camera…</div>
          )}

          <Watermark label="Kathak by Harshita" />

          <div className="absolute bottom-4 right-4 h-24 w-32 overflow-hidden rounded-xl border-2 border-white/40 bg-stone-900 shadow-md">
            {camOn && localCameraTrack ? (
              <LocalVideoTrack track={localCameraTrack} play className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-stone-400">Camera off</div>
            )}
            <div className="absolute bottom-1 left-1 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-extrabold text-white truncate max-w-[110px]">
              {studentName} (You)
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-black/60 px-4 py-2 backdrop-blur-sm">
            <button onClick={() => setMicOn((v) => !v)} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
            <button onClick={() => setCamOn((v) => !v)} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              {camOn ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>
            <button onClick={handRaise} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              <Hand className="h-4 w-4" />
            </button>
            <button onClick={onLeave} className="flex items-center gap-1 rounded-full bg-[#900C27] px-3 py-2 text-xs font-bold text-white hover:bg-[#780A20]">
              <PhoneOff className="h-3 w-3" />Leave
            </button>
          </div>
        </div>

        <div className="h-[70vh] space-y-3">
          <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
            <ShieldCheck className="h-4 w-4 shrink-0" />This session is private and protected.
          </div>
          <div className="h-[calc(100%-3rem)]">
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
