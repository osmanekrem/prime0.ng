import {queryOptions} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetMessages = (projectId: string) => {
    return queryOptions({
        queryKey: ["messages", projectId],
        queryFn: async () => {
            if (!projectId) {
                throw new Error("Proje ID'si bulunamadı");
            }
            const response = await client.api.messages.$get({query: {
                    projectId
                }})
            const result = await response.json();

            return result.data || []
        },
        enabled: !!projectId,
        refetchInterval: 5000,
    })


}