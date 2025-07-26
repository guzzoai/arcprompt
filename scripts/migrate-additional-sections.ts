import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'
import { MarkdownParser } from '../lib/markdown-parser'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runDryRunMigration() {
  console.log('🧪 DRY-RUN MIGRATION - No database changes will be made')
  console.log('====================================================\n')
  
  // Get all prompts without trying to access additional_sections column
  const { data: prompts, error: fetchError } = await supabase
    .from('prompts')
    .select('slug, title')
    .limit(10) // Limit for demonstration
  
  if (fetchError) {
    throw fetchError
  }
  
  console.log(`📋 Processing ${prompts?.length || 0} prompts (showing first 10 for demo)...\n`)
  
  let demoCount = 0
  let sectionsFoundCount = 0
  
  for (const prompt of prompts || []) {
    demoCount++
    console.log(`\n${demoCount}. 🔍 ${prompt.title}`)
    
    // Try to find corresponding markdown file
    const possiblePaths = [
      path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', `${prompt.slug}.md`),
      path.join(process.cwd(), '..', 'docs', 'prompt-vault', '02-business-strategy', `${prompt.slug}.md`),
      path.join(process.cwd(), '..', 'docs', 'prompt-vault', '03-content-creation', `${prompt.slug}.md`),
    ]
    
    let parsed = null
    for (const filePath of possiblePaths) {
      try {
        if (require('fs').existsSync(filePath)) {
          parsed = MarkdownParser.parseMarkdownFile(filePath)
          break
        }
      } catch (error) {
        // Continue trying other paths
      }
    }
    
    if (parsed) {
      const additionalCount = Object.keys(parsed.additionalSections).length
      console.log(`   📈 Additional sections found: ${additionalCount}`)
      
      if (additionalCount > 0) {
        sectionsFoundCount++
        // Show first 2 section titles
        const sampleTitles = Object.values(parsed.additionalSections)
          .slice(0, 2)
          .map(section => `"${section.title}"`)
        console.log(`   💡 Sample sections: ${sampleTitles.join(', ')}`)
      } else {
        console.log(`   📋 Basic sections only`)
      }
    } else {
      console.log(`   ⚠️  Markdown file not found`)
    }
  }
  
  console.log(`\n✨ Dry-run Summary:`)
  console.log(`📊 Prompts processed: ${demoCount}`)
  console.log(`📈 Prompts with additional sections: ${sectionsFoundCount}`)
  console.log(`📋 Prompts with basic sections only: ${demoCount - sectionsFoundCount}`)
  
  console.log('\n🚀 Next Steps:')
  console.log('1. Add the additional_sections JSONB column using the SQL above')
  console.log('2. Run this script again to perform the actual migration')
  console.log('3. All prompts will be populated with their additional sections')
}

async function migrateAdditionalSections() {
  console.log('🔄 Migrating additional sections for all prompts...\n')
  
  try {
    // First, check if the column exists
    let columnExists = false
    try {
      const { data: testData, error: testError } = await supabase
        .from('prompts')
        .select('additional_sections')
        .limit(1)
      
      if (testError) {
        throw testError
      }
      columnExists = true
    } catch (testError: any) {
      if (testError?.code === '42703' && testError?.message?.includes('column "additional_sections" does not exist')) {
        console.log('❌ The additional_sections column does not exist in the database yet.')
        console.log('📋 SQL Command needed:')
        console.log('')
        console.log('ALTER TABLE prompts ADD COLUMN additional_sections JSONB DEFAULT \'{}\';')
        console.log('')
        console.log('🔄 Running dry-run migration to show what would be processed...')
        console.log('')
        
        // Continue with dry-run to show what would be migrated
        await runDryRunMigration()
        return
      } else {
        console.error('❌ Unexpected database error:', testError)
        return
      }
    }
    
    console.log('✅ additional_sections column exists')
    
    // Get all prompts
    const { data: prompts, error: fetchError } = await supabase
      .from('prompts')
      .select('slug, title')
    
    if (fetchError) {
      throw fetchError
    }
    
    console.log(`📋 Found ${prompts?.length || 0} prompts to process`)
    
    let successCount = 0
    let errorCount = 0
    let skipCount = 0
    
    for (const prompt of prompts || []) {
      try {
        console.log(`\n🔍 Processing: ${prompt.title} (${prompt.slug})`)
        
        // Try to find the markdown file by searching in common directories
        const possiblePaths = [
          path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', `${prompt.slug}.md`),
          path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'advertising', `${prompt.slug}.md`),
          path.join(process.cwd(), '..', 'docs', 'prompt-vault', '02-business-strategy', `${prompt.slug}.md`),
          path.join(process.cwd(), '..', 'docs', 'prompt-vault', '03-content-creation', `${prompt.slug}.md`),
          path.join(process.cwd(), '..', 'docs', 'prompt-vault', '04-advertising', `${prompt.slug}.md`),
          path.join(process.cwd(), '..', 'docs', 'prompt-vault', '05-automation', `${prompt.slug}.md`),
          path.join(process.cwd(), '..', 'docs', 'prompt-vault', '06-core-methods', `${prompt.slug}.md`),
        ]
        
        let filePath = ''
        for (const possiblePath of possiblePaths) {
          try {
            if (fs.existsSync(possiblePath)) {
              filePath = possiblePath
              break
            }
          } catch (error) {
            // Continue trying other paths
          }
        }
        
        if (!filePath) {
          console.log(`   ⚠️  Skipping: Markdown file not found`)
          skipCount++
          continue
        }
        
        // Parse the markdown file
        const parsed = MarkdownParser.parseMarkdownFile(filePath)
        
        if (!parsed) {
          console.log(`   ❌ Failed to parse markdown file`)
          errorCount++
          continue
        }
        
        const additionalSectionsCount = Object.keys(parsed.additionalSections).length
        console.log(`   📈 Found ${additionalSectionsCount} additional sections`)
        
        if (additionalSectionsCount === 0) {
          console.log(`   📋 No additional sections to update`)
          
          // Still update with empty object to mark as processed
          const { error: updateError } = await supabase
            .from('prompts')
            .update({ additional_sections: {} })
            .eq('slug', prompt.slug)
          
          if (updateError) {
            console.log(`   ❌ Update error:`, updateError.message)
            errorCount++
          } else {
            console.log(`   ✅ Updated with empty additional sections`)
            successCount++
          }
          continue
        }
        
        // Update the database
        const { error: updateError } = await supabase
          .from('prompts')
          .update({ additional_sections: parsed.additionalSections })
          .eq('slug', prompt.slug)
        
        if (updateError) {
          console.log(`   ❌ Update error:`, updateError.message)
          errorCount++
        } else {
          console.log(`   ✅ Successfully updated additional sections`)
          successCount++
          
          // Show sample titles
          const sampleTitles = Object.values(parsed.additionalSections)
            .slice(0, 2)
            .map(section => `"${section.title}"`)
          if (sampleTitles.length > 0) {
            console.log(`      Sample sections: ${sampleTitles.join(', ')}`)
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Processing error:`, error)
        errorCount++
      }
      
      // Add small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n✨ Migration Summary:')
    console.log(`📊 Total prompts: ${prompts?.length || 0}`)
    console.log(`✅ Successfully updated: ${successCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log(`⚠️  Skipped: ${skipCount}`)
    
    if (successCount > 0) {
      console.log('\n🎉 Migration completed successfully!')
      console.log('📈 Additional sections are now available in the database.')
    }
    
  } catch (error: any) {
    if (error?.code === '42703' && error?.message?.includes('column "additional_sections" does not exist')) {
      console.log('❌ The additional_sections column does not exist in the database yet.')
      console.log('📋 SQL Command needed:')
      console.log('')
      console.log('ALTER TABLE prompts ADD COLUMN additional_sections JSONB DEFAULT \'{}\';')
      console.log('')
      console.log('🔄 Running dry-run migration to show what would be processed...')
      console.log('')
      
      // Continue with dry-run to show what would be migrated
      await runDryRunMigration()
    } else {
      console.error('❌ Migration failed:', error)
    }
  }
}

migrateAdditionalSections()