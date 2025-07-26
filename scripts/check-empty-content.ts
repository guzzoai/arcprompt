#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkEmptyContent() {
  console.log('🔍 Checking for prompts with empty content...')
  
  try {
    // Find prompts with empty or very short content
    const { data: emptyContent, error: emptyError } = await supabase
      .from('prompts')
      .select('id, title, content, workflow_type, step_count, steps_data')
      .or('content.is.null,content.eq.')
    
    if (emptyError) {
      console.error('❌ Error checking empty content:', emptyError)
      return
    }
    
    console.log(`\n📊 Found ${emptyContent?.length || 0} prompts with empty content`)
    
    if (emptyContent && emptyContent.length > 0) {
      console.log('\n📋 Empty content prompts:')
      emptyContent.forEach((prompt, index) => {
        console.log(`  ${index + 1}. "${prompt.title}"`)
        console.log(`     Workflow: ${prompt.workflow_type}`)
        console.log(`     Step count: ${prompt.step_count}`)
        console.log(`     Steps data: ${prompt.steps_data ? 'Has data' : 'Empty'}`)
        console.log()
      })
      
      // Check if these are multi-step prompts that should have content in steps_data
      const multiStepEmpty = emptyContent.filter(p => p.workflow_type === 'multi-step')
      console.log(`\n🔄 ${multiStepEmpty.length} are multi-step workflows (content might be in steps_data)`)
      
      if (multiStepEmpty.length > 0) {
        console.log('\n🧪 Checking steps_data for multi-step prompts...')
        multiStepEmpty.forEach((prompt, index) => {
          console.log(`  ${index + 1}. "${prompt.title}"`)
          if (prompt.steps_data && Array.isArray(prompt.steps_data)) {
            console.log(`     Steps: ${prompt.steps_data.length}`)
            prompt.steps_data.forEach((step: any, stepIndex: number) => {
              console.log(`       Step ${stepIndex + 1}: ${step.title || 'No title'}`)
              console.log(`         Content: ${step.content ? step.content.substring(0, 50) + '...' : 'EMPTY'}`)
            })
          } else {
            console.log(`     ❌ No steps data found`)
          }
        })
      }
    }
    
    // Also check for very short content (less than 50 characters)
    const { data: shortContent, error: shortError } = await supabase
      .from('prompts')
      .select('id, title, content')
      .not('content', 'is', null)
      .gte('content', '')
    
    if (!shortError && shortContent) {
      const veryShort = shortContent.filter(p => p.content && p.content.length < 50)
      console.log(`\n⚠️  Found ${veryShort.length} prompts with very short content (< 50 chars)`)
      
      if (veryShort.length > 0 && veryShort.length <= 10) {
        veryShort.forEach((prompt, index) => {
          console.log(`  ${index + 1}. "${prompt.title}": "${prompt.content}"`)
        })
      }
    }
    
    // Summary
    const { count: totalPrompts } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
    
    console.log(`\n📈 Summary:`)
    console.log(`   Total prompts: ${totalPrompts}`)
    console.log(`   Empty content: ${emptyContent?.length || 0}`)
    console.log(`   Multi-step with empty content: ${emptyContent?.filter(p => p.workflow_type === 'multi-step').length || 0}`)
    console.log(`   Single with empty content: ${emptyContent?.filter(p => p.workflow_type === 'single').length || 0}`)
    
  } catch (error) {
    console.error('❌ Check failed:', error)
  }
}

// Run the check
checkEmptyContent()