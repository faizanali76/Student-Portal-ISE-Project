
import dotenv from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    try {
        console.log('--- Testing getStudentResults ---')

        // 1. Find Burhan User ID
        const { data: students, error } = await supabase
            .from('students')
            .select('id, user_id, profiles(full_name)')

        const burhan = students?.find((s: any) => s.profiles?.full_name?.includes('Burhan'))

        if (!burhan) {
            console.error('Burhan not found')
            return
        }

        console.log(`Testing for Burhan (User ID: ${burhan.user_id})`)

        // 2. Import function dynamically
        const { getStudentResults } = await import('../app/actions/student-actions')

        // 3. Call function
        const results = await getStudentResults(burhan.user_id)

        console.log('Results:', JSON.stringify(results, null, 2))

    } catch (err) {
        console.error('Error:', err)
    }
}

main()
