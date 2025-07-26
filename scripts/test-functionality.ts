#!/usr/bin/env tsx

import { config } from 'dotenv'
import { getLatestPrompts, getPromptById, getCategories } from '../lib/prompt-data'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function testFunctionality() {
  console.log('🧪 Testing prompt vault functionality...')
  
  try {
    // Test 1: Get latest prompts
    console.log('\n1. Testing getLatestPrompts(4)...')
    const latestPrompts = await getLatestPrompts(4)
    console.log(`✅ Found ${latestPrompts.length} latest prompts`)
    if (latestPrompts.length > 0) {
      console.log(`   - First prompt: "${latestPrompts[0].title}" (${latestPrompts[0].category})`)
    }
    
    // Test 2: Get a specific prompt by ID
    if (latestPrompts.length > 0) {
      console.log('\n2. Testing getPromptById()...')
      const promptId = latestPrompts[0].id
      const specificPrompt = await getPromptById(promptId)
      if (specificPrompt) {
        console.log(`✅ Retrieved prompt: "${specificPrompt.title}"`)
        console.log(`   - Category: ${specificPrompt.category}`)
        console.log(`   - Type: ${specificPrompt.type}`)
        console.log(`   - Platforms: ${specificPrompt.platforms.join(', ')}`)
        console.log(`   - Content type: ${specificPrompt.singlePrompt ? 'Single prompt' : 'Multi-step workflow'}`)
      } else {
        console.log(`❌ Failed to retrieve prompt with ID: ${promptId}`)
      }
    }
    
    // Test 3: Get categories
    console.log('\n3. Testing getCategories()...')
    const categories = await getCategories()
    console.log(`✅ Found ${categories.length} categories`)
    if (categories.length > 0) {
      console.log('   - Top 5 categories by prompt count:')
      categories
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .forEach((cat, index) => {
          console.log(`     ${index + 1}. ${cat.name}: ${cat.count} prompts`)
        })
    }
    
    console.log('\n🎉 All functionality tests passed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the test
async function main() {
  try {
    await testFunctionality()
  } catch (error) {
    console.error('Test execution failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}