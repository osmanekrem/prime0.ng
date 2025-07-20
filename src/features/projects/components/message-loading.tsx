import React, {useEffect} from 'react'
import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import Logo from "@/components/logo";
import {format} from "date-fns";
import {CodeIcon} from "lucide-react";


export function ShimmerMessages() {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const messages = [
        "Thinking...",
        "Generating response...",
        "Processing your request...",
        "Building your website...",
        "Crafting components...",
        "Optimizing layout...",
        "Adding final touches...",
        "Almost ready..."
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000)
        return () => clearInterval(interval);
    }, []);

    return (
        <p className="text-muted-foreground animate-pulse">{messages[currentIndex]}</p>
    )
}


export default function MessageLoading() {
    return (
        <div className="flex justify-start">
            <Card
                className={cn("rounded-lg p-3 shadow-none border-none break-words")}
            >
                <div className="flex items-center gap-2 text-black">
                    <div className="size-8 rounded-full bg-primary-foreground ring ring-primary flex items-center justify-center">
                        <Logo size={24} />
                    </div>
                    <span >Taskmaster</span>
                </div>
                <div className={"pl-10"}>
                    <ShimmerMessages />
                </div>
            </Card>
        </div>
    )
}
