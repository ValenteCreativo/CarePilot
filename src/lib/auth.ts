import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";

const hasDatabase = !!process.env.DATABASE_URL;

async function safeSetCookie(name: string, value: string, maxAge: number) {
  try {
    const cookieStore = await cookies();
    // In Server Components, setting cookies can throw; catch and continue.
    cookieStore.set(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });
  } catch {
    // Ignore; best-effort cookie set.
  }
}

const COOKIE_NAME = "cp_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getOrCreateUser(): Promise<string> {
  const cookieStore = await cookies();
  const existingUserId = cookieStore.get(COOKIE_NAME)?.value;

  if (!hasDatabase) {
    // Fallback: return a deterministic per-request id without touching the DB.
    const fallbackId = existingUserId || randomUUID();
    await safeSetCookie(COOKIE_NAME, fallbackId, COOKIE_MAX_AGE);
    return fallbackId;
  }

  if (existingUserId) {
    // Verify user exists in DB
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, existingUserId),
    });

    if (existingUser) {
      return existingUser.id;
    }
  }

  // Create new user
  const [newUser] = await db.insert(users).values({}).returning();

  // Best-effort cookie set
  await safeSetCookie(COOKIE_NAME, newUser.id, COOKIE_MAX_AGE);

  return newUser.id;
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  if (!hasDatabase) {
    return userId;
  }

  // Verify user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return existingUser ? existingUser.id : null;
}

export async function setUserCookie(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
