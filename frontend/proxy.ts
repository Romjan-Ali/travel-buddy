// frontend/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken, verifyToken } from './lib/jwt'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  
  // ============================================
  // Route classification
  // ============================================
  
  // Public routes (no authentication required)
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/api/auth',
    '/api/public',
    '/api/webhooks',
    '/health',
    '/_next',
    '/static',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ]
  
  // Admin routes (require admin role)
  const adminRoutes = [
    '/admin',
    '/api/admin'
  ]
  
  // Auth routes (require authentication but not specific role)
  const authRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/api/user'
  ]
  
  // Check route types
  const isPublicRoute = publicRoutes.some(route => 
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  )
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  const isApiRoute = pathname.startsWith('/api/')
  
  // ============================================
  // 1. Check token validity (if exists)
  // ============================================
  let decodedToken = null
  let tokenValid = false
  
  if (token) {
    try {
      // Verify token signature first
      const verified = verifyToken(token)
      if (verified) {
        decodedToken = decodeToken(token) as { 
          userId?: string
          role?: string
          exp?: number
          email?: string
        } | null
        
        // Check token expiration
        if (decodedToken?.exp) {
          const currentTime = Math.floor(Date.now() / 1000)
          tokenValid = decodedToken.exp > currentTime
        }
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      tokenValid = false
    }
  }
  
  // ============================================
  // 2. Handle public routes
  // ============================================
  if (isPublicRoute) {
    // Optional: Redirect authenticated users away from auth pages
    if (tokenValid && ['/login', '/register'].includes(pathname)) {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }
  
  // ============================================
  // 3. Handle unauthenticated users
  // ============================================
  if (!tokenValid) {
    if (isApiRoute) {
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      )
    }
    
    // Redirect to login with redirect parameter
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    
    // Clear invalid token cookie
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('token')
    
    return response
  }
  
  // ============================================
  // 4. Handle admin route access control
  // ============================================
  if (isAdminRoute) {
    const userRole = decodedToken?.role
    
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      if (isApiRoute) {
        return NextResponse.json(
          { 
            error: 'Forbidden', 
            message: 'Insufficient permissions',
            code: 'ADMIN_ACCESS_REQUIRED'
          },
          { status: 403 }
        )
      }
      
      // Log unauthorized access attempt
      console.warn(`Unauthorized admin access attempt by user: ${decodedToken?.userId}`)
      
      // Redirect to dashboard or unauthorized page
      const redirectUrl = new URL('/unauthorized', request.url)
      redirectUrl.searchParams.set('code', 'ADMIN_ACCESS_REQUIRED')
      return NextResponse.redirect(redirectUrl)
    }
    
    // User is admin - proceed with admin headers
    const response = NextResponse.next()
    response.headers.set('x-user-id', decodedToken?.userId || '')
    response.headers.set('x-user-role', userRole || '')
    response.headers.set('x-user-email', decodedToken?.email || '')
    
    return response
  }
  
  // ============================================
  // 5. Handle authenticated routes
  // ============================================
  if (isAuthRoute || !isPublicRoute) {
    const response = NextResponse.next()
    
    // Add user information to headers for server components
    response.headers.set('x-user-id', decodedToken?.userId || '')
    response.headers.set('x-user-role', decodedToken?.role || 'USER')
    response.headers.set('x-user-email', decodedToken?.email || '')
    response.headers.set('x-user-authenticated', 'true')
    
    return response
  }
  
  // ============================================
  // 6. Default fallback
  // ============================================
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}