"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenuButton} from "@/components/ui/sidebar";

export function ThemeToggler() {
    const [mounted, setMounted] = React.useState(false)
    const { setTheme, theme } = useTheme()

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <SidebarMenuButton size="default" className="px-3 py-2">
            <Sun className="w-4 h-4" />
            <span>Theme</span>
        </SidebarMenuButton>
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={"default"}
                                    className="data-[state=open]:bg-sidebar-accent px-3 py-2 data-[state=open]:text-sidebar-accent-foreground">
                    <Sun className=" scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute  scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                    <span>
                        {theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}
                    </span>

                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
