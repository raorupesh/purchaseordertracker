import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from './session';
import { getUserById } from './users';
import type { PublicUser } from '../types';

// Server-only: reads the request-scoped cookie jar, so this must never be
// imported from middleware.ts (Edge runtime, no next/headers request scope).
export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = await verifySessionToken(token);
  if (!userId) return null;

  const user = await getUserById(userId);
  return user ?? null;
}
