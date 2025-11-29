"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const students = [
  { rollNo: "24F-3001", name: "Ali Ahmed", marks: "22" },
  { rollNo: "24F-3002", name: "Fatima Khan", marks: "25" },
  { rollNo: "24F-3003", name: "Hassan Ali", marks: "28" },
  { rollNo: "24F-3004", name: "Sara Khan", marks: "" },
  { rollNo: "24F-3005", name: "Ahmed Raza", marks: "20" },
]

export default function UploadMarksPage() {
  const [selectedCourse, setSelectedCourse] = useState("CS101")
  const [selectedAssessment, setSelectedAssessment] = useState("Midterm")
  const [maxMarks, setMaxMarks] = useState("30")
  const [marks, setMarks] = useState<Record<string, string>>(
    students.reduce((acc, s) => ({ ...acc, [s.rollNo]: s.marks }), {}),
  )
  const [searchQuery, setSearchQuery] = useState("")

  const handleMarksChange = (rollNo: string, value: string) => {
    const numValue = Number.parseInt(value) || 0
    if (numValue <= Number.parseInt(maxMarks)) {
      setMarks((prev) => ({ ...prev, [rollNo]: value }))
    }
  }

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery),
  )

  const stats = {
    avg: (
      Object.values(marks)
        .filter((m) => m)
        .reduce((a, b) => a + (Number.parseInt(b) || 0), 0) / Object.values(marks).filter((m) => m).length
    ).toFixed(1),
    highest: Math.max(
      ...Object.values(marks)
        .filter((m) => m)
        .map((m) => Number.parseInt(m) || 0),
    ),
    lowest:
      Math.min(
        ...Object.values(marks)
          .filter((m) => m)
          .map((m) => Number.parseInt(m) || 0),
      ) || 0,
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Upload Marks</h1>
        <p className="text-sm text-muted-foreground">Enter and manage student assessment marks</p>
      </div>

      {/* Selection */}
      <div className="grid gap-4 md:grid-cols-3">
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
          <label className="text-sm font-medium text-foreground">Assessment</label>
          <select
            value={selectedAssessment}
            onChange={(e) => setSelectedAssessment(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground"
          >
            <option>Midterm</option>
            <option>Final</option>
            <option>Quiz 1</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Max Marks</label>
          <input
            type="number"
            value={maxMarks}
            readOnly
            className="w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="text-2xl font-bold text-foreground">{stats.avg}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">Highest</p>
          <p className="text-2xl font-bold text-foreground">{stats.highest}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">Lowest</p>
          <p className="text-2xl font-bold text-foreground">{stats.lowest}</p>
        </div>
      </div>

      {/* Marks Table */}
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
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.rollNo} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.rollNo}</td>
                  <td className="px-6 py-4 text-foreground">{student.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={maxMarks}
                        value={marks[student.rollNo] || ""}
                        onChange={(e) => handleMarksChange(student.rollNo, e.target.value)}
                        className="w-20 rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground"
                        placeholder="--"
                      />
                      <span className="text-xs text-muted-foreground">/ {maxMarks}</span>
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
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Save Marks</Button>
        </div>
      </div>
    </div>
  )
}
