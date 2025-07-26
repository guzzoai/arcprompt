#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function extractContentFromMarkdown(content: string): string | null {
  // Try different patterns to handle various whitespace and formatting
  const promptPatterns = [
    // Original COPY & PASTE PROMPT patterns
    /## 📋 COPY & PASTE PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /##\s*📋\s*COPY\s*&\s*PASTE\s*PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /## 📋 \*\*COPY & PASTE PROMPT\*\*\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /## COPY & PASTE PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /##\s*📋.*COPY.*PASTE.*PROMPT.*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/i,
    
    // New patterns for singles directory format
    /## 🎯 \*\*PROMPT\*\*\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /##\s*🎯\s*\*\*PROMPT\*\*\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /## 🎯 PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /##\s*🎯.*PROMPT.*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/i
  ]
  
  for (const pattern of promptPatterns) {
    const match = content.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }
  
  return null
}

function extractShortDescription(content: string): string | null {
  const match = content.match(/\*\*Short Description\*\*:\s*(.+)/i)
  return match ? match[1].trim() : null
}

async function updateEmptyPrompts() {
  console.log('🔧 Updating empty prompts with content from markdown files...')
  
  try {
    // Get prompts with empty content
    const { data: emptyPrompts, error: fetchError } = await supabase
      .from('prompts')
      .select('id, title, slug, content')
      .or('content.is.null,content.eq.')
      .limit(50) // Process in batches
    
    if (fetchError) {
      console.error('❌ Error fetching empty prompts:', fetchError)
      return
    }
    
    console.log(`\n📋 Found ${emptyPrompts?.length || 0} empty prompts to update`)
    
    if (!emptyPrompts || emptyPrompts.length === 0) {
      console.log('🎉 No empty prompts found!')
      return
    }
    
    const promptVaultPath = path.join(process.cwd(), '../docs/prompt-vault')
    let updatedCount = 0
    
    for (const prompt of emptyPrompts) {
      try {
        console.log(`\n🔍 Processing: "${prompt.title}"`)
        
        // Search for markdown file
        const searchTitle = prompt.title.replace(/[🟡🟢]/g, '').trim()
        
        const findMarkdownFile = (dir: string, targetTitle: string): string | null => {
          try {
            const files = fs.readdirSync(dir, { withFileTypes: true })
            
            for (const file of files) {
              if (file.isDirectory()) {
                const result = findMarkdownFile(path.join(dir, file.name), targetTitle)
                if (result) return result
              } else if (file.name.endsWith('.md')) {
                const content = fs.readFileSync(path.join(dir, file.name), 'utf-8')
                // Check if this file contains our prompt
                if (content.includes(targetTitle) || 
                    path.basename(file.name, '.md').includes(targetTitle.toLowerCase().replace(/\s+/g, '-'))) {
                  return path.join(dir, file.name)
                }
              }
            }
          } catch (error) {
            // Directory might not exist
          }
          return null
        }
        
        const markdownFile = findMarkdownFile(promptVaultPath, searchTitle)
        
        if (markdownFile) {
          console.log(`   📄 Found markdown file: ${path.basename(markdownFile)}`)
          
          const markdownContent = fs.readFileSync(markdownFile, 'utf-8')
          const extractedContent = extractContentFromMarkdown(markdownContent)
          const shortDescription = extractShortDescription(markdownContent)
          
          if (extractedContent) {
            console.log(`   ✅ Extracted content (${extractedContent.length} chars)`)
            
            const updateData: any = {
              content: extractedContent
            }
            
            // Also update short description if it's missing
            if (shortDescription) {
              updateData.short_description = shortDescription
            }
            
            const { error: updateError } = await supabase
              .from('prompts')
              .update(updateData)
              .eq('id', prompt.id)
            
            if (updateError) {
              console.error(`   ❌ Error updating: ${updateError.message}`)
            } else {
              updatedCount++
              console.log(`   ✅ Updated successfully`)
            }
          } else {
            console.log(`   ⚠️  No content found in markdown`)
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
    console.log(`   Updated: ${updatedCount} prompts`)
    console.log(`   Failed: ${(emptyPrompts?.length || 0) - updatedCount} prompts`)
    
    // Check remaining empty prompts
    const { data: remainingEmpty, error: checkError } = await supabase
      .from('prompts')
      .select('id')
      .or('content.is.null,content.eq.')
    
    if (!checkError) {
      console.log(`   Remaining empty: ${remainingEmpty?.length || 0} prompts`)
    }
    
  } catch (error) {
    console.error('❌ Update process failed:', error)
    process.exit(1)
  }
}

// Run the update
async function main() {
  try {
    await updateEmptyPrompts()
  } catch (error) {
    console.error('Update failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}