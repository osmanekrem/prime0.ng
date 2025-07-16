import React from "react";
import Sidebar from "@/components/layout/sidebar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

export default function AppLayout({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar/>
            <main className=" h-full w-full">
                <header className="w-full">
                    <div className="flex items-center justify-between h-16 px-4">
                        <SidebarTrigger />
                    </div>
                </header>
                <div className="py-8 px-6 flex h-full flex-col mx-auto max-w-screen-2xl">
                {children}
                </div>
            </main>
        </SidebarProvider>
    );
}