"use client";

import SyntaxHighlighter from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import { useEffect, useRef } from "react";

const extensionMap: Record<string, string> = {
    rb: "ruby",
    py: "python",
    pl: "perl",
    xml: "markup",
    html: "markup",
    htm: "markup",
    js: "javascript",
    ts: "typescript",
    vbs: "vbscript",
    pas: "pascal",
    cc: "cpp",
    m: "objectivec",
    sm: "smalltalk",
    sh: "bash",
    tex: "latex",
    erl: "erlang",
    hs: "haskell",
    md: "markdown",
    txt: "text",
    coffee: "coffeescript",
};

const emoteCache = new Map<string, boolean>();

function checkImage(src: string): Promise<boolean> {
    if (emoteCache.has(src)) {
        return Promise.resolve(emoteCache.get(src)!);
    };

    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
            emoteCache.set(src, true);
            resolve(true);
        };

        img.onerror = () => {
            emoteCache.set(src, false);
            resolve(false);
        };

        img.src = src;
    });
};

export function SyntaxHighlight({ content, extension }: { content: string, extension: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const walker = document.createTreeWalker(
            ref.current,
            NodeFilter.SHOW_TEXT
        );

        const nodes: Text[] = [];
        let current: Node | null;

        while ((current = walker.nextNode())) {
            nodes.push(current as Text);
        }

        (async () => {
            for (const node of nodes) {
                const text = node.nodeValue;
                if (!text) continue;

                const matches = [...text.matchAll(/\{(wydios[a-zA-Z0-9]+)\}/g)];
                if (!matches.length) continue;

                const parent = node.parentNode;
                if (!parent) continue;

                let lastIndex = 0;

                for (const match of matches) {
                    if (!parent.contains(node)) break;

                    const name = match[1];
                    const start = match.index ?? 0;

                    const before = text.slice(lastIndex, start);
                    if (before && parent.contains(node)) {
                        parent.insertBefore(document.createTextNode(before), node);
                    }

                    const src = `/emotes/${name}.png`;
                    const exists = await checkImage(src);

                    if (!parent.contains(node)) break;

                    if (exists) {
                        const img = document.createElement("img");
                        img.src = src;
                        img.className = "emote";
                        img.style.display = "inline-block";

                        parent.insertBefore(img, node);
                    } else {
                        parent.insertBefore(
                            document.createTextNode(match[0]),
                            node
                        );
                    }

                    lastIndex = start + match[0].length;
                }

                if (!parent.contains(node)) continue;

                const after = text.slice(lastIndex);
                if (after) {
                    parent.insertBefore(document.createTextNode(after), node);
                }

                parent.removeChild(node);
            }
        })();
    }, [content]);

    return (
        <div ref={ref} className="paste-wrapper">
            <SyntaxHighlighter
                language={extensionMap[extension] ?? extension ?? "text"}
                style={vscDarkPlus}
                showLineNumbers
                wrapLines
                wrapLongLines
            >
            {content}
            </SyntaxHighlighter>
      </div>
    );
};