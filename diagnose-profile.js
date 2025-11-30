// Test script to diagnose the profile creation issue
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

async function diagnoseIssue() {
    console.log('=== DIAGNOSING PROFILE CREATION ISSUE ===\n')

    const timestamp = Date.now()
    const email = `diag${timestamp}@cfd.nu.edu.pk`
    const password = 'TestPass123!'

    try {
        // Step 1: Create auth user
        console.log('1. Creating auth user...')
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: 'Diagnostic Test',
                role: 'student',
            },
        })

        if (authError) {
            console.error('❌ Auth Error:', authError)

            if (profileError) {
                console.error('❌ Profile NOT found! Error:', profileError)
                console.log('\n🔍 ROOT CAUSE: The database trigger is NOT creating the profile entry!')
                console.log('   This is why students.user_id foreign key fails.')
                return
            }

            console.log('✓ Profile found:', profileData)

            // Step 4: Try to insert student
            console.log('\n4. Inserting student record...')
            const { error: studentError } = await supabaseAdmin
                .from('students')
                .insert({
                    user_id: userId,
                    roll_number: `TEST-${timestamp}`,
                    batch: 'BCS-1A',
                    program: 'BCS',
                    enrollment_year: 2025,
                })

            if (studentError) {
                console.error('❌ Student insert failed:', studentError)
                return
            }

            console.log('✓ Student record created!')
            console.log('\n✅ ALL STEPS SUCCESSFUL!')

        } catch (error) {
            console.error('Unexpected error:', error)
        }
    }

diagnoseIssue()
