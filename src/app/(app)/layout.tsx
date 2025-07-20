import React from "react";
import Sidebar from "@/components/layout/sidebar";
import {SidebarProvider} from "@/components/ui/sidebar";

export default function AppLayout({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar/>
            <main className="flex flex-col h-screen flex-1 min-w-0" >
                {children}
            </main>
        </SidebarProvider>
    );
}