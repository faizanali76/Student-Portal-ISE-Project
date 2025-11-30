'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Initialize Supabase Admin Client
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

type CreateUserResponse = {
    success: boolean
    message?: string
    credentials?: {
        email: string
        password: string
        rollNo?: string
    }
}

function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let retVal = ""
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
    }
    return retVal
}

const CAMPUS_DOMAINS: Record<string, string> = {
    F: "cfd.nu.edu.pk",
    L: "lhr.nu.edu.pk",
    I: "isb.nu.edu.pk",
    K: "khi.nu.edu.pk",
    P: "pwr.nu.edu.pk",
}

export async function createUser(prevState: any, formData: FormData): Promise<CreateUserResponse> {
    console.log('\n=== CREATE USER SERVER ACTION STARTED ===')
    try {
        const role = formData.get('role') as 'student' | 'teacher'
        const name = formData.get('name') as string
        const campus = formData.get('campus') as string // F, L, I, K, P

        console.log('Role:', role, 'Name:', name, 'Campus:', campus)

        if (!name || !campus || !role) {
            console.error('Missing required fields:', { name, campus, role })
            return { success: false, message: "Missing required fields" }
        }

        let email = ""
        let password = generatePassword()
        let rollNumber = ""
        let metadata = {}

        if (role === 'student') {
            const batchYear = formData.get('batchYear') as string // e.g. "24"
            const rollNo = formData.get('rollNo') as string // e.g. "3029"
            const program = formData.get('program') as string // e.g. "BSE"
            const section = formData.get('section') as string // e.g. "3B"

            if (!batchYear || !rollNo || !program || !section) {
                return { success: false, message: "Missing student fields" }
            }

            // Format: 24F-3029
            rollNumber = `${batchYear}${campus}-${rollNo}`

            // Email: f243029@cfd.nu.edu.pk
            const campusChar = campus.toLowerCase()
            const domain = CAMPUS_DOMAINS[campus]
            email = `${campusChar}${batchYear}${rollNo}@${domain}`

            metadata = {
                full_name: name,
                role: 'student',
                roll_number: rollNumber,
                batch: `${program}-${section}`, // BSE-3B
            }
        } else if (role === 'teacher') {
            const department = formData.get('department') as string

            if (!department) {
                return { success: false, message: "Missing teacher fields" }
            }

            // Email: name.surname@domain
            const nameFormatted = name.toLowerCase().replace(/\s+/g, '.')
            const domain = CAMPUS_DOMAINS[campus]
            email = `${nameFormatted}@${domain}`

            metadata = {
                full_name: name,
                role: 'teacher',
                department: department,
            }
        }

        // 1. Check for Duplicates & Generate Email
        if (role === 'student') {
            // Check if student with this Roll Number already exists
            const { data: existingStudent } = await supabaseAdmin
                .from('students')
                .select('id')
                .eq('roll_number', rollNumber)
                .single()

            if (existingStudent) {
                return { success: false, message: `A student with Roll Number ${rollNumber} already exists.` }
            }
        } else if (role === 'teacher') {
            // Smart Email Generation for Teachers
            // Try base email first, then append .1, .2, etc.
            let emailExists = true
            let counter = 0
            const baseEmail = email.split('@')[0] // e.g. ahmad
            const domain = email.split('@')[1]

            while (emailExists) {
                // Check if email exists in Auth
                // Note: Supabase Admin API doesn't have a direct "check email" without error
                // So we'll query the profiles table which should be in sync (or we assume it is)
                // OR we can just try to create and catch the error, but that's messy for a loop.
                // Better: Check profiles table for email.

                const { data: existingProfile } = await supabaseAdmin
                    .from('profiles')
                    .select('email')
                    .eq('email', email)
                    .single()

                if (existingProfile) {
                    counter++
                    email = `${baseEmail}.${counter}@${domain}`
                } else {
                    emailExists = false
                }

                if (counter > 10) {
                    return { success: false, message: "Too many teachers with similar names. Please use a different name." }
                }
            }
        }

        // 2. Create User in Supabase Auth
        console.log('Creating user in Auth with email:', email)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: metadata,
        })

        if (authError) {
            console.error("Auth Error:", authError)
            if (authError.code === 'email_exists' || authError.message.includes('already has been registered')) {
                return { success: false, message: `A user with email ${email} already exists. Please check the Roll Number or Name.` }
            }
            return { success: false, message: authError.message }
        }

        console.log('Auth user created successfully! User ID:', authData.user.id)
        const userId = authData.user.id

        // 1.5. MANUALLY Create Profile (trigger is not working!)
        console.log('Creating profile manually...')
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                full_name: (metadata as any).full_name,
                role: role,
            })

        if (profileError) {
            console.error("Profile Error:", profileError)
            return { success: false, message: "User created but failed to create profile: " + profileError.message }
        }
        console.log('Profile created successfully!')

        // 2. Insert into Specific Tables (Students/Teachers)
        // Note: The 'profiles' table is handled by the Trigger we fixed earlier!
        // But we still need to insert into 'students' or 'teachers' tables.

        if (role === 'student') {
            console.log('Inserting student record...')
            const { error: dbError } = await supabaseAdmin
                .from('students')
                .insert({
                    user_id: userId,
                    roll_number: rollNumber,
                    batch: (metadata as any).batch, // BSE-3B
                    program: formData.get('program') as string,
                    enrollment_year: new Date().getFullYear(),
                })

            if (dbError) {
                console.error("DB Error (Student):", dbError)
                // Rollback auth user if DB fails? ideally yes, but for now just report error
                return { success: false, message: "User created but failed to save student details: " + dbError.message }
            }
            console.log('Student record created successfully')
        } else if (role === 'teacher') {
            // Generate employee ID (simple random for now)
            const empId = "EMP-" + Math.floor(1000 + Math.random() * 9000)

            const { error: dbError } = await supabaseAdmin
                .from('teachers')
                .insert({
                    user_id: userId,
                    employee_id: empId,
                    department: formData.get('department') as string,
                    designation: "Lecturer", // Default
                })

            if (dbError) {
                console.error("DB Error (Teacher):", dbError)
                return { success: false, message: "User created but failed to save teacher details: " + dbError.message }
            }
        }

        return {
            success: true,
            credentials: {
                email,
                password,
                rollNo: rollNumber || undefined
            }
        }

    } catch (error: any) {
        console.error("Server Action Error:", error)
        return { success: false, message: error.message }
    }
}
