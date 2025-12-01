"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import {
  getTeacherCourses,
  getCourseStudents,
  getAssessment,
  saveAssessmentMarks,
  getTeacherCourseDetails,
  type TeacherCourse
} from "@/app/actions/teacher-actions"
import { toast } from "sonner"

export default function UploadMarksPage() {
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedType, setSelectedType] = useState("Quiz")
  const [selectedNumber, setSelectedNumber] = useState("1")
  const [maxMarks, setMaxMarks] = useState("10")

  const [marks, setMarks] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")

  const [assessmentOptions, setAssessmentOptions] = useState({
    num_assignments: 0,
    num_quizzes: 0,
    num_midterms: 2,
    num_finals: 1
  })

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

  // Load Course Details (Structure) & Students
  useEffect(() => {
    if (!selectedCourseId) return

    async function loadCourseData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get Course Code from ID
      const course = courses.find(c => c.id === selectedCourseId)
      if (!course) return

      // 1. Get Structure
      const details = await getTeacherCourseDetails(user.id, course.course_code)
      if (details) {
        setAssessmentOptions({
          num_assignments: details.num_assignments,
          num_quizzes: details.num_quizzes,
          num_midterms: details.num_midterms,
          num_finals: details.num_finals
        })
      }

      // 2. Get Students
      const studentList = await getCourseStudents(selectedCourseId)
      setStudents(studentList)

      // Reset marks when course changes
      setMarks({})
    }
    loadCourseData()
  }, [selectedCourseId, courses])

  // Load Existing Marks
  useEffect(() => {
    if (!selectedCourseId) return

    async function loadMarks() {
      const assessmentName = `${selectedType} ${selectedNumber}`.trim()
      // For Midterm/Final, we might not need the number if there's only 1, but schema supports multiple
      // Let's stick to "Midterm 1", "Final 1" for consistency or handle based on type

      let name = assessmentName
      if (selectedType === 'Midterm' || selectedType === 'Final') {
        // If we want to support multiple midterms, keep the number. 
        // If strictly 1 Final, we could hide the number selector, but for now let's keep it simple.
      }

      const data = await getAssessment(selectedCourseId, name)

      if (data) {
        setMaxMarks(data.total_marks.toString())
        setMarks(data.marks || {})
      } else {
        setMarks({})
        // Default max marks based on type
        if (selectedType === 'Quiz') setMaxMarks("10")
        else if (selectedType === 'Assignment') setMaxMarks("10")
        else if (selectedType === 'Midterm') setMaxMarks("50")
        else if (selectedType === 'Final') setMaxMarks("100")
      }
    }
    loadMarks()
  }, [selectedCourseId, selectedType, selectedNumber])


  const handleMarksChange = (studentId: string, value: string) => {
    const numValue = parseFloat(value)
    if (value === "" || (numValue >= 0 && numValue <= parseFloat(maxMarks))) {
      setMarks((prev) => ({ ...prev, [studentId]: value }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const name = `${selectedType} ${selectedNumber}`.trim()

    const result = await saveAssessmentMarks(
      selectedCourseId,
      name,
      selectedType,
      parseFloat(maxMarks),
      marks
    )

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
    setSaving(false)
  }

  const filteredStudents = students.filter(
    (s) => s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll_number.includes(searchQuery),
  )

  const getNumberOptions = () => {
    let count = 0
    if (selectedType === 'Quiz') count = assessmentOptions.num_quizzes
    else if (selectedType === 'Assignment') count = assessmentOptions.num_assignments
    else if (selectedType === 'Midterm') count = assessmentOptions.num_midterms
    else if (selectedType === 'Final') count = assessmentOptions.num_finals

    return Array.from({ length: count }, (_, i) => i + 1)
  }

  // Calculate Stats
  const marksValues = Object.values(marks).map(m => parseFloat(m) || 0).filter(m => m > 0)
  const avg = marksValues.length ? (marksValues.reduce((a, b) => a + b, 0) / marksValues.length).toFixed(1) : "0"
  const highest = marksValues.length ? Math.max(...marksValues) : 0
  const lowest = marksValues.length ? Math.min(...marksValues) : 0

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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Upload Marks</h1>
        <p className="text-sm text-muted-foreground">Enter and manage student assessment marks</p>
      </div>

      {/* Selection */}
      <div className="grid gap-4 md:grid-cols-4">
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Type</label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value)
              setSelectedNumber("1")
            }}
            className="w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground"
          >
            <option value="Quiz">Quiz</option>
            <option value="Assignment">Assignment</option>
            <option value="Midterm">Midterm</option>
            <option value="Final">Final</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Number</label>
          <select
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground"
          >
            {getNumberOptions().map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Max Marks</label>
          <input
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            className="w-full rounded-md border border-border bg-input px-4 py-2.5 text-sm text-foreground"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="text-2xl font-bold text-foreground">{avg}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">Highest</p>
          <p className="text-2xl font-bold text-foreground">{highest}</p>
        </div>
        <div className="rounded-md bg-muted/50 p-4 text-center">
          <p className="text-xs text-muted-foreground">Lowest</p>
          <p className="text-2xl font-bold text-foreground">{lowest}</p>
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
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.student_id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{student.roll_number}</td>
                    <td className="px-6 py-4 text-foreground">{student.full_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={marks[student.student_id] || ""}
                          onChange={(e) => handleMarksChange(student.student_id, e.target.value)}
                          className="w-20 rounded-md border border-border bg-input px-3 py-1.5 text-sm text-foreground"
                          placeholder="--"
                        />
                        <span className="text-xs text-muted-foreground">/ {maxMarks}</span>
                      </div>
                    </td>
                  </tr>
                ))
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
            Save Marks
          </Button>
        </div>
      </div>
    </div>
  )
}
