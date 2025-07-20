import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
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