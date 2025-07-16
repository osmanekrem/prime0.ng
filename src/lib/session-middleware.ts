import "server-only"

import {ExtendedUser} from "@/next-auth";
import {createMiddleware} from "hono/factory";
import {auth} from "@/auth";

type AddedContext = {
    Variables: {
        user: ExtendedUser;
    }
}

export const sessionMiddleware = createMiddleware<AddedContext>(
    async (c, next) => {
        const session = await auth()


        if (!session?.user?.id) {
            return c.json({error: "Unauthorized"}, 401);
        }


        c.set("user", session.user);
        return next();
    }
)