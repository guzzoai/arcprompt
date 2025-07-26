import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSpecificPrompt() {
  console.log('🔍 Checking specific prompt with info sections...')
  
  // First check what slugs are available
  const { data: allSlugs, error: slugError } = await supabase
    .from('prompts')
    .select('slug, title')
    .ilike('title', '%instagram%story%')
    .limit(5)
    
  if (slugError) {
    console.error('❌ Slug Error:', slugError)
    return
  }
  
  console.log('📄 Available Instagram Story prompts:')
  allSlugs?.forEach(prompt => console.log(`   - ${prompt.slug} (${prompt.title})`))
  
  // Use the correct slug
  const targetSlug = allSlugs?.[0]?.slug || 'instagram-story-sequence-builder'
  
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('slug', targetSlug)
    .single()
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  if (data) {
    console.log(`\n✅ Found: ${data.title}`)
    console.log(`How to use: ${data.how_to_use?.length || 0} items`)
    console.log(`What you get: ${data.what_you_get?.length || 0} items`)
    console.log(`Expected results: ${data.expected_results?.length || 0} items`)
    console.log(`Variations: ${data.variations?.length || 0} items`)
    
    if (data.what_you_get && data.what_you_get.length > 0) {
      console.log('\n🎯 What you get items:')
      data.what_you_get.forEach((item: string, i: number) => console.log(`   ✅ ${item}`))
    }
    
    if (data.expected_results && data.expected_results.length > 0) {
      console.log('\n📊 Expected results items:')
      data.expected_results.forEach((item: string, i: number) => console.log(`   - ${item}`))
    }
  }
}

checkSpecificPrompt()