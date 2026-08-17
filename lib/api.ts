export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Universal Fetch API Helper
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const defaultHeaders: Record<string, string> = isFormData
    ? {}
    : {
        "Content-Type": "application/json",
      };

  // Automatically attach auth token from localStorage if in client browser environment
  if (typeof window !== "undefined") {
    const studentToken = localStorage.getItem("kathak_student_token");
    const adminToken = localStorage.getItem("kathak_admin_token");
    const genericToken = localStorage.getItem("kathak_token");

    let token: string | null = null;
    if (window.location.pathname.startsWith("/student")) {
      token = studentToken || genericToken;
    } else if (window.location.pathname.startsWith("/admin")) {
      token = adminToken || genericToken;
    } else {
      token = adminToken || studentToken || genericToken;
    }

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include", 
    cache: "no-store",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

let data;

try {
  data = await response.json();
} catch {
  data = null;
}
  if (!response.ok) {
    throw new Error(data?.message || `API Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Endpoints Registry
 */
export const ENDPOINTS = {
  HEALTH: "/health",
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_TEACHERS: "/admin/teachers",
  ADMIN_BATCHES: "/admin/batches",
  ADMIN_ATTENDANCE: "/admin/attendance",
  ADMIN_FINANCE: "/admin/finance",
  ADMIN_CERTIFICATES: "/admin/certificates",
  ADMIN_EXAMS: "/admin/exams",
  ADMIN_REPORTS_OVERVIEW: "/admin/reports/overview",
  STUDENT_ENROLL: "/student/enroll",
  PUBLIC_COURSES: "/student/public/courses",
  SUPPORT_SUBMIT: "/support/ticket",
  NOTIFICATIONS: "/notifications",
  INQUIRIES: "/inquiries",
  ADMIN_INQUIRIES: "/admin/inquiries",
  ADMIN_COURSES: "/admin/courses",
  ADMIN_COURSE_BY_ID: "/admin/courses/:id",
  COURSES: "/courses",
  COURSE_BY_ID: "/courses/:id",
  AUTH_ME: "/auth/me",
  AUTH_CHANGE_PASSWORD: "/auth/change-password",
  AUTH_PROFILE: "/auth/profile",
  LIVE_CLASS_TEACHER: "/liveclass/teacher/classes",
  UPLOAD_IMAGE: "/upload/image",
  UPLOAD_VIDEO: "/upload/video",
  UPLOAD_FILE: "/upload/file",
  ADMIN_RECORDED_CLASSES: "/admin/recorded-classes",
  STUDENT_RECORDED_CLASSES: "/student/recorded-classes",
  ADMIN_EVENTS: "/admin/events",
  ADMIN_EVENTS_STATS: "/admin/events/stats",
  STUDENT_EVENTS: "/student/events",
  STUDENT_COMPETITION_TRACK: "/student/competition/track",
  TEACHER_SETTINGS: "/teacher/settings",
  CREATE_ORDER: "/payment/create-order",
};
