"use client";

import MessageCrad from "@/features/projects/components/message-crad";
import MessageForm from "@/features/projects/components/message-form";
import {useGetMessages} from "@/features/messages/api/use-get-messages";
import {useSuspenseQuery} from "@tanstack/react-query";
import React, {useEffect, useRef} from "react";
import {Fragment} from "@/db/schema";
import MessageLoading from "@/features/projects/components/message-loading";

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

    const {data: messages} = useSuspenseQuery((() => useGetMessages(projectId))());
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

    const isLastMessageUser = messages.length > 0 && messages[messages.length - 1].message.messageRole === "USER";

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
            {isLastMessageUser && (
                <MessageLoading />
            )}
            <div ref={bottomRef} className="h-0"></div>
            </div>
            <div className="flex-shrink-0 p-4 bg-white border-t">
                <MessageForm projectId={projectId} />
            </div>
        </div>
    );
};
