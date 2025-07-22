import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarSeparator
} from "@/components/ui/sidebar";
import Logo from "@/components/logo";
import UserButton from "@/features/auth/components/user-button";
import Navbar from "@/components/layout/navbar";
import { getProjects} from "@/features/projects/api/use-get-projects";
import ProjectNavbar from "@/components/layout/project-navbar";
import {getQueryClient} from "@/lib/get-query-client";
import {Suspense} from "react";

export default function AppSidebar() {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(getProjects)
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-start flex-wrap px-2">
                    <Logo size={32}/>
                    <span className="text-xl font-bold">Taskmaster</span>
                    <span className="text-sm ml-2">Beta</span>

                </div>
            </SidebarHeader>
            <SidebarSeparator/>
            <SidebarContent>
                <Navbar/>
                <Suspense fallback={null}>

                    <ProjectNavbar/>
                </Suspense>
            </SidebarContent>
            <SidebarSeparator/>
            <SidebarFooter>
                <UserButton/>
            </SidebarFooter>
        </Sidebar>

    );
}