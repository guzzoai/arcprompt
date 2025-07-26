#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Use environment variables for demo user creation
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createDemoUsers() {
  console.log('👤 Creating demo user accounts...')
  
  try {
    // Create Free Demo User
    console.log('\n1. Creating FREE demo user...')
    const { data: freeUser, error: freeError } = await supabase.auth.admin.createUser({
      email: 'demo-free@arcprompt.com',
      password: 'demo123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Demo Free User',
        plan: 'free',
        subscription_status: 'active'
      }
    })
    
    if (freeError) {
      console.error('❌ Error creating free user:', freeError)
    } else {
      console.log('✅ Free demo user created successfully!')
      console.log(`   Email: demo-free@arcprompt.com`)
      console.log(`   Password: demo123456`)
      console.log(`   User ID: ${freeUser.user?.id}`)
    }
    
    // Create Premium Demo User
    console.log('\n2. Creating PREMIUM demo user...')
    const { data: premiumUser, error: premiumError } = await supabase.auth.admin.createUser({
      email: 'demo-premium@arcprompt.com',
      password: 'demo123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Demo Premium User',
        plan: 'premium',
        subscription_status: 'active'
      }
    })
    
    if (premiumError) {
      console.error('❌ Error creating premium user:', premiumError)
    } else {
      console.log('✅ Premium demo user created successfully!')
      console.log(`   Email: demo-premium@arcprompt.com`)
      console.log(`   Password: demo123456`)
      console.log(`   User ID: ${premiumUser.user?.id}`)
    }
    
    // Create some saved prompts for the demo users
    if (freeUser.user && premiumUser.user) {
      console.log('\n3. Creating sample saved prompts...')
      
      // Get some random prompt IDs
      const { data: samplePrompts, error: promptsError } = await supabase
        .from('prompts')
        .select('slug')
        .eq('status', 'published')
        .limit(5)
      
      if (!promptsError && samplePrompts) {
        // Create saved prompts for both users
        const savedPromptsData = [
          // Free user saves first 2 prompts
          { user_id: freeUser.user.id, prompt_slug: samplePrompts[0]?.slug },
          { user_id: freeUser.user.id, prompt_slug: samplePrompts[1]?.slug },
          // Premium user saves 3 prompts
          { user_id: premiumUser.user.id, prompt_slug: samplePrompts[0]?.slug },
          { user_id: premiumUser.user.id, prompt_slug: samplePrompts[2]?.slug },
          { user_id: premiumUser.user.id, prompt_slug: samplePrompts[3]?.slug }
        ].filter(item => item.prompt_slug) // Remove any undefined slugs
        
        if (savedPromptsData.length > 0) {
          const { error: savedError } = await supabase
            .from('user_saved_prompts')
            .insert(savedPromptsData)
          
          if (savedError) {
            console.log('⚠️  Could not create saved prompts (table may not exist):', savedError.message)
          } else {
            console.log(`✅ Created ${savedPromptsData.length} saved prompt entries`)
          }
        }
      }
    }
    
    console.log('\n🎉 Demo user accounts created successfully!')
    console.log('\n📋 Login Details:')
    console.log('┌─────────────────────────────────────────────┐')
    console.log('│ FREE DEMO ACCOUNT                           │')
    console.log('│ Email: demo-free@arcprompt.com              │')
    console.log('│ Password: demo123456                        │')
    console.log('├─────────────────────────────────────────────┤')
    console.log('│ PREMIUM DEMO ACCOUNT                        │')
    console.log('│ Email: demo-premium@arcprompt.com           │')
    console.log('│ Password: demo123456                        │')
    console.log('└─────────────────────────────────────────────┘')
    
  } catch (error) {
    console.error('❌ Demo user creation failed:', error)
    process.exit(1)
  }
}

// Run the demo user creation
async function main() {
  try {
    await createDemoUsers()
  } catch (error) {
    console.error('Demo user creation failed:', error)
    process.exit(1)
  }
}

// Only run if called directly
if (require.main === module) {
  main()
}