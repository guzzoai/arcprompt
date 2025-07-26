import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDbAdditionalSections() {
  console.log('🔍 Checking database for additional sections...\n')
  
  try {
    // Check Facebook Post Optimizer specifically
    const { data: facebookPrompt, error: facebookError } = await supabase
      .from('prompts')
      .select('slug, title, additional_sections')
      .eq('slug', 'facebook-post-optimizer')
      .single()
    
    if (facebookError) {
      console.error('❌ Error fetching Facebook Post Optimizer:', facebookError)
      return
    }
    
    if (facebookPrompt) {
      console.log(`✅ Found: ${facebookPrompt.title}`)
      
      if (facebookPrompt.additional_sections && Object.keys(facebookPrompt.additional_sections).length > 0) {
        const sectionCount = Object.keys(facebookPrompt.additional_sections).length
        console.log(`📈 Additional sections: ${sectionCount}`)
        
        console.log('\n🚀 Section titles:')
        Object.values(facebookPrompt.additional_sections as Record<string, {title: string, order: number}>)
          .sort((a, b) => a.order - b.order)
          .forEach((section, index) => {
            console.log(`   ${index + 1}. ${section.title}`)
          })
        
        console.log('\n✅ SUCCESS: Additional sections are stored in database!')
        
      } else {
        console.log('❌ No additional sections found in database')
      }
    }
    
    // Check how many prompts have additional sections
    const { data: allPrompts, error: allError } = await supabase
      .from('prompts')
      .select('slug, title, additional_sections')
      .not('additional_sections', 'eq', '{}')
    
    if (allError) {
      console.error('❌ Error fetching all prompts:', allError)
      return
    }
    
    console.log(`\n📊 Migration Summary:`)
    console.log(`✅ Total prompts with additional sections: ${allPrompts?.length || 0}`)
    
    if (allPrompts && allPrompts.length > 0) {
      console.log('\n📋 Prompts with additional sections:')
      allPrompts.forEach(prompt => {
        const sectionCount = Object.keys(prompt.additional_sections || {}).length
        console.log(`   - ${prompt.title}: ${sectionCount} sections`)
      })
    }
    
    console.log('\n🎯 Ready for UI Testing!')
    console.log('   Navigate to a prompt detail page to see additional sections')
    console.log('   They should appear in the INFO tab after the Variations section')
    
  } catch (error) {
    console.error('❌ Database check failed:', error)
  }
}

checkDbAdditionalSections()