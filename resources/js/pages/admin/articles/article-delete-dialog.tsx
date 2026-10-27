import { useState } from "react";
import { router } from "@inertiajs/react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { destroy as destroyArticle } from "@/actions/App/Http/Controllers/Admin/ArticleController";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type ArticleDeleteDialogProps = {
    article: { id: number; title: string } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ArticleDeleteDialog({ article, open, onOpenChange }: ArticleDeleteDialogProps) {
    const [processing, setProcessing] = useState(false);

    function deleteArticle(): void {
        if (!article || processing) {
            return;
        }

        setProcessing(true);
        router.delete(destroyArticle.url(article.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Artikel berhasil dihapus.");
                onOpenChange(false);
            },
            onError: () => toast.error("Artikel gagal dihapus."),
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus artikel?</DialogTitle>
                    <DialogDescription>
                        Artikel “{article?.title}” akan dihapus. Tindakan ini tidak dapat
                        dibatalkan.
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
                        disabled={!article || processing}
                        onClick={deleteArticle}
                    >
                        {processing ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                        {processing ? "Menghapus…" : "Hapus artikel"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
