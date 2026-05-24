import "../styles/globals.css";
import React from "react";
import { Metadata } from "next";

const url = "https://p.wydios.de";
const title = "Wydios • Paste";
const description = "Create and share text or code instantly with Wydios-Paste";

export const metadata: Metadata & { credits?: { name: string, url: string }[] } = {
    title: {
        default: title,
        template: "%s • wydios-paste"
    },
    description,

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large"
        }
    },

    icons: { icon: "/favicon.png" },
    keywords: ["paste", "text"],

    openGraph: {
        title,
        description,
        url,
        siteName: title,
        images: [
            {
                url: `${url}/favicon.ico`,
                width: 1200,
                height: 630,
                alt: `${title} Preview`
            }
        ],
        type: "website",
        locale: "de_DE"
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${url}/favicon.ico`]
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