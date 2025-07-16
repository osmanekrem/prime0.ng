import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {logout} from "@/features/auth/actions/logout";
import {useRouter} from "next/navigation";

export const useLogout = () => {
    const queryClient = useQueryClient()
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            await logout()
        },
        onSuccess: () => {
            router.refresh()
            queryClient.invalidateQueries({queryKey: ['teams']});
            queryClient.invalidateQueries({queryKey: ['currentUser']});
            queryClient.invalidateQueries({queryKey: ['teamMembers']})
        },
        onError: (error) => {
            toast.error(`Çıkış yapılırken bir hata oluştu: ${error.message}`);
            console.log(error);
        },
    });

}