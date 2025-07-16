"use client"

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema, LoginSchemaType} from "@/features/auth/schemas";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/logo";
import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {useLogin} from "@/features/auth/api/use-login";

export default function LoginForm() {
    const router = useRouter();
    const { mutate } = useLogin();

    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            password: "",
            email: "",
        },
    })

    const [isPending, startTransition] = useTransition();
    const onSubmit = (data: LoginSchemaType) => {
        setSuccess(undefined);
        setError(undefined);

        startTransition(() => {
            mutate(data, {
                onSuccess: (data) => {
                    if (data.success) {
                        setSuccess(data.message);
                        router.push("/");
                    } else {
                        setError(data.error);
                    }
                },
                onError: (error) => {
                    setError(error.message || "Bir hata oluştu");
                },
            })


        })
    }

    return (
       <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-primary w-full max-w-md mx-auto h-full flex flex-col justify-center">
               <Logo size={64} className="mx-auto" />
              <h2 className="text-3xl font-bold text-center mb-8 ">Giriş Yap</h2>

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
                <FormField
                     control={form.control}
                     name="password"
                     disabled={isPending}
                     render={({ field }) => (
                          <FormItem>
                            <FormLabel>Şifre</FormLabel>
                            <FormControl>
                                 <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                     )}
                />

               <p className="text-sm text-muted-foreground">
                     <Link href="/forgot-password" className="text-primary hover:underline">
                          Şifremi Sıfırla
                     </Link>
                </p>

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
                    Giriş Yap
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                    Hesabın yok mu?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                        Kayıt Ol
                    </Link>
                </p>
           </form>
       </Form>
    );
}