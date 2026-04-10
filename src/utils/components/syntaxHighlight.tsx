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

async function checkImage(src: string): Promise<boolean> {
    if (emoteCache.has(src)) {
        return emoteCache.get(src)!;
    };

    try {
        const res = await fetch(src, { method: "HEAD" });
        const ok = res.ok;
        emoteCache.set(src, ok);
        return ok;
    } catch {
        emoteCache.set(src, false);
        return false;
    }
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

                const matches = [...text.matchAll(/\{([a-zA-Z0-9]+)\}/g)];
                if (!matches.length) continue;

                const parent = node.parentNode;
                if (!parent) continue;

                let lastIndex = 0;
                const fragment = document.createDocumentFragment();

                for (const match of matches) {
                    const name = match[1];
                    const start = match.index ?? 0;

                    if (start > lastIndex) {
                        fragment.appendChild(
                            document.createTextNode(text.slice(lastIndex, start))
                        );
                    }

                    if (name.startsWith("wydios")) {
                        const src = `${window.location.origin}/emotes/${name}.png`;
                        const exists = await checkImage(src);

                        if (exists) {
                            const img = document.createElement("img");
                            img.src = src;
                            img.className = "emote";
                            img.style.display = "inline-block";
                            fragment.appendChild(img);
                        } else {
                            fragment.appendChild(
                                document.createTextNode(match[0])
                            );
                        }
                    } else {
                        fragment.appendChild(
                            document.createTextNode(match[0])
                        );
                    }

                    lastIndex = start + match[0].length;
                }

                if (lastIndex < text.length) {
                    fragment.appendChild(
                        document.createTextNode(text.slice(lastIndex))
                    );
                }

                if (parent.contains(node)) {
                    parent.replaceChild(fragment, node);
                }
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