"use client";

import {useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {verifyEmail} from "@/features/auth/actions/email-verify";
import Logo from "@/components/logo";
import Link from "next/link";

export default function VerifyForm() {
    const searchParams = useSearchParams();

    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);


    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        setSuccess(undefined);
        setError(undefined);


        if (!token) {
            setError("Geçersiz veya eksik doğrulama bağlantısı.");
            return;
        }


        verifyEmail(token).then(
            (result) => {
                if (result.success) {
                    setSuccess(result.message);
                } else {
                    setError(result.error);
                }
            }
        ).catch((_) => {
            setError("An error occurred while verifying your email. Please try again later.");
        }
        )
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);
    return (
        <div className="space-y-6 text-primary w-full max-w-md mx-auto h-full flex flex-col justify-center">
            <Logo size={64} className="mx-auto" />
            <h2 className="text-3xl font-bold text-center mb-8 ">
                E-Posta Doğrulama
            </h2>


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

            <p className="text-center text-sm text-muted-foreground mt-4">
                <Link href="/login" className="text-primary hover:underline">
                    Giriş Yap
                </Link>
            </p>
        </div>
    );
}