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
    return /^(#{2,3}\s|>\s?|[-*]\s|\d+\.\s)/.test(line);
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
                {activeTab === "write" ? (
                    <textarea
                        ref={textareaRef}
                        id={id}
                        name={name}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={placeholder}
                        rows={16}
                        required={required}
                        aria-invalid={Boolean(error)}
                        className="w-full resize-y border-0 bg-transparent px-4 py-3 text-sm leading-7 outline-none placeholder:text-muted-foreground"
                    />
                ) : (
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
                Format teks tersimpan sebagai Markdown. HTML akan diabaikan.
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
