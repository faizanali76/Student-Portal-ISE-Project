import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Filter } from "lucide-react"
import Link from "next/link"

const attendanceData: Record<string, { date: string; status: "present" | "absent"; remarks?: string }[]> = {
  CS101: [
    { date: "Nov 27", status: "present" },
    { date: "Nov 25", status: "absent", remarks: "Sick leave" },
    { date: "Nov 22", status: "present" },
    { date: "Nov 20", status: "present" },
    { date: "Nov 18", status: "present" },
    { date: "Nov 15", status: "absent", remarks: "Family emergency" },
    { date: "Nov 13", status: "present" },
    { date: "Nov 11", status: "present" },
  ],
  "SE-1001": [
    { date: "Nov 28", status: "present" },
    { date: "Nov 26", status: "present" },
    { date: "Nov 23", status: "absent" },
    { date: "Nov 21", status: "present" },
    { date: "Nov 19", status: "present" },
    { date: "Nov 16", status: "present" },
    { date: "Nov 14", status: "absent" },
    { date: "Nov 12", status: "present" },
  ],
  MATH201: [
    { date: "Nov 27", status: "present" },
    { date: "Nov 26", status: "present" },
    { date: "Nov 24", status: "present" },
    { date: "Nov 22", status: "absent" },
    { date: "Nov 20", status: "present" },
    { date: "Nov 19", status: "present" },
    { date: "Nov 17", status: "present" },
    { date: "Nov 15", status: "present" },
  ],
}

const courseNames: Record<string, string> = {
  CS101: "Data Structures",
  "SE-1001": "Software Engineering",
  MATH201: "Linear Algebra",
}

export default async function AttendancePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const attendance = attendanceData[code] || []
  const courseName = courseNames[code] || "Course"

  const presentCount = attendance.filter((a) => a.status === "present").length
  const totalClasses = attendance.length
  const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0

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
          {code} - {courseName}
        </h1>
        <p className="text-sm text-muted-foreground">Attendance Record</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Classes</p>
          <p className="text-2xl font-bold text-foreground">{totalClasses}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Classes Attended</p>
          <p className="text-2xl font-bold text-foreground">{presentCount}</p>
        </div>
        <div
          className={`rounded-lg border border-border bg-card p-4 ${percentage >= 75 ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}
        >
          <p className="text-xs text-muted-foreground">Attendance %</p>
          <p
            className={`text-2xl font-bold ${percentage >= 75 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {percentage}%
          </p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Attendance Details</h2>
          <Button size="sm" variant="outline" className="gap-2 border-border hover:bg-secondary bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">Date</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Status</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-3 text-muted-foreground">{record.date}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-medium ${record.status === "present" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${record.status === "present" ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"}`}
                      />
                      {record.status === "present" ? "Present" : "Absent"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{record.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
        <Download className="h-4 w-4" />
        Export as PDF
      </Button>
    </div>
  )
}
