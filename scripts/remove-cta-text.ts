import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface AdditionalSection {
  title: string
  content: string
  order: number
  type?: string
  icon?: string
  parsedContent?: any
}

function removeCTAFromContent(content: string): string {
  if (!content) return content
  
  // Patterns to remove CTA text
  const ctaPatterns = [
    // Remove the main CTA pattern
    /\*\*This is a premium prompt from the AI Prompt Master Vault\. Get 207\+ copy-paste prompts for comprehensive [^*]+\*\*/gi,
    
    // Remove star emoji variants
    /⭐ This is a premium prompt from the AI Prompt Master Vault\. Get 207\+ copy-paste prompts for comprehensive [^.]+\./gi,
    
    // Remove standalone CTA sentences
    /Get 207\+ copy-paste prompts for comprehensive [^.]+\./gi,
    
    // Remove HTML version  
    /<strong>This is a premium prompt from the AI Prompt Master Vault\. Get 207\+ copy-paste prompts for comprehensive .*?<\/strong>/gi,
    
    // Remove any remaining "AI Prompt Master Vault" references
    /.*AI Prompt Master Vault.*Get 207\+[^.]*\./gi,
    
    // Remove trailing strong tags that might be left over
    /<\/strong>\s*$/gi,
    
    // Remove orphaned CTA content with trailing </strong>
    /Get 207\+ copy-paste prompts for comprehensive [^<]*<\/strong>/gi,
    
    // Remove duplicated sections that start with **Weekly Content Themes:**
    /\n\n\*\*Weekly Content Themes:\*\*[\s\S]*?Year-end reflections and planning\s*\*\*This is a premium prompt from the AI Prompt Master Vault[\s\S]*?$/gi,
    
    // Remove duplicated performance tracking sections
    /\n\n\*\*Key Metrics[^:]*:\*\*[\s\S]*?Cross-promote on other platforms\s*\*\*This is a premium prompt from the AI Prompt Master Vault[\s\S]*?$/gi,
  ]
  
  let cleanedContent = content
  
  // Apply all patterns
  ctaPatterns.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '')
  })
  
  // Clean up extra whitespace and newlines
  cleanedContent = cleanedContent
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
    .replace(/\s+$/, '') // Remove trailing whitespace
    .trim()
  
  return cleanedContent
}

async function removeCTAFromAllPrompts() {
  console.log('🧹 Removing CTA text from all prompts...')
  
  let offset = 0
  const limit = 50
  let totalProcessed = 0
  let totalCleaned = 0
  
  while (true) {
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('id, slug, title, additional_sections')
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Error fetching prompts:', error)
      break
    }
    
    if (!prompts || prompts.length === 0) {
      break
    }
    
    for (const prompt of prompts) {
      totalProcessed++
      console.log(`🔄 Processing ${totalProcessed}: ${prompt.title}`)
      
      if (!prompt.additional_sections) {
        continue
      }
      
      let hasChanges = false
      const cleanedSections: Record<string, AdditionalSection> = {}
      
      // Process each additional section
      Object.entries(prompt.additional_sections).forEach(([key, section]: [string, any]) => {
        const originalContent = section.content
        const cleanedContent = removeCTAFromContent(originalContent)
        
        if (cleanedContent !== originalContent) {
          hasChanges = true
          console.log(`  ✂️ Cleaned section: ${section.title}`)
          console.log(`    Original length: ${originalContent.length}`)
          console.log(`    Cleaned length: ${cleanedContent.length}`)
        }
        
        cleanedSections[key] = {
          ...section,
          content: cleanedContent
        }
      })
      
      // Update the prompt if there were changes
      if (hasChanges) {
        const { error: updateError } = await supabase
          .from('prompts')
          .update({ additional_sections: cleanedSections })
          .eq('id', prompt.id)
        
        if (updateError) {
          console.error(`❌ Error updating ${prompt.title}:`, updateError)
        } else {
          console.log(`✅ Successfully cleaned ${prompt.title}`)
          totalCleaned++
        }
      }
    }
    
    offset += limit
    if (prompts.length < limit) {
      break
    }
  }
  
  console.log('\n📊 CTA Removal Summary:')
  console.log(`Total prompts processed: ${totalProcessed}`)
  console.log(`Prompts cleaned: ${totalCleaned}`)
  console.log(`Success rate: ${((totalCleaned / totalProcessed) * 100).toFixed(1)}%`)
}

// Run the script
removeCTAFromAllPrompts()
  .then(() => {
    console.log('🎉 CTA removal completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })