"use client";

import MessageCrad from "@/features/projects/components/message-crad";
import MessageForm from "@/features/projects/components/message-form";
import {getMessages} from "@/features/messages/api/use-get-messages";
import {useSuspenseQuery} from "@tanstack/react-query";
import React, {useEffect, useRef} from "react";
import {Fragment} from "@/db/schema";
import MessageLoading from "@/features/projects/components/message-loading";
import {useInngestSubscription} from "@inngest/realtime/hooks";
import {fetchRealtimeSubscriptionToken} from "@/inngest/angular-agent/actions";

type Props = {
    projectId: string;
    activeFragment: Fragment | null;
    setActiveFragment: (fragment: Fragment | null) => void;
};
export default function MessagesContainer({
                                              projectId,
                                              activeFragment,
                                              setActiveFragment
                                          }: Props) {

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const lastAssistanMessageIdRef = useRef<string | null>(null);


    const {data: messages, refetch} = useSuspenseQuery((() => getMessages(projectId))());
    const {latestData: liveResponse, state, error} = useInngestSubscription({
        refreshToken: async () => await fetchRealtimeSubscriptionToken(projectId),
        enabled: true
    });

    useEffect(() => {
        if (liveResponse?.data && liveResponse.data.status === "completed") {
            console.log("Live response received:", liveResponse);
            refetch()
        }
    }, [liveResponse]);

    useEffect(() => {
        const lastAssistantMessage = messages.findLast(
            (message) => message.message.messageRole === "ASSISTANT" && message.fragment
        )

        if (lastAssistantMessage?.fragment && lastAssistantMessage.message.id !== lastAssistanMessageIdRef.current) {
            lastAssistanMessageIdRef.current = lastAssistantMessage.message.id;
            setActiveFragment(lastAssistantMessage.fragment);
        } else if (!lastAssistantMessage) {
            setActiveFragment(null);
        }
    }, [messages, setActiveFragment]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        })
    }, [messages.length]);


    return (
        <div className="flex flex-col min-h-0 flex-1">
            <div className="flex flex-col min-h-0 flex-1 overflow-y-auto space-y-4 px-2 py-6">

                {messages?.map((message) => (
                    <MessageCrad
                        content={message.message.content}
                        messageRole={message.message.messageRole}
                        messageType={message.message.messageType}
                        key={message.message.id}
                        createdAt={message.message.createdAt}
                        fragment={message.fragment}
                        isActiveFragment={activeFragment?.id === message.fragment?.id}
                        onFragmentClick={(fragment) => setActiveFragment(fragment)}

                    />
                ))}
                {liveResponse?.data.status === "running" && (
                    <MessageLoading message={liveResponse?.data.message}/>
                )}
                {(error || liveResponse?.data.status === "error") && (
                    <div className="text-gray-500 text-center">
                        {liveResponse?.data.status === "error" ? (
                            liveResponse?.data.message || "An error occurred while processing the request."

                        ) : error ? (
                            error?.message || "An error occurred while fetching messages."
                        ) : "An error occurred while processing the request."
                        }
                    </div>

                )}

                <div ref={bottomRef} className="h-0"></div>
            </div>
            <div className="flex-shrink-0 p-4 border-t">
                <MessageForm projectId={projectId}/>
            </div>
        </div>
    );
};
