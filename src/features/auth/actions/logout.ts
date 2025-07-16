"use server";

import {signOut} from "@/auth";
import {revalidatePath} from "next/cache";

export const logout = async () => {
    try {

    await signOut({
        redirect: false,
    })
    } catch (error) {
        console.error("Logout failed:", error);
        throw new Error("Çıkış yapma başarısız oldu. Lütfen tekrar deneyin.");
    }

    revalidatePath('/', 'layout')

}