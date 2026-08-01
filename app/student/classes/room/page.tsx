"use client";

export const dynamic = "force-dynamic";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import dynamicImport from "next/dynamic";
import { apiRequest } from "@/lib/api";
import type { JoinInfo } from "@/components/liveclass/StudentRoomInner";

const DynamicStudentRoomInner = dynamicImport(
  () => import("@/components/liveclass/StudentRoomInner"),
  { ssr: false }
);

function StudentLiveClassRoomContent() {
  const params = useSearchParams();
  const router = useRouter();
  const classId = params.get("classId");

  const [joinInfo, setJoinInfo] = useState<JoinInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!classId) return;
    apiRequest<{ data: JoinInfo }>(`/classes/${classId}/join-token`)
      .then((res) => setJoinInfo(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to join this class."));
  }, [classId]);

  if (!classId) {
    return <div className="max-w-2xl mx-auto mt-10 rounded-2xl bg-rose-50 p-6 text-rose-700">No class selected.</div>;
  }

  if (error) return <div className="max-w-2xl mx-auto mt-10 rounded-2xl bg-rose-50 p-6 text-rose-700">{error}</div>;
  if (!joinInfo) return <div className="mt-16 text-center text-stone-400"><Loader2 className="inline animate-spin mr-2" />Loading your class…</div>;

  return (
    <DynamicStudentRoomInner
      joinInfo={joinInfo}
      onLeave={() => router.push("/student/classes")}
    />
  );
}

export default function StudentLiveClassRoomPage() {
  return (
    <Suspense fallback={<div className="mt-16 text-center text-stone-400"><Loader2 className="inline animate-spin mr-2" />Loading room…</div>}>
      <StudentLiveClassRoomContent />
    </Suspense>
  );
}