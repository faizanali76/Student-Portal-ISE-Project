"use client"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

const reports = [
  { id: 1, title: "Semester Attendance Summary", date: "Nov 27, 2024", courses: "CS101, SE-1001", type: "PDF" },
  { id: 2, title: "Results Analysis", date: "Nov 20, 2024", courses: "CS101", type: "Excel" },
  { id: 3, title: "Student Performance Report", date: "Nov 15, 2024", courses: "SE-1001", type: "PDF" },
]

export default function TeacherReportsPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">View and download course reports</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Download className="h-4 w-4" />
          Generate Report
        </Button>
        <Button variant="outline" className="border-border hover:bg-secondary text-foreground gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-foreground">{report.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {report.date} • {report.courses} • {report.type}
                </p>
              </div>
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
