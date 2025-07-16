"use server";

import {NewPasswordSchema, NewPasswordSchemaType} from "@/features/auth/schemas";
import {getResetPasswordTokenByToken} from "@/data/reset-password-token";
import {getUserByEmail} from "@/data/user";
import bcryptjs from "bcryptjs";
import {db} from "@/db/drizzle";
import {resetPasswordTokens, users} from "@/db/schema";
import {eq} from "drizzle-orm";

export const newPassword = async (values: NewPasswordSchemaType, token?: string) => {
    if (!token) {
        return {
            success: false,
            error: "Geçersiz token"
        };
    }

    const validatedData = NewPasswordSchema.safeParse(values);

    if (!validatedData.success) {
        return {
            success: false,
            error: "Geçersiz bilgiler"
        };
    }

    const {password} = validatedData.data;

    const existingToken = await getResetPasswordTokenByToken(token);

    if (!existingToken) {
        return {
            success: false,
            error: "Geçersiz veya süresi dolmuş token"
        };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return {
            success: false,
            error: "Token süresi dolmuş"
        };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return {
            success: false,
            error: "Kullanıcı bulunamadı"
        };
    }

    const hashedPassword = await bcryptjs.hash(password, 12);


    await db.update(users).set({
        password: hashedPassword,
    }).where(eq(users.id, existingUser.id));

    await db.delete(resetPasswordTokens).where(eq(resetPasswordTokens.identifier, existingToken.identifier));

    return {
        success: true,
        message: "Şifre başarıyla değiştirildi"
    };
}
