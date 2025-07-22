import {queryOptions, useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";




export const getProjects =  queryOptions({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await client.api.projects.$get()
            const json = await response.json();

            return json.data || []
        }
    })