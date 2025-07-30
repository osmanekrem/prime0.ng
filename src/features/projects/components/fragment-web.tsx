import {Fragment} from "@/db/schema";
import {Button} from "@/components/ui/button";
import {ExternalLinkIcon, RefreshCcwIcon} from "lucide-react";
import {useState} from "react";
import {Hint} from "@/components/hint";

type Props = {
    data: Fragment;
};
export default function FragmentWeb({
                                        data
                                    }: Props) {
    const [fragmentKey, setFragmentKey] = useState<number>(0);
    const [copied, setCopied] = useState<boolean>(false);

    const onRefresh = () => {
        setFragmentKey(prevKey => prevKey + 1);
    }

    const onCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl!).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            console.error("Failed to copy URL");
        });
    };
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center space-x-2 p-2 border-b w-full">
                <Hint text="Refresh">
                    <Button size="icon" variant="outline" className="size-8" onClick={onRefresh}
                            disabled={!data.sandboxUrl}>
                        <RefreshCcwIcon className="size-4"/>
                    </Button>
                </Hint>
                <Hint text="Copy URL">
                    <Button variant="outline" className="h-8 flex-1 text-left justify-start" onClick={onCopy}
                            disabled={!data.sandboxUrl || copied}>
                    <span className="truncate">
                        {data.sandboxUrl}
                    </span>
                    </Button>
                </Hint>
                <Hint text="Open in a new tab">
                    <Button size="icon" variant="outline" className="size-8" onClick={() => {
                        window.open(data.sandboxUrl!, "_blank", "noopener,noreferrer");
                    }} disabled={!data.sandboxUrl}>
                        <span className="sr-only">Open in new tab</span>
                        <ExternalLinkIcon className="size-4"/>
                    </Button>
                </Hint>
            </div>
            <iframe className={"h-full w-full"}
                    key={fragmentKey}
                    src={data.sandboxUrl!}
                    title={data.title}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy"
            />
        </div>
    );
};
