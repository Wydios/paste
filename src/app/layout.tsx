import "../styles/globals.css";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata & { credits?: { name: string, url: string }[] } = {
    title: {
        default: "Wydios • Paste",
        template: "%s • wydios-paste"
    },
    description: "Create and share text or code instantly with Wydios-Paste",
    icons: { icon: "/favicon.png" },
    keywords: ["paste", "text"],
    robots: {
        index: false,
        follow: false
    },
    authors: [
        { name: "Wydios", url: "https://github.com/wydios" }
    ],
    credits: [
        { name: "susgee-paste", url: "https://github.com/susgee-dev/susgee-paste" }
    ]
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de" suppressHydrationWarning>
            <body>
                {children}
            </body>
        </html>
    );
};