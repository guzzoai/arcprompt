#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

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

async function testNewPatterns() {
  console.log('🧪 Testing new extraction patterns...')
  
  try {
    // Test with the community management file
    const testFile = path.join(process.cwd(), '../docs/prompt-vault/01-social-media/singles/community-management-responder.md')
    const content = fs.readFileSync(testFile, 'utf-8')
    
    console.log(`\n📄 Testing file: ${path.basename(testFile)}`)
    
    const extractedContent = extractContentFromMarkdown(content)
    
    if (extractedContent) {
      console.log('✅ Extraction successful!')
      console.log(`   Content length: ${extractedContent.length} characters`)
      console.log(`   Content preview: ${extractedContent.substring(0, 150)}...`)
    } else {
      console.log('❌ Extraction failed - no content found')
      
      // Debug: show what we're looking for
      const promptIndex = content.indexOf('🎯 **PROMPT**')
      if (promptIndex > -1) {
        console.log('\n🔍 Found 🎯 **PROMPT** section at position:', promptIndex)
        const context = content.substring(promptIndex, promptIndex + 200)
        console.log('Context:')
        console.log(context.replace(/\n/g, '\\n\n'))
      }
    }
    
    // Test a few more files from singles directory
    const singlesDir = path.join(process.cwd(), '../docs/prompt-vault/01-social-media/singles')
    const files = fs.readdirSync(singlesDir).filter(f => f.endsWith('.md')).slice(0, 3)
    
    for (const file of files) {
      const filePath = path.join(singlesDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const extracted = extractContentFromMarkdown(fileContent)
      
      console.log(`\n📄 ${file}: ${extracted ? `✅ SUCCESS (${extracted.length} chars)` : '❌ FAILED'}`)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testNewPatterns()