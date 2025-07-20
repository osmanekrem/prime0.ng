"use client"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {CheckCircle2Icon, HomeIcon, SettingsIcon, UsersIcon} from "lucide-react";
import {ThemeToggler} from "@/components/layout/theme-toggler";

const routes = [
    {
        title: "Ana Sayfa",
        href: "/",
        icon: HomeIcon,
    },
]
export default function Navbar() {
    const pathname = usePathname()
    return (

        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ThemeToggler/>
                    </SidebarMenuItem>
                    {routes.map((item) => {
                        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link className={cn("px-3 py-2", isActive && "bg-sidebar-accent")} href={item.href}>
                                        <item.icon/>
                                        <span className="text-base">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}