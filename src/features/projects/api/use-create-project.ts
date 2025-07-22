import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {client} from "@/lib/rpc";
import {InferRequestType, InferResponseType} from "hono";
import {useRouter} from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.projects.$post>;
type RequestType = InferRequestType<typeof client.api.projects.$post>;

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json}) => {
            const response =  await client.api.projects.$post({json});
            return await response.json();
        },
        onSuccess: (
            res
        ) => {
            queryClient.setQueryData(['projects'], (oldData: any) => {
                if (!oldData) return [res.data];
                return [...oldData, res.data];
            });
            router.push(`/projects/${res.data?.id}`);
        },
        onError: (error) => {
            console.log(error);
            toast.error(`Mesaj gönderilirken bir hata oluştu: ${error.message}`);
        },
    });
};
