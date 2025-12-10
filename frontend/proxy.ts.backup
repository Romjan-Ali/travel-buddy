// frontend/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken } from './lib/jwt'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  console.log('🔹 Request pathname:', pathname)
  console.log('🔹 Token found:', !!token)

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
  console.log('🔹 Is public route:', isPublicRoute)

  // Admin routes (require admin role)
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  console.log('🔹 Is admin route:', isAdminRoute)

  // API routes protection (optional but recommended)
  const isApiRoute = pathname.startsWith('/api/')
  console.log('🔹 Is API route:', isApiRoute)

  // ============================================
  // 1. Handle unauthenticated users
  // ============================================
  if (!token && !isPublicRoute) {
    console.log('⚠️ Unauthenticated user accessing protected route')

    if (isApiRoute) {
      console.log('➡️ Returning 401 JSON response for API route')
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please login first' },
        { status: 401 }
      )
    }

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    console.log('➡️ Redirecting to login page:', loginUrl.toString())
    return NextResponse.redirect(loginUrl)
  }

  // ============================================
  // 2. Handle admin route access control
  // ============================================
  if (token && isAdminRoute) {
    const decodedToken = decodeToken(token) as { role?: string } | null
    console.log('🔹 Decoded token for admin route:', decodedToken)

    if (!decodedToken) {
      console.log('⚠️ Invalid token for admin route')
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
    console.log('🔹 User role from token:', userRole)

    if (!userRole || userRole !== 'ADMIN') {
      console.log('⚠️ User is not admin')
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Admin access required' },
          { status: 403 }
        )
      }

      const redirectUrl = new URL('/unauthorized', request.url)
      redirectUrl.searchParams.set('reason', 'admin-access-required')
      console.log('➡️ Redirecting non-admin user:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    const response = NextResponse.next()
    response.headers.set('x-user-role', 'ADMIN')
    console.log('✅ Admin access granted')
    return response
  }

  // ============================================
  // 3. Handle regular authenticated users
  // ============================================
  if (token && !isPublicRoute) {
    const decodedToken = decodeToken(token) as { role?: string } | null
    console.log('🔹 Decoded token for protected route:', decodedToken)

    if (!decodedToken) {
      console.log('⚠️ Invalid token for protected route')
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid token' },
          { status: 401 }
        )
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      console.log('➡️ Redirecting to login page due to invalid token')
      return NextResponse.redirect(loginUrl)
    }

    const userRole = decodedToken.role
    console.log('🔹 User role:', userRole)

    const response = NextResponse.next()
    if (userRole) {
      response.headers.set('x-user-role', userRole)
    }
    response.headers.set('x-user-authenticated', 'true')
    console.log('✅ Regular user access granted')
    return response
  }

  console.log('✅ Public route or default handling')
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
