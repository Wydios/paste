"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "../utils/components/footer";

export default function Home() {
    const router = useRouter();
    const [content, setContent] = useState("");

    const handleNew = useCallback(() => {
        setContent("");
        router.refresh();
    }, [router]);

    const handleSave = useCallback((type: "normale" | "raw" = "normale") => {
        if (!content.trim()) return;

        fetch("/documents", {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: content
        }).then((res) => {
            if (res.ok) {
                return res.json();
            };

            throw new Error("Failed to save your Paste :(");
        }).then((data) => {
            router.push(`/${type === "raw" ? "raw/" : ""}${data.key}`);
        }).catch((error) => {
            console.error("Home() | Error saving Paste:", error);
        });
    }, [content, router]);

    const keyBoardClick = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.key === "s") {
            event.preventDefault();
            handleSave("raw");
        }

        if (event.ctrlKey && event.key === "s") {
            event.preventDefault();
            handleSave("normale");
        }

        if (event.ctrlKey && event.key === "n") {
            event.preventDefault();
            handleNew();
        }
    }, [handleSave, handleNew]);

    useEffect(() => {
        document.addEventListener("keydown", keyBoardClick, { capture: true });
        return () => { 
            document.removeEventListener("keydown", keyBoardClick); 
        };
    }, [keyBoardClick]);

    return (
        <>
        <textarea
            aria-label="Content input"
            autoFocus
            spellCheck="false"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />

        <Footer 
            canSave={!!content.trim()} 
            onSave={() => handleSave("normale")} 
            onRawSave={() => handleSave("raw")} 
            onNew={handleNew} 
        />
        </>
    );
};