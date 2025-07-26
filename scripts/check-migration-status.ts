#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkMigrationStatus() {
  console.log('📊 Checking migration status...')
  
  // Count total prompts
  const { count: totalPrompts, error: totalError } = await supabase
    .from('prompts')
    .select('*', { count: 'exact', head: true })
  
  if (totalError) {
    console.error('Error counting prompts:', totalError)
    return
  }
  
  console.log(`✅ Total prompts in database: ${totalPrompts}`)
  
  // Count by status
  const { data: statusCounts, error: statusError } = await supabase
    .from('prompts')
    .select('status')
    .then(result => {
      if (result.error) return result
      const counts = result.data?.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}
      return { data: counts, error: null }
    })
  
  if (statusError) {
    console.error('Error counting by status:', statusError)
  } else {
    console.log('📈 Prompts by status:', statusCounts)
  }
  
  // Count by category
  const { data: categories, error: catError } = await supabase
    .from('prompts')
    .select(`
      categories (
        name
      )
    `)
    .eq('status', 'published')
  
  if (catError) {
    console.error('Error counting by category:', catError)
  } else {
    const categoryCounts = categories?.reduce((acc, item) => {
      const catName = item.categories?.name || 'Uncategorized'
      acc[catName] = (acc[catName] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}
    
    console.log('📂 Prompts by category:')
    Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([name, count]) => {
        console.log(`  ${name}: ${count}`)
      })
  }
  
  // Count by workflow type
  const { data: workflowCounts, error: workflowError } = await supabase
    .from('prompts')
    .select('workflow_type')
    .eq('status', 'published')
    .then(result => {
      if (result.error) return result
      const counts = result.data?.reduce((acc, item) => {
        acc[item.workflow_type] = (acc[item.workflow_type] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}
      return { data: counts, error: null }
    })
  
  if (workflowError) {
    console.error('Error counting by workflow type:', workflowError)
  } else {
    console.log('🔄 Prompts by workflow type:', workflowCounts)
  }
  
  // Check for any remaining constraint issues
  const { data: constraintIssues, error: constraintError } = await supabase
    .from('prompts')
    .select('id, title, difficulty_level')
    .not('difficulty_level', 'in', '(Beginner,Intermediate,Advanced,Expert)')
  
  if (constraintError) {
    console.error('Error checking constraints:', constraintError)
  } else if (constraintIssues && constraintIssues.length > 0) {
    console.log(`⚠️  Found ${constraintIssues.length} prompts with invalid difficulty levels:`)
    constraintIssues.forEach(prompt => {
      console.log(`  - ${prompt.title}: ${prompt.difficulty_level}`)
    })
  } else {
    console.log('✅ No constraint violations found')
  }
  
  // Sample some prompts to verify data integrity
  const { data: samplePrompts, error: sampleError } = await supabase
    .from('prompts')
    .select(`
      id,
      title,
      short_description,
      workflow_type,
      step_count,
      categories (
        name
      )
    `)
    .eq('status', 'published')
    .limit(5)
  
  if (sampleError) {
    console.error('Error fetching sample prompts:', sampleError)
  } else {
    console.log('\n📝 Sample prompts:')
    samplePrompts?.forEach(prompt => {
      console.log(`  - ${prompt.title}`)
      console.log(`    Category: ${prompt.categories?.name || 'None'}`)
      console.log(`    Type: ${prompt.workflow_type}, Steps: ${prompt.step_count}`)
      console.log(`    Description: ${prompt.short_description?.substring(0, 60)}...`)
      console.log()
    })
  }
  
  console.log('🎉 Migration status check completed!')
}

// Run the check
async function main() {
  try {
    await checkMigrationStatus()
  } catch (error) {
    console.error('Status check failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}