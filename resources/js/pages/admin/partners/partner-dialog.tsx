import { useEffect, type FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import {
    store as storePartner,
    update as updatePartner,
} from "@/actions/App/Http/Controllers/Admin/PartnerController";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type PartnerData = {
    id: number;
    name: string;
    imageUrl: string;
};

type PartnerValues = {
    name: string;
    image: File | null;
};

type PartnerDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partner: PartnerData | null;
};

export function PartnerDialog({ open, onOpenChange, partner }: PartnerDialogProps) {
    const isEditing = partner !== null;
    const form = useForm<PartnerValues>({ name: "", image: null });

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData({ name: partner?.name ?? "", image: null });
        form.clearErrors();
    }, [open, partner]);

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditing ? "Partner berhasil diperbarui." : "Partner berhasil dibuat.",
                );
                onOpenChange(false);
            },
            onError: () => toast.error("Partner belum tersimpan. Periksa kolom yang ditandai."),
        };

        form.transform((data) => ({
            ...data,
            ...(partner ? { _method: "put" } : {}),
        }));

        if (partner) {
            form.post(updatePartner.url(partner.id), options);
            return;
        }

        form.post(storePartner.url(), options);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit partner" : "Tambah partner"}</DialogTitle>
                    <DialogDescription>
                        Kelola nama dan logo partner yang tampil di website.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="partner_name">
                            Nama partner{" "}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                        </Label>
                        <Input
                            id="partner_name"
                            value={form.data.name}
                            onChange={(event) => form.setData("name", event.target.value)}
                            placeholder="Contoh: Simetric Consulting Group"
                            maxLength={160}
                            required
                            aria-invalid={Boolean(form.errors.name)}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <ImageUploadField
                            id="partner_image"
                            name="image"
                            label="Logo partner"
                            hint="PNG, JPG, atau WebP · Maksimal 2 MB"
                            currentImage={partner?.imageUrl ?? null}
                            error={form.errors.image}
                            required
                            onFileChange={(file) => form.setData("image", file)}
                        />
                        {!isEditing && !form.data.image && (
                            <p className="text-xs text-muted-foreground">
                                Pilih file logo sebelum menyimpan partner.
                            </p>
                        )}
                    </div>

                    {form.progress && (
                        <div className="grid gap-1" aria-live="polite">
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-[#2547F9] transition-[width]"
                                    style={{ width: `${form.progress.percentage}%` }}
                                />
                            </div>
                            <p className="text-right text-xs text-muted-foreground">
                                Mengunggah {form.progress.percentage}%
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={form.processing}
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing || (!isEditing && !form.data.image)}
                            className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                        >
                            {form.processing
                                ? "Menyimpan…"
                                : isEditing
                                  ? "Simpan perubahan"
                                  : "Simpan partner"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
