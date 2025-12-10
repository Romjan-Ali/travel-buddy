'use client'

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Plane, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const CtaSection = () => {
  const { user } = useAuth()
  return (
    <>
      {!user && (
        <section className="py-16 gradient-bg">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of travelers who have found their perfect travel
              companions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">
                  <Plane className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline">
                  <Users className="mr-2 h-5 w-5" />
                  Explore Travelers
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm opacity-80">
              No credit card required • Free plan available
            </p>
          </div>
        </section>
      )}
    </>
  )
}

export default CtaSection
