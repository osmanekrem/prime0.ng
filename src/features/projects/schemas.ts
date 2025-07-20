import {z} from "zod";

export const ProjectSchema = z.object({
    value: z.string().min(1, "Mesaj boş olamaz")
})

export type ProjectSchemaType = z.infer<typeof ProjectSchema>;