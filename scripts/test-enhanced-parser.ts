import { config } from 'dotenv'
import path from 'path'
import { MarkdownParser } from '../lib/markdown-parser'

config({ path: '.env.local' })

async function testEnhancedParser() {
  console.log('🔍 Testing enhanced parser on Facebook Post Optimizer...\n')
  
  // Parse the Facebook Post Optimizer file
  const testFile = path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', 'facebook-post-optimizer.md')
  const parsed = MarkdownParser.parseMarkdownFile(testFile)
  
  if (!parsed) {
    console.error('❌ Failed to parse file')
    return
  }
  
  console.log(`📋 Parsed prompt: ${parsed.title}`)
  console.log(`   How to use: ${parsed.howToUse.length} items`)
  console.log(`   What you get: ${parsed.whatYouGet.length} items`)
  console.log(`   Expected results: ${parsed.expectedResults.length} items`)
  console.log(`   Variations: ${parsed.variations.length} items`)
  
  // Show additional sections
  const additionalCount = Object.keys(parsed.additionalSections).length
  console.log(`   📈 Additional sections: ${additionalCount} found`)
  
  if (additionalCount > 0) {
    console.log('\n🚀 Additional Sections Extracted:')
    
    // Sort by order and display
    const sortedSections = Object.entries(parsed.additionalSections)
      .sort(([, a], [, b]) => a.order - b.order)
    
    for (const [key, section] of sortedSections) {
      console.log(`\n📍 ${section.order}. ${section.title}`)
      console.log(`   Key: "${key}"`)
      console.log(`   Content length: ${section.content.length} chars`)
      
      // Show first few lines of content
      const lines = section.content.split('\n').slice(0, 3)
      console.log('   Preview:')
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`     ${line.trim().substring(0, 60)}${line.length > 60 ? '...' : ''}`)
        }
      })
    }
  }
  
  console.log('\n✨ Summary:')
  console.log(`📊 Total sections found: ${4 + additionalCount}`)
  console.log(`📋 Basic sections: 4 (How to Use, What You Get, Expected Results, Variations)`)
  console.log(`📈 Additional sections: ${additionalCount}`)
  
  if (additionalCount > 0) {
    console.log('\n💡 New sections include valuable content like:')
    const sampleTitles = Object.values(parsed.additionalSections)
      .slice(0, 3)
      .map(section => `"${section.title}"`)
    console.log(`   ${sampleTitles.join(', ')}`)
  }
}

testEnhancedParser()