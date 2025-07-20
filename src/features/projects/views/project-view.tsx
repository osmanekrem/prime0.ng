"use client"
import {Suspense, useState} from "react";
import {Fragment} from "@/db/schema";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import MessagesContainer from "@/features/projects/components/messages-container";
import ProjectHeader from "@/features/projects/components/project-header";
import FragmentWeb from "@/features/projects/components/fragment-web";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Code2Icon, EyeIcon} from "lucide-react";
import FileExplorer from "@/components/file-explorer";


type Props = {
    projectId: string;
};
export default function ProjectView({
                                        projectId,
                                    }: Props) {

    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");

    return (
        <div className="h-full">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
                    <Suspense fallback={null}>
                        <ProjectHeader projectId={projectId}/>
                    </Suspense>
                    <Suspense fallback={"loading messages..."}>
                        <MessagesContainer projectId={projectId} activeFragment={activeFragment}
                                           setActiveFragment={setActiveFragment}/>
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel defaultSize={65} minSize={50} className="flex flex-col min-h-0">
                    <Tabs
                        className="h-full gap-y-0"
                        value={activeTab}
                        defaultValue="preview"
                        onValueChange={(value) => setActiveTab(value as "code" | "preview")}
                    >
                        <div className={"w-full flex items-center p-2 gap-x-2 border-b"}>
                            <TabsList className={"h-8 border rounded-md p-0"}>
                                <TabsTrigger value="preview" className="rounded-md">
                                    <EyeIcon/> Preview
                                </TabsTrigger>
                                <TabsTrigger value="code" className="rounded-md">
                                    <Code2Icon/> Code
                                </TabsTrigger>

                            </TabsList>
                        </div>
                        <TabsContent value="preview">

                            {
                                !!activeFragment && (<FragmentWeb data={activeFragment}/>)
                            }
                        </TabsContent>
                        <TabsContent value="code" className="min-h-0">
                            {!!activeFragment?.files && (
                                <FileExplorer files={JSON.parse(activeFragment.files)}/>
                            )}
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};
