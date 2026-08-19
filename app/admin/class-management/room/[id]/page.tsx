"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Mic, MicOff, Video, VideoOff, MonitorUp, MoreVertical, 
  Send, Hand, PhoneOff, MessageSquare, CircleDot, Loader2
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { apiRequest } from "@/lib/api";
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  ILocalVideoTrack
} from "agora-rtc-sdk-ng";

interface ChatMessage {
  id: string;
  senderName: string;
  text: string;
  sentAt: string;
}

interface RoomUser {
  userRole?: string;
  [key: string]: string | number | boolean | undefined;
}

interface LiveClassData {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
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

export default function LiveClassRoom() {
  const params = useParams();
  const router = useRouter();
  const classId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState<LiveClassData | null>(null);
  
  // Media States
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Hand Raise & Toast State
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [handRaisesCount, setHandRaisesCount] = useState(0);
  const [handRaiseToast, setHandRaiseToast] = useState<string | null>(null);

  // Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Socket & Chat States
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [participantsCount, setParticipantsCount] = useState(1);



  const [deviceToast, setDeviceToast] = useState<string | null>(null);


  // Agora Refs
  const agoraClientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const isJoinedRef = useRef(false);

  const chatScrollRef = useRef<HTMLDivElement>(null);


  const showToast = (message: string) => {
  setDeviceToast(message);
  setTimeout(() => setDeviceToast(null), 4000);
};

  // ==========================================
  // 1. INITIALIZATION: AGORA + SOCKET
  // ==========================================
useEffect(() => {
  let activeSocket: Socket | null = null;
  let client: IAgoraRTCClient;
  let cancelled = false; // guard for StrictMode double-mount

  const initializeRoom = async () => {
    try {
      const res = await apiRequest<{ status: string; data: LiveClassData }>(`/classes/${classId}/join-token`);

      if (cancelled) return;

      if (res.status === "success" && res.data) {
        const data = res.data;
        setClassData(data);

        // ✅ Socket connect
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
          transports: ["websocket"],
        });
        activeSocket = socketInstance;
        setSocket(socketInstance);

        socketInstance.emit("liveclass:join", {
          roomName: data.channelName,
          userName: data.role === "admin" ? "Admin" : "User",
          userRole: data.role,
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
          const studentCount = users.filter((u) => !u.userRole || u.userRole.toLowerCase() === "student").length;
          setParticipantsCount(studentCount > 0 ? studentCount : 0);
        });
        socketInstance.on("liveclass:raise-hand", (data: { senderName: string }) => {
          setHandRaisesCount((prev) => prev + 1);
          setHandRaiseToast(`${data.senderName} raised a hand! ✋`);
          setTimeout(() => setHandRaiseToast(null), 4000);
        });

        // Agora Client Init
        client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        agoraClientRef.current = client;

        if (data.role === "admin" || data.role === "teacher") {
          await client.setClientRole("host");
        } else {
          await client.setClientRole("audience");
        }

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video" && user.videoTrack) {
            user.videoTrack.play(videoContainerRef.current!);
          }
          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.play();
          }
        });

        if (!isJoinedRef.current && !cancelled) {
          try {
            await client.join(data.appId, data.channelName, data.token, data.uid);
            isJoinedRef.current = true;
          } catch (joinErr: unknown) {
            const error = joinErr as { code?: string };
            if (error?.code === "UID_CONFLICT") {
              console.warn("UID conflict detected, retrying join...");
              try {
                await client.leave();
              } catch {}
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

          // No auto camera/mic — user turns them on manually
        }

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to initialize room:", error);
      if (!cancelled) {
        alert("Unable to join the virtual room session.");
        router.push("/admin/class-management");
      }
    }
  };

  initializeRoom();

  return () => {
    cancelled = true;
    if (activeSocket) activeSocket.disconnect();
    if (localAudioTrackRef.current) localAudioTrackRef.current.close();
    if (localVideoTrackRef.current) localVideoTrackRef.current.close();

    if (screenTrackRef.current) {
      screenTrackRef.current.close();
      screenTrackRef.current = null;
    }

    if (agoraClientRef.current && isJoinedRef.current) {
      agoraClientRef.current.leave().finally(() => {
        isJoinedRef.current = false;
      });
    }
  };
}, [classId, router]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Recording Timer Effect
  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording]);

  // ==========================================
  // 2. CONTROLS & HANDLERS
  // ==========================================
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainSecs.toString().padStart(2, '0')}`;
  };

const toggleMic = async () => {
  const client = agoraClientRef.current;
  if (!client) return;

  if (!isMicOn) {
    // Turning ON
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
  } else {
    // Turning OFF
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(false);
    }
    setIsMicOn(false);
  }
};

const toggleVideo = async () => {
  const client = agoraClientRef.current;
  if (!client) return;

  if (!isVideoOn) {
    // Turning ON
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(true);
      if (videoContainerRef.current) {
        localVideoTrackRef.current.play(videoContainerRef.current);
      }
      setIsVideoOn(true);
      return;
    }
    try {
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      localVideoTrackRef.current = videoTrack;
      await client.publish([videoTrack]);
      if (videoContainerRef.current) {
        videoTrack.play(videoContainerRef.current);
      }
      setIsVideoOn(true);
    } catch (err) {
      console.warn("Camera not accessible:", err);
      showToast("Camera not found or permission denied.");
      setIsVideoOn(false);
    }
  } else {
    // Turning OFF
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(false);
    }
    setIsVideoOn(false);
  }
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

  const toggleRecording = () => {
    if (!isRecording) {
      recordedChunksRef.current = [];
      try {
        const streamTarget = videoContainerRef.current?.querySelector('video')?.srcObject as MediaStream;
        if (!streamTarget) {
          alert("Media stream not ready for recording.");
          return;
        }
        const recorder = new MediaRecorder(streamTarget, { mimeType: 'video/webm;codecs=vp9' });
        recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
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
        senderName: "Admin/Host"
      });
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket || !classData) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderName: "You",
      text: messageInput.trim(),
      sentAt: new Date().toISOString(),
    };

    socket.emit("liveclass:message", {
      roomName: classData.channelName,
      message: newMessage
    });
    setMessageInput("");
  };

  const leaveClass = () => {
    if (socket && classData) {
      socket.emit("liveclass:leave", { roomName: classData.channelName });
    }
    router.push("/admin/class-management");
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
    <div className="min-h-screen w-full bg-[#Fdf5f5] flex items-center justify-center font-sans p-6 relative">
      
      {handRaiseToast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#9B3434] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Hand className="w-5 h-5" />
          <span className="text-[14px] font-bold">{handRaiseToast}</span>
        </div>
      )}
       {deviceToast && (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
        <span className="text-[14px] font-bold">{deviceToast}</span>
      </div>
    )}

      <div className="w-full max-w-[1000px] h-[960px] flex gap-6">
        
        {/* ================= LEFT PANE ================= */}
        <div className="w-[626px] h-full flex flex-col shrink-0">
          
          <div className="w-full h-[804px] relative rounded-[24px] overflow-hidden bg-black shadow-xl">
            
            {/* Agora Video Container */}
            <div ref={videoContainerRef} className="absolute inset-0 w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Recording & Timer */}
            <div className="absolute top-6 left-6 flex gap-2 items-center z-10">
              <button 
                onClick={toggleRecording}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border transition-all ${isRecording ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-black/60 border-white/10 hover:bg-black/80'}`}
              >
                <CircleDot className={`w-3.5 h-3.5 ${isRecording ? 'text-white fill-current' : 'text-red-500'}`} />
                <span className="text-white text-[11px] font-bold tracking-wider">
                  {isRecording ? `STOP REC (${formatTime(recordingTime)})` : 'START RECORDING'}
                </span>
              </button>
            </div>

            {/* Instructor Info */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-3 pr-8 shadow-lg border border-white/20 z-10">
              <span className="text-[#9B3434] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Guru</span>
              <span className="text-[#0B1C30] text-[14px] font-bold leading-tight block">
                {classData?.liveClass.teacherName || "Instructor"}
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="w-full flex-1 mt-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <button onClick={toggleVideo} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOn ? 'bg-white text-stone-700 shadow-sm' : 'bg-red-100 text-red-600'}`}>
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button onClick={toggleMic} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-white text-stone-700 shadow-sm' : 'bg-red-100 text-red-600'}`}>
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleRaiseHand} className={`px-6 h-12 rounded-full flex items-center gap-2 font-bold text-[14px] transition-all shadow-md ${isHandRaised ? 'bg-amber-600 text-white' : 'bg-[#9B3434] text-white hover:bg-[#832c2c]'}`}>
                <Hand className="w-5 h-5" /> {isHandRaised ? 'Hand Raised' : 'Raise Hand'}
              </button>
              <button onClick={toggleScreenShare} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-white text-stone-700 hover:bg-stone-50'}`}>
                <MonitorUp className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-stone-700 hover:bg-stone-50 shadow-sm transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <button onClick={leaveClass} className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-6 h-12 rounded-full font-bold text-[14px] shadow-lg shadow-red-900/20 transition-all flex items-center gap-2">
              <PhoneOff className="w-4 h-4" /> Leave Class
            </button>
          </div>

        </div>

        {/* ================= RIGHT PANE ================= */}
        <div className="flex-1 h-full flex flex-col gap-6">
          
          {/* Chat Container */}
          <div className="w-full flex-1 bg-white rounded-[24px] shadow-sm border border-stone-100 flex flex-col overflow-hidden">
            <div className="h-[60px] flex items-center justify-center border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2 text-[#9B3434] font-bold text-[14px]">
                <MessageSquare className="w-4 h-4" /> Live Chat
              </div>
            </div>

            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth">
              {chatMessages.map((msg, idx) => {
                const isMe = msg.senderName === "You";
                return (
                  <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[12px] font-bold ${isMe ? 'text-sky-600' : 'text-[#9B3434]'}`}>
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-stone-400 font-medium">
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`
                      max-w-[85%] px-4 py-3 text-[13px] leading-relaxed
                      ${isMe ? 'bg-[#FCEEED] text-stone-800 rounded-[16px] rounded-tr-sm border border-red-50' : 
                               'bg-[#F0F4FF] text-stone-800 rounded-[16px] rounded-tl-sm border border-blue-50'}
                    `}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-stone-50 shrink-0">
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

          {/* Engagement Panel */}
          <div className="w-full h-[140px] bg-white rounded-[24px] shadow-sm border border-stone-100 p-5 flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[#9B3434] text-[12px] font-bold tracking-widest uppercase">Engagement</span>
              <span className="bg-sky-50 text-sky-600 text-[10px] font-bold px-2 py-1 rounded-full">Live Analytics</span>
            </div>
            
            <div className="flex gap-4">
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