import React from "react";
import ProjectView from "@/features/projects/views/project-view";
import {QueryErrorResetBoundary} from "@tanstack/react-query";
import {getMessages} from "@/features/messages/api/use-get-messages";
import {getQueryClient} from "@/lib/get-query-client";
import { useGetProject} from "@/features/projects/api/use-get-project";

type Props = {
    params: Promise<{
        projectId: string;
    }>
};
export default async function ProjectPage({params}: Props) {
    const {projectId} = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery((() => getMessages(projectId))());
    void queryClient.prefetchQuery((() => useGetProject(projectId))());


    return (
        <QueryErrorResetBoundary>
            <React.Suspense fallback={"loading..."}>

            <ProjectView projectId={projectId}/>
            </React.Suspense>
        </QueryErrorResetBoundary>
    );
};
