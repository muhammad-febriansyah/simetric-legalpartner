import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, BriefcaseBusiness, PackageCheck, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { create as createPackage, edit as editPackage, index as packagesIndex, store as storePackage, update as updatePackage } from '@/actions/App/Http/Controllers/Admin/ServicePackageController';
import { edit as editService } from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ServiceSummary = { id: number; name: string; slug: string };
export type ServicePackageFormData = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number | null;
    priceLabel: string | null;
    featuresText: string;
    isPopular: boolean;
    isActive: boolean;
    sortOrder: number;
};

function slugify(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function ServicePackageForm({
    service,
    package: servicePackage,
}: {
    service: ServiceSummary;
    package: ServicePackageFormData | null;
}) {
    const isEditing = servicePackage !== null;
    const action = isEditing
        ? updatePackage.url({ service: service.id, package: servicePackage.slug })
        : storePackage.url({ service: service.id });
    const [name, setName] = useState(servicePackage?.name ?? '');
    const [slug, setSlug] = useState(servicePackage?.slug ?? '');
    const [slugIsManuallyEdited, setSlugIsManuallyEdited] = useState(false);
    const [price, setPrice] = useState(servicePackage?.price?.toString() ?? '');
    const [priceLabel, setPriceLabel] = useState(servicePackage?.priceLabel ?? '');

    function updateName(value: string): void {
        setName(value);

        if (!slugIsManuallyEdited) {
            setSlug(slugify(value));
        }
    }

    return (
        <>
            <Head title={isEditing ? `Edit paket ${servicePackage.name}` : `Tambah paket ${service.name}`} />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Dashboard', href: '/dashboard' },
                        { title: 'Layanan', href: '/admin/services' },
                        { title: service.name, href: editService(service.id) },
                        { title: 'Paket harga', href: packagesIndex({ service: service.id }) },
                        { title: isEditing ? 'Edit paket' : 'Tambah paket', href: isEditing ? editPackage({ service: service.id, package: servicePackage.slug }) : createPackage({ service: service.id }) },
                    ]}
                    title={isEditing ? 'Edit paket harga' : 'Tambah paket harga'}
                    description="Atur harga dan fasilitas untuk satu layanan."
                />

                <div className="flex flex-col gap-3 rounded-xl border border-[#2547F9]/15 bg-[#2547F9]/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#2547F9] shadow-sm"><BriefcaseBusiness className="size-4" /></span>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Layanan induk</p>
                            <p className="truncate text-sm font-semibold">{service.name}<span className="ml-2 font-normal text-muted-foreground">/{service.slug}</span></p>
                        </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="shrink-0 bg-white">
                        <Link href={editService(service.id)}>Buka layanan</Link>
                    </Button>
                </div>

                <Form
                    action={action}
                    method={isEditing ? 'put' : 'post'}
                    options={{ preserveScroll: true }}
                    className="flex flex-col gap-6"
                    onSuccess={() => toast.success(isEditing ? 'Paket berhasil diperbarui.' : 'Paket berhasil dibuat.')}
                    onError={() => toast.error('Paket belum tersimpan. Periksa kolom yang ditandai.')}
                >
                    {({ processing, errors }) => (
                        <>
                            <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]"><PackageCheck className="size-5" /></span>
                                    <div className="grid gap-1"><h2 className="font-semibold tracking-tight">Informasi paket</h2><p className="text-sm leading-5 text-muted-foreground">Data paket akan tampil pada halaman publik layanan.</p></div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="name">Nama paket <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <Input id="name" name="name" value={name} onChange={(event) => updateName(event.target.value)} placeholder="Contoh: Paket Profesional" required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="slug">Slug URL <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <Input id="slug" name="slug" value={slug} onChange={(event) => { setSlug(event.target.value); setSlugIsManuallyEdited(event.target.value.length > 0); }} placeholder="paket-profesional" required />
                                        <p className="text-xs text-muted-foreground">Slug terisi otomatis dari nama dan bisa diubah.</p>
                                        <InputError message={errors.slug} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="price">Harga paket{!priceLabel.trim() && <span className="text-destructive" aria-hidden="true"> *</span>}</Label>
                                        <Input id="price" name="price" type="number" min="0" step="1000" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="3500000" required={!priceLabel.trim()} />
                                        <p className="text-xs text-muted-foreground">Isi harga angka atau label harga. Contoh simulasi gunakan angka realistis.</p>
                                        <InputError message={errors.price} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="price_label">Label harga alternatif{!price.trim() && <span className="text-destructive" aria-hidden="true"> *</span>}</Label>
                                        <Input id="price_label" name="price_label" value={priceLabel} onChange={(event) => setPriceLabel(event.target.value)} placeholder="Konsultasikan" required={!price.trim()} />
                                        <p className="text-xs text-muted-foreground">Contoh: Konsultasikan, Mulai dari, atau Hubungi kami.</p>
                                        <InputError message={errors.price_label} />
                                    </div>
                                    <div className="grid content-start gap-2 md:col-span-2">
                                        <Label htmlFor="description">Deskripsi paket</Label>
                                        <textarea id="description" name="description" defaultValue={servicePackage?.description ?? ''} rows={3} placeholder="Ringkasan cakupan paket" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" />
                                        <InputError message={errors.description} />
                                    </div>
                                    <div className="grid content-start gap-2 md:col-span-2">
                                        <Label htmlFor="features_text">Fasilitas paket <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <textarea id="features_text" name="features_text" defaultValue={servicePackage?.featuresText ?? ''} rows={6} placeholder={'Konsultasi kebutuhan awal\nPendampingan persiapan dokumen\nChecklist proses layanan'} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" />
                                        <p className="text-xs text-muted-foreground">Masukkan satu fasilitas pada setiap baris.</p>
                                        <InputError message={errors.features_text} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="sort_order">Urutan tampil <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <Input id="sort_order" name="sort_order" type="number" min="0" defaultValue={servicePackage?.sortOrder ?? 0} required />
                                        <InputError message={errors.sort_order} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="is_active">Status <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <select id="is_active" name="is_active" defaultValue={servicePackage?.isActive === false ? '0' : '1'} required className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
                                            <option value="1">Aktif dan tampil publik</option>
                                            <option value="0">Nonaktif</option>
                                        </select>
                                        <InputError message={errors.is_active} />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                                        <input type="hidden" name="is_popular" value="0" />
                                        <input id="is_popular" name="is_popular" type="checkbox" value="1" defaultChecked={servicePackage?.isPopular ?? false} className="size-4 rounded border-input accent-[#2547F9]" />
                                        <Label htmlFor="is_popular">Tandai sebagai paket populer</Label>
                                        <InputError message={errors.is_popular} />
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <Button variant="outline" asChild><Link href={packagesIndex({ service: service.id })}><ArrowLeft className="size-4" />Kembali ke paket</Link></Button>
                                <Button type="submit" disabled={processing} className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"><Save className="size-4" />{processing ? 'Menyimpan…' : isEditing ? 'Simpan perubahan' : 'Simpan paket'}</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

