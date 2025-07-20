"use client"

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ResetPasswordSchema, ResetPasswordSchemaType} from "@/features/auth/schemas";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/logo";
import {useState, useTransition} from "react";
import {resetPassword} from "@/features/auth/actions/reset-password";

export default function ForgotPasswordForm() {

    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const form = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const [isPending, startTransition] = useTransition();
    const onSubmit = (data: ResetPasswordSchemaType) => {
        setSuccess(undefined);
        setError(undefined);

        startTransition(() => {
            resetPassword(data).then((result) => {
                if (result.success) {
                    setSuccess(result.message);

                } else {

                    setError(result.error);
                }
            })

        })
    }

    return (
       <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-primary w-full max-w-md mx-auto h-full flex flex-col justify-center">
               <Logo size={64} className="mx-auto" />
              <h2 className="text-3xl font-bold text-center mb-8 ">
                     Şifremi Unuttum
              </h2>

               <FormField
                   control={form.control}
                   name="email"
                     disabled={isPending}
                   render={({ field }) => (
                       <FormItem>
                           <FormLabel>E-Posta</FormLabel>
                           <FormControl>
                               <Input placeholder="jhondoe@email.com" {...field} />
                           </FormControl>
                           <FormMessage />
                       </FormItem>
                   )}
               />

               {success && (
                   <div className="text-green-700 bg-green-600/10  rounded-md px-3 py-2.5 text-center">
                       {success}
                   </div>
               )}
               {error && (
                   <div className="text-red-700 bg-red-600/10  rounded-md px-3 py-2.5 text-center">
                       {error}
                   </div>
               )}
                <Button disabled={isPending} type="submit" className="w-full">
                    Şifre Sıfırla
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">

                    <Link href="/login" className="text-primary hover:underline">
                        Giriş Yap
                    </Link>
                </p>
           </form>
       </Form>
    );
}