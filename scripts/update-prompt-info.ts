#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import { MarkdownParser } from '../lib/markdown-parser'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updatePromptInfo() {
  console.log('🔄 Updating prompt info sections from markdown files...')
  
  try {
    // Parse all markdown files
    const promptVaultPath = path.join(process.cwd(), '..', 'docs', 'prompt-vault')
    const parsedPrompts = MarkdownParser.parseAllMarkdownFiles(promptVaultPath)
    
    console.log(`📁 Found ${parsedPrompts.length} prompts to update`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const [index, parsed] of parsedPrompts.entries()) {
      console.log(`\n🔄 Updating ${index + 1}/${parsedPrompts.length}: ${parsed.title}`)
      
      try {
        // Update the prompt with new info sections
        const { error } = await supabase
          .from('prompts')
          .update({
            how_to_use: parsed.howToUse,
            what_you_get: parsed.whatYouGet,
            expected_results: parsed.expectedResults,
            variations: parsed.variations,
            workflow_overview: parsed.workflowOverview || null,
            what_you_create: parsed.whatYouCreate || null,
            // Also update steps_data if it's a multi-step prompt
            steps_data: parsed.stepsData || [],
            step_count: parsed.stepCount,
            workflow_type: parsed.workflowType
          })
          .eq('slug', parsed.slug)
        
        if (error) {
          console.error(`❌ Error updating "${parsed.title}":`, error.message)
          errorCount++
        } else {
          console.log(`✅ Successfully updated "${parsed.title}"`)
          console.log(`   - How to use: ${parsed.howToUse.length} items`)
          console.log(`   - What you get: ${parsed.whatYouGet.length} items`)
          console.log(`   - Expected results: ${parsed.expectedResults.length} items`)
          console.log(`   - Variations: ${parsed.variations.length} items`)
          if (parsed.workflowType === 'multi-step') {
            console.log(`   - Steps: ${parsed.stepsData?.length || 0} steps`)
          }
          successCount++
        }
      } catch (err) {
        console.error(`❌ Exception updating "${parsed.title}":`, err)
        errorCount++
      }
    }
    
    console.log('\n🎉 Update completed!')
    console.log(`✅ Successfully updated: ${successCount} prompts`)
    console.log(`❌ Failed updates: ${errorCount} prompts`)
    console.log(`📊 Total processed: ${parsedPrompts.length} prompts`)
    
  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

// Run the update
updatePromptInfo()