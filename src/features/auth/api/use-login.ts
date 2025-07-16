import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {LoginSchemaType} from "@/features/auth/schemas";
import {login} from "@/features/auth/actions/login";
import {ResponseType} from "@/lib/schema";

export const useLogin = () => {
    const queryClient = useQueryClient()
    const router = useRouter();

    return useMutation<ResponseType<null>, Error, LoginSchemaType>({
        mutationFn: async (values) => {
            return await login(values)
        },
        onSuccess: () => {
            router.refresh()
            queryClient.invalidateQueries({queryKey: ['teams']});
            queryClient.invalidateQueries({queryKey: ['currentUser']});
            queryClient.invalidateQueries({queryKey: ['teamMembers']})
        },
        onError: (error) => {
            console.log(error);
            toast.error(`Çıkış yapılırken bir hata oluştu: ${error.message}`);
        },
    });

}