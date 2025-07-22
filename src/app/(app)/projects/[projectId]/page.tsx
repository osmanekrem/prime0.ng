import React from "react";
import ProjectView from "@/features/projects/views/project-view";
import {QueryErrorResetBoundary} from "@tanstack/react-query";
import {getMessages} from "@/features/messages/api/use-get-messages";
import {getQueryClient} from "@/lib/get-query-client";
import { useGetProject} from "@/features/projects/api/use-get-project";
import {db} from "@/db/drizzle";
import {projects} from "@/db/schema";
import {eq} from "drizzle-orm";
import {Metadata} from "next";
import {notFound} from "next/navigation";

// export const revalidate = 60;
//
// export const dynamicParams = true;
//
// export async function generateMetadata({params}: {
//     params: Promise<{
//         projectId: string;
//     }>
// }): Promise<Metadata> {
//     const {projectId} = await params;
//     const data = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
//
//     if(!data || data.length === 0) {
//         return notFound();
//     }
//
//     return {
//         title: data[0]?.name || "Proje",
//         description: `Proje sayfası: ${data[0]?.name || "Proje"}`
//     };
// }
//
//     export async function generateStaticParams() {
//         const data = await db.select().from(projects)
//         return data.map((project) => ({
//             id: project.id,
//         }))
//     }

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
