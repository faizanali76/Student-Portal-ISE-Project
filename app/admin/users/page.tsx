"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"

const students = [
  { rollNo: "24F-3001", name: "Ali Ahmed", email: "ali@nu.edu.pk", batch: "BSE-3B" },
  { rollNo: "24F-3002", name: "Fatima Khan", email: "fatima@nu.edu.pk", batch: "BSE-3A" },
  { rollNo: "24F-3003", name: "Hassan Ali", email: "hassan@nu.edu.pk", batch: "BSE-3B" },
]

const teachers = [
  { id: "T001", name: "Dr. Hassan", email: "dr.hassan@nu.edu.pk", department: "CS" },
  { id: "T002", name: "Mr. Talha", email: "talha@nu.edu.pk", department: "SE" },
]

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("students")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery),
  )

  const filteredTeachers = teachers.filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.includes(searchQuery),
  )

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manage Users</h1>
          <p className="text-sm text-muted-foreground">Add and manage students and teachers</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {["students", "teachers", "admins"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-2 text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-input text-sm text-foreground"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">ID</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  {activeTab === "students" ? "Batch" : "Department"}
                </th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeTab === "students"
                ? filteredStudents.map((student) => (
                    <tr key={student.rollNo} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.rollNo}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{student.name}</td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{student.email}</td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{student.batch}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="text-primary hover:underline text-xs">Edit</button>
                        <button className="text-destructive hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))
                : filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{teacher.id}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{teacher.name}</td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{teacher.email}</td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{teacher.department}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="text-primary hover:underline text-xs">Edit</button>
                        <button className="text-destructive hover:underline text-xs">Delete</button>
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
