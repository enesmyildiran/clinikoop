import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route'ları için güvenlik kontrolü
  if (pathname.startsWith('/admin')) {
    // Admin login sayfasına erişime izin ver
    if (pathname === '/admin-login') {
      return NextResponse.next();
    }

    // JWT token'ı kontrol et
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Token yoksa login'e yönlendir
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    // Kullanıcının rolünü kontrol et
    const userRole = (token as any)?.role;
    if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Diğer isteklere izin ver
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