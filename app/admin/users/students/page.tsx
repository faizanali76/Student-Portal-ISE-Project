"use client"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { useState } from "react"

const students = [
  {
    rollNo: "24F-3001",
    name: "Ali Ahmed",
    email: "ali.ahmed@nu.edu.pk",
    batch: "BSE-3B",
    program: "BS Software Engineering",
  },
  {
    rollNo: "24F-3002",
    name: "Fatima Khan",
    email: "fatima@nu.edu.pk",
    batch: "BSE-3A",
    program: "BS Software Engineering",
  },
  {
    rollNo: "24F-3003",
    name: "Hassan Ali",
    email: "hassan@nu.edu.pk",
    batch: "BSE-3B",
    program: "BS Software Engineering",
  },
  { rollNo: "24F-3004", name: "Sara Khan", email: "sara@nu.edu.pk", batch: "BCS-3A", program: "BS Computer Science" },
  {
    rollNo: "24F-3005",
    name: "Ahmed Raza",
    email: "ahmed@nu.edu.pk",
    batch: "BSE-3B",
    program: "BS Software Engineering",
  },
]

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredStudents = students.filter(
    (s) => s.rollNo.includes(searchQuery) || s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">Manage student accounts and enrollment</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by roll number or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-input text-sm text-foreground placeholder-muted-foreground"
        />
      </div>

      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Add New Student</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Roll Number</label>
              <input
                type="text"
                placeholder="24F-3010"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Batch</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground">
                <option>BSE-3B</option>
                <option>BSE-3A</option>
                <option>BCS-3A</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
              className="border-border hover:bg-secondary text-foreground"
            >
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Student</Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Roll No</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Batch</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Program</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.rollNo} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-foreground font-medium">{student.rollNo}</td>
                  <td className="px-6 py-4 text-foreground">{student.name}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{student.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{student.batch}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{student.program}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-foreground hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
