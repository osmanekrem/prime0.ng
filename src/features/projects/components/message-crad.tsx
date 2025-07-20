import {Fragment} from "@/db/schema";
import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import Logo from "@/components/logo";
import {CodeIcon} from "lucide-react";

type Props = {
    content: string;
    messageRole: "USER" | "ASSISTANT";
    messageType: "RESULT" | "ERROR";
    createdAt: string;
    fragment: Fragment | null;
    isActiveFragment?: boolean;
    onFragmentClick?: (fragment: Fragment) => void;
};
export default function MessageCrad({
    content,
    messageRole,
    messageType,
    createdAt,
    fragment,
    isActiveFragment = false,
    onFragmentClick = () => {},
                                    }: Props) {
    if(messageRole === "USER") {
        return (
            <div className="flex pl-8 justify-end">
                <Card className="rounded-lg bg-muted p-3 shadow-none border-none break-words">
                    <p className="text-foreground">{content}</p>
                </Card>
            </div>
        );
    } else if (messageRole === "ASSISTANT") {
        return (
            <div className="flex justify-start">
                <Card
                    className={cn("rounded-lg p-3 shadow-none border-none break-words", messageType === "ERROR" && "text-destructive")}
                    onClick={() => fragment && onFragmentClick(fragment)}
                >
                    <div className="flex items-center gap-2 text-foreground">
                    <div className="size-8 rounded-full bg-primary-foreground ring ring-primary flex items-center justify-center">
                        <Logo size={24} />
                    </div>
                        <span >Taskmaster</span>
                    <div className="text-sm text-muted-foreground">{format(createdAt,"HH:mm 'on' dd/mm/YYY")}</div>
                    </div>
                    <div className={"pl-10"}>
                        <p>{content}</p>
                        {fragment && (
                            <button onClick={() => onFragmentClick(fragment)} className={cn("flex mt-4 items-start cursor-pointer text-start gap-2 rounded-lg bg-muted p-3", isActiveFragment && "bg-primary text-primary-foreground")}>
                                <CodeIcon className="size-4 mt-0.5" />
                                <div className="flex flex-col h-full flex-1">
                                    <span className="text-sm font-semibold">{fragment.title}</span>
                                    <span className="text-xs text-gray-500">Preview</span>
                                </div>
                            </button>
                        )}
                    </div>
                </Card>
            </div>
        );
    }
};
