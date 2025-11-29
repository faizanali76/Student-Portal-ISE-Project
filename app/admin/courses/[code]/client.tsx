"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, Trash2 } from "lucide-react"

interface Student {
  rollNo: string
  name: string
  batch: string
}

interface ManageEnrollmentClientProps {
  code: string
  allStudents: Student[]
  initialEnrolled: string[]
}

export default function ManageEnrollmentClient({ code, allStudents, initialEnrolled }: ManageEnrollmentClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [enrolled, setEnrolled] = useState<string[]>(initialEnrolled)

  const filteredStudents = allStudents.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery),
  )

  const handleEnroll = (rollNo: string) => {
    if (!enrolled.includes(rollNo)) {
      setEnrolled([...enrolled, rollNo])
    }
  }

  const handleRemove = (rollNo: string) => {
    setEnrolled(enrolled.filter((r) => r !== rollNo))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Available Students */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Students</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-input text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          {filteredStudents.map((student) => (
            <div
              key={student.rollNo}
              className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.rollNo}</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleEnroll(student.rollNo)}
                disabled={enrolled.includes(student.rollNo)}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Enrolled Students */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Enrolled Students ({enrolled.length})</h2>
        <div className="space-y-2">
          {enrolled.map((rollNo) => {
            const student = allStudents.find((s) => s.rollNo === rollNo)
            return (
              <div key={rollNo} className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{student?.name}</p>
                  <p className="text-xs text-muted-foreground">{student?.rollNo}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemove(rollNo)}
                  className="h-8 w-8 p-0 text-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 lg:col-span-2">
        <Button variant="outline" className="flex-1 border-border hover:bg-secondary bg-transparent">
          Cancel
        </Button>
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
      </div>
    </div>
  )
}
