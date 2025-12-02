"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, Activity, ArrowUpRight, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDashboardStats, getRecentActivity, type DashboardStats, type ActivityItem } from "@/app/actions/dashboard-actions"
import { formatDistanceToNow } from "date-fns"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalStudents: 0, totalTeachers: 0, totalCourses: 0 })
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [statsData, activityData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity()
      ])
      setStats(statsData)
      setActivity(activityData)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage your institution</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalTeachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalCourses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/courses">
          <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4" /> Add Course
          </Button>
        </Link>
        <Link href="/admin/users/students">
          <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4" /> Add Student
          </Button>
        </Link>
        <Link href="/admin/users/teachers">
          <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4" /> Add Teacher
          </Button>
        </Link>
        <Link href="/admin/reports">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" /> View Reports
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading activity...</div>
            ) : activity.length === 0 ? (
              <div className="text-sm text-muted-foreground">No recent activity found.</div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
