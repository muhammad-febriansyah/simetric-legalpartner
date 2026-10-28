import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, CircleHelp, FileText, Globe2, Image as ImageIcon, ListChecks, PackageCheck, Save } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { create as createService, index as adminServicesIndex, store as storeService, update as updateService } from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { index as servicePackagesIndex } from '@/actions/App/Http/Controllers/Admin/ServicePackageController';
import { index as serviceFaqsIndex } from '@/actions/App/Http/Controllers/Admin/FaqController';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ServiceCategory = { id: number; name: string };

export type ServiceFormData = {
    id: number;
    categoryId: number;
    name: string;
    slug: string;
    excerpt: string | null;
    description: string;
    heroImage: string | null;
    heroImageAlt: string | null;
    requirementsText: string;
    processStepsText: string;
    durationLabel: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    isFeatured: boolean;
    isActive: boolean;
    sortOrder: number;
};

function SectionHeading({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                <Icon className="size-5" />
            </span>
            <div className="grid gap-1">
                <h2 className="font-semibold tracking-tight">{title}</h2>
                <p className="text-sm leading-5 text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function TextField({
    id,
    label,
    value,
    error,
    placeholder,
    required = false,
    type = 'text',
    inputValue,
    onChange,
}: {
    id: string;
    label: string;
    value?: string | null;
    error?: string;
    placeholder?: string;
    required?: boolean;
    type?: string;
    inputValue?: string;
    onChange?: (value: string) => void;
}) {
    return (
        <div className="grid content-start gap-2">
            <Label htmlFor={id}>
                {label}{required && <span className="text-destructive" aria-hidden="true"> *</span>}
            </Label>
            <Input
                id={id}
                name={id}
                type={type}
                defaultValue={inputValue === undefined ? value ?? '' : undefined}
                value={inputValue}
                onChange={onChange ? (event) => onChange(event.target.value) : undefined}
                placeholder={placeholder}
                required={required}
            />
            <InputError message={error} />
        </div>
    );
}

function TextAreaField({
    id,
    label,
    value,
    error,
    placeholder,
    rows = 4,
    required = false,
}: {
    id: string;
    label: string;
    value?: string | null;
    error?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
}) {
    return (
        <div className="grid content-start gap-2">
            <Label htmlFor={id}>
                {label}{required && <span className="text-destructive" aria-hidden="true"> *</span>}
            </Label>
            <textarea
                id={id}
                name={id}
                defaultValue={value ?? ''}
                placeholder={placeholder}
                rows={rows}
                required={required}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <InputError message={error} />
        </div>
    );
}

export default function ServiceForm({
    service,
    categories,
    packageCount = 0,
    faqCount = 0,
}: {
    service: ServiceFormData | null;
    categories: ServiceCategory[];
    packageCount?: number;
    faqCount?: number;
}) {
    const isEditing = service !== null;
    const action = isEditing ? updateService.url(service.id) : storeService.url();
    const [name, setName] = useState(service?.name ?? '');
    const [slug, setSlug] = useState(service?.slug ?? '');
    const [slugIsManuallyEdited, setSlugIsManuallyEdited] = useState(false);

    function slugify(value: string): string {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function updateName(value: string): void {
        setName(value);

        if (!slugIsManuallyEdited) {
            setSlug(slugify(value));
        }
    }

    return (
        <>
            <Head title={isEditing ? `Edit ${service.name}` : 'Tambah layanan'} />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Dashboard', href: '/dashboard' },
                        { title: 'Layanan', href: adminServicesIndex() },
                        { title: isEditing ? 'Edit layanan' : 'Tambah layanan', href: isEditing ? updateService.url(service.id) : createService.url() },
                    ]}
                    title={isEditing ? 'Edit layanan' : 'Tambah layanan'}
                    description={isEditing ? 'Perbarui informasi dan tampilan layanan untuk pengunjung.' : 'Isi informasi layanan. Kamu bisa melengkapi paket dan FAQ setelah layanan dibuat.'}
                />

                <Form
                    action={action}
                    method={isEditing ? 'put' : 'post'}
                    options={{ preserveScroll: true }}
                    encType="multipart/form-data"
                    className="flex flex-col gap-6"
                    onSuccess={() => toast.success(isEditing ? 'Layanan berhasil diperbarui.' : 'Layanan berhasil dibuat.')}
                    onError={() => toast.error('Layanan belum tersimpan. Periksa kolom yang ditandai.')}
                >
                    {({ processing, errors }) => (
                        <>
                            <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <SectionHeading icon={Globe2} title="Informasi layanan" description="Identitas dan ringkasan yang tampil di halaman katalog." />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <TextField id="name" label="Nama layanan" value={service?.name} inputValue={name} onChange={updateName} error={errors.name} placeholder="Contoh: Pendirian PT" required />
                                    <TextField id="slug" label="Slug URL" inputValue={slug} onChange={(value) => { setSlug(value); setSlugIsManuallyEdited(value.length > 0); }} error={errors.slug} placeholder="pendirian-pt" required />
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="service_category_id">Kategori <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <select
                                            id="service_category_id"
                                            name="service_category_id"
                                            defaultValue={service?.categoryId ?? ''}
                                            required
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                        >
                                            <option value="" disabled>Pilih kategori</option>
                                            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                        </select>
                                        <InputError message={errors.service_category_id} />
                                    </div>
                                    <TextField id="duration_label" label="Estimasi pengerjaan" value={service?.durationLabel} error={errors.duration_label} placeholder="Contoh: 5–7 hari kerja" />
                                    <div className="md:col-span-2">
                                        <TextAreaField id="excerpt" label="Deskripsi singkat" value={service?.excerpt} error={errors.excerpt} placeholder="Ringkasan layanan untuk kartu katalog" rows={3} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <TextAreaField id="description" label="Deskripsi lengkap" value={service?.description} error={errors.description} placeholder="Jelaskan manfaat dan ruang lingkup layanan" rows={6} required />
                                    </div>
                                </div>
                            </section>

                            <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <SectionHeading icon={ListChecks} title="Persyaratan dan proses" description="Satu baris untuk setiap persyaratan dan langkah pengerjaan." />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <TextAreaField id="requirements_text" label="Persyaratan dokumen" value={service?.requirementsText} error={errors.requirements_text} placeholder={'KTP pendiri\nAlamat domisili usaha'} rows={6} />
                                    <TextAreaField id="process_steps_text" label="Langkah pengerjaan" value={service?.processStepsText} error={errors.process_steps_text} placeholder={'Konsultasi awal\nPersiapan dokumen'} rows={6} />
                                </div>
                            </section>

                            <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <SectionHeading icon={ImageIcon} title="Gambar layanan" description="Unggah gambar horizontal dan isi teks alternatif untuk aksesibilitas." />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <ImageUploadField
                                        id="hero_image_file"
                                        name="hero_image_file"
                                        label="Gambar utama"
                                        hint="PNG, JPG, atau WebP · maks. 3 MB"
                                        currentImage={service?.heroImage ?? null}
                                        error={errors.hero_image_file}
                                    />
                                    <TextField id="hero_image_alt" label="Teks alternatif gambar" value={service?.heroImageAlt} error={errors.hero_image_alt} placeholder="Deskripsi singkat gambar" />
                                </div>
                            </section>

                            <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <SectionHeading icon={FileText} title="SEO dan publikasi" description="Atur metadata dan visibilitas layanan pada website." />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="md:col-span-2"><TextField id="meta_title" label="Judul SEO" value={service?.metaTitle} error={errors.meta_title} placeholder="Nama layanan — LegalPartner.ID" /></div>
                                    <div className="md:col-span-2"><TextAreaField id="meta_description" label="Deskripsi SEO" value={service?.metaDescription} error={errors.meta_description} placeholder="Ringkasan halaman untuk hasil pencarian" rows={3} /></div>
                                    <TextField id="sort_order" label="Urutan tampil" value={service?.sortOrder.toString() ?? '0'} error={errors.sort_order} placeholder="0" type="number" required />
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="is_active">Status <span className="text-destructive" aria-hidden="true">*</span></Label>
                                        <select id="is_active" name="is_active" defaultValue={service?.isActive === false ? '0' : '1'} required className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
                                            <option value="1">Aktif dan tampil publik</option>
                                            <option value="0">Nonaktif</option>
                                        </select>
                                        <InputError message={errors.is_active} />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                                        <input type="hidden" name="is_featured" value="0" />
                                        <input id="is_featured" name="is_featured" type="checkbox" value="1" defaultChecked={service?.isFeatured ?? false} className="size-4 rounded border-input accent-[#2547F9]" />
                                        <Label htmlFor="is_featured">Tandai sebagai layanan unggulan</Label>
                                        <InputError message={errors.is_featured} />
                                    </div>
                                </div>
                            </section>

                            {service && (
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <SectionHeading icon={PackageCheck} title="Paket harga" description={`${packageCount} paket terhubung ke layanan ini.`} />
                                        <Button variant="outline" asChild>
                                            <Link href={servicePackagesIndex({ service: service.id })}>Kelola paket</Link>
                                        </Button>
                                    </div>
                                </section>
                            )}

                            {service && (
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <SectionHeading icon={CircleHelp} title="FAQ layanan" description={`${faqCount} pertanyaan terhubung ke layanan ini.`} />
                                        <Button variant="outline" asChild>
                                            <Link href={serviceFaqsIndex({ service: service.id })}>Kelola FAQ</Link>
                                        </Button>
                                    </div>
                                </section>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" asChild>
                                        <Link href={adminServicesIndex()}><ArrowLeft className="mr-2 size-4" />Kembali ke layanan</Link>
                                    </Button>
                                    {service && (
                                        <Button variant="ghost" asChild>
                                            <a href={`/layanan/${service.slug}`} target="_blank" rel="noreferrer">Preview publik</a>
                                        </Button>
                                    )}
                                </div>
                                <Button type="submit" disabled={processing} className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]">
                                    <Save className="mr-2 size-4" />
                                    {processing ? 'Menyimpan…' : isEditing ? 'Simpan perubahan' : 'Simpan layanan'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
