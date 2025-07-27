#!/usr/bin/env tsx

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Use environment variables for demo user creation
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

// Demo user credentials from environment variables
const demoFreeEmail = process.env.DEMO_FREE_EMAIL
const demoFreePassword = process.env.DEMO_FREE_PASSWORD
const demoPremiumEmail = process.env.DEMO_PREMIUM_EMAIL
const demoPremiumPassword = process.env.DEMO_PREMIUM_PASSWORD

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)')
  console.error('   SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY for new API keys)')
  process.exit(1)
}

if (!demoFreeEmail || !demoFreePassword || !demoPremiumEmail || !demoPremiumPassword) {
  console.error('❌ Missing required demo user environment variables:')
  console.error('   DEMO_FREE_EMAIL')
  console.error('   DEMO_FREE_PASSWORD')
  console.error('   DEMO_PREMIUM_EMAIL')
  console.error('   DEMO_PREMIUM_PASSWORD')
  console.error('')
  console.error('   Example .env.local:')
  console.error('   DEMO_FREE_EMAIL=demo-free@example.com')
  console.error('   DEMO_FREE_PASSWORD=secure_password_123')
  console.error('   DEMO_PREMIUM_EMAIL=demo-premium@example.com')
  console.error('   DEMO_PREMIUM_PASSWORD=secure_password_456')
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
      email: demoFreeEmail,
      password: demoFreePassword,
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
      console.log(`   Email: ${demoFreeEmail}`)
      console.log(`   User ID: ${freeUser.user?.id}`)
    }
    
    // Create Premium Demo User
    console.log('\n2. Creating PREMIUM demo user...')
    const { data: premiumUser, error: premiumError } = await supabase.auth.admin.createUser({
      email: demoPremiumEmail,
      password: demoPremiumPassword,
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
      console.log(`   Email: ${demoPremiumEmail}`)
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
    console.log(`│ Email: ${demoFreeEmail}`)
    console.log('├─────────────────────────────────────────────┤')
    console.log('│ PREMIUM DEMO ACCOUNT                        │')
    console.log(`│ Email: ${demoPremiumEmail}`)
    console.log('└─────────────────────────────────────────────┘')
    console.log('\n⚠️  Passwords are stored in environment variables')
    
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