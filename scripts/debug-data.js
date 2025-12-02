
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('--- Debugging Data ---');

    // 1. Find Student "Burhan"
    const { data: students, error: sError } = await supabase
        .from('students')
        .select('id, user_id, roll_number, profiles(full_name, email)');

    if (sError) {
        console.error('Error fetching students:', sError);
        return;
    }

    const burhan = students.find(s => s.profiles?.full_name?.includes('Burhan'));

    if (!burhan) {
        console.log('Student Burhan not found.');
        return;
    }

    console.log(`Found Burhan: ID=${burhan.id} UserID=${burhan.user_id}`);

    // 2. Find Course "OOP"
    const { data: courses, error: cError } = await supabase
        .from('courses')
        .select('id, course_code, course_name');

    if (cError || !courses) {
        console.error('Error fetching courses:', cError);
        return;
    }

    const oopCourse = courses.find(c => c.course_code.includes('OOP') || c.course_name.includes('OOP'));

    if (!oopCourse) {
        console.log('No OOP course found.');
        return;
    }

    console.log(`Found Course: ${oopCourse.course_code} ID=${oopCourse.id}`);

    // 4. Check Assessments
    const { data: assessments, error: aError } = await supabase
        .from('assessments')
        .select('id, name, total_marks')
        .eq('course_id', oopCourse.id);

    if (assessments && assessments.length > 0) {
        const assessmentIds = assessments.map(a => a.id);

        // 5. Check Marks for Burhan
        const { data: marks, error: mError } = await supabase
            .from('student_marks')
            .select('assessment_id, obtained_marks, student_id')
            .in('assessment_id', assessmentIds);

        const burhanMarks = marks?.filter(m => m.student_id === burhan.id);

        console.log('\n--- BURHAN MARKS SUMMARY ---');
        assessments.forEach(a => {
            const mark = burhanMarks?.find(m => m.assessment_id === a.id);
            console.log(`${a.name}: ${mark ? mark.obtained_marks : 'NO ENTRY'} / ${a.total_marks}`);
        });
        console.log('----------------------------\n');
    } else {
        console.log('No assessments found for OOP.');
    }
}

main();
