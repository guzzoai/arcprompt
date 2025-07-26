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

async function fixFailedPrompts() {
  console.log('🔧 Starting to fix failed prompt migrations...')
  
  // Step 1: Fix difficulty_level constraint violations
  console.log('\n1. Fixing difficulty_level constraint violations...')
  
  // Fix "Simple" -> "Beginner"
  const { error: simpleError } = await supabase
    .from('prompts')
    .update({ difficulty_level: 'Beginner' })
    .eq('difficulty_level', 'Simple')
  
  if (simpleError) {
    console.error('Error fixing "Simple" difficulty level:', simpleError)
  } else {
    console.log('✅ Fixed "Simple" -> "Beginner"')
  }
  
  // Fix "Single" -> "Beginner"
  const { error: singleError } = await supabase
    .from('prompts')
    .update({ difficulty_level: 'Beginner' })
    .eq('difficulty_level', 'Single')
  
  if (singleError) {
    console.error('Error fixing "Single" difficulty level:', singleError)
  } else {
    console.log('✅ Fixed "Single" -> "Beginner"')
  }
  
  // Step 2: Check for any remaining invalid difficulty levels
  const { data: invalidDifficulty, error: checkError } = await supabase
    .from('prompts')
    .select('id, title, difficulty_level')
    .not('difficulty_level', 'in', '(Beginner,Intermediate,Advanced,Expert)')
  
  if (checkError) {
    console.error('Error checking difficulty levels:', checkError)
  } else if (invalidDifficulty && invalidDifficulty.length > 0) {
    console.log(`Found ${invalidDifficulty.length} prompts with invalid difficulty levels:`)
    invalidDifficulty.forEach(prompt => {
      console.log(`- ${prompt.title}: ${prompt.difficulty_level}`)
    })
    
    // Fix any remaining invalid values
    const { error: fixRemainingError } = await supabase
      .from('prompts')
      .update({ difficulty_level: 'Beginner' })
      .not('difficulty_level', 'in', '(Beginner,Intermediate,Advanced,Expert)')
    
    if (fixRemainingError) {
      console.error('Error fixing remaining difficulty levels:', fixRemainingError)
    } else {
      console.log('✅ Fixed remaining invalid difficulty levels')
    }
  } else {
    console.log('✅ No invalid difficulty levels found')
  }
  
  // Step 3: Fix duplicate slugs
  console.log('\n2. Fixing duplicate slugs...')
  
  // Find duplicate slugs
  const { data: duplicates, error: duplicateError } = await supabase.rpc('find_duplicate_slugs', {})
  
  if (duplicateError) {
    // If the function doesn't exist, let's check manually
    const { data: allPrompts, error: allPromptsError } = await supabase
      .from('prompts')
      .select('id, slug, title, created_at')
      .not('slug', 'is', null)
      .order('slug')
    
    if (allPromptsError) {
      console.error('Error fetching prompts for duplicate check:', allPromptsError)
      return
    }
    
    // Find duplicates manually
    const slugCounts = new Map<string, any[]>()
    allPrompts?.forEach(prompt => {
      if (!slugCounts.has(prompt.slug)) {
        slugCounts.set(prompt.slug, [])
      }
      slugCounts.get(prompt.slug)!.push(prompt)
    })
    
    const duplicateGroups = Array.from(slugCounts.entries())
      .filter(([_, prompts]) => prompts.length > 1)
    
    if (duplicateGroups.length > 0) {
      console.log(`Found ${duplicateGroups.length} groups of duplicate slugs`)
      
      for (const [slug, prompts] of duplicateGroups) {
        console.log(`Fixing duplicates for slug: ${slug}`)
        
        // Keep the first one (oldest), update the rest
        const [keep, ...toUpdate] = prompts.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        
        for (const [index, prompt] of toUpdate.entries()) {
          const newSlug = `${slug}-${prompt.id.substring(0, 8)}`
          
          const { error: updateError } = await supabase
            .from('prompts')
            .update({ slug: newSlug })
            .eq('id', prompt.id)
          
          if (updateError) {
            console.error(`Error updating slug for prompt ${prompt.id}:`, updateError)
          } else {
            console.log(`✅ Updated ${prompt.title}: ${slug} -> ${newSlug}`)
          }
        }
      }
    } else {
      console.log('✅ No duplicate slugs found')
    }
  }
  
  // Step 4: Verify the fixes
  console.log('\n3. Verifying fixes...')
  
  const { data: finalCheck, error: finalError } = await supabase
    .from('prompts')
    .select('id, title, difficulty_level, slug')
    .not('difficulty_level', 'in', '(Beginner,Intermediate,Advanced,Expert)')
  
  if (finalError) {
    console.error('Error in final verification:', finalError)
  } else {
    console.log(`✅ Remaining invalid difficulty levels: ${finalCheck?.length || 0}`)
  }
  
  console.log('\n🎉 Fix process completed!')
}

// Run the fix
async function main() {
  try {
    await fixFailedPrompts()
  } catch (error) {
    console.error('Fix process failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}