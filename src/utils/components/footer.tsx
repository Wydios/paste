"use client";

import { useRouter } from "next/navigation";

export function Footer({
    canSave = false,
    onSave,
    onRawSave,
    onNew
}: {
    canSave?: boolean,
    onSave?: () => void,
    onRawSave?: () => void,
    onNew?: () => void
}) {
    const router = useRouter();

    const handleNew: () => void = () => {
        if (onNew) {
            onNew();
        } else {
            router.push("/");
        }
    };

    return (
        <footer>
            <div className="about">
                <img src="/github.png" alt="GitHub Logo" width={13} height={13} style={{ marginRight: "5px" }} ></img>
                <a href="https://github.com/Wydios/paste" target="_blank">
                    GitHub
                </a>
            </div>
            <div className="actions">
                <button onClick={onSave} disabled={!canSave}>
                    Save / Strg + S
                </button>
                <button onClick={onRawSave} disabled={!canSave}>
                    Save Raw / Strg + Shift + S
                </button>
                <button onClick={handleNew}>
                    New / Strg + N
                </button>
            </div>
        </footer>
    );
};