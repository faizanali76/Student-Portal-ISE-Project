"use client"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

const reportTypes = [
  { id: 1, title: "Attendance Report", description: "Overall attendance statistics by department", type: "PDF" },
  { id: 2, title: "Academic Performance", description: "Grade distribution and student performance", type: "Excel" },
  { id: 3, title: "Enrollment Summary", description: "Student enrollment across all programs", type: "PDF" },
  { id: 4, title: "System Activity Log", description: "All user activities and system events", type: "CSV" },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null)

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and download system reports</p>
      </div>

      {/* Report Filters */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Report Filters</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground">Department</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground">
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Software Engineering</option>
              <option>Mathematics</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Semester</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground">
              <option>Fall 2024</option>
              <option>Spring 2024</option>
              <option>Fall 2023</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Date Range</label>
            <div className="flex gap-2 mt-1">
              <input
                type="date"
                className="flex-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
              <input
                type="date"
                className="flex-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Available Reports</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{report.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {report.type}
                </span>
              </div>
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                <Download className="h-4 w-4" />
                Generate
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recently Generated</h2>
        <div className="space-y-3">
          {[
            { name: "Fall 2024 Attendance Report", date: "Nov 27, 2024" },
            { name: "Semester Results Summary", date: "Nov 20, 2024" },
            { name: "Student Enrollment Report", date: "Nov 15, 2024" },
          ].map((report, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors"
            >
              <div>
                <p className="text-sm text-foreground">{report.name}</p>
                <p className="text-xs text-muted-foreground">{report.date}</p>
              </div>
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
