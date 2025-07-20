"use client"

import React from 'react'
import {getProjects} from "@/features/projects/api/use-get-projects";
import {useSuspenseQuery} from "@tanstack/react-query";
import Link from "next/link";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";

export default function ProjectNavbar() {
    const {data} = useSuspenseQuery(getProjects);
    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                Projects
            </SidebarGroupLabel>
            <SidebarGroupContent>


                <SidebarMenu>
                    {data.map((project) => (
                        <SidebarMenuItem key={project.id}>
                            <SidebarMenuButton asChild>
                                <Link className="px-3 py-2" href={`/projects/${project.id}`}>
                                    <span>{project.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
