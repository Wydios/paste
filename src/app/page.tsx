"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "../utils/components/footer";

export default function Home() {
    const router = useRouter();
    const [content, setContent] = useState("");

    const savingRef = useRef(false);
    const savedRef = useRef(false);

    const handleNew = useCallback(() => {
        setContent("");
        savedRef.current = false;
        router.refresh();
    }, [router]);

    const handleSave: (type?: "normale" | "raw") => Promise<void> = useCallback(async (type: "normale" | "raw" = "normale") => {
        if (!content.trim() || savingRef.current || savedRef.current) return; 
        savingRef.current = true;

        try {
            const res = await fetch("/documents", {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: content
            });

            if (!res.ok) throw new Error("Failed to save your Paste :(");
            
            const data = await res.json();
            savedRef.current = true;

            const pasteURL = `${window.location.origin}/${type === "raw" ? "raw/" : ""}${data.key}`;
            await navigator.clipboard.writeText(pasteURL);
            router.push(pasteURL);
        } catch (error: unknown) {
            console.error("Home() | Error saving Paste:", error instanceof Error ? error.message : error);
        } finally {
            savingRef.current = false;
        }
    }, [content, router]);

    const keyBoardClick: (event: KeyboardEvent) => void = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.key === "s") {
            event.preventDefault();
            handleSave("raw");
        } else if (event.ctrlKey && event.key === "s") {
            event.preventDefault();
            handleSave("normale");
        } else if (event.ctrlKey && event.key === "n") {
            event.preventDefault();
            handleNew();
        }
    }, [handleSave, handleNew]);

    useEffect(() => {
        document.addEventListener("keydown", keyBoardClick, { capture: true });
        return () => document.removeEventListener("keydown", keyBoardClick);
    }, [keyBoardClick]);

    return (
        <>
        <textarea
            aria-label="Content input"
            autoFocus
            spellCheck="false"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            readOnly={savedRef.current}
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