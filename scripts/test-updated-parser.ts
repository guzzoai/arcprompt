#!/usr/bin/env tsx

import { MarkdownParser } from '../lib/markdown-parser'
import path from 'path'

async function testUpdatedParser() {
  console.log('🧪 Testing updated markdown parser...')
  
  try {
    // Test with a specific markdown file
    const testFile = path.join(process.cwd(), '../docs/prompt-vault/01-social-media/analytics-growth/competitor-growth-analysis.md')
    
    console.log(`\n📄 Testing file: ${testFile}`)
    
    const result = MarkdownParser.parseMarkdownFile(testFile)
    
    if (result) {
      console.log('\n✅ Parsing successful!')
      console.log(`   Title: ${result.title}`)
      console.log(`   Category: ${result.category}`)
      console.log(`   Complexity: ${result.complexity}`)
      console.log(`   Type: ${result.type}`)
      console.log(`   Short Description: ${result.shortDescription?.substring(0, 100)}...`)
      console.log(`   Single Prompt: ${result.singlePrompt ? `Found (${result.singlePrompt.length} chars)` : 'NOT FOUND'}`)
      console.log(`   Steps: ${result.stepsData?.length || 0}`)
      console.log(`   How to Use: ${result.howToUse?.length || 0} items`)
      console.log(`   What You Get: ${result.whatYouGet?.length || 0} items`)
      
      if (result.singlePrompt) {
        console.log(`\n📝 Content preview:`)
        console.log(result.singlePrompt.substring(0, 200) + '...')
      }
      
      if (result.howToUse && result.howToUse.length > 0) {
        console.log(`\n💡 How to Use (first 3):`)
        result.howToUse.slice(0, 3).forEach((item, index) => {
          console.log(`  ${index + 1}. ${item}`)
        })
      }
      
    } else {
      console.log('❌ Parsing failed - no result returned')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testUpdatedParser()