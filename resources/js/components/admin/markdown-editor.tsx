import { useRef, useState, type ReactNode } from "react";
import { Bold, Heading2, Heading3, Italic, List, ListOrdered, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
};

function renderInline(value: string): ReactNode[] {
    const tokenPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    const nodes: ReactNode[] = [];
    let cursor = 0;
    let token = tokenPattern.exec(value);

    while (token !== null) {
        if (token.index > cursor) {
            nodes.push(value.slice(cursor, token.index));
        }

        const content = token[0];
        const key = `${token.index}-${content}`;

        if (content.startsWith("**")) {
            nodes.push(<strong key={key}>{content.slice(2, -2)}</strong>);
        } else if (content.startsWith("*")) {
            nodes.push(<em key={key}>{content.slice(1, -1)}</em>);
        } else if (content.startsWith("`")) {
            nodes.push(
                <code key={key} className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em]">
                    {content.slice(1, -1)}
                </code>,
            );
        } else {
            const match = content.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)$/);

            nodes.push(
                match ? (
                    <a
                        key={key}
                        href={match[2]}
                        rel="noreferrer"
                        target="_blank"
                        className="text-[#2547F9] underline underline-offset-2"
                    >
                        {match[1]}
                    </a>
                ) : (
                    content
                ),
            );
        }

        cursor = token.index + content.length;
        token = tokenPattern.exec(value);
    }

    if (cursor < value.length) {
        nodes.push(value.slice(cursor));
    }

    return nodes;
}

function isBlockStart(line: string): boolean {
    return /^(#{2,3}\s|>\s?|[-*]\s|\d+\.\s|\|.*\|$)/.test(line);
}

function convertPastedNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.replace(/\s+/g, " ") ?? "";
    }

    if (!(node instanceof HTMLElement)) {
        return "";
    }

    const tag = node.tagName.toLowerCase();
    if (["script", "style", "meta", "link"].includes(tag)) {
        return "";
    }

    if (tag === "table") {
        const rows = Array.from(node.querySelectorAll("tr"));
        const formattedRows = rows.map((row) => {
            const cells = Array.from(row.querySelectorAll(":scope > th, :scope > td"));
            return `| ${cells.map((cell) => cell.textContent?.replace(/\s+/g, " ").trim().replace(/\|/g, "\\|") ?? "").join(" | ")} |`;
        });
        if (formattedRows.length > 1) {
            const separator = `| ${Array.from(rows[0].querySelectorAll(":scope > th, :scope > td"), () => "---").join(" | ")} |`;
            formattedRows.splice(1, 0, separator);
        }
        return `${formattedRows.join("\n")}\n\n`;
    }

    const children = Array.from(node.childNodes).map(convertPastedNode).join("");
    if (tag === "br") {
        return "\n";
    }
    if (tag === "strong" || tag === "b") {
        return `**${children.trim()}**`;
    }
    if (tag === "em" || tag === "i") {
        return `*${children.trim()}*`;
    }
    if (tag === "h2" || tag === "h3") {
        return `${tag === "h2" ? "##" : "###"} ${children.trim()}\n\n`;
    }
    if (tag === "li") {
        return `- ${children.trim()}\n`;
    }
    if (tag === "ol") {
        return `${Array.from(node.children, (item, index) => `${index + 1}. ${convertPastedNode(item).replace(/^-\s/, "").trim()}\n`).join("")}\n`;
    }
    if (tag === "ul") {
        return `${children}\n`;
    }
    if (["p", "div", "section", "blockquote"].includes(tag)) {
        return `${children.trim()}\n\n`;
    }

    return children;
}

function convertPastedHtml(html: string): string {
    const document = new DOMParser().parseFromString(html, "text/html");
    return Array.from(document.body.childNodes)
        .map(convertPastedNode)
        .join("")
        .replace(/[\t ]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function convertPastedText(text: string): string {
    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    const convertedLines: string[] = [];
    let convertedTable = false;
    let index = 0;

    while (index < lines.length) {
        if (!lines[index].includes("\t")) {
            convertedLines.push(lines[index]);
            index++;
            continue;
        }

        const rows: string[][] = [];
        while (index < lines.length && lines[index].includes("\t")) {
            rows.push(lines[index].split("\t").map((cell) => cell.trim()));
            index++;
        }

        if (rows.length < 2) {
            convertedLines.push(...rows.map((row) => row.join("\t")));
            continue;
        }

        const columnCount = Math.max(...rows.map((row) => row.length));
        const formattedRows = rows.map((row) => {
            const cells = Array.from({ length: columnCount }, (_, cellIndex) =>
                (row[cellIndex] ?? "").replace(/\|/g, "\\|"),
            );

            return `| ${cells.join(" | ")} |`;
        });
        const separator = `| ${Array.from({ length: columnCount }, () => "---").join(" | ")} |`;
        formattedRows.splice(1, 0, separator);
        convertedLines.push(...formattedRows);
        convertedTable = true;
    }

    return convertedTable ? convertedLines.join("\n") : text;
}

function splitTableRow(line: string): string[] {
    const cells: string[] = [];
    let cell = "";
    let isEscaped = false;

    for (const character of line.trim().slice(1, -1)) {
        if (character === "|" && !isEscaped) {
            cells.push(cell.trim().replace(/\\\|/g, "|"));
            cell = "";
            continue;
        }

        cell += character;
        isEscaped = character === "\\" && !isEscaped;
        if (character !== "\\") {
            isEscaped = false;
        }
    }

    cells.push(cell.trim().replace(/\\\|/g, "|"));

    return cells;
}

function renderMarkdown(value: string): ReactNode[] {
    const lines = value.split(/\r?\n/);
    const blocks: ReactNode[] = [];
    let index = 0;

    while (index < lines.length) {
        const line = lines[index].trim();

        if (!line) {
            index++;
            continue;
        }

        const key = `block-${index}`;
        const heading = line.match(/^(#{2,3})\s+(.+)$/);

        if (heading) {
            const Heading = heading[1].length === 2 ? "h2" : "h3";
            blocks.push(
                <Heading key={key} className="font-semibold tracking-tight text-foreground">
                    {renderInline(heading[2])}
                </Heading>,
            );
            index++;
            continue;
        }

        const isTableSeparator = (row: string) => /^\|(?:\s*:?-+:?\s*\|)+$/.test(row.trim());
        if (/^\|.*\|$/.test(line) && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
            const rows: string[][] = [];
            while (index < lines.length && /^\|.*\|$/.test(lines[index].trim())) {
                const cells = splitTableRow(lines[index]);
                if (!isTableSeparator(lines[index])) {
                    rows.push(cells);
                }
                index++;
            }
            blocks.push(
                <div key={key} className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={`row-${rowIndex}`} className={rowIndex === 0 ? "bg-slate-100 font-semibold" : "border-t border-slate-200"}>
                                    {row.map((cell, cellIndex) => {
                                        const Cell = rowIndex === 0 ? "th" : "td";
                                        return <Cell key={`cell-${rowIndex}-${cellIndex}`} className="border border-slate-200 px-3 py-2">{renderInline(cell)}</Cell>;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>,
            );
            continue;
        }

        if (line.startsWith(">")) {
            const quoteLines: string[] = [];
            while (index < lines.length && lines[index].trim().startsWith(">")) {
                quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
                index++;
            }
            blocks.push(
                <blockquote
                    key={key}
                    className="border-l-2 border-[#2547F9]/40 pl-4 text-muted-foreground"
                >
                    {renderInline(quoteLines.join(" "))}
                </blockquote>,
            );
            continue;
        }

        const listItem = line.match(/^([-*]|\d+\.)\s+(.+)$/);
        if (listItem) {
            const isOrdered = /^\d+\./.test(listItem[1]);
            const items: ReactNode[] = [];
            while (index < lines.length) {
                const item = lines[index].trim().match(/^([-*]|\d+\.)\s+(.+)$/);
                if (!item || /^\d+\./.test(item[1]) !== isOrdered) {
                    break;
                }
                items.push(<li key={`item-${index}`}>{renderInline(item[2])}</li>);
                index++;
            }
            const ListTag = isOrdered ? "ol" : "ul";
            blocks.push(
                <ListTag key={key} className={isOrdered ? "list-decimal pl-5" : "list-disc pl-5"}>
                    {items}
                </ListTag>,
            );
            continue;
        }

        const paragraphLines = [line];
        index++;
        while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) {
            paragraphLines.push(lines[index].trim());
            index++;
        }
        blocks.push(<p key={key}>{renderInline(paragraphLines.join(" "))}</p>);
    }

    return blocks;
}

export function MarkdownEditor({
    id,
    name,
    label,
    value,
    onChange,
    error,
    required = false,
    placeholder = "Tulis konten di sini. Gunakan toolbar untuk format teks.",
}: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [activeTab, setActiveTab] = useState("write");

    function wrapSelection(before: string, after = before): void {
        const textarea = textareaRef.current;
        if (!textarea) {
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.slice(start, end) || "teks";
        const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
        onChange(nextValue);
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + before.length,
                start + before.length + selected.length,
            );
        });
    }

    function prefixLine(prefix: string): void {
        const textarea = textareaRef.current;
        if (!textarea) {
            return;
        }

        const start = textarea.selectionStart;
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const nextValue = `${value.slice(0, lineStart)}${prefix}${value.slice(lineStart)}`;
        onChange(nextValue);
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length);
        });
    }

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>
                {label}
                {required && (
                    <span className="text-destructive" aria-hidden="true">
                        {" "}
                        *
                    </span>
                )}
            </Label>
            <div className="overflow-hidden rounded-xl border border-input bg-white focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-[#F7F8FD] px-3 py-2">
                    <div className="flex flex-wrap items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Tebal"
                            aria-label="Tebalkan teks"
                            onClick={() => wrapSelection("**")}
                        >
                            <Bold />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Miring"
                            aria-label="Miringkan teks"
                            onClick={() => wrapSelection("*")}
                        >
                            <Italic />
                        </Button>
                        <span className="mx-1 h-5 border-l border-border" aria-hidden="true" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Judul tingkat 2"
                            aria-label="Tambah judul tingkat 2"
                            onClick={() => prefixLine("## ")}
                        >
                            <Heading2 />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Judul tingkat 3"
                            aria-label="Tambah judul tingkat 3"
                            onClick={() => prefixLine("### ")}
                        >
                            <Heading3 />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Daftar poin"
                            aria-label="Tambah daftar poin"
                            onClick={() => prefixLine("- ")}
                        >
                            <List />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Daftar bernomor"
                            aria-label="Tambah daftar bernomor"
                            onClick={() => prefixLine("1. ")}
                        >
                            <ListOrdered />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            title="Kutipan"
                            aria-label="Tambah kutipan"
                            onClick={() => prefixLine("> ")}
                        >
                            <Quote />
                        </Button>
                    </div>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value ?? "write")}
                    >
                        <TabsList className="h-8">
                            <TabsTrigger value="write" className="px-2 text-xs">
                                Tulis
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="px-2 text-xs">
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <textarea
                        ref={textareaRef}
                        id={id}
                        name={name}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={placeholder}
                        rows={16}
                        required={required && activeTab === "write"}
                        aria-invalid={Boolean(error)}
                        onPaste={(event) => {
                            const html = event.clipboardData.getData("text/html");
                            const plainText = event.clipboardData.getData("text/plain");
                            if (!html && !plainText.includes("\t")) {
                                return;
                            }

                            event.preventDefault();
                            const textarea = event.currentTarget;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const convertedHtml = html ? convertPastedHtml(html) : "";
                            const htmlContainsTable = /(?:^|\n)\|.*\|\n\|(?:\s*:?-+:?\s*\|)+/.test(
                                convertedHtml,
                            );
                            const pastedContent = html && (!plainText.includes("\t") || htmlContainsTable)
                                ? convertedHtml
                                : convertPastedText(plainText);
                            onChange(`${value.slice(0, start)}${pastedContent}${value.slice(end)}`);
                            requestAnimationFrame(() => {
                                textarea.focus();
                                const cursor = start + pastedContent.length;
                                textarea.setSelectionRange(cursor, cursor);
                            });
                        }}
                        className={cn(
                            "w-full resize-y border-0 bg-transparent px-4 py-3 text-sm leading-7 outline-none placeholder:text-muted-foreground",
                            activeTab !== "write" && "hidden",
                        )}
                    />
                {activeTab === "preview" && (
                    <div className="min-h-[23.5rem] space-y-4 px-4 py-3 text-sm leading-7 text-foreground [&_h2]:mt-5 [&_h2]:text-xl [&_h3]:mt-4 [&_h3]:text-lg [&_p]:whitespace-normal">
                        {value.trim() ? (
                            renderMarkdown(value)
                        ) : (
                            <p className="text-muted-foreground">
                                Preview konten akan muncul di sini.
                            </p>
                        )}
                    </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground">
                Paste dari Word mempertahankan judul, tebal, daftar, dan tabel. Konten tersimpan sebagai Markdown.
            </p>
            <InputError message={error} />
        </div>
    );
}

export function MarkdownContent({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "space-y-4 text-sm leading-7 text-foreground [&_h2]:mt-5 [&_h2]:text-xl [&_h3]:mt-4 [&_h3]:text-lg [&_p]:whitespace-normal",
                className,
            )}
        >
            {value.trim() ? renderMarkdown(value) : null}
        </div>
    );
}
