import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit2, Trash2, Users } from "lucide-react"
import Link from "next/link"

const courseDetails: Record<string, any> = {
  CS101: {
    code: "CS101",
    name: "Data Structures",
    teacher: "Dr. Hassan",
    credits: 3,
    students: 35,
    schedule: "Mon, Wed 10:00 AM",
    room: "Lab 3",
    capacity: 40,
    semester: "Fall 2024",
    department: "Computer Science",
    description: "Learn fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs.",
    enrolledStudents: ["Ali Ahmed", "Fatima Khan", "Hassan Ali", "Sara Khan", "Ahmed Raza"],
  },
  "SE-1001": {
    code: "SE-1001",
    name: "Software Engineering",
    teacher: "Mr. Talha",
    credits: 3,
    students: 42,
    schedule: "Tue, Thu 2:00 PM",
    room: "Room 201",
    capacity: 50,
    semester: "Fall 2024",
    department: "Software Engineering",
    description: "Introduction to software engineering principles, methodologies, and practices.",
    enrolledStudents: ["Bilal Hassan", "Zainab Ali", "Usman Khan", "Hira Ahmed", "Tariq Malik"],
  },
  MATH201: {
    code: "MATH201",
    name: "Linear Algebra",
    teacher: "Dr. Sara",
    credits: 4,
    students: 28,
    schedule: "Mon, Wed, Fri 1:00 PM",
    room: "Hall A",
    capacity: 35,
    semester: "Fall 2024",
    department: "Mathematics",
    description: "Comprehensive study of linear algebra covering matrices, vectors, eigenvalues, and applications.",
    enrolledStudents: ["Maria Khan", "Tariq Ali", "Zara Ahmed"],
  },
}

export default async function CourseDetailsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const course = courseDetails[code as keyof typeof courseDetails]

  if (!course) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <Link href="/admin/courses">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <p className="text-muted-foreground">Course not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/courses">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2 border-border bg-transparent hover:bg-secondary">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2 border-border bg-transparent hover:bg-destructive/10 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {course.code} - {course.name}
        </h1>
        <p className="text-sm text-muted-foreground">{course.department}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Course Information */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Course Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Instructor</p>
                <p className="text-sm font-medium text-foreground">{course.teacher}</p>
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
              <div>
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="text-sm font-medium text-foreground">
                  {course.students}/{course.capacity}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Semester</p>
                <p className="text-sm font-medium text-foreground">{course.semester}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
          </div>

          {/* Enrolled Students */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5" />
                Enrolled Students ({course.enrolledStudents.length})
              </h2>
            </div>
            <div className="space-y-2">
              {course.enrolledStudents.map((student: string, idx: number) => (
                <div
                  key={idx}
                  className="text-sm text-muted-foreground py-2 border-b border-border last:border-0 flex items-center justify-between"
                >
                  <span>{student}</span>
                  <Button size="sm" variant="ghost" className="h-8 text-foreground hover:text-destructive">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">Total Students</p>
            <p className="text-3xl font-bold text-foreground mt-2">{course.students}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">Enrollment Rate</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {Math.round((course.students / course.capacity) * 100)}%
            </p>
          </div>
          <Link href={`/admin/courses/${code}/manage-enrollment`} className="w-full block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Manage Enrollment</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
