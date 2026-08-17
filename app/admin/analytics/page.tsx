"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Users, UserCheck, CreditCard, CalendarCheck, Loader2 } from "lucide-react";
import { apiRequest, ENDPOINTS } from "@/lib/api";

const PIE_COLORS = ["#9E0C25", "#D94860", "#F28C9F", "#4A5568", "#2D3748"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    kpis: any;
    revenueData: any[];
    courseData: any[];
    enrollmentData: any[];
  } | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiRequest(ENDPOINTS.ADMIN_REPORTS_OVERVIEW);
        if (res.status === "success") {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 text-[#9E0C25] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 p-8 text-center text-gray-500">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">Reports & Analytics</h1>
            <p className="text-stone-500 mt-1">Overview of academy performance and growth.</p>
          </div>
          <button className="bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-stone-50 transition-all">
            Export Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-[#9E0C25]" />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Total Students</p>
              <h3 className="text-2xl font-black text-stone-900">{data.kpis.totalStudents}</h3>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Total Teachers</p>
              <h3 className="text-2xl font-black text-stone-900">{data.kpis.totalTeachers}</h3>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
              <h3 className="text-2xl font-black text-stone-900">₹{data.kpis.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Avg Attendance</p>
              <h3 className="text-2xl font-black text-stone-900">{data.kpis.averageAttendance}</h3>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Area Chart */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm lg:col-span-2">
            <h3 className="text-stone-900 font-bold text-lg mb-6">Revenue Overview</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9E0C25" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9E0C25" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dx={-10} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#9E0C25" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Popularity Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm lg:col-span-1">
            <h3 className="text-stone-900 font-bold text-lg mb-6">Course Distribution</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.courseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.courseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Enrollments Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm lg:col-span-3">
            <h3 className="text-stone-900 font-bold text-lg mb-6">New Enrollments (Last 4 Weeks)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.enrollmentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="newStudents" name="New Students" fill="#D94860" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
