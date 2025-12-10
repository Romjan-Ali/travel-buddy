'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { authAPI } from '@/lib/api'
import type { AuthUser } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    fullName: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = useCallback(async () => {
    try {
      const result = await authAPI.getMe()
      setUser(result.data.user)
    } catch (error) {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      setIsLoading(true)
      checkAuth().finally(() => setIsLoading(false))
    }
  }, [isMounted, checkAuth])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authAPI.login({ email, password })
      setUser(result.data.user)
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Login failed')
      }
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
      setUser(response.data.user)
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Registration failed')
      }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Logout failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updatedUser: AuthUser) => {
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
