import SyntaxHighlighter from "react-syntax-highlighter";
import * as prismStyles from "react-syntax-highlighter/dist/esm/styles/prism";

const extensionMap: Record<string, string> = {
    rb: "ruby",
    py: "python",
    pl: "perl",
    php: "php",
    scala: "scala",
    go: "go",
    xml: "markup",
    html: "markup",
    htm: "markup",
    css: "css",
    js: "javascript",
    ts: "typescript",
    vbs: "vbscript",
    lua: "lua",
    pas: "pascal",
    java: "java",
    cpp: "cpp",
    cc: "cpp",
    m: "objectivec",
    vala: "vala",
    sql: "sql",
    sm: "smalltalk",
    lisp: "lisp",
    ini: "ini",
    diff: "diff",
    bash: "bash",
    sh: "bash",
    tex: "latex",
    erl: "erlang",
    hs: "haskell",
    md: "markdown",
    txt: "text",
    coffee: "coffeescript",
    swift: "swift"
};

export function SyntaxHighlight({ content, extension }: { content: string, extension: string }) {
    const language = extensionMap[extension] || "text";

  return (<SyntaxHighlighter 
        language={language}
        style={prismStyles.vscDarkPlus}
        showLineNumbers
        wrapLines
        wrapLongLines
    >
    {content}
    </SyntaxHighlighter>);
};