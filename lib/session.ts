import { SignJWT, jwtVerify } from 'jose';

// Pure jose + constants only — no `next/headers`, no `fs`. This file is imported
// by middleware.ts (Edge runtime) as well as by server-only code (lib/auth.ts,
// actions/auth.ts), so it must not pull in anything Node/RSC-request-scoped.

export const SESSION_COOKIE = 'po_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error(
    'SESSION_SECRET environment variable is not set. Add it to .env.local.'
  );
}
const encodedSecret = new TextEncoder().encode(secret);

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(encodedSecret);
}

export async function verifySessionToken(
  token: string
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}
