import { cookies } from 'next/headers';
import * as jose from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod'
);

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    if (!payload.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      include: {
        scripts: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    return user;
  } catch (error: any) {
    console.error('Auth verification failed:', error);
    
    // If it's a Prisma connection error, throw it so the Error Boundary can catch it
    if (error?.code?.startsWith('P') || error?.message?.includes('connection') || error?.message?.includes('Database')) {
      throw new Error('DATABASE_CONNECTION_FAILURE');
    }
    
    return null;
  }
}
