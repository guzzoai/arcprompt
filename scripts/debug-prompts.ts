#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Use environment variables directly for testing
const supabaseUrl = 'https://swpwvjndoltaiwvkxsmk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cHd2am5kb2x0YWl3dmt4c21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDA3MTcsImV4cCI6MjA2ODQxNjcxN30.jN5CKCxAcD7yW7danXEgNduUfzCxaoJz10dd5eZLiKc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugPrompts() {
  console.log('🔍 Debugging prompt vault...')
  
  try {
    // Test basic connection
    console.log('\n1. Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('prompts')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection failed:', testError)
      return
    }
    console.log('✅ Database connection successful')
    
    // Count total prompts
    console.log('\n2. Counting total prompts...')
    const { count, error: countError } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Error counting prompts:', countError)
      return
    }
    console.log(`✅ Total prompts in database: ${count}`)
    
    // Check published prompts
    console.log('\n3. Checking published prompts...')
    const { count: publishedCount, error: publishedError } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
    
    if (publishedError) {
      console.error('❌ Error counting published prompts:', publishedError)
      return
    }
    console.log(`✅ Published prompts: ${publishedCount}`)
    
    // Get sample prompts with categories
    console.log('\n4. Testing prompt query with categories...')
    const { data: samplePrompts, error: sampleError } = await supabase
      .from('prompts')
      .select(`
        id,
        title,
        short_description,
        category_id,
        categories (
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .limit(3)
    
    if (sampleError) {
      console.error('❌ Error fetching sample prompts:', sampleError)
      return
    }
    
    console.log(`✅ Sample prompts (${samplePrompts?.length || 0} found):`)
    samplePrompts?.forEach((prompt, index) => {
      console.log(`  ${index + 1}. "${prompt.title}"`)
      console.log(`     Category: ${prompt.categories?.name || 'None'}`)
      console.log(`     Description: ${prompt.short_description?.substring(0, 50) || 'No description'}...`)
      console.log()
    })
    
    // Test the exact query from getPrompts function
    console.log('\n5. Testing getPrompts() query...')
    const { data: getPromptsTest, error: getPromptsError } = await supabase
      .from('prompts')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(0, 19)
    
    if (getPromptsError) {
      console.error('❌ Error with getPrompts query:', getPromptsError)
      return
    }
    
    console.log(`✅ getPrompts() query returned ${getPromptsTest?.length || 0} prompts`)
    
    console.log('\n🎉 Debug completed successfully!')
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

// Run the debug
debugPrompts()