import { NextResponse, type NextRequest } from 'next/server';
import { getCookie } from 'cookies-next';


export function middleware(request: NextRequest) {
  const excludedPaths = [
    '/_next/static/',
    '/favicon.ico',
    '/_next/',
    '/public/',
    '/assets/',
    '/fonts.googleapis.com/',
    '/fonts.gstatic.com/',
  ];


  for (const path of excludedPaths) {
    if (request.nextUrl.pathname.startsWith(path)) {
      return NextResponse.next();
    }
  }


  const token = getCookie('user', { req: request });
  if (token) {
    if (request.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  } else {
    if (request.nextUrl.pathname === '/auth/login') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
}


export const config = {
  matcher: ['/((?!_next/static|favicon.ico|public/).*)'],
};
