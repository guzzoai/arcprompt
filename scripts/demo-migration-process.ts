import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'
import { MarkdownParser } from '../lib/markdown-parser'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function demoMigrationProcess() {
  console.log('🎯 Demonstrating Migration Process - Additional Sections\n')
  console.log('=====================================================\n')
  
  console.log('📋 Current Status: Database column does not exist yet')
  console.log('🔄 Required SQL: ALTER TABLE prompts ADD COLUMN additional_sections JSONB DEFAULT \'{}\';')
  console.log('')
  
  // Get sample prompts to show what would be migrated
  console.log('🔍 Analyzing prompts to show migration impact...\n')
  
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('slug, title')
    .limit(15)
  
  if (error) {
    console.error('❌ Error fetching prompts:', error)
    return
  }
  
  let processedCount = 0
  let sectionsFoundCount = 0
  let totalAdditionalSections = 0
  
  const sampleResults: Array<{
    title: string
    slug: string
    additionalSections: number
    sampleTitles: string[]
  }> = []
  
  for (const prompt of prompts || []) {
    processedCount++
    
    // Try to find markdown file in various locations
    const possiblePaths = [
      path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', `${prompt.slug}.md`),
      path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'advertising', `${prompt.slug}.md`),
      path.join(process.cwd(), '..', 'docs', 'prompt-vault', '02-business-strategy', `${prompt.slug}.md`),
      path.join(process.cwd(), '..', 'docs', 'prompt-vault', '03-content-creation', `${prompt.slug}.md`),
      path.join(process.cwd(), '..', 'docs', 'prompt-vault', '04-advertising', `${prompt.slug}.md`),
    ]
    
    let parsed = null
    let foundPath = ''
    
    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          parsed = MarkdownParser.parseMarkdownFile(filePath)
          foundPath = filePath
          break
        }
      } catch (error) {
        // Continue trying other paths
      }
    }
    
    if (parsed) {
      const additionalCount = Object.keys(parsed.additionalSections).length
      
      if (additionalCount > 0) {
        sectionsFoundCount++
        totalAdditionalSections += additionalCount
        
        const sampleTitles = Object.values(parsed.additionalSections)
          .slice(0, 3)
          .map(section => section.title)
        
        sampleResults.push({
          title: prompt.title,
          slug: prompt.slug,
          additionalSections: additionalCount,
          sampleTitles
        })
        
        console.log(`✅ ${prompt.title}`)
        console.log(`   📈 ${additionalCount} additional sections found`)
        console.log(`   💡 Examples: ${sampleTitles.slice(0, 2).join(', ')}`)
        console.log(`   📂 Found in: ${path.basename(foundPath)}`)
      } else {
        console.log(`📋 ${prompt.title} - Basic sections only`)
      }
    } else {
      console.log(`⚠️  ${prompt.title} - Markdown file not found`)
    }
    
    console.log('')
  }
  
  // Show detailed results for Facebook Post Optimizer if found
  const facebookResult = sampleResults.find(r => r.slug === 'facebook-post-optimizer')
  if (facebookResult) {
    console.log('🎯 DETAILED EXAMPLE: Facebook Post Optimizer')
    console.log('============================================')
    
    const facebookFile = path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', 'facebook-post-optimizer.md')
    if (fs.existsSync(facebookFile)) {
      const parsed = MarkdownParser.parseMarkdownFile(facebookFile)
      if (parsed) {
        console.log(`📊 Total sections: ${4 + Object.keys(parsed.additionalSections).length}`)
        console.log(`📋 Basic sections: 4 (How to Use, What You Get, Expected Results, Variations)`)
        console.log(`📈 Additional sections: ${Object.keys(parsed.additionalSections).length}`)
        console.log('')
        
        console.log('🚀 Additional Sections to be Added:')
        const sortedSections = Object.entries(parsed.additionalSections)
          .sort(([, a], [, b]) => a.order - b.order)
        
        for (const [key, section] of sortedSections) {
          console.log(`   ${section.order}. ${section.title}`)
          console.log(`      📊 ${section.content.length} characters`)
          console.log(`      🔑 Key: "${key}"`)
        }
      }
    }
    console.log('')
  }
  
  console.log('📊 MIGRATION SUMMARY')
  console.log('===================')
  console.log(`📋 Prompts analyzed: ${processedCount}`)
  console.log(`📈 Prompts with additional sections: ${sectionsFoundCount}`)
  console.log(`📊 Total additional sections found: ${totalAdditionalSections}`)
  console.log(`💡 Average additional sections per enriched prompt: ${sectionsFoundCount > 0 ? (totalAdditionalSections / sectionsFoundCount).toFixed(1) : 0}`)
  
  console.log('\n🎯 IMPLEMENTATION STATUS')
  console.log('========================')
  console.log('✅ Enhanced markdown parser implemented')
  console.log('✅ TypeScript interfaces updated')
  console.log('✅ UI components ready for additional sections')
  console.log('✅ Migration script prepared')
  console.log('⏳ Database column needs to be added')
  
  console.log('\n🚀 FINAL STEPS TO COMPLETE')
  console.log('==========================')
  console.log('1. Run this SQL in Supabase SQL Editor:')
  console.log('   ALTER TABLE prompts ADD COLUMN additional_sections JSONB DEFAULT \'{}\';')
  console.log('')
  console.log('2. Run the migration script:')
  console.log('   npx tsx scripts/migrate-additional-sections.ts')
  console.log('')
  console.log('3. Deploy and test the updated application')
  
  console.log('\n✨ EXPECTED RESULT')
  console.log('==================')
  console.log(`📈 ${sectionsFoundCount} prompts will be enriched with comprehensive additional content`)
  console.log(`📚 ${totalAdditionalSections} additional sections with algorithm insights, templates, and strategies`)
  console.log('🎯 Users will see complete, valuable content from markdown files')
  console.log('📱 Dynamic UI will display sections automatically with proper formatting')
}

demoMigrationProcess()