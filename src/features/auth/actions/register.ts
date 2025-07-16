"use server";

import { ResponseType } from "@/lib/schema";
import { RegisterSchema, RegisterSchemaType } from "@/features/auth/schemas";
import bcryptjs from "bcryptjs";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "@/features/auth/lib/tokens";
import { sendVerificationEmail } from "@/features/auth/lib/mail";

export async function register(
  values: RegisterSchemaType
): Promise<ResponseType<null>> {
  const validatedData = RegisterSchema.safeParse(values);

  if (!validatedData.success) {
    return {
      success: false,
      error: "Geçersiz bilgiler",
    };
  }

  const { name, surname, email, password } = validatedData.data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existingUser.length > 0) {
    return {
      success: false,
      error: "Bu e-posta adresi zaten kayıtlı",
    };
  }

  const hashedPassword = await bcryptjs.hash(password, 12);

  const newUser = {
    name,
    surname,
    email,
    password: hashedPassword,
  };

  try {
    await db.insert(users).values(newUser);

    const verificationToken = await generateToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return {
      success: false,
      error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
  return {
    success: true,
    message: "e-posta gönderildi, lütfen hesabınızı doğrulayın",
  };
}
