import { useState } from "react";
import { router } from "@inertiajs/react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { destroy as destroyPartner } from "@/actions/App/Http/Controllers/Admin/PartnerController";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { PartnerData } from "./partner-dialog";

type PartnerDeleteDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partner: PartnerData | null;
};

export function PartnerDeleteDialog({ open, onOpenChange, partner }: PartnerDeleteDialogProps) {
    const [processing, setProcessing] = useState(false);

    function deletePartner(): void {
        if (!partner || processing) {
            return;
        }

        setProcessing(true);
        router.delete(destroyPartner.url(partner.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Partner berhasil dihapus.");
                onOpenChange(false);
            },
            onError: () => toast.error("Partner gagal dihapus."),
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
                    <DialogTitle>Hapus partner?</DialogTitle>
                    <DialogDescription>
                        Partner {partner?.name} dan file logonya akan dihapus. Tindakan ini tidak
                        dapat dibatalkan.
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
                        disabled={!partner || processing}
                        onClick={deletePartner}
                    >
                        {processing ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                        {processing ? "Menghapus…" : "Hapus partner"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
