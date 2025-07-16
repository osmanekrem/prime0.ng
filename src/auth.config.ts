import {AuthConfig} from "@auth/core";
import Credentials from "@auth/core/providers/credentials";
import {LoginSchema} from "@/features/auth/schemas";
import {getUserByEmail} from "@/data/user";
import bcryptjs from "bcryptjs";

export const authConfig = {providers: [
        Credentials({
            async authorize(credentials) {
                const validatedCredentials = LoginSchema.safeParse(credentials)

                if(validatedCredentials.success) {
                    const {email, password} = validatedCredentials.data;

                    const user = await getUserByEmail(email)

                    if(!user || !user.password) return null

                    const isPasswordValid = await bcryptjs.compare(password, user.password)

                    if(isPasswordValid) return user
                }

                return null;
            }
        })
    ]} satisfies AuthConfig