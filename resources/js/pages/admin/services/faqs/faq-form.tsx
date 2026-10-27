import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, BriefcaseBusiness, CircleHelp, Save } from 'lucide-react';
import { toast } from 'sonner';
import { create as createFaq, edit as editFaq, index as faqIndex, store as storeFaq, update as updateFaq } from '@/actions/App/Http/Controllers/Admin/FaqController';
import { edit as editService } from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ServiceSummary = { id: number; name: string; slug: string };
export type FaqFormData = { id: number; question: string; answer: string; isActive: boolean; sortOrder: number };

export default function FaqForm({ service, faq }: { service: ServiceSummary; faq: FaqFormData | null }) {
    const isEditing = faq !== null;
    const action = isEditing
        ? updateFaq.url({ service: service.id, faq: faq.id })
        : storeFaq.url({ service: service.id });

    return (
        <>
            <Head title={isEditing ? 'Edit FAQ layanan' : 'Tambah FAQ layanan'} />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Dashboard', href: '/dashboard' },
                        { title: 'Layanan', href: '/admin/services' },
                        { title: service.name, href: editService(service.id) },
                        { title: 'FAQ', href: faqIndex({ service: service.id }) },
                        { title: isEditing ? 'Edit FAQ' : 'Tambah FAQ', href: isEditing ? editFaq({ service: service.id, faq: faq.id }) : createFaq({ service: service.id }) },
                    ]}
                    title={isEditing ? 'Edit FAQ' : 'Tambah FAQ'}
                    description="Tulis jawaban yang membantu calon klien memahami layanan ini."
                />

                <div className="flex flex-col gap-3 rounded-xl border border-[#2547F9]/15 bg-[#2547F9]/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2547F9] shadow-sm"><BriefcaseBusiness className="size-4" /></span>
                        <div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">FAQ untuk layanan</p><p className="truncate text-sm font-semibold">{service.name}</p></div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="shrink-0 bg-white"><Link href={editService(service.id)}>Buka layanan</Link></Button>
                </div>

                <Form
                    action={action}
                    method={isEditing ? 'put' : 'post'}
                    options={{ preserveScroll: true }}
                    className="flex flex-col gap-6"
                    onSuccess={() => toast.success(isEditing ? 'FAQ berhasil diperbarui.' : 'FAQ berhasil dibuat.')}
                    onError={() => toast.error('FAQ belum tersimpan. Periksa kolom yang ditandai.')}
                >
                    {({ processing, errors }) => (
                        <>
                            <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]"><CircleHelp className="size-5" /></span>
                                    <div className="grid gap-1"><h2 className="font-semibold tracking-tight">Informasi FAQ</h2><p className="text-sm leading-5 text-muted-foreground">FAQ aktif akan muncul pada halaman publik layanan.</p></div>
                                </div>
                                <div className="grid gap-4">
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="question">Pertanyaan <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <Input id="question" name="question" defaultValue={faq?.question ?? ''} placeholder="Contoh: Berapa lama proses pendirian PT?" maxLength={1000} required />
                                        <InputError message={errors.question} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="answer">Jawaban <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <textarea id="answer" name="answer" defaultValue={faq?.answer ?? ''} rows={6} maxLength={10000} placeholder="Jelaskan jawaban dengan ringkas dan mudah dipahami." required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" />
                                        <p className="text-xs text-muted-foreground">Hindari janji waktu atau biaya yang belum dikonfirmasi.</p>
                                        <InputError message={errors.answer} />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid content-start gap-2">
                                            <Label htmlFor="sort_order">Urutan tampil <span className="text-destructive" aria-hidden="true">*</span></Label>
                                            <Input id="sort_order" name="sort_order" type="number" min="0" defaultValue={faq?.sortOrder ?? 0} required />
                                            <InputError message={errors.sort_order} />
                                        </div>
                                        <div className="grid content-start gap-2">
                                            <Label htmlFor="is_active">Status <span className="text-destructive" aria-hidden="true">*</span></Label>
                                            <select id="is_active" name="is_active" defaultValue={faq?.isActive === false ? '0' : '1'} required className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
                                                <option value="1">Aktif dan tampil publik</option>
                                                <option value="0">Nonaktif</option>
                                            </select>
                                            <InputError message={errors.is_active} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <Button variant="outline" asChild><Link href={faqIndex({ service: service.id })}><ArrowLeft className="size-4" />Kembali ke FAQ</Link></Button>
                                <Button type="submit" disabled={processing} className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"><Save className="size-4" />{processing ? 'Menyimpan…' : isEditing ? 'Simpan perubahan' : 'Simpan FAQ'}</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
