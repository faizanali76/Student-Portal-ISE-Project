"use client"
import { Button } from "@/components/ui/button"

const courseResults = [
  {
    code: "CS101",
    name: "Data Structures",
    quiz: 8,
    assignment: 18,
    midterm: 22,
    final: 35,
    total: 83,
    grade: "A",
  },
  {
    code: "SE-1001",
    name: "Software Engineering",
    quiz: 7,
    assignment: 15,
    midterm: 20,
    final: 30,
    total: 72,
    grade: "B",
  },
]

const gradeData = [
  { name: "Quiz", value: 8, maxValue: 10 },
  { name: "Assignment", value: 18, maxValue: 20 },
  { name: "Midterm", value: 22, maxValue: 30 },
  { name: "Final", value: 35, maxValue: 40 },
]

export default function ResultsPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Results</h1>
        <p className="text-sm text-muted-foreground">View your marks and grades across courses</p>
      </div>

      {courseResults.map((course) => (
        <div key={course.code} className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-foreground">
                {course.code} - {course.name}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{course.grade}</p>
              <p className="text-sm text-muted-foreground">{course.total}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Quiz</p>
              <p className="text-xl font-bold text-foreground">{course.quiz}/10</p>
            </div>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Assignment</p>
              <p className="text-xl font-bold text-foreground">{course.assignment}/20</p>
            </div>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Midterm</p>
              <p className="text-xl font-bold text-foreground">{course.midterm}/30</p>
            </div>
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Final</p>
              <p className="text-xl font-bold text-foreground">{course.final}/40</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-border hover:bg-secondary text-sm bg-transparent">
              View Details
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm">Download</Button>
          </div>
        </div>
      ))}
    </div>
  )
}
