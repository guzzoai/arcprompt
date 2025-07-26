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

async function checkViralThread() {
  console.log('🔍 Checking viral thread prompt...')
  
  try {
    // Get the viral thread prompt from DB
    const { data: viralThreadPrompt, error: dbError } = await supabase
      .from('prompts')
      .select('*')
      .ilike('title', '%viral%thread%')
      .single()
    
    if (dbError) {
      console.error('❌ Error fetching prompt:', dbError)
      return
    }
    
    console.log('\n📋 Database prompt:')
    console.log(`   Title: "${viralThreadPrompt.title}"`)
    console.log(`   Content: ${viralThreadPrompt.content || 'EMPTY'}`)
    
    // Check the markdown file
    const markdownFile = path.join(process.cwd(), '../docs/prompt-vault/01-social-media/content-creation/viral-thread-generator.md')
    
    if (fs.existsSync(markdownFile)) {
      console.log('\n📄 Markdown file found!')
      const content = fs.readFileSync(markdownFile, 'utf-8')
      
      // Check title in markdown
      const titleMatch = content.match(/# (.+)/m)
      console.log(`   Markdown title: "${titleMatch ? titleMatch[1] : 'NOT FOUND'}"`)
      
      // Check for prompt section
      const promptMatch = content.match(/## 📋 COPY & PASTE PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/)
      if (promptMatch) {
        console.log(`   ✅ Found COPY & PASTE PROMPT section (${promptMatch[1].length} chars)`)
      } else {
        // Try 🎯 pattern
        const targetPromptMatch = content.match(/## 🎯 \*\*PROMPT\*\*\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/)
        if (targetPromptMatch) {
          console.log(`   ✅ Found 🎯 PROMPT section (${targetPromptMatch[1].length} chars)`)
        } else {
          console.log('   ❌ No prompt section found')
        }
      }
    } else {
      console.log('\n❌ Markdown file not found')
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error)
  }
}

checkViralThread()