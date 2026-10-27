import { useState } from "react";
import { router } from "@inertiajs/react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { destroy as destroyFaq } from "@/actions/App/Http/Controllers/Admin/FaqController";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { FaqDialogData } from "./faq-dialog";

type FaqDeleteDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq: FaqDialogData | null;
};

export function FaqDeleteDialog({ open, onOpenChange, faq }: FaqDeleteDialogProps) {
    const [processing, setProcessing] = useState(false);

    function deleteFaq(): void {
        if (!faq || processing) {
            return;
        }

        setProcessing(true);
        router.delete(destroyFaq.url({ service: faq.serviceId, faq: faq.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("FAQ berhasil dihapus.");
                onOpenChange(false);
            },
            onError: () => toast.error("FAQ gagal dihapus."),
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
                    <DialogTitle>Hapus FAQ?</DialogTitle>
                    <DialogDescription>
                        FAQ “{faq?.question}” akan dihapus. Tindakan ini tidak dapat dibatalkan.
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
                        disabled={!faq || processing}
                        onClick={deleteFaq}
                    >
                        {processing ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                        {processing ? "Menghapus…" : "Hapus FAQ"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
