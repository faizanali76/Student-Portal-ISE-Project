import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

const courseDetails = {
  CS101: {
    code: "CS101",
    name: "Data Structures",
    teacher: "Dr. Hassan",
    credits: 3,
    students: 35,
    schedule: "Mon, Wed 10:00 AM",
    room: "Lab 3",
    description:
      "Learn fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Emphasis on implementation and analysis of algorithms.",
    syllabus: [
      "Arrays and Dynamic Arrays",
      "Linked Lists",
      "Stacks and Queues",
      "Binary Search Trees",
      "Graphs and Graph Algorithms",
      "Sorting Algorithms",
    ],
  },
  "SE-1001": {
    code: "SE-1001",
    name: "Software Engineering",
    teacher: "Mr. Talha",
    credits: 3,
    students: 42,
    schedule: "Tue, Thu 2:00 PM",
    room: "Room 201",
    description:
      "Introduction to software engineering principles, methodologies, and practices. Cover SDLC, design patterns, and project management.",
    syllabus: [
      "Software Development Life Cycle",
      "Requirements Engineering",
      "System Design",
      "Design Patterns",
      "Testing and Quality Assurance",
      "Project Management",
    ],
  },
  MATH201: {
    code: "MATH201",
    name: "Linear Algebra",
    teacher: "Dr. Sara",
    credits: 4,
    students: 28,
    schedule: "Mon, Wed, Fri 1:00 PM",
    room: "Hall A",
    description:
      "Comprehensive study of linear algebra covering matrices, vectors, eigenvalues, and applications to computer science.",
    syllabus: [
      "Vectors and Vector Spaces",
      "Matrices and Matrix Operations",
      "Determinants",
      "Eigenvalues and Eigenvectors",
      "Linear Transformations",
      "Applications",
    ],
  },
}

export default async function CourseDetailsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const course = courseDetails[code as keyof typeof courseDetails]

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
        <Link href="/student/courses">
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
        <p className="text-sm text-muted-foreground">Instructor: {course.teacher}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Course Info */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Course Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className="text-sm font-medium text-foreground">{course.credits}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Enrolled Students</p>
                <p className="text-sm font-medium text-foreground">{course.students}</p>
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

          {/* Description */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
          </div>

          {/* Syllabus */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Syllabus</h2>
            <ul className="space-y-2">
              {course.syllabus.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Download className="h-4 w-4" />
            Download Syllabus
          </Button>
          <Link href={`/student/attendance/${course.code}`} className="w-full block">
            <Button
              variant="outline"
              className="w-full border-border hover:bg-secondary text-foreground bg-transparent"
            >
              View Attendance
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
