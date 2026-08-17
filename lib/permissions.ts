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
  { value: "VIEW_EXAM_RESULTS", label: "Exam Results", href: "/admin/exam/results" },
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

export interface SubPermissionItem {
  value: string;
  label: string;
  description: string;
}

export interface ModulePermissionGroup {
  moduleValue: string;
  moduleLabel: string;
  subPermissions: SubPermissionItem[];
}

export const MODULE_PERMISSIONS_MATRIX: ModulePermissionGroup[] = [
  {
    moduleValue: "MANAGE_STUDENTS",
    moduleLabel: "Student Management",
    subPermissions: [
      { value: "VIEW_STUDENTS", label: "View Student Roster", description: "View student list and profiles" },
      { value: "CREATE_STUDENT", label: "Enroll / Register Student", description: "Create & enroll new student accounts" },
      { value: "EDIT_STUDENT", label: "Edit Student Info", description: "Update profile & password" },
      { value: "DELETE_STUDENT", label: "Delete Student", description: "Permanently delete student accounts" }
    ]
  },
  {
    moduleValue: "MANAGE_BATCHES",
    moduleLabel: "Batch Management",
    subPermissions: [
      { value: "VIEW_BATCHES", label: "View Batch Schedules", description: "View active batches & student rosters" },
      { value: "CREATE_BATCH", label: "Create New Batch", description: "Create batch timings & codes" },
      { value: "EDIT_BATCH", label: "Edit Batch Specs", description: "Update schedules, capacity, teachers" },
      { value: "DELETE_BATCH", label: "Delete Batch", description: "Remove batch records" }
    ]
  },
  {
    moduleValue: "MANAGE_COURSES",
    moduleLabel: "Course Management",
    subPermissions: [
      { value: "VIEW_COURSES", label: "View Course Library", description: "View course fee & syllabus details" },
      { value: "CREATE_COURSE", label: "Create Course", description: "Add new courses and promo videos" },
      { value: "EDIT_COURSE", label: "Edit Course Specs", description: "Modify pricing & content" },
      { value: "DELETE_COURSE", label: "Delete Course", description: "Remove course modules" }
    ]
  },
  {
    moduleValue: "MANAGE_ASSIGNMENTS",
    moduleLabel: "Assignment Management",
    subPermissions: [
      { value: "VIEW_ASSIGNMENTS", label: "View Submissions", description: "Check student homework uploads" },
      { value: "CREATE_ASSIGNMENT", label: "Create Assignment", description: "Post new practice drills" },
      { value: "GRADE_ASSIGNMENT", label: "Grade Submissions", description: "Grade and give feedback" }
    ]
  },
  {
    moduleValue: "MANAGE_CLASSES",
    moduleLabel: "Class & Live Room",
    subPermissions: [
      { value: "VIEW_CLASSES", label: "View Class Schedule", description: "Check upcoming class timetable" },
      { value: "START_LIVE_CLASS", label: "Start Live Class", description: "Host Zoom / Meet live room" },
      { value: "UPLOAD_RECORDED_CLASS", label: "Upload Recordings", description: "Post recorded class video lessons" }
    ]
  },
  {
    moduleValue: "MANAGE_VIDEO_REVIEWS",
    moduleLabel: "Video Performance Reviews",
    subPermissions: [
      { value: "VIEW_VIDEO_REVIEWS", label: "View Performance Clips", description: "Watch student Kathak video clips" },
      { value: "EVALUATE_VIDEO_REVIEW", label: "Submit Evaluation", description: "Rate footwork & give guru feedback" }
    ]
  },
  {
    moduleValue: "MANAGE_EXAMS",
    moduleLabel: "Exams & Results",
    subPermissions: [
      { value: "VIEW_EXAMS", label: "View Exam Papers", description: "Check scheduled exam question papers" },
      { value: "CREATE_EXAM", label: "Create Question Paper", description: "Draft MCQs and theory papers" },
      { value: "GRADE_EXAMS", label: "Evaluate & Publish Marks", description: "Grade answers & release results" }
    ]
  },
  {
    moduleValue: "MANAGE_ATTENDANCE",
    moduleLabel: "Attendance Tracker",
    subPermissions: [
      { value: "VIEW_ATTENDANCE", label: "View Attendance Log", description: "Check monthly attendance percentage" },
      { value: "MARK_ATTENDANCE", label: "Mark Daily Attendance", description: "Mark Present / Absent for classes" }
    ]
  },
  {
    moduleValue: "MANAGE_COMMUNICATION",
    moduleLabel: "Communication & Events",
    subPermissions: [
      { value: "VIEW_COMMUNICATION", label: "View Notice Board", description: "View announcements" },
      { value: "SEND_COMMUNICATION", label: "Broadcast Announcement", description: "Send SMS & email alerts" },
      { value: "VIEW_EVENTS", label: "Manage Workshops & Events", description: "Host Kathak recitals & workshops" }
    ]
  },
  {
    moduleValue: "MANAGE_CERTIFICATES",
    moduleLabel: "Certificates & Support",
    subPermissions: [
      { value: "ISSUE_CERTIFICATE", label: "Issue Completion Certificate", description: "Generate Kathak course certificates" },
      { value: "ANSWER_SUPPORT", label: "Answer Support Inquiries", description: "Respond to student tickets" }
    ]
  }
];

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
