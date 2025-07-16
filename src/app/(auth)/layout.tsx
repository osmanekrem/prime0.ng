import React from "react";
import Logo from "@/components/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="grid grid-cols-1 xl:grid-cols-2 h-full">
          <div className="p-2.5 lg:p-8 flex bg-primary-foreground w-full h-full flex-col items-center">
              {children}
          </div>
            <div className="hidden xl:flex flex-col items-center text-primary-foreground justify-center bg-primary">
                <Logo size={128}  />
                <h1 className="text-4xl font-bold  ">
                    Welcome to TaskMaster
                </h1>
            </div>
      </div>
  );
}