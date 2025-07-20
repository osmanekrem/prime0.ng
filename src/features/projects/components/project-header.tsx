"use client";

import {useSuspenseQuery} from "@tanstack/react-query";
import {useGetProject} from "@/features/projects/api/use-get-project";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {DropdownMenu, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDownIcon} from "lucide-react";
import Logo from "@/components/logo";

type Props = {
    projectId: string;
};
export default function ProjectHeader({
    projectId
                                      }: Props) {
    const {data: project} = useSuspenseQuery((() => useGetProject(projectId))());

    if (!project) {
        return (
            <header className="p-2 flex justify-between items-center border-b">
                <div className="flex items-center space-x-2">
                    <SidebarTrigger />
                    <span className="text-sm font-medium">Loading...</span>
                </div>
            </header>
        );
    }

    return (
        <header className="p-2 flex justify-between items-center border-b">

            <div className="flex items-center space-x-2">

                <SidebarTrigger />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center space-x-0.5"
                            size="sm"
                            >
                            <Logo size={24} className={"size-6"} />
                            <span className="text-sm font-medium">{project.name}</span>
                            <ChevronDownIcon className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </div>
        </header>
    );
};
