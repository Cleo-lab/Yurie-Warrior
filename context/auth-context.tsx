"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string | null
}

interface AuthContextType {
  user: UserProfile | null
  isLoggedIn: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

let profileCache: Map<string, UserProfile> = new Map()

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (profileCache.has(userId)) {
      return profileCache.get(userId) || null
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        }
        profileCache.set(userId, userProfile)
        return userProfile
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
    return null
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          if (profile) {
            setUser(profile)
          }
        }
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        if (profile) {
          setUser(profile)
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [fetchProfile])

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      profileCache.clear()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
