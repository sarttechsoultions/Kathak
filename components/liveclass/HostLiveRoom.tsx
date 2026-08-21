"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, MoreVertical,
  Send, Hand, PhoneOff, MessageSquare, CircleDot, Loader2, Maximize2, Minimize2
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useFullscreen } from "@/components/liveclass/useFullscreen";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
  IRemoteVideoTrack
} from "agora-rtc-sdk-ng";
import StudentVideoStrip, { type HostStudentTile } from "@/components/liveclass/StudentVideoStrip";

interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  sentAt: string;
}

interface RoomUser {
  id?: string;
  userName?: string;
  userRole?: string;
  studentId?: string;
  agoraUid?: number;
  [key: string]: string | number | boolean | undefined;
}

type RemoteMedia = {
  uid: number;
  hasVideo: boolean;
  hasAudio: boolean;
  videoTrack?: IRemoteVideoTrack;
};

const isStudentRole = (role?: string) => {
  const value = String(role || "student").toLowerCase();
  return value === "student";
};

const isHostRole = (role?: string) => {
  const value = String(role || "").toLowerCase();
  return value === "teacher" || value === "admin";
};

interface LiveClassData {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  userId?: string;
  userName?: string;
  isMainSpeaker: boolean;
  role: string;
  agoraRole: string;
  liveClass: {
    id: string;
    title: string;
    teacherName: string;
    status: string;
  };
}

export default function HostLiveRoom({ leaveHref }: { leaveHref: string }) {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState<LiveClassData | null>(null);

  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [isHandRaised, setIsHandRaised] = useState(false);
  const [handRaisesCount, setHandRaisesCount] = useState(0);
  const [handRaiseToast, setHandRaiseToast] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [socket, setSocket] = useState<ReturnType<typeof getSocket> | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [participantsCount, setParticipantsCount] = useState(1);
  const [deviceToast, setDeviceToast] = useState<string | null>(null);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [remoteMedia, setRemoteMedia] = useState<RemoteMedia[]>([]);
  const [spotlightUid, setSpotlightUid] = useState<number | null>(null);

  const agoraClientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const hostPipRef = useRef<HTMLDivElement>(null);
  const isJoinedRef = useRef(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { containerRef: stageRef, isFullscreen, toggleFullscreen } = useFullscreen();

  const showToast = (message: string) => {
    setDeviceToast(message);
    setTimeout(() => setDeviceToast(null), 4000);
  };

  useEffect(() => {
    let client: IAgoraRTCClient;
    let cancelled = false;
    let socketInstance: ReturnType<typeof getSocket> | null = null;
    let joinedRoom = "";

    const initializeRoom = async () => {
      try {
        const res = await apiRequest<{ status: string; data: LiveClassData }>(`/classes/${classId}/join-token`);

        if (cancelled) return;

        if (res.status === "success" && res.data) {
          const data = res.data;
          setClassData(data);

          socketInstance = getSocket();
          setSocket(socketInstance);
          joinedRoom = data.channelName;

          const hostName = data.userName || (data.role === "admin" ? "Admin" : "Teacher");
          socketInstance.emit("liveclass:join", {
            roomName: data.channelName,
            userName: hostName,
            userRole: data.role === "admin" ? "Admin" : "Teacher",
            studentId: data.userId,
            agoraUid: data.uid,
          });

          socketInstance.off("liveclass:chat-history");
          socketInstance.off("liveclass:message");
          socketInstance.off("liveclass:room-users");
          socketInstance.off("liveclass:raise-hand");

          socketInstance.on("liveclass:chat-history", (history: ChatMessage[]) => setChatMessages(history));
          socketInstance.on("liveclass:message", (msg: ChatMessage) => {
            setChatMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
          });
          socketInstance.on("liveclass:room-users", (users: RoomUser[]) => {
            setRoomUsers(Array.isArray(users) ? users : []);
            const studentCount = users.filter((u) => isStudentRole(String(u.userRole))).length;
            setParticipantsCount(studentCount);
          });
          socketInstance.on("liveclass:raise-hand", (payload: { senderName: string }) => {
            setHandRaisesCount((prev) => prev + 1);
            setHandRaiseToast(`${payload.senderName} raised a hand! ✋`);
            setTimeout(() => setHandRaiseToast(null), 4000);
          });

          client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
          agoraClientRef.current = client;

          client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            const uid = Number(user.uid);
            setRemoteMedia((prev) => {
              const existing = prev.find((item) => item.uid === uid) || { uid, hasVideo: false, hasAudio: false };
              const next: RemoteMedia = { ...existing };
              if (mediaType === "video" && user.videoTrack) {
                next.hasVideo = true;
                next.videoTrack = user.videoTrack;
              }
              if (mediaType === "audio" && user.audioTrack) {
                next.hasAudio = true;
                user.audioTrack.play();
              }
              return [...prev.filter((item) => item.uid !== uid), next];
            });
          });

          client.on("user-unpublished", (user, mediaType) => {
            const uid = Number(user.uid);
            setRemoteMedia((prev) =>
              prev.map((item) => {
                if (item.uid !== uid) return item;
                if (mediaType === "video") return { ...item, hasVideo: false, videoTrack: undefined };
                if (mediaType === "audio") return { ...item, hasAudio: false };
                return item;
              })
            );
          });

          client.on("user-left", (user) => {
            const uid = Number(user.uid);
            setRemoteMedia((prev) => prev.filter((item) => item.uid !== uid));
            setSpotlightUid((current) => (current === uid ? null : current));
          });

          if (!isJoinedRef.current && !cancelled) {
            try {
              await client.join(data.appId, data.channelName, data.token, data.uid);
              isJoinedRef.current = true;
            } catch (joinErr: unknown) {
              const error = joinErr as { code?: string };
              if (error?.code === "UID_CONFLICT") {
                try { await client.leave(); } catch {}
                await new Promise((r) => setTimeout(r, 500));
                await client.join(data.appId, data.channelName, data.token, data.uid);
                isJoinedRef.current = true;
              } else {
                throw joinErr;
              }
            }

            if (cancelled) {
              await client.leave();
              isJoinedRef.current = false;
              return;
            }

            if (data.isMainSpeaker) {
              try {
                const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                localAudioTrackRef.current = audioTrack;
                localVideoTrackRef.current = videoTrack;
                await client.publish([audioTrack, videoTrack]);
                if (videoContainerRef.current) {
                  videoTrack.play(videoContainerRef.current);
                }
                setIsMicOn(true);
                setIsVideoOn(true);
              } catch (mediaErr) {
                console.warn("Could not auto-start camera/mic:", mediaErr);
                showToast("Allow camera and microphone to teach this class.");
              }
            }
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to initialize room:", error);
        if (!cancelled) {
          alert(error instanceof Error ? error.message : "Unable to join the virtual room session.");
          router.push(leaveHref);
        }
      }
    };

    initializeRoom();

    return () => {
      cancelled = true;
      if (socketInstance) {
        if (joinedRoom) socketInstance.emit("liveclass:leave", { roomName: joinedRoom });
        socketInstance.off("liveclass:chat-history");
        socketInstance.off("liveclass:message");
        socketInstance.off("liveclass:room-users");
        socketInstance.off("liveclass:raise-hand");
      }
      if (localAudioTrackRef.current) localAudioTrackRef.current.close();
      if (localVideoTrackRef.current) localVideoTrackRef.current.close();
      if (screenTrackRef.current) {
        screenTrackRef.current.close();
        screenTrackRef.current = null;
      }
      if (agoraClientRef.current && isJoinedRef.current) {
        agoraClientRef.current.removeAllListeners();
        agoraClientRef.current.leave().finally(() => {
          isJoinedRef.current = false;
        });
      }
    };
  }, [classId, router, leaveHref]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  const studentTiles: HostStudentTile[] = (() => {
    const hostUid = classData?.uid;
    const tilesFromRoom = roomUsers
      .filter((user) => isStudentRole(String(user.userRole)))
      .map((user) => {
        const uid = typeof user.agoraUid === "number" ? user.agoraUid : Number(user.agoraUid);
        const media = Number.isFinite(uid) ? remoteMedia.find((item) => item.uid === uid) : undefined;
        return {
          socketId: String(user.id || `student-${user.userName}`),
          agoraUid: Number.isFinite(uid) ? uid : undefined,
          studentId: user.studentId ? String(user.studentId) : undefined,
          name: String(user.userName || "Student"),
          hasVideo: Boolean(media?.hasVideo),
          hasAudio: Boolean(media?.hasAudio),
          videoTrack: media?.videoTrack,
        } satisfies HostStudentTile;
      });

    const extras = remoteMedia.filter((media) => {
      if (media.uid === hostUid) return false;
      if (tilesFromRoom.some((tile) => tile.agoraUid === media.uid)) return false;
      const mapped = roomUsers.find((user) => Number(user.agoraUid) === media.uid);
      if (mapped && isHostRole(String(mapped.userRole))) return false;
      return true;
    });

    return [
      ...tilesFromRoom,
      ...extras.map((media) => {
        const mapped = roomUsers.find((user) => Number(user.agoraUid) === media.uid);
        return {
          socketId: mapped?.id ? String(mapped.id) : `agora-${media.uid}`,
          agoraUid: media.uid,
          studentId: mapped?.studentId ? String(mapped.studentId) : undefined,
          name: String(mapped?.userName || "Student"),
          hasVideo: media.hasVideo,
          hasAudio: media.hasAudio,
          videoTrack: media.videoTrack,
        } satisfies HostStudentTile;
      }),
    ];
  })();

  const spotlightStudent = studentTiles.find((tile) => tile.agoraUid === spotlightUid) || null;
  const peerHost = remoteMedia.find((media) => {
    const mapped = roomUsers.find((user) => Number(user.agoraUid) === media.uid);
    return Boolean(mapped && isHostRole(String(mapped.userRole)) && media.hasVideo && media.videoTrack);
  });

  useEffect(() => {
    if (isScreenSharing) return;

    const mainEl = videoContainerRef.current;
    if (!mainEl) return;

    if (spotlightUid != null) {
      const spotlight = remoteMedia.find((item) => item.uid === spotlightUid);
      if (spotlight?.videoTrack && spotlight.hasVideo) {
        spotlight.videoTrack.play(mainEl);
      }
      if (hostPipRef.current && localVideoTrackRef.current && isVideoOn) {
        localVideoTrackRef.current.play(hostPipRef.current);
      }
      return;
    }

    if (localVideoTrackRef.current && isVideoOn) {
      localVideoTrackRef.current.play(mainEl);
      return;
    }

    if (peerHost?.videoTrack) {
      peerHost.videoTrack.play(mainEl);
    }
  }, [spotlightUid, remoteMedia, isVideoOn, isScreenSharing, peerHost]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainSecs.toString().padStart(2, "0")}`;
  };

  const toggleMic = async () => {
    const client = agoraClientRef.current;
    if (!client) return;

    if (!isMicOn) {
      if (localAudioTrackRef.current) {
        await localAudioTrackRef.current.setEnabled(true);
        setIsMicOn(true);
        return;
      }
      try {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localAudioTrackRef.current = audioTrack;
        await client.publish([audioTrack]);
        setIsMicOn(true);
      } catch (err) {
        console.warn("Microphone not accessible:", err);
        showToast("Microphone not found or permission denied.");
        setIsMicOn(false);
      }
    } else if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(false);
      setIsMicOn(false);
    }
  };

  const toggleVideo = async () => {
    const client = agoraClientRef.current;
    if (!client) return;

    if (!isVideoOn) {
      if (localVideoTrackRef.current) {
        await localVideoTrackRef.current.setEnabled(true);
        const playTarget = spotlightUid != null && hostPipRef.current
          ? hostPipRef.current
          : videoContainerRef.current;
        if (playTarget) {
          localVideoTrackRef.current.play(playTarget);
        }
        setIsVideoOn(true);
        return;
      }
      try {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        localVideoTrackRef.current = videoTrack;
        await client.publish([videoTrack]);
        const playTarget = spotlightUid != null && hostPipRef.current
          ? hostPipRef.current
          : videoContainerRef.current;
        if (playTarget) {
          videoTrack.play(playTarget);
        }
        setIsVideoOn(true);
      } catch (err) {
        console.warn("Camera not accessible:", err);
        showToast("Camera not found or permission denied.");
        setIsVideoOn(false);
      }
    } else if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(false);
      setIsVideoOn(false);
    }
  };

  const stopScreenShare = async () => {
    const client = agoraClientRef.current;
    if (!client) return;

    if (screenTrackRef.current) {
      await client.unpublish([screenTrackRef.current]);
      screenTrackRef.current.close();
      screenTrackRef.current = null;
    }

    if (localVideoTrackRef.current) {
      await client.publish([localVideoTrackRef.current]);
      if (videoContainerRef.current) {
        localVideoTrackRef.current.play(videoContainerRef.current);
      }
    }
    setIsScreenSharing(false);
  };

  const toggleScreenShare = async () => {
    try {
      const client = agoraClientRef.current;
      if (!client) return;

      if (!isScreenSharing) {
        const screenTrack = await AgoraRTC.createScreenVideoTrack({});
        const activeTrack = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;
        screenTrackRef.current = activeTrack as ILocalVideoTrack;

        if (localVideoTrackRef.current) {
          await client.unpublish([localVideoTrackRef.current]);
        }
        await client.publish(activeTrack);
        activeTrack.play(videoContainerRef.current!);
        activeTrack.on("track-ended", () => stopScreenShare());
        setIsScreenSharing(true);
      } else {
        await stopScreenShare();
      }
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      recordedChunksRef.current = [];
      try {
        const streamTarget = videoContainerRef.current?.querySelector("video")?.srcObject as MediaStream;
        if (!streamTarget) {
          alert("Media stream not ready for recording.");
          return;
        }
        const recorder = new MediaRecorder(streamTarget, { mimeType: "video/webm;codecs=vp9" });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `LiveClass-Recording-${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.error("Recording error:", err);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleRaiseHand = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    if (nextState && socket && classData) {
      socket.emit("liveclass:raise-hand", {
        roomName: classData.channelName,
        senderName: classData.userName || "Host",
      });
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || !classData) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      senderName: classData.userName || "You",
      text: messageInput.trim(),
      sentAt: new Date().toISOString(),
    };

    socket.emit("liveclass:message", {
      roomName: classData.channelName,
      message: newMessage,
    });
    setMessageInput("");
  };

  const controlStudentMedia = (student: HostStudentTile, kind: "camera" | "mic", enabled: boolean) => {
    if (!socket || !classData) return;
    socket.emit("liveclass:media-control", {
      roomName: classData.channelName,
      targetSocketId: student.socketId.startsWith("agora-") ? undefined : student.socketId,
      targetStudentId: student.studentId,
      targetAgoraUid: student.agoraUid,
      camera: kind === "camera" ? enabled : undefined,
      mic: kind === "mic" ? enabled : undefined,
    });
    showToast(
      `${enabled ? "Turning on" : "Turning off"} ${student.name}'s ${kind === "camera" ? "camera" : "microphone"}…`
    );
  };

  const leaveClass = () => {
    if (socket && classData) {
      socket.emit("liveclass:leave", { roomName: classData.channelName });
    }
    router.push(leaveHref);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#FAECEC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#9B3434] animate-spin" />
          <p className="text-[#9B3434] font-bold">Connecting to Agora Secure Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-0 bg-[#Fdf5f5] flex justify-center font-sans p-3 sm:p-4 lg:p-6 relative">
      {handRaiseToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#9B3434] text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-[90vw]">
          <Hand className="w-5 h-5 shrink-0" />
          <span className="text-[13px] sm:text-[14px] font-bold">{handRaiseToast}</span>
        </div>
      )}
      {deviceToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl max-w-[90vw]">
          <span className="text-[13px] sm:text-[14px] font-bold">{deviceToast}</span>
        </div>
      )}

      <div className="w-full max-w-[1200px] grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4 lg:gap-6">
        <div
          ref={stageRef}
          className={`w-full min-w-0 flex flex-col ${isFullscreen ? "h-screen w-screen bg-black p-3 sm:p-4" : ""}`}
        >
          <div className={`w-full relative overflow-hidden bg-black shadow-xl ${
            isFullscreen
              ? "flex-1 min-h-0 rounded-2xl"
              : studentTiles.length > 0
                ? "rounded-2xl sm:rounded-[24px] h-[40vh] min-h-[240px] sm:h-[48vh] xl:h-[min(54vh,560px)]"
                : "rounded-2xl sm:rounded-[24px] h-[48vh] min-h-[260px] sm:h-[56vh] xl:h-[min(70vh,720px)]"
          }`}>
            <div ref={videoContainerRef} className="absolute inset-0 w-full h-full object-cover" />
            {spotlightStudent && !spotlightStudent.hasVideo ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400">
                <VideoOff className="w-8 h-8" />
                <span className="text-sm font-semibold">{spotlightStudent.name}&apos;s camera is off</span>
              </div>
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex gap-2 items-center z-10">
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-2 border transition-all ${isRecording ? "bg-red-600 border-red-400 animate-pulse" : "bg-black/60 border-white/10 hover:bg-black/80"}`}
              >
                <CircleDot className={`w-3.5 h-3.5 ${isRecording ? "text-white fill-current" : "text-red-500"}`} />
                <span className="text-white text-[10px] sm:text-[11px] font-bold tracking-wider">
                  {isRecording ? `STOP (${formatTime(recordingTime)})` : "REC"}
                </span>
              </button>
              {spotlightStudent ? (
                <button
                  type="button"
                  onClick={() => setSpotlightUid(null)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#9B3434] text-white text-[10px] sm:text-[11px] font-bold"
                >
                  Back to your camera
                </button>
              ) : null}
            </div>

            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-md rounded-xl p-2.5 sm:p-3 pr-4 sm:pr-8 shadow-lg border border-white/20 z-10 max-w-[55%]">
              <span className="text-[#9B3434] text-[10px] font-bold uppercase tracking-wider block mb-0.5">
                {spotlightStudent ? "Student" : "Guru"}
              </span>
              <span className="text-[#0B1C30] text-[12px] sm:text-[14px] font-bold leading-tight block truncate">
                {spotlightStudent?.name || classData?.liveClass.teacherName || "Instructor"}
              </span>
            </div>

            {spotlightStudent && isVideoOn ? (
              <div className="absolute bottom-3 right-3 z-20 h-20 w-28 sm:h-24 sm:w-32 overflow-hidden rounded-xl border-2 border-white/40 bg-stone-900 shadow-md">
                <div ref={hostPipRef} className="absolute inset-0" />
                <div className="absolute bottom-1 left-1 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-extrabold text-white">
                  You
                </div>
              </div>
            ) : null}
          </div>

          <StudentVideoStrip
            students={studentTiles}
            spotlightUid={spotlightUid}
            onSpotlight={setSpotlightUid}
            onToggleCamera={(student, enabled) => controlStudentMedia(student, "camera", enabled)}
            onToggleMic={(student, enabled) => controlStudentMedia(student, "mic", enabled)}
          />

          <div className="w-full mt-3 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" onClick={toggleVideo} className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${isVideoOn ? "bg-white text-stone-700 shadow-sm" : "bg-red-100 text-red-600"}`}>
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button type="button" onClick={toggleMic} className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${isMicOn ? "bg-white text-stone-700 shadow-sm" : "bg-red-100 text-red-600"}`}>
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" onClick={handleRaiseHand} className={`px-4 sm:px-6 h-11 sm:h-12 rounded-full flex items-center gap-2 font-bold text-[13px] sm:text-[14px] transition-all shadow-md cursor-pointer ${isHandRaised ? "bg-amber-600 text-white" : "bg-[#9B3434] text-white hover:bg-[#832c2c]"}`}>
                <Hand className="w-5 h-5" /> <span className="hidden sm:inline">{isHandRaised ? "Hand Raised" : "Raise Hand"}</span>
              </button>
              <button type="button" onClick={toggleScreenShare} className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${isScreenSharing ? "bg-indigo-600 text-white" : "bg-white text-stone-700 hover:bg-stone-50"}`}>
                <MonitorUp className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${isFullscreen ? "bg-indigo-600 text-white" : "bg-white text-stone-700 hover:bg-stone-50"}`}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button type="button" className="hidden sm:flex w-12 h-12 rounded-full items-center justify-center bg-white text-stone-700 hover:bg-stone-50 shadow-sm transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <button type="button" onClick={leaveClass} className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-4 sm:px-6 h-11 sm:h-12 rounded-full font-bold text-[13px] sm:text-[14px] shadow-lg shadow-red-900/20 transition-all flex items-center gap-2 cursor-pointer">
              <PhoneOff className="w-4 h-4" /> Leave
            </button>
          </div>
        </div>

        <div className="w-full min-w-0 flex flex-col gap-4 h-[52vh] min-h-[360px] xl:h-[min(70vh,720px)]">
          <div className="w-full flex-1 min-h-0 bg-white rounded-2xl sm:rounded-[24px] shadow-sm border border-stone-100 flex flex-col overflow-hidden">
            <div className="h-[52px] sm:h-[60px] flex items-center justify-center border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2 text-[#9B3434] font-bold text-[14px]">
                <MessageSquare className="w-4 h-4" /> Live Chat
              </div>
            </div>

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scroll-smooth">
              {chatMessages.map((msg, idx) => {
                const isMe = msg.senderName === (classData?.userName || "You");
                return (
                  <div key={msg.id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[12px] font-bold ${isMe ? "text-sky-600" : "text-[#9B3434]"}`}>
                        {isMe ? "You" : msg.senderName}
                      </span>
                      <span className="text-[9px] text-stone-400 font-medium">
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className={`max-w-[85%] px-4 py-3 text-[13px] leading-relaxed ${isMe ? "bg-[#FCEEED] text-stone-800 rounded-[16px] rounded-tr-sm border border-red-50" : "bg-[#F0F4FF] text-stone-800 rounded-[16px] rounded-tl-sm border border-blue-50"}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 sm:p-4 bg-white border-t border-stone-50 shrink-0">
              <form onSubmit={sendMessage} className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="w-full bg-white border border-stone-200 focus:border-[#9B3434] rounded-full pl-5 pr-12 py-3.5 text-[13px] text-stone-800 shadow-sm focus:outline-none transition-all"
                />
                <button type="submit" disabled={!messageInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#9B3434] hover:bg-stone-50 disabled:opacity-50 rounded-full transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="w-full bg-white rounded-2xl sm:rounded-[24px] shadow-sm border border-stone-100 p-4 sm:p-5 flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#9B3434] text-[12px] font-bold tracking-widest uppercase">Engagement</span>
              <span className="bg-sky-50 text-sky-600 text-[10px] font-bold px-2 py-1 rounded-full">Live Analytics</span>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-1 bg-[#Fdf5f5] rounded-xl p-3 border border-red-50">
                <span className="text-[#9B3434] text-[9px] font-bold uppercase tracking-wider block mb-1">Students Active</span>
                <span className="text-[#9B3434] text-[20px] font-light leading-none">{participantsCount}</span>
              </div>
              <div className="flex-1 bg-sky-50/50 rounded-xl p-3 border border-sky-50">
                <span className="text-sky-600 text-[9px] font-bold uppercase tracking-wider block mb-1">Hand Raises</span>
                <span className="text-sky-600 text-[20px] font-light leading-none">{handRaisesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

