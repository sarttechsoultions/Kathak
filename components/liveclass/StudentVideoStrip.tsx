"use client";

import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import type { IRemoteVideoTrack } from "agora-rtc-sdk-ng";

export type HostStudentTile = {
  socketId: string;
  agoraUid?: number;
  studentId?: string;
  name: string;
  hasVideo: boolean;
  hasAudio: boolean;
  videoTrack?: IRemoteVideoTrack;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function StudentTile({
  student,
  isSpotlighted,
  onSpotlight,
  onToggleCamera,
  onToggleMic,
}: {
  student: HostStudentTile;
  isSpotlighted: boolean;
  onSpotlight: () => void;
  onToggleCamera: (enabled: boolean) => void;
  onToggleMic: (enabled: boolean) => void;
}) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = student.videoTrack;
    const el = videoRef.current;
    if (!track || !student.hasVideo || isSpotlighted || !el) return;
    track.play(el);
  }, [student.videoTrack, student.hasVideo, isSpotlighted]);

  return (
    <div
      className={`relative h-[108px] w-[148px] shrink-0 overflow-hidden rounded-2xl border-2 bg-stone-900 shadow-md transition-all ${
        isSpotlighted ? "border-[#9B3434] ring-2 ring-[#9B3434]/40" : "border-white/15 hover:border-white/40"
      }`}
    >
      <button
        type="button"
        onClick={onSpotlight}
        className="absolute inset-0 z-0 cursor-pointer"
        title={isSpotlighted ? "Back to your camera" : `View ${student.name}`}
      >
        <span className="sr-only">{isSpotlighted ? "Stop viewing student" : `View ${student.name}`}</span>
      </button>

      {student.hasVideo && student.videoTrack && !isSpotlighted ? (
        <div ref={videoRef} className="absolute inset-0 pointer-events-none" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-b from-stone-800 to-stone-950 pointer-events-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9B3434] text-[13px] font-bold text-white">
            {initials(student.name)}
          </div>
          <span className="text-[10px] font-semibold text-stone-400">
            {isSpotlighted ? "Viewing" : student.hasVideo ? "Live" : "Camera off"}
          </span>
        </div>
      )}

      <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10 flex items-center justify-between gap-1 pointer-events-none">
        <span className="truncate rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {student.name}
        </span>
      </div>

      <div className="absolute top-1.5 right-1.5 z-20 flex gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMic(!student.hasAudio);
          }}
          className={`rounded-full p-1.5 cursor-pointer ${
            student.hasAudio ? "bg-black/70 text-white hover:bg-black/90" : "bg-red-600 text-white"
          }`}
          title={student.hasAudio ? "Turn off microphone" : "Turn on microphone"}
        >
          {student.hasAudio ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCamera(!student.hasVideo);
          }}
          className={`rounded-full p-1.5 cursor-pointer ${
            student.hasVideo ? "bg-black/70 text-white hover:bg-black/90" : "bg-red-600 text-white"
          }`}
          title={student.hasVideo ? "Turn off camera" : "Turn on camera"}
        >
          {student.hasVideo ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />}
        </button>
      </div>
    </div>
  );
}

export default function StudentVideoStrip({
  students,
  spotlightUid,
  onSpotlight,
  onToggleCamera,
  onToggleMic,
}: {
  students: HostStudentTile[];
  spotlightUid: number | null;
  onSpotlight: (uid: number | null) => void;
  onToggleCamera: (student: HostStudentTile, enabled: boolean) => void;
  onToggleMic: (student: HostStudentTile, enabled: boolean) => void;
}) {
  if (students.length === 0) return null;

  return (
    <div className="w-full mt-3 sm:mt-4">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B3434]">
          Students ({students.length})
        </span>
        <span className="hidden sm:inline text-[10px] text-stone-400 font-medium">Click a tile to view · use icons to control cam/mic</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {students.map((student) => {
          const uid = student.agoraUid ?? null;
          const isSpotlighted = uid != null && spotlightUid === uid;
          return (
            <StudentTile
              key={student.socketId || String(student.agoraUid)}
              student={student}
              isSpotlighted={isSpotlighted}
              onSpotlight={() => {
                if (uid == null) return;
                onSpotlight(isSpotlighted ? null : uid);
              }}
              onToggleCamera={(enabled) => onToggleCamera(student, enabled)}
              onToggleMic={(enabled) => onToggleMic(student, enabled)}
            />
          );
        })}
      </div>
    </div>
  );
}
