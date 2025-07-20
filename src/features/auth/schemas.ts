import {z} from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Geçerli bir e-posta adresi girin"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır")
})

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    name: z.string().min(1, "İsim boş olamaz").max(100, "İsim 100 karakterden uzun olamaz"),
    surname: z.string().min(1, "Soyisim boş olamaz").max(100, "Soyisim 100 karakterden uzun olamaz"),
    email: z.string().email("Geçerli bir e-posta adresi girin"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    passwordConfirm: z.string().min(8, "Şifre en az 8 karakter olmalıdır")
}).refine(
    (data) => data.password === data.passwordConfirm,
    {
        message: "Şifreler eşleşmiyor",
        path: ["passwordConfirm"]
    })

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const ResetPasswordSchema = z.object({
    email: z.string().email("Geçerli bir e-posta adresi girin"),
})

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const NewPasswordSchema = z.object({
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
    passwordConfirm: z.string().min(8, "Şifre en az 8 karakter olmalıdır")
}).refine(
    (data) => data.password === data.passwordConfirm,
    {
        message: "Şifreler eşleşmiyor",
        path: ["passwordConfirm"]

    })

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;