import { cookies } from "next/headers";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "cp_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getOrCreateUser(): Promise<string> {
  const cookieStore = await cookies();
  const existingUserId = cookieStore.get(COOKIE_NAME)?.value;

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

  // Set cookie - note: this only works in server actions or route handlers
  // For regular server components, we need to handle this differently
  cookieStore.set(COOKIE_NAME, newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return newUser.id;
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;

  if (!userId) {
    return null;
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
