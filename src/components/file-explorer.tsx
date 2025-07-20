"use client";

import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {Fragment, useMemo, useState} from "react";
import {Hint} from "@/components/hint";
import {Button} from "@/components/ui/button";
import {CopyCheckIcon, CopyIcon} from "lucide-react";
import CodeView from "@/components/code-view";
import {convertFilesToFileTree} from "@/lib/utils";
import TreeView from "@/components/tree-view";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem, BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

type Props = {
    files: { [path: string]: string };
};

function getExtensionFromPath(path: string) {
    const parts = path.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : "text"
}

interface FileBreadCrumbProps {
    filePath: string;
}

function FileBreadCrumb({filePath}: FileBreadCrumbProps) {
    const parts = filePath.split('/');
    const maxSegments = 4;

    const renderItems = () => {
        if (parts.length <= maxSegments) {
            return parts.map((part, index) => {
                const isLast = index === parts.length - 1;
                return (<Fragment key={index}>
                    <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage className="font-medium">
                                {part}
                            </BreadcrumbPage>
                        ) : (
                            <span className="text-muted-foreground">
                                {part}
                            </span>
                        )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator/>}
                </Fragment>)
            });
        } else {
            const firstPart = parts[0];
            const lastPart = parts[parts.length - 1];

            return (
                <Fragment>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">
                            {firstPart}
                        </span>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbEllipsis/>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-medium">
                            {lastPart}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </Fragment>
            )

        }


    }
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {renderItems()}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default function FileExplorer({
                                         files
                                     }: Props) {
    const [selectedFile, setSelectedFile] = useState<string | null>((() => {
        const firstFile = Object.keys(files)[0];
        return firstFile ? firstFile : null;
    })());
    const [copied, setCopied] = useState<boolean>(false);

    const treeData = useMemo(() => {
        return convertFilesToFileTree(files);
    }, [files]);

    const handleFileSelect = (path: string) => {
        if (files[path]) {
            setSelectedFile(path);
        }
    }

    const onCopy = () => {
        if (selectedFile) {
            navigator.clipboard.writeText(files[selectedFile]).then(() => {

                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(() => {
                console.error("Failed to copy URL");
            });
        }
    };

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={20}>
                <TreeView data={treeData} value={selectedFile} onSelect={handleFileSelect}/>
            </ResizablePanel>
            <ResizableHandle/>
            <ResizablePanel defaultSize={70} minSize={50}>
                {
                    selectedFile && files[selectedFile] ? (
                        <div className={"flex flex-col h-full w-full"}>
                            <div className="px-4 py-2 border-b flex w-full items-center justify-between gap-x-2">
                                <FileBreadCrumb filePath={selectedFile}/>
                                <Hint text="Copy to clipboard">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={onCopy}
                                        disabled={!selectedFile || copied}
                                        className={"size-8"}
                                    >
                                        <span className="sr-only">Copy</span>
                                        {copied ?<CopyCheckIcon />  :<CopyIcon/>}
                                    </Button>
                                </Hint>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <CodeView
                                    code={files[selectedFile]}
                                    lang={getExtensionFromPath(selectedFile)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Select a file to view its content
                        </div>
                    )
                }
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};
