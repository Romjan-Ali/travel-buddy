// frontend/app/layout.tsx
import type React from 'react'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth-context'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Travel Buddy & Meetup - Find Your Perfect Travel Companion',
  description:
    'Connect with like-minded travelers, plan adventures together, and create unforgettable memories. Join 10,000+ travelers worldwide on TravelBuddy.',
  keywords: [
    'travel buddy',
    'travel companion',
    'find travel partner',
    'solo travel',
    'group travel',
    'meetup',
    'travel planning',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    title: 'Travel Buddy & Meetup - Find Your Perfect Travel Companion',
    description:
      'Connect with like-minded travelers and plan adventures together',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Buddy & Meetup',
    description:
      'Connect with like-minded travelers and plan adventures together',
  },
}

export const viewport = {
  themeColor: '#000000',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-4">
              {children}
            </main>
            <Footer />
            <Toaster richColors closeButton />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
