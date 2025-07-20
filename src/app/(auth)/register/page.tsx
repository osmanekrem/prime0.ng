import RegisterForm from "@/features/auth/views/register-form";

export const metadata = {
    title: "Kayıt Ol",
    description: "TaskMaster hesabı oluşturun",
}

export default function RegisterPage() {
    return (
        <RegisterForm />
    );
}