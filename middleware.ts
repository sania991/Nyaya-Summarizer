import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedPaths = ['/dashboard', '/upload', '/judgments', '/hearings', '/api/judgments', '/api/hearings'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!protectedPaths.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('session')?.value;
  try {
    if (!token) throw new Error('no token');
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-secret-change-me'));
    return NextResponse.next();
  } catch {
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };
