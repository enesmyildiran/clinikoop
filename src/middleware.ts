import { NextRequest, NextResponse } from 'next/server';
import { getSubdomainFromHost, isClinicAccess, isSuperAdminAccess, getClinicIdFromSubdomain } from './lib/clinic-routing';

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;
  
  const subdomain = getSubdomainFromHost(host);
  
  // Ana domain (app.domain.com) - Süper Admin
  if (isSuperAdminAccess(host)) {
    // Klinik panellerine erişimi engelle
    if (pathname.startsWith('/clinic')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Süper admin sayfalarına yönlendir
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    return NextResponse.next();
  }
  
  // Klinik subdomain - Klinik Paneli
  if (isClinicAccess(host)) {
    // Süper admin sayfalarına erişimi engelle
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Klinik ana sayfasına yönlendir
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // ClinicId'yi belirle ve header'a ekle
    if (subdomain) {
      const clinicId = await getClinicIdFromSubdomain(subdomain);
      if (clinicId) {
        const response = NextResponse.next();
        response.headers.set('x-clinic-id', clinicId);
        return response;
      }
    }
    
    return NextResponse.next();
  }
  
  // Geçersiz subdomain
  return NextResponse.redirect(new URL('/not-found', request.url));
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