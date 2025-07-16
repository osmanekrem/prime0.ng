"use server";

import { db } from "@/db/drizzle";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getVerificationTokenByToken = async (token: string) => {
  const result = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token))
    .limit(1);

  return result[0] || null;
};

export const getVerificationTokenByEmail = async (email: string) => {
  const result = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.email, email))
    .limit(1);

  return result[0] || null;
};
