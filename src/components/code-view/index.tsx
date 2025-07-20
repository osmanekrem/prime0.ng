"use client";

import React from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";

import "./code-view.css";




type Props = {
    code: string;
    lang: string;
};
export default function CodeView({
    code,
    lang = "typescript",
                              }: Props) {
    React.useEffect(() => {
        Prism.highlightAll();
    }, [code]);
    return (
        <pre
            className="p-2 bg-transparent rounded-none border-none text-xs m-0"
        >
            <code className={`language-${lang}`}>
    {code}
            </code>
        </pre>
    );
};
