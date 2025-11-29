"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const attendanceData = [
  { date: "Nov 1", present: 1, absent: 0 },
  { date: "Nov 5", present: 1, absent: 0 },
  { date: "Nov 8", present: 1, absent: 0 },
  { date: "Nov 12", present: 1, absent: 0 },
  { date: "Nov 15", present: 0, absent: 1 },
  { date: "Nov 19", present: 1, absent: 0 },
  { date: "Nov 22", present: 1, absent: 0 },
  { date: "Nov 25", present: 1, absent: 0 },
]

const courses = [
  { code: "CS101", name: "Data Structures", present: 25, total: 30, percentage: 83.3 },
  { code: "SE-1001", name: "Software Engineering", present: 18, total: 25, percentage: 72 },
  { code: "MATH201", name: "Linear Algebra", present: 27, total: 30, percentage: 90 },
]

export default function AttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0])

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Attendance</h1>
        <p className="text-sm text-muted-foreground">Track your attendance across all courses</p>
      </div>

      {/* Course List */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <button
            key={course.code}
            onClick={() => setSelectedCourse(course)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              selectedCourse.code === course.code
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-secondary"
            }`}
          >
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-sm text-foreground">{course.code}</h3>
                <p className="text-xs text-muted-foreground">{course.name}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{course.percentage}%</p>
                <p className="text-xs text-muted-foreground">
                  {course.present}/{course.total} classes
                </p>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${course.percentage >= 75 ? "bg-green-500" : "bg-yellow-500"}`}
                  style={{ width: `${course.percentage}%` }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Course Detail */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{selectedCourse.name}</h2>
          <p className="text-sm text-muted-foreground">Overall attendance: {selectedCourse.percentage}%</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-md bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Classes Attended</p>
            <p className="text-2xl font-bold text-foreground">{selectedCourse.present}</p>
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Classes</p>
            <p className="text-2xl font-bold text-foreground">{selectedCourse.total}</p>
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Percentage</p>
            <p className="text-2xl font-bold text-foreground">{selectedCourse.percentage}%</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
            <XAxis dataKey="date" stroke="oklch(0.65 0 0)" angle={-45} textAnchor="end" height={80} />
            <Tooltip contentStyle={{ backgroundColor: "oklch(0.18 0 0)", border: "1px solid oklch(0.25 0 0)" }} />
            <Bar dataKey="present" fill="oklch(0.62 0.27 33.5)" />
            <Bar dataKey="absent" fill="oklch(0.6 0.25 25)" />
          </BarChart>
        </ResponsiveContainer>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Download Report</Button>
      </div>
    </div>
  )
}
