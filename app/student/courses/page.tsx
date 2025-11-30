"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getStudentCourses, type EnrolledCourse } from "@/app/actions/student-actions"
import { createClient } from "@/utils/supabase/client"
import { Loader2, BookOpen } from "lucide-react"

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getStudentCourses(user.id)
        setCourses(data)
        setLoading(false)
      }
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Courses</h1>
          <p className="text-sm text-muted-foreground">View and manage your enrolled courses</p>
        </div>
        <Link href="/student/enroll">
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" /> Enroll New Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground mb-4">You are not enrolled in any courses yet.</p>
          <Link href="/student/enroll">
            <Button>Enroll Now</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {course.course_code} - {course.course_name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Teacher: <span className="font-medium text-foreground">{course.teacher_name}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Credits</p>
                      <p className="text-sm font-medium text-foreground">{course.credits}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Section</p>
                      <p className="text-sm font-medium text-foreground">{course.section}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Schedule</p>
                      <p className="text-sm font-medium text-foreground">TBD</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/student/courses/${course.course_code}`}>
                    <Button
                      variant="outline"
                      className="border-border hover:bg-secondary text-sm bg-transparent text-foreground hover:text-foreground"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/student/attendance/${course.course_code}`}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">Attendance</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
