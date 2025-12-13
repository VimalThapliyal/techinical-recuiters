import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCountryFromSubdomain, isValidCountryCode } from '@/lib/subdomain';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const country = getCountryFromSubdomain(hostname);
  const pathname = request.nextUrl.pathname;
  
  // Allow landing page on root domain (no subdomain or localhost)
  const isRootDomain = hostname === 'localhost' || 
                       hostname === 'localhost:3000' ||
                       !hostname.includes('.') ||
                       hostname.split('.').length <= 2;
  
  // If accessing root with a country subdomain, redirect to country page
  // But allow landing page on root domain
  if (pathname === '/' && isValidCountryCode(country) && !isRootDomain) {
    const url = request.nextUrl.clone();
    url.pathname = `/${country}`;
    return NextResponse.redirect(url);
  }
  
  // Allow API routes and static files to pass through
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

