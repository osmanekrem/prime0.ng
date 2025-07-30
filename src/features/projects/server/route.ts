import {Hono} from "hono";
import {sessionMiddleware} from "@/lib/session-middleware";
import {ProjectSchema} from "@/features/projects/schemas";
import {zValidator} from "@hono/zod-validator";
import {db} from "@/db/drizzle";
import {messages, projects} from "@/db/schema";
import {inngest} from "@/inngest/angular-agent/client";
import {eq} from "drizzle-orm";
import {generateSlug} from "random-word-slugs";

const app = new Hono()
    .post("/", sessionMiddleware, zValidator("json", ProjectSchema), async (c) => {
        const validatedData = c.req.valid("json");
        const user = c.get("user");


        const newProject = await db.insert(projects).values({
            name: generateSlug(2, {format: "kebab"}),
            userId: user.id!
        }).returning()

        if (newProject.length === 0) {
            return c.json({
                success: false,
                error: "Proje oluşturulurken bir hata oluştu",
                data: null
            }, 500);
        }

        await db.insert(messages).values({
            content: validatedData.value,
            messageRole: "USER",
            messageType: "RESULT",
            projectId: newProject[0].id!,
        })

        await inngest.send({
            name: "optimizer-agent/run",
            data: {
                value: validatedData.value,
                projectId: newProject[0].id!,
            }
        })

        return c.json({
            success: true,
            data: newProject[0],
            error: null
        });
    })
    .get("/", sessionMiddleware, async (c) => {
        const user = c.get("user");

        const userProjects = await db.select().from(projects).where(eq(projects.userId, user.id!))

        return c.json({
            success: true,
            data: userProjects,
        });
    })
    .get("/:projectId", sessionMiddleware, async (c) => {
        const {projectId} = c.req.param();

        const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

        if (project.length === 0) {
            return c.json({
                success: false,
                error: "Proje bulunamadı",
                data: null
            }, 404);
        }

        return c.json({
            success: true,
            data: project[0],
        });
    });


export default app