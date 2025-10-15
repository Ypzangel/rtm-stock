import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';

  // Subdominio DEALERS
  if (host.startsWith('dealers.')) {
    if (!req.nextUrl.pathname.startsWith('/dealers')) {
      const url = req.nextUrl.clone();
      url.pathname = '/dealers';
      return NextResponse.redirect(url);
    }
  }

  // Subdominio INTERNAL
  if (host.startsWith('internal.')) {
    if (!req.nextUrl.pathname.startsWith('/internal')) {
      const url = req.nextUrl.clone();
      url.pathname = '/internal';
      return NextResponse.redirect(url);
    }
  }

  // Por defecto: raíz (home)
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dealers/:path*', '/internal/:path*'],
};
