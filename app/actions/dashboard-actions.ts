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

export type DashboardStats = {
    totalStudents: number
    totalTeachers: number
    totalCourses: number
}

export type ActivityItem = {
    id: string
    type: 'student' | 'teacher' | 'course'
    message: string
    time: string
    timestamp: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const [students, teachers, courses] = await Promise.all([
            supabaseAdmin.from('students').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('teachers').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('courses').select('*', { count: 'exact', head: true })
        ])

        return {
            totalStudents: students.count || 0,
            totalTeachers: teachers.count || 0,
            totalCourses: courses.count || 0
        }
    } catch (error) {
        console.error('Error fetching stats:', error)
        return { totalStudents: 0, totalTeachers: 0, totalCourses: 0 }
    }
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
    try {
        // Fetch recent profiles (students/teachers)
        const { data: profiles } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, role, created_at')
            .order('created_at', { ascending: false })
            .limit(5)

        // Fetch recent courses
        const { data: courses } = await supabaseAdmin
            .from('courses')
            .select('id, course_code, course_name, created_at')
            .order('created_at', { ascending: false })
            .limit(5)

        const activities: ActivityItem[] = []

        // Process profiles
        profiles?.forEach((p: any) => {
            activities.push({
                id: p.id,
                type: p.role === 'student' ? 'student' : 'teacher',
                message: p.role === 'student'
                    ? `New student ${p.full_name} registered`
                    : `New teacher ${p.full_name} added`,
                time: new Date(p.created_at).toLocaleString(), // Simple formatting
                timestamp: new Date(p.created_at).getTime()
            })
        })

        // Process courses
        courses?.forEach((c: any) => {
            activities.push({
                id: c.id,
                type: 'course',
                message: `Course ${c.course_code} - ${c.course_name} created`,
                time: new Date(c.created_at).toLocaleString(),
                timestamp: new Date(c.created_at).getTime()
            })
        })

        // Sort by timestamp desc and take top 5
        return activities
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5)

    } catch (error) {
        console.error('Error fetching activity:', error)
        return []
    }
}
