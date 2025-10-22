import { NextResponse } from 'next/server';

export function GET() {
  const body = `User-agent: *
Disallow: /`;
  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
