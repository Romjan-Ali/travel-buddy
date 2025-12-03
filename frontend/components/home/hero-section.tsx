// frontend/components/home/hero-section.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plane, Users, MapPin, Calendar, Search } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function HeroSection() {
  const { user } = useAuth()

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mb-6 bg-primary/10 text-primary">
              <Plane className="mr-2 h-4 w-4" />
              Join 10,000+ travelers worldwide
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find Your Perfect
              <span className="text-primary"> Travel Buddy</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Connect with like-minded travelers, plan adventures together, and
              create unforgettable memories. Whether you&apos;re backpacking through
              Asia or exploring European cities, find your perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link href="/explore">
                    <Button size="lg" className="gap-2">
                      <Search className="h-5 w-5" />
                      Find Travel Buddies
                    </Button>
                  </Link>
                  <Link href="/travel-plans/new">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Calendar className="h-5 w-5" />
                      Create Travel Plan
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="gap-2">
                      <Plane className="h-5 w-5" />
                      Start Your Journey
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Users className="h-5 w-5" />
                      Explore Travelers
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Verified Profiles
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                Safe & Secure
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                24/7 Support
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/10" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg max-w-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold">153 Matches Made</p>
                  <p className="text-sm text-muted-foreground">
                    This week alone
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg max-w-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">42 Countries</p>
                  <p className="text-sm text-muted-foreground">
                    Active travelers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
