"use server";

import {ResponseType} from "@/lib/schema";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";
import {getUserByEmail} from "@/data/user";
import {generateToken} from "@/features/auth/lib/tokens";
import {LoginSchema, LoginSchemaType} from "@/features/auth/schemas";
import {revalidatePath} from "next/cache";
import {sendVerificationEmail} from "@/features/auth/lib/mail";

export async function login(values: LoginSchemaType): Promise<ResponseType<null>> {
    try {
    const validatedData = LoginSchema.safeParse(values);

    if (!validatedData.success) {
        return {
            success: false,
            error: "Geçersiz bilgiler"
        };
    }

    const {email, password} = validatedData.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password) {
    return {
            success: false,
            error: "E-posta veya şifre yanlış"
        };
    }

    if(!existingUser.emailVerified) {
        const verificationToken = await generateToken(email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );


        return {
            success: true,
            message: "Doğrulama e-postası gönderildi, lütfen hesabınızı doğrulayın",
        };
    }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return {
                success: false,
                error: result.error,
            };
        }

        revalidatePath('/', 'layout')
        return {
            success: true,
        };
    } catch (error) {
       if(error instanceof AuthError) {
           switch(error.type) {
               case("CredentialsSignin"):
                   return {
                       success: false,
                       error: "E-posta veya şifre yanlış"
                   };

               default:
                   return {
                       success: false,
                       error: "Birşeyler ters gitti, lütfen daha sonra tekrar deneyin"
                   };

           }
       }


         return {
              success: false,
              error: "Bir hata oluştu, lütfen daha sonra tekrar deneyin"
         };
    }

}