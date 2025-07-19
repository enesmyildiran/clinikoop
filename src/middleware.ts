import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;
  
  // Geliştirme modunda middleware'i basitleştir
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // API rotalarını atla
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Statik dosyaları atla
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Public dosyaları atla
  if (pathname.startsWith('/public/')) {
    return NextResponse.next();
  }

  // Ana domain kontrolü
  const isMainDomain = host === process.env.DOMAIN || host === `www.${process.env.DOMAIN}`;
  const isSubdomain = host.includes('.') && !isMainDomain;

  // Ana domain'de admin paneline erişim kontrolü
  if (isMainDomain && pathname.startsWith('/admin')) {
    // Admin login sayfasına izin ver
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Süper admin kontrolü
      if (!token.isSuperAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Subdomain kontrolü (klinik erişimi)
  if (isSubdomain) {
    const subdomain = host.split('.')[0];
    
    // Login/logout sayfalarına izin ver
    if (pathname === '/login' || pathname === '/logout') {
      return NextResponse.next();
    }

    // Klinik dashboard ve diğer sayfalar için auth kontrolü
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/site')) {
      try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        
        if (!token) {
          return NextResponse.redirect(new URL('/login', request.url));
        }

        // Klinik kullanıcısı kontrolü
        if (token.isSuperAdmin || !token.clinicId) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 