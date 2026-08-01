/**
 * Centralized API Client & Base URL Configuration for Kathak Next
 * 
 * Changing NEXT_PUBLIC_API_BASE_URL in .env.local will update all API calls across the app!
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Universal Fetch API Helper
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Automatically attach auth token from localStorage if in client browser environment
  if (typeof window !== "undefined") {
    const isStudentRoute = window.location.pathname.startsWith("/student");
    const token = isStudentRoute
      ? (localStorage.getItem("kathak_student_token") || localStorage.getItem("kathak_admin_token") || localStorage.getItem("kathak_token"))
      : (localStorage.getItem("kathak_admin_token") || localStorage.getItem("kathak_student_token") || localStorage.getItem("kathak_token"));
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API Request failed with status ${response.status}`);
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
  STUDENT_ENROLL: "/student/enroll",
  INQUIRIES: "/inquiries",
  COURSES: "/courses",
  AUTH_ME: "/auth/me",
  AUTH_CHANGE_PASSWORD: "/auth/change-password",
  UPLOAD_IMAGE: "/upload/image",
  UPLOAD_VIDEO: "/upload/video",
  UPLOAD_FILE: "/upload/file",
};
