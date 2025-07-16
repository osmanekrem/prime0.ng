import {Hono} from "hono";
import {sessionMiddleware} from "@/lib/session-middleware";

const app = new Hono()
    .get("/current", sessionMiddleware, async (c) => {
        const user = c.get("user");

        return c.json({
            success: true,
            data: user
        });
    })


export default app