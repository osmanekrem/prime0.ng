"use server";

import {getVerificationTokenByToken} from "@/data/verification-token";
import {getUserByEmail} from "@/data/user";
import {db} from "@/db/drizzle";
import {users, verificationTokens} from "@/db/schema";
import {eq} from "drizzle-orm";

export const verifyEmail = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return {
            success: false,
            error: "Geçersiz token"
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

    if (existingUser.emailVerified) {
        return {
            success: false,
            error: "Kullanıcı zaten doğrulanmış"
        };
    }

    await db.update(users).set({emailVerified: new Date()}).where(eq(users.id, existingUser.id));

    await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

    return {
        success: true,
        message: "E-posta başarıyla doğrulandı"
    }

}