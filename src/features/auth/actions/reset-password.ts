"use server"

import { ResponseType} from "@/lib/schema";
import {ResetPasswordSchema, ResetPasswordSchemaType} from "@/features/auth/schemas";

import {getUserByEmail} from "@/data/user";
import {generateResetPasswordToken} from "@/features/auth/lib/tokens";
import {sendPasswordResetEmail} from "@/features/auth/lib/mail";

export async function resetPassword(values: ResetPasswordSchemaType): Promise<ResponseType<null>> {
    const validatedData = ResetPasswordSchema.safeParse(values);

    if (!validatedData.success) {
        return {
            success: false,
            error: "Geçersiz bilgiler"
        };
    }

    const {email} = validatedData.data;

    const user = await getUserByEmail(email);
    if (!user) {
        return {
            success: false,
            error: "Bu e-posta adresi kayıtlı değil"
        };
    }

    const resetToken = await generateResetPasswordToken(email);

    if(!resetToken) {
        return {
            success: false,
            error: "Sıfırlama bağlantısı oluşturulamadı"
        };
    }

    await sendPasswordResetEmail(
        resetToken.email,
        resetToken.token
    )

    return {
        success: true,
        message: "Sıfırlama bağlantısı e-posta adresinize gönderildi"
    }
}