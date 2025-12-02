
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    console.log('--- Debugging Data ---')

    // 1. Find Student "Burhan"
    const { data: students, error: sError } = await supabase
        .from('students')
        .select('id, user_id, roll_number, profiles(full_name, email)')

    if (sError) {
        console.error('Error fetching students:', sError)
        return
    }

    const burhan = students.find((s: any) => s.profiles?.full_name?.includes('Burhan'))

    if (!burhan) {
        console.log('Student Burhan not found. Listing all students:')
        students.forEach((s: any) => console.log(`- ${s.profiles?.full_name} (${s.roll_number}) ID: ${s.id}`))
        return
    }

    console.log(`Found Burhan: ID=${burhan.id}, UserID=${burhan.user_id}, Roll=${burhan.roll_number}`)

    // 2. Find Course "OOP"
    const { data: courses, error: cError } = await supabase
        .from('courses')
        .select('id, course_code, course_name')
        .ilike('course_code', '%OOP%') // Try to match OOP
        .single()

    if (cError || !courses) {
        console.error('Error fetching OOP course:', cError)
        return
    }

    console.log(`Found Course: ${courses.course_code} (${courses.course_name}) ID=${courses.id}`)

    // 3. Check Enrollment
    const { data: enrollment, error: eError } = await supabase
        .from('enrollments')
        .select('id, student_id, course_id')
        .eq('student_id', burhan.id)
        .eq('course_id', courses.id)

    console.log('Enrollment:', enrollment)

    // 4. Check Assessments
    const { data: assessments, error: aError } = await supabase
        .from('assessments')
        .select('id, name, total_marks')
        .eq('course_id', courses.id)

    console.log('Assessments:', assessments)

    if (assessments && assessments.length > 0) {
        const assessmentIds = assessments.map((a: any) => a.id)

        // 5. Check Marks for Burhan
        const { data: marks, error: mError } = await supabase
            .from('student_marks')
            .select('*')
            .in('assessment_id', assessmentIds)
        //.eq('student_id', burhan.id) // Let's check ALL marks for these assessments first to see if ID matches

        console.log('All Marks for OOP Assessments:', marks)

        const burhanMarks = marks?.filter((m: any) => m.student_id === burhan.id)
        console.log('Marks specifically for Burhan ID:', burhanMarks)
    }
}

main()
