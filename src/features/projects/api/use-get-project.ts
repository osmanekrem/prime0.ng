import {queryOptions} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetProject = (projectId: string) => {
    return queryOptions({
        queryKey: ["projects", projectId],
        queryFn: async () => {
            if (!projectId) {
                throw new Error("Proje ID'si bulunamadı");
            }
            const response = await client.api.projects[':projectId'].$get({param: {projectId}})
            const result = await response.json();

            return result?.data ?? null;
        },
        enabled: !!projectId,
    })


}