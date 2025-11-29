"use client"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { useState } from "react"

const courses = [
  { code: "CS101", name: "Data Structures", teacher: "Dr. Hassan", credits: 3, students: 35, semester: "Fall 2024" },
  {
    code: "SE-1001",
    name: "Software Engineering",
    teacher: "Mr. Talha",
    credits: 3,
    students: 42,
    semester: "Fall 2024",
  },
  { code: "MATH201", name: "Linear Algebra", teacher: "Dr. Sara", credits: 4, students: 28, semester: "Fall 2024" },
  { code: "CS201", name: "Database Systems", teacher: "Dr. Ahmed", credits: 3, students: 38, semester: "Fall 2024" },
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredCourses = courses.filter(
    (c) => c.code.includes(searchQuery.toUpperCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage all courses in the system</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses by code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-md border border-border bg-input text-sm text-foreground placeholder-muted-foreground"
        />
      </div>

      {/* Add Course Form */}
      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Add New Course</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Course Code</label>
              <input
                type="text"
                placeholder="CS301"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Course Name</label>
              <input
                type="text"
                placeholder="Algorithm Design"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Credits</label>
              <input
                type="number"
                placeholder="3"
                className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Assign Teacher</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border border-border bg-input text-foreground">
                <option>Select Teacher</option>
                <option>Dr. Hassan</option>
                <option>Mr. Talha</option>
                <option>Dr. Sara</option>
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
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create Course</Button>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Teacher</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Credits</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Students</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCourses.map((course) => (
                <tr key={course.code} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-foreground font-medium">{course.code}</td>
                  <td className="px-6 py-4 text-foreground">{course.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{course.teacher}</td>
                  <td className="px-6 py-4 text-muted-foreground">{course.credits}</td>
                  <td className="px-6 py-4 text-muted-foreground">{course.students}</td>
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
