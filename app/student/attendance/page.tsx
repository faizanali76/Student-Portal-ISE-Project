"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/utils/supabase/client"
import { getStudentAttendance } from "@/app/actions/student-actions"

export default function AttendancePage() {
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAttendance() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getStudentAttendance(user.id)
        setCourses(data)
        if (data.length > 0) {
          setSelectedCourse(data[0])
        }
      }
      setLoading(false)
    }
    loadAttendance()
  }, [])

  const downloadReport = () => {
    if (!selectedCourse) return

    // Create CSV content
    const headers = ["Date", "Status"]
    const rows = selectedCourse.history.map((record: any) => [
      record.date,
      record.present ? "Present" : "Absent"
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any) => row.join(","))
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedCourse.courseCode}_Attendance_Report.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (courses.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground mt-4">You are not enrolled in any courses yet.</p>
      </div>
    )
  }

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
            key={course.courseCode}
            onClick={() => setSelectedCourse(course)}
            className={`rounded-lg border p-4 text-left transition-colors ${selectedCourse?.courseCode === course.courseCode
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:bg-secondary"
              }`}
          >
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-sm text-foreground">{course.courseCode}</h3>
                <p className="text-xs text-muted-foreground">{course.courseName}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{course.percentage}%</p>
                <p className="text-xs text-muted-foreground">
                  {course.classesAttended}/{course.classesConducted} classes
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
      {selectedCourse && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{selectedCourse.courseName}</h2>
            <p className="text-sm text-muted-foreground">Overall attendance: {selectedCourse.percentage}%</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-md bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Classes Attended</p>
              <p className="text-2xl font-bold text-foreground">{selectedCourse.classesAttended}</p>
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Classes Conducted</p>
              <p className="text-2xl font-bold text-foreground">{selectedCourse.classesConducted}</p>
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Planned</p>
              <p className="text-2xl font-bold text-foreground">{selectedCourse.totalClasses}</p>
            </div>
          </div>

          <div className="h-[200px] w-full">
            {selectedCourse.history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedCourse.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                  <XAxis dataKey="date" stroke="oklch(0.65 0 0)" angle={-45} textAnchor="end" height={60} fontSize={12} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: "oklch(0.18 0 0)", border: "1px solid oklch(0.25 0 0)" }} />
                  <Bar dataKey="present" name="Present" fill="oklch(0.62 0.27 33.5)" stackId="a" />
                  <Bar dataKey="absent" name="Absent" fill="oklch(0.6 0.25 25)" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No attendance history available.
              </div>
            )}
          </div>

          <Button
            onClick={downloadReport}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Download Report
          </Button>
        </div>
      )}
    </div>
  )
}
