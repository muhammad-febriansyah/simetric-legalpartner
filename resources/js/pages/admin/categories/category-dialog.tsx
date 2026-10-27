import { useEffect, type FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import {
    store as storeCategory,
    update as updateCategory,
} from "@/actions/App/Http/Controllers/Admin/ServiceCategoryController";
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

export type CategoryDialogData = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    sortOrder: number;
    isActive: boolean;
    serviceCount: number;
};

type CategoryValues = {
    name: string;
    description: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
};

type CategoryDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: CategoryDialogData | null;
};

const iconOptions = [
    { value: "building", label: "Gedung" },
    { value: "briefcase", label: "Tas kerja" },
    { value: "scale", label: "Neraca hukum" },
    { value: "landmark", label: "Institusi" },
];

function slugify(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
    const isEditing = category !== null;
    const form = useForm<CategoryValues>({
        name: "",
        description: "",
        icon: "building",
        sort_order: 0,
        is_active: true,
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData({
            name: category?.name ?? "",
            description: category?.description ?? "",
            icon: category?.icon ?? "building",
            sort_order: category?.sortOrder ?? 0,
            is_active: category?.isActive ?? true,
        });
        form.clearErrors();
    }, [open, category]);

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditing ? "Kategori berhasil diperbarui." : "Kategori berhasil dibuat.",
                );
                onOpenChange(false);
            },
            onError: () => toast.error("Kategori belum tersimpan. Periksa kolom yang ditandai."),
        };

        if (category) {
            form.put(updateCategory.url(category.id), options);
            return;
        }

        form.post(storeCategory.url(), options);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit kategori" : "Tambah kategori"}</DialogTitle>
                    <DialogDescription>
                        Atur nama, ikon, dan urutan kategori layanan.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="category_name">
                            Nama kategori{" "}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                        </Label>
                        <Input
                            id="category_name"
                            value={form.data.name}
                            onChange={(event) => form.setData("name", event.target.value)}
                            placeholder="Contoh: Pendirian Badan Usaha"
                            maxLength={150}
                            required
                            aria-invalid={Boolean(form.errors.name)}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_slug_preview">Slug URL</Label>
                        <Input
                            id="category_slug_preview"
                            value={slugify(form.data.name)}
                            placeholder="slug-kategori"
                            readOnly
                            aria-describedby="category_slug_help"
                        />
                        <p id="category_slug_help" className="text-xs text-muted-foreground">
                            Dibuat otomatis dari nama kategori.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid content-start gap-2">
                            <Label htmlFor="category_icon">Ikon</Label>
                            <select
                                id="category_icon"
                                value={form.data.icon}
                                onChange={(event) => form.setData("icon", event.target.value)}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                                {iconOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={form.errors.icon} />
                        </div>
                        <div className="grid content-start gap-2">
                            <Label htmlFor="category_sort_order">
                                Urutan tampil{" "}
                                <span className="text-destructive" aria-hidden="true">
                                    *
                                </span>
                            </Label>
                            <Input
                                id="category_sort_order"
                                type="number"
                                min="0"
                                value={form.data.sort_order}
                                onChange={(event) =>
                                    form.setData("sort_order", Number(event.target.value))
                                }
                                placeholder="0"
                                required
                                aria-invalid={Boolean(form.errors.sort_order)}
                            />
                            <InputError message={form.errors.sort_order} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_description">Deskripsi</Label>
                        <textarea
                            id="category_description"
                            value={form.data.description}
                            onChange={(event) => form.setData("description", event.target.value)}
                            rows={3}
                            maxLength={2000}
                            placeholder="Jelaskan layanan yang termasuk dalam kategori ini."
                            aria-invalid={Boolean(form.errors.description)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                        />
                        <InputError message={form.errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_status">
                            Status{" "}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                        </Label>
                        <select
                            id="category_status"
                            value={form.data.is_active ? "1" : "0"}
                            onChange={(event) =>
                                form.setData("is_active", event.target.value === "1")
                            }
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                        <InputError message={form.errors.is_active} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                        >
                            {form.processing
                                ? "Menyimpan…"
                                : isEditing
                                  ? "Simpan perubahan"
                                  : "Simpan kategori"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
