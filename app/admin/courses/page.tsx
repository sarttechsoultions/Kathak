"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, ChevronDown, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest, ENDPOINTS } from "@/lib/api";
import { openThemeSuccess, openThemeConfirm } from "@/components/ThemeDialogProvider";

interface CourseRecord {
  id: string;
  code: string;
  title: string;
  category: string;
  level: string;
  groupFeeINR: number;
  groupFeeUSD: number;
  groupClassesCount: string;
  oneToOneFeeINR: number;
  oneToOneFeeUSD: number;
  published: boolean;
  thumbnail: string;
}

export default function AdminCoursesListPage() {
  const router = useRouter();
  const [coursesList, setCoursesList] = useState<CourseRecord[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("All Categories");
  const [courseLevelFilter, setCourseLevelFilter] = useState("All Levels");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoursesData = async () => {
    setIsLoading(true);
    try {
     const res = await apiRequest(ENDPOINTS.ADMIN_COURSES);
      if (res.data?.courses) {
        setCoursesList(res.data.courses);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await Promise.resolve();
      fetchCoursesData();
    };
    initFetch();
  }, []);

  const handleDeleteCourse = async (id: string, title: string) => {
    if (await openThemeConfirm(`Delete course "${title}"?`, "Delete Course")) {
      try {
        await apiRequest(`${ENDPOINTS.ADMIN_COURSES}/${id}`, { method: "DELETE" });
        openThemeSuccess(`Course deleted successfully.`, "Deleted");
        await fetchCoursesData();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete course.";
        alert(errorMessage);
      }
    }
  };

  const filteredCourses = coursesList.filter((crs) => {
    const searchLower = courseSearch.toLowerCase().trim();
    const matchesSearch = !searchLower || crs.title.toLowerCase().includes(searchLower) || crs.code?.toLowerCase().includes(searchLower);
    const matchesCategory = courseCategoryFilter === "All Categories" || crs.category === courseCategoryFilter;
    const matchesLevel = courseLevelFilter === "All Levels" || crs.level === courseLevelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">Course Catalog</h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-500">Manage institutional learning tracks and fee structures.</p>
        </div>
        <button onClick={() => router.push("/admin/courses/create")} className="px-5 py-2.5 rounded-xl bg-[#9E0C25] hover:bg-[#800A1E] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0">
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative min-w-[220px] w-full sm:w-auto">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800 focus:bg-white focus:outline-none focus:border-[#9E0C25]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-stone-200/80 text-[10.5px] font-extrabold uppercase tracking-wider text-stone-400">
                <th className="py-3 px-4">COURSE</th>
                <th className="py-3 px-4">GROUP FEE (INR/USD)</th>
                <th className="py-3 px-4">1-ON-1 FEE (INR/USD)</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((crs) => (
                  <tr key={crs.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={crs.thumbnail || "/Ananya.png"} alt={crs.title} className="w-12 h-10 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-100" />
                        <div>
                          <span className="block font-bold text-stone-900 text-sm">{crs.title}</span>
                          <span className="block text-[10px] text-stone-400 font-semibold">{crs.groupClassesCount || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-stone-800">
                      ₹{crs.groupFeeINR?.toLocaleString("en-IN")} / ${crs.groupFeeUSD}
                    </td>
                    <td className="py-4 px-4 font-bold text-stone-800">
                      ₹{crs.oneToOneFeeINR?.toLocaleString("en-IN")} / ${crs.oneToOneFeeUSD}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${crs.published !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                        {crs.published !== false ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-stone-400">
                        <button onClick={() => router.push(`/admin/courses/${crs.id}`)} className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => router.push(`/admin/courses/${crs.id}/edit`)} className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded-lg"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteCourse(crs.id, crs.title)} className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400 text-xs font-semibold">No courses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}