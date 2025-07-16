"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (user.length === 0) {
    return null;
  }
  return user[0];
};

export const getUserById = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (user.length === 0) {
    return null;
  }
  return user[0];
};
