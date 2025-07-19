"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password:string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, userData?: { full_name?: string }) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  resendConfirmation: (email: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🏗️ AuthProvider useEffect running (should only run once)')
    
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('🔍 Initial session result:', session ? 'Session found' : 'No session', session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('❌ Error getting initial session:', error)
      } finally {
        console.log('🔍 Initial session loading complete')
        setLoading(false)
      }
    }
    
    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      console.log('🧹 AuthProvider cleanup (this should not happen frequently)')
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in with email:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log('🔐 Sign in result:', error ? 'Error: ' + error.message : 'Success', data?.user?.email)
    return { error }
  }

  const signUp = async (email: string, password: string, userData?: { full_name?: string }) => {
    console.log('📝 Attempting sign up with email:', email, 'name:', userData?.full_name)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData?.full_name,
        }
      }
    })

    console.log('📝 Sign up result:', error ? 'Error: ' + error.message : 'Success')
    console.log('📝 User data:', data.user ? 'User created: ' + data.user.email : 'No user data')
    console.log('📝 Session data:', data.session ? 'Session created' : 'No session')
    console.log('📝 User confirmation status:', data.user?.email_confirmed_at ? 'Confirmed' : 'Needs confirmation')

    if (!error && data.user) {
      // The user profile is now created via the fetchUserProfile -> createUserProfile flow
      // triggered by onAuthStateChange. This avoids a race condition.
    }

    return { error }
  }

  const resendConfirmation = async (email: string) => {
    console.log('📧 Resending confirmation email to:', email)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })
    console.log('📧 Resend result:', error ? 'Error: ' + error.message : 'Success')
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
  }

  const signInWithGoogle = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
    
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resendConfirmation,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}