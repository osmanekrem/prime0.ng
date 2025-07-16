"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterSchemaType } from "@/features/auth/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { register } from "@/features/auth/actions/register";
import Logo from "@/components/logo";

export default function RegisterForm() {
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
      name: "",
      surname: "",
      email: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: RegisterSchemaType) => {
    setSuccess(undefined);
    setError(undefined);

    startTransition(() => {
      register(data)
        .then((result) => {
          if (result.success) {
            setSuccess(result.message);
          } else {
            setError(result.error);
          }
        })
        .catch((error) => {
          console.error(error);
          setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-primary w-full max-w-md mx-auto h-full flex flex-col justify-center"
      >
        <Logo size={64} className="mx-auto" />
        <h2 className="text-3xl font-bold text-center mb-8 ">Kayıt Ol</h2>

        <FormField
          control={form.control}
          name="name"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad</FormLabel>
              <FormControl>
                <Input placeholder="Jhon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soyad</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jhondoe@email.com"
                  {...field}
                />
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
        <FormField
          control={form.control}
          name="passwordConfirm"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre Tekrar</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
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
          Kayıt Ol
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Hesabın var mı?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Giriş Yap
          </Link>
        </p>
      </form>
    </Form>
  );
}
