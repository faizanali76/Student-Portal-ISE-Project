"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Search, Loader2, Pencil, Trash2, Users } from "lucide-react"
import { toast } from "sonner"
import { createCourse, getCourses, type Course } from "@/app/actions/course-actions"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    const data = await getCourses()
    setCourses(data)
    setLoading(false)
  }

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    const result = await createCourse(null, formData)

    setIsSubmitting(false)

    if (result.success) {
      toast.success(result.message)
      setIsAddOpen(false)
      form.reset()
      loadCourses()
    } else {
      toast.error(result.message || "Failed to create course")
    }
  }

  const filteredCourses = courses.filter(course =>
    course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage all courses in the system</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>Enter the course details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input id="courseCode" name="courseCode" placeholder="CS301" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input id="courseName" name="courseName" placeholder="Algorithm Design" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1"
                  max="4"
                  placeholder="3"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Course
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by code or name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="p-0" />
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.course_code}</TableCell>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>
                      {course.assignments && course.assignments.length > 0 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="link" className="p-0 h-auto font-normal text-primary">
                              {course.assignments.length} Teacher{course.assignments.length > 1 ? 's' : ''}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Assigned Teachers</h4>
                              <div className="grid gap-2">
                                {course.assignments.map((a, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                      <span className="font-medium">{a.teacher_name}</span>
                                      <span className="text-xs text-muted-foreground">Campus: {a.campus}</span>
                                    </div>
                                    <div className="bg-secondary px-2 py-1 rounded text-xs">
                                      Sec: {a.section}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{course.student_count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
