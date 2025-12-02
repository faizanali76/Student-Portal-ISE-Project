"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { getStudentResults } from "@/app/actions/student-actions"
import { ChevronDown, ChevronUp, Download } from "lucide-react"

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResults() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const data = await getStudentResults(user.id)
        setResults(data)
      }
      setLoading(false)
    }
    loadResults()
  }, [])

  const downloadReport = (course: any) => {
    // Create a simple text report (could be enhanced to PDF)
    const reportLines = [
      `${course.courseName} (${course.courseCode})`,
      `Grade: ${course.grade} (${course.totalPercentage}%)`,
      `GPA: ${course.gpa}`,
      '',
      'Breakdown:',
      `Quiz: ${course.quizWeighted.toFixed(2)}/10`,
      `Assignment: ${course.assignmentWeighted.toFixed(2)}/15`,
      `Midterm: ${course.midtermWeighted.toFixed(2)}/30`,
      `Final: ${course.finalWeighted.toFixed(2)}/45`,
      '',
      'Details:',
      ...course.quizzes.map((q: any) => `${q.name}: ${q.obtained}/${q.total}`),
      ...course.assignments.map((a: any) => `${a.name}: ${a.obtained}/${a.total}`),
      ...course.midterms.map((m: any, i: number) => `Midterm ${i + 1}: ${m.obtained}/${m.total}`),
      course.final ? `Final: ${course.final.obtained}/${course.final.total}` : ''
    ]

    const content = reportLines.join('\n')
    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${course.courseCode}_Report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">My Results</h1>
        <p className="text-muted-foreground mt-4">No results available yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Results</h1>
        <p className="text-sm text-muted-foreground">View your marks and grades across courses</p>
      </div>

      {results.map((course) => (
        <div key={course.courseCode} className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-foreground">
                {course.courseCode} - {course.courseName}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{course.grade}</p>
              <p className="text-sm text-muted-foreground">{course.totalPercentage}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Quiz</p>
              <p className="text-xl font-bold text-foreground">{course.quizWeighted.toFixed(1)}/10</p>
            </div>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Assignment</p>
              <p className="text-xl font-bold text-foreground">{course.assignmentWeighted.toFixed(1)}/15</p>
            </div>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Midterm</p>
              <p className="text-xl font-bold text-foreground">{course.midtermWeighted.toFixed(1)}/30</p>
            </div>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Final</p>
              <p className="text-xl font-bold text-foreground">{course.finalWeighted.toFixed(1)}/45</p>
            </div>
          </div>

          {expandedCourse === course.courseCode && (
            <div className="border-t border-border pt-4 space-y-3">
              {course.quizzes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Quizzes</h3>
                  <div className="space-y-1">
                    {course.quizzes.map((quiz: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span>{quiz.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{quiz.obtained !== null ? quiz.obtained : '-'}/{quiz.total}</span>
                          <span className="text-xs text-muted-foreground">
                            ({quiz.weight?.toFixed(1)}% weight → {quiz.weightedScore?.toFixed(2) || '0'}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {course.assignments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Assignments</h3>
                  <div className="space-y-1">
                    {course.assignments.map((assignment: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span>{assignment.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{assignment.obtained !== null ? assignment.obtained : '-'}/{assignment.total}</span>
                          <span className="text-xs text-muted-foreground">
                            ({assignment.weight?.toFixed(1)}% weight → {assignment.weightedScore?.toFixed(2) || '0'}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {course.midterms.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Midterms</h3>
                  <div className="space-y-1">
                    {course.midterms.map((midterm: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span>Midterm {i + 1}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{midterm.obtained !== null ? midterm.obtained : '-'}/{midterm.total}</span>
                          <span className="text-xs text-muted-foreground">
                            ({midterm.weight?.toFixed(1)}% weight → {midterm.weightedScore?.toFixed(2) || '0'}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {course.final && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Final</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span>Final Exam</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{course.final.obtained !== null ? course.final.obtained : '-'}/{course.final.total}</span>
                      <span className="text-xs text-muted-foreground">
                        ({course.final.weight?.toFixed(1)}% weight → {course.final.weightedScore?.toFixed(2) || '0'}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-border hover:bg-secondary text-sm bg-transparent"
              onClick={() => setExpandedCourse(expandedCourse === course.courseCode ? null : course.courseCode)}
            >
              {expandedCourse === course.courseCode ? (
                <><ChevronUp className="mr-2 h-4 w-4" /> Hide Details</>
              ) : (
                <><ChevronDown className="mr-2 h-4 w-4" /> View Details</>
              )}
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
              onClick={() => downloadReport(course)}
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
