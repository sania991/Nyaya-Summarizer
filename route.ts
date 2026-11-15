import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const user = email ? await db.user.findUnique({ where: { email: String(email).toLowerCase() } }) : null;
  if (!user || !(await bcrypt.compare(password ?? '', user.password)))
    return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  await createSession({ id: user.id, name: user.name, role: user.role });
  return NextResponse.json({ ok: true });
}
