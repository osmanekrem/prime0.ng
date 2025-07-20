import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import {QueryProvider} from "@/components/query-provider";
import {Toaster} from "@/components/ui/sonner";
import React from "react";
import {ThemeProvider} from "@/components/layout/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "TaskMaster",
        template: "%s | TaskMaster",
    },
    description: "A task management application to help you stay organized and productive.",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <QueryProvider>
                <html lang="en" suppressHydrationWarning>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen`}
                >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                {children}
                <Toaster/>
                </ThemeProvider>
                </body>
                </html>

            </QueryProvider>
        </SessionProvider>
    );
}
