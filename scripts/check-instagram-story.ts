import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkInstagramStory() {
  console.log('🔍 Checking Instagram Story Sequence Builder specifically...')
  
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('slug', 'instagram-story-sequence-builder')
    .single()
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  if (data) {
    console.log(`✅ Found: ${data.title}`)
    console.log(`How to use: ${data.how_to_use?.length || 0} items`)
    console.log(`What you get: ${data.what_you_get?.length || 0} items`)
    console.log(`Expected results: ${data.expected_results?.length || 0} items`)
    console.log(`Variations: ${data.variations?.length || 0} items`)
    
    console.log('\n🎯 What you get items:')
    data.what_you_get?.forEach((item: string, i: number) => {
      console.log(`   ✅ ${item}`)
    })
    
    console.log('\n📊 Expected results items:')
    data.expected_results?.forEach((item: string, i: number) => {
      console.log(`   - ${item}`)
    })
  }
}

checkInstagramStory()