import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ManageEnrollmentClient from "./client"

const allStudents = [
  { rollNo: "24F-3001", name: "Ali Ahmed", batch: "BSE-3B" },
  { rollNo: "24F-3002", name: "Fatima Khan", batch: "BSE-3A" },
  { rollNo: "24F-3006", name: "Bilal Hassan", batch: "BSE-3B" },
  { rollNo: "24F-3007", name: "Zainab Ali", batch: "BSE-3A" },
]

const courseEnrollments: Record<string, string[]> = {
  CS101: ["24F-3001", "24F-3002"],
  "SE-1001": ["24F-3006", "24F-3007"],
}

export default async function ManageEnrollmentPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center gap-3">
        <Link href={`/admin/courses/${code}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Student Enrollment</h1>
        <p className="text-sm text-muted-foreground">Add or remove students from this course</p>
      </div>

      <ManageEnrollmentClient
        code={code}
        allStudents={allStudents}
        initialEnrolled={courseEnrollments[code as keyof typeof courseEnrollments] || []}
      />
    </div>
  )
}
