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

async function checkMarkdownVsDb() {
  console.log('🔍 Comparing markdown files with database content...')
  
  try {
    // Get a sample of empty content prompts from DB
    const { data: emptyPrompts, error: dbError } = await supabase
      .from('prompts')
      .select('title, content, steps_data, slug')
      .or('content.is.null,content.eq.')
      .limit(3)
    
    if (dbError) {
      console.error('❌ Error fetching prompts:', dbError)
      return
    }
    
    console.log(`\n📋 Found ${emptyPrompts?.length} empty prompts in DB`)
    
    if (emptyPrompts && emptyPrompts.length > 0) {
      for (const prompt of emptyPrompts) {
        console.log(`\n🔍 Checking: "${prompt.title}"`)
        console.log(`   DB Content: ${prompt.content || 'EMPTY'}`)
        console.log(`   DB Steps Data: ${prompt.steps_data ? JSON.stringify(prompt.steps_data).substring(0, 100) + '...' : 'EMPTY'}`)
        
        // Try to find corresponding markdown file
        const promptVaultPath = path.join(process.cwd(), '../docs/prompt-vault')
        const searchTitle = prompt.title.replace(/[🟡🟢]/g, '').trim()
        
        // Search for markdown file with similar name
        const findMarkdownFile = (dir: string, targetTitle: string): string | null => {
          try {
            const files = fs.readdirSync(dir, { withFileTypes: true })
            
            for (const file of files) {
              if (file.isDirectory()) {
                const result = findMarkdownFile(path.join(dir, file.name), targetTitle)
                if (result) return result
              } else if (file.name.endsWith('.md')) {
                const content = fs.readFileSync(path.join(dir, file.name), 'utf-8')
                if (content.includes(`title: "${targetTitle}"`) || 
                    content.includes(`title: ${targetTitle}`) ||
                    content.includes(targetTitle)) {
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
          console.log(`   📄 Found markdown: ${path.relative(process.cwd(), markdownFile)}`)
          
          try {
            const markdownContent = fs.readFileSync(markdownFile, 'utf-8')
            
            // Extract title from frontmatter
            const titleMatch = markdownContent.match(/title:\s*"?([^"\n]+)"?/)
            
            // Extract single prompt content
            const singlePromptMatch = markdownContent.match(/## Single Prompt\n\n```\n([\s\S]*?)\n```/)
            
            // Check for steps
            const stepsMatch = markdownContent.match(/## Steps\n\n([\s\S]*?)(?=\n##|\n---|\n$)/)
            
            console.log(`   📝 Markdown title: ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`)
            
            if (singlePromptMatch) {
              console.log(`   ✅ Single prompt found (${singlePromptMatch[1].length} chars)`)
              console.log(`   Content preview: ${singlePromptMatch[1].substring(0, 100)}...`)
            } else {
              console.log(`   ❌ No single prompt section found`)
            }
            
            if (stepsMatch) {
              console.log(`   📋 Steps section found`)
            } else {
              console.log(`   ❌ No steps section found`)
            }
            
          } catch (error) {
            console.log(`   ❌ Error reading markdown: ${error}`)
          }
        } else {
          console.log(`   ❌ No markdown file found for "${searchTitle}"`)
        }
      }
    }
    
    // Also check if there are any markdown files that weren't imported
    console.log(`\n📁 Checking markdown files structure...`)
    const promptVaultPath = path.join(process.cwd(), '../docs/prompt-vault')
    
    if (fs.existsSync(promptVaultPath)) {
      const countMarkdownFiles = (dir: string): number => {
        let count = 0
        try {
          const files = fs.readdirSync(dir, { withFileTypes: true })
          for (const file of files) {
            if (file.isDirectory()) {
              count += countMarkdownFiles(path.join(dir, file.name))
            } else if (file.name.endsWith('.md')) {
              count++
            }
          }
        } catch (error) {
          console.log(`Error reading directory ${dir}:`, error)
        }
        return count
      }
      
      const totalMarkdownFiles = countMarkdownFiles(promptVaultPath)
      console.log(`   Total markdown files: ${totalMarkdownFiles}`)
      
      // Compare with DB count
      const { count: dbCount } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
      
      console.log(`   Total DB prompts: ${dbCount}`)
      console.log(`   Difference: ${totalMarkdownFiles - (dbCount || 0)}`)
    } else {
      console.log(`   ❌ Prompt vault directory not found: ${promptVaultPath}`)
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error)
  }
}

// Run the check
checkMarkdownVsDb()