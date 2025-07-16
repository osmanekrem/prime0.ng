import {v4 as uuidv4} from 'uuid';
import {getVerificationTokenByEmail} from "@/data/verification-token";
import {db} from "@/db/drizzle";
import {resetPasswordTokens, verificationTokens} from "@/db/schema";
import {eq} from "drizzle-orm";
import {getResetPasswordTokenByEmail} from "@/data/reset-password-token";

export const generateToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(Date.now() + (24 *  60 * 60 * 1000));

    const existingToken = await getVerificationTokenByEmail(email)

    if(existingToken !== null) {
        await db.delete(verificationTokens).where(eq(verificationTokens.identifier, existingToken.identifier));
    }

    const verificationToken = await db.insert(verificationTokens).values({
        email,
        token,
        expires,
    }).returning()

    return verificationToken?.[0] || null
}

export const generateResetPasswordToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(Date.now() + (24 * 60 * 60 * 1000));

    const existingToken = await getResetPasswordTokenByEmail(email)

    if(existingToken !== null) {
        await db.delete(resetPasswordTokens).where(eq(resetPasswordTokens.identifier, existingToken.identifier));
    }

    const resetPasswordToken = await db.insert(resetPasswordTokens).values({
        email,
        token,
        expires,
    }).returning()

    return resetPasswordToken?.[0] || null
}