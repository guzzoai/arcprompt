import path from 'path'
import { MarkdownParser } from '../lib/markdown-parser'

// Test the parser on specific files to verify unique content extraction
function testParser() {
  console.log('🧪 Testing markdown parser for unique content extraction...')
  
  // Test Instagram Story Builder
  console.log('\n📱 Testing Instagram Story Builder:')
  const instagramFile = path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', 'instagram-story-sequence-builder.md')
  const instagramParsed = MarkdownParser.parseMarkdownFile(instagramFile)
  
  if (instagramParsed) {
    console.log(`✅ Successfully parsed: ${instagramParsed.title}`)
    console.log(`📋 How to use: ${instagramParsed.howToUse.length} items`)
    instagramParsed.howToUse.forEach((item, i) => console.log(`   ${i + 1}. ${item}`))
    
    console.log(`🎯 What you get: ${instagramParsed.whatYouGet.length} items`)
    instagramParsed.whatYouGet.forEach((item, i) => console.log(`   ✅ ${item}`))
    
    console.log(`📊 Expected results: ${instagramParsed.expectedResults.length} items`)
    instagramParsed.expectedResults.forEach((item, i) => console.log(`   - ${item}`))
    
    console.log(`🔄 Variations: ${instagramParsed.variations.length} items`)
    instagramParsed.variations.forEach((item, i) => console.log(`   🔄 ${item}`))
  } else {
    console.log('❌ Failed to parse Instagram Story Builder')
  }
  
  // Test Facebook Post Optimizer
  console.log('\n📘 Testing Facebook Post Optimizer:')
  const facebookFile = path.join(process.cwd(), '..', 'docs', 'prompt-vault', '01-social-media', 'content-creation', 'facebook-post-optimizer.md')
  const facebookParsed = MarkdownParser.parseMarkdownFile(facebookFile)
  
  if (facebookParsed) {
    console.log(`✅ Successfully parsed: ${facebookParsed.title}`)
    console.log(`📋 How to use: ${facebookParsed.howToUse.length} items`)
    facebookParsed.howToUse.forEach((item, i) => console.log(`   ${i + 1}. ${item}`))
    
    console.log(`🎯 What you get: ${facebookParsed.whatYouGet.length} items`)
    facebookParsed.whatYouGet.forEach((item, i) => console.log(`   ✅ ${item}`))
    
    console.log(`📊 Expected results: ${facebookParsed.expectedResults.length} items`)
    facebookParsed.expectedResults.forEach((item, i) => console.log(`   - ${item}`))
    
    console.log(`🔄 Variations: ${facebookParsed.variations.length} items`)
    facebookParsed.variations.forEach((item, i) => console.log(`   🔄 ${item}`))
  } else {
    console.log('❌ Failed to parse Facebook Post Optimizer')
  }
}

testParser()