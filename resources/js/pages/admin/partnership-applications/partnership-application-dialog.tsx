import { useEffect, type FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { update as updateApplication } from "@/actions/App/Http/Controllers/Admin/PartnershipApplicationController";
import InputError from "@/components/input-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { PartnershipApplicationData } from "./index";

type ApplicationValues = {
    status: string;
    admin_notes: string;
};

type PartnershipApplicationDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    application: PartnershipApplicationData | null;
    statuses: string[];
    statusLabels: Record<string, string>;
};

export function PartnershipApplicationDialog({
    open,
    onOpenChange,
    application,
    statuses,
    statusLabels,
}: PartnershipApplicationDialogProps) {
    const form = useForm<ApplicationValues>({ status: "new", admin_notes: "" });

    useEffect(() => {
        if (!open || !application) return;
        form.setData({ status: application.status, admin_notes: application.adminNotes ?? "" });
        form.clearErrors();
    }, [open, application]);

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (!application) return;

        form.put(updateApplication.url(application.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Tindak lanjut pendaftar tersimpan.");
                onOpenChange(false);
            },
            onError: () => toast.error("Perubahan belum tersimpan. Periksa kolom yang ditandai."),
        });
    }

    if (!application) return null;

    const whatsappNumber = application.whatsapp.replace(/\D/g, "").replace(/^0/, "62");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-7">
                        <div>
                            <DialogTitle>{application.fullName}</DialogTitle>
                            <DialogDescription className="mt-1">
                                Detail pendaftaran dan catatan tindak lanjut.
                            </DialogDescription>
                        </div>
                        <Badge
                            variant="secondary"
                            className="shrink-0 bg-[#2547F9]/[0.08] text-[#2547F9]"
                        >
                            {application.typeLabel}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="grid gap-4 rounded-xl bg-[#F7F8FD] p-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            WhatsApp
                        </p>
                        <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex text-sm font-medium text-[#2547F9] hover:underline"
                        >
                            {application.whatsapp}
                        </a>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Email
                        </p>
                        {application.email ? (
                            <a
                                href={`mailto:${application.email}`}
                                className="mt-1 inline-flex break-all text-sm font-medium text-[#2547F9] hover:underline"
                            >
                                {application.email}
                            </a>
                        ) : (
                            <p className="mt-1 text-sm text-slate-500">Tidak diberikan</p>
                        )}
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Pesan / profil singkat
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {application.message || "Tidak ada pesan tambahan."}
                        </p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Tanggal masuk
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                            {formatDate(application.createdAt)}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="application_status">
                            Status pendaftaran{" "}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                        </Label>
                        <select
                            id="application_status"
                            value={form.data.status}
                            onChange={(event) => form.setData("status", event.target.value)}
                            required
                            aria-invalid={Boolean(form.errors.status)}
                            className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {statusLabels[status] ?? status}
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.status} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="application_notes">
                            Catatan internal{" "}
                            <span className="font-normal text-muted-foreground">(opsional)</span>
                        </Label>
                        <textarea
                            id="application_notes"
                            value={form.data.admin_notes}
                            onChange={(event) => form.setData("admin_notes", event.target.value)}
                            rows={4}
                            maxLength={5000}
                            placeholder="Catat hasil kontak, kebutuhan dokumen, atau langkah berikutnya."
                            aria-invalid={Boolean(form.errors.admin_notes)}
                            className="w-full resize-y rounded-md border border-input bg-white px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                        />
                        <InputError message={form.errors.admin_notes} />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={form.processing}
                            onClick={() => onOpenChange(false)}
                        >
                            Tutup
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                        >
                            {form.processing ? "Menyimpan…" : "Simpan tindak lanjut"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function formatDate(date: string | null): string {
    if (!date) return "—";
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(
        new Date(date),
    );
}
