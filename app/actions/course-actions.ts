'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

export type Course = {
    id: string
    course_code: string
    course_name: string
    credits: number
    teacher_id?: string | null
    teacher_name?: string | null
    student_count?: number
    assignments?: {
        teacher_name: string
        section: string
        campus: string
    }[]
}


export type TeacherOption = {
    id: string
    full_name: string
    department: string
    campus?: string
}

export type CourseAssignment = {
    id: string
    course_id: string
    teacher_id: string
    teacher_name: string
    section: string
    department: string
    campus: string
}

export async function getCourses() {
    try {
        const { data, error } = await supabaseAdmin
            .from('courses')
            .select(`
                *,
                teachers (
                    id,
                    user_id,
                    profiles (
                        full_name
                    )
                ),
                course_assignments (
                    section,
                    campus,
                    teachers (
                        profiles (
                            full_name
                        )
                    )
                )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching courses:', error)
            return []
        }

        return data.map((course: any) => ({
            id: course.id,
            course_code: course.course_code,
            course_name: course.course_name,
            credits: course.credits,
            teacher_id: course.teacher_id,
            teacher_name: course.teachers?.profiles?.full_name || 'Unassigned',
            student_count: 0,
            assignments: course.course_assignments?.map((ca: any) => ({
                teacher_name: ca.teachers?.profiles?.full_name || 'Unknown',
                section: ca.section,
                campus: ca.campus
            })) || []
        })) as Course[]

    } catch (error) {
        console.error('Unexpected error in getCourses:', error)
        return []
    }
}

export async function getTeachers() {
    try {
        const { data, error } = await supabaseAdmin
            .from('teachers')
            .select(`
                id,
                department,
                campus,
                profiles (
                    full_name
                )
            `)

        if (error) {
            console.error('Error fetching teachers:', error)
            return []
        }

        return data.map((t: any) => ({
            id: t.id,
            full_name: t.profiles?.full_name || 'Unknown',
            department: t.department,
            campus: t.campus
        })) as TeacherOption[]

    } catch (error) {
        console.error('Unexpected error in getTeachers:', error)
        return []
    }
}

export async function createCourse(prevState: any, formData: FormData) {
    try {
        const courseCode = formData.get('courseCode') as string
        const courseName = formData.get('courseName') as string
        const credits = parseInt(formData.get('credits') as string)
        const syllabus = formData.get('syllabus') as string
        const numAssignments = parseInt(formData.get('numAssignments') as string) || 0
        const numQuizzes = parseInt(formData.get('numQuizzes') as string) || 0
        const numMidterms = 2 // Fixed
        const numFinals = 1 // Fixed

        if (!courseCode || !courseName || !credits) {
            return { success: false, message: "Missing required fields" }
        }

        const { data: existing } = await supabaseAdmin
            .from('courses')
            .select('id')
            .eq('course_code', courseCode)
            .single()

        if (existing) {
            return { success: false, message: `Course code ${courseCode} already exists` }
        }

        const { error } = await supabaseAdmin
            .from('courses')
            .insert({
                course_code: courseCode,
                course_name: courseName,
                credits: credits,
                syllabus: syllabus,
                num_assignments: numAssignments,
                num_quizzes: numQuizzes,
                num_midterms: numMidterms,
                num_finals: numFinals
            })

        if (error) {
            console.error('DB Error creating course:', error)
            return { success: false, message: error.message }
        }

        revalidatePath('/admin/courses')
        return { success: true, message: "Course created successfully" }

    } catch (error: any) {
        console.error('Unexpected error in createCourse:', error)
        return { success: false, message: error.message }
    }
}

// Deprecated: Simple assignment
export async function assignTeacher(courseId: string, teacherId: string) {
    try {
        const { error } = await supabaseAdmin
            .from('courses')
            .update({ teacher_id: teacherId })
            .eq('id', courseId)

        if (error) {
            return { success: false, message: error.message }
        }

        revalidatePath('/admin/courses')
        revalidatePath('/admin/courses/assign')
        return { success: true, message: "Teacher assigned successfully" }

    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

// NEW: Advanced Assignment
export async function getCourseAssignments(courseId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('course_assignments')
            .select(`
                id,
                course_id,
                teacher_id,
                section,
                department,
                campus,
                teachers (
                    profiles (
                        full_name
                    )
                )
            `)
            .eq('course_id', courseId)

        if (error) {
            console.error('Error fetching assignments:', error)
            return []
        }

        return data.map((a: any) => ({
            id: a.id,
            course_id: a.course_id,
            teacher_id: a.teacher_id,
            teacher_name: a.teachers?.profiles?.full_name || 'Unknown',
            section: a.section,
            department: a.department,
            campus: a.campus
        })) as CourseAssignment[]
    } catch (error) {
        return []
    }
}

export async function assignTeacherToSection(
    courseId: string,
    teacherId: string,
    section: string,
    department: string,
    campus: string
) {
    try {
        // 1. Fetch Teacher Details (Campus)
        const { data: teacher } = await supabaseAdmin
            .from('teachers')
            .select('campus')
            .eq('id', teacherId)
            .single()

        if (!teacher) {
            return { success: false, message: "Teacher not found" }
        }

        // Constraint 1: Campus Check
        if (teacher.campus && teacher.campus !== campus) {
            return { success: false, message: `Teacher is from ${teacher.campus} campus but assignment is for ${campus} campus.` }
        }

        // 2. Workload Check
        // Get all assignments for this teacher
        const { data: assignments } = await supabaseAdmin
            .from('course_assignments')
            .select('course_id, section')
            .eq('teacher_id', teacherId)

        if (assignments) {
            // Check Max 3 Unique Courses
            const uniqueCourses = new Set(assignments.map(a => a.course_id))
            // If adding a new course (not in set) and count is already 3
            if (!uniqueCourses.has(courseId) && uniqueCourses.size >= 3) {
                return { success: false, message: "Workload Limit: Teacher cannot teach more than 3 different courses." }
            }

            // Check Max 2 Sections per Course
            // Count sections for THIS course
            const sectionsForThisCourse = assignments.filter(a => a.course_id === courseId)
            if (sectionsForThisCourse.length >= 2) {
                return { success: false, message: "Workload Limit: Teacher cannot teach more than 2 sections of the same course." }
            }
        }

        // 3. Insert Assignment
        const { error } = await supabaseAdmin
            .from('course_assignments')
            .insert({
                course_id: courseId,
                teacher_id: teacherId,
                section: section,
                department: department,
                campus: campus
            })

        if (error) {
            if (error.code === '23505') { // Unique violation
                return { success: false, message: "This assignment already exists." }
            }
            return { success: false, message: error.message }
        }

        revalidatePath('/admin/courses/assign')
        return { success: true, message: "Teacher assigned successfully" }

    } catch (error: any) {
        console.error('Assign Error:', error)
        return { success: false, message: error.message }
    }
}

export async function removeAssignment(assignmentId: string) {
    try {
        const { error } = await supabaseAdmin
            .from('course_assignments')
            .delete()
            .eq('id', assignmentId)

        if (error) return { success: false, message: error.message }

        revalidatePath('/admin/courses/assign')
        return { success: true, message: "Assignment removed" }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}
