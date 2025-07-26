#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

async function debugRegex() {
  console.log('🔍 Debugging regex patterns...')
  
  try {
    const testFile = path.join(process.cwd(), '../docs/prompt-vault/01-social-media/analytics-growth/competitor-growth-analysis.md')
    const content = fs.readFileSync(testFile, 'utf-8')
    
    console.log('\n📄 File content around COPY & PASTE PROMPT section:')
    
    // Find the section
    const sectionIndex = content.indexOf('COPY & PASTE PROMPT')
    if (sectionIndex > -1) {
      const contextStart = Math.max(0, sectionIndex - 50)
      const contextEnd = Math.min(content.length, sectionIndex + 300)
      const context = content.substring(contextStart, contextEnd)
      
      console.log('Context:')
      console.log('---')
      console.log(context.replace(/\n/g, '\\n\n'))
      console.log('---')
      
      // Test different patterns
      const patterns = [
        /## 📋 COPY & PASTE PROMPT\n\n```\n([\s\S]*?)\n```/,
        /## 📋 COPY & PASTE PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /##\s*📋\s*COPY\s*&\s*PASTE\s*PROMPT\s*\n\s*\n\s*```\s*\n([\s\S]*?)\n```/,
        /## 📋 COPY & PASTE PROMPT[\s\S]*?```\n([\s\S]*?)\n```/
      ]
      
      console.log('\n🧪 Testing patterns:')
      patterns.forEach((pattern, index) => {
        const match = content.match(pattern)
        console.log(`Pattern ${index + 1}: ${match ? 'MATCH ✅' : 'NO MATCH ❌'}`)
        if (match) {
          console.log(`  Content length: ${match[1].length}`)
          console.log(`  Content preview: ${match[1].substring(0, 100)}...`)
        }
      })
      
    } else {
      console.log('❌ "COPY & PASTE PROMPT" section not found in file')
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

debugRegex()