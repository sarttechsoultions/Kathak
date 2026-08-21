"use client";

export const dynamic = "force-dynamic";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function StudentRoomRedirect() {
  const params = useSearchParams();
  const router = useRouter();
  const classId = params.get("classId");

  useEffect(() => {
    if (classId) {
      router.replace(`/student/classes/room/${classId}`);
      return;
    }
    router.replace("/student/classes");
  }, [classId, router]);

  return (
    <div className="mt-16 text-center text-stone-400">
      <Loader2 className="inline animate-spin mr-2" />Opening your class…
    </div>
  );
}

export default function StudentLiveClassRoomLegacyPage() {
  return (
    <Suspense fallback={<div className="mt-16 text-center text-stone-400"><Loader2 className="inline animate-spin mr-2" />Loading room…</div>}>
      <StudentRoomRedirect />
    </Suspense>
  );
}
