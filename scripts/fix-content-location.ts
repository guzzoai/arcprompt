#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixContentLocation() {
  console.log('🔧 Fixing content location for single prompts...')
  
  try {
    // Find single prompts with empty content but non-empty steps_data
    console.log('\n1. Finding single prompts with misplaced content...')
    const { data: misplacedContent, error: fetchError } = await supabase
      .from('prompts')
      .select('id, title, content, workflow_type, steps_data')
      .eq('workflow_type', 'single')
      .or('content.is.null,content.eq.')
      .not('steps_data', 'is', null)
    
    if (fetchError) {
      console.error('❌ Error fetching prompts:', fetchError)
      return
    }
    
    console.log(`✅ Found ${misplacedContent?.length || 0} single prompts with content in steps_data`)
    
    if (!misplacedContent || misplacedContent.length === 0) {
      console.log('🎉 All single prompts have content in the correct location!')
      return
    }
    
    // Process each prompt
    console.log('\n2. Moving content from steps_data to content field...')
    let fixedCount = 0
    
    for (const prompt of misplacedContent) {
      try {
        if (prompt.steps_data && Array.isArray(prompt.steps_data) && prompt.steps_data.length > 0) {
          // For single prompts, typically the first step contains the main content
          const firstStep = prompt.steps_data[0]
          
          if (firstStep && firstStep.content) {
            // Update the prompt to move content from steps_data to content field
            const { error: updateError } = await supabase
              .from('prompts')
              .update({
                content: firstStep.content,
                steps_data: [] // Clear steps_data for single prompts
              })
              .eq('id', prompt.id)
            
            if (updateError) {
              console.error(`❌ Error updating "${prompt.title}":`, updateError)
            } else {
              fixedCount++
              console.log(`✅ Fixed: "${prompt.title}"`)
              console.log(`   Content length: ${firstStep.content.length} chars`)
            }
          } else {
            console.log(`⚠️  "${prompt.title}": No content found in first step`)
          }
        } else {
          console.log(`⚠️  "${prompt.title}": No steps_data found`)
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 50))
        
      } catch (error) {
        console.error(`❌ Error processing "${prompt.title}":`, error)
      }
    }
    
    console.log(`\n🎉 Successfully fixed ${fixedCount} prompts!`)
    
    // Verify the fixes
    console.log('\n3. Verifying fixes...')
    const { data: verifyEmpty, error: verifyError } = await supabase
      .from('prompts')
      .select('id, title, content, workflow_type')
      .eq('workflow_type', 'single')
      .or('content.is.null,content.eq.')
    
    if (verifyError) {
      console.error('❌ Error verifying fixes:', verifyError)
    } else {
      console.log(`✅ Remaining single prompts with empty content: ${verifyEmpty?.length || 0}`)
    }
    
    // Check total content stats
    const { data: contentStats } = await supabase
      .from('prompts')
      .select('workflow_type, content')
      .not('content', 'is', null)
      .neq('content', '')
    
    const singleWithContent = contentStats?.filter(p => p.workflow_type === 'single').length || 0
    const multiWithContent = contentStats?.filter(p => p.workflow_type === 'multi-step').length || 0
    
    console.log('\n📊 Content statistics:')
    console.log(`   Single prompts with content: ${singleWithContent}`)
    console.log(`   Multi-step prompts with content: ${multiWithContent}`)
    console.log(`   Total with content: ${contentStats?.length || 0}`)
    
  } catch (error) {
    console.error('❌ Fix process failed:', error)
    process.exit(1)
  }
}

// Run the fix
async function main() {
  try {
    await fixContentLocation()
  } catch (error) {
    console.error('Content fix failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}