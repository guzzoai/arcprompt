import { config } from 'dotenv'
import { getPromptById } from '../lib/prompt-data'

config({ path: '.env.local' })

async function testDataFlow() {
  console.log('🧪 Testing data flow from database to UI...')
  
  const prompt = await getPromptById('advanced-prompt-engineering-mastery')
  
  if (prompt) {
    console.log(`✅ Retrieved: ${prompt.title}`)
    console.log(`📋 How to use: ${prompt.howToUse.length} items`)
    console.log(`🎯 What you get: ${prompt.whatYouGet.length} items`)
    console.log(`📊 Expected results: ${prompt.expectedResults.length} items`)
    console.log(`🔄 Variations: ${prompt.variations.length} items`)
    
    if (prompt.howToUse.length > 0) {
      console.log('\n📋 Sample "How to use" items:')
      prompt.howToUse.slice(0, 2).forEach((item, i) => {
        console.log(`   ${i + 1}. ${item}`)
      })
    }
    
    if (prompt.whatYouGet.length > 0) {
      console.log('\n🎯 Sample "What you get" items:')
      prompt.whatYouGet.slice(0, 2).forEach((item, i) => {
        console.log(`   ✅ ${item}`)
      })
    }
  } else {
    console.log('❌ Prompt not found')
  }
}

testDataFlow()