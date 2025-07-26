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
  const promptPatterns = [
    /## 📋 COPY & PASTE PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /##\s*📋\s*COPY\s*&\s*PASTE\s*PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /## 📋 \*\*COPY & PASTE PROMPT\*\*\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /## COPY & PASTE PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
    /##\s*📋.*COPY.*PASTE.*PROMPT.*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/i,
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

async function fixViralThread() {
  console.log('🔧 Fixing viral thread prompt...')
  
  try {
    // Get the viral thread prompt from DB
    const { data: viralThreadPrompt, error: dbError } = await supabase
      .from('prompts')
      .select('id, title, content')
      .ilike('title', '%viral%thread%')
      .single()
    
    if (dbError) {
      console.error('❌ Error fetching prompt:', dbError)
      return
    }
    
    console.log(`\n📋 Found prompt: "${viralThreadPrompt.title}"`)
    
    // Read the markdown file directly
    const markdownFile = path.join(process.cwd(), '../docs/prompt-vault/01-social-media/content-creation/viral-thread-generator.md')
    const markdownContent = fs.readFileSync(markdownFile, 'utf-8')
    
    const extractedContent = extractContentFromMarkdown(markdownContent)
    
    if (extractedContent) {
      console.log(`✅ Extracted content (${extractedContent.length} chars)`)
      
      const { error: updateError } = await supabase
        .from('prompts')
        .update({ content: extractedContent })
        .eq('id', viralThreadPrompt.id)
      
      if (updateError) {
        console.error(`❌ Error updating: ${updateError.message}`)
      } else {
        console.log('✅ Updated successfully!')
      }
    } else {
      console.log('❌ No content extracted')
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixViralThread()