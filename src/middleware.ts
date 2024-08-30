import { NextResponse, type NextRequest } from 'next/server';
import { getCookie } from 'cookies-next';

export async function middleware(request: NextRequest) {

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

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  const user: any = getCookie('user', { req: request });

  if (user) {
    const token = JSON.parse(user);
    if (request.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  } else {
    if (request.nextUrl.pathname === '/auth/login') {
      return NextResponse.next();
    } else if (request.nextUrl.pathname === '/auth/login-step') {
      return NextResponse.next();
    } else if (request.nextUrl.pathname === '/auth/login-step/login-otp') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
}


export const config = {
  matcher: ['/((?!_next/static|favicon.ico|public/).*)'],
};
