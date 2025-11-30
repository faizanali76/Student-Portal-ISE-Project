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

export type AvailableCourse = {
    id: string
    course_code: string
    course_name: string
    credits: number
    syllabus?: string
    teachers: string[] // List of teacher names
}

export type EnrolledCourse = {
    id: string
    course_code: string
    course_name: string
    credits: number
    syllabus?: string
    teacher_name: string
    section: string
    schedule?: string // Placeholder
}

export async function getAvailableCourses(userId: string) {
    try {
        // 0. Get Student's Table ID and Campus
        const { data: studentData } = await supabaseAdmin
            .from('students')
            .select('id, roll_number')
            .eq('user_id', userId)
            .single()

        if (!studentData?.roll_number) return []

        const studentId = studentData.id

        // Extract campus from roll number (e.g., "24F-3029" -> "F")
        const campusMatch = studentData.roll_number.match(/\d{2}([A-Z])-/)
        const studentCampus = campusMatch ? campusMatch[1] : null

        if (!studentCampus) return []

        // 1. Get courses the student is ALREADY enrolled in
        const { data: enrolled } = await supabaseAdmin
            .from('enrollments')
            .select('course_id')
            .eq('student_id', studentId)

        const enrolledIds = new Set(enrolled?.map(e => e.course_id) || [])

        // 2. Get ALL courses with assignments that match student's campus
        const { data: courses } = await supabaseAdmin
            .from('courses')
            .select(`
                *,
                course_assignments (
                    campus,
                    teachers (
                        profiles (full_name)
                    )
                )
            `)

        if (!courses) return []

        // 3. Filter and Format
        // Only show courses that:
        // - Have at least one assignment in the student's campus
        // - Are not already enrolled
        return courses
            .filter(c => {
                if (enrolledIds.has(c.id)) return false
                if (!c.course_assignments || c.course_assignments.length === 0) return false
                // Check if any assignment is for the student's campus
                return c.course_assignments.some((ca: any) => ca.campus === studentCampus)
            })
            .map(c => ({
                id: c.id,
                course_code: c.course_code,
                course_name: c.course_name,
                credits: c.credits,
                syllabus: c.syllabus,
                // Only show teachers from the student's campus
                teachers: c.course_assignments
                    .filter((ca: any) => ca.campus === studentCampus)
                    .map((ca: any) => ca.teachers?.profiles?.full_name || 'Unknown')
            })) as AvailableCourse[]

    } catch (error) {
        console.error('Error getting available courses:', error)
        return []
    }
}

export async function enrollCourse(userId: string, courseId: string) {
    try {
        // 0. Get Student's Table ID from user_id
        const { data: student, error: studentError } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('user_id', userId)
            .single()

        if (studentError || !student) {
            return { success: false, message: "Student record not found" }
        }

        const studentId = student.id

        // 1. Get Student's Current Credits
        const { data: currentEnrollments } = await supabaseAdmin
            .from('enrollments')
            .select(`
                course_id,
                courses (credits)
            `)
            .eq('student_id', studentId)

        let currentCredits = 0
        currentEnrollments?.forEach((e: any) => {
            currentCredits += e.courses?.credits || 0
        })

        // 2. Get New Course Credits
        const { data: newCourse } = await supabaseAdmin
            .from('courses')
            .select('credits')
            .eq('id', courseId)
            .single()

        if (!newCourse) return { success: false, message: "Course not found" }

        // 3. Check Limit (19 Credits)
        if (currentCredits + newCourse.credits > 19) {
            return {
                success: false,
                message: `Credit Limit Exceeded! You have ${currentCredits} credits. Adding ${newCourse.credits} would exceed the limit of 19.`
            }
        }

        // 4. Enroll
        const { error } = await supabaseAdmin
            .from('enrollments')
            .insert({
                student_id: studentId,
                course_id: courseId,
                enrollment_date: new Date().toISOString().split('T')[0] // Format as date only
            })

        if (error) {
            console.error('Enrollment error:', error)
            return { success: false, message: error.message }
        }

        revalidatePath('/student/enroll')
        revalidatePath('/student/courses')
        return { success: true, message: "Enrolled successfully" }

    } catch (error: any) {
        console.error('Unexpected enrollment error:', error)
        return { success: false, message: error.message }
    }
}

export async function getStudentCourses(userId: string) {
    try {
        // 0. Get Student's Table ID
        const { data: student } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('user_id', userId)
            .single()

        if (!student) return []

        const studentId = student.id

        const { data, error } = await supabaseAdmin
            .from('enrollments')
            .select(`
                course_id,
                courses (
                    id,
                    course_code,
                    course_name,
                    credits,
                    syllabus
                )
            `)
            .eq('student_id', studentId)

        if (error) {
            console.error('Error fetching student courses:', error)
            return []
        }

        // For each course, fetch the assigned teacher
        const coursesWithTeachers = await Promise.all(data.map(async (e: any) => {
            const course = e.courses

            // Fetch teachers for this course
            const { data: assignments } = await supabaseAdmin
                .from('course_assignments')
                .select(`
                    section,
                    teachers (
                        profiles (
                            full_name
                        )
                    )
                `)
                .eq('course_id', course.id)
                .limit(1) // Just get one for display for now

            const assignment = assignments?.[0] as any
            const teacherName = assignment?.teachers?.profiles?.full_name || 'TBD'
            const section = assignment?.section || 'A'

            return {
                id: course.id,
                course_code: course.course_code,
                course_name: course.course_name,
                credits: course.credits,
                syllabus: course.syllabus,
                teacher_name: teacherName,
                section: section
            }
        }))

        return coursesWithTeachers as EnrolledCourse[]

    } catch (error) {
        console.error('Error getting student courses:', error)
        return []
    }
}
