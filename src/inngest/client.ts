import { Inngest } from "inngest";
import { channel, realtimeMiddleware, topic } from "@inngest/realtime";
import {z} from "zod";

export const inngest = new Inngest({
  id: "taskmaster",
  middleware: [realtimeMiddleware()],
});

export const projectChannel = channel(
  (projectId: string) => `project:${projectId}`,
).addTopic(
    topic("status").schema(
        z.object({
            status: z.enum(["running", "completed", "error"]),
            message: z.string().optional()
        })
    )
);
