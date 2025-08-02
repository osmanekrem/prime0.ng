import {Hono} from "hono";
import {sessionMiddleware} from "@/lib/session-middleware";
import {GetMessagesSchema, MessageSchema} from "@/features/messages/schemas";
import {zValidator} from "@hono/zod-validator";
import {db} from "@/db/drizzle";
import {fragments, messages} from "@/db/schema";
import {inngest} from "@/inngest/angular-agent/client";
import {asc, eq} from "drizzle-orm";

const app = new Hono()
    .post("/", sessionMiddleware, zValidator("json", MessageSchema), async (c) => {
        const validatedData = c.req.valid("json");

        const newMessage = await db.insert(messages).values({
            content: validatedData.value,
            messageRole: "USER",
            messageType: "RESULT",
            projectId: validatedData.projectId
        }).returning();

        await inngest.send({
            name: "angular-agent/run",
            data: {
                value: validatedData.value,
                projectId: validatedData.projectId,
            }
        })

        return c.json({
            success: true,
            data: {message: newMessage[0], fragment: null},
        });
    })
    .get("/", sessionMiddleware, zValidator("query", GetMessagesSchema), async (c) => {
        const validatedData = c.req.valid("query");

        const projectMessages = await db.select().from(messages).where(eq(messages.projectId, validatedData.projectId)).orderBy(asc(messages.createdAt)).leftJoin(fragments, eq(messages.id, fragments.messageId))

        return c.json({
            success: true,
            data: projectMessages,
        });
    })


export default app