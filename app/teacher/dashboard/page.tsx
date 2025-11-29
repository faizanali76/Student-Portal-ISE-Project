"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Button } from "@/components/ui/button"

const classData = [
  { name: "CS101", students: 35, attendance: 78, avgMarks: 75 },
  { name: "SE-1001", students: 42, attendance: 82, avgMarks: 78 },
]

const attendanceTrend = [
  { date: "Nov 15", CS101: 76, "SE-1001": 80 },
  { date: "Nov 18", CS101: 78, "SE-1001": 82 },
  { date: "Nov 22", CS101: 79, "SE-1001": 81 },
  { date: "Nov 25", CS101: 78, "SE-1001": 82 },
  { date: "Nov 27", CS101: 78, "SE-1001": 82 },
]

export default function TeacherDashboard() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome, Dr. Hassan!</h1>
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
        {classData.map((course, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{course.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Data Structures</p>
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
      </div>

      {/* Attendance Trend */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Attendance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
            <XAxis dataKey="date" stroke="oklch(0.65 0 0)" />
            <YAxis stroke="oklch(0.65 0 0)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.18 0 0)",
                border: "1px solid oklch(0.25 0 0)",
                borderRadius: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey="CS101"
              stroke="oklch(0.62 0.27 33.5)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.62 0.27 33.5)" }}
            />
            <Line
              type="monotone"
              dataKey="SE-1001"
              stroke="oklch(0.55 0.18 240)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.55 0.18 240)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
