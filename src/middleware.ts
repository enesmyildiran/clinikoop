import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Subdomain'i çıkar (örn: test1.localhost:3000 -> test1)
  const subdomain = hostname.split('.')[0]
  
  // Localhost için özel kontrol
  const isLocalhost = hostname.includes('localhost')
  const extractedSubdomain = isLocalhost ? hostname.split('.')[0] : subdomain
  
  // Eğer subdomain zaten query param olarak varsa, değiştirme
  if (searchParams.has('clinic')) {
    return NextResponse.next()
  }
  
  // Yeni URL oluştur ve clinic query param'ını ekle
  const url = request.nextUrl.clone()
  url.searchParams.set('clinic', extractedSubdomain)
  
  // Authentication kontrolü - sadece korumalı route'lar için
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    
    // SUPER_ADMIN kontrolü
    if (token.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  // Site route'ları için authentication kontrolü
  if (pathname.startsWith('/site') && !pathname.startsWith('/login')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Clinic user kontrolü - ADMIN, SALES, DOCTOR, ASSISTANT rolleri
    const allowedRoles = ['ADMIN', 'SALES', 'DOCTOR', 'ASSISTANT'];
    if (!token.clinicId || !allowedRoles.includes(token.role as string)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 