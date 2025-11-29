import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import TeacherAttendanceClient from "./client"

const studentsByCourse: Record<string, any[]> = {
  CS101: [
    { rollNo: "24F-3001", name: "Ali Ahmed", previousAttendance: "24/29" },
    { rollNo: "24F-3002", name: "Fatima Khan", previousAttendance: "20/29" },
    { rollNo: "24F-3003", name: "Hassan Ali", previousAttendance: "27/29" },
    { rollNo: "24F-3004", name: "Sara Khan", previousAttendance: "25/29" },
    { rollNo: "24F-3005", name: "Ahmed Raza", previousAttendance: "21/29" },
  ],
  "SE-1001": [
    { rollNo: "24F-3010", name: "Bilal Hassan", previousAttendance: "28/29" },
    { rollNo: "24F-3011", name: "Zainab Ali", previousAttendance: "26/29" },
    { rollNo: "24F-3012", name: "Usman Khan", previousAttendance: "25/29" },
  ],
  MATH201: [
    { rollNo: "24F-3020", name: "Maria Khan", previousAttendance: "29/29" },
    { rollNo: "24F-3021", name: "Tariq Ali", previousAttendance: "27/29" },
  ],
}

const courseNames: Record<string, string> = {
  CS101: "Data Structures",
  "SE-1001": "Software Engineering",
  MATH201: "Linear Algebra",
}

export default async function MarkAttendancePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const students = studentsByCourse[code as keyof typeof studentsByCourse] || []
  const courseName = courseNames[code as keyof typeof courseNames] || "Course"

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <Link href={`/teacher/courses/${code}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground">
          {code} - {courseName}
        </p>
      </div>

      <TeacherAttendanceClient code={code} students={students} />
    </div>
  )
}
