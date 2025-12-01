"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import {
  getTeacherCourses,
  getCourseStudents,
  getAttendance,
  saveAttendance,
  type TeacherCourse
} from "@/app/actions/teacher-actions"
import { toast } from "sonner"

export default function MarkAttendancePage() {
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")

  // Load Courses
  useEffect(() => {
    async function loadCourses() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getTeacherCourses(user.id)
        setCourses(data)
        if (data.length > 0) {
          setSelectedCourseId(data[0].id)
        }
      }
      setLoading(false)
    }
    loadCourses()
  }, [])

  // Load Students & Attendance
  useEffect(() => {
    if (!selectedCourseId || !date) return

    async function loadData() {
      // 1. Get Students
      const studentList = await getCourseStudents(selectedCourseId)
      setStudents(studentList)

      // 2. Get Attendance for Date
      if (date) {
        const formattedDate = format(date, "yyyy-MM-dd")
        const existingAttendance = await getAttendance(selectedCourseId, formattedDate)
        // existingAttendance is now enrollment_id -> boolean
        setAttendance(existingAttendance)
      }
    }
    loadData()
  }, [selectedCourseId, date])

  const handleAttendance = (enrollmentId: string, present: boolean) => {
    setAttendance((prev) => ({ ...prev, [enrollmentId]: present }))
  }

  const handleSave = async () => {
    if (!date) return
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Prepare attendance data with enrollment IDs
      const attendanceData = Object.entries(attendance).map(([enrollmentId, isPresent]) => ({
        enrollment_id: enrollmentId,
        status: isPresent ? 'present' : 'absent'
      }))

      const result = await saveAttendance(
        selectedCourseId,
        user.id,
        format(date, "yyyy-MM-dd"),
        attendanceData
      )

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    }
    setSaving(false)
  }

  const filteredStudents = students.filter(
    (s) => s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll_number.includes(searchQuery),
  )

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium text-foreground">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isPresent = attendance[student.enrollment_id] === true
                  const isAbsent = attendance[student.enrollment_id] === false

                  return (
                    <tr key={student.student_id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.roll_number}</td>
                      <td className="px-6 py-4 text-foreground">{student.full_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAttendance(student.enrollment_id, true)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isPresent
                              ? "bg-green-600 text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleAttendance(student.enrollment_id, false)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isAbsent
                              ? "bg-red-600 text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 border-t border-border bg-muted/50 p-4">
          <Button variant="outline" className="flex-1 border-border hover:bg-secondary bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Attendance
          </Button>
        </div>
      </div>
    </div>
  )
}
