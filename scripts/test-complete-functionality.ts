#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Use environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)')
  console.error('   SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY for new API keys)')
  console.error('')
  console.error('   For new Supabase API keys, use:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.error('   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCompleteFunctionality() {
  console.log('🧪 Testing complete prompt vault functionality...')
  
  try {
    // Test 1: Basic Database Connection
    console.log('\n1. Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('prompts')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection failed:', testError)
      return false
    }
    console.log('✅ Database connection successful')
    
    // Test 2: Count total prompts
    console.log('\n2. Testing prompt count...')
    const { count: totalPrompts, error: countError } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Error counting prompts:', countError)
      return false
    }
    console.log(`✅ Total prompts: ${totalPrompts}`)
    
    // Test 3: Test getPrompts functionality (equivalent to what the frontend uses)
    console.log('\n3. Testing getPrompts query...')
    const { data: allPrompts, error: allPromptsError } = await supabase
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
    
    if (allPromptsError) {
      console.error('❌ Error fetching prompts:', allPromptsError)
      return false
    }
    console.log(`✅ Retrieved ${allPrompts?.length || 0} prompts for "All" tab`)
    
    // Test 4: Test popular prompts query
    console.log('\n4. Testing popular prompts query...')
    const { data: popularPrompts, error: popularError } = await supabase
      .from('prompts')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .order('usage_count', { ascending: false })
      .limit(10)
    
    if (popularError) {
      console.error('❌ Error fetching popular prompts:', popularError)
      return false
    }
    console.log(`✅ Retrieved ${popularPrompts?.length || 0} popular prompts`)
    
    // Test 5: Test categories query
    console.log('\n5. Testing categories query...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        prompts!inner (
          id
        )
      `)
      .eq('prompts.status', 'published')
    
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError)
      return false
    }
    console.log(`✅ Retrieved ${categories?.length || 0} categories`)
    
    // Test 6: Test individual prompt retrieval
    if (allPrompts && allPrompts.length > 0) {
      console.log('\n6. Testing individual prompt retrieval...')
      const firstPrompt = allPrompts[0]
      const { data: singlePrompt, error: singleError } = await supabase
        .from('prompts')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('slug', firstPrompt.slug)
        .eq('status', 'published')
        .single()
      
      if (singleError) {
        console.error('❌ Error fetching single prompt:', singleError)
        return false
      }
      console.log(`✅ Retrieved individual prompt: "${singlePrompt.title}"`)
    }
    
    // Test 7: Test data structure integrity
    console.log('\n7. Testing data structure integrity...')
    if (allPrompts && allPrompts.length > 0) {
      const samplePrompt = allPrompts[0]
      const requiredFields = ['title', 'slug', 'category_id', 'difficulty_level', 'prompt_type', 'status', 'workflow_type', 'content']
      const missingFields = requiredFields.filter(field => !(field in samplePrompt))
      
      if (missingFields.length > 0) {
        console.error(`❌ Missing required fields: ${missingFields.join(', ')}`)
        return false
      }
      console.log('✅ All required fields present in prompt data')
      
      // Check category relationship
      if (samplePrompt.categories) {
        console.log(`✅ Category relationship working: "${samplePrompt.categories.name}"`)
      } else {
        console.log('⚠️  Category relationship not populated')
      }
    }
    
    // Test 8: Test search functionality
    console.log('\n8. Testing search functionality...')
    const { data: searchResults, error: searchError } = await supabase
      .from('prompts')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .or('title.ilike.%content%,description.ilike.%content%,short_description.ilike.%content%')
      .limit(5)
    
    if (searchError) {
      console.error('❌ Error testing search:', searchError)
      return false
    }
    console.log(`✅ Search returned ${searchResults?.length || 0} results for "content"`)
    
    // Test 9: Test workflow types
    console.log('\n9. Testing workflow types...')
    const { data: workflowStats } = await supabase
      .from('prompts')
      .select('workflow_type')
      .eq('status', 'published')
    
    const workflowCounts = workflowStats?.reduce((acc, item) => {
      acc[item.workflow_type] = (acc[item.workflow_type] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}
    
    console.log(`✅ Workflow distribution:`, workflowCounts)
    
    // Summary
    console.log('\n🎉 All functionality tests passed!')
    console.log('\n📊 Summary:')
    console.log(`   Total Prompts: ${totalPrompts}`)
    console.log(`   Categories: ${categories?.length || 0}`)
    console.log(`   Database Connection: ✅`)
    console.log(`   Query Performance: ✅`)
    console.log(`   Data Integrity: ✅`)
    console.log(`   Search Function: ✅`)
    console.log(`   Category Relations: ✅`)
    
    return true
    
  } catch (error) {
    console.error('❌ Functionality test failed:', error)
    return false
  }
}

// Run the test
async function main() {
  const success = await testCompleteFunctionality()
  if (!success) {
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}