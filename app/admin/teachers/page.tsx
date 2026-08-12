"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeConfirm, openThemeSuccess } from "@/components/ThemeDialogProvider";
import { TeacherRecord, DirectoryRecord } from "@/components/admin/teachers/types";
import { MainTeacherList } from "@/components/admin/teachers/MainTeacherList";

export default function AdminTeachersPage() {
  const router = useRouter();

  const [facultyList, setFacultyList] = useState<TeacherRecord[]>([]);
  const [directoryList, setDirectoryList] = useState<DirectoryRecord[]>([]);
  
  const [metrics, setMetrics] = useState({
    totalActiveFaculty: 0,
    classesToday: 0,
    averageRating: "0.0",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeachersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(ENDPOINTS.ADMIN_TEACHERS);
      
      const teachers: TeacherRecord[] = Array.isArray(res) ? res : res?.data?.teachers || [];
      const directory: DirectoryRecord[] = res?.data?.directory || [];
      const metricsData = res?.data?.metrics || {
        totalActiveFaculty: teachers.filter((t) => t.status === "Active").length,
        classesToday: 0,
        averageRating: "0.0",
      };

      setFacultyList(teachers);
      setDirectoryList(directory);
      setMetrics(metricsData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch teachers:", message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadTeachers = async () => {
      await fetchTeachersData();
    };

    void loadTeachers();
  }, [fetchTeachersData]);

  const handleToggleStatus = async (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Disabled" : "Active";
    try {
      await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: newStatus === "Active" }),
      });
      await openThemeSuccess(
        `Teacher ${name} status updated to ${newStatus}!`,
        "Faculty Status Updated"
      );
      await fetchTeachersData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message || "Failed to update teacher status.");
    }
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (await openThemeConfirm(`Are you sure you want to delete teacher "${name}"?`, "Delete Teacher")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_TEACHERS}/${id}`, { method: "DELETE" });
        await openThemeSuccess(`Teacher "${name}" deleted successfully from Database!`, "Teacher Deleted");
        await fetchTeachersData();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        alert(message || "Failed to delete teacher account.");
      }
    }
  };

  return (
    <MainTeacherList
      facultyList={facultyList}
      directoryList={directoryList}
      metrics={metrics}
      isLoading={isLoading}
      onOpenCreateForm={() => router.push("/admin/teachers/create")}
      onOpenEditForm={(faculty) => router.push(`/admin/teachers/${faculty.id}/edit`)}
      onViewTeacherDetails={(faculty) => router.push(`/admin/teachers/${faculty.id}`)}
      onToggleStatus={handleToggleStatus}
      onDeleteTeacher={handleDeleteTeacher}
    />
  );
}
