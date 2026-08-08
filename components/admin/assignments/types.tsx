import React from "react";

export interface AssignmentItem {
  id: string;
  teacherName?: string;
  teacherDept?: string;
  teacherAvatar?: string;
  teacherDesignation?: string;
  title: string;
  typeTag: string;
  targetBatch: string;
  dueDate: string;
  totalStudents: string;
  submissions?: any[];
  batchName?: string;
  batch?: any;
  createdByName?: string;
  createdBy?: any;
  teacher?: any;
}

export interface SubmittedAssignmentRecord {
  id: string;
  studentName: string;
  studentId: string;
  studentAvatar?: string;
  assignmentTitle: string;
  batch: string;
  submittedDate: string;
  status: "Submitted" | "Overdue" | "Pending";
  assignmentId?: string;
  fileUrl?: string;
  grade?: string | null;
  feedback?: string | null;
  notes?: string | null;
}

export interface BatchOption {
  id: string;
  name: string;
  courseId?: string;
  courseName?: string;
}

export interface CourseOption {
  id: string;
  title: string;
}

export interface VideoSubmissionCard {
  id: string;
  studentName: string;
  studentAvatar: string;
  submittedTime: string;
  thumbnail: string;
  duration: string;
  status: "Pending Review" | "Reviewed";
  score?: string;
  codePill: string;
  message?: string;
  fileUrl?: string;
}

export interface CriteriaPart {
  id: string;
  name: string;
  score: number;
}

// Format video URL to handle relative backend paths, cloud URLs, iframe embeds, and fallbacks
export const formatVideoUrl = (rawUrl?: string): { isIframe: boolean; url: string } => {
  const fallbackVideo = "https://vjs.zencdn.net/v/oceans.mp4";

  if (!rawUrl || rawUrl.trim() === "" || rawUrl === "---" || rawUrl === "null" || rawUrl === "undefined") {
    return { isIframe: false, url: fallbackVideo };
  }

  let cleanUrl = rawUrl.trim();

  // If path is relative to backend (e.g. /uploads/video.mp4 or uploads/video.mp4)
  if (cleanUrl.startsWith("/uploads") || cleanUrl.startsWith("uploads/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const backendRoot = apiBase.replace(/\/api\/v1\/?$/, "");
    const relativePath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
    cleanUrl = `${backendRoot}${relativePath}`;
  }

  // Detect iframe / embed links (BunnyStream, YouTube, Vimeo, Cloudinary embed)
  const isIframeLink =
    cleanUrl.includes("iframe.mediadelivery.net") ||
    cleanUrl.includes("youtube.com/embed") ||
    cleanUrl.includes("youtu.be") ||
    cleanUrl.includes("vimeo.com") ||
    cleanUrl.includes("/embed/");

  return {
    isIframe: isIframeLink,
    url: cleanUrl,
  };
};

export const renderAvatar = (name: string, avatarUrl?: string, bg = "bg-[#8C2329]") => {
  const hasAvatar = avatarUrl && avatarUrl.trim() !== "" && avatarUrl !== "/Ananya.png";
  if (hasAvatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs"
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = "none";
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
          }
        }}
      />
    );
  }
  return (
    <div
      className={`w-11 h-11 rounded-full ${bg} text-white flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-2xs`}
    >
      {(name || "U")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </div>
  );
};
