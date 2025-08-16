'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('🔄 Client-side OAuth callback processing')
      
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session after OAuth:', error)
          router.push('/login?error=oauth_error')
          return
        }

        if (data.session) {
          console.log('✅ OAuth session found, redirecting to dashboard')
          router.push('/dashboard')
        } else {
          console.log('❌ No session found after OAuth, redirecting to login')
          router.push('/login?error=no_session')
        }
      } catch (error) {
        console.error('❌ Exception in OAuth callback:', error)
        router.push('/login?error=oauth_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}