"use client"

import { StatCard } from "@/components/stat-card"
import { Users, BookOpen, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

const recentActivities = [
  { action: "Course Created", detail: "Dr. Ahmed created CS401", time: "2 mins ago" },
  { action: "User Enrolled", detail: "Ali Ahmed enrolled in SE-1001", time: "15 mins ago" },
  { action: "Marks Updated", detail: "Dr. Hassan uploaded Midterm for CS101", time: "1 hour ago" },
  { action: "Account Created", detail: "New student Fatima Khan registered", time: "3 hours ago" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage your institution</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value="1,234" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Total Teachers" value="45" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Total Courses" value="120" icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="System Status" value="Healthy" icon={<Activity className="h-5 w-5" />} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Course</Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add User</Button>
        <Button variant="outline" className="border-border hover:bg-secondary bg-transparent">
          View Reports
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex items-start justify-between border-b border-border py-3 last:border-0">
              <div className="space-y-1">
                <p className="font-medium text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.detail}</p>
              </div>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
