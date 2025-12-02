"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { StatCard } from "@/components/stat-card"
import { AlertCircle, TrendingUp, BookMarked, Award } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { getStudentDashboard } from "@/app/actions/student-actions"
import { format } from "date-fns"

const gradeColors: Record<string, string> = {
  A: "oklch(0.62 0.27 33.5)",
  B: "oklch(0.55 0.18 240)",
  C: "oklch(0.5 0.15 120)",
  D: "oklch(0.6 0.2 60)",
  F: "oklch(0.5 0.2 0)"
}

export default function StudentDashboard() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getStudentDashboard(user.id)
        setDashboard(data)
      }
      setLoading(false)
    }
    loadDashboard()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!dashboard) {
    return <div className="p-8">Unable to load dashboard.</div>
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {dashboard.studentName}!
        </h1>
        <p className="text-sm text-muted-foreground">Here's your academic overview for this semester</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Enrolled Courses"
          value={dashboard.enrolledCourses.toString()}
          icon={<BookMarked className="h-5 w-5" />}
        />
        <StatCard
          label="Overall Attendance"
          value={`${dashboard.overallAttendance}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 0, direction: "up" }}
        />
        <StatCard
          label="Average Grade"
          value={dashboard.avgGrade}
          icon={<Award className="h-5 w-5" />}
        />
        <StatCard
          label="GPA"
          value={dashboard.avgGPA}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Course Attendance</h2>
          <div className="h-[300px]">
            {dashboard.courseAttendance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.courseAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                  <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.18 0 0)",
                      border: "1px solid oklch(0.25 0 0)",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="attendance" fill="oklch(0.62 0.27 33.5)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No attendance data available.
              </div>
            )}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Grade Distribution</h2>
          <div className="h-[300px]">
            {dashboard.gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboard.gradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboard.gradeDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={gradeColors[entry.name] || "oklch(0.5 0.1 180)"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No grade data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Recent Notifications</h2>
        <div className="space-y-3">
          {dashboard.recentNotifications.length > 0 ? (
            dashboard.recentNotifications.map((notif: any, idx: number) => (
              <div key={idx} className="flex gap-4 border-l-2 border-primary pl-4 py-2">
                <AlertCircle className={`h-5 w-5 flex-shrink-0 ${notif.type === 'warning' ? 'text-yellow-500' :
                    notif.type === 'success' ? 'text-green-500' :
                      'text-primary'
                  }`} />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm text-foreground">{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{notif.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(notif.created_at), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">No recent notifications.</div>
          )}
        </div>
      </div>
    </div>
  )
}
