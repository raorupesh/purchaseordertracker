import { readFile } from 'fs/promises';
import path from 'path';
import type { UserProfile, PublicUser } from '../types';

// NOTE: Uses the local filesystem — same convention as lib/order.ts.
const DATA_PATH = path.join(process.cwd(), 'data', 'users.json');

async function getAllUsers(): Promise<UserProfile[]> {
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw) as UserProfile[];
}

function toPublicUser(user: UserProfile): PublicUser {
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dob: user.dob,
    position: user.position,
  };
}

export async function getUserByUsername(
  username: string
): Promise<UserProfile | undefined> {
  const users = await getAllUsers();
  return users.find((u) => u.username === username);
}

export async function getUserById(id: string): Promise<PublicUser | undefined> {
  const users = await getAllUsers();
  const user = users.find((u) => u.id === id);
  return user ? toPublicUser(user) : undefined;
}
