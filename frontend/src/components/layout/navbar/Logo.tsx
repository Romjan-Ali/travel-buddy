// frontend/components/layout/navbar/Logo.tsx
import Link from 'next/link'
import { Globe } from 'lucide-react'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Globe className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold">TravelBuddy</span>
    </Link>
  )
}