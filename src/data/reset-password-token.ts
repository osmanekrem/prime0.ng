"use server";

import { db } from "@/db/drizzle";
import { resetPasswordTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getResetPasswordTokenByToken = async (token: string) => {
  const result = await db
    .select()
    .from(resetPasswordTokens)
    .where(eq(resetPasswordTokens.token, token))
    .limit(1);

  return result[0] || null;
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  const result = await db
    .select()
    .from(resetPasswordTokens)
    .where(eq(resetPasswordTokens.email, email))
    .limit(1);

  return result[0] || null;
};
