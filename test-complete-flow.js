// Test script - Complete flow with manual profile creation
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

async function testCompleteFlow() {
    console.log('=== TESTING COMPLETE FLOW ===\n')

    const timestamp = Date.now()
    const email = `final${timestamp}@cfd.nu.edu.pk`
    const password = 'TestPass123!'
    const rollNo = `25F-${timestamp.toString().slice(-4)}`

    try {
        // Step 1: Create auth user
        console.log('1. Creating auth user...')
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: 'Final Test Student',
                role: 'student',
            },
        })

        if (authError) {
            console.error('❌ Auth Error:', authError)
            return
        }

        const userId = authData.user.id
        console.log('✓ Auth user created! ID:', userId)

        // Step 2: Manually create profile
        console.log('\n2. Creating profile manually...')
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                full_name: 'Final Test Student',
                role: 'student',
            })

        if (profileError) {
            console.error('❌ Profile Error:', profileError)
            return
        }
        console.log('✓ Profile created!')

        // Step 3: Insert student
        console.log('\n3. Creating student record...')
        const { error: studentError } = await supabaseAdmin
            .from('students')
            .insert({
                user_id: userId,
                roll_number: rollNo,
                batch: 'BCS-1A',
                program: 'BCS',
                enrollment_year: 2025,
            })

        if (studentError) {
            console.error('❌ Student Error:', studentError)
            return
        }

        console.log('✓ Student created!')
        console.log('\n✅ SUCCESS! Complete user created:')
        console.log('   Email:', email)
        console.log('   Password:', password)
        console.log('   Roll No:', rollNo)
        console.log('\n🎉 You can now login with these credentials!')

    } catch (error) {
        console.error('Unexpected error:', error)
    }
}

testCompleteFlow()
