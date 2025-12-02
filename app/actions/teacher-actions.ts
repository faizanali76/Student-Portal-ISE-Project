'use server'

import { createClient } from '@supabase/supabase-js'

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

export type TeacherCourse = {
    id: string
    course_code: string
    course_name: string
    section: string
    student_count: number
    avg_attendance: string
    class_average: string
}

export type CourseDetails = {
    id: string
    course_code: string
    course_name: string
    credits: number
    syllabus: string | null
    num_assignments: number
    num_quizzes: number
    num_midterms: number
    num_finals: number
    section: string
    student_count: number
}

export async function getTeacherCourses(userId: string) {
    try {
        // 1. Get Teacher ID
        const { data: teacher } = await supabaseAdmin
            .from('teachers')
            .select('id')
            .eq('user_id', userId)
            .single()

        if (!teacher) return []

        // 2. Get Assigned Courses
        const { data: assignments } = await supabaseAdmin
            .from('course_assignments')
            .select(`
                section,
                courses (
                    id,
                    course_code,
                    course_name
                )
            `)
            .eq('teacher_id', teacher.id)

        if (!assignments) return []

        // 3. For each course, get stats (mocked for now, but structure is ready)
        // In real app, we would calculate avg attendance and grades from DB
        const courses = await Promise.all(assignments.map(async (a: any) => {
            const course = a.courses

            // Get student count for this course (total enrolled)
            // Note: This counts ALL students in the course, not just this section
            // To count per section, we'd need to link enrollments to sections (which we haven't done yet)
            const { count } = await supabaseAdmin
                .from('enrollments')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', course.id)

            return {
                id: course.id,
                course_code: course.course_code,
                course_name: course.course_name,
                section: a.section,
                student_count: count || 0,
                avg_attendance: "0%", // Placeholder
                class_average: "0/100" // Placeholder
            }
        }))

        return courses as TeacherCourse[]

    } catch (error) {
        console.error('Error getting teacher courses:', error)
        return []
    }
}

export async function getTeacherCourseDetails(userId: string, courseCode: string) {
    try {
        // 1. Get Teacher ID
        const { data: teacher } = await supabaseAdmin
            .from('teachers')
            .select('id')
            .eq('user_id', userId)
            .single()

        if (!teacher) return null

        // 2. Get Course Details
        const { data: course } = await supabaseAdmin
            .from('courses')
            .select('*')
            .eq('course_code', courseCode)
            .single()

        if (!course) return null

        // 3. Verify Assignment
        const { data: assignment } = await supabaseAdmin
            .from('course_assignments')
            .select('section')
            .eq('course_id', course.id)
            .eq('teacher_id', teacher.id)
            .single()

        if (!assignment) return null // Teacher not assigned to this course

        // 4. Get Student Count
        const { count } = await supabaseAdmin
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)

        return {
            id: course.id,
            course_code: course.course_code,
            course_name: course.course_name,
            credits: course.credits,
            syllabus: course.syllabus,
            num_assignments: course.num_assignments || 0,
            num_quizzes: course.num_quizzes || 0,
            num_midterms: course.num_midterms || 2,
            num_finals: course.num_finals || 1,
            section: assignment.section,
            student_count: count || 0
        } as CourseDetails

    } catch (error) {
        console.error('Error getting course details:', error)
        return null
    }
}

export type StudentMark = {
    student_id: string
    roll_number: string
    full_name: string
    obtained_marks: string
}


export async function getCourseStudents(courseId: string) {
    try {
        const { data: enrollments } = await supabaseAdmin
            .from('enrollments')
            .select(`
                id,
                student_id,
                students (
                    roll_number,
                    user_id,
                    profiles (
                        full_name
                    )
                )
            `)
            .eq('course_id', courseId)

        if (!enrollments) return []

        return enrollments.map((e: any) => ({
            enrollment_id: e.id,
            student_id: e.student_id,
            roll_number: e.students?.roll_number || 'Unknown',
            full_name: e.students?.profiles?.full_name || 'Unknown'
        }))
    } catch (error) {
        console.error('Error fetching students:', error)
        return []
    }
}


export async function getAssessment(courseId: string, name: string) {
    try {
        const { data: assessment } = await supabaseAdmin
            .from('assessments')
            .select(`
                id,
                total_marks,
                student_marks (
                    student_id,
                    obtained_marks
                )
            `)
            .eq('course_id', courseId)
            .eq('name', name)
            .single()

        if (!assessment) return null

        const marksMap: Record<string, string> = {}
        assessment.student_marks?.forEach((m: any) => {
            marksMap[m.student_id] = m.obtained_marks.toString()
        })

        return {
            id: assessment.id,
            total_marks: assessment.total_marks,
            marks: marksMap
        }
    } catch (error) {
        return null
    }
}

export async function saveAssessmentMarks(
    courseId: string,
    name: string,
    type: string,
    totalMarks: number,
    marks: Record<string, string>
) {
    try {
        // 1. Get or Create Assessment
        let { data: assessment } = await supabaseAdmin
            .from('assessments')
            .select('id')
            .eq('course_id', courseId)
            .eq('name', name)
            .single()

        if (!assessment) {
            const { data: newAssessment, error } = await supabaseAdmin
                .from('assessments')
                .insert({
                    course_id: courseId,
                    name: name,
                    type: type,
                    total_marks: totalMarks
                })
                .select('id')
                .single()

            if (error) throw error
            assessment = newAssessment
        } else {
            // Update total marks if changed
            await supabaseAdmin
                .from('assessments')
                .update({ total_marks: totalMarks })
                .eq('id', assessment.id)
        }

        // 2. Prepare Marks Data
        const marksData = Object.entries(marks).map(([studentId, obtainedMarks]) => ({
            assessment_id: assessment.id,
            student_id: studentId,
            obtained_marks: parseFloat(obtainedMarks) || 0
        }))


        // 3. Upsert Marks
        const { error: marksError } = await supabaseAdmin
            .from('student_marks')
            .upsert(marksData, {
                onConflict: 'assessment_id,student_id'
            })

        if (marksError) throw marksError

            // 4. Create Notifications for students (async to not block response)
            (async () => {
                try {
                    // Get course details
                    const { data: course } = await supabaseAdmin
                        .from('courses')
                        .select('course_code')
                        .eq('id', courseId)
                        .single()

                    if (!course) return

                    // Get all student user_ids from enrollments
                    const { data: enrollments } = await supabaseAdmin
                        .from('enrollments')
                        .select('student_id, students(user_id)')
                        .eq('course_id', courseId)

                    if (!enrollments) return

                    // Create notifications for all students in the course
                    const notifications = enrollments
                        .filter((e: any) => e.students?.user_id)
                        .map((e: any) => ({
                            user_id: e.students.user_id,
                            type: 'info',
                            title: 'New Marks Posted',
                            message: `Marks for ${name} have been uploaded for ${course.course_code}`,
                            related_course_id: courseId
                        }))

                    if (notifications.length > 0) {
                        await supabaseAdmin
                            .from('notifications')
                            .insert(notifications)
                    }

                } catch (err) {
                    console.error('Error creating marks notifications:', err)
                }
            })()

        return { success: true, message: "Marks saved successfully" }

    } catch (error: any) {
        console.error('Error saving marks:', error)
        return { success: false, message: error.message }
    }
}


export async function getAttendance(courseId: string, date: string) {
    try {
        // 1. Get Enrollments (we need IDs to query records)
        // Use the SAME query structure as getCourseStudents to ensure we find them
        const { data: enrollments } = await supabaseAdmin
            .from('enrollments')
            .select('id')
            .eq('course_id', courseId)

        if (!enrollments || enrollments.length === 0) return {}

        const enrollmentIds = enrollments.map(e => e.id)

        // 2. Get Attendance Records
        const { data: records } = await supabaseAdmin
            .from('attendance_records')
            .select('enrollment_id, status')
            .in('enrollment_id', enrollmentIds)
            .eq('date', date)

        const attendanceMap: Record<string, boolean> = {}

        records?.forEach((r: any) => {
            // Map enrollment_id to status
            attendanceMap[r.enrollment_id] = r.status === 'present'
        })

        return attendanceMap

    } catch (error) {
        console.error('Error fetching attendance:', error)
        return {}
    }
}



export async function saveAttendance(
    courseId: string,
    teacherUserId: string,
    date: string,
    attendanceData: { enrollment_id: string, status: string }[]
) {
    try {
        // 1. Get Teacher ID
        const { data: teacher } = await supabaseAdmin
            .from('teachers')
            .select('id')
            .eq('user_id', teacherUserId)
            .single()

        if (!teacher) return { success: false, message: "Teacher not found" }

        if (attendanceData.length === 0) return { success: true, message: "No changes to save" }

        // 2. Prepare Records
        const records = attendanceData.map(item => ({
            enrollment_id: item.enrollment_id,
            date: date,
            status: item.status,
            marked_by: teacher.id,
            marked_at: new Date().toISOString()
        }))

        // 3. Upsert Records
        // Delete existing for these enrollments on this date
        const enrollmentIds = records.map(r => r.enrollment_id)

        await supabaseAdmin
            .from('attendance_records')
            .delete()
            .in('enrollment_id', enrollmentIds)
            .eq('date', date)

        const { error } = await supabaseAdmin
            .from('attendance_records')
            .insert(records)

        if (error) throw error

            // 4. Check for Low Attendance (< 80%) and Notify
            // We do this asynchronously to not block the UI
            (async () => {
                try {
                    const affectedStudentIds = records.map(r => r.enrollment_id)

                    // Get course details
                    const { data: course } = await supabaseAdmin
                        .from('courses')
                        .select('course_code, total_classes')
                        .eq('id', courseId)
                        .single()

                    if (!course) return

                    const totalClasses = course.total_classes || 30

                    // For each affected student, calculate new percentage
                    for (const enrollmentId of affectedStudentIds) {
                        // Get student user_id
                        const { data: enrollment } = await supabaseAdmin
                            .from('enrollments')
                            .select('student_id, students(user_id)')
                            .eq('id', enrollmentId)
                            .single()

                        if (!enrollment?.students) continue

                        const students = enrollment.students as any
                        const studentUserId = Array.isArray(students) ? students[0]?.user_id : students.user_id

                        if (!studentUserId) continue

                        // Calculate stats
                        const { data: conductedDates } = await supabaseAdmin
                            .from('attendance_records')
                            .select('date, enrollments!inner(course_id)')
                            .eq('enrollments.course_id', courseId)

                        const classesConducted = new Set(conductedDates?.map((d: any) => d.date)).size

                        const { count: classesAttended } = await supabaseAdmin
                            .from('attendance_records')
                            .select('*', { count: 'exact', head: true })
                            .eq('enrollment_id', enrollmentId)
                            .eq('status', 'present')

                        const percentage = classesConducted > 0
                            ? Math.round(((classesAttended || 0) / classesConducted) * 100)
                            : 100


                        if (percentage < 80) {
                            // Check if we already notified recently (e.g., in last 3 days) to avoid spam
                            const threeDaysAgo = new Date()
                            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

                            const { data: existingNotif } = await supabaseAdmin
                                .from('notifications')
                                .select('id')
                                .eq('user_id', studentUserId)
                                .eq('related_course_id', courseId)
                                .eq('type', 'warning')
                                .gte('created_at', threeDaysAgo.toISOString())
                                .limit(1)

                            if (!existingNotif || existingNotif.length === 0) {
                                await supabaseAdmin
                                    .from('notifications')
                                    .insert({
                                        user_id: studentUserId,
                                        type: 'warning',
                                        title: 'Low Attendance Warning',
                                        message: `Your attendance in ${course.course_code} has dropped to ${percentage}%. Please ensure you attend upcoming classes.`,
                                        related_course_id: courseId
                                    })
                            }
                        }

                        // Also notify if marked absent on this specific date
                        const currentRecord = records.find(r => r.enrollment_id === enrollmentId)
                        if (currentRecord && currentRecord.status === 'absent') {
                            await supabaseAdmin
                                .from('notifications')
                                .insert({
                                    user_id: studentUserId,
                                    type: 'warning',
                                    title: 'Marked Absent',
                                    message: `You were marked absent in ${course.course_code} on ${new Date(date).toLocaleDateString()}`,
                                    related_course_id: courseId
                                })
                        }
                    }
                } catch (err) {
                    console.error('Error in auto-notification:', err)
                }
            })()

        return { success: true, message: "Attendance saved successfully" }

    } catch (error: any) {
        console.error('Error saving attendance:', error)
        return { success: false, message: error.message }
    }
}



export async function getTeacherDashboardStats(userId: string) {
    try {
        // 1. Get Teacher ID & Name
        const { data: teacher } = await supabaseAdmin
            .from('teachers')
            .select(`
                id,
                user_id,
                profiles (
                    full_name
                )
            `)
            .eq('user_id', userId)
            .single()

        if (!teacher) return null

        // 2. Get Assigned Courses with Student Counts
        const { data: assignments } = await supabaseAdmin
            .from('course_assignments')
            .select(`
                course_id,
                courses (
                    id,
                    course_code,
                    course_name
                )
            `)
            .eq('teacher_id', teacher.id)

        if (!assignments) return null

        const stats = await Promise.all(assignments.map(async (a: any) => {
            const course = a.courses

            // Get total students
            const { count: studentCount } = await supabaseAdmin
                .from('enrollments')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', course.id)

            // Calculate Avg Attendance (This is expensive, maybe optimize later)
            // Get all attendance records for this course
            const { data: attendanceRecords } = await supabaseAdmin
                .from('attendance_records')
                .select('status, enrollments!inner(course_id)')
                .eq('enrollments.course_id', course.id)

            let avgAttendance = 0
            if (attendanceRecords && attendanceRecords.length > 0) {
                const presentCount = attendanceRecords.filter((r: any) => r.status === 'present').length
                avgAttendance = Math.round((presentCount / attendanceRecords.length) * 100)
            }

            // Calculate Class Avg Marks
            // Get all assessments for this course
            const { data: assessments } = await supabaseAdmin
                .from('assessments')
                .select('id, total_marks')
                .eq('course_id', course.id)

            let classAvg = 0
            if (assessments && assessments.length > 0) {
                const assessmentIds = assessments.map(a => a.id)

                // Get all marks for these assessments
                const { data: allMarks } = await supabaseAdmin
                    .from('student_marks')
                    .select('obtained_marks, assessment_id')
                    .in('assessment_id', assessmentIds)

                if (allMarks && allMarks.length > 0) {
                    // Calculate total possible marks (sum of all assessment totals * number of students who have marks)
                    // Actually, simpler way: Calculate percentage for each student, then average those.
                    // Or: (Total Obtained / Total Max) * 100 for the whole class.

                    // Let's go with: Average of (Student's Total Obtained / Total Max Possible) * 100

                    const totalMaxMarks = assessments.reduce((sum, a) => sum + a.total_marks, 0)

                    if (totalMaxMarks > 0) {
                        const studentTotals: Record<string, number> = {}
                        allMarks.forEach((m: any) => {
                            // We don't have student_id in this query, let's add it
                        })
                    }

                    // Re-query with student_id
                    const { data: allMarksWithStudent } = await supabaseAdmin
                        .from('student_marks')
                        .select('student_id, obtained_marks')
                        .in('assessment_id', assessmentIds)

                    if (allMarksWithStudent) {
                        const studentObtained: Record<string, number> = {}
                        allMarksWithStudent.forEach((m: any) => {
                            studentObtained[m.student_id] = (studentObtained[m.student_id] || 0) + (m.obtained_marks || 0)
                        })

                        const totalMax = assessments.reduce((sum, a) => sum + a.total_marks, 0)

                        if (totalMax > 0) {
                            const percentages = Object.values(studentObtained).map(obtained => (obtained / totalMax) * 100)
                            const sumPercentages = percentages.reduce((sum, p) => sum + p, 0)
                            classAvg = Math.round(sumPercentages / percentages.length)
                        }
                    }
                }
            }

            return {
                id: course.id,
                name: course.course_code,
                fullName: course.course_name,
                students: studentCount || 0,
                attendance: avgAttendance,
                avgMarks: classAvg
            }
        }))

        return {
            teacherName: Array.isArray((teacher as any).profiles) ? (teacher as any).profiles[0]?.full_name : (teacher as any).profiles?.full_name || 'Teacher',
            courses: stats
        }

    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return null
    }
}

export async function getAttendanceTrend(userId: string) {
    try {
        // 1. Get Teacher ID
        const { data: teacher } = await supabaseAdmin
            .from('teachers')
            .select('id')
            .eq('user_id', userId)
            .single()

        if (!teacher) return []

        // 2. Get Courses
        const { data: assignments } = await supabaseAdmin
            .from('course_assignments')
            .select('course_id')
            .eq('teacher_id', teacher.id)

        if (!assignments || assignments.length === 0) return []

        const courseIds = assignments.map(a => a.course_id)

        // 3. Get Attendance Records for last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: records } = await supabaseAdmin
            .from('attendance_records')
            .select(`
                date,
                status,
                enrollments!inner (
                    course_id,
                    courses (
                        course_code
                    )
                )
            `)
            .in('enrollments.course_id', courseIds)
            .gte('date', thirtyDaysAgo.toISOString())
            .order('date', { ascending: true })

        if (!records) return []

        // 4. Aggregate Data
        // Structure: { "2023-11-01": { date: "Nov 01", "CS101": 85, "SE101": 90, counts: { "CS101": {total: 10, present: 8} } } }
        const groupedData: Record<string, any> = {}

        records.forEach((r: any) => {
            const dateKey = r.date // "YYYY-MM-DD"
            const courseCode = r.enrollments.courses.course_code
            const isPresent = r.status === 'present'

            if (!groupedData[dateKey]) {
                groupedData[dateKey] = {
                    date: new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    counts: {}
                }
            }

            if (!groupedData[dateKey].counts[courseCode]) {
                groupedData[dateKey].counts[courseCode] = { total: 0, present: 0 }
            }

            groupedData[dateKey].counts[courseCode].total++
            if (isPresent) {
                groupedData[dateKey].counts[courseCode].present++
            }
        })

        // 5. Format for Recharts
        const chartData = Object.values(groupedData).map((day: any) => {
            const entry: any = { date: day.date }
            Object.entries(day.counts).forEach(([course, counts]: [string, any]) => {
                entry[course] = Math.round((counts.present / counts.total) * 100)
            })
            return entry
        })

        return chartData

    } catch (error) {
        console.error('Error fetching attendance trend:', error)
        return []
    }
}
