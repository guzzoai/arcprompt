#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

function extractContentFromMarkdown(content: string): string | null {
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
  
  console.log('🧪 Testing patterns one by one...')
  
  for (let i = 0; i < promptPatterns.length; i++) {
    const pattern = promptPatterns[i]
    const match = content.match(pattern)
    console.log(`Pattern ${i + 1}: ${match ? '✅ MATCH' : '❌ NO MATCH'}`)
    if (match) {
      console.log(`  Content length: ${match[1].length}`)
      return match[1].trim()
    }
  }
  
  return null
}

async function testViralThreadPattern() {
  console.log('🔍 Testing viral thread pattern matching...')
  
  try {
    const testFile = path.join(process.cwd(), '../docs/prompt-vault/01-social-media/content-creation/viral-thread-generator.md')
    const content = fs.readFileSync(testFile, 'utf-8')
    
    console.log('\n📄 File content around COPY & PASTE section:')
    const sectionIndex = content.indexOf('COPY & PASTE PROMPT')
    if (sectionIndex > -1) {
      const contextStart = Math.max(0, sectionIndex - 20)
      const contextEnd = Math.min(content.length, sectionIndex + 100)
      const context = content.substring(contextStart, contextEnd)
      
      console.log('Context:')
      console.log('---')
      console.log(context.replace(/\n/g, '\\n\n'))
      console.log('---')
    }
    
    const extractedContent = extractContentFromMarkdown(content)
    
    if (extractedContent) {
      console.log('\n✅ Final result: SUCCESS')
      console.log(`Content length: ${extractedContent.length} characters`)
      console.log(`Content preview: ${extractedContent.substring(0, 150)}...`)
    } else {
      console.log('\n❌ Final result: FAILED - no content extracted')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testViralThreadPattern()