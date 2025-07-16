import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useCurrent = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await client.api.user.current.$get()
            if (!response.ok) {
                throw new Error("Kullanıcı getirilirken bir hata oluştu");
            }
            const json = await response.json();

            return json.data;
        }
    })


}