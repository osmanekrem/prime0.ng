import {SidebarTrigger} from "@/components/ui/sidebar";
import React from "react";

type Props = {
    children: React.ReactNode;
};
export default function Layout({
    children
                               }: Props) {
    return (

        <div className="flex flex-col min-h-screen">
            <header className="w-full">
                <div className="flex items-center justify-between h-16 px-4">
                    <SidebarTrigger />
                </div>
            </header>
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    );
};
