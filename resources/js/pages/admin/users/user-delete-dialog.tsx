import { useState } from "react";
import { router } from "@inertiajs/react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { destroy as destroyUser } from "@/actions/App/Http/Controllers/Admin/UserController";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { AdminUserData } from "./user-dialog";

type UserDeleteDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUserData | null;
};

export function UserDeleteDialog({ open, onOpenChange, user }: UserDeleteDialogProps) {
    const [processing, setProcessing] = useState(false);

    function deleteUser(): void {
        if (!user || user.isCurrentUser || processing) {
            return;
        }

        setProcessing(true);
        router.delete(destroyUser.url(user.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Pengguna berhasil dihapus.");
                onOpenChange(false);
            },
            onError: () => toast.error("Pengguna gagal dihapus."),
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
                    <DialogTitle>Hapus pengguna?</DialogTitle>
                    <DialogDescription>
                        Akun {user?.name} ({user?.email}) akan dihapus. Tindakan ini tidak dapat
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
                        disabled={!user || user.isCurrentUser || processing}
                        onClick={deleteUser}
                    >
                        {processing ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                        {processing ? "Menghapus…" : "Hapus pengguna"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
