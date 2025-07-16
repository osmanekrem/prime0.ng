import LoginForm from "@/features/views/login-form";

export const metadata = {
    title: "Giriş Yap",
    description: "TaskMaster hesabınıza giriş yapın",
}

export default async function  LoginPage() {

    return (
        <LoginForm/>
    );
}