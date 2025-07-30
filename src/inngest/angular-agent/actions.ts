"use server";

import {getSubscriptionToken, Realtime} from "@inngest/realtime";
import {inngest, projectChannel} from "@/inngest/angular-agent/client";

export type ProjectToken = Realtime.Token<typeof projectChannel, ["status"]>;

export async function fetchRealtimeSubscriptionToken(projectId: string): Promise<ProjectToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: projectChannel(projectId),
        topics: ["status"],
    });

    return token;
}