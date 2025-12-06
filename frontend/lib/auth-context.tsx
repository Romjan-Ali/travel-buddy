// frontend/lib/auth-context.tsx
'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { authAPI } from '@/lib/api'

interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  isVerified: boolean
  isActive: boolean
  profile?: {
    fullName: string
    profileImage?: string
    bio?: string
    currentLocation?: string
    travelInterests?: string[]
    visitedCountries?: string[]
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    fullName: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    console.log('Checking auth for pathname:', pathname)
    try {
      const result = await authAPI.getMe()
      console.log('user result in check auth:', result.data.user)
      setUser(result.data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authAPI.login({ email, password })
      console.log('user result in login auth:', result.data.user)
      setUser(result.data.user)
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: {
    email: string
    password: string
    fullName: string
  }) => {
    setIsLoading(true)
    try {
      const response = await authAPI.register(data)
      setUser(response.user)
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authAPI.logout()
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Logout failed')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected route hook
export function useProtectedRoute() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (
      !isLoading &&
      !user &&
      pathname !== '/login' &&
      pathname !== '/register'
    ) {
      router.push('/login')
    }
  }, [user, isLoading, pathname, router])

  return { user, isLoading }
}

// Admin route hook
export function useAdminRoute() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}
