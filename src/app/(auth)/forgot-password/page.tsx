import {Metadata} from "next";
import ForgotPasswordForm from "@/features/views/forgot-password-form";

export const metadata: Metadata = {
    title: 'Şifremi Unuttum'
}

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}