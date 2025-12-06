// frontend/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken } from './lib/jwt'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Public routes (no auth required)
  const publicRoutes = [
    '/login',
    '/register',
    '/',
    '/about',
    '/contact',
    '/api/auth',
    '/_next',
  ]
  const isPublicRoute = publicRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  )

  // Admin routes (require admin role)
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // API routes protection (optional but recommended)
  const isApiRoute = pathname.startsWith('/api/')

  // ============================================
  // 1. Handle unauthenticated users
  // ============================================
  if (!token && !isPublicRoute) {
    if (isApiRoute) {
      // Return JSON for API routes
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login first' },
        { status: 401 }
      )
    }

    // Redirect to login for page routes
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ============================================
  // 2. Handle admin route access control
  // ============================================
  if (token && isAdminRoute) {
    const decodedToken = decodeToken(token) as { role?: string } | null

    if (!decodedToken) {
      // Invalid token handling
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid token' },
          { status: 401 }
        )
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const userRole = decodedToken.role

    // If token doesn't contain role or user is not admin
    if (!userRole || userRole !== 'ADMIN') {
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Admin access required' },
          { status: 403 }
        )
      }

      // Redirect non-admin users to dashboard or unauthorized page
      const redirectUrl = new URL('/unauthorized', request.url)
      redirectUrl.searchParams.set('reason', 'admin-access-required')
      return NextResponse.redirect(redirectUrl)
    }

    // User is admin - add admin headers for downstream use
    const response = NextResponse.next()
    response.headers.set('x-user-role', 'ADMIN')
    return response
  }

  // ============================================
  // 3. Handle regular authenticated users
  // ============================================
  if (token && !isPublicRoute) {
    const decodedToken = decodeToken(token) as { role?: string } | null

    if (!decodedToken) {
      // Invalid token handling
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid token' },
          { status: 401 }
        )
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const userRole = decodedToken.role

    // Add user info to headers for server components/API routes
    const response = NextResponse.next()
    if (userRole) {
      response.headers.set('x-user-role', userRole)
    }
    response.headers.set('x-user-authenticated', 'true')
    return response
  }

  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
