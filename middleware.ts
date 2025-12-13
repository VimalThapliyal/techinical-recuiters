import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCountryFromSubdomain, isValidCountryCode } from '@/lib/subdomain';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  // Extract subdomain from hostname
  const parts = hostname.split('.');
  const firstPart = parts[0]?.toLowerCase();
  
  // Check if first part is a valid country code
  const isCountrySubdomain = firstPart && isValidCountryCode(firstPart);
  
  // Root domain detection:
  // - localhost (development)
  // - Main project domain (e.g., techinical-recuiters.vercel.app)
  // - Custom domain without country subdomain
  const isRootDomain = hostname === 'localhost' || 
                       hostname === 'localhost:3000' ||
                       hostname.startsWith('127.0.0.1') ||
                       hostname.startsWith('192.168.') ||
                       !isCountrySubdomain; // If first part is NOT a country code, it's root domain
  
  // If accessing root path with a country subdomain, redirect to country page
  // But allow landing page on root domain
  if (pathname === '/' && isCountrySubdomain && !isRootDomain) {
    const country = getCountryFromSubdomain(hostname);
    if (isValidCountryCode(country)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${country}`;
      return NextResponse.redirect(url);
    }
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

