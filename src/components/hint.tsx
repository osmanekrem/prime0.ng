import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

type Props = {
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    text: string;
    align?: "start" | "center" | "end";
};

export function Hint({
                         children,
                         side = "top",
                         text,
                         align = "center",
                     }: Props) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align} className="max-w-xs">
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
