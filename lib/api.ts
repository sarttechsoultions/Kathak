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
    const token = localStorage.getItem("kathak_admin_token") || localStorage.getItem("kathak_token");
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
  HEALTH: `${API_BASE_URL}/health`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  ADMIN_STUDENTS: `${API_BASE_URL}/admin/students`,
  ADMIN_TEACHERS: `${API_BASE_URL}/admin/teachers`,
  INQUIRIES: `${API_BASE_URL}/inquiries`,
  COURSES: `${API_BASE_URL}/courses`,
};
