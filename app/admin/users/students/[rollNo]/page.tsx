import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit2, Mail, Phone } from "lucide-react"
import Link from "next/link"

const studentDatabase: Record<string, any> = {
  "24F-3001": {
    rollNo: "24F-3001",
    name: "Ali Ahmed",
    email: "ali@nu.edu.pk",
    phone: "+92-300-1234567",
    batch: "BSE-3B",
    program: "BS Software Engineering",
    enrollmentDate: "2022-09-01",
    status: "Active",
    courses: ["CS101", "SE-1001", "MATH201"],
    cgpa: 3.45,
    attendanceRate: 78,
  },
  "24F-3002": {
    rollNo: "24F-3002",
    name: "Fatima Khan",
    email: "fatima@nu.edu.pk",
    phone: "+92-300-2345678",
    batch: "BSE-3A",
    program: "BS Software Engineering",
    enrollmentDate: "2022-09-01",
    status: "Active",
    courses: ["CS101", "MATH201"],
    cgpa: 3.78,
    attendanceRate: 85,
  },
}

export default async function StudentDetailsPage({ params }: { params: Promise<{ rollNo: string }> }) {
  const { rollNo } = await params
  const student = studentDatabase[rollNo as keyof typeof studentDatabase]

  if (!student) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <Link href="/admin/users/students">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <p className="text-muted-foreground">Student not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/users/students">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Button size="sm" variant="outline" className="gap-2 border-border bg-transparent hover:bg-secondary">
          <Edit2 className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{student.name}</h1>
        <p className="text-sm text-muted-foreground">{student.rollNo}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{student.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Academic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Program</p>
                <p className="text-sm text-foreground">{student.program}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Batch</p>
                <p className="text-sm text-foreground">{student.batch}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Enrollment Date</p>
                <p className="text-sm text-foreground">{student.enrollmentDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm text-foreground">
                  <span className="inline-block px-2 py-1 rounded text-xs bg-green-500/20 text-green-600 dark:text-green-400">
                    {student.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Enrolled Courses</h2>
            <div className="space-y-2">
              {student.courses.map((course: string) => (
                <div key={course} className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50">
                  <span className="text-sm text-foreground">{course}</span>
                  <Link href={`/student/courses/${course}`}>
                    <Button size="sm" variant="ghost" className="text-foreground hover:text-primary">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">CGPA</p>
            <p className="text-3xl font-bold text-foreground mt-2">{student.cgpa.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
            <p
              className={`text-3xl font-bold mt-2 ${student.attendanceRate >= 75 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {student.attendanceRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
