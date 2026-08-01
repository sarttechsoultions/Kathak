"use client";

import React, { useEffect, useState } from "react";
import { Calendar, ExternalLink, Loader2, Mic, MicOff, Play, Plus, Video, Video as VideoIcon, VideoOff } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { AgoraProvider } from "@/lib/agoraClient";
import { LocalVideoTrack, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRemoteUsers } from "agora-rtc-react";
import { LiveChatPanel } from "../liveclass/LiveChatPanel";
import { getSocket } from "@/lib/socket";

type Batch = { id: string; name: string; code: string; status: string; teacher: string };
type LiveClass = { id: string; title: string; teacherName: string; scheduledStart: string; scheduledEnd: string; status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED"; batchName: string; batchCode: string };
type JoinInfo = { appId: string; channelName: string; token: string; uid: number };

const CLASSES_ENDPOINT = "/admin/classes";

const dateTime = (value: string) => new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default function ClassManagementView() {
  const [classes, setClasses] = useState<LiveClass[]>([]); const [batches, setBatches] = useState<Batch[]>([]); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [openedClass, setOpenedClass] = useState<LiveClass | null>(null);
  const [form, setForm] = useState({ batchId: "", title: "", teacherName: "", scheduledStart: "", scheduledEnd: "" });
  const load = async () => { setLoading(true); try { const [classData, batchData] = await Promise.all([apiRequest(CLASSES_ENDPOINT), apiRequest(ENDPOINTS.ADMIN_BATCHES)]); setClasses(classData.data?.classes ?? []); const active = (batchData.data?.batches ?? []).filter((batch: Batch) => batch.status === "Active"); setBatches(active); setForm((value) => { const batch = active.find((item: Batch) => item.id === value.batchId) || active[0]; return { ...value, batchId: batch?.id || "", teacherName: batch?.teacher || "" }; }); } finally { setLoading(false); } };
  useEffect(() => { load().catch(() => setLoading(false)); }, []);
  const createClass = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); try { await apiRequest(CLASSES_ENDPOINT, { method: "POST", body: JSON.stringify({ ...form, scheduledStart: new Date(form.scheduledStart).toISOString(), scheduledEnd: new Date(form.scheduledEnd).toISOString() }) }); setForm((value) => ({ ...value, title: "", scheduledStart: "", scheduledEnd: "" })); await load(); } finally { setSaving(false); } };
  const setStatus = async (id: string, status: "LIVE" | "COMPLETED") => { await apiRequest(`${CLASSES_ENDPOINT}/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); await load(); };
  if (openedClass) return <AdminLiveRoom liveClass={openedClass} onBack={() => setOpenedClass(null)} />;
  return <div className="max-w-[1200px] mx-auto space-y-8"><div><h1 className="font-playfair font-bold text-3xl text-stone-900">Class Management</h1><p className="text-sm text-stone-500 mt-1">Private live classes for active batch students.</p></div><form onSubmit={createClass} className="bg-white border border-stone-200 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><select required value={form.batchId} onChange={(e) => { const batch = batches.find((item) => item.id === e.target.value); setForm({ ...form, batchId: e.target.value, teacherName: batch?.teacher || "" }); }} className="h-11 rounded-xl border border-stone-200 px-3 text-sm"><option value="">Select active batch</option>{batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.name} · {batch.code}</option>)}</select><input required placeholder="Class title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-11 rounded-xl border border-stone-200 px-3 text-sm"/><input readOnly placeholder="Assigned teacher" value={form.teacherName} className="h-11 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm"/><label className="text-xs font-semibold text-stone-500">Start<input required type="datetime-local" value={form.scheduledStart} onChange={(e) => setForm({ ...form, scheduledStart: e.target.value })} className="mt-1 h-11 w-full rounded-xl border border-stone-200 px-3 text-sm"/></label><label className="text-xs font-semibold text-stone-500">End<input required type="datetime-local" value={form.scheduledEnd} onChange={(e) => setForm({ ...form, scheduledEnd: e.target.value })} className="mt-1 h-11 w-full rounded-xl border border-stone-200 px-3 text-sm"/></label><button disabled={saving || !batches.length} className="self-end h-11 rounded-xl bg-[#9E0C25] text-white font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-50"><Plus className="w-4 h-4" />{saving ? "Creating…" : "Schedule class"}</button></form><div className="bg-white border border-stone-200 rounded-3xl overflow-hidden"><div className="p-6 border-b font-bold text-stone-900 flex gap-2"><Calendar className="w-5 h-5 text-[#9E0C25]" />Scheduled classes</div>{loading ? <div className="p-12 text-center"><Loader2 className="inline animate-spin" /></div> : classes.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-stone-50 text-xs uppercase text-stone-500"><tr><th className="p-4">Class</th><th className="p-4">Batch</th><th className="p-4">Start</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr></thead><tbody>{classes.map((item) => <tr key={item.id} className="border-t"><td className="p-4 font-bold">{item.title}<span className="block text-xs text-stone-500 font-normal">{item.teacherName}</span></td><td className="p-4">{item.batchName}</td><td className="p-4">{dateTime(item.scheduledStart)}</td><td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === "LIVE" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>{item.status}</span></td><td className="p-4 text-right">{item.status === "SCHEDULED" ? <button onClick={() => setStatus(item.id, "LIVE")} className="px-3 py-2 rounded-lg bg-[#9E0C25] text-white font-bold text-xs"><Play className="inline w-3 h-3 mr-1" />Start</button> : item.status === "LIVE" ? <span className="flex justify-end gap-2"><button onClick={() => setOpenedClass(item)} className="px-3 py-2 rounded-lg border text-xs font-bold"><ExternalLink className="inline w-3 h-3 mr-1" />Open</button><button onClick={() => setStatus(item.id, "COMPLETED")} className="px-3 py-2 rounded-lg border text-xs font-bold">End</button></span> : "—"}</td></tr>)}</tbody></table></div> : <div className="p-12 text-center text-stone-400"><Video className="w-8 h-8 mx-auto mb-2" />No live classes scheduled.</div>}</div></div>;
}

function AdminLiveRoom({ liveClass, onBack }: { liveClass: LiveClass; onBack: () => void }) {
  const [joinInfo, setJoinInfo] = useState<JoinInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ data: JoinInfo }>(`/classes/${liveClass.id}/join-token`)
      .then((res) => setJoinInfo(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load this class."));
  }, [liveClass.id]);

  return (
    <div className="max-w-[1350px] mx-auto space-y-5">
      <button onClick={onBack} className="text-sm font-bold text-[#9E0C25]">← Back to class schedule</button>
      <div>
        <h1 className="text-2xl font-bold">{liveClass.title}</h1>
        <p className="text-sm text-stone-500">{liveClass.batchName} · {liveClass.teacherName}</p>
      </div>
      {error ? (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-2xl">{error}</div>
      ) : !joinInfo ? (
        <div className="p-12 text-center"><Loader2 className="inline animate-spin" /></div>
      ) : (
        <AgoraProvider>
          <AdminLiveRoomInner liveClass={liveClass} joinInfo={joinInfo} onBack={onBack} />
        </AgoraProvider>
      )}
    </div>
  );
}

interface Participant {
  id: string;
  userName: string;
  userRole: string;
  joinedAt: string;
}

function AdminLiveRoomInner({ liveClass, joinInfo, onBack }: { liveClass: LiveClass; joinInfo: JoinInfo; onBack: () => void }) {
  const channelName = joinInfo?.channelName || "kathak-live";
  const appId = joinInfo?.appId || "testing";
  useJoin(
    { appid: appId, channel: channelName, token: joinInfo?.token || null, uid: joinInfo?.uid || 999999 },
    Boolean(joinInfo?.channelName && joinInfo?.appId)
  );

  const [handRaises, setHandRaises] = useState<{ senderName: string; at: string }[]>([]);
  const [joinedParticipants, setJoinedParticipants] = useState<Participant[]>([]);
  const [spotlightUser, setSpotlightUser] = useState<any>(null);

  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

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
  usePublish(tracksToPublish);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("liveclass:join", { roomName: joinInfo.channelName, userName: "Super Admin", userRole: "Admin" });

    const onRoomUsers = (users: Participant[]) => {
      if (Array.isArray(users)) {
        setJoinedParticipants(users);
      }
    };

    const onUserJoined = (user: Participant) => {
      setJoinedParticipants((prev) => {
        if (prev.some((p) => p.userName === user.userName)) return prev;
        return [...prev, user];
      });
    };

    const onUserLeft = (user: { id: string; userName: string }) => {
      setJoinedParticipants((prev) => prev.filter((p) => p.userName !== user.userName));
    };

    const onRaise = (payload: { senderName: string; at: string }) => setHandRaises((prev) => [payload, ...prev].slice(0, 20));

    socket.on("liveclass:room-users", onRoomUsers);
    socket.on("liveclass:user-joined", onUserJoined);
    socket.on("liveclass:user-left", onUserLeft);
    socket.on("liveclass:raise-hand", onRaise);

    return () => {
      socket.emit("liveclass:leave", { roomName: joinInfo.channelName });
      socket.off("liveclass:room-users", onRoomUsers);
      socket.off("liveclass:user-joined", onUserJoined);
      socket.off("liveclass:user-left", onUserLeft);
      socket.off("liveclass:raise-hand", onRaise);
    };
  }, [joinInfo.channelName]);

  const remoteUsers = useRemoteUsers();
  const teacher = remoteUsers.find((u) => u.uid === 1);
  const students = remoteUsers.filter((u) => u.uid !== 1);

  // Filter out generic strings (Student/User) & Admin/Teacher names to isolate actual joined students
  const uniqueStudentParticipants = Array.from(
    new Map(
      joinedParticipants
        .filter(
          (p) =>
            p.userName &&
            p.userName !== "Student" &&
            p.userName !== "User" &&
            p.userName !== liveClass.teacherName &&
            p.userName !== "Admin" &&
            p.userName !== "Super Admin"
        )
        .map((p) => [p.userName, p])
    ).values()
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
      
      {/* LEFT COLUMN: Main Video Window, Thumbnails & Participant Names below Video */}
      <div className="space-y-3">
        {/* 1. Main Video Window */}
        <div className="relative h-[60vh] bg-black rounded-3xl overflow-hidden shadow-sm">
          {spotlightUser ? (
            <>
              <RemoteUser user={spotlightUser} playVideo playAudio className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 rounded-xl bg-black/75 backdrop-blur-xs px-3.5 py-2 text-xs font-extrabold text-white flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Viewing Student: {uniqueStudentParticipants.find((p) => p.userName)?.userName || `Student #${spotlightUser.uid}`}</span>
                <button
                  onClick={() => setSpotlightUser(null)}
                  className="rounded-lg bg-white/20 hover:bg-white/30 px-2.5 py-1 text-[11px] text-white font-black cursor-pointer transition-colors"
                >
                  Switch to Teacher Camera
                </button>
              </div>
            </>
          ) : teacher ? (
            <>
              <RemoteUser user={teacher} playVideo playAudio className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-xs font-bold text-white">
                {liveClass.teacherName} (Teacher)
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">Waiting for the teacher&apos;s camera…</div>
          )}

          {/* Admin Controls Overlay (Mic & Camera Switch Buttons) */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-black/75 px-3 py-2 backdrop-blur-sm z-20">
            <button
              onClick={() => setMicOn((v) => !v)}
              className={`rounded-full p-2 text-white transition-colors cursor-pointer ${micOn ? "bg-emerald-600 hover:bg-emerald-700" : "bg-white/10 hover:bg-white/20"}`}
              title={micOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCamOn((v) => !v)}
              className={`rounded-full p-2 text-white transition-colors cursor-pointer ${camOn ? "bg-emerald-600 hover:bg-emerald-700" : "bg-white/10 hover:bg-white/20"}`}
              title={camOn ? "Turn Off Camera" : "Turn On Camera"}
            >
              {camOn ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>
            <span className="text-[11px] font-bold text-stone-200 ml-1">
              Admin Camera: {camOn ? "ON 🟢" : "OFF 🔴"}
            </span>
          </div>

          {/* Admin Self Camera PIP Preview when Camera is ON */}
          {camOn && (
            <div className="absolute bottom-4 right-4 h-28 w-36 overflow-hidden rounded-2xl border-2 border-white/50 bg-stone-900 shadow-2xl z-20">
              {localCameraTrack ? (
                <LocalVideoTrack track={localCameraTrack} play className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-stone-400">Camera starting…</div>
              )}
              <div className="absolute bottom-1 left-1 bg-black/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-extrabold text-white truncate max-w-[120px]">
                Super Admin (You)
              </div>
            </div>
          )}
        </div>

        {/* 2. Joined Profiles Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1.5 bg-white border border-stone-200 rounded-2xl p-3">
          <span className="text-xs font-extrabold text-stone-500 flex items-center gap-1.5 mr-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Joined Profiles:</span>
          </span>

            {/* Always show teacher host */}
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{liveClass.teacherName} (Host)</span>
            </span>

            {/* Show Admin */}
            <span className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-900 font-extrabold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Super Admin (Admin)</span>
            </span>

            {/* List Joined Unique Student Names */}
            {uniqueStudentParticipants.map((p, idx) => (
              <span
                key={p.id || idx}
                className="px-3 py-1 rounded-full bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{p.userName}</span>
                <span className="text-[10px] font-semibold text-stone-400">({p.userRole || "Student"})</span>
              </span>
            ))}
          </div>

        {/* 3. Student Video Profile Thumbnail Cards BELOW Joined Profiles */}
        {(uniqueStudentParticipants.length > 0 || students.length > 0) && (
          <div className="flex gap-3 overflow-x-auto pb-1 pt-1">
            {uniqueStudentParticipants.length > 0 ? (
              uniqueStudentParticipants.map((p, idx) => {
                const agoraUser = students[idx];
                return (
                  <div
                    key={p.id || idx}
                    onClick={() => agoraUser && setSpotlightUser(agoraUser)}
                    className="relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-stone-200 bg-stone-900 shadow-md cursor-pointer hover:border-emerald-400 transition-all group"
                    title="Click to spotlight student camera"
                  >
                    {agoraUser ? (
                      <RemoteUser user={agoraUser} playVideo playAudio className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-amber-400/90 text-xs font-bold bg-stone-900">
                        Camera off
                      </div>
                    )}
                    <div className="absolute bottom-1.5 left-1.5 bg-black/85 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white truncate max-w-[125px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{p.userName}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              students.map((s) => (
                <div
                  key={s.uid}
                  onClick={() => setSpotlightUser(s)}
                  className="relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-stone-200 bg-stone-900 shadow-md cursor-pointer hover:border-emerald-400 transition-all group"
                  title="Click to spotlight student camera"
                >
                  <RemoteUser user={s} playVideo playAudio className="h-full w-full object-cover" />
                  <div className="absolute bottom-1.5 left-1.5 bg-black/85 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white truncate max-w-[125px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Student #{s.uid}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Engagement Card with Total Participants & Live Chat */}
      <div className="space-y-4">
        {/* Engagement & Active Status Card with Total Participants */}
        <div className="rounded-3xl border border-stone-200 bg-white p-4 space-y-3">
          <p className="text-xs font-bold uppercase text-stone-400">Engagement & Active Status</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-black text-stone-900">{students.length || 1}</p>
              <p className="text-xs font-bold text-stone-500">Live Active</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#9E0C25]">{handRaises.length}</p>
              <p className="text-xs font-bold text-stone-500">Hand raises</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600">
                {1 + uniqueStudentParticipants.length}
              </p>
              <p className="text-xs font-bold text-stone-500">Total Participants</p>
            </div>
          </div>
        </div>

        {/* Live Chat Panel */}
        <div className="h-[50vh]">
          <LiveChatPanel roomName={joinInfo.channelName} senderName="Super Admin" userRole="Admin" />
        </div>

        <button onClick={onBack} className="w-full rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] px-4 py-3 text-sm font-bold text-white transition-colors cursor-pointer">
          Stop monitoring
        </button>
      </div>

    </div>
  );
}