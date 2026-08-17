'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/api'; // Ensure this matches your API utility path

// --- Interfaces ---
interface ExamResultItem {
  id: string;
  examId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  studentIdCode: string;
  batchName: string;
  score: string;
  marksObtained: number | null;
  totalMarks: number;
  status: string;
}

export default function ExamResults() {
  const [results, setResults] = useState<ExamResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch Data
  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Uses the teacher-filtered controller endpoint we created earlier
        const res = await apiRequest<{ data?: { results?: ExamResultItem[] } }>("/admin/exams/results");
        if (isMounted && res?.data?.results) {
          setResults(res.data.results);
        }
      } catch (error) {
        console.error("Failed to fetch exam results:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchResults();
    return () => { isMounted = false; };
  }, []);

  // --- Dynamic Metrics Calculations ---
  const totalStudents = results.length;
  const passedStudents = results.filter(r => r.status === 'Passed').length;
  
  const validScores = results.filter(r => r.marksObtained !== null && r.marksObtained !== undefined);
  const highestScoreObj = validScores.length > 0 ? validScores.reduce((prev, current) => (prev.marksObtained! > current.marksObtained!) ? prev : current) : null;
  const lowestScoreObj = validScores.length > 0 ? validScores.reduce((prev, current) => (prev.marksObtained! < current.marksObtained!) ? prev : current) : null;

  const highestScoreText = highestScoreObj ? `${highestScoreObj.marksObtained}/${highestScoreObj.totalMarks}` : '--/--';
  const lowestScoreText = lowestScoreObj ? `${lowestScoreObj.marksObtained}/${lowestScoreObj.totalMarks}` : '--/--';

  // --- Pagination Logic ---
  const totalPages = Math.max(1, Math.ceil(totalStudents / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };

  // --- Helpers ---
  const getStatusStyles = (status: string) => {
    if (status === 'Passed') return { bg: 'bg-[#E6F4EB]', text: 'text-[#10B981]', dot: 'bg-[#10B981]' };
    if (status === 'Failed' || status === 'Absent') return { bg: 'bg-[#FEF2F2]', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' };
    if (status === 'Pending') return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', dot: 'bg-[#B45309]' };
    return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500' }; // Default
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1C30] p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');
        `
      }} />

      <main className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="mb-6 ">
              <Link href="/teacher/exam" className="inline-flex items-center border border-[#c8c8c8] rounded text-[#0B1C30] hover:text-white hover:bg-[#A42E30] transition-colors">
                <span className="px-4 py-2.5 flex items-center gap-2 text-sm font-semibold">
                  <ArrowLeft className="w-4 h-4" />
                  Back 
                </span>
              </Link>
            </div>
            <h1 className="text-[32px] font-bold text-[#0B1C30] leading-tight mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Exam Participation & Results
            </h1>
            <p className="text-sm text-gray-500">
              Detailed performance and attendance report for Final Assessment Cycle.
            </p>
          </div>
          
          <button className="bg-[#A42E30] hover:bg-[#8B2627] mt-12 sm:mt-0 text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-shadow hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#9333EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">TOTAL STUDENTS</div>
              <div className="text-[24px] font-bold leading-none text-[#0B1C30]">{loading ? "--" : totalStudents}</div>
            </div>
          </div>

          {/* Students Passed */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-shadow hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#E6F4EB] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">STUDENTS PASSED</div>
              <div className="text-[24px] font-bold leading-none text-[#0B1C30]">{loading ? "--" : passedStudents}</div>
            </div>
          </div>

          {/* Highest Score */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-shadow hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">HIGHEST SCORE</div>
              <div className="text-[24px] font-bold leading-none text-[#0B1C30]">{loading ? "--/--" : highestScoreText}</div>
            </div>
          </div>

          {/* Lowest Score */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-shadow hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1">LOWEST SCORE</div>
              <div className="text-[24px] font-bold leading-none text-[#0B1C30]">{loading ? "--/--" : lowestScoreText}</div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Table Header Controls */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-[18px] font-bold text-[#0B1C30]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Individual Exam Participation
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 13a1 1 0 100-2 1 1 0 000 2zm0-5a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Headers */}
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] items-center px-6 py-4 bg-[#F8F9FB] border-b border-gray-100">
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">STUDENT NAME</div>
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">STUDENT ID</div>
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">BATCH NAME</div>
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">SCORE</div>
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase">STATUS</div>
                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase text-right">ACTIONS</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 text-[#A42E30] animate-spin" />
                    <span className="text-sm font-semibold text-gray-500">Loading student records...</span>
                  </div>
                ) : paginatedResults.length === 0 ? (
                  <div className="p-12 text-center text-sm font-semibold text-gray-500">
                    No records found.
                  </div>
                ) : (
                  paginatedResults.map((student) => {
                    const statusStyles = getStatusStyles(student.status);
                    return (
                      <div key={student.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                        
                        {/* Name & Avatar */}
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={student.studentAvatar || "https://i.pravatar.cc/150"} 
                            alt={student.studentName} 
                            className="w-10 h-10 rounded-full object-cover bg-gray-100" 
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                          />
                          <div>
                            <div className="font-semibold text-[14px] text-[#0B1C30]">{student.studentName}</div>
                            <div className="text-[12px] text-gray-500">{student.studentEmail}</div>
                          </div>
                        </div>

                        {/* Student ID */}
                        <div className="text-[14px] font-semibold text-[#0B1C30]">
                          {student.studentIdCode}
                        </div>

                        {/* Batch Name */}
                        <div className="text-[14px] text-gray-500">
                          {student.batchName}
                        </div>

                        {/* Score */}
                        <div className="text-[14px] font-medium text-[#0B1C30]">
                          {student.status === "Absent" ? "--/--" : student.score}
                        </div>

                        {/* Status Pill */}
                        <div>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${statusStyles.bg} ${statusStyles.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}></span>
                            {student.status}
                          </span>
                        </div>

                        {/* Actions - View Button with Link */}
                        <div className="flex justify-end pr-2">
                          <Link href={`/teacher/exam/examresults/${student.id}`} className="text-[#A42E30] hover:text-[#8B2627] transition-colors p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {!loading && results.length > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-100">
              <div className="text-[13px] text-gray-500 font-medium">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalStudents)} of {totalStudents} results
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm font-semibold transition-colors ${
                      currentPage === i + 1 
                        ? "bg-[#A42E30] text-white" 
                        : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="w-8 h-8 rounded flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}