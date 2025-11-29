"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const students = [
  { rollNo: "24F-3001", name: "Ali Ahmed", previousAttendance: "24/29" },
  { rollNo: "24F-3002", name: "Fatima Khan", previousAttendance: "20/29" },
  { rollNo: "24F-3003", name: "Hassan Ali", previousAttendance: "27/29" },
  { rollNo: "24F-3004", name: "Sara Khan", previousAttendance: "25/29" },
  { rollNo: "24F-3005", name: "Ahmed Raza", previousAttendance: "21/29" },
]

export default function MarkAttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState("CS101")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")

  const handleAttendance = (rollNo: string, present: boolean) => {
    setAttendance((prev) => ({ ...prev, [rollNo]: present }))
  }

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery),
  )

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground">Record student attendance for your courses</p>
      </div>

      {/* Selection */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground"
          >
            <option>CS101 - Data Structures</option>
            <option>SE-1001 - Software Engineering</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-input text-sm text-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Roll No</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Previous %</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.rollNo} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.rollNo}</td>
                  <td className="px-6 py-4 text-foreground">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{student.previousAttendance}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAttendance(student.rollNo, true)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          attendance[student.rollNo] === true
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendance(student.rollNo, false)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          attendance[student.rollNo] === false
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 border-t border-border bg-muted/50 p-4">
          <Button variant="outline" className="flex-1 border-border hover:bg-secondary bg-transparent">
            Cancel
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Save Attendance</Button>
        </div>
      </div>
    </div>
  )
}
