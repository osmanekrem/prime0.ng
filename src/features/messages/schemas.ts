import {z} from "zod";

export const MessageSchema = z.object({
    value: z.string().min(1, "Mesaj boş olamaz"),
    projectId: z.string().min(1, "Proje ID boş olamaz")
})

export type MessageSchemaType = z.infer<typeof MessageSchema>;

export const GetMessagesSchema = z.object({
    projectId: z.string().min(1, "Proje ID boş olamaz")
})

export type GetMessagesSchemaType = z.infer<typeof GetMessagesSchema>;