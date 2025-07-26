#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim()
}

function generateShortDescription(content: string, title: string): string {
  if (content && content.length > 50) {
    // Try to extract a meaningful description from the content
    let description = content
      .replace(/^\s*```[\s\S]*?```\s*/g, '') // Remove code blocks
      .replace(/^\s*[#*-]\s*/gm, '') // Remove markdown headers and list markers
      .replace(/\[.*?\]/g, '') // Remove markdown link text
      .trim()
    
    // Take first sentence or first 150 characters
    const firstSentence = description.split('.')[0]
    if (firstSentence && firstSentence.length > 20 && firstSentence.length < 200) {
      return firstSentence + '.'
    }
    
    return description.substring(0, 150) + (description.length > 150 ? '...' : '')
  }
  
  // Fallback to a generic description based on title
  return `Advanced AI prompt for ${title.toLowerCase()} with enhanced capabilities and optimized results.`
}

async function fixMissingData() {
  console.log('🔧 Fixing missing slugs and descriptions...')
  
  try {
    // Get all prompts without slugs or descriptions
    console.log('\n1. Finding prompts with missing data...')
    const { data: promptsToFix, error: fetchError } = await supabase
      .from('prompts')
      .select('id, title, content, slug, short_description, description')
      .or('slug.is.null,short_description.is.null')
    
    if (fetchError) {
      console.error('❌ Error fetching prompts:', fetchError)
      return
    }
    
    console.log(`✅ Found ${promptsToFix?.length || 0} prompts that need fixing`)
    
    if (!promptsToFix || promptsToFix.length === 0) {
      console.log('🎉 All prompts already have slugs and descriptions!')
      return
    }
    
    // Process prompts in batches
    console.log('\n2. Fixing prompts...')
    let fixedCount = 0
    const slugTracker = new Set<string>()
    
    for (const prompt of promptsToFix) {
      try {
        const updates: any = {}
        
        // Generate slug if missing
        if (!prompt.slug) {
          let baseSlug = generateSlug(prompt.title)
          let finalSlug = baseSlug
          let counter = 1
          
          // Ensure uniqueness
          while (slugTracker.has(finalSlug)) {
            finalSlug = `${baseSlug}-${counter}`
            counter++
          }
          
          slugTracker.add(finalSlug)
          updates.slug = finalSlug
        }
        
        // Generate short description if missing
        if (!prompt.short_description) {
          updates.short_description = generateShortDescription(
            prompt.content || prompt.description || '', 
            prompt.title
          )
        }
        
        // Update the prompt if we have changes
        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('prompts')
            .update(updates)
            .eq('id', prompt.id)
          
          if (updateError) {
            console.error(`❌ Error updating prompt "${prompt.title}":`, updateError)
          } else {
            fixedCount++
            console.log(`✅ Fixed: "${prompt.title}" -> slug: ${updates.slug || 'unchanged'}`)
          }
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
    const { data: verifyPrompts, error: verifyError } = await supabase
      .from('prompts')
      .select('id, title, slug, short_description')
      .or('slug.is.null,short_description.is.null')
    
    if (verifyError) {
      console.error('❌ Error verifying fixes:', verifyError)
      return
    }
    
    if (verifyPrompts && verifyPrompts.length === 0) {
      console.log('✅ All prompts now have slugs and descriptions!')
    } else {
      console.log(`⚠️  Still ${verifyPrompts?.length || 0} prompts with missing data`)
    }
    
    // Show sample of fixed prompts
    console.log('\n4. Sample of fixed prompts:')
    const { data: sampleFixed, error: sampleError } = await supabase
      .from('prompts')
      .select('title, slug, short_description')
      .not('slug', 'is', null)
      .not('short_description', 'is', null)
      .limit(5)
    
    if (!sampleError && sampleFixed) {
      sampleFixed.forEach((prompt, index) => {
        console.log(`  ${index + 1}. "${prompt.title}"`)
        console.log(`     Slug: ${prompt.slug}`)
        console.log(`     Description: ${prompt.short_description?.substring(0, 60)}...`)
        console.log()
      })
    }
    
  } catch (error) {
    console.error('❌ Fix process failed:', error)
    process.exit(1)
  }
}

// Run the fix
async function main() {
  try {
    await fixMissingData()
  } catch (error) {
    console.error('Fix process failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}