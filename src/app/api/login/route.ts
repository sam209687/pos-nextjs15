// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth/auth';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const user = await login(username, password);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const session = { user };
  const cookie = serialize('session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  const response = NextResponse.json({ success: true, role: user.role });
  response.headers.set('Set-Cookie', cookie);
  return response;
}