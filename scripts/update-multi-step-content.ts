#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import { MarkdownParser } from '../lib/markdown-parser'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('URL:', supabaseUrl ? 'Found' : 'Missing')
  console.error('Service Key:', supabaseServiceKey ? 'Found' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateMultiStepPrompts() {
  console.log('🔧 Updating multi-step prompts with full content...\n')
  
  try {
    // Get all multi-step prompts
    const { data: multiStepPrompts, error: fetchError } = await supabase
      .from('prompts')
      .select('id, title, slug, workflow_type, steps_data, how_to_use, what_you_get, expected_results, variations')
      .eq('workflow_type', 'multi-step')
    
    if (fetchError) {
      console.error('❌ Error fetching multi-step prompts:', fetchError)
      return
    }
    
    console.log(`📋 Found ${multiStepPrompts?.length || 0} multi-step prompts\n`)
    
    if (!multiStepPrompts || multiStepPrompts.length === 0) {
      console.log('No multi-step prompts found!')
      return
    }
    
    const promptVaultPath = path.join(process.cwd(), '../docs/prompt-vault')
    let updatedCount = 0
    let needsUpdateCount = 0
    
    for (const prompt of multiStepPrompts) {
      try {
        // Check if steps_data has content
        const hasStepContent = prompt.steps_data && 
          Array.isArray(prompt.steps_data) && 
          prompt.steps_data.length > 0 &&
          prompt.steps_data.some((step: any) => step.content && step.content.length > 0)
        
        const hasInfoSections = (prompt.how_to_use && prompt.how_to_use.length > 0) ||
          (prompt.what_you_get && prompt.what_you_get.length > 0) ||
          (prompt.expected_results && prompt.expected_results.length > 0) ||
          (prompt.variations && prompt.variations.length > 0)
        
        if (hasStepContent && hasInfoSections) {
          console.log(`✅ "${prompt.title}" - Already has content, skipping`)
          continue
        }
        
        needsUpdateCount++
        console.log(`\n🔍 Processing: "${prompt.title}"`)
        console.log(`   Current state: ${hasStepContent ? 'Has step content' : 'Missing step content'}, ${hasInfoSections ? 'Has info sections' : 'Missing info sections'}`)
        
        // Find the markdown file
        const findMarkdownFile = (dir: string): string | null => {
          const fs = require('fs')
          try {
            const files = fs.readdirSync(dir, { withFileTypes: true })
            
            for (const file of files) {
              if (file.isDirectory()) {
                const result = findMarkdownFile(path.join(dir, file.name))
                if (result) return result
              } else if (file.name.endsWith('.md')) {
                const filePath = path.join(dir, file.name)
                const content = fs.readFileSync(filePath, 'utf-8')
                
                // Check if this file matches our prompt
                if (content.includes(prompt.title) || 
                    (prompt.slug && file.name.includes(prompt.slug))) {
                  // Verify it's a workflow file
                  if (content.includes('WORKFLOW OVERVIEW') && content.includes('STEP 1:')) {
                    return filePath
                  }
                }
              }
            }
          } catch (error) {
            // Directory might not exist
          }
          return null
        }
        
        const markdownFile = findMarkdownFile(promptVaultPath)
        
        if (markdownFile) {
          console.log(`   📄 Found markdown file: ${path.basename(markdownFile)}`)
          
          // Parse the markdown file
          const parsed = MarkdownParser.parseMarkdownFile(markdownFile)
          
          if (parsed) {
            console.log(`   📊 Parsed data:`)
            console.log(`      - Steps: ${parsed.stepsData?.length || 0}`)
            console.log(`      - How to use: ${parsed.howToUse?.length || 0} items`)
            console.log(`      - What you get: ${parsed.whatYouGet?.length || 0} items`)
            console.log(`      - Expected results: ${parsed.expectedResults?.length || 0} items`)
            console.log(`      - Variations: ${parsed.variations?.length || 0} items`)
            
            // Prepare update data
            const updateData: any = {}
            
            // Update steps_data if needed
            if (!hasStepContent && parsed.stepsData && parsed.stepsData.length > 0) {
              updateData.steps_data = parsed.stepsData
              console.log(`   ✨ Will update steps_data with ${parsed.stepsData.length} steps`)
              
              // Log first step content preview
              if (parsed.stepsData[0]?.content) {
                console.log(`   📝 Step 1 content preview: ${parsed.stepsData[0].content.substring(0, 100)}...`)
              }
            }
            
            // Update info sections if needed
            if (!hasInfoSections) {
              if (parsed.howToUse && parsed.howToUse.length > 0) {
                updateData.how_to_use = parsed.howToUse
              }
              if (parsed.whatYouGet && parsed.whatYouGet.length > 0) {
                updateData.what_you_get = parsed.whatYouGet
              }
              if (parsed.expectedResults && parsed.expectedResults.length > 0) {
                updateData.expected_results = parsed.expectedResults
              }
              if (parsed.variations && parsed.variations.length > 0) {
                updateData.variations = parsed.variations
              }
            }
            
            // Update workflow overview and what you create
            if (parsed.workflowOverview) {
              updateData.workflow_overview = parsed.workflowOverview
            }
            if (parsed.whatYouCreate) {
              updateData.what_you_create = parsed.whatYouCreate
            }
            
            // Apply updates if we have any
            if (Object.keys(updateData).length > 0) {
              const { error: updateError } = await supabase
                .from('prompts')
                .update(updateData)
                .eq('id', prompt.id)
              
              if (updateError) {
                console.error(`   ❌ Error updating: ${updateError.message}`)
              } else {
                updatedCount++
                console.log(`   ✅ Updated successfully with ${Object.keys(updateData).length} fields`)
              }
            } else {
              console.log(`   ℹ️  No updates needed`)
            }
          } else {
            console.log(`   ⚠️  Failed to parse markdown file`)
          }
        } else {
          console.log(`   ❌ No markdown file found`)
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`❌ Error processing "${prompt.title}":`, error)
      }
    }
    
    console.log(`\n🎉 Update completed!`)
    console.log(`   Total multi-step prompts: ${multiStepPrompts.length}`)
    console.log(`   Needed updates: ${needsUpdateCount}`)
    console.log(`   Successfully updated: ${updatedCount}`)
    console.log(`   Failed: ${needsUpdateCount - updatedCount}`)
    
    // Verify the updates
    console.log(`\n🔍 Verifying updates...`)
    const { data: verifyData, error: verifyError } = await supabase
      .from('prompts')
      .select('title, steps_data')
      .eq('workflow_type', 'multi-step')
      .limit(3)
    
    if (!verifyError && verifyData) {
      for (const prompt of verifyData) {
        const hasContent = prompt.steps_data && 
          Array.isArray(prompt.steps_data) && 
          prompt.steps_data.length > 0 &&
          prompt.steps_data.some((step: any) => step.content && step.content.length > 0)
        
        console.log(`   ${hasContent ? '✅' : '❌'} ${prompt.title}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Update process failed:', error)
    process.exit(1)
  }
}

// Run the update
async function main() {
  try {
    await updateMultiStepPrompts()
  } catch (error) {
    console.error('Update failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}