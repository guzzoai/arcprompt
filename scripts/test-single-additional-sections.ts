import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import { MarkdownParser } from '../lib/markdown-parser'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testSingleAdditionalSections() {
  console.log('🧪 Testing additional sections on Facebook Post Optimizer...\n')
  
  try {
    // Parse the Facebook Post Optimizer file
    const testFile = path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', 'facebook-post-optimizer.md')
    const parsed = MarkdownParser.parseMarkdownFile(testFile)
    
    if (!parsed) {
      console.error('❌ Failed to parse file')
      return
    }
    
    console.log(`📋 Parsed prompt: ${parsed.title}`)
    console.log(`📈 Additional sections found: ${Object.keys(parsed.additionalSections).length}`)
    
    // Show the additional sections structure
    console.log('\n🔍 Additional Sections Structure:')
    console.log(JSON.stringify(parsed.additionalSections, null, 2))
    
    console.log('\n✅ Parser test completed successfully!')
    console.log('📊 This data structure will be stored in the additional_sections JSONB field.')
    
    // Show what the UI will receive
    console.log('\n🎨 UI Display Preview:')
    const sortedSections = Object.entries(parsed.additionalSections)
      .sort(([, a], [, b]) => a.order - b.order)
    
    for (const [key, section] of sortedSections) {
      console.log(`\n📍 Section ${section.order}: ${section.title}`)
      console.log(`   Key: ${key}`)
      console.log(`   Content: ${section.content.substring(0, 100)}...`)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testSingleAdditionalSections()