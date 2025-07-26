import path from 'path'
import fs from 'fs'

// Debug the parser patterns
function debugParser() {
  console.log('🔍 Debugging markdown parser patterns...')
  
  const testFile = path.join(process.cwd(), '..', 'docs', 'prompt-vault', '06-core-methods', 'prompting-techniques', 'advanced-prompt-engineering-mastery.md')
  const content = fs.readFileSync(testFile, 'utf-8')
  
  console.log('📄 File length:', content.length)
  
  // Test specific patterns with correct format
  console.log('\n🔍 Testing "HOW TO USE THIS PROMPT" pattern:')
  const howToUsePattern = /## 💡 HOW TO USE THIS PROMPT\n\n([\s\S]*?)(?=\n---|(?=\n##)|$)/i
  const howToUseMatch = content.match(howToUsePattern)
  if (howToUseMatch) {
    console.log('✅ Found HOW TO USE section:')
    console.log(howToUseMatch[1].substring(0, 300) + '...')
    
    // Test item extraction from this section
    const section = howToUseMatch[1]
    const items = section.match(/^\d+\.\s*\*\*(.*?)\*\*.*?$/gm)
    console.log('🔍 Items found:', items)
  } else {
    console.log('❌ HOW TO USE pattern not found')
    // Let's try a simpler pattern
    const simplePattern = /## 💡 HOW TO USE THIS PROMPT\n\n([\s\S]*?)(?=\n##)/i
    const simpleMatch = content.match(simplePattern)
    if (simpleMatch) {
      console.log('✅ Found with simple pattern, content length:', simpleMatch[1].length)
    }
  }
  
  console.log('\n🔍 Testing "WHAT YOU\'LL GET" pattern:')
  const whatYouGetPattern = /## 🎯 WHAT YOU'LL GET\n\n([\s\S]*?)(?=\n---|(?=\n##)|$)/i
  const whatYouGetMatch = content.match(whatYouGetPattern)
  if (whatYouGetMatch) {
    console.log('✅ Found WHAT YOU\'LL GET section:')
    console.log(whatYouGetMatch[1].substring(0, 300) + '...')
    
    // Test item extraction
    const section = whatYouGetMatch[1]
    const items = section.match(/✅\s*\*\*(.*?)\*\*/gm)
    console.log('🔍 Items found:', items)
  } else {
    console.log('❌ WHAT YOU\'LL GET pattern not found')
  }
}

debugParser()