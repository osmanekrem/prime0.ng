import React from "react";
import ProjectView from "@/features/projects/views/project-view";
import {db} from "@/db/drizzle";
import { projects} from "@/db/schema";
import {eq} from "drizzle-orm";
import {QueryErrorResetBoundary} from "@tanstack/react-query";
import {useGetMessages} from "@/features/messages/api/use-get-messages";
import {getQueryClient} from "@/lib/get-query-client";
import {useGetProject} from "@/features/projects/api/use-get-project";

type Props = {
    params: Promise<{
        projectId: string;
    }>
};
export default async function ProjectPage({params}: Props) {
    const {projectId} = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery((() => useGetMessages(projectId))());
    void queryClient.prefetchQuery((() => useGetProject(projectId))());


    return (
        <QueryErrorResetBoundary>
            <React.Suspense fallback={"loading..."}>

            <ProjectView projectId={projectId}/>
            </React.Suspense>
        </QueryErrorResetBoundary>
    );
};
