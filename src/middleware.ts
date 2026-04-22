import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth0 } from '@/lib/auth0';
import { isSafeReturnTo } from '@/lib/safe-return-to';

const PUBLIC_FILE = /\.(ico|png|svg|jpg|jpeg|gif|webp|woff2?|ttf|eot)$/i;

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') {
    return true;
  }
  if (pathname.startsWith('/auth')) {
    return true;
  }
  if (pathname === '/login') {
    return true;
  }
  return false;
}

function appBaseFromRequest(request: NextRequest): string {
  return `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

export async function middleware(request: NextRequest) {
  if (PUBLIC_FILE.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;
  if (pathname === '/auth/login' || pathname === '/auth/login/') {
    const returnTo = searchParams.get('returnTo');
    if (returnTo) {
      const decoded = decodeURIComponent(returnTo);
      if (!isSafeReturnTo(decoded, appBaseFromRequest(request))) {
        const clean = request.nextUrl.clone();
        clean.searchParams.delete('returnTo');
        return NextResponse.redirect(clean);
      }
    }
  }

  const authRes = await auth0.middleware(request);

  if (isPublicPath(pathname)) {
    return authRes;
  }

  const session = await auth0.getSession(request);
  if (!session) {
    const { origin } = new URL(request.url);
    const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    const login = new URL('/auth/login', origin);
    if (returnTo && returnTo !== '/') {
      login.searchParams.set('returnTo', returnTo);
    }
    return NextResponse.redirect(login);
  }

  return authRes;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:ico|png|svg|jpg|jpeg|gif|webp)$).*)',
  ],
};
