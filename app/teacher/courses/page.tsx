"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const courses = [
  {
    code: "CS101",
    name: "Data Structures",
    students: 35,
    avgAttendance: "78%",
    avgGrade: "75/100",
  },
  {
    code: "SE-1001",
    name: "Software Engineering",
    students: 42,
    avgAttendance: "82%",
    avgGrade: "78/100",
  },
]

export default function TeacherCoursesPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Courses</h1>
        <p className="text-sm text-muted-foreground">Manage your assigned courses</p>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div
            key={course.code}
            className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground">
                  {course.code} - {course.name}
                </h3>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="text-sm font-medium text-foreground">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Attendance</p>
                    <p className="text-sm font-medium text-foreground">{course.avgAttendance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Class Average</p>
                    <p className="text-sm font-medium text-foreground">{course.avgGrade}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/teacher/courses/${course.code}`}>
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
        ))}
      </div>
    </div>
  )
}
