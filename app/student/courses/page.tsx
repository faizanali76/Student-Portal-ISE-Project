"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const courses = [
  {
    code: "CS101",
    name: "Data Structures",
    teacher: "Dr. Hassan",
    credits: 3,
    students: 35,
    status: "Active",
    schedule: "Mon, Wed 10:00 AM",
  },
  {
    code: "SE-1001",
    name: "Software Engineering",
    teacher: "Mr. Talha",
    credits: 3,
    students: 42,
    status: "Active",
    schedule: "Tue, Thu 2:00 PM",
  },
  {
    code: "MATH201",
    name: "Linear Algebra",
    teacher: "Dr. Sara",
    credits: 4,
    students: 28,
    status: "Active",
    schedule: "Mon, Wed, Fri 1:00 PM",
  },
]

export default function StudentCoursesPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Courses</h1>
        <p className="text-sm text-muted-foreground">View and manage your enrolled courses</p>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div
            key={course.code}
            className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {course.code} - {course.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{course.teacher}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="text-sm font-medium text-foreground">{course.credits}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="text-sm font-medium text-foreground">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Schedule</p>
                    <p className="text-sm font-medium text-foreground">{course.schedule}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/student/courses/${course.code}`}>
                  <Button
                    variant="outline"
                    className="border-border hover:bg-secondary text-sm bg-transparent text-foreground hover:text-foreground"
                  >
                    View Details
                  </Button>
                </Link>
                <Link href={`/student/attendance/${course.code}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">Attendance</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
