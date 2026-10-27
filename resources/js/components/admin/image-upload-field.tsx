import { useEffect, useState } from "react";
import { ImageUp, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";

type ImageUploadFieldProps = {
    id: string;
    name: string;
    label: string;
    hint: string;
    currentImage: string | null;
    accept?: string;
    error?: string;
    required?: boolean;
    onFileChange?: (file: File | null) => void;
};

function formatBytes(bytes: number): string {
    return bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageUploadField({
    id,
    name,
    label,
    hint,
    currentImage,
    accept = "image/png,image/jpeg,image/webp",
    error,
    required = false,
    onFileChange,
}: ImageUploadFieldProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<string | null>(null);
    const imageUrl = previewUrl ?? currentImage;
    const format =
        file?.type.split("/").at(-1)?.toUpperCase() ??
        currentImage?.split(".").at(-1)?.split("?")[0]?.toUpperCase();

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return (
        <div className="flex h-full min-w-0 flex-col gap-3 rounded-xl border border-border bg-white p-3">
            <div className="grid min-h-12 content-start gap-1">
                <Label htmlFor={id}>
                    {label}
                    {required && (
                        <span className="text-destructive" aria-hidden="true">
                            {" "}
                            *
                        </span>
                    )}
                </Label>
                <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
            </div>

            <div className="relative">
                <label
                    htmlFor={id}
                    className="group flex h-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-[#F7F8FD] p-3 text-center transition hover:border-[#2547F9] hover:bg-[#2547F9]/[0.03] focus-within:ring-2 focus-within:ring-[#2547F9]/40"
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`Preview ${label}`}
                            onLoad={(event) =>
                                setDimensions(
                                    `${event.currentTarget.naturalWidth} × ${event.currentTarget.naturalHeight} px`,
                                )
                            }
                            className="max-h-full max-w-full object-contain"
                        />
                    ) : (
                        <>
                            <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#2547F9] shadow-sm">
                                <ImageUp className="size-5" />
                            </span>
                            <span className="text-sm font-medium text-foreground">
                                Pilih gambar
                            </span>
                            <span className="text-xs text-muted-foreground">
                                PNG, JPG, atau WebP
                            </span>
                        </>
                    )}
                    <input
                        id={id}
                        name={name}
                        type="file"
                        accept={accept}
                        className="sr-only"
                        onChange={(event) => {
                            const nextFile = event.currentTarget.files?.[0] ?? null;
                            setFile(nextFile);
                            onFileChange?.(nextFile);
                            setDimensions(null);
                        }}
                    />
                </label>

                {imageUrl && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label={`Perbesar preview ${label}`}
                                className="absolute right-2 top-2 size-8 bg-white/95 shadow-sm"
                            >
                                <Maximize2 className="size-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>{label}</DialogTitle>
                                <DialogDescription>
                                    {file?.name ?? "File saat ini"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex max-h-[70vh] min-h-64 items-center justify-center rounded-xl bg-[#F7F8FD] p-6">
                                <img
                                    src={imageUrl}
                                    alt={`Preview ${label}`}
                                    className="max-h-[62vh] max-w-full object-contain"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="mt-auto grid min-h-10 content-start gap-1 border-t border-border/70 pt-2 text-xs text-muted-foreground">
                <span className="truncate font-medium text-foreground" title={file?.name}>
                    {file?.name ?? (currentImage ? "Gambar tersimpan" : "Belum ada gambar")}
                </span>
                <span className="truncate">
                    {[format, file ? formatBytes(file.size) : null, dimensions]
                        .filter(Boolean)
                        .join(" · ") || "Klik area di atas untuk memilih gambar"}
                </span>
            </div>
            <InputError message={error} />
        </div>
    );
}
