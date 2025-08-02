import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {client} from "@/lib/rpc";
import {InferRequestType, InferResponseType} from "hono";
import {Project} from "@/db/schema";

type ResponseType = InferResponseType<typeof client.api.projects[':projectId']['$delete']>;
type RequestType = InferRequestType<typeof client.api.projects[':projectId']['$delete']>;

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.projects[':projectId'].$delete({param});
            return await response.json();
        },
        onSuccess: (
            res
        ) => {
            queryClient.setQueryData(['projects'], (oldData: Project[]) => {
                if (!res.data) return [...oldData];
                return [...oldData.filter(o => o.id !== res.data.id)];
            });
        },
        onError: (error) => {
            console.log(error);
            toast.error(`An error occurred while deleting project: ${error.message}`);
        },
    });
};
