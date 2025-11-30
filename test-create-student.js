// Test script to verify server action works
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

async function testCreateStudent() {
    console.log('Testing student creation...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    const timestamp = Date.now()
    const email = `test${timestamp}@cfd.nu.edu.pk`
    const password = 'TestPass123!'

    try {
        // Test 1: Create auth user
        console.log('\n1. Creating auth user...')
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: 'Test Student',
                role: 'student',
                roll_number: '25F-9999',
                batch: 'BCS-1A',
            },
        })

        if (authError) {
            console.error('Auth Error:', authError)
            return
        }

        console.log('✓ Auth user created! ID:', authData.user.id)

        // Test 2: Insert student record
        console.log('\n2. Inserting student record...')
        const { error: dbError } = await supabaseAdmin
            .from('students')
            .insert({
                user_id: authData.user.id,
                roll_number: '25F-9999',
                batch: 'BCS-1A',
                program: 'BCS',
                enrollment_year: 2025,
            })

        if (dbError) {
            console.error('DB Error:', dbError)
            return
        }

        console.log('✓ Student record created!')
        console.log('\n✅ SUCCESS! Student created with:')
        console.log('   Email:', email)
        console.log('   Password:', password)
        console.log('   Roll No: 25F-9999')

    } catch (error) {
        console.error('Unexpected error:', error)
    }
}

testCreateStudent()
