import {type DefaultSession} from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    surname: string
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}