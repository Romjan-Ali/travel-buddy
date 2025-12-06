// frontend/components/layout/navbar/index.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { Notifications } from './Notifications'
import { UserMenu } from './UserMenu'
import { getNavItems } from './NavItems'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pendingReviews, setPendingReviews] = useState(0)

  // Function declarations
  const fetchPendingReviews = async () => {
    try {
      const response = await reviewAPI.getMyReviews('received')
      const reviews = response.reviews || []
      setPendingReviews(0) // Placeholder
    } catch (error) {
      console.error('Error fetching pending reviews:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path)
  }

  // Effects
  useEffect(() => {
    if (user) {
      fetchPendingReviews()
    }
  }, [user])

  // Get navigation items
  const navItems = getNavItems(pendingReviews)
  const publicNavItems = navItems.public
  const userNavItems = navItems.user
  const adminNavItems = navItems.admin

  return (
    <nav className="sticky top-0 z-50 w-full px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left Section: Logo & Desktop Navigation */}
        <div className="flex items-center gap-2">
          <Logo />
          <DesktopNav navItems={publicNavItems} isActive={isActive} />
        </div>

        {/* Right Section: Actions & Auth */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {user && <Notifications pendingReviews={pendingReviews} />}

          {/* Auth State */}
          {isLoading ? (
            <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
          ) : user ? (
            <UserMenu
              user={user}
              userNavItems={userNavItems}
              adminNavItems={adminNavItems}
              onLogout={handleLogout}
            />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/login')}
                className={cn(isActive('/login') && 'bg-accent')}
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/register')}
                className={cn(isActive('/register') && 'bg-primary/90')}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        navItems={publicNavItems}
        userNavItems={userNavItems}
        adminNavItems={adminNavItems}
        pendingReviews={pendingReviews}
        isActive={isActive}
        onLogout={handleLogout}
      />
    </nav>
  )
}