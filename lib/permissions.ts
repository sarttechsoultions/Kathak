export const SIDEBAR_PERMISSIONS = [
  { value: "VIEW_DASHBOARD", label: "Dashboard", href: "/admin/dashboard" },
  { value: "MANAGE_STUDENTS", label: "Students", href: "/admin/student" },
  { value: "MANAGE_TEACHERS", label: "Teachers", href: "/admin/teachers" },
  { value: "MANAGE_COURSES", label: "Course Management", href: "/admin/courses" },
  { value: "MANAGE_BATCHES", label: "Batch Management", href: "/admin/batches" },
  { value: "MANAGE_ASSIGNMENTS", label: "Assignment Management", href: "/admin/assignments" },
  { value: "MANAGE_CLASSES", label: "Class Management", href: "/admin/class-management" },
  { value: "MANAGE_RECORDED_CLASSES", label: "Recorded Classes", href: "/admin/recorded-class" },
  { value: "MANAGE_VIDEO_REVIEWS", label: "Video Reviews", href: "/admin/video-review" },
  { value: "MANAGE_EXAMS", label: "Exams", href: "/admin/exam" },
  { value: "VIEW_EXAM_RESULTS", label: "Exam Results", href: "/admin/exam-results" },
  { value: "MANAGE_ATTENDANCE", label: "Attendance", href: "/admin/attendance" },
  { value: "MANAGE_EVENTS", label: "Events & Workshops", href: "/admin/events" },
  { value: "MANAGE_COMMUNICATION", label: "Communication", href: "/admin/communication" },
  { value: "MANAGE_CONTENT_LIBRARY", label: "Content Library", href: "/admin/content-library" },
  { value: "VIEW_PAYMENTS", label: "Finance", href: "/admin/finance" },
  { value: "MANAGE_WEBSITE", label: "Website", href: "/admin/website" },
  { value: "VIEW_ANALYTICS", label: "Reports & Analytics", href: "/admin/analytics" },
  { value: "MANAGE_CERTIFICATES", label: "Certificates", href: "/admin/certificates" },
  { value: "MANAGE_SETTINGS", label: "Settings", href: "/admin/settings" },
  { value: "MANAGE_SUPPORT", label: "Support", href: "/admin/support" },
] as const;

export type SidebarPermission = (typeof SIDEBAR_PERMISSIONS)[number]["value"];

export interface AuthSessionUser {
  role: "ADMIN" | "TEACHER" | "STUDENT";
  permissions: string[];
}

export function canAccessRoute(user: AuthSessionUser | null, href: string): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return SIDEBAR_PERMISSIONS.some(
    (permission) =>
      user.permissions.includes(permission.value) &&
      (href === permission.href || href.startsWith(`${permission.href}/`))
  );
}

export function getDefaultAccessibleRoute(user: AuthSessionUser | null): string | null {
  if (!user) return null;
  if (user.role === "ADMIN") return "/admin/dashboard";
  return SIDEBAR_PERMISSIONS.find((permission) => user.permissions.includes(permission.value))?.href ?? null;
}
