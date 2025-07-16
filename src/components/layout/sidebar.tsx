import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarSeparator
} from "@/components/ui/sidebar";
import Logo from "@/components/logo";
import UserButton from "@/features/auth/components/user-button";
import Navbar from "@/components/layout/navbar";

export default function AppSidebar() {
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
            </SidebarContent>
            <SidebarSeparator/>
            <SidebarFooter>
                <UserButton/>
            </SidebarFooter>
        </Sidebar>

    );
}