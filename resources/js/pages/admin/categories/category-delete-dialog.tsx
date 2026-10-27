import { useState } from "react";
import { router } from "@inertiajs/react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { destroy as destroyCategory } from "@/actions/App/Http/Controllers/Admin/ServiceCategoryController";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { CategoryDialogData } from "./category-dialog";

type CategoryDeleteDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: CategoryDialogData | null;
};

export function CategoryDeleteDialog({ open, onOpenChange, category }: CategoryDeleteDialogProps) {
    const [processing, setProcessing] = useState(false);

    function deleteCategory(): void {
        if (!category || processing) {
            return;
        }

        setProcessing(true);
        router.delete(destroyCategory.url(category.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Kategori berhasil dihapus.");
                onOpenChange(false);
            },
            onError: () =>
                toast.error("Kategori gagal dihapus. Pastikan kategori belum dipakai layanan."),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!processing) {
                    onOpenChange(nextOpen);
                }
            }}
        >
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Hapus kategori?</DialogTitle>
                    <DialogDescription>
                        Kategori “{category?.name}” akan dihapus. Kategori yang masih dipakai
                        layanan tidak dapat dihapus.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={processing}
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={!category || processing}
                        onClick={deleteCategory}
                    >
                        {processing ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                        {processing ? "Menghapus…" : "Hapus kategori"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
