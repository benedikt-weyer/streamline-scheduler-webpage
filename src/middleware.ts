import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Check if request is from old streamline-scheduler.com domain
  if (hostname.includes('streamline-scheduler.com')) {
    // If not already on the rebranded page, redirect to it
    if (!request.nextUrl.pathname.startsWith('/rebranded')) {
      const url = request.nextUrl.clone();
      url.pathname = '/rebranded';
      return NextResponse.rewrite(url);
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

