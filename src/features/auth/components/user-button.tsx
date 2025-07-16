"use client"

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {useIsMobile} from "@/hooks/use-mobile";
import {ChevronsUpDown, LogOut} from "lucide-react";
import UserAvatar from "@/features/auth/components/user-avatar";
import {useLogout} from "@/features/auth/api/use-logout";
import {useCurrent} from "@/features/auth/api/use-current";

export default function UserButton() {
    const {data: user, isPending} = useCurrent()
    const {mutate} = useLogout()

    const isMobile = useIsMobile()

    if (isPending) {
        return (
            <SidebarMenuButton
                size="lg"
                className="bg-sidebar-accent text-sidebar-accent-foreground"
            >
                <UserAvatar size={32}/>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Yükleniyor...</span>
                </div>
            </SidebarMenuButton>
        )
    }

    if (!user) {
        return null
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <UserAvatar user={user} size={32}/>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user.name} {user.surname}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4"/>
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <UserAvatar user={user} size={32}/>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.name} {user.surname}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={() =>
                        mutate()
                    }
                >
                    <LogOut/>
                    Çıkış Yap
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}