"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Loader2, Settings2, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import {
    getCourses,
    getTeachers,
    getCourseAssignments,
    assignTeacherToSection,
    removeAssignment,
    type Course,
    type TeacherOption,
    type CourseAssignment
} from "@/app/actions/course-actions"

export default function AssignCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [teachers, setTeachers] = useState<TeacherOption[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Dialog State
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [assignments, setAssignments] = useState<CourseAssignment[]>([])
    const [loadingAssignments, setLoadingAssignments] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form State
    const [selectedTeacher, setSelectedTeacher] = useState("")
    const [section, setSection] = useState("")
    const [department, setDepartment] = useState("")
    const [campus, setCampus] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [coursesData, teachersData] = await Promise.all([
            getCourses(),
            getTeachers()
        ])
        setCourses(coursesData)
        setTeachers(teachersData)
        setLoading(false)
    }

    const handleManageClick = async (course: Course) => {
        setSelectedCourse(course)
        setIsDialogOpen(true)
        setLoadingAssignments(true)
        // Fetch assignments for this course
        const data = await getCourseAssignments(course.id)
        setAssignments(data)
        setLoadingAssignments(false)

        // Reset form
        setSelectedTeacher("")
        setSection("")
        setDepartment("")
        setCampus("")
    }

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCourse) return

        setSubmitting(true)
        const result = await assignTeacherToSection(
            selectedCourse.id,
            selectedTeacher,
            section,
            department,
            campus
        )
        setSubmitting(false)

        if (result.success) {
            toast.success("Teacher assigned successfully")
            // Refresh assignments
            const data = await getCourseAssignments(selectedCourse.id)
            setAssignments(data)
            // Reset form fields
            setSection("")
        } else {
            toast.error(result.message || "Failed to assign teacher")
        }
    }

    const handleRemove = async (id: string) => {
        if (!confirm("Are you sure you want to remove this assignment?")) return

        const result = await removeAssignment(id)
        if (result.success) {
            toast.success("Assignment removed")
            if (selectedCourse) {
                const data = await getCourseAssignments(selectedCourse.id)
                setAssignments(data)
            }
        } else {
            toast.error("Failed to remove assignment")
        }
    }

    const filteredCourses = courses.filter(course =>
        course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Filter teachers based on selected campus (optional UX improvement)
    const availableTeachers = campus
        ? teachers.filter(t => !t.campus || t.campus === campus)
        : teachers

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Assign Courses</h1>
                <p className="text-sm text-muted-foreground">Manage teacher assignments, sections, and campuses</p>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
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
                                <TableHead>Credits</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredCourses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No courses found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">{course.course_code}</TableCell>
                                        <TableCell>{course.course_name}</TableCell>
                                        <TableCell>{course.credits}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleManageClick(course)}>
                                                <Settings2 className="mr-2 h-4 w-4" /> Manage Assignments
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Manage Assignments Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Manage Assignments: {selectedCourse?.course_code}</DialogTitle>
                        <DialogDescription>{selectedCourse?.course_name}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Add New Assignment Form */}
                        <div className="rounded-lg border p-4 bg-muted/50">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Add New Assignment
                            </h3>
                            <form onSubmit={handleAssign} className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Campus</Label>
                                    <Select value={campus} onValueChange={setCampus} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Campus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="F">Faisalabad (F)</SelectItem>
                                            <SelectItem value="L">Lahore (L)</SelectItem>
                                            <SelectItem value="I">Islamabad (I)</SelectItem>
                                            <SelectItem value="K">Karachi (K)</SelectItem>
                                            <SelectItem value="P">Peshawar (P)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Department</Label>
                                    <Select value={department} onValueChange={setDepartment} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Dept" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CS">Computer Science</SelectItem>
                                            <SelectItem value="SE">Software Engineering</SelectItem>
                                            <SelectItem value="AI">Artificial Intelligence</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Teacher</Label>
                                    <Select value={selectedTeacher} onValueChange={setSelectedTeacher} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Teacher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableTeachers.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.full_name} {t.campus ? `(${t.campus})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Section</Label>
                                    <Input
                                        placeholder="e.g. 3A"
                                        value={section}
                                        onChange={(e) => setSection(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Button type="submit" className="w-full" disabled={submitting}>
                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Assign Teacher
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Existing Assignments List */}
                        <div>
                            <h3 className="font-semibold mb-2">Current Assignments</h3>
                            {loadingAssignments ? (
                                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                            ) : assignments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No teachers assigned yet.</p>
                            ) : (
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Teacher</TableHead>
                                                <TableHead>Campus</TableHead>
                                                <TableHead>Dept</TableHead>
                                                <TableHead>Section</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {assignments.map((a) => (
                                                <TableRow key={a.id}>
                                                    <TableCell className="font-medium">{a.teacher_name}</TableCell>
                                                    <TableCell>{a.campus}</TableCell>
                                                    <TableCell>{a.department}</TableCell>
                                                    <TableCell>{a.section}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemove(a.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
