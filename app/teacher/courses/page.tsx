import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTeacherCourses } from "@/app/actions/teacher-actions"
import { createClient } from "@/utils/supabase/server"

export default async function TeacherCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to view your courses.</div>
  }

  const courses = await getTeacherCourses(user.id)

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Courses</h1>
        <p className="text-sm text-muted-foreground">Manage your assigned courses</p>
      </div>

      <div className="grid gap-4">
        {courses.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-card text-muted-foreground">
            You have not been assigned to any courses yet.
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-foreground">
                    {course.course_code} - {course.course_name}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Section</p>
                      <p className="text-sm font-medium text-foreground">{course.section}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="text-sm font-medium text-foreground">{course.student_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Attendance</p>
                      <p className="text-sm font-medium text-foreground">{course.avg_attendance}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/teacher/courses/${course.course_code}`}>
                    <Button
                      variant="outline"
                      className="border-border hover:bg-secondary text-sm bg-transparent text-foreground hover:text-foreground"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
