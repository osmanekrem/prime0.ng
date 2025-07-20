import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarSeparator
} from "@/components/ui/sidebar";
import Logo from "@/components/logo";
import UserButton from "@/features/auth/components/user-button";
import Navbar from "@/components/layout/navbar";
import {useGetProjects} from "@/features/projects/api/use-get-projects";
import ProjectNavbar from "@/components/layout/project-navbar";
import {getQueryClient} from "@/lib/get-query-client";
import {Suspense} from "react";

export default function AppSidebar() {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(useGetProjects)
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-start flex-wrap px-2">
                    <Logo size={48}/>
                    <span className="text-2xl font-bold">TaskMaster</span>

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