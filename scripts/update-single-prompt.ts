import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import { MarkdownParser } from '../lib/markdown-parser'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateSinglePrompt() {
  console.log('🔄 Updating single prompt for debugging...')
  
  // Parse the specific file
  const testFile = path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', 'instagram-story-sequence-builder.md')
  const parsed = MarkdownParser.parseMarkdownFile(testFile)
  
  if (!parsed) {
    console.error('❌ Failed to parse file')
    return
  }
  
  console.log(`📋 Parsed prompt: ${parsed.title}`)
  console.log(`   How to use: ${parsed.howToUse.length} items`)
  console.log(`   What you get: ${parsed.whatYouGet.length} items`)
  console.log(`   Expected results: ${parsed.expectedResults.length} items`)
  console.log(`   Variations: ${parsed.variations.length} items`)
  
  // Update the database
  const { error } = await supabase
    .from('prompts')
    .update({
      how_to_use: parsed.howToUse,
      what_you_get: parsed.whatYouGet,
      expected_results: parsed.expectedResults,
      variations: parsed.variations,
    })
    .eq('slug', parsed.slug)
  
  if (error) {
    console.error('❌ Update error:', error)
  } else {
    console.log('✅ Successfully updated database')
  }
  
  // Verify the update
  const { data: updated, error: fetchError } = await supabase
    .from('prompts')
    .select('how_to_use, what_you_get, expected_results, variations')
    .eq('slug', parsed.slug)
    .single()
  
  if (fetchError) {
    console.error('❌ Fetch error:', fetchError)
  } else {
    console.log('\n📋 Database verification:')
    console.log(`   How to use: ${updated.how_to_use?.length || 0} items`)
    console.log(`   What you get: ${updated.what_you_get?.length || 0} items`)
    console.log(`   Expected results: ${updated.expected_results?.length || 0} items`)
    console.log(`   Variations: ${updated.variations?.length || 0} items`)
  }
}

updateSinglePrompt()