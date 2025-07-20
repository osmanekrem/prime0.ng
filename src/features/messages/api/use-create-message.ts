import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

import {client} from "@/lib/rpc";
import {InferRequestType, InferResponseType} from "hono";

type ResponseType = InferResponseType<typeof client.api.messages.$post>;
type RequestType = InferRequestType<typeof client.api.messages.$post>;

export const useCreateMessage = () => {
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json}) => {
            const response =  await client.api.messages.$post({json});
            return await response.json();
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({queryKey: ['messages', res.data.projectId]});
        },
        onError: (error) => {
            console.log(error);
            toast.error(`Mesaj gönderilirken bir hata oluştu: ${error.message}`);
        },
    });
};
