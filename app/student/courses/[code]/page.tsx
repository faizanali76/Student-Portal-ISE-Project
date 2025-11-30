"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, BookOpen, User } from "lucide-react"
import { getStudentCourses, type EnrolledCourse } from "@/app/actions/student-actions"
import { createClient } from "@/utils/supabase/client"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseCode = params.code as string

  const [course, setCourse] = useState<EnrolledCourse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCourse() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const courses = await getStudentCourses(user.id)
        const foundCourse = courses.find(c => c.course_code === courseCode)
        setCourse(foundCourse || null)
      }
      setLoading(false)
    }
    loadCourse()
  }, [courseCode])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">Course not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {course.course_code} - {course.course_name}
          </h1>
          <p className="text-sm text-muted-foreground">Course Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Course Code</p>
              <p className="text-lg font-semibold">{course.course_code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course Name</p>
              <p className="text-lg font-semibold">{course.course_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credits</p>
              <p className="text-lg font-semibold">{course.credits}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Section</p>
              <p className="text-lg font-semibold">{course.section}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Instructor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Teacher</p>
              <p className="text-lg font-semibold">{course.teacher_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Schedule</p>
              <p className="text-lg font-semibold">{course.schedule || 'TBD'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {course.syllabus && (
        <Card>
          <CardHeader>
            <CardTitle>Course Syllabus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{course.syllabus}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={() => router.push(`/student/attendance/${course.course_code}`)}>
            View Attendance
          </Button>
          <Button variant="outline" onClick={() => router.push(`/student/results`)}>
            View Results
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
