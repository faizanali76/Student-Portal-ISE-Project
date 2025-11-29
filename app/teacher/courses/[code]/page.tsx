import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const courseDetails: Record<string, any> = {
  CS101: {
    code: "CS101",
    name: "Data Structures",
    students: 35,
    credits: 3,
    schedule: "Mon, Wed 10:00 AM",
    room: "Lab 3",
    enrolled: ["Ali Ahmed", "Fatima Khan", "Hassan Ali", "Sara Khan", "Ahmed Raza"],
    assessments: ["Quiz 1", "Assignment 1", "Midterm", "Final Exam"],
  },
  "SE-1001": {
    code: "SE-1001",
    name: "Software Engineering",
    students: 42,
    credits: 3,
    schedule: "Tue, Thu 2:00 PM",
    room: "Room 201",
    enrolled: ["Bilal Hassan", "Zainab Ali", "Usman Khan", "Hira Ahmed", "Tariq Malik"],
    assessments: ["Project Proposal", "Midterm", "Project Submission", "Final Exam"],
  },
}

export default async function CourseDetailsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const course = courseDetails[code]

  if (!course) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <Link href="/teacher/courses">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {course.code} - {course.name}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Course Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Students Enrolled</p>
                <p className="text-2xl font-bold text-foreground">{course.students}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className="text-sm font-medium text-foreground">{course.credits}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Schedule</p>
                <p className="text-sm font-medium text-foreground">{course.schedule}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Room</p>
                <p className="text-sm font-medium text-foreground">{course.room}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Assessments</h2>
            <div className="space-y-2">
              {course.assessments.map((assessment: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-sm text-foreground">{assessment}</span>
                  <Link href={`/teacher/marks/${course.code}?assessment=${assessment}`}>
                    <Button size="sm" variant="outline" className="border-border bg-transparent">
                      Manage Marks
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Enrolled Students</h2>
            <div className="space-y-2">
              {course.enrolled.map((student: string, idx: number) => (
                <div key={idx} className="text-sm text-muted-foreground py-2 border-b border-border last:border-0">
                  {student}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link href={`/teacher/attendance/${course.code}`} className="w-full block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Mark Attendance</Button>
          </Link>
          <Link href={`/teacher/courses/${code}/reports`} className="w-full block">
            <Button
              variant="outline"
              className="w-full border-border hover:bg-secondary text-foreground bg-transparent"
            >
              View Reports
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
