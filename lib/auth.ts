/**
 * Centralized client-side session management for admin and student portals.
 */

export type AuthPortal = "admin" | "student";

export interface SessionUser {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "ADMIN" | "TEACHER" | "STUDENT";
  avatarUrl?: string;
  permissions?: string[];
  studentId?: string;
}

const PORTAL_KEYS = {
  admin: {
    token: "kathak_admin_token",
    user: "kathak_session_user",
    expiry: "kathak_admin_token_expiry",
  },
  student: {
    token: "kathak_student_token",
    user: "kathak_student_user",
    expiry: "kathak_student_token_expiry",
  },
} as const;

const LEGACY_TOKEN_KEY = "kathak_token";

export function getPortalToken(portal: AuthPortal): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PORTAL_KEYS[portal].token);
}

export function getActiveToken(): string | null {
  if (typeof window === "undefined") return null;
  const isStudentRoute = window.location.pathname.startsWith("/student");
  const portal: AuthPortal = isStudentRoute ? "student" : "admin";
  return (
    getPortalToken(portal) ||
    getPortalToken(portal === "student" ? "admin" : "student") ||
    localStorage.getItem(LEGACY_TOKEN_KEY)
  );
}

export function getSessionUser(portal: AuthPortal): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PORTAL_KEYS[portal].user);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setPortalSession(
  portal: AuthPortal,
  token: string,
  user: SessionUser,
  expiresInMs = 7 * 24 * 60 * 60 * 1000
): void {
  if (typeof window === "undefined") return;
  const keys = PORTAL_KEYS[portal];
  localStorage.setItem(keys.token, token);
  localStorage.setItem(keys.user, JSON.stringify(user));
  localStorage.setItem(keys.expiry, String(Date.now() + expiresInMs));
  localStorage.setItem(LEGACY_TOKEN_KEY, token);

  if (portal === "admin") {
    document.cookie = `kathak_admin_token=${token}; path=/; max-age=${Math.floor(expiresInMs / 1000)}; SameSite=Lax`;
  }
}

export function clearPortalSession(portal: AuthPortal): void {
  if (typeof window === "undefined") return;
  const keys = PORTAL_KEYS[portal];
  localStorage.removeItem(keys.token);
  localStorage.removeItem(keys.user);
  localStorage.removeItem(keys.expiry);
  sessionStorage.removeItem(keys.token);

  if (portal === "admin") {
    document.cookie = "kathak_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  const otherPortal: AuthPortal = portal === "admin" ? "student" : "admin";
  if (!getPortalToken(otherPortal)) {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }
}

export function clearAllSessions(): void {
  clearPortalSession("admin");
  clearPortalSession("student");
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function isStudentPortalRole(user: SessionUser | null): boolean {
  return user?.role === "STUDENT" || !user?.role;
}

export function isAdminPortalRole(user: SessionUser | null): boolean {
  return user?.role === "ADMIN" || user?.role === "TEACHER";
}
