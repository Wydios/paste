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

export function SyntaxHighlight({ content, extension }: { content: string, extension: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const walker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT);

        const nodes: Text[] = [];
        let current: Node | null;

        while ((current = walker.nextNode())) {
            nodes.push(current as Text);
        }

        nodes.forEach(node => {
            const text = node.nodeValue;
            if (!text) return;

            const matches = [...text.matchAll(/\{(wydios[a-zA-Z0-9]+)\}/g)];
            if (!matches.length) return;

            const parent = node.parentNode;
            if (!parent) return;

            let lastIndex = 0;

            matches.forEach(match => {
                const name = match[1];
                if (!name.startsWith("wydios")) return;

                const start = match.index ?? 0;

                const before = text.slice(lastIndex, start);
                if (before) parent.insertBefore(document.createTextNode(before), node);

                const img = document.createElement("img");
                img.src = `/emotes/${name}.png`;
                img.className = "emote";

                img.onerror = () => {
                    img.replaceWith(document.createTextNode(`{${name}}`));
                }

                parent.insertBefore(img, node);

                lastIndex = start + match[0].length;
            });

            const after = text.slice(lastIndex);
            if (after) parent.insertBefore(document.createTextNode(after), node);

            parent.removeChild(node);
        });
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