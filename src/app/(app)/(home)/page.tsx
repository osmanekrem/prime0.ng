"use client";

import React from "react";
import Logo from "@/components/logo";
import ProjectForm from "@/features/home/components/project-form";

export default function DashboardPage() {

    return (
        <div className="flex flex-col items-center justify-center px-2 md:px-8 max-w-screen-2xl mx-auto w-full h-full">
            <Logo size={96} className="mb-4" />
            <h1 className="md:text-4xl text-3xl font-bold mb-4 text-center">Welcome to the Taskmaster</h1>
            <p className="md:text-lg text-muted-foreground text-center mb-6">Create your first project by entering a description below:</p>
            <ProjectForm />
        </div>
    );
}