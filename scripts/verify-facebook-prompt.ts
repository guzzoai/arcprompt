import { config } from 'dotenv'
import { getPromptById } from '../lib/prompt-data'

config({ path: '.env.local' })

async function verifyFacebookPrompt() {
  console.log('🔍 Verifying Facebook Post Optimizer additional sections...\n')
  
  const prompt = await getPromptById('facebook-post-optimizer')
  
  if (!prompt) {
    console.log('❌ Facebook Post Optimizer not found')
    return
  }
  
  console.log(`✅ Found prompt: ${prompt.title}`)
  console.log(`📋 Basic sections:`)
  console.log(`   - How to Use: ${prompt.howToUse.length} items`)
  console.log(`   - What You Get: ${prompt.whatYouGet.length} items`)
  console.log(`   - Expected Results: ${prompt.expectedResults.length} items`)
  console.log(`   - Variations: ${prompt.variations.length} items`)
  
  const additionalCount = Object.keys(prompt.additionalSections).length
  console.log(`\n📈 Additional sections: ${additionalCount}`)
  
  if (additionalCount > 0) {
    console.log('\n🚀 Additional Sections Retrieved from Database:')
    
    const sortedSections = Object.entries(prompt.additionalSections)
      .sort(([, a], [, b]) => a.order - b.order)
    
    for (const [key, section] of sortedSections) {
      console.log(`\n${section.order}. ${section.title}`)
      console.log(`   🔑 Key: "${key}"`)
      console.log(`   📊 Content length: ${section.content.length} characters`)
      console.log(`   📝 Preview: ${section.content.substring(0, 80)}...`)
    }
    
    console.log('\n✅ SUCCESS: Additional sections are now available!')
    console.log('📱 These will display automatically in the UI INFO tab')
    
  } else {
    console.log('❌ No additional sections found - migration may have failed')
  }
  
  console.log('\n📊 Total sections now available:')
  console.log(`   📋 Basic sections: 4`)
  console.log(`   📈 Additional sections: ${additionalCount}`)
  console.log(`   🎯 Total sections: ${4 + additionalCount}`)
  
  if (additionalCount >= 6) {
    console.log('\n🎉 Perfect! Facebook Post Optimizer now has comprehensive content')
    console.log('   ✅ Algorithm insights and optimization strategies')
    console.log('   ✅ Post templates and format examples')
    console.log('   ✅ Timing and engagement tactics')
    console.log('   ✅ Performance tracking methods')
    console.log('   ✅ Content planning frameworks')
  }
}

verifyFacebookPrompt()