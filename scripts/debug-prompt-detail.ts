#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Use environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)')
  console.error('   SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY for new API keys)')
  console.error('')
  console.error('   For new Supabase API keys, use:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.error('   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugPromptDetail() {
  console.log('🔍 Debugging prompt detail pages...')
  
  try {
    // Get a sample prompt to test
    console.log('\n1. Getting sample prompts...')
    const { data: samplePrompts, error: sampleError } = await supabase
      .from('prompts')
      .select('slug, title, short_description, content, workflow_type')
      .eq('status', 'published')
      .limit(5)
    
    if (sampleError) {
      console.error('❌ Error fetching sample prompts:', sampleError)
      return
    }
    
    console.log(`✅ Found ${samplePrompts?.length || 0} sample prompts`)
    samplePrompts?.forEach((prompt, index) => {
      console.log(`  ${index + 1}. "${prompt.title}" (slug: ${prompt.slug})`)
      console.log(`     Short description: ${prompt.short_description || 'NONE'}`)
      console.log(`     Content length: ${prompt.content?.length || 0} chars`)
      console.log(`     Workflow type: ${prompt.workflow_type}`)
      console.log()
    })
    
    if (samplePrompts && samplePrompts.length > 0) {
      const testPrompt = samplePrompts[0]
      
      // Test the exact query used by getPromptById
      console.log(`\n2. Testing getPromptById query for "${testPrompt.title}"...`)
      const { data: detailPrompt, error: detailError } = await supabase
        .from('prompts')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('slug', testPrompt.slug)
        .eq('status', 'published')
        .single()
      
      if (detailError) {
        console.error('❌ Error fetching prompt detail:', detailError)
        return
      }
      
      console.log('✅ Prompt detail retrieved successfully')
      console.log(`   Title: ${detailPrompt.title}`)
      console.log(`   Slug: ${detailPrompt.slug}`)
      console.log(`   Category: ${detailPrompt.categories?.name || 'NONE'}`)
      console.log(`   Short description: ${detailPrompt.short_description || 'EMPTY'}`)
      console.log(`   Content: ${detailPrompt.content ? `${detailPrompt.content.substring(0, 100)}...` : 'EMPTY'}`)
      console.log(`   Workflow type: ${detailPrompt.workflow_type}`)
      console.log(`   Steps data: ${detailPrompt.steps_data ? JSON.stringify(detailPrompt.steps_data).substring(0, 100) + '...' : 'NONE'}`)
      console.log(`   How to use: ${detailPrompt.how_to_use ? JSON.stringify(detailPrompt.how_to_use).substring(0, 50) + '...' : 'EMPTY'}`)
      console.log(`   What you get: ${detailPrompt.what_you_get ? JSON.stringify(detailPrompt.what_you_get).substring(0, 50) + '...' : 'EMPTY'}`)
      
      // Check if this is a multi-step prompt
      if (detailPrompt.workflow_type === 'multi-step') {
        console.log('\n   📋 Multi-step workflow details:')
        console.log(`   Step count: ${detailPrompt.step_count}`)
        if (detailPrompt.steps_data && Array.isArray(detailPrompt.steps_data)) {
          detailPrompt.steps_data.forEach((step: any, index: number) => {
            console.log(`     Step ${index + 1}: ${step.title || 'No title'}`)
            console.log(`       Content: ${step.content ? step.content.substring(0, 50) + '...' : 'EMPTY'}`)
          })
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

// Run the debug
debugPromptDetail()