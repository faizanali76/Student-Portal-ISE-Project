"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { StatCard } from "@/components/stat-card"
import { AlertCircle, TrendingUp, BookMarked, Award } from "lucide-react"

const attendanceData = [
  { name: "CS101", attendance: 83, status: "good" },
  { name: "SE-1001", attendance: 72, status: "warning" },
  { name: "MATH201", attendance: 88, status: "good" },
  { name: "ENG102", attendance: 80, status: "good" },
  { name: "PHY201", attendance: 95, status: "good" },
]

const gradeData = [
  { name: "A", value: 3, fill: "oklch(0.62 0.27 33.5)" },
  { name: "B", value: 5, fill: "oklch(0.55 0.18 240)" },
  { name: "C", value: 2, fill: "oklch(0.5 0.15 120)" },
]

const notifications = [
  {
    type: "warning",
    title: "Low Attendance",
    message: "Your attendance in SE-1001 dropped to 72%",
    time: "2 hours ago",
  },
  {
    type: "info",
    title: "New Marks Posted",
    message: "Dr. Hassan uploaded Midterm marks for CS101",
    time: "1 day ago",
  },
  {
    type: "announcement",
    title: "Class Announcement",
    message: "Class will be held in Lab 3 tomorrow",
    time: "2 days ago",
  },
]

export default function StudentDashboard() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Ali Ahmed!</h1>
        <p className="text-sm text-muted-foreground">Here's your academic overview for this semester</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Enrolled Courses" value="5" icon={<BookMarked className="h-5 w-5" />} />
        <StatCard
          label="Overall Attendance"
          value="83.6%"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 2.5, direction: "up" }}
        />
        <StatCard label="Average Grade" value="B+" icon={<Award className="h-5 w-5" />} />
        <StatCard label="GPA" value="3.45" icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Course Attendance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.65 0 0)" />
              <YAxis stroke="oklch(0.65 0 0)" />
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
        </div>

        {/* Grade Distribution */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Recent Notifications</h2>
        <div className="space-y-3">
          {notifications.map((notif, idx) => (
            <div key={idx} className="flex gap-4 border-l-2 border-primary pl-4 py-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm text-foreground">{notif.title}</p>
                <p className="text-xs text-muted-foreground">{notif.message}</p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
