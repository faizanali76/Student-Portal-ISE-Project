"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { getAvailableCourses, enrollCourse, type AvailableCourse } from "@/app/actions/student-actions"
import { createClient } from "@/utils/supabase/client"

export default function EnrollCoursePage() {
    const [courses, setCourses] = useState<AvailableCourse[]>([])
    const [loading, setLoading] = useState(true)
    const [enrollingId, setEnrollingId] = useState<string | null>(null)
    const [studentId, setStudentId] = useState<string | null>(null)

    useEffect(() => {
        async function init() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setStudentId(user.id)
                loadCourses(user.id)
            }
        }
        init()
    }, [])

    const loadCourses = async (id: string) => {
        setLoading(true)
        const data = await getAvailableCourses(id)
        setCourses(data)
        setLoading(false)
    }

    const handleEnroll = async (courseId: string) => {
        if (!studentId) return

        setEnrollingId(courseId)
        const result = await enrollCourse(studentId, courseId)
        setEnrollingId(null)

        if (result.success) {
            toast.success(result.message)
            // Refresh list to remove enrolled course
            loadCourses(studentId)
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Enroll in Courses</h1>
                <p className="text-sm text-muted-foreground">Select courses to add to your semester schedule. Max 19 Credit Hours.</p>
            </div>

            <Card>
                <CardHeader className="p-0" />
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Course Name</TableHead>
                                <TableHead>Credits</TableHead>
                                <TableHead>Teachers</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No available courses found or you are already enrolled in all available courses.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                courses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">{course.course_code}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{course.course_name}</span>
                                                {course.syllabus && (
                                                    <span className="text-xs text-muted-foreground truncate max-w-[300px]">{course.syllabus}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{course.credits}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {course.teachers.map((t, i) => (
                                                    <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">{t}</span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                onClick={() => handleEnroll(course.id)}
                                                disabled={enrollingId === course.id}
                                            >
                                                {enrollingId === course.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Plus className="mr-2 h-4 w-4" /> Enroll
                                                    </>
                                                )}
                                            </Button>
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
