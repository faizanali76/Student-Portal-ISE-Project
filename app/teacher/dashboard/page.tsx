"use client"

import { useState, useEffect } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { getTeacherDashboardStats, getAttendanceTrend } from "@/app/actions/teacher-actions"

export default function TeacherDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [trend, setTrend] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const [dashboardStats, trendData] = await Promise.all([
          getTeacherDashboardStats(user.id),
          getAttendanceTrend(user.id)
        ])
        setStats(dashboardStats)
        setTrend(trendData)
      }
      setLoading(false)
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Get unique course keys from trend data for lines
  const courseKeys = trend.length > 0
    ? Object.keys(trend[0]).filter(k => k !== 'date')
    : []

  const colors = [
    "oklch(0.62 0.27 33.5)", // Red
    "oklch(0.55 0.18 240)",  // Blue
    "oklch(0.70 0.15 150)",  // Greenish
    "oklch(0.60 0.20 280)",  // Purple
  ]

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome, {stats?.teacherName || 'Teacher'}!
        </h1>
        <p className="text-sm text-muted-foreground">Manage your courses and track student performance</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Mark Attendance</Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Upload Marks</Button>
        <Button variant="outline" className="border-border hover:bg-secondary bg-transparent">
          View Reports
        </Button>
      </div>

      {/* Courses Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        {stats?.courses.map((course: any, idx: number) => (
          <div key={course.id} className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{course.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{course.fullName}</p>
              </div>
              <span className="badge badge-primary">{course.students} Students</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Avg Attendance</p>
                <p className="text-lg font-bold text-foreground">{course.attendance}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Class Avg</p>
                <p className="text-lg font-bold text-foreground">{course.avgMarks}/100</p>
              </div>
            </div>
          </div>
        ))}
        {stats?.courses.length === 0 && (
          <div className="col-span-2 p-8 text-center border border-dashed rounded-lg text-muted-foreground">
            No courses assigned yet.
          </div>
        )}
      </div>

      {/* Attendance Trend */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Attendance Trend (Last 30 Days)</h2>
        <div className="h-[300px] w-full">
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                <XAxis dataKey="date" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.18 0 0)",
                    border: "1px solid oklch(0.25 0 0)",
                    borderRadius: "6px",
                  }}
                />
                {courseKeys.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ fill: colors[index % colors.length], r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No attendance data available for the last 30 days.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
