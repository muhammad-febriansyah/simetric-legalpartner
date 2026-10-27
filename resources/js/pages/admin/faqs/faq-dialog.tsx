import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { store as storeFaq, update as updateFaq } from '@/actions/App/Http/Controllers/Admin/FaqController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type FaqServiceOption = { id: number; name: string; slug?: string };
export type FaqDialogData = { id: number; question: string; answer: string; isActive: boolean; sortOrder: number; serviceId: number };

type FaqValues = { question: string; answer: string; is_active: boolean; sort_order: number };

type FaqDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    services: FaqServiceOption[];
    serviceId?: number;
    faq?: FaqDialogData | null;
};

export function FaqDialog({ open, onOpenChange, services, serviceId, faq = null }: FaqDialogProps) {
    const [selectedServiceId, setSelectedServiceId] = useState(String(serviceId ?? ''));
    const form = useForm<FaqValues>({ question: '', answer: '', is_active: true, sort_order: 0 });
    const isEditing = faq !== null;

    useEffect(() => {
        if (!open) {
            return;
        }

        setSelectedServiceId(String(faq?.serviceId ?? serviceId ?? ''));
        form.setData({
            question: faq?.question ?? '',
            answer: faq?.answer ?? '',
            is_active: faq?.isActive ?? true,
            sort_order: faq?.sortOrder ?? 0,
        });
        form.clearErrors();
    }, [open, faq, serviceId]);

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!selectedServiceId) {
            return;
        }

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(isEditing ? 'FAQ berhasil diperbarui.' : 'FAQ berhasil dibuat.');
                onOpenChange(false);
            },
            onError: () => toast.error('FAQ belum tersimpan. Periksa kolom yang ditandai.'),
        };

        if (faq) {
            form.put(updateFaq.url({ service: faq.serviceId, faq: faq.id }), options);
            return;
        }

        form.post(storeFaq.url({ service: Number(selectedServiceId) }), options);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit FAQ' : 'Tambah FAQ'}</DialogTitle>
                    <DialogDescription>Isi pertanyaan dan jawaban yang jelas untuk pengunjung website.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    {!serviceId && !isEditing && (
                        <div className="grid gap-2">
                            <Label htmlFor="faq_service_id">Layanan <span className="text-destructive" aria-hidden="true">*</span></Label>
                            <select id="faq_service_id" value={selectedServiceId} onChange={(event) => setSelectedServiceId(event.target.value)} required className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
                                <option value="" disabled>Pilih layanan</option>
                                {services.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="faq_question">Pertanyaan <span className="text-destructive" aria-hidden="true">*</span></Label>
                        <Input id="faq_question" value={form.data.question} onChange={(event) => form.setData('question', event.target.value)} placeholder="Contoh: Berapa lama proses pendirian PT?" maxLength={1000} required aria-invalid={Boolean(form.errors.question)} />
                        <InputError message={form.errors.question} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="faq_answer">Jawaban <span className="text-destructive" aria-hidden="true">*</span></Label>
                        <textarea id="faq_answer" value={form.data.answer} onChange={(event) => form.setData('answer', event.target.value)} rows={5} maxLength={10000} placeholder="Tuliskan jawaban lengkap dan mudah dipahami." required aria-invalid={Boolean(form.errors.answer)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" />
                        <InputError message={form.errors.answer} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="faq_sort_order">Urutan tampil <span className="text-destructive" aria-hidden="true">*</span></Label>
                            <Input id="faq_sort_order" type="number" min="0" value={form.data.sort_order} onChange={(event) => form.setData('sort_order', Number(event.target.value))} placeholder="0" required aria-invalid={Boolean(form.errors.sort_order)} />
                            <InputError message={form.errors.sort_order} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="faq_is_active">Status <span className="text-destructive" aria-hidden="true">*</span></Label>
                            <select id="faq_is_active" value={form.data.is_active ? '1' : '0'} onChange={(event) => form.setData('is_active', event.target.value === '1')} required aria-invalid={Boolean(form.errors.is_active)} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                            <InputError message={form.errors.is_active} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" disabled={form.processing || (!serviceId && !selectedServiceId)} className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]">
                            {form.processing ? 'Menyimpan…' : isEditing ? 'Simpan perubahan' : 'Simpan FAQ'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
