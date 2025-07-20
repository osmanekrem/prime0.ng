"use client"

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Loader2Icon, SendIcon} from "lucide-react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {ProjectSchema, ProjectSchemaType} from "@/features/projects/schemas";
import {useCreateProject} from "@/features/projects/api/use-create-project";
import {useRouter} from "next/navigation";

export default function ProjectForm() {
    const {mutate, isPending} = useCreateProject()
    const router = useRouter();

    const form = useForm<ProjectSchemaType>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            value: "",
        }
    })

    const onSubmit = async (data: ProjectSchemaType) => {
        if (!form.formState.isValid) {
            toast.error("Lütfen mesajınızı kontrol edin.");
            return;
        }
        if (isPending) {
            return
        }
        mutate({json: data});
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col rounded-lg bg-muted p-3 w-full max-w-xl gap-2.5 border"
            >
                <FormField
                    control={form.control}
                    name="value"
                    disabled={isPending}
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder="Type your message here..."
                                    {...field}
                                    className="w-full max-h-32 p-2 bg-transparent !border-none focus:outline-none focus:!ring-0 shadow-none resize-none"
                                    rows={4}

                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                            e.preventDefault();
                                            form.handleSubmit(onSubmit)(e);
                                        }
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex gap-x-2 items-end justify-between">
                    <div className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <kbd
                            className="pointer-events-none inline-flex  h-6 border bg-muted select-none items-center gap-1 rounded-md px-1.5 font-mono text-xs font-medium text-muted-foreground">
                        <span>
                            <span className="text-xs">&#8984;</span> <span className="text-xs">Enter</span>
                        </span>
                        </kbd>
                        <span className="ml-1">to send</span>
                    </div>
                    <Button
                        size="icon"
                        disabled={isPending || !form.formState.isValid}
                        type="submit"
                    >
                        {isPending ? (
                            <Loader2Icon className="size-4 animate-spin"/>
                        ) : (
                            <SendIcon className="size-4"/>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
