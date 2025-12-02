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

function calculateGrade(percentage: number) {
    if (percentage >= 90) return { letter: 'A+', gpa: 4.00 }
    if (percentage >= 86) return { letter: 'A', gpa: 4.00 }
    if (percentage >= 82) return { letter: 'A-', gpa: 3.67 }
    if (percentage >= 78) return { letter: 'B+', gpa: 3.33 }
    if (percentage >= 74) return { letter: 'B', gpa: 3.00 }
    if (percentage >= 70) return { letter: 'B-', gpa: 2.67 }
    if (percentage >= 66) return { letter: 'C+', gpa: 2.33 }
    if (percentage >= 62) return { letter: 'C', gpa: 2.00 }
    if (percentage >= 58) return { letter: 'C-', gpa: 1.67 }
    if (percentage >= 54) return { letter: 'D+', gpa: 1.33 }
    if (percentage >= 50) return { letter: 'D', gpa: 1.00 }
    return { letter: 'F', gpa: 0.00 }
}

export async function getStudentAttendance(userId: string) {
    try {
        // 1. Get Student ID
        const { data: student } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('user_id', userId)
            .single()

        if (!student) return []

        // 2. Get Enrollments
        const { data: enrollments } = await supabaseAdmin
            .from('enrollments')
            .select('id, course_id, courses(course_code, course_name, total_classes)')
            .eq('student_id', student.id)

        if (!enrollments) return []

        // 3. Calculate Attendance for each course
        const attendance = await Promise.all(enrollments.map(async (e: any) => {
            const course = Array.isArray(e.courses) ? e.courses[0] : e.courses

            // Get present count
            const { count: presentCount } = await supabaseAdmin
                .from('attendance_records')
                .select('*', { count: 'exact', head: true })
                .eq('enrollment_id', e.id)
                .eq('status', 'present')

            // Get total conducted classes (unique dates for this course)
            const { data: conductedDates } = await supabaseAdmin
                .from('attendance_records')
                .select('date, enrollments!inner(course_id)')
                .eq('enrollments.course_id', e.course_id)

            // Filter unique dates
            const uniqueDates = new Set(conductedDates?.map((d: any) => d.date))
            const classesConducted = uniqueDates.size

            const percentage = classesConducted > 0
                ? Math.round(((presentCount || 0) / classesConducted) * 100)
                : 100

            return {
                courseCode: course.course_code,
                courseName: course.course_name,
                classesConducted,
                classesAttended: presentCount || 0,
                percentage
            }
        }))

        return attendance

    } catch (error) {
        console.error('Error fetching attendance:', error)
        return []
    }
}

export async function getNotifications(userId: string) {
    try {
        const { data: notifications } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        return notifications || []
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return []
    }
}

export async function getStudentResults(userId: string) {
    try {
        // 0. Get Student ID
        const { data: student } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('user_id', userId)
            .single()

        if (!student) {
            console.error('[getStudentResults] No student found for user_id:', userId)
            return []
        }

        const studentId = student.id
        console.log('[getStudentResults] Student ID:', studentId)

        // 1. Get Enrolled Courses
        const { data: enrollments } = await supabaseAdmin
            .from('enrollments')
            .select(`
                id,
                course_id,
                courses (
                    id,
                    course_code,
                    course_name,
                    num_assignments,
                    num_quizzes,
                    num_midterms,
                    num_finals
                )
            `
            )
            .eq('student_id', studentId)

        if (!enrollments) {
            console.error('[getStudentResults] No enrollments found')
            return []
        }

        console.log('[getStudentResults] Found enrollments:', enrollments.length)

        // 2. For each course, calculate grades
        const results = await Promise.all(enrollments.map(async (e: any) => {
            const course = Array.isArray(e.courses) ? e.courses[0] : e.courses
            console.log('[getStudentResults] Processing course:', course?.course_code, 'ID:', course?.id)

            if (!course?.id) {
                console.error('[getStudentResults] Invalid course ID for enrollment:', e.id)
                return {
                    courseCode: 'Unknown',
                    courseName: 'Unknown',
                    quizzes: [],
                    assignments: [],
                    midterms: [],
                    final: null,
                    quizWeighted: 0,
                    assignmentWeighted: 0,
                    midtermWeighted: 0,
                    finalWeighted: 0,
                    totalPercentage: 0,
                    grade: '-',
                    gpa: 0.00
                }
            }

            // Get all assessments for this course
            const { data: courseAssessments, error: assessError } = await supabaseAdmin
                .from('assessments')
                .select('id, name, type, total_marks')
                .eq('course_id', course.id)

            if (assessError) {
                console.error('[getStudentResults] Error fetching assessments:', assessError)
            }

            console.log('[getStudentResults] Assessments for', course.course_code, ':', courseAssessments?.length || 0)

            if (!courseAssessments || courseAssessments.length === 0) {
                return {
                    courseCode: course.course_code,
                    courseName: course.course_name,
                    quizzes: [],
                    assignments: [],
                    midterms: [],
                    final: null,
                    quizWeighted: 0,
                    assignmentWeighted: 0,
                    midtermWeighted: 0,
                    finalWeighted: 0,
                    totalPercentage: 0,
                    grade: '-',
                    gpa: 0.00
                }
            }

            // Get student marks for these assessments
            const assessmentIds = courseAssessments.map((a: any) => a.id)
            const { data: studentMarks } = await supabaseAdmin
                .from('student_marks')
                .select('assessment_id, obtained_marks')
                .eq('student_id', studentId)
                .in('assessment_id', assessmentIds)

            console.log('[getStudentResults] Student marks for', course.course_code, ':', studentMarks?.length || 0)

            // Calculate individual assessment weights
            const numQuizzes = course.num_quizzes || 0
            const numAssignments = course.num_assignments || 0
            const numMidterms = course.num_midterms || 2
            const numFinals = course.num_finals || 1

            // Each assessment gets equal share of the category weight
            const quizWeight = numQuizzes > 0 ? 10 / numQuizzes : 0
            const assignmentWeight = numAssignments > 0 ? 15 / numAssignments : 0
            const midtermWeight = numMidterms > 0 ? 30 / numMidterms : 0
            const finalWeight = numFinals > 0 ? 45 / numFinals : 0

            // Process each assessment with its individual mark and weight
            let totalWeightedScore = 0
            let allMarksPresent = true

            const processedAssessments = courseAssessments.map((assessment: any) => {
                const markEntry = studentMarks?.find((m: any) => m.assessment_id === assessment.id)
                const obtained = (markEntry && markEntry.obtained_marks !== null)
                    ? Number(markEntry.obtained_marks)
                    : null

                if (obtained === null) {
                    console.log('[getStudentResults] Missing mark for:', assessment.name, assessment.id)
                    allMarksPresent = false
                }

                // Calculate individual weight for this specific assessment
                let individualWeight = 0
                let individualWeightedScore = 0
                const type = assessment.type.toLowerCase()

                if (type === 'quiz') {
                    individualWeight = quizWeight
                } else if (type === 'assignment') {
                    individualWeight = assignmentWeight
                } else if (type === 'midterm') {
                    individualWeight = midtermWeight
                } else if (type === 'final') {
                    individualWeight = finalWeight
                }

                // Calculate this assessment's contribution to the final grade
                if (obtained !== null && assessment.total_marks > 0) {
                    individualWeightedScore = (obtained / assessment.total_marks) * individualWeight
                    totalWeightedScore += individualWeightedScore
                }

                return {
                    name: assessment.name,
                    type: assessment.type, // Keep original casing for display
                    obtained: obtained,
                    total: assessment.total_marks,
                    weight: individualWeight, // Individual weight for display
                    weightedScore: individualWeightedScore // Contribution to final grade
                }
            })

            // Group by type (Case Insensitive)
            const quizzes = processedAssessments.filter((a: any) => a.type.toLowerCase() === 'quiz')
            const assignments = processedAssessments.filter((a: any) => a.type.toLowerCase() === 'assignment')
            const midterms = processedAssessments.filter((a: any) => a.type.toLowerCase() === 'midterm')
            const finals = processedAssessments.filter((a: any) => a.type.toLowerCase() === 'final')

            // Calculate category weighted scores (sum of all assessments in category)
            const quizWeighted = quizzes.reduce((sum: number, q: any) => sum + q.weightedScore, 0)
            const assignmentWeighted = assignments.reduce((sum: number, a: any) => sum + a.weightedScore, 0)
            const midtermWeighted = midterms.reduce((sum: number, m: any) => sum + m.weightedScore, 0)
            const finalWeighted = finals.reduce((sum: number, f: any) => sum + f.weightedScore, 0)

            const totalPercentage = totalWeightedScore

            // Only show final grade if all assessments have marks
            let grade = '-'
            let gpa = 0.00

            if (allMarksPresent && courseAssessments.length > 0) {
                const gradeInfo = calculateGrade(totalPercentage)
                grade = gradeInfo.letter
                gpa = gradeInfo.gpa
            }

            console.log('[getStudentResults]', course.course_code, 'Total:', totalPercentage, 'Grade:', grade)

            return {
                courseCode: course.course_code,
                courseName: course.course_name,
                quizzes,
                assignments,
                midterms,
                final: finals[0] || null,
                quizWeighted,
                assignmentWeighted,
                midtermWeighted,
                finalWeighted,
                totalPercentage: Math.round(totalPercentage * 10) / 10,
                grade,
                gpa
            }
        }))

        return results

    } catch (error) {
        console.error('[getStudentResults] Error:', error)
        return []
    }
}

export async function getStudentDashboard(userId: string) {
    try {
        // 0. Get Student
        const { data: student } = await supabaseAdmin
            .from('students')
            .select('id, user_id, profiles(full_name)')
            .eq('user_id', userId)
            .single()

        if (!student) return null

        const studentId = student.id
        const studentName = (student.profiles as any)?.full_name || 'Student'

        // 1. Get enrolled courses count
        const { count: coursesCount } = await supabaseAdmin
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', studentId)

        // 2. Get attendance data
        const attendanceData = await getStudentAttendance(userId)

        const totalConducted = attendanceData.reduce((sum, c) => sum + c.classesConducted, 0)
        const totalAttended = attendanceData.reduce((sum, c) => sum + c.classesAttended, 0)
        const overallAttendance = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 100

        // 3. Get results for GPA calculation
        const results = await getStudentResults(userId)

        // Filter out courses with pending grades ('-')
        const completedResults = results.filter(r => r.grade !== '-')

        const totalGPA = completedResults.reduce((sum, r) => sum + r.gpa, 0)
        const avgGPA = completedResults.length > 0 ? (totalGPA / completedResults.length).toFixed(2) : '0.00'

        // Calculate average grade
        const avgPercentage = completedResults.length > 0
            ? completedResults.reduce((sum, r) => sum + r.totalPercentage, 0) / completedResults.length
            : 0
        const avgGrade = completedResults.length > 0 ? calculateGrade(avgPercentage).letter : '-'

        // 4. Grade distribution
        const gradeCount: Record<string, number> = {}
        completedResults.forEach(r => {
            const baseGrade = r.grade[0] // Get A, B, C, D, or F
            gradeCount[baseGrade] = (gradeCount[baseGrade] || 0) + 1
        })

        const gradeDistribution = Object.entries(gradeCount).map(([grade, count]) => ({
            name: grade,
            value: count
        }))

        // 5. Recent notifications (latest 3)
        const notifications = await getNotifications(userId)
        const recentNotifications = notifications.slice(0, 3)

        return {
            studentName,
            enrolledCourses: coursesCount || 0,
            overallAttendance,
            avgGrade,
            avgGPA,
            courseAttendance: attendanceData.map(c => ({
                name: c.courseCode,
                attendance: c.percentage
            })),
            gradeDistribution,
            recentNotifications
        }

    } catch (error) {
        console.error('Error fetching student dashboard:', error)
        return null
    }
}
