#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ValidationResult {
  slug: string
  title: string
  issues: string[]
  severity: 'critical' | 'warning' | 'info'
}

async function validatePromptData() {
  console.log('🔍 Validating prompt data completeness...\n')
  
  try {
    // Fetch all prompts from database
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('status', 'published')
      .order('title')
    
    if (error) {
      console.error('❌ Error fetching prompts:', error)
      return
    }
    
    if (!prompts || prompts.length === 0) {
      console.log('No prompts found in database')
      return
    }
    
    console.log(`📊 Checking ${prompts.length} prompts...\n`)
    
    const results: ValidationResult[] = []
    let criticalCount = 0
    let warningCount = 0
    let perfectCount = 0
    
    for (const prompt of prompts) {
      const issues: string[] = []
      let severity: 'critical' | 'warning' | 'info' = 'info'
      
      // Check critical fields
      if (!prompt.content || prompt.content.trim() === '') {
        issues.push('❌ Missing prompt content')
        severity = 'critical'
      }
      
      if (!prompt.slug) {
        issues.push('❌ Missing slug')
        severity = 'critical'
      }
      
      if (!prompt.title) {
        issues.push('❌ Missing title')
        severity = 'critical'
      }
      
      // Check info sections
      const infoSections = {
        'how_to_use': 'How to Use',
        'what_you_get': 'What You\'ll Get',
        'expected_results': 'Expected Results',
        'variations': 'Variations'
      }
      
      for (const [field, label] of Object.entries(infoSections)) {
        const value = prompt[field]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          issues.push(`⚠️ Missing ${label} section`)
          if (severity !== 'critical') severity = 'warning'
        } else if (Array.isArray(value) && value.length < 3) {
          issues.push(`ℹ️ ${label} has only ${value.length} items (recommend 3+)`)
          if (severity === 'info') severity = 'warning'
        }
      }
      
      // Check multi-step specific fields
      if (prompt.workflow_type === 'multi-step') {
        if (!prompt.steps_data || prompt.steps_data.length === 0) {
          issues.push('❌ Multi-step prompt missing steps data')
          severity = 'critical'
        } else {
          // Check each step for content
          const emptySteps = prompt.steps_data.filter((step: any) => !step.content || step.content.trim() === '')
          if (emptySteps.length > 0) {
            issues.push(`⚠️ ${emptySteps.length} steps missing content`)
            if (severity !== 'critical') severity = 'warning'
          }
        }
        
        if (!prompt.workflow_overview) {
          issues.push('ℹ️ Missing workflow overview')
        }
        
        if (!prompt.what_you_create) {
          issues.push('ℹ️ Missing "What You\'ll Create" section')
        }
      }
      
      // Check metadata
      if (!prompt.short_description && !prompt.description) {
        issues.push('⚠️ Missing description')
        if (severity !== 'critical') severity = 'warning'
      }
      
      if (!prompt.category_id) {
        issues.push('⚠️ Not assigned to category')
        if (severity !== 'critical') severity = 'warning'
      }
      
      if (!prompt.difficulty_level) {
        issues.push('ℹ️ Missing difficulty level')
      }
      
      if (!prompt.platforms || prompt.platforms.length === 0) {
        issues.push('ℹ️ No platforms specified')
      }
      
      // Store result
      if (issues.length > 0) {
        results.push({
          slug: prompt.slug || 'unknown',
          title: prompt.title || 'Untitled',
          issues,
          severity
        })
        
        if (severity === 'critical') criticalCount++
        else if (severity === 'warning') warningCount++
      } else {
        perfectCount++
      }
    }
    
    // Display results
    console.log('='.repeat(80))
    console.log('\n📋 VALIDATION RESULTS\n')
    console.log('='.repeat(80))
    
    // Show critical issues first
    const criticalResults = results.filter(r => r.severity === 'critical')
    if (criticalResults.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES (must fix):\n')
      for (const result of criticalResults) {
        console.log(`\n📄 ${result.title} (${result.slug})`)
        for (const issue of result.issues) {
          console.log(`   ${issue}`)
        }
      }
    }
    
    // Show warnings
    const warningResults = results.filter(r => r.severity === 'warning')
    if (warningResults.length > 0) {
      console.log('\n⚠️ WARNINGS (should fix):\n')
      for (const result of warningResults) {
        console.log(`\n📄 ${result.title} (${result.slug})`)
        for (const issue of result.issues) {
          console.log(`   ${issue}`)
        }
      }
    }
    
    // Show info
    const infoResults = results.filter(r => r.severity === 'info')
    if (infoResults.length > 0 && process.argv.includes('--verbose')) {
      console.log('\nℹ️ INFO (nice to have):\n')
      for (const result of infoResults) {
        console.log(`\n📄 ${result.title} (${result.slug})`)
        for (const issue of result.issues) {
          console.log(`   ${issue}`)
        }
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(80))
    console.log('\n📊 SUMMARY\n')
    console.log('='.repeat(80))
    console.log(`\n✅ Perfect prompts: ${perfectCount}`)
    console.log(`🚨 Critical issues: ${criticalCount}`)
    console.log(`⚠️ Warnings: ${warningCount}`)
    console.log(`ℹ️ Info: ${infoResults.length}`)
    console.log(`\nTotal prompts checked: ${prompts.length}`)
    
    const successRate = ((perfectCount / prompts.length) * 100).toFixed(1)
    console.log(`Success rate: ${successRate}%`)
    
    if (criticalCount > 0) {
      console.log('\n❌ Validation failed - critical issues found')
      console.log('Run: npm run update-prompt-info to fix most issues')
      process.exit(1)
    } else if (warningCount > 10) {
      console.log('\n⚠️ Validation passed with warnings')
      console.log('Consider running: npm run update-prompt-info')
    } else {
      console.log('\n✅ Validation passed successfully!')
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error)
    process.exit(1)
  }
}

// Run the validation
validatePromptData()