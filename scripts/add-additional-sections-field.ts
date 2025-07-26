import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addAdditionalSectionsField() {
  console.log('🔄 Adding additional_sections JSONB field to prompts table...')
  
  try {
    // Since we can't use RPC, let's try to verify if the column already exists
    const { data: testData, error: testError } = await supabase
      .from('prompts')
      .select('additional_sections')
      .limit(1)
    
    if (testError) {
      if (testError.message.includes('column "additional_sections" does not exist')) {
        console.log('❌ Column does not exist yet. Please run this SQL in Supabase SQL Editor:')
        console.log(`
ALTER TABLE prompts 
ADD COLUMN additional_sections JSONB DEFAULT '{}';
        `)
        console.log('Then run this script again to verify.')
        return
      } else {
        console.error('❌ Unexpected error:', testError)
        return
      }
    }
    
    console.log('✅ Column additional_sections already exists!')
    console.log('📋 Test query returned:', testData?.length || 0, 'rows')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

addAdditionalSectionsField()