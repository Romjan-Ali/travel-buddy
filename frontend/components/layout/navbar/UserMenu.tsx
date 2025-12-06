// frontend/components/layout/navbar/UserMenu.tsx
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Settings, LogOut } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import { NavItem } from './NavItems'

interface UserMenuProps {
  user: {
    id: string
    email: string
    role: 'USER' | 'ADMIN'
    isVerified: boolean
    profile?: {
      fullName?: string
      profileImage?: string
    }
  }
  userNavItems: NavItem[]
  adminNavItems: NavItem[]
  onLogout: () => Promise<void>
}

export function UserMenu({
  user,
  userNavItems,
  adminNavItems,
  onLogout,
}: UserMenuProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.profile?.profileImage}
              alt={user.profile?.fullName}
            />
            <AvatarFallback>
              {getInitials(user.profile?.fullName || user.email)}
            </AvatarFallback>
          </Avatar>
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">✓</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.profile?.fullName || 'Traveler'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.isVerified && (
              <Badge
                variant="outline"
                className="mt-1 w-fit bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                ✓ Verified Traveler
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* User Navigation */}
        {userNavItems.map((item) => (
          <DropdownMenuItem
            key={item.href}
            asChild
            className="flex items-center justify-between cursor-pointer"
          >
            <Link href={item.href}>
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="destructive" className="h-5 px-1.5">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Admin Navigation (if admin) */}
        {user.role === 'ADMIN' && (
          <>
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Admin
            </DropdownMenuLabel>
            {adminNavItems.map((item) => (
              <DropdownMenuItem
                key={item.href}
                asChild
                className="cursor-pointer"
              >
                <Link href={item.href}>
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Settings & Logout */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}