import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/db/drizzle";
import { resetPasswordTokens, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getResetPasswordTokenByEmail } from "@/data/reset-password-token";

export const generateToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken !== null) {
    try {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, existingToken.identifier));
    } catch (error) {
      console.error("Failed to delete existing token:", error);
      throw new Error("Token generation failed");
    }
  }

  try {
    const verificationToken = await db
      .insert(verificationTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();

    return verificationToken?.[0] || null;
  } catch (error) {
    console.error("Failed to create verification token:", error);
    throw new Error("Token generation failed");
  }
};

export const generateResetPasswordToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const existingToken = await getResetPasswordTokenByEmail(email);

  if (existingToken !== null) {
    try {
      await db
        .delete(resetPasswordTokens)
        .where(eq(resetPasswordTokens.identifier, existingToken.identifier));
    } catch (error) {
      console.error("Failed to delete existing token:", error);
      throw new Error("Token generation failed");
    }
  }

  try {
    const resetPasswordToken = await db
      .insert(resetPasswordTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();

    return resetPasswordToken?.[0] || null;
  } catch (error) {
    console.error("Failed to create reset password token:", error);
    throw new Error("Token generation failed");
  }
};
